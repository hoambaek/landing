import { htmlLangMap, type Locale } from "@/i18n/config";

/**
 * <html lang> 로케일 교정.
 *
 * root layout이 정적 라우트(/en·/fr·/ja)의 locale을 알 수 없어 ko로 고정된다.
 * 파서가 이 지점을 지나는 즉시 동기 실행되는 인라인 스크립트로 바로잡는다 —
 * useEffect로 미루면 하이드레이션 전까지 lang이 ko라, 언어별 조판 규칙
 * (html[lang="ja"]의 금칙 처리, 로케일별 본문 서체)이 첫 페인트에 적용되지 않고
 * 뒤늦게 바뀌면서 글자가 튄다.
 *
 * 값은 htmlLangMap에서만 나오고 JSON.stringify를 거치므로 주입 경로가 없다.
 * (SEO 언어 신호는 hreflang alternates가 담당 — 이건 접근성·조판·번역엔진용)
 */
export default function HtmlLang({ locale }: { locale: Locale }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(htmlLangMap[locale])}`,
      }}
    />
  );
}
