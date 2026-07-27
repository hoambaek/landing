"use client";

import { useEffect } from "react";

/**
 * ScrollReveal — IntersectionObserver로 .reveal 클래스에 .is-visible 추가.
 * MutationObserver로 동적 추가된 요소(Suspense 등)도 감지.
 */
export default function ScrollReveal() {
  useEffect(() => {
    let ready = false;

    /**
     * 노출 비율이 기준을 넘으면 켠다. 단, "이미 화면 위로 지나간" 요소도 켠다.
     *
     * IntersectionObserver는 프레임 경계에서 교차 상태를 샘플링한다. 빠르게 튕겨
     * 내리면 요소가 한 프레임 사이에 화면을 통째로 지나가, 기준을 넘긴 순간이
     * 관측되지 않는다. 켜기만 하고 끄지 않는 구조라 한 번 놓치면 영영 가려진 채
     * 남는다 — .reveal-mask는 clip-path로 완전히 덮으므로 이미지가 로딩되지 않은
     * 것처럼 보인다.
     *
     * boundingClientRect.top < 0은 요소 윗변이 화면 위로 넘어갔다는 뜻이다.
     * 그때는 연출을 보여줄 기회가 이미 지났으니 늦게라도 켜서 내용을 드러낸다.
     * 아직 아래에 있는 요소는 top이 양수라 여기 걸리지 않는다.
     *
     * 임계값 목록에 0을 넣어야 화면을 벗어나는 순간에도 콜백이 온다.
     */
    const revealAt = (ratio: number, options?: IntersectionObserverInit) =>
      new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            const passedTop = entry.boundingClientRect.top < 0;
            if (entry.intersectionRatio < ratio && !passedTop) return;
            requestAnimationFrame(() => {
              entry.target.classList.add("is-visible");
            });
            obs.unobserve(entry.target); // 한 번 켜면 다시 볼 일이 없다
          });
        },
        { threshold: [0, ratio], ...options }
      );

    const observer = revealAt(0.2, { rootMargin: "0px 0px -8% 0px" });

    // reveal-scale: 30% 노출 시 트리거
    const scaleObserver = revealAt(0.3);

    // reveal-mask: 65% 노출 시 트리거 — 마스크 리빌은 아래→위로 풀리므로
    // 이르게 시작하면 스윕이 폴드 아래(화면 밖)에서 끝나버려 체감이 안 된다
    const maskObserver = revealAt(0.65);

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
