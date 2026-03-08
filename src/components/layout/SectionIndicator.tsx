"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "void" },
  { id: "observation" },
  { id: "data-archive" },
  { id: "archive" },
  { id: "the-maker" },
  { id: "ocean-circle" },
  { id: "professionals" },
] as const;

/** 각 섹션별 미니멀 심볼 (12×12 SVG) */
const SYMBOLS: Record<string, React.ReactNode> = {
  void: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  ),
  observation: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
    </svg>
  ),
  "data-archive": (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1 6 Q3 3, 5 6 Q7 9, 9 5 Q10 4, 11 5" stroke="currentColor" strokeWidth="0.75" fill="none" />
    </svg>
  ),
  "the-maker": (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="3" y="3" width="6" height="6" stroke="currentColor" strokeWidth="0.75" transform="rotate(45 6 6)" />
    </svg>
  ),
  archive: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="2" y="2" width="3" height="3" stroke="currentColor" strokeWidth="0.75" />
      <rect x="7" y="2" width="3" height="3" stroke="currentColor" strokeWidth="0.75" />
      <rect x="2" y="7" width="3" height="3" stroke="currentColor" strokeWidth="0.75" />
      <rect x="7" y="7" width="3" height="3" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  ),
  "ocean-circle": (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  ),
  professionals: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="0.75" />
      <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  ),
};

/** 밝은 배경 섹션 — 헤더와 동일 */
const LIGHT_SECTIONS = new Set(["observation", "the-maker", "archive"]);

const GAP_AFTER = 4;

function getActiveSection(): string {
  if (typeof window === "undefined") return "void";
  const center = window.scrollY + window.innerHeight * 0.4;
  let current = "void";
  document.querySelectorAll<HTMLElement>("section[id]").forEach((section) => {
    if (section.offsetTop <= center) current = section.id;
  });
  return current;
}

function getIndicatorSection(): string {
  if (typeof window === "undefined") return "void";
  const indicatorY = window.scrollY + window.innerHeight * 0.5;
  let current = "void";
  document.querySelectorAll<HTMLElement>("section[id]").forEach((section) => {
    if (section.offsetTop <= indicatorY) current = section.id;
  });
  return current;
}

export default function SectionIndicator() {
  const [activeId, setActiveId] = useState("void");
  const [isLight, setIsLight] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    function handleUpdate() {
      setActiveId(getActiveSection());
      const sectionAtIndicator = getIndicatorSection();
      setIsLight(LIGHT_SECTIONS.has(sectionAtIndicator));
      ticking.current = false;
    }

    function onScroll() {
      if (!ticking.current) {
        requestAnimationFrame(handleUpdate);
        ticking.current = true;
      }
    }

    requestAnimationFrame(handleUpdate);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`indicator${isLight ? " indicator--light" : ""}`}>
      {SECTIONS.map((s, i) => (
        <div key={s.id}>
          {i === GAP_AFTER + 1 && <div className="indicator__gap" />}
          <div
            className={`indicator__dot${activeId === s.id ? " is-active" : ""}`}
            data-section={s.id}
          >
            {activeId === s.id && (
              <span className="indicator__symbol">{SYMBOLS[s.id]}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
