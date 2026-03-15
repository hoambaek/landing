"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useHeaderScroll } from "@/hooks/useScrollSection";

/** 메인 섹션 링크 */
const MAIN_LINKS = [
  { href: "#void", label: "Home", tag: "" },
  { href: "#data-archive", label: "Living Data", tag: "" },
  { href: "#archive", label: "Collection", tag: "" },
  { href: "#the-maker", label: "The Maker", tag: "" },
  { href: "#ocean-circle", label: "Ocean Cellar", tag: "membership" },
  { href: "#professionals", label: "Partnership", tag: "" },
] as const;

/** 포커스 가능한 요소 셀렉터 */
const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, isScrolled } = useHeaderScroll();

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

  return (
    <>
      {/* ── Header bar ── */}
      <header className={`header${headerColorClass}${heroInitClass}`} style={headerStyle}>
        <Link href="/" className="header__logo">
          MUSE DE MAREE
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
        {/* 상단: 로고 + X 닫기 */}
        <div className="menu-overlay__header">
          <span className="menu-overlay__logo">MUSE DE MAREE</span>
          <button
            ref={closeBtnRef}
            className="menu-overlay__close"
            onClick={close}
            aria-label="닫기"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="1" y1="1" x2="19" y2="19" stroke="currentColor" strokeWidth="0.75" />
              <line x1="19" y1="1" x2="1" y2="19" stroke="currentColor" strokeWidth="0.75" />
            </svg>
          </button>
        </div>

        {/* 중앙 정렬 네비게이션 */}
        <div className="menu-overlay__body">
          <nav className="menu-overlay__nav">
            {MAIN_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className="menu-overlay__link"
                onClick={close}
                data-index={i}
              >
                <span className="menu-overlay__link-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="menu-overlay__link-label">{link.label}</span>
                {link.tag && (
                  <span className="menu-overlay__link-tag">{link.tag}</span>
                )}
              </a>
            ))}
          </nav>
        </div>

        {/* 하단: 언어 선택 */}
        <div className="menu-overlay__footer">
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
