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
  type EmailLocale,
} from "./resend/templates/ApplicantEmail";
import {
  AdminNotifyEmail,
  getAdminSubject,
} from "./resend/templates/AdminNotifyEmail";
import type { Locale } from "@/i18n/config";
import { PRODUCT_META } from "@/app/b/_lib/copy";
import { fetchAgingBatch } from "@/app/b/_lib/data";
import { formatOwnerLatin } from "@/app/b/_lib/owner-name";

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
/* 신청 언어를 그대로 남긴다 — 발송 언어(ko·en 두 벌)를 고르는 근거이자,
   fr·ja 신청이 얼마나 들어오는지 보는 재료다. 두 값을 한 컬럼에 뭉치면 후자가 사라진다. */
export type BrandBookPayload = {
  name: string;
  affiliation: string;
  email: string;
  locale: Locale;
};
/**
 * 로마자 표기의 첫 글자만 대문자로 올린다.
 *
 * 첫 글자만 건드리는 이유: 이름의 정확한 표기는 사람마다 다르다.
 * 전체를 title case로 강제하면 van der Berg → Van Der Berg, McDonald → Mcdonald처럼
 * 남의 이름을 틀리게 고쳐 인증서에 새기게 된다. 소문자로만 적어 넣은 경우를
 * 바로잡되, 본인이 의도한 나머지 표기(대문자·하이픈·아포스트로피)는 그대로 둔다.
 */
function capitalizeFirst(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  if (!t) return null;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export type BottleRegistrationPayload = {
  nfcCode: string;
  productId?: string | null;
  serial?: number | null;
  name: string;
  /* 인증서에 새길 로마자 표기 — 등록자가 직접 입력한 값만 쓴다.
     한글에서 기계로 옮기면 표기가 갈려(백 → Baek/Baik/Paek) 남의 이름이 새겨진다. */
  givenNameLatin?: string | null;
  familyNameLatin?: string | null;
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
  /** 병 번호 — bottle 메일에서만 쓴다. 개체는 번호로 부르고, 없으면 부르지 않는다 */
  serial?: number | null;
  /** 신청자 메일의 언어. 운영자 알림(AdminNotifyEmail)은 이 값과 무관하게 한국어다 */
  locale?: EmailLocale;
  /** bottle 메일 명판 — 인증서와 같은 출처(PRODUCT_META · 입수 배치 · 로마자 입력값)만 넘긴다.
      값이 없으면 템플릿이 그 칸을 세우지 않는다. 지어낸 값으로 채우지 않는다. */
  plate?: {
    total?: number | null;
    cuvee?: string | null;
    vintage?: string | null;
    nameLatin?: string | null;
  };
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
  serial = null,
  locale = "ko",
  plate,
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
    /* 언어를 타는 것은 신청자 메일뿐이다 — 운영자 알림은 대표가 읽으므로 한국어 한 벌이다 */
    const [applicantHtml, adminHtml] = await Promise.all([
      render(ApplicantEmail({ kind, name: applicantName, mode, serial, locale, ...plate })),
      render(AdminNotifyEmail({ kind, fields: adminFields, receivedAt })),
    ]);

    const results = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: applicantEmail,
        subject: getApplicantSubject(kind, mode, serial, locale),
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
 * 신청자에게만 발송(운영자 알림 없음).
 * 발송 성공 여부와 함께 Resend message id를 돌려준다 —
 * 이 id가 없으면 이후 전달·반송 웹훅을 신청 행에 붙일 수 없다.
 *
 * locale은 첨부 PDF 판본과 메일 제목·본문을 함께 고른다 — 영문판을 보내면서
 * 본문만 한국어로 나가지 않게 한다.
 */
export async function sendBrandBookDelivery(p: {
  email: string;
  name?: string;
  /** 발송 언어 — 첨부할 소개서 판본과 메일 문안을 고른다. ko·en 두 벌뿐이다 */
  locale: EmailLocale;
}): Promise<SubmitResult & { messageId?: string }> {
  if (!isResendConfigured() || !resend) {
    return { ok: false, error: "이메일 발송이 설정되지 않았습니다." };
  }
  const attachments = await loadBrandBookPdf(p.locale);
  if (!attachments?.length) {
    return { ok: false, error: "브랜드 소개서 PDF를 찾을 수 없습니다." };
  }
  try {
    const html = await render(
      ApplicantEmail({
        kind: "brandbook",
        name: p.name,
        mode: "send",
        locale: p.locale,
      })
    );
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: p.email,
      subject: getApplicantSubject("brandbook", "send", null, p.locale),
      html,
      attachments,
    });
    if (error) {
      console.error("[forms] 소개서 전달 메일 실패:", error);
      return { ok: false, error: "메일 발송에 실패했습니다." };
    }
    return { ok: true, messageId: data?.id };
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

/**
 * 브랜드 소개서 PDF를 base64로 로드 — 발송 언어에 맞는 파일과 첨부 이름을 고른다.
 * 소개서는 한국어판·영문판 두 벌뿐이다(fr·ja 신청도 영문판으로 나간다).
 * 파일이 없으면 undefined — 호출부가 발송을 중단한다. 소개서 없는 "소개서 전달" 메일은 보내지 않는다.
 */
async function loadBrandBookPdf(
  locale: "ko" | "en"
): Promise<Attachment[] | undefined> {
  const file =
    locale === "en"
      ? "musedemaree-brandbook-en.pdf"
      : "musedemaree-brandbook.pdf";
  /* 첨부 이름은 받는 사람이 읽을 언어로 붙인다 — 파일명이 메일 본문 다음으로 먼저 읽힌다 */
  const filename =
    locale === "en"
      ? "Muse de Marée — Brand Book.pdf"
      : "뮤즈드마레 브랜드 소개서.pdf";
  try {
    const buf = await readFile(path.join(process.cwd(), "private-assets", file));
    return [{ filename, content: buf.toString("base64") }];
  } catch {
    console.warn(`[forms] 브랜드 소개서 PDF 없음(${locale}: ${file}) — 발송 중단`);
    return undefined;
  }
}

export async function submitBrandBook(
  p: BrandBookPayload
): Promise<SubmitResult> {
  // 수집형 전환: 제출 시 PDF 자동첨부 없음. pending으로 저장하고 접수 확인 메일만 발송.
  // 실제 소개서(PDF)는 관리자 승인 시 sendBrandBookDelivery로 전달.
  /* 접수 확인 메일도 신청 언어를 따른다. 메일 문안은 ko·en 두 벌뿐이므로
     한국어가 아닌 신청(en·fr·ja)은 전부 영문으로 보낸다 — 첨부 PDF 판본을 고르는 규칙과 같다.
     원래 신청 언어(fr·ja)는 request_locale 컬럼에 그대로 남는다. */
  const mailLocale: EmailLocale = p.locale === "ko" ? "ko" : "en";
  return insertAndNotify(
    "brandbook_requests",
    {
      name: p.name,
      affiliation: p.affiliation,
      email: p.email,
      request_locale: p.locale,
    },
    {
      kind: "brandbook",
      applicantEmail: p.email,
      applicantName: p.name,
      adminFields: { 이름: p.name, 소속: p.affiliation, 이메일: p.email },
      mode: "ack",
      locale: mailLocale,
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
  /* 저장 시점에 한 번만 정규화한다 — 인증서·메일·관리자 알림이 모두 같은 값을 본다 */
  const given = capitalizeFirst(p.givenNameLatin);
  const family = capitalizeFirst(p.familyNameLatin);
  /* 명판 값 — 인증서와 같은 출처를 쓴다. 연도는 입수 배치가 있을 때만 붙인다
     (immersionYear는 없으면 올해로 채우므로 여기서는 쓰지 않는다). */
  const meta = p.productId ? PRODUCT_META[p.productId] : undefined;
  const aging = p.productId ? await fetchAgingBatch(p.productId) : null;
  const plate = {
    total: meta?.quantity ?? null,
    cuvee: meta?.name ?? null,
    vintage: aging?.immersion?.slice(0, 4) ?? null,
    nameLatin: formatOwnerLatin(given, family),
  };
  return insertAndNotify(
    "bottle_registrations",
    {
      nfc_code: p.nfcCode,
      product_id: p.productId ?? null,
      serial: p.serial ?? null,
      name: p.name,
      given_name_latin: given,
      family_name_latin: family,
      email: p.email,
      referral_source: referral,
      locale: p.locale ?? null,
    },
    {
      kind: "bottle",
      applicantEmail: p.email,
      applicantName: p.name,
      serial: p.serial ?? null,
      plate,
      adminFields: {
        성함: p.name,
        "로마자 표기": [given, family].filter(Boolean).join(" ") || "—",
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
