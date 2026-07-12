"use client";

import { useEffect } from "react";

/**
 * WordReveal — [data-word-reveal] 요소의 텍스트를 단어(기본) 또는
 * 글자("letters") 단위 span으로 분해하고, 뷰포트 진입 시 시차를 두고
 * 떠오르게 한다 (CSS transition 기반, 의존성 없음).
 *
 * - 원문은 aria-label로 보존, span들은 aria-hidden (스크린리더 무손상)
 * - prefers-reduced-motion이면 분해하지 않고 그대로 둔다
 * - 스타일: globals.css의 .wr-word 블록
 */
export default function WordReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = document.querySelectorAll<HTMLElement>("[data-word-reveal]");
    if (!els.length) return;

    els.forEach((el) => {
      if (el.dataset.wrSplit) return;
      el.dataset.wrSplit = "1";

      const text = el.textContent ?? "";
      el.setAttribute("aria-label", text.trim());

      const letterMode = el.dataset.wordReveal === "letters";
      const parts = letterMode
        ? Array.from(text)
        : text.split(/(\s+)/); // 공백을 보존한 단어 분해

      el.textContent = "";
      let idx = 0;
      for (const part of parts) {
        if (/^\s+$/.test(part) || part === "") {
          el.appendChild(document.createTextNode(part));
          continue;
        }
        if (letterMode && part === " ") {
          el.appendChild(document.createTextNode(" "));
          continue;
        }
        const span = document.createElement("span");
        span.className = "wr-word";
        span.setAttribute("aria-hidden", "true");
        span.style.transitionDelay = `${(idx * (letterMode ? 0.035 : 0.07)).toFixed(3)}s`;
        span.textContent = part;
        el.appendChild(span);
        idx += 1;
      }
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("wr-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
