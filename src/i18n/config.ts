/**
 * 다국어 설정 — 경량 자체 i18n.
 * 한국어는 URL prefix 없이 `/`, 영어 `/en`, 프랑스어 `/fr`, 일본어 `/ja`.
 */
export const locales = ["ko", "en", "fr", "ja"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

/** URL 세그먼트로 노출되는 로케일 (기본 ko는 prefix 없음) */
export const localePrefixMap: Record<Locale, string> = {
  ko: "/",
  en: "/en",
  fr: "/fr",
  ja: "/ja",
};

/** <html lang> 및 OG locale 매핑 */
export const htmlLangMap: Record<Locale, string> = {
  ko: "ko",
  en: "en",
  fr: "fr",
  ja: "ja",
};

export const ogLocaleMap: Record<Locale, string> = {
  ko: "ko_KR",
  en: "en_US",
  fr: "fr_FR",
  ja: "ja_JP",
};

/** 언어 자동 전환 쿠키 — 사용자가 언어 버튼으로 **직접 고른** 로케일만 기억한다. src/proxy.ts가 읽고 쓴다.
 *  (2026-09-24 v2: 페이지 방문만으로 기억하던 v1 `mdm_locale`을 버리고 이름을 바꿨다 — 옛 쿠키 무시용) */
export const LOCALE_COOKIE = "mdm_lang";

/** 언어 스위처 링크. proxy가 ?lang=을 보고 쿠키를 박은 뒤 파라미터 없는 주소로 보낸다. */
export function langSwitchHref(locale: Locale): string {
  return `${localePrefixMap[locale]}?lang=${locale}`;
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
