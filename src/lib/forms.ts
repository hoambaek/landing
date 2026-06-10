import { supabase } from "./supabase";

/** 서브 페이지 폼 제출 — Supabase insert. 미설정 시 graceful 실패. */

export type InvitePayload = { name: string; email: string };
export type PartnerPayload = {
  venue: string;
  name: string;
  email: string;
  message: string;
};
export type BrandBookPayload = { email: string };

export type SubmitResult = { ok: boolean; error?: string };

async function insert(table: string, row: Record<string, unknown>): Promise<SubmitResult> {
  if (!supabase) {
    return { ok: false, error: "지금은 신청을 받을 수 없습니다. 잠시 후 다시 시도해 주세요." };
  }
  const { error } = await supabase.from(table).insert(row);
  if (error) {
    console.error(`[forms] ${table} insert error:`, error.message);
    return { ok: false, error: "전송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }
  return { ok: true };
}

export const submitInvite = (p: InvitePayload) =>
  insert("invitations", { name: p.name, email: p.email });

export const submitPartner = (p: PartnerPayload) =>
  insert("partner_inquiries", {
    venue: p.venue,
    name: p.name,
    email: p.email,
    message: p.message,
  });

export const submitBrandBook = (p: BrandBookPayload) =>
  insert("brandbook_requests", { email: p.email });

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
