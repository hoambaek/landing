import { Resend } from "resend";

// env 값에 섞일 수 있는 개행/공백 제거 — 헤더로 쓰일 때 "invalid header value" 방지
const resendApiKey = process.env.RESEND_API_KEY?.trim();

/** Resend 클라이언트 — API 키 없으면 null (graceful) */
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

/** 발신 주소 — 검증된 musedemaree.com 도메인 */
export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL?.trim() || "Muse de Marée <info@musedemaree.com>";

/** 운영자 알림 수신 주소 */
export const ADMIN_EMAIL =
  process.env.ADMIN_NOTIFY_EMAIL?.trim() || "info@musedemaree.com";

export function isResendConfigured(): boolean {
  return !!resendApiKey;
}
