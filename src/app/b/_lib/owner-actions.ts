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
import { maskEmail } from "./data";
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
   색은 브랜드 정본값(ink #312E2A, brass-muted 계열 #8C6B33). */
function shell(inner: string): string {
  return `<div style="background:#DDD8D2;padding:40px 20px;font-family:'Noto Sans KR',-apple-system,'Apple SD Gothic Neo',sans-serif">
    <div style="width:100%;max-width:520px;margin:0 auto;background:#C4BFBB">
      <div style="padding:46px 40px 48px">
        <div style="font-family:'IBM Plex Mono','Courier New',monospace;font-size:12px;letter-spacing:.22em;color:#8C6B33;margin-bottom:20px">OCEAN CELLAR™</div>
        ${inner}
      </div>
      <div style="padding:30px 40px 32px;background:#14110F;text-align:center">
        <div style="font-size:12px;line-height:19px;color:rgba(242,239,233,.55)">바다의 시간을 기록합니다</div>
      </div>
    </div>
  </div>`;
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

  /* 제목 형식은 다른 발송 메일과 맞춘다("... | Muse de Marée").
     대괄호 말머리는 이 브랜드가 쓰지 않는 어법이다. */
  await sendMail(
    email,
    "소유자 확인 코드 | Muse de Marée",
    shell(
      `<div style="font-family:'Cormorant Garamond',Georgia,'Times New Roman',serif;font-size:32px;font-weight:300;line-height:40px;letter-spacing:-0.01em;color:#312E2A;margin-bottom:24px">소유자 확인 코드</div>
       <div style="font-family:'IBM Plex Mono','Courier New',monospace;font-size:38px;letter-spacing:.3em;color:#312E2A">${code}</div>
       <hr style="width:36px;margin:30px 0 22px;border:none;border-top:1px solid #8C6B33" />
       <div style="font-size:16px;line-height:28px;color:#4A453F;word-break:keep-all">5분 동안 유효합니다.<br />요청하지 않으셨다면 이 메일은 그냥 두셔도 됩니다.</div>`
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
export async function updateOwnerName(nfc: string, name: string): Promise<Result> {
  if (!supabaseAdmin || !NFC_RE.test(nfc)) return { ok: false, error: "잘못된 요청입니다." };
  const session = await getOwnerSession(nfc);
  if (!session) return { ok: false, error: "본인 인증이 필요합니다." };

  const n = (name ?? "").trim();
  if (!n) return { ok: false, error: "이름을 입력해 주세요." };
  if (n.length > 60) return { ok: false, error: "이름이 너무 깁니다." };

  /* 세션 이메일로 행을 특정한다. 최신 행만 집으면 그 사이 소유자가 바뀌었을 때
     인증한 사람과 다른 행을 고치게 된다. */
  const { data: latest } = await supabaseAdmin
    .from("bottle_registrations")
    .select("id, name, email")
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
    .update({ name: n })
    .eq("id", latest.id);
  if (error) return { ok: false, error: "저장 중 문제가 발생했습니다." };

  await audit(nfc, "edit_name", session.email, { from: latest.name, to: n });
  return { ok: true };
}
