"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useHeaderScroll, useIndicatorScroll } from "@/hooks/useScrollSection";
import { locales, localePrefixMap, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { computeMeasureDays } from "@/lib/measurement";

/** 메뉴 오버레이 내비 — Paper 시안 7항목 (아카이브 넘버링). 라벨은 브랜드 고유 영문 명칭이라 전 로케일 공통 */
const MAIN_LINKS = [
  { id: "void", href: "#void", label: "Home" },
  { id: "data-archive", href: "#data-archive", label: "Ocean Cellar™" },
  { id: "the-first-record", href: "#the-first-record", label: "First Record" },
  { id: "archive", href: "#archive", label: "Collection" },
  { id: "the-maker", href: "#the-maker", label: "The Maker" },
  { id: "ocean-circle", href: "#ocean-circle", label: "Ocean Cellar Privé" },
  { id: "professionals", href: "#professionals", label: "Partnership" },
  { id: "journal", href: "https://blog.musedemaree.com", label: "Journal" },
] as const;

/** 포커스 가능한 요소 셀렉터 */
const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["header"];
}) {
  const homeHref = localePrefixMap[locale];
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, isScrolled } = useHeaderScroll();
  const { activeId } = useIndicatorScroll();

  /* 측정 경과일 — Living Data 카운터와 동일 소스로 계산(숫자 단일 출처).
     하이드레이션 불일치 방지를 위해 마운트 후 채운다. 메뉴는 마운트 뒤 열리므로
     사용자에게 빈 값이 노출되지 않는다. */
  const [measureDays, setMeasureDays] = useState<number | null>(null);
  useEffect(() => {
    setMeasureDays(computeMeasureDays());
  }, []);
  const recDays = dict.recDays.replace(
    "{n}",
    measureDays !== null ? String(measureDays) : "",
  );

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

  /* iOS는 상태바(safe area) 영역에 backdrop-filter를 그리지 않으므로,
     히어로 상태에서도 투명으로 두면 메뉴바만 떠 보인다 — 항상 틴트로 차폐해
     아래 프로스티드 바와 한 표면으로 이어지게 한다 (블러는 지원 시 보너스) */
  const safeBlurStyle: React.CSSProperties = {
    background: isScrolled
      ? "#0A0908"
      : "linear-gradient(180deg, rgba(10, 9, 8, 0.62) 0%, rgba(10, 9, 8, 0.34) 70%, rgba(10, 9, 8, 0.22) 100%)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    transition: "background 0.5s ease",
  };

  return (
    <>
      {/* ── Safe-area(노치) 바 — iOS backdrop-filter가 노치에 안 먹어 불투명 컬러로 차폐 ── */}
      <div className="header__safe-blur" aria-hidden="true" style={safeBlurStyle} />

      {/* ── Header bar ── */}
      <header className={`header${headerColorClass}${heroInitClass}`} style={headerStyle}>
        <Link href={homeHref} className="header__symbol" aria-label={dict.aria.home}>
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
        <Link href={homeHref} className="header__logo">
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
          aria-label={dict.aria.menuOpen}
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
        aria-label={dict.aria.menuLabel}
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
          <Link href={homeHref} className="menu-overlay__logo" onClick={close} aria-label={dict.aria.home}>
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
            aria-label={dict.aria.close}
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

        {/* 하단: 신조 + REC 관측 라인(좌) + 언어(우) */}
        <div className="menu-overlay__bottom">
          <div className="menu-overlay__bottom-left">
            <p className="menu-overlay__creed">{dict.creed}</p>
            <div className="menu-overlay__rec">
              <span className="menu-overlay__rec-line">{dict.recLine}</span>
              <span className="menu-overlay__rec-days">{recDays}</span>
            </div>
          </div>
          <div className="menu-overlay__lang">
            {locales.map((lc) => (
              <Link
                key={lc}
                href={localePrefixMap[lc]}
                className={lc === locale ? "menu-overlay__lang-active" : ""}
                onClick={close}
              >
                {lc === "ko" ? "KR" : lc.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
