"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  const homePath = homeHref === "" ? "/" : homeHref;
  const pathname = usePathname();
  const isHome = pathname === homePath;
  /* 서브페이지에서 메뉴를 열면 앵커 링크는 홈으로 이동해야 한다(#void → /#void). */
  const linkFor = useCallback(
    (anchor: string) => (isHome ? anchor : `${homePath}${anchor}`),
    [isHome, homePath],
  );
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, isScrolled } = useHeaderScroll();
  const { activeId } = useIndicatorScroll();

  /* 메뉴 오버레이는 portal로 body 직속 — 모바일 셸(#scroll-root) 안의 fixed는
     iOS가 absolute처럼 취급해 스크롤과 함께 사라지기 때문 */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* 로고 클릭: 이미 랜딩이면 최상단으로 스크롤 (셸: scroll-root / 데스크톱: window) */
  const onLogoClick = useCallback(
    (e: React.MouseEvent) => {
      const homePath = homeHref === "" ? "/" : homeHref;
      if (window.location.pathname === homePath) {
        e.preventDefault();
        const root = document.getElementById("scroll-root");
        if (root && root.scrollHeight > root.clientHeight) {
          root.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    },
    [homeHref],
  );

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

  /* 로고 색은 배경 밝기(isDark)로만 결정 — 스크롤 전(상단)이라도 밝은 히어로/패널이면 검정.
     (랜딩 다크 히어로는 isDark=true라 흰색 유지) */
  const headerColorClass = isDark ? "" : " header--light";
  const heroInitClass = !isScrolled ? " header--hero-init" : "";

  /* 모바일 여부 — 블러 인라인 스타일을 걸지 않기 위한 분기
     (Lightning CSS가 스타일시트의 backdrop-filter를 변형해 CSS override 불가) */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);


  /* iOS 26 사파리는 상단 fixed 요소의 background·backdrop-filter를 직접 읽어
     상태바 틴트를 정하는데, fixed 요소 자체에 걸려 있으면 샘플링이 깨져
     상태바 영역이 원본 콘텐츠로 뚫린다. 처방: fixed 래퍼는 완전 투명으로 두고
     시각 효과(블러·배경)는 전부 position:absolute 자식에게만 건다. */
  /* 모바일: 블러 미사용 — 단색 배경은 CSS(.header__glass 모바일 규칙)가 담당.
     데스크톱: 스크롤 시 프로스티드 블러 + 하단 페이드 마스크 */
  const glassStyle: React.CSSProperties = isMobile
    ? {}
    : {
        backdropFilter: isScrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(16px)" : "none",
        maskImage: isScrolled ? "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)" : "none",
        WebkitMaskImage: isScrolled ? "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)" : "none",
        transition: "backdrop-filter 0.5s ease, -webkit-backdrop-filter 0.5s ease",
      };

  /* 상태바(safe area) 차폐 — 데스크톱 전용(모바일은 단색 헤더가 y=0부터 덮음) */
  const safeFillStyle: React.CSSProperties = {
    background: isScrolled
      ? "#0A0908"
      : "linear-gradient(180deg, rgba(10, 9, 8, 0.62) 0%, rgba(10, 9, 8, 0.34) 70%, rgba(10, 9, 8, 0.22) 100%)",
    transition: "background 0.5s ease",
  };

  return (
    <>
      {/* ── Safe-area(노치) 차폐 — fixed 래퍼는 투명, 틴트는 absolute 자식 (데스크톱 전용) ── */}
      <div className="header__safe-blur" aria-hidden="true">
        <div className="header__safe-blur-fill" style={safeFillStyle} />
      </div>

      {/* ── Header bar — 블러는 absolute 자식(.header__glass)이 담당 ── */}
      <header className={`header${headerColorClass}${heroInitClass}`}>
        <div className="header__glass" aria-hidden="true" style={glassStyle} />
        <Link href={homeHref} className="header__symbol" aria-label={dict.aria.home} onClick={onLogoClick}>
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
        <Link href={homeHref} className="header__logo" onClick={onLogoClick}>
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

      {/* ── Fullscreen menu overlay — portal로 body 직속 렌더 ── */}
      {mounted && createPortal(
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
              href={link.href.startsWith("#") ? linkFor(link.href) : link.href}
              className={`menu-overlay__link${isHome && activeId === link.id ? " is-active" : ""}`}
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
      </div>,
      document.body)}
    </>
  );
}
