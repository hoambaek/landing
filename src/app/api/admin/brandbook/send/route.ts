import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendBrandBookDelivery } from "@/lib/forms";

/**
 * 브랜드 소개서 승인·발송 API (관리자 전용).
 * marketing 관리자 대시보드가 공유 시크릿 헤더로 호출한다.
 *
 * POST /api/admin/brandbook/send
 *   headers: x-admin-secret: <ADMIN_API_SECRET>
 *   body: { id: string }   // brandbook_requests.id
 *
 * 동작: 신청 행 조회 → PDF 첨부 메일 발송 → status='sent', sent_at 기록.
 */
export async function POST(req: Request) {
  const secret = process.env.ADMIN_API_SECRET?.trim();
  const provided = req.headers.get("x-admin-secret")?.trim();
  if (!secret || !provided || provided !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { ok: false, error: "server not configured" },
      { status: 500 }
    );
  }

  let id: string | undefined;
  try {
    const body = await req.json();
    id = typeof body?.id === "string" ? body.id : undefined;
  } catch {
    /* ignore */
  }
  if (!id) {
    return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  }

  const { data: row, error: readErr } = await supabaseAdmin
    .from("brandbook_requests")
    .select("id, email, name, status")
    .eq("id", id)
    .single();

  if (readErr || !row) {
    return NextResponse.json({ ok: false, error: "request not found" }, { status: 404 });
  }

  const result = await sendBrandBookDelivery({
    email: row.email as string,
    name: (row.name as string | null) ?? undefined,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error ?? "send failed" },
      { status: 502 }
    );
  }

  const now = new Date().toISOString();
  const { error: updErr } = await supabaseAdmin
    .from("brandbook_requests")
    .update({
      status: "sent",
      sent_at: now,
      // 전달 추적은 승인 워크플로와 별개 축이다. 재발송이면 앞선 메일의
      // 전달 결과를 지우고 이번 메일 기준으로 다시 센다.
      resend_message_id: result.messageId ?? null,
      delivery_status: result.messageId ? "sent" : null,
      delivered_at: null,
      last_event_at: result.messageId ? now : null,
      delivery_error: null,
    })
    .eq("id", id);

  if (updErr) {
    // 메일은 발송됨 — 상태 갱신 실패는 로깅하되 성공으로 반환(재발송 방지 위해 sent 처리 권장).
    // message id를 못 남기면 이 건은 전달 추적이 끊긴다.
    console.error("[admin/brandbook/send] status 갱신 실패:", updErr.message);
  }

  return NextResponse.json({ ok: true });
}
