"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * DescentEffect — 수면(Hero) → 심해(Living Record) 하강 전환.
 *
 * 히어로를 스크롤에 핀 고정하고, 스크럽 타임라인으로
 * ① 배경이 위로 밀리며 살짝 확대(가라앉는 카메라) + 어두워짐
 * ② 카피가 먼저 사라짐
 * ③ Descent Veil(심해 그라디언트)이 차오르며 s-living 지반색으로 잠김
 *
 * 데스크톱 + 모션 허용 환경에서만 동작 (gsap.matchMedia).
 * 모바일은 iOS 26 전면 fixed 금지 규칙에 따라 기존 하드 컷 유지.
 */
export default function DescentEffect() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
      () => {
        const hero = document.getElementById("void");
        if (!hero) return;

        const bg = hero.querySelector<HTMLElement>(".s-void__bg");
        const content = hero.querySelector<HTMLElement>(".s-void__content");
        const signature = hero.querySelector<HTMLElement>(".s-void__signature");
        const veil = hero.querySelector<HTMLElement>(".s-void__veil");
        if (!bg || !veil) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "+=110%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 배경: 수면이 위로 지나가며 살짝 확대 + 감광 (하강하는 카메라)
        // fromTo로 시작 filter를 명시 — 미지정 시 GSAP이 brightness(0)에서 역보간함.
        // scale 1.1(상하 5% 여유) 안에서만 yPercent -5 이동 → 하단 지반색 노출 방지
        tl.fromTo(
          bg,
          { yPercent: 0, scale: 1, filter: "brightness(1) saturate(1)" },
          {
            yPercent: -5,
            scale: 1.1,
            filter: "brightness(0.45) saturate(0.62)",
            ease: "none",
            duration: 1,
          },
          0
        );

        // 카피·서명: 수면을 떠나며 초반에 먼저 사라짐
        // (.s-void__content는 CSS transform(translateY)을 쓰므로 opacity만 조작)
        // 서명은 fromTo로 시작값 1을 명시 — 히어로 인트로(CSS 애니메이션)의
        // 지연 구간(opacity 0)을 GSAP이 시작값으로 캡처하면 0→0 트윈이 되어
        // 영구히 사라지는 버그가 있다 (CSS 애니메이션이 인라인 스타일보다 우선하므로
        // 인라인 opacity:1이 인트로 페이드를 방해하지도 않는다)
        if (content) tl.to(content, { opacity: 0, ease: "none", duration: 0.3 }, 0);
        if (signature)
          tl.fromTo(signature, { opacity: 1 }, { opacity: 0, ease: "none", duration: 0.3 }, 0);

        // 심해 베일: 뒤이어 차오르며 s-living 지반색(#0A0908)으로 잠김
        tl.to(veil, { opacity: 1, ease: "none", duration: 0.75 }, 0.25);
      }
    );

    return () => mm.revert();
  }, []);

  return null;
}
