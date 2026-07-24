import "server-only";
import { createHmac, createHash, randomInt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * 소유자 세션 — HMAC 서명 토큰을 httpOnly 쿠키로. DB 세션 테이블 없이 서명만으로 검증.
 * 쿠키는 해당 병 경로(/b/{code})로 스코프. TTL 30분.
 * OTP 코드는 해시(비밀키+코드)로만 저장/비교 — 평문 저장하지 않는다.
 */

const SECRET = (process.env.BOTTLE_SESSION_SECRET ?? "").replace(/\s+/g, "");
const SESSION_TTL_MS = 30 * 60 * 1000;

function cookieName(nfc: string): string {
  return `bo_${nfc}`;
}

interface SessionPayload {
  nfc: string;
  email: string;
  exp: number;
}

export function signSession(nfc: string, email: string): string {
  const payload: SessionPayload = { nfc, email, exp: Date.now() + SESSION_TTL_MS };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifySession(nfc: string, token: string | undefined): { email: string } | null {
  if (!token || !SECRET) return null;
  const dot = token.indexOf(".");
  if (dot < 1) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (p.nfc !== nfc || typeof p.exp !== "number" || p.exp < Date.now()) return null;
    return { email: p.email };
  } catch {
    return null;
  }
}

export async function getOwnerSession(nfc: string): Promise<{ email: string } | null> {
  const jar = await cookies();
  return verifySession(nfc, jar.get(cookieName(nfc))?.value);
}

export async function setOwnerSession(nfc: string, email: string): Promise<void> {
  const jar = await cookies();
  jar.set(cookieName(nfc), signSession(nfc, email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/b/${nfc}`,
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function clearOwnerSession(nfc: string): Promise<void> {
  const jar = await cookies();
  jar.delete({ name: cookieName(nfc), path: `/b/${nfc}` });
}

export function genOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashCode(nfc: string, code: string): string {
  return createHash("sha256").update(`${SECRET}|${nfc}|${code}`).digest("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(`${SECRET}|${token}`).digest("hex");
}
