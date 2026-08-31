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
 * og:image·siteName·type 공유 상수 — Next.js는 openGraph 중첩 객체를 필드별로
 * 병합하지 않고 통째로 교체한다. 로케일별 페이지가 `openGraph: { locale: "en_US" }`처럼
 * 일부만 지정하면 루트 layout의 title·description·images·siteName·type이 전부 사라진다.
 * 그래서 로케일별 openGraph는 반드시 `{...sharedOg, locale, title, description}`처럼
 * 이 상수를 스프레드해서 채운다.
 */
export const sharedOg = {
  type: "website" as const,
  siteName: "Muse de Marée",
  images: [
    {
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt: "Muse de Marée",
    },
  ],
};

/** twitter 카드도 openGraph와 같은 이유로 공유 상수를 스프레드해서 채운다. */
export const sharedTwitter = {
  card: "summary_large_image" as const,
  images: ["/opengraph-image"],
};

/**
 * 레터 폼 페이지(초대·파트너·소개서)의 메타데이터를 딕셔너리에서 조립한다.
 * 폼 페이지는 색인 대상이 아니므로 noindex(follow)로 고정한다.
 * `path`는 이 페이지의 실제 경로(예: "/en/invite") — 없으면 루트 layout의
 * alternates.canonical: "/"를 그대로 물려받아 16개 폼 페이지가 전부 홈을
 * canonical로 가리키게 된다.
 */
export async function buildFormMetadata(
  locale: Locale,
  form: "invite" | "partner" | "brandBook",
  path: string,
): Promise<Metadata> {
  const dict = await getDictionary(locale);
  const f = dict.forms[form];
  return {
    title: f.metaTitle,
    description: f.metaDesc,
    alternates: { canonical: path },
    robots: { index: false, follow: true },
  };
}
