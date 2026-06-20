"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useHeaderScroll, useIndicatorScroll } from "@/hooks/useScrollSection";

/** 메뉴 오버레이 내비 — Paper 시안 7항목 (아카이브 넘버링) */
const MAIN_LINKS = [
  { id: "void", href: "#void", label: "Home" },
  { id: "data-archive", href: "#data-archive", label: "The Living Record" },
  { id: "the-first-record", href: "#the-first-record", label: "The First Record" },
  { id: "archive", href: "#archive", label: "Collection" },
  { id: "the-maker", href: "#the-maker", label: "The Maker" },
  { id: "ocean-circle", href: "#ocean-circle", label: "Ocean Cellar Privé" },
  { id: "professionals", href: "#professionals", label: "Partnership" },
] as const;

/** 하단 관측 라인 — 1차 정적 스냅샷 (Phase 3에서 라이브 연동 검토) */
const REC_LINE = "기록 · 남해 34.1434°N · 수온 13.5°C";
const REC_DAYS = "측정 771일째";

/** 포커스 가능한 요소 셀렉터 */
const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, isScrolled } = useHeaderScroll();
  const { activeId } = useIndicatorScroll();

  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  /* ESC 후 포커스 복원 */
  const close = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      menuBtnRef.current?.focus();
    });
  }, []);

  /* ESC 키 닫기 + 포커스 트랩 */
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }

      if (e.key === "Tab" && overlayRef.current) {
        const focusable =
          overlayRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  /* 메뉴 열릴 때 close 버튼에 포커스 + body 스크롤 잠금 */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        closeBtnRef.current?.focus();
      });
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const headerColorClass = !isScrolled ? "" : isDark ? "" : " header--light";
  const heroInitClass = !isScrolled ? " header--hero-init" : "";

  const headerStyle: React.CSSProperties = {
    backdropFilter: isScrolled ? "blur(16px)" : "none",
    WebkitBackdropFilter: isScrolled ? "blur(16px)" : "none",
    maskImage: isScrolled ? "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)" : "none",
    WebkitMaskImage: isScrolled ? "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)" : "none",
    transition: "backdrop-filter 0.5s ease, -webkit-backdrop-filter 0.5s ease",
  };

  const safeBlurStyle: React.CSSProperties = {
    backgroundColor: isScrolled ? "#0A0908" : "transparent",
    transition: "background-color 0.5s ease",
  };

  return (
    <>
      {/* ── Safe-area(노치) 바 — iOS backdrop-filter가 노치에 안 먹어 불투명 컬러로 차폐 ── */}
      <div className="header__safe-blur" aria-hidden="true" style={safeBlurStyle} />

      {/* ── Header bar ── */}
      <header className={`header${headerColorClass}${heroInitClass}`} style={headerStyle}>
        <Link href="/" className="header__symbol" aria-label="홈으로 이동">
          <Image
            src="/images/logo/logo_trans_W.png"
            alt=""
            width={1000}
            height={829}
            className="header__symbol-img header__symbol-img--white"
          />
          <Image
            src="/images/logo/logo_trans.png"
            alt=""
            width={1000}
            height={829}
            className="header__symbol-img header__symbol-img--black"
          />
        </Link>
        <Link href="/" className="header__logo">
          <Image
            src="/images/logo/logo_text_trans_W.png"
            alt="MUSE DE MARÉE"
            width={1000}
            height={152}
            className="header__logo-img header__logo-img--white"
          />
          <Image
            src="/images/logo/logo_text_trans.png"
            alt=""
            aria-hidden="true"
            width={1000}
            height={152}
            className="header__logo-img header__logo-img--black"
          />
        </Link>
        <button
          ref={menuBtnRef}
          className={`header__menu${isOpen ? " is-active" : ""}`}
          aria-label="메뉴 열기"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* ── Fullscreen menu overlay ── */}
      <div
        ref={overlayRef}
        className={`menu-overlay${isOpen ? " is-open" : ""}`}
        role="dialog"
        aria-label="내비게이션 메뉴"
        aria-modal="true"
      >
        {/* 심볼 워터마크 */}
        <span className="menu-overlay__watermark" aria-hidden="true">
          <Image
            src="/images/logo/logo_trans_W.png"
            alt=""
            width={820}
            height={680}
          />
        </span>

        {/* 상단: 로고(중앙) + X 닫기(우) */}
        <div className="menu-overlay__top">
          <Link href="/" className="menu-overlay__logo" onClick={close} aria-label="홈으로 이동">
            <Image
              src="/images/logo/logo_text_trans_W.png"
              alt="MUSE DE MARÉE"
              width={1000}
              height={152}
            />
          </Link>
          <button
            ref={closeBtnRef}
            className="menu-overlay__close"
            onClick={close}
            aria-label="닫기"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="1" y1="1" x2="19" y2="19" stroke="#312E2A" strokeWidth="0.8" opacity="0.85" />
              <line x1="19" y1="1" x2="1" y2="19" stroke="#312E2A" strokeWidth="0.8" opacity="0.85" />
            </svg>
          </button>
        </div>

        {/* 좌측 정렬 아카이브 넘버링 내비 */}
        <nav className="menu-overlay__nav">
          {MAIN_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={`menu-overlay__link${activeId === link.id ? " is-active" : ""}`}
              onClick={close}
            >
              <span className="menu-overlay__link-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="menu-overlay__link-label">{link.label}</span>
            </a>
          ))}
        </nav>

        {/* 하단: REC 관측 라인(좌) + 언어(우) */}
        <div className="menu-overlay__bottom">
          <div className="menu-overlay__rec">
            <span className="menu-overlay__rec-line">{REC_LINE}</span>
            <span className="menu-overlay__rec-days">{REC_DAYS}</span>
          </div>
          <div className="menu-overlay__lang">
            <a href="#" className="menu-overlay__lang-active">KR</a>
            <a href="#">EN</a>
            <a href="#">FR</a>
          </div>
        </div>
      </div>
    </>
  );
}
