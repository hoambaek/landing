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

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
