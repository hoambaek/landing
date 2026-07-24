"use server";

/**
 * 소유자 인증·소유권 이전 서버 액션.
 * - OTP: 등록 이메일로 6자리 코드 발송 → 검증 시 서명 세션 쿠키 발급.
 * - 정보 수정/소유권 이전은 유효 세션이 있어야만 실행(서버에서 재확인).
 * - 소유권 이전은 되돌릴 수 없음: 새 소유자가 이메일로 받은 토큰으로 수락해야 완료(감사 로그 보존).
 */

import { randomBytes, timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend, FROM_EMAIL, isResendConfigured } from "@/lib/resend/client";
import { maskEmail } from "./data";
import {
  genOtp,
  hashCode,
  hashToken,
  setOwnerSession,
  getOwnerSession,
  clearOwnerSession,
} from "./owner-auth";

const NFC_RE = /^[A-Za-z0-9]{4,12}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function shell(inner: string): string {
  return `<div style="background:#0a0908;color:#f1efeb;font-family:'Noto Sans KR',sans-serif;padding:40px 28px;max-width:520px;margin:0 auto">
    <div style="letter-spacing:.2em;font-size:11px;color:#ccad7b;margin-bottom:24px">MUSE DE MARÉE · OCEAN CELLAR</div>
    ${inner}
    <div style="margin-top:36px;font-size:11px;color:rgba(241,239,235,.4)">바다의 시간을 기록하는 디지털 아카이브.</div>
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

  await sendMail(
    email,
    "[뮤즈드마레] 소유자 인증 코드",
    shell(
      `<div style="font-size:15px;margin-bottom:16px">소유자 인증 코드</div>
       <div style="font-size:34px;letter-spacing:.3em;font-weight:300;color:#ccad7b">${code}</div>
       <div style="margin-top:16px;font-size:12px;color:rgba(241,239,235,.6)">5분 안에 입력해 주세요. 본인이 요청하지 않았다면 이 메일을 무시하세요.</div>`
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

/* ── 정보 수정 ────────────────────────────────────── */
export async function updateOwnerInfo(nfc: string, name: string, email: string): Promise<Result> {
  if (!supabaseAdmin || !NFC_RE.test(nfc)) return { ok: false, error: "잘못된 요청입니다." };
  const session = await getOwnerSession(nfc);
  if (!session) return { ok: false, error: "본인 인증이 필요합니다." };

  const n = (name ?? "").trim();
  const em = (email ?? "").trim();
  if (!n) return { ok: false, error: "이름을 입력해 주세요." };
  if (!EMAIL_RE.test(em)) return { ok: false, error: "이메일 주소를 확인해 주세요." };

  const { data: latest } = await supabaseAdmin
    .from("bottle_registrations")
    .select("id")
    .eq("nfc_code", nfc)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!latest) return { ok: false, error: "소유 기록을 찾을 수 없습니다." };

  const { error } = await supabaseAdmin
    .from("bottle_registrations")
    .update({ name: n, email: em })
    .eq("id", latest.id);
  if (error) return { ok: false, error: "저장 중 문제가 발생했습니다." };

  await audit(nfc, "edit", session.email, { to_email: em });
  if (em !== session.email) await setOwnerSession(nfc, em);
  return { ok: true };
}

/* ── 소유권 이전 ──────────────────────────────────── */
export async function initiateTransfer(
  nfc: string,
  toEmail: string,
  toName: string
): Promise<Result> {
  if (!supabaseAdmin || !NFC_RE.test(nfc)) return { ok: false, error: "잘못된 요청입니다." };
  const session = await getOwnerSession(nfc);
  if (!session) return { ok: false, error: "본인 인증이 필요합니다." };

  const to = (toEmail ?? "").trim().toLowerCase();
  const name = (toName ?? "").trim();
  if (!EMAIL_RE.test(to)) return { ok: false, error: "받는 분의 이메일을 확인해 주세요." };
  if (to === session.email.toLowerCase()) return { ok: false, error: "현재 소유자와 다른 이메일이어야 합니다." };

  // 기존 대기 이전은 취소
  await supabaseAdmin
    .from("bottle_transfers")
    .update({ status: "cancelled" })
    .eq("nfc_code", nfc)
    .eq("status", "pending");

  const token = randomBytes(24).toString("base64url");
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await supabaseAdmin.from("bottle_transfers").insert({
    nfc_code: nfc,
    from_email: session.email,
    to_email: to,
    to_name: name || null,
    accept_token_hash: hashToken(token),
    expires_at: expires,
  });
  if (error) return { ok: false, error: "잠시 후 다시 시도해 주세요." };

  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://musedemaree.com").replace(/\/$/, "");
  const link = `${base}/b/${nfc}/transfer?token=${token}`;
  await sendMail(
    to,
    "[뮤즈드마레] 병 소유권 이전 요청",
    shell(
      `<div style="font-size:15px;margin-bottom:14px">병 소유권이 회원님께 이전되었습니다</div>
       <div style="font-size:12px;color:rgba(241,239,235,.7);line-height:1.7">아래 버튼을 눌러 소유권 이전을 수락하면, 이 병과 바다의 기록·디지털 인증서의 소유자로 등록됩니다. 이 링크는 7일간 유효합니다.</div>
       <a href="${link}" style="display:inline-block;margin-top:22px;padding:14px 26px;background:#ccad7b;color:#0a0908;text-decoration:none;font-size:13px">소유권 이전 수락하기</a>`
    )
  );
  await audit(nfc, "transfer_initiated", session.email, { to_email: to });
  return { ok: true };
}

export async function acceptTransfer(nfc: string, token: string): Promise<Result> {
  if (!supabaseAdmin || !NFC_RE.test(nfc)) return { ok: false, error: "잘못된 요청입니다." };
  const t = (token ?? "").trim();
  if (!t) return { ok: false, error: "잘못된 링크입니다." };

  const { data: tr } = await supabaseAdmin
    .from("bottle_transfers")
    .select("id, to_email, to_name, from_email")
    .eq("nfc_code", nfc)
    .eq("status", "pending")
    .eq("accept_token_hash", hashToken(t))
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (!tr) return { ok: false, error: "이전 요청이 만료되었거나 유효하지 않습니다." };

  // 새 소유자 등록 행 추가(= 최신 소유자) → 이전 수락 표시 → 감사
  const { data: prev } = await supabaseAdmin
    .from("bottle_registrations")
    .select("product_id, serial")
    .eq("nfc_code", nfc)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insErr } = await supabaseAdmin.from("bottle_registrations").insert({
    nfc_code: nfc,
    product_id: prev?.product_id ?? null,
    serial: prev?.serial ?? null,
    name: tr.to_name || "새 소유자",
    email: tr.to_email,
    locale: null,
    referral_source: "ownership_transfer",
  });
  if (insErr) return { ok: false, error: "이전 처리 중 문제가 발생했습니다." };

  await supabaseAdmin
    .from("bottle_transfers")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", tr.id);
  await audit(nfc, "transfer_accepted", tr.to_email, { from_email: tr.from_email });

  // 이전 소유자 세션 무효화 + 새 소유자 세션 발급
  await clearOwnerSession(nfc);
  await setOwnerSession(nfc, tr.to_email);
  return { ok: true };
}
