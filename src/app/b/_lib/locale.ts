import { BOTTLE_LOCALES, type BottleLocale } from "./copy";

/**
 * /b 화면들의 언어 선택을 쿠키로 잇는다.
 *
 * 이전에는 각 화면이 로컬 useState("ko")로만 언어를 들고 있어, 페이지를 넘어가면
 * 매번 한국어로 돌아갔다(입장에서 FR을 골라도 기록·인증서는 KO). 선택이 그 화면에
 * 머무는 동안만 유효했던 셈이다.
 *
 * 쿠키를 고른 이유: 경로 스코프(/b)로 세 화면이 자동으로 따라오고, 내부 링크에
 * 파라미터를 달지 않아도 되며, 서버에서 읽어 첫 렌더부터 맞는 언어로 그릴 수 있다.
 * (localStorage는 서버가 못 읽어 첫 프레임이 한국어로 깜빡인다.)
 *
 * httpOnly가 아니다 — 클라이언트가 직접 써야 하고, 담긴 값은 언어 코드뿐이라 민감하지 않다.
 */

export const BOTTLE_LANG_COOKIE = "b_lang";

const CODES = BOTTLE_LOCALES.map((l) => l.code);
const ONE_YEAR = 60 * 60 * 24 * 365;

/** 쿠키 값 → 로케일. 모르는 값이면 ko. 값이 URL·쿠키에서 오므로 화이트리스트로만 받는다. */
export function parseBottleLocale(value: string | undefined | null): BottleLocale {
  return CODES.includes(value as BottleLocale) ? (value as BottleLocale) : "ko";
}

/** 브라우저에서 선택을 저장한다. 서버 렌더 중에는 아무것도 하지 않는다. */
export function persistBottleLocale(locale: BottleLocale): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${BOTTLE_LANG_COOKIE}=${locale}; path=/b; max-age=${ONE_YEAR}; samesite=lax${secure}`;
}
