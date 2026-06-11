import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
