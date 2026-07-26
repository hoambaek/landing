import type { Metadata } from "next";
import { localePrefixMap, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

/** hreflang 대체 링크 — 검색엔진에 언어별 URL을 알린다 */
export const hreflangLanguages = {
  ko: "/",
  en: "/en",
  fr: "/fr",
  ja: "/ja",
  "x-default": "/",
} as const;

export function buildAlternates(locale: Locale): Metadata["alternates"] {
  return {
    canonical: localePrefixMap[locale],
    languages: hreflangLanguages,
  };
}

/**
 * 레터 폼 페이지(초대·파트너·소개서)의 메타데이터를 딕셔너리에서 조립한다.
 * 폼 페이지는 색인 대상이 아니므로 noindex(follow)로 고정한다.
 */
export async function buildFormMetadata(
  locale: Locale,
  form: "invite" | "partner" | "brandBook",
): Promise<Metadata> {
  const dict = await getDictionary(locale);
  const f = dict.forms[form];
  return {
    title: f.metaTitle,
    description: f.metaDesc,
    robots: { index: false, follow: true },
  };
}
