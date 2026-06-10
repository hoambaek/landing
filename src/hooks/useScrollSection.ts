"use client";

import { useEffect, useState } from "react";

/* 라이트 배경 섹션 — Collection(archive) · The Maker.
   Partnership(professionals)은 다크 이미지 섹션이라 제외 → 헤더 흰색.
   The First Record는 다크→라이트 복합이라 별도 처리(Phase 4). */
const LIGHT_SECTIONS = new Set(["archive", "the-maker"]);

/* ── Module-level shared scroll infrastructure ── */
let ticking = false;
const callbacks = new Set<() => void>();

function getSections(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>("section[id]"),
  );
}

function findSectionAt(sects: HTMLElement[], y: number): string {
  let id = "void";
  for (const s of sects) {
    if (s.offsetTop <= y) id = s.id;
  }
  return id;
}

/** 특정 Y 좌표가 어두운 영역인지 판별 */
function isDarkAtY(sects: HTMLElement[], y: number): boolean {
  // 라이트 푸터 영역은 밝음 → 헤더 검정 로고
  const footer = document.querySelector<HTMLElement>(".s-footer");
  if (footer) {
    const fTop = footer.getBoundingClientRect().top + window.scrollY;
    if (y >= fTop) return false;
  }

  const sectionId = findSectionAt(sects, y);

  // 기본 어두운 섹션
  if (!LIGHT_SECTIONS.has(sectionId)) return true;

  return false; // 밝은 섹션 텍스트 영역
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      callbacks.forEach((fn) => fn());
      ticking = false;
    });
    ticking = true;
  }
}

function subscribe(cb: () => void) {
  if (callbacks.size === 0) {
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  callbacks.add(cb);
  return () => {
    callbacks.delete(cb);
    if (callbacks.size === 0) {
      window.removeEventListener("scroll", onScroll);
    }
  };
}

/** Header scroll state — single shared listener with rAF throttle */
export function useHeaderScroll() {
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function update() {
      const sects = getSections();
      const scrollY = window.scrollY;
      const headerY = scrollY + 60;

      const hero = document.getElementById("void");
      setIsScrolled(hero ? scrollY > hero.offsetHeight * 0.5 : scrollY > 0);
      setIsDark(isDarkAtY(sects, headerY));
    }

    requestAnimationFrame(update);
    return subscribe(update);
  }, []);

  return { isDark, isScrolled };
}

/** SectionIndicator scroll state — shares the same listener */
export function useIndicatorScroll() {
  const [activeId, setActiveId] = useState("void");
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    function update() {
      const sects = getSections();
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // 스크롤이 최상단이면 항상 void (히어로)
      if (scrollY < 10) {
        setActiveId("void");
        setIsLight(false);
        return;
      }

      setActiveId(findSectionAt(sects, scrollY + vh * 0.4));
      setIsLight(!isDarkAtY(sects, scrollY + vh * 0.5));
    }

    requestAnimationFrame(update);
    return subscribe(update);
  }, []);

  return { activeId, isLight };
}
