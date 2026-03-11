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

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomBlurRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const h2Ref = useRef<HTMLDivElement>(null);
  const videoStarted = useRef(false);
  const videoEnded = useRef(false);
  const animCleared = useRef(false);

  /**
   * CSS animation을 중단하고 현재 computed 값을 인라인 스타일로 고정.
   * 스크롤 시 opacity/transform을 JS로 제어하기 위해 필요.
   */
  const clearAnimations = useCallback(() => {
    if (animCleared.current) return;

    const targets = [
      contentRef.current,
      scrollRef.current,
      ...(contentRef.current
        ? Array.from(contentRef.current.querySelectorAll("*"))
        : []),
    ].filter(Boolean) as HTMLElement[];

    // 현재 computed 값 스냅샷
    const snapshots = targets.map((el) => {
      const cs = getComputedStyle(el);
      return { el, opacity: cs.opacity, transform: cs.transform };
    });

    // animation 제거
    targets.forEach((el) => {
      el.style.animation = "none";
    });

    // 스냅샷 복원 (깜빡임 방지)
    snapshots.forEach(({ el, opacity, transform }) => {
      el.style.opacity = opacity;
      el.style.transform = transform === "none" ? "" : transform;
    });

    animCleared.current = true;
  }, []);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const section = sectionRef.current;
      const content = contentRef.current;
      const scrollInd = scrollRef.current;

      if (!section) return;

      // 첫 스크롤 시 animation 제거
      if (!animCleared.current && scrollY > 0) {
        clearAnimations();
      }

      // 스크롤 인디케이터 페이드아웃
      if (scrollInd) {
        scrollInd.style.opacity = scrollY > 10 ? "0" : "";
        scrollInd.style.transition = "opacity 0.6s ease";
      }

      const heroH = section.offsetHeight * 0.5;
      const progress = Math.min(scrollY / heroH, 1);
      const opacity = 1 - progress;

      // 영상: 스크롤 시작과 함께 페이드인 + 재생
      if (videoRef.current) {
        if (scrollY > 0 && !videoStarted.current) {
          videoStarted.current = true;
          videoEnded.current = false;
          videoRef.current.style.opacity = "1";
          videoRef.current.play();
        }
        if (scrollY === 0) {
          videoStarted.current = false;
          videoEnded.current = false;
          videoRef.current.style.transition = "none";
          videoRef.current.style.opacity = "0";
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
          if (h2Ref.current) {
            h2Ref.current.style.transition = "none";
            h2Ref.current.style.opacity = "0";
          }
          if (contentRef.current) {
            contentRef.current.style.transition = "none";
          }
          if (scrollRef.current) {
            scrollRef.current.style.display = "";
          }
          if (bottomBlurRef.current) {
            bottomBlurRef.current.style.transition = "none";
            bottomBlurRef.current.style.opacity = "0";
          }
        }
      }
    }

    // 영상 종료 시 h2.webp로 디졸브
    const video = videoRef.current;
    function onVideoEnded() {
      videoEnded.current = true;
      if (videoRef.current) {
        videoRef.current.style.transition = "opacity 1.5s ease";
        videoRef.current.style.opacity = "0";
      }
      if (h2Ref.current) {
        h2Ref.current.style.transition = "opacity 1.5s ease";
        h2Ref.current.style.opacity = "1";
      }
      // 하단 블러 함께 표시
      if (bottomBlurRef.current) {
        bottomBlurRef.current.style.transition = "opacity 1.5s ease";
        bottomBlurRef.current.style.opacity = "1";
      }
      // 텍스트 복원
      if (contentRef.current) {
        contentRef.current.style.transition = "opacity 1.5s ease";
        contentRef.current.style.opacity = "1";
      }
    }
    video?.addEventListener("ended", onVideoEnded);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      video?.removeEventListener("ended", onVideoEnded);
    };
  }, [clearAnimations]);

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
          <h1 className="s-void__headline" ref={headlineRef}>두 개의 떼루아</h1>
          <p className="s-void__sub" ref={subRef}>한국 바다가 숙성한 샴페인</p>
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
