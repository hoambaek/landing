"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import LetterMenu from "./LetterMenu";
import { localePrefixMap, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

/**
 * 서브페이지 헤더 (client) — 스크롤 시 다크 배경 + 노치(safe-area) 차폐 + 로고 흰색 전환.
 * 랜딩 Header와 동일한 동작: 상단(이미지 위)에선 투명, 스크롤하면 메뉴바가 채워진다.
 */
export default function LetterHeader({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["header"];
}) {
  const homeHref = localePrefixMap[locale];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* 데스크톱만 인라인 블러 (모바일은 CSS의 아이보리 단색). Lightning CSS가
     스타일시트 backdrop-filter를 제거하므로 메인 헤더처럼 인라인으로 건다 */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* 로고 톤 — 틴트 없는 블러라 뒤 배경에 맞춰 색을 바꿔야 함(메인 헤더 방식).
     brand 페이지(밝은 콘텐츠)=검정, 다크 히어로 위=흰색, 히어로 지나면=검정, method(다크)=흰색 */
  const headerRef = useRef<HTMLElement>(null);
  const [tone, setTone] = useState<"dark" | "light">("dark");
  useEffect(() => {
    if (isMobile) return;
    const compute = () => {
      const el = headerRef.current;
      if (!el) return;
      if (el.closest(".s-letter-page--brand")) return setTone("light");
      const scope = el.closest(".s-letter-page") ?? el.parentElement;
      const visual = scope?.querySelector(".s-letter__visual");
      if (!visual) return setTone("dark"); // method 등 다크 페이지
      const overHero =
        visual.getBoundingClientRect().bottom > el.getBoundingClientRect().bottom + 8;
      setTone(overHero ? "dark" : "light");
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [isMobile]);

  const cls = scrolled ? " is-scrolled" : "";
  const toneCls = isMobile ? "" : tone === "dark" ? " s-letter__header--ondark" : " s-letter__header--onlight";

  /* 메인 헤더(.header__glass)와 동일: 어두운 틴트 없이 순수 프로스티드 블러 + 하단 페이드 마스크 */
  const glassStyle: CSSProperties = isMobile
    ? {}
    : {
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        maskImage: scrolled ? "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)" : "none",
        WebkitMaskImage: scrolled ? "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)" : "none",
        transition: "backdrop-filter 0.5s ease, -webkit-backdrop-filter 0.5s ease",
      };

  return (
    <>
      {/* 노치(safe-area) 차폐 바 — 스크롤 시 void 컬러 */}
      <div className={`s-letter__safe${cls}`} aria-hidden="true" />

      <header ref={headerRef} className={`s-letter__header${cls}${toneCls}`}>
        {/* 데스크톱 프로스티드 글래스 — 블러는 absolute 자식이 담당 (메인과 동일) */}
        <div className="s-letter__glass" aria-hidden="true" style={glassStyle} />
        <Link href={homeHref} className="s-letter__symbol" aria-label={dict.aria.home}>
          <Image src="/images/logo/logo_trans_W.png" alt="" width={1000} height={829} className="sym-white" />
          <Image src="/images/logo/logo_trans.png" alt="" aria-hidden="true" width={1000} height={829} className="sym-black" />
        </Link>
        <Link href={homeHref} className="s-letter__wordmark" aria-label="Muse de Marée">
          <Image src="/images/logo/logo_text_trans_W.png" alt="MUSE DE MARÉE" width={1000} height={152} />
        </Link>
        <LetterMenu locale={locale} dict={dict} />
      </header>
    </>
  );
}
