"use server";

import { render } from "@react-email/render";
import { supabaseAdmin } from "./supabase/admin";
import {
  resend,
  FROM_EMAIL,
  ADMIN_EMAIL,
  isResendConfigured,
} from "./resend/client";
import {
  ApplicantEmail,
  getApplicantSubject,
  type FormKind,
} from "./resend/templates/ApplicantEmail";
import {
  AdminNotifyEmail,
  getAdminSubject,
} from "./resend/templates/AdminNotifyEmail";

/**
 * 서브 페이지 폼 제출 — 서버 액션.
 * service role로 Supabase insert(RLS 우회) 후, 신청자·운영자에게 이메일 발송.
 * 이메일 실패는 신청 성공을 막지 않는다.
 */

export type InvitePayload = { name: string; email: string };
export type PartnerPayload = {
  category: string;
  venue: string;
  name: string;
  email: string;
  message: string;
};
export type BrandBookPayload = { email: string };

export type SubmitResult = { ok: boolean; error?: string };

type NotifyArgs = {
  kind: FormKind;
  applicantEmail: string;
  applicantName?: string;
  adminFields: Record<string, string>;
};

/** insert 성공 후 이메일 2종 발송(병렬, 실패 무시) */
async function insertAndNotify(
  table: string,
  row: Record<string, unknown>,
  notify: NotifyArgs
): Promise<SubmitResult> {
  if (!supabaseAdmin) {
    return {
      ok: false,
      error: "지금은 신청을 받을 수 없습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  const { error } = await supabaseAdmin.from(table).insert(row);
  if (error) {
    console.error(`[forms] ${table} insert error:`, error.message);
    return {
      ok: false,
      error: "전송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  await sendEmails(notify);
  return { ok: true };
}

async function sendEmails({
  kind,
  applicantEmail,
  applicantName,
  adminFields,
}: NotifyArgs): Promise<void> {
  if (!isResendConfigured() || !resend) {
    console.warn("[forms] Resend 미설정 — 이메일 발송 건너뜀");
    return;
  }

  const receivedAt = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date());

  try {
    const [applicantHtml, adminHtml] = await Promise.all([
      render(ApplicantEmail({ kind, name: applicantName })),
      render(AdminNotifyEmail({ kind, fields: adminFields, receivedAt })),
    ]);

    const results = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: applicantEmail,
        subject: getApplicantSubject(kind),
        html: applicantHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        replyTo: applicantEmail,
        subject: getAdminSubject(kind),
        html: adminHtml,
      }),
    ]);

    results.forEach((r, i) => {
      const label = i === 0 ? "신청자" : "운영자";
      if (r.status === "rejected") {
        console.error(`[forms] ${label} 메일 발송 실패:`, r.reason);
      } else if (r.value.error) {
        console.error(`[forms] ${label} 메일 발송 실패:`, r.value.error);
      }
    });
  } catch (e) {
    // 렌더/발송 예외는 신청을 실패시키지 않음
    console.error("[forms] 이메일 처리 예외:", e);
  }
}

export async function submitInvite(p: InvitePayload): Promise<SubmitResult> {
  return insertAndNotify(
    "invitations",
    { name: p.name, email: p.email },
    {
      kind: "invite",
      applicantEmail: p.email,
      applicantName: p.name,
      adminFields: { 성함: p.name, 이메일: p.email },
    }
  );
}

export async function submitPartner(p: PartnerPayload): Promise<SubmitResult> {
  return insertAndNotify(
    "partner_inquiries",
    {
      category: p.category,
      venue: p.venue,
      name: p.name,
      email: p.email,
      message: p.message,
    },
    {
      kind: "partner",
      applicantEmail: p.email,
      applicantName: p.name,
      adminFields: {
        유형: p.category,
        업장: p.venue,
        성함: p.name,
        이메일: p.email,
        문의: p.message,
      },
    }
  );
}

export async function submitBrandBook(
  p: BrandBookPayload
): Promise<SubmitResult> {
  return insertAndNotify(
    "brandbook_requests",
    { email: p.email },
    {
      kind: "brandbook",
      applicantEmail: p.email,
      adminFields: { 이메일: p.email },
    }
  );
}
