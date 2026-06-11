import { Resend } from "resend";

/** Resend 클라이언트 — API 키 없으면 null (graceful) */
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/** 발신 주소 — 검증된 musedemaree.com 도메인 */
export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Muse de Marée <info@musedemaree.com>";

/** 운영자 알림 수신 주소 */
export const ADMIN_EMAIL =
  process.env.ADMIN_NOTIFY_EMAIL || "info@musedemaree.com";

export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}
