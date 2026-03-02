"use client";

import { useEffect } from "react";

/**
 * ScrollReveal — IntersectionObserver로 .reveal 클래스에 .is-visible 추가.
 * 렌더링 없이 사이드 이펙트만 실행하는 클라이언트 컴포넌트.
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

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
