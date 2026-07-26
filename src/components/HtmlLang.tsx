"use client";

import { useEffect } from "react";
import { htmlLangMap, type Locale } from "@/i18n/config";

/**
 * <html lang> 로케일 교정.
 *
 * root layout이 정적 라우트(/en·/fr·/ja)의 locale을 알 수 없어 ko로 고정된다.
 * 언어별 조판 규칙(html[lang="ja"]의 금칙 처리, 로케일별 본문 서체)이
 * 이 속성에 달려 있으므로 두 경로 모두에서 바로잡아야 한다.
 *
 * 1) 첫 로드 — 인라인 스크립트. 파서가 이 지점을 지나는 즉시 동기 실행되어
 *    첫 페인트부터 서체가 맞는다. 이펙트로 미루면 하이드레이션 전까지 ko라
 *    한글 서체로 한 번 그려진 뒤 바뀌면서 글자가 튄다.
 *
 * 2) 클라이언트 이동 — 이펙트. 메뉴에서 언어를 바꾸면 서버 HTML을 새로 받지
 *    않으므로 위 스크립트는 실행되지 않는다. innerHTML로 들어간 <script>는
 *    브라우저가 실행하지 않기 때문이다(HTML 명세). 첫 로드에서는 이미 값이
 *    맞아 이 이펙트가 아무 일도 하지 않는다.
 *
 * 값은 htmlLangMap에서만 나오고 JSON.stringify를 거치므로 주입 경로가 없다.
 * (SEO 언어 신호는 hreflang alternates가 담당 — 이건 접근성·조판·번역엔진용)
 */
export default function HtmlLang({ locale }: { locale: Locale }) {
  const lang = htmlLangMap[locale];

  useEffect(() => {
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(lang)}`,
      }}
    />
  );
}
