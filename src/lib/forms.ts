"use server";

import { readFile } from "fs/promises";
import path from "path";
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
  type EmailMode,
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

export type InvitePayload = { name: string; email: string; referralSource?: string };
export type PartnerPayload = {
  category: string;
  venue: string;
  name: string;
  email: string;
  message: string;
  referralSource?: string;
};
export type BrandBookPayload = { name: string; affiliation: string; email: string };
export type BottleRegistrationPayload = {
  nfcCode: string;
  productId?: string | null;
  serial?: number | null;
  name: string;
  email: string;
  locale?: string;
  referralSource?: string;
};
export type NewsletterPayload = { email: string; locale?: string; source?: string };

export type SubmitResult = { ok: boolean; error?: string };

type Attachment = { filename: string; content: string };

type NotifyArgs = {
  kind: FormKind;
  applicantEmail: string;
  applicantName?: string;
  adminFields: Record<string, string>;
  /** 신청자 메일에 첨부할 파일 (브랜드 소개서 PDF 등) */
  attachments?: Attachment[];
  /** 신청자 메일 모드 — 브랜드 소개서 접수확인("ack") vs 전달("send") */
  mode?: EmailMode;
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
  attachments,
  mode = "send",
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
      render(ApplicantEmail({ kind, name: applicantName, mode })),
      render(AdminNotifyEmail({ kind, fields: adminFields, receivedAt })),
    ]);

    const results = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: applicantEmail,
        subject: getApplicantSubject(kind, mode),
        html: applicantHtml,
        ...(attachments?.length ? { attachments } : {}),
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

/**
 * 브랜드 소개서 전달 메일(PDF 첨부) — 관리자 승인 시 발송.
 * 신청자에게만 발송(운영자 알림 없음). 발송 성공 여부를 반환한다.
 */
export async function sendBrandBookDelivery(p: {
  email: string;
  name?: string;
}): Promise<SubmitResult> {
  if (!isResendConfigured() || !resend) {
    return { ok: false, error: "이메일 발송이 설정되지 않았습니다." };
  }
  const attachments = await loadBrandBookPdf();
  if (!attachments?.length) {
    return { ok: false, error: "브랜드 소개서 PDF를 찾을 수 없습니다." };
  }
  try {
    const html = await render(
      ApplicantEmail({ kind: "brandbook", name: p.name, mode: "send" })
    );
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: p.email,
      subject: getApplicantSubject("brandbook", "send"),
      html,
      attachments,
    });
    if (error) {
      console.error("[forms] 소개서 전달 메일 실패:", error);
      return { ok: false, error: "메일 발송에 실패했습니다." };
    }
    return { ok: true };
  } catch (e) {
    console.error("[forms] 소개서 전달 예외:", e);
    return { ok: false, error: "메일 발송 중 오류가 발생했습니다." };
  }
}

export async function submitInvite(p: InvitePayload): Promise<SubmitResult> {
  const referral = p.referralSource?.trim() || null;
  return insertAndNotify(
    "invitations",
    { name: p.name, email: p.email, referral_source: referral },
    {
      kind: "invite",
      applicantEmail: p.email,
      applicantName: p.name,
      adminFields: {
        성함: p.name,
        이메일: p.email,
        ...(referral ? { "알게 된 경로": referral } : {}),
      },
    }
  );
}

export async function submitPartner(p: PartnerPayload): Promise<SubmitResult> {
  const referral = p.referralSource?.trim() || null;
  return insertAndNotify(
    "partner_inquiries",
    {
      category: p.category,
      venue: p.venue,
      name: p.name,
      email: p.email,
      message: p.message,
      referral_source: referral,
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
        ...(p.message.trim() ? { 문의: p.message } : {}),
        ...(referral ? { "알게 된 경로": referral } : {}),
      },
    }
  );
}

/** 브랜드 소개서 PDF를 base64로 로드 (없으면 첨부 없이 graceful) */
async function loadBrandBookPdf(): Promise<Attachment[] | undefined> {
  try {
    const buf = await readFile(
      path.join(process.cwd(), "private-assets/musedemaree-brandbook.pdf")
    );
    return [
      {
        filename: "Muse de Marée — Brand Book.pdf",
        content: buf.toString("base64"),
      },
    ];
  } catch {
    console.warn("[forms] 브랜드 소개서 PDF 없음 — 첨부 없이 발송");
    return undefined;
  }
}

export async function submitBrandBook(
  p: BrandBookPayload
): Promise<SubmitResult> {
  // 수집형 전환: 제출 시 PDF 자동첨부 없음. pending으로 저장하고 접수 확인 메일만 발송.
  // 실제 소개서(PDF)는 관리자 승인 시 sendBrandBookDelivery로 전달.
  return insertAndNotify(
    "brandbook_requests",
    { name: p.name, affiliation: p.affiliation, email: p.email },
    {
      kind: "brandbook",
      applicantEmail: p.email,
      applicantName: p.name,
      adminFields: { 이름: p.name, 소속: p.affiliation, 이메일: p.email },
      mode: "ack",
    }
  );
}

/**
 * 병 소유자 등록(입장 페이지 명부) — NFC 태그로 열린 병을 신청자 이름으로 등록.
 * bottle_registrations 저장 + 신청자·운영자 확인 메일.
 */
export async function submitBottleRegistration(
  p: BottleRegistrationPayload
): Promise<SubmitResult> {
  // 이미 등록된 병은 재등록 불가(소유자 덮어쓰기 방지).
  // 소유권 이전 기능을 걷어내서 셀프 변경 경로가 없다 — 문의로만 처리한다.
  if (supabaseAdmin) {
    const { data: existing } = await supabaseAdmin
      .from("bottle_registrations")
      .select("id")
      .eq("nfc_code", p.nfcCode)
      .limit(1)
      .maybeSingle();
    if (existing) {
      return { ok: false, error: "이미 등록된 병입니다. 소유자 변경은 info@musedemaree.com으로 문의해 주세요." };
    }
  }

  const referral = p.referralSource?.trim() || null;
  return insertAndNotify(
    "bottle_registrations",
    {
      nfc_code: p.nfcCode,
      product_id: p.productId ?? null,
      serial: p.serial ?? null,
      name: p.name,
      email: p.email,
      referral_source: referral,
      locale: p.locale ?? null,
    },
    {
      kind: "bottle",
      applicantEmail: p.email,
      applicantName: p.name,
      adminFields: {
        성함: p.name,
        이메일: p.email,
        "병 번호": p.serial != null ? `N° ${p.serial}` : "—",
        코드: p.nfcCode,
        제품: p.productId ?? "—",
      },
    }
  );
}

/**
 * 뉴스레터 구독 — 기록 페이지. 이메일은 소문자 정규화 후 저장,
 * 이미 구독된 주소면 조용히 성공 처리(중복 메일 발송 안 함).
 */
export async function submitNewsletter(
  p: NewsletterPayload
): Promise<SubmitResult> {
  if (!supabaseAdmin) {
    return {
      ok: false,
      error: "지금은 구독을 받을 수 없습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
  const email = p.email.trim().toLowerCase();
  const { error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .insert({ email, locale: p.locale ?? null, source: p.source ?? "bottle_record" });

  // 23505 = unique 위반(이미 구독). 사용자에겐 성공으로 처리하되 확인 메일은 재발송하지 않는다.
  if (error && error.code !== "23505") {
    console.error("[forms] newsletter insert error:", error.message);
    return {
      ok: false,
      error: "전송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
  if (!error) {
    await sendEmails({
      kind: "newsletter",
      applicantEmail: email,
      adminFields: { 이메일: email },
      mode: "ack",
    });
  }
  return { ok: true };
}
