import Link from "next/link";
import Image from "next/image";

/** 서브 페이지 공용 셸 — ‹ 뒤로 + 중앙 로고 헤더 + 편지 칼럼 컨테이너 */
export default function LetterShell({
  theme,
  children,
}: {
  theme: "invite" | "partner" | "brand";
  children: React.ReactNode;
}) {
  return (
    <main className={`s-letter-page s-letter-page--${theme}`}>
      <header className="s-letter__header">
        <Link href="/" className="s-letter__back" aria-label="홈으로 돌아가기">
          ‹
        </Link>
        {/* 화이트 로고 — 라이트 테마는 CSS filter로 다크 반전 */}
        <Link href="/" className="s-letter__logo" aria-label="Muse de Marée 홈">
          <Image src="/images/logo/logo_text_trans_W.png" alt="MUSE DE MARÉE" width={1000} height={152} />
        </Link>
      </header>

      <div className="s-letter">{children}</div>
    </main>
  );
}
