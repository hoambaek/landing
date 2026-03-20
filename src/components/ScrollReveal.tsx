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
            requestAnimationFrame(() => {
              entry.target.classList.add("is-visible");
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    // hydration 완료 후 초기 요소 관찰 (Suspense 불일치 방지)
    // 이중 rAF로 hydration 완전 완료 후 observe 시작
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
      });
    });

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
