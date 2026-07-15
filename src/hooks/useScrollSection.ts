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
    document.querySelectorAll<HTMLElement>("section[id], [data-tone]"),
  );
}

/** 문서 최상단 기준 절대 Y.
 *  offsetTop은 offsetParent 기준 상대값이라, transform이 걸린 조상
 *  (예: .reveal의 translateY)이 있으면 0에 가까운 값이 나와 비교가 깨진다. */
function docTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY;
}

function findSectionAt(sects: HTMLElement[], y: number): string {
  let id = "void";
  for (const s of sects) {
    if (docTop(s) <= y && s.id) id = s.id;
  }
  return id;
}

/** y 좌표 바로 위의 마지막 섹션 요소 */
function sectionElAt(sects: HTMLElement[], y: number): HTMLElement | null {
  let target: HTMLElement | null = null;
  for (const s of sects) {
    if (docTop(s) <= y) target = s;
  }
  return target;
}

/** 특정 Y 좌표가 어두운 영역인지 판별.
 *  섹션의 data-tone("light"|"dark")을 우선 사용하고, 없으면 랜딩 섹션 id 폴백. */
function isDarkAtY(sects: HTMLElement[], y: number): boolean {
  // 푸터는 다크(void) → 헤더 흰색 로고
  const footer = document.querySelector<HTMLElement>(".s-footer");
  if (footer) {
    const fTop = footer.getBoundingClientRect().top + window.scrollY;
    if (y >= fTop) return true;
  }

  const target = sectionElAt(sects, y);
  const tone = target?.dataset.tone;
  if (tone === "light") return false;
  if (tone === "dark") return true;

  // 폴백: 랜딩 섹션 id 화이트리스트
  const sectionId = target?.id ?? "void";
  if (!LIGHT_SECTIONS.has(sectionId)) return true;
  return false;
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
