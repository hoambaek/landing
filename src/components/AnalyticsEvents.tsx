"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

/**
 * 전환 CTA 클릭 계측 — 클릭 위임 한 곳에서 처리 (섹션 컴포넌트 무수정).
 * cta: invite | partner | brand-book | journal, area: 클릭이 일어난 영역.
 * GA가 마운트되지 않은 환경(preview·로컬)에서는 dataLayer가 없어 자동 no-op.
 */
const CTA_PATTERNS: Array<{ cta: string; test: (href: string) => boolean }> = [
  { cta: "invite", test: (h) => /\/invite(\/|$|\?)/.test(h) },
  { cta: "partner", test: (h) => /\/partner(\/|$|\?)/.test(h) },
  { cta: "brand-book", test: (h) => /\/brand-book(\/|$|\?)/.test(h) },
  { cta: "journal", test: (h) => h.includes("blog.musedemaree.com") },
];

function areaOf(el: HTMLElement): string {
  if (el.closest(".menu-overlay")) return "menu";
  if (el.closest("footer")) return "footer";
  const section = el.closest("section[id]");
  return section?.id ?? "page";
}

export default function AnalyticsEvents() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor?.href) return;
      const match = CTA_PATTERNS.find((p) => p.test(anchor.href));
      if (!match) return;
      if (!("dataLayer" in window)) return;
      sendGAEvent("event", "cta_click", {
        cta: match.cta,
        area: areaOf(anchor),
        page: window.location.pathname,
      });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
