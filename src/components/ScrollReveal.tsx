"use client";

import { useEffect } from "react";

/**
 * ScrollReveal — IntersectionObserver로 .reveal 클래스에 .is-visible 추가.
 * MutationObserver로 동적 추가된 요소(Suspense 등)도 감지.
 */
export default function ScrollReveal() {
  useEffect(() => {
    let ready = false;

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

    // reveal-scale: 30% 노출 시 트리거
    const scaleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              entry.target.classList.add("is-visible");
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    // reveal-mask: 65% 노출 시 트리거 — 마스크 리빌은 아래→위로 풀리므로
    // 이르게 시작하면 스윕이 폴드 아래(화면 밖)에서 끝나버려 체감이 안 된다
    const maskObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              entry.target.classList.add("is-visible");
            });
          }
        });
      },
      { threshold: 0.65 }
    );

    const observeElements = () => {
      document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
      document.querySelectorAll(".reveal-scale").forEach((el) => scaleObserver.observe(el));
      document.querySelectorAll(".reveal-mask-watch").forEach((el) => maskObserver.observe(el));
    };

    // 대기 중인 노드를 hydration 이후에 observe
    const pendingNodes: HTMLElement[] = [];

    // Suspense 등으로 나중에 추가되는 .reveal / .reveal-scale 요소 감지
    const mutation = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (ready) {
            // hydration 완료 후: 즉시 observe
            if (node.classList.contains("reveal")) observer.observe(node);
            if (node.classList.contains("reveal-scale")) scaleObserver.observe(node);
            node.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
            node.querySelectorAll(".reveal-scale").forEach((el) => scaleObserver.observe(el));
          } else {
            // hydration 전: 대기열에 추가
            pendingNodes.push(node);
          }
        }
      }
    });

    mutation.observe(document.body, { childList: true, subtree: true });

    // hydration 완료 후 초기 + 대기 중인 요소 모두 observe
    const timer = setTimeout(() => {
      ready = true;
      observeElements();
      // 대기열에 쌓인 노드도 observe
      for (const node of pendingNodes) {
        if (node.classList.contains("reveal")) observer.observe(node);
        if (node.classList.contains("reveal-scale")) scaleObserver.observe(node);
        node.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        node.querySelectorAll(".reveal-scale").forEach((el) => scaleObserver.observe(el));
      }
      pendingNodes.length = 0;
    }, 150);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      scaleObserver.disconnect();
      maskObserver.disconnect();
      mutation.disconnect();
    };
  }, []);

  return null;
}
