"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** 케이지 계류 수심 — Living Record 로그의 고정값(30m)과 동일 */
const CAGE_DEPTH_M = 30;

/**
 * DepthGauge — 수심 게이지 스크롤 레일 (데스크톱 전용).
 *
 * 하강 전환(히어로 핀)이 시작되면 우측에 나타나 스크롤 진행에 따라
 * 0m → 30m를 카운트하고, The Living Record를 벗어나면 사라진다.
 * 수면→심해 구간에만 존재하는 서사 장치 — 이후의 밝은 섹션에는 출현하지 않는다.
 */
export default function DepthGauge() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const root = rootRef.current;
      const hero = document.getElementById("void");
      const living = document.getElementById("data-archive");
      if (!root || !hero || !living) return;

      const num = root.querySelector<HTMLElement>(".depth-gauge__num");
      const marker = root.querySelector<HTMLElement>(".depth-gauge__marker");
      const track = root.querySelector<HTMLElement>(".depth-gauge__track");
      if (!num || !marker || !track) return;

      let visible = false;
      let lastDepth = -1;

      ScrollTrigger.create({
        // 핀 스페이서 자동 보정에 기대지 않고 리프레시 시점의 실제 레이아웃으로 계산:
        // 시작 = 페이지 최상단(하강 시작), 끝 = Living Record 하단이 뷰포트 하단에 닿는 지점
        start: 0,
        end: () =>
          living.getBoundingClientRect().top +
          window.scrollY +
          living.offsetHeight -
          window.innerHeight,
        // DescentEffect의 핀(스페이서)이 먼저 계산된 뒤 위치를 잡도록 뒤로 미룸
        refreshPriority: -1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const p = self.progress;

          // 하강 중에만 표시 (정지 상태의 수면·이후 섹션에서는 숨김)
          const shouldShow = p > 0.02 && p < 0.98;
          if (shouldShow !== visible) {
            visible = shouldShow;
            root.classList.toggle("is-visible", shouldShow);
          }

          const depth = Math.round(p * CAGE_DEPTH_M);
          if (depth !== lastDepth) {
            lastDepth = depth;
            num.textContent = String(depth);
          }
          const travel = track.clientHeight - marker.clientHeight;
          marker.style.transform = `translateY(${(p * travel).toFixed(1)}px)`;
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="depth-gauge" aria-hidden="true">
      <span className="depth-gauge__label">depth</span>
      <div className="depth-gauge__track">
        <span className="depth-gauge__marker" />
      </div>
      <span className="depth-gauge__readout">
        <span className="depth-gauge__num">0</span>
        <span className="depth-gauge__unit">m</span>
      </span>
    </div>
  );
}
