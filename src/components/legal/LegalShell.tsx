import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import LegalDoc from "./LegalDoc";
import koDict from "@/i18n/messages/ko.json";
import type { LegalDoc as LegalDocData } from "@/content/legal/types";

/**
 * 법적 문서 페이지 공용 셸 — 라이트 테마(warm-paper).
 * LetterHeader(--brand 라이트 다크로고) 재사용 + 가독 텍스트 칼럼 + 공용 푸터.
 * 한국어 정본 전용이므로 locale은 ko 고정.
 */
export default function LegalShell({ doc }: { doc: LegalDocData }) {
  return (
    <main className="s-letter-page s-letter-page--brand s-legal-page">
      <Header locale="ko" dict={koDict.header} />

      <div className="s-legal__panel" data-tone="light">
        <div className="s-legal__col">
          <LegalDoc doc={doc} />
        </div>
      </div>

      <Footer locale="ko" dict={koDict.footer} />
    </main>
  );
}
