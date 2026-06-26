import { createClient } from "@supabase/supabase-js";

// env 값에 섞일 수 있는 공백/개행(중간 줄바꿈 포함) 전부 제거 — 헤더로 쓰일 때
// "invalid header value" 방지. JWT/URL은 공백문자를 포함하지 않으므로 전체 제거가 안전.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\s+/g, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s+/g, "");

/**
 * 서버 전용 Supabase 클라이언트 — service role 키로 RLS 우회.
 * 폼 제출(서버 액션)에서만 사용. 키 미설정 시 null (graceful fallback).
 */
export const supabaseAdmin =
  url && serviceKey
    ? createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;
