"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LetterMenu from "./LetterMenu";

/**
 * 서브페이지 헤더 (client) — 스크롤 시 다크 배경 + 노치(safe-area) 차폐 + 로고 흰색 전환.
 * 랜딩 Header와 동일한 동작: 상단(이미지 위)에선 투명, 스크롤하면 메뉴바가 채워진다.
 */
export default function LetterHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cls = scrolled ? " is-scrolled" : "";

  return (
    <>
      {/* 노치(safe-area) 차폐 바 — 스크롤 시 void 컬러 */}
      <div className={`s-letter__safe${cls}`} aria-hidden="true" />

      <header className={`s-letter__header${cls}`}>
        <Link href="/" className="s-letter__symbol" aria-label="홈으로 이동">
          <Image src="/images/logo/logo_trans_W.png" alt="" width={1000} height={829} className="sym-white" />
          <Image src="/images/logo/logo_trans.png" alt="" aria-hidden="true" width={1000} height={829} className="sym-black" />
        </Link>
        <Link href="/" className="s-letter__wordmark" aria-label="Muse de Marée 홈">
          <Image src="/images/logo/logo_text_trans_W.png" alt="MUSE DE MARÉE" width={1000} height={152} />
        </Link>
        <LetterMenu />
      </header>
    </>
  );
}
