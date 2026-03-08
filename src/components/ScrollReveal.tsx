"use client";

import { useEffect } from "react";

/**
 * ScrollReveal — IntersectionObserver로 .reveal 클래스에 .is-visible 추가.
 * MutationObserver로 동적 추가된 요소(Suspense 등)도 감지.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    // 초기 요소 관찰
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    // Suspense 등으로 나중에 추가되는 .reveal 요소 감지
    const mutation = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.classList.contains("reveal")) {
            observer.observe(node);
          }
          node.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        }
      }
    });

    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return null;
}
