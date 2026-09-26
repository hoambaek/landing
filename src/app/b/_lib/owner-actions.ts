"use server";

/**
 * 소유자 인증 서버 액션.
 * - OTP: 등록 이메일로 6자리 코드 발송 → 검증 시 서명 세션 쿠키 발급.
 * - 이름 수정은 유효 세션이 있어야만 실행(서버에서 재확인).
 * - 소유자를 바꾸는 경로는 없다. 이메일 변경·소유권 이전 모두 코드로 처리하지 않는다.
 */

import { timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend, FROM_EMAIL, isResendConfigured } from "@/lib/resend/client";
import { mailShell } from "@/lib/resend/shell";
import { MAIL_BASE_URL, MAIL_COLOR as MC, MAIL_FONT as MF } from "@/lib/resend/theme";
import { maskEmail, fetchBottleIdentity, fetchAgingBatch } from "./data";
import { PRODUCT_META } from "./copy";
import {
  genOtp,
  hashCode,
  setOwnerSession,
  getOwnerSession,
  clearOwnerSession,
} from "./owner-auth";

const NFC_RE = /^[A-Za-z0-9]{4,12}$/;

type Result = { ok: boolean; error?: string };

async function currentOwnerEmail(nfc: string): Promise<string | null> {
  if (!supabaseAdmin) return null;
  const { data } = await supabaseAdmin
    .from("bottle_registrations")
    .select("email")
    .eq("nfc_code", nfc)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.email ?? null;
}

async function audit(nfc: string, event: string, actorEmail: string | null, detail?: unknown) {
  if (!supabaseAdmin) return;
  await supabaseAdmin.from("bottle_ownership_audit").insert({
    nfc_code: nfc,
    event,
    actor_email: actorEmail,
    detail: detail ?? null,
  });
}

async function sendMail(to: string, subject: string, html: string) {
  if (!isResendConfigured() || !resend) {
    console.warn("[owner] Resend 미설정 — 메일 발송 건너뜀");
    return;
  }
  try {
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  } catch (e) {
    console.error("[owner] mail send error:", e instanceof Error ? e.message : e);
  }
}

/* 메일 껍데기 — ApplicantEmail(신청 확인 메일)과 같은 종이·같은 토큰을 쓴다.
   같은 브랜드가 보내는 메일이 하나는 검고 하나는 밝으면 다른 곳에서 온 것으로 읽힌다.
   2026-09 라이트 v3(Paper NFC "03B-M — 확인 코드 메일")로 옮기며 마크업은 src/lib/resend/shell.ts로 뺐다 —
   토큰(theme.ts)을 신청 확인 메일과 한 벌로 쓰기 위해서다. inner에는 카드 안의 <tr> 행을 넘긴다. */
function shell(inner: string, preheader?: string): string {
  return mailShell({ inner, preheader, locale: "ko" });
}

/* ── OTP ─────────────────────────────────────────── */
export async function requestOwnerOtp(nfc: string): Promise<Result & { emailMasked?: string }> {
  if (!supabaseAdmin || !NFC_RE.test(nfc)) return { ok: false, error: "잘못된 요청입니다." };
  const email = await currentOwnerEmail(nfc);
  if (!email) return { ok: false, error: "등록된 소유자가 없습니다." };

  // 레이트 리밋 — 최근 10분 내 5회 초과 요청 차단
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from("bottle_owner_verifications")
    .select("id", { count: "exact", head: true })
    .eq("nfc_code", nfc)
    .gte("created_at", since);
  if ((count ?? 0) >= 5) return { ok: false, error: "잠시 후 다시 시도해 주세요." };

  const code = genOtp();
  const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const { error } = await supabaseAdmin.from("bottle_owner_verifications").insert({
    nfc_code: nfc,
    email,
    code_hash: hashCode(nfc, code),
    purpose: "owner_auth",
    expires_at: expires,
  });
  if (error) return { ok: false, error: "잠시 후 다시 시도해 주세요." };

  /* 메일이 개체를 번호로 부른다(개체 지칭 규칙) — 번호·퀴베·입수 연도는 DB에서 읽은 값만 쓴다.
     번호가 없으면 그 절을 통째로 뺀다. 연도는 입수 배치가 있을 때만 붙인다(현재 연도로 채우지 않는다).
     퀴베 이름에 이미 연도가 들어 있으면(2025 First Edition) 연도를 또 붙이지 않는다. */
  const identity = await fetchBottleIdentity(nfc);
  const serial = identity?.serial ?? null;
  const cuvee = identity ? PRODUCT_META[identity.productId]?.name ?? null : null;
  const immersion = identity && cuvee ? (await fetchAgingBatch(identity.productId)).immersion : null;
  const year = cuvee && !/\b\d{4}\b/.test(cuvee) ? immersion?.slice(0, 4) ?? null : null;
  const bottleLabel =
    serial != null ? [`N° ${serial}`, cuvee ? [cuvee, year].filter(Boolean).join(" ") : null].filter(Boolean).join(" · ") : null;
  const lead = bottleLabel
    ? `${bottleLabel}의 소유 정보를 열려면<br />아래 버튼을 눌러 주세요.`
    : "소유 정보를 열려면 아래 버튼을 눌러 주세요.";
  const preheader =
    serial != null
      ? `N° ${serial}의 소유 정보를 여는 링크입니다. 5분 동안 유효합니다.`
      : "소유 정보를 여는 링크입니다. 5분 동안 유효합니다.";
  /* 확인 링크가 주인공이다(Paper "03B-M", 2026-09-26 대표 지시) — 누르면 인증 화면이 스스로
     인증을 마치고 소유 관리를 연다. 링크를 GET으로 미리 여는 메일 보안 검사기는 인증을 소모하지 못한다
     (인증은 화면이 뜬 뒤 서버 액션 POST로 한다). 주소의 코드는 화면이 곧바로 지운다. */
  const verifyUrl = `${MAIL_BASE_URL}/b/${nfc}/owner?otp=${code}`;
  /* 코드는 보조다 — 메일을 다른 기기(PC)에서 보는 사람이 NFC를 태그한 휴대폰에 옮겨 적는다.
     3+3 끊음은 공백 문자가 아니라 여백으로 낸다: 공백이 있으면 길게 누르기·두 번 탭이 세 자리만 잡는다.
     user-select:all은 지원하는 클라이언트(Apple Mail 등)에서 한 번 눌러 전체를 잡게 한다 */
  const codeShown = `<span>${code.slice(0, 3)}</span><span style="padding-left:.36em">${code.slice(3)}</span>`;
  const hair = (w: number, top: number) =>
    `<div style="width:${w}px;height:0;margin:${top}px auto 0;border-top:0.5px solid ${MC.gold};font-size:0;line-height:0">&nbsp;</div>`;

  /* 제목 형식은 다른 발송 메일과 맞춘다("... | Muse de Marée").
     대괄호 말머리는 이 브랜드가 쓰지 않는 어법이다. */
  await sendMail(
    email,
    "소유자 확인 링크 | Muse de Marée",
    shell(
      `<tr>
          <td class="m-pad" align="center" style="padding:48px 48px 0;text-align:center">
            <div style="font-family:${MF.latin};font-size:12px;font-weight:500;letter-spacing:.34em;line-height:16px;color:${MC.goldText};text-transform:uppercase">VERIFICATION · 본인 인증</div>
            <div style="margin-top:14px;font-family:${MF.serifKo};font-size:28px;font-weight:300;line-height:38px;color:${MC.ink};word-break:keep-all">소유자 본인 인증</div>
            <div class="m-lead" style="margin-top:14px;font-family:${MF.serifKo};font-size:15px;font-weight:300;line-height:26px;color:${MC.body};word-break:keep-all">${lead}</div>
          </td>
        </tr>
        <tr>
          <td class="m-pad" align="center" style="padding:28px 40px 0;text-align:center">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto">
              <tr><td align="center" bgcolor="${MC.ink}" style="background:${MC.ink}">
                <a href="${verifyUrl}" target="_blank" style="display:inline-block;width:280px;padding:16px 0;font-family:${MF.sans};font-size:14px;letter-spacing:.06em;line-height:18px;color:${MC.paper};text-decoration:none;text-align:center">본인 인증하기&nbsp;&nbsp;<span style="color:${MC.gold}">›</span></a>
              </td></tr>
            </table>
            <div style="margin-top:12px;font-family:${MF.serifKo};font-size:12px;font-weight:300;line-height:18px;color:${MC.muted}">5분 동안 유효합니다</div>
          </td>
        </tr>
        <tr>
          <td class="m-pad" align="center" style="padding:32px 40px 0">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="360" style="width:100%;max-width:360px;background:${MC.paperLight}">
              <tr><td style="padding:6px">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid ${MC.gold}">
                  <tr><td style="padding:3px">
                    <!-- 안쪽 테는 시안의 #A8834A 55%를 코드 판(#FBF8F2) 위에 미리 섞은 값이다(Outlook이 rgba 테두리를 못 읽는다) -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:0.5px solid #CDB896">
                      <tr><td align="center" style="padding:18px 12px 16px;text-align:center">
                        <div style="font-family:${MF.serifKo};font-size:13px;font-weight:300;line-height:18px;color:${MC.body}">다른 기기에서 보고 계시면</div>
                        <div style="margin-top:8px;padding-left:.28em;font-family:${MF.numeral};font-feature-settings:'lnum';font-variant-numeric:lining-nums;font-size:30px;font-weight:300;letter-spacing:.28em;line-height:36px;color:${MC.ink};white-space:nowrap;-webkit-user-select:all;user-select:all">${codeShown}</div>
                        <div style="margin-top:8px;font-family:${MF.serifKo};font-size:13px;font-weight:300;line-height:18px;color:${MC.body}">이 코드를 입력해 주세요</div>
                      </td></tr>
                    </table>
                  </td></tr>
                </table>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="m-pad" align="center" style="padding:36px 56px 52px;text-align:center">
            ${hair(24, 0)}
            <div style="margin-top:24px;font-family:${MF.serifKo};font-size:13px;font-weight:300;line-height:23px;color:${MC.body};word-break:keep-all">요청하신 적이 없다면 이 메일은 그냥 두셔도 됩니다.<br />버튼을 누르지 않으면 아무것도 바뀌지 않습니다.<br />뮤즈드마레는 전화나 메시지로 이 코드를 묻지 않습니다.</div>
          </td>
        </tr>`,
      preheader
    )
  );
  return { ok: true, emailMasked: maskEmail(email) };
}

export async function verifyOwnerOtp(nfc: string, codeInput: string): Promise<Result> {
  if (!supabaseAdmin || !NFC_RE.test(nfc)) return { ok: false, error: "잘못된 요청입니다." };
  const code = (codeInput ?? "").trim();
  if (!/^\d{6}$/.test(code)) return { ok: false, error: "6자리 코드를 입력해 주세요." };

  const { data } = await supabaseAdmin
    .from("bottle_owner_verifications")
    .select("id, email, code_hash, attempts")
    .eq("nfc_code", nfc)
    .eq("purpose", "owner_auth")
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return { ok: false, error: "코드가 만료되었어요. 다시 요청해 주세요." };
  if (data.attempts >= 5) return { ok: false, error: "시도 횟수를 초과했어요. 다시 요청해 주세요." };

  const expected = Buffer.from(data.code_hash);
  const actual = Buffer.from(hashCode(nfc, code));
  const match = expected.length === actual.length && timingSafeEqual(expected, actual);
  if (!match) {
    await supabaseAdmin
      .from("bottle_owner_verifications")
      .update({ attempts: data.attempts + 1 })
      .eq("id", data.id);
    return { ok: false, error: "코드가 일치하지 않아요." };
  }

  await supabaseAdmin
    .from("bottle_owner_verifications")
    .update({ consumed_at: new Date().toISOString() })
    .eq("id", data.id);
  await setOwnerSession(nfc, data.email);
  await audit(nfc, "verify", data.email);
  return { ok: true };
}

export async function signOutOwner(nfc: string): Promise<Result> {
  if (!NFC_RE.test(nfc)) return { ok: false };
  await clearOwnerSession(nfc);
  return { ok: true };
}

/* ── 이름 수정 ────────────────────────────────────── */
/**
 * 이름만 고칠 수 있다. 이메일은 여기서 바꾸지 않는다.
 *
 * 소유권 모델이 "bottle_registrations 최신 행 = 현 소유자"라서, 이메일을 바꾸면
 * 그 순간 OTP를 받는 사람이 달라진다 — 받는 쪽 동의도 기록도 없는 소유권 이전이 된다.
 * 이메일은 본인 인증의 근거지 편집 대상이 아니다. 변경은 문의로만.
 *
 * 이름은 등록자가 "인증서에 새길 이름"으로 직접 정한 값이라 오타 수정 수요가 실제로 있고,
 * 바뀌어도 인증 주체가 달라지지 않는다.
 */
/* 로마자 표기(인증서 서명체) — 등록 시점과 같은 정규화(첫 글자만 대문자, src/lib/forms.ts
   capitalizeFirst와 같은 규칙)로 저장한다. 이름 수정 화면(Paper 03C)이 세 칸을 함께 고친다. */
function capFirst(v: string): string {
  return v ? v.charAt(0).toUpperCase() + v.slice(1) : v;
}

export async function updateOwnerName(
  nfc: string,
  name: string,
  latin?: { given: string; family: string },
): Promise<Result> {
  if (!supabaseAdmin || !NFC_RE.test(nfc)) return { ok: false, error: "잘못된 요청입니다." };
  const session = await getOwnerSession(nfc);
  if (!session) return { ok: false, error: "본인 인증이 필요합니다." };

  const n = (name ?? "").trim();
  if (!n) return { ok: false, error: "이름을 입력해 주세요." };
  if (n.length > 60) return { ok: false, error: "이름이 너무 깁니다." };
  /* 로마자는 넘어왔을 때만 고친다(옛 호출은 이름만 보낸다). 넘어왔으면 둘 다 있어야 한다 —
     한쪽만 비면 인증서가 성이나 이름 하나로 선다. */
  const given = latin ? capFirst((latin.given ?? "").trim()) : null;
  const family = latin ? capFirst((latin.family ?? "").trim()) : null;
  if (latin && (!given || !family)) return { ok: false, error: "영문 이름과 성을 입력해 주세요." };
  if ((given?.length ?? 0) > 40 || (family?.length ?? 0) > 40) return { ok: false, error: "이름이 너무 깁니다." };

  /* 세션 이메일로 행을 특정한다. 최신 행만 집으면 그 사이 소유자가 바뀌었을 때
     인증한 사람과 다른 행을 고치게 된다. */
  const { data: latest } = await supabaseAdmin
    .from("bottle_registrations")
    .select("id, name, email, given_name_latin, family_name_latin")
    .eq("nfc_code", nfc)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!latest) return { ok: false, error: "소유 기록을 찾을 수 없습니다." };
  if ((latest.email ?? "").toLowerCase() !== session.email.toLowerCase()) {
    return { ok: false, error: "본인 인증이 필요합니다." };
  }

  const { error } = await supabaseAdmin
    .from("bottle_registrations")
    .update(latin ? { name: n, given_name_latin: given, family_name_latin: family } : { name: n })
    .eq("id", latest.id);
  if (error) return { ok: false, error: "저장 중 문제가 발생했습니다." };

  await audit(
    nfc,
    "edit_name",
    session.email,
    latin
      ? {
          from: { name: latest.name, given: latest.given_name_latin, family: latest.family_name_latin },
          to: { name: n, given, family },
        }
      : { from: latest.name, to: n },
  );
  return { ok: true };
}
