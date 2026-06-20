import Image from "next/image";
import Footer from "@/components/layout/Footer";
import LetterHeader from "./LetterHeader";

/**
 * 서브 페이지 공용 셸 — 상단 이미지 레터 레이아웃 (Paper R3 시안).
 * 01 Hero 헤더(이미지 위 오버레이) + 상단 풀와이드 21:9 이미지 + 중앙 편지 칼럼 + 공용 푸터.
 */
export default function LetterShell({
  theme,
  image,
  imageAlt = "",
  children,
}: {
  theme: "invite" | "partner" | "brand";
  image: string;
  imageAlt?: string;
  children: React.ReactNode;
}) {
  return (
    <main className={`s-letter-page s-letter-page--${theme}`}>
      {/* 헤더 — 심볼(좌) + 워드마크(중앙) + 햄버거(우), 스크롤 시 다크 배경+노치 차폐 */}
      <LetterHeader />

      {/* 상단 풀와이드 이미지 */}
      <aside className="s-letter__visual">
        <Image src={image} alt={imageAlt} fill sizes="100vw" priority unoptimized />
        {/* 파트너 — 헤더 가독용 스크림 (CSS에서 theme별 표시) */}
        <span className="s-letter__scrim" aria-hidden="true" />
      </aside>

      {/* 중앙 편지 패널 */}
      <div className="s-letter__panel">
        <div className="s-letter__col">{children}</div>
      </div>

      {/* 공용 푸터 */}
      <Footer />
    </main>
  );
}
