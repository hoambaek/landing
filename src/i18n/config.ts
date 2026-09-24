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

/** 언어 자동 전환 쿠키 — 사용자가 고른(또는 방문한) 로케일을 기억한다. src/proxy.ts가 읽고 쓴다 */
export const LOCALE_COOKIE = "mdm_locale";

/** 언어 스위처의 KR 링크. proxy가 ?lang=ko를 보고 쿠키를 ko로 박은 뒤 깨끗한 "/"로 보낸다.
 *  이게 없으면 브라우저 언어가 fr인 사람이 KR을 눌러도 "/"에서 다시 /fr로 튕긴다. */
export const LANG_KO_HREF = "/?lang=ko";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
