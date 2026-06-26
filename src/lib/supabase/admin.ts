import { createClient } from "@supabase/supabase-js";

// env 값에 섞일 수 있는 개행/공백 제거 — 헤더로 쓰일 때 "invalid header value" 방지
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

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
