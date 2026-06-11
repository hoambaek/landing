"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

/** 서브 페이지 헤더용 햄버거 + 전체화면 메뉴 오버레이 (랜딩 Header와 동일 동작) */

const MAIN_LINKS = [
  { id: "void", href: "/#void", label: "Home" },
  { id: "data-archive", href: "/#data-archive", label: "The Living Record" },
  { id: "the-first-record", href: "/#the-first-record", label: "The First Record" },
  { id: "archive", href: "/#archive", label: "Collection" },
  { id: "the-maker", href: "/#the-maker", label: "The Maker" },
  { id: "ocean-circle", href: "/#ocean-circle", label: "Ocean Cellar Privé" },
  { id: "professionals", href: "/#professionals", label: "Partnership" },
] as const;

const REC_LINE = "기록 · 남해 34.1434°N · 수온 13.5°C";
const REC_DAYS = "측정 771일째";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function LetterMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      menuBtnRef.current?.focus();
    });
  }, []);

  /* ESC 닫기 + 포커스 트랩 */
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

  /* 열릴 때 close 포커스 + body 스크롤 잠금 */
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

  return (
    <>
      <button
        ref={menuBtnRef}
        className="s-letter__menu"
        aria-label="메뉴 열기"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* ── 전체화면 메뉴 오버레이 ── */}
      <div
        ref={overlayRef}
        className={`menu-overlay${isOpen ? " is-open" : ""}`}
        role="dialog"
        aria-label="내비게이션 메뉴"
        aria-modal="true"
      >
        <span className="menu-overlay__watermark" aria-hidden="true">
          <Image src="/images/logo/logo_trans_W.png" alt="" width={820} height={680} />
        </span>

        <div className="menu-overlay__top">
          <Link href="/" className="menu-overlay__logo" onClick={close} aria-label="홈으로 이동">
            <Image src="/images/logo/logo_text_trans_W.png" alt="MUSE DE MARÉE" width={1000} height={152} />
          </Link>
          <button ref={closeBtnRef} className="menu-overlay__close" onClick={close} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="1" y1="1" x2="19" y2="19" stroke="#312E2A" strokeWidth="0.8" opacity="0.85" />
              <line x1="19" y1="1" x2="1" y2="19" stroke="#312E2A" strokeWidth="0.8" opacity="0.85" />
            </svg>
          </button>
        </div>

        <nav className="menu-overlay__nav">
          {MAIN_LINKS.map((link, i) => (
            <a key={link.href} href={link.href} className="menu-overlay__link" onClick={close}>
              <span className="menu-overlay__link-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="menu-overlay__link-label">{link.label}</span>
            </a>
          ))}
        </nav>

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
