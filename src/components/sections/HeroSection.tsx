"use client";

import { useEffect, useRef, useCallback } from "react";

/** 파티클 데이터 — 와이어프레임과 동일 */
const PARTICLES = [
  { left: "15%", duration: "18s", delay: "0s", size: 1.5 },
  { left: "35%", duration: "22s", delay: "3s", size: 2 },
  { left: "55%", duration: "20s", delay: "7s", size: 1 },
  { left: "72%", duration: "25s", delay: "2s", size: 2 },
  { left: "88%", duration: "19s", delay: "5s", size: 1.5 },
  { left: "25%", duration: "23s", delay: "10s", size: 1 },
  { left: "65%", duration: "21s", delay: "8s", size: 2 },
] as const;

/**
 * 히어로 상태 머신:
 * IDLE → (첫 스크롤) → VIDEO_PLAYING → (영상 종료) → DONE → (두 번째 스크롤) → 다음 섹션
 */
type HeroPhase = "IDLE" | "VIDEO_PLAYING" | "DONE";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomBlurRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const h2Ref = useRef<HTMLDivElement>(null);

  const phaseRef = useRef<HeroPhase>("IDLE");
  const wheelLocked = useRef(false);
  const lastPhaseChange = useRef(0);

  /** 다음 섹션으로 부드럽게 스크롤 */
  const scrollToNext = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const nextSection = section.nextElementSibling as HTMLElement | null;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  /** 영상 재생 시작 */
  const startVideo = useCallback(() => {
    if (phaseRef.current !== "IDLE") return;
    phaseRef.current = "VIDEO_PLAYING";

    // 스크롤 인디케이터 숨기기
    if (scrollRef.current) {
      // 현재 위치 스냅샷
      const rect = scrollRef.current.getBoundingClientRect();
      // 모든 애니메이션 제거
      scrollRef.current.style.animation = "none";
      const textEl = scrollRef.current.querySelector(".s-void__scroll-text") as HTMLElement | null;
      if (textEl) textEl.style.animation = "none";
      // 위치 고정 (움직임 방지)
      scrollRef.current.style.position = "fixed";
      scrollRef.current.style.left = `${rect.left}px`;
      scrollRef.current.style.top = `${rect.top}px`;
      scrollRef.current.style.transform = "none";
      scrollRef.current.style.opacity = "1";
      void scrollRef.current.offsetHeight;
      scrollRef.current.style.transition = "opacity 0.6s ease";
      scrollRef.current.style.opacity = "0";
      scrollRef.current.style.pointerEvents = "none";
    }

    // 텍스트 페이드아웃
    if (contentRef.current) {
      contentRef.current.style.transition = "opacity 0.8s ease";
      contentRef.current.style.opacity = "0";
    }

    // 영상 페이드인 + 재생
    if (videoRef.current) {
      videoRef.current.style.transition = "opacity 0.8s ease";
      videoRef.current.style.opacity = "1";
      videoRef.current.play();
    }
  }, []);

  /** 영상 종료 → h2 이미지 디졸브 */
  const onVideoEnded = useCallback(() => {
    phaseRef.current = "DONE";

    if (videoRef.current) {
      videoRef.current.style.transition = "opacity 1.5s ease";
      videoRef.current.style.opacity = "0";
    }
    if (h2Ref.current) {
      h2Ref.current.style.transition = "opacity 1.5s ease";
      h2Ref.current.style.opacity = "1";
    }
    if (bottomBlurRef.current) {
      bottomBlurRef.current.style.transition = "opacity 1.5s ease";
      bottomBlurRef.current.style.opacity = "1";
    }
    // 텍스트 복원
    if (contentRef.current) {
      contentRef.current.style.transition = "opacity 1.5s ease";
      contentRef.current.style.opacity = "1";
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    video?.addEventListener("ended", onVideoEnded);

    /** wheel 이벤트로 단계 전환 */
    function onWheel(e: WheelEvent) {
      // 아래로 스크롤만 처리
      if (e.deltaY <= 0) return;

      // 히어로 영역에서만 동작
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom <= 0) return; // 이미 지나감

      const phase = phaseRef.current;

      const now = Date.now();

      if (phase === "IDLE") {
        // 첫 스크롤 → 영상 재생
        e.preventDefault();
        lastPhaseChange.current = now;
        startVideo();
        return;
      }

      // 첫 스크롤 후 800ms 쿨다운 — 연속 wheel 이벤트 무시
      if (now - lastPhaseChange.current < 800) {
        e.preventDefault();
        return;
      }

      if (phase === "VIDEO_PLAYING" || phase === "DONE") {
        // 자연스러운 스크롤 허용
        return;
      }
    }

    /** 터치 지원 */
    let touchStartY = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }
    function onTouchEnd(e: TouchEvent) {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (deltaY < 30) return; // 최소 swipe 거리

      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom <= 0) return;

      const phase = phaseRef.current;
      if (phase === "IDLE") {
        startVideo();
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      video?.removeEventListener("ended", onVideoEnded);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [startVideo, onVideoEnded, scrollToNext]);

  return (
    <section id="void" className="s-void" ref={sectionRef}>
      <div className="s-void__pin">
        {/* 배경 이미지 */}
        <div className="s-void__bg" />

        {/* 배경 영상 */}
        <video
          ref={videoRef}
          className="s-void__video"
          src="/mov/landing.mp4"
          muted
          playsInline
          preload="metadata"
        />

        {/* 영상 종료 후 디졸브 이미지 */}
        <div className="s-void__h2" ref={h2Ref} />

        {/* 파티클 */}
        <div className="s-void__particles">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: p.left,
                animationDuration: p.duration,
                animationDelay: p.delay,
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
            />
          ))}
        </div>

        {/* 콘텐츠 */}
        <div className="s-void__content" ref={contentRef}>
          <h1 className="s-void__headline">두 개의 떼루아</h1>
          <p className="s-void__sub">한국 바다가 숙성한 샴페인</p>
        </div>

        {/* 하단 블러 */}
        <div className="s-void__bottom-blur" ref={bottomBlurRef} />

        {/* 스크롤 인디케이터 */}
        <div className="s-void__scroll" ref={scrollRef}>
          <span className="s-void__scroll-text">스크롤하기</span>
        </div>
      </div>
    </section>
  );
}
