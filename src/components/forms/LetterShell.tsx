import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/layout/Footer";
import LetterMenu from "./LetterMenu";

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
      {/* 헤더 — 심볼(좌) + 워드마크(중앙) + 햄버거(우) */}
      <header className="s-letter__header">
        <Link href="/" className="s-letter__symbol" aria-label="홈으로 이동">
          <Image src="/images/logo/logo_trans_W.png" alt="" width={1000} height={829} className="sym-white" />
          <Image src="/images/logo/logo_trans.png" alt="" aria-hidden="true" width={1000} height={829} className="sym-black" />
        </Link>
        <Link href="/" className="s-letter__wordmark" aria-label="Muse de Marée 홈">
          <Image src="/images/logo/logo_text_trans_W.png" alt="MUSE DE MARÉE" width={1000} height={152} />
        </Link>
        {/* 햄버거 + 전체화면 메뉴 오버레이 (랜딩과 동일 동작) */}
        <LetterMenu />
      </header>

      {/* 상단 풀와이드 이미지 */}
      <aside className="s-letter__visual">
        <Image src={image} alt={imageAlt} fill sizes="100vw" priority />
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
