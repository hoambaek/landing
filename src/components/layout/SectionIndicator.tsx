"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "void" },
  { id: "observation" },
  { id: "data-archive" },
  { id: "the-maker" },
  { id: "archive" },
  { id: "ocean-circle" },
  { id: "professionals" },
] as const;

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

export default function SectionIndicator() {
  const [activeId, setActiveId] = useState("void");
  const ticking = useRef(false);

  useEffect(() => {
    function handleUpdate() {
      setActiveId(getActiveSection());
      ticking.current = false;
    }

    function onScroll() {
      if (!ticking.current) {
        requestAnimationFrame(handleUpdate);
        ticking.current = true;
      }
    }

    // 초기 실행을 rAF 내부에서 처리
    requestAnimationFrame(handleUpdate);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="indicator">
      {SECTIONS.map((s, i) => (
        <div key={s.id}>
          {i === GAP_AFTER + 1 && <div className="indicator__gap" />}
          <div
            className={`indicator__dot${activeId === s.id ? " is-active" : ""}`}
            data-section={s.id}
          />
        </div>
      ))}
    </div>
  );
}
