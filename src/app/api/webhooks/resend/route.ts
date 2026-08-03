import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Resend 전달 이벤트 웹훅 수신.
 *
 * POST /api/webhooks/resend
 *   headers: svix-id, svix-timestamp, svix-signature
 *   body: { type, created_at, data: { email_id, ... } }
 *
 * 동작: 서명 검증 → data.email_id로 brandbook_requests 행을 찾아 전달 상태 갱신.
 *
 * 응답 정책 — Resend(Svix)는 2xx가 아니면 재시도한다.
 *   서명 실패·미등록 id·관심 없는 이벤트: 200으로 흘린다(재시도해도 결과가 안 바뀐다).
 *   시크릿 미설정·DB 오류: 500. 재시도가 의미 있고, 운영자가 봐야 하는 상태다.
 */

/** Resend 이벤트 → delivery_status 값. 여기 없는 이벤트(opened·clicked)는 무시한다. */
const EVENT_STATUS: Record<string, string> = {
  "email.sent": "sent",
  "email.delivered": "delivered",
  "email.delivery_delayed": "delivery_delayed",
  "email.bounced": "bounced",
  "email.complained": "complained",
  "email.failed": "failed",
};

/** 서명 타임스탬프 허용 오차 — 재전송 공격 방지. Svix 권장값과 동일. */
const TOLERANCE_SEC = 5 * 60;

/**
 * Svix(Standard Webhooks) 서명 검증.
 * 서명 대상은 `${id}.${timestamp}.${rawBody}`이고, 시크릿은 `whsec_` 접두사 뒤가 base64 키다.
 * 헤더에는 `v1,<sig>`가 공백으로 여러 개 올 수 있다(키 교체 중) — 하나만 맞으면 통과.
 */
function verifySignature(
  secret: string,
  headers: { id: string; timestamp: string; signature: string },
  rawBody: string
): boolean {
  const ts = Number(headers.timestamp);
  if (!Number.isFinite(ts)) return false;
  if (Math.abs(Date.now() / 1000 - ts) > TOLERANCE_SEC) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key)
    .update(`${headers.id}.${headers.timestamp}.${rawBody}`)
    .digest();

  return headers.signature.split(" ").some((part) => {
    const [version, value] = part.split(",");
    if (version !== "v1" || !value) return false;
    const given = Buffer.from(value, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

/**
 * 반송·실패 사유. 사유가 없는 이벤트면 null이고, 그 null이 앞 이벤트에 남은 사유를 지운다.
 * "반송됨" 같은 말은 넣지 않는다 — delivery_status가 이미 하는 말이다.
 */
function errorText(data: Record<string, unknown>): string | null {
  const bounce = data.bounce as { message?: string; subType?: string } | undefined;
  const failed = data.failed as { reason?: string } | undefined;
  return bounce?.message || bounce?.subType || failed?.reason || null;
}

export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("[webhooks/resend] RESEND_WEBHOOK_SECRET 미설정 — 검증 불가");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (!supabaseAdmin) {
    console.error("[webhooks/resend] Supabase 미설정");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // 서명 대상은 원문 그대로다 — JSON으로 파싱했다가 다시 직렬화하면 바이트가 달라져 검증이 깨진다.
  const raw = await req.text();
  const id = req.headers.get("svix-id");
  const timestamp = req.headers.get("svix-timestamp");
  const signature = req.headers.get("svix-signature");

  if (!id || !timestamp || !signature) {
    console.warn("[webhooks/resend] 서명 헤더 없음 — 무시");
    return NextResponse.json({ ok: true });
  }
  if (!verifySignature(secret, { id, timestamp, signature }, raw)) {
    console.warn("[webhooks/resend] 서명 검증 실패 — 무시");
    return NextResponse.json({ ok: true });
  }

  let event: { type?: string; created_at?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(raw);
  } catch {
    console.warn("[webhooks/resend] 본문 파싱 실패 — 무시");
    return NextResponse.json({ ok: true });
  }

  const type = event.type ?? "";
  const status = EVENT_STATUS[type];
  const messageId = event.data?.email_id;
  if (!status || typeof messageId !== "string" || !messageId) {
    return NextResponse.json({ ok: true });
  }

  const eventAt = new Date(event.created_at ?? Date.now()).toISOString();
  const patch: Record<string, unknown> = {
    delivery_status: status,
    last_event_at: eventAt,
    delivery_error: errorText(event.data ?? {}),
  };
  // 도착 시각은 delivered에서만 찍는다. 이후 complained가 와도 도착 사실은 남긴다.
  if (status === "delivered") patch.delivered_at = eventAt;

  // 웹훅은 순서를 보장하지 않는다. 이미 반영한 이벤트보다 오래된 건 버린다.
  // select에 last_event_at을 함께 넣어야 한다 — PostgREST는 UPDATE + return=representation일 때
  // or 필터의 컬럼을 select 목록에서만 찾는다. 빼면 42703("column does not exist")로 죽는다.
  const { data, error } = await supabaseAdmin
    .from("brandbook_requests")
    .update(patch)
    .eq("resend_message_id", messageId)
    .or(`last_event_at.is.null,last_event_at.lte.${eventAt}`)
    .select("id, last_event_at");

  if (error) {
    console.error("[webhooks/resend] 갱신 실패:", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (!data?.length) {
    // 브랜드 소개서 외 메일이거나(다른 폼의 확인 메일) 순서가 뒤집힌 이벤트.
    console.info(`[webhooks/resend] ${type} — 대상 행 없음 (${messageId})`);
  }

  return NextResponse.json({ ok: true });
}
