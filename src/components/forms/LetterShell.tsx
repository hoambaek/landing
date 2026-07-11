import Image from "next/image";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { defaultLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import koDict from "@/i18n/messages/ko.json";

/**
 * 서브 페이지 공용 셸 — 상단 이미지 레터 레이아웃 (Paper R3 시안).
 * 01 Hero 헤더(이미지 위 오버레이) + 상단 풀와이드 21:9 이미지 + 중앙 편지 칼럼 + 공용 푸터.
 */
export default function LetterShell({
  theme,
  image,
  imageAlt = "",
  locale = defaultLocale,
  headerDict = koDict.header,
  footerDict = koDict.footer,
  children,
}: {
  theme: "invite" | "partner" | "brand";
  image: string;
  imageAlt?: string;
  locale?: Locale;
  headerDict?: Dictionary["header"];
  footerDict?: Dictionary["footer"];
  children: React.ReactNode;
}) {
  return (
    <main className={`s-letter-page s-letter-page--${theme}`}>
      {/* 헤더 — 메인과 동일한 공용 Header (섹션 tone 감지로 로고 색 전환) */}
      <Header locale={locale} dict={headerDict} />

      {/* 상단 풀와이드 이미지 — brand는 밝은 히어로, 그 외는 다크 */}
      <aside className="s-letter__visual" data-tone={theme === "brand" ? "light" : "dark"}>
        <Image src={image} alt={imageAlt} fill sizes="100vw" priority unoptimized />
        {/* 파트너 — 헤더 가독용 스크림 (CSS에서 theme별 표시) */}
        <span className="s-letter__scrim" aria-hidden="true" />
      </aside>

      {/* 중앙 편지 패널 — 밝은 아이보리 */}
      <div className="s-letter__panel" data-tone="light">
        <div className="s-letter__col">{children}</div>
      </div>

      {/* 공용 푸터 */}
      <Footer locale={locale} dict={footerDict} />
    </main>
  );
}
