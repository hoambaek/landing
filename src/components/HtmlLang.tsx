"use client";

import { useEffect } from "react";
import { htmlLangMap, type Locale } from "@/i18n/config";

/**
 * <html lang> 로케일 교정.
 * root layout이 정적 라우트(/en·/fr)의 locale을 알 수 없어 ko로 고정되므로,
 * 하이드레이션 후 클라이언트에서 documentElement.lang을 교정한다.
 * (SEO 언어 신호는 hreflang alternates가 담당 — 이 컴포넌트는 접근성/번역엔진용)
 */
export default function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = htmlLangMap[locale];
  }, [locale]);
  return null;
}
