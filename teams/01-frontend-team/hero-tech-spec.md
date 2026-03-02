# Muse de Marée — Hero Section Technical Specification

**작성일**: 2026-02-22
**담당**: Frontend Team
**버전**: 1.0.0
**상태**: 초안 (CEO 확인 전)

---

## 개요

히어로 섹션은 세 단계(Phase 1 지상 → Transition 수면 관통 → Phase 2 심해)로 구성된 몰입형 스크롤 경험이다. 관람자가 직접 바다 속으로 잠수하는 POV 시점을 GSAP ScrollTrigger로 구현한다.

> **수면 전환 시각 효과 및 Phase 2 카피 오버레이 스타일은 미확정.** 디자인 스타일 확정 후 별도 스펙 추가 예정.

---

## 1. 컴포넌트 트리 구조

```
<HeroSection>                          # 메인 컨테이너 (300vh height)
├── <Phase1Surface>                    # 지상 레이어 (sticky, 100vh)
│   ├── <SurfaceBackground>            # 정적 배경 이미지 (화석 산호 + 오브제)
│   ├── <BrandLogo>                    # 로고 (Framer Motion 스태거 페이드인)
│   └── <HeroTitle>                    # 히어로 타이틀 (Framer Motion 스태거 페이드인)
│
├── <WaterTransition>                  # 수면 관통 전환 레이어 (sticky, 100vh)
│   ├── [시각 효과 미확정]              # 스타일 확정 후 추가
│   └── <BubbleParticles>              # Framer Motion 기포 파티클 시스템
│
└── <Phase2Abyss>                      # 심해 레이어 (sticky, 100vh)
    ├── <AbyssVideoBackground>         # 브랜딩 영상 루프 (WebM/MP4)
    ├── [카피 오버레이 스타일 미확정]   # 스타일 확정 후 추가
    └── <AbyssCopyBlock>               # 3줄 감각 묘사 텍스트 (순차 페이드인)
```

### 상태 관리 흐름

```typescript
// 스크롤 진행률을 전역 상태로 관리 (Zustand 또는 Context)
interface HeroScrollState {
  scrollProgress: number;      // 0 ~ 1 (전체 히어로 섹션 기준)
  phase: 'surface' | 'transition' | 'abyss';
  waterDepth: number;          // 0 ~ 1 (수면 관통 진행률)
}
```

---

## 2. GSAP ScrollTrigger 스크롤 전환 코드 스펙

### 2-1. 기본 ScrollTrigger 설정

```typescript
// components/hero/HeroSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const phase1Ref = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);
  const waterDepthRef = useRef({ value: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ─── Phase 1 → Transition: 수면 진입 타임라인 ───────────────────────
      const surfaceTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '33% top',           // 전체 히어로의 1/3 지점
          scrub: 1.2,               // 스크롤과 1.2초 지연 스무딩
          pin: phase1Ref.current,
          pinSpacing: false,
        },
      });

      surfaceTimeline
        .to(phase1Ref.current, {
          opacity: 0,
          scale: 1.05,              // 살짝 확대되며 사라짐
          duration: 1,
        })
        .to('.hero-logo', {
          y: -40,
          opacity: 0,
          duration: 0.6,
        }, '<0.2');

      // ─── Transition: 수면 관통 타임라인 ─────────────────────────────────
      const waterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: '33% top',
          end: '66% top',           // 전체 히어로의 2/3 지점
          scrub: 0.8,
          pin: transitionRef.current,
          pinSpacing: false,
          onUpdate: (self) => {
            // 수면 진행률 이벤트 — BubbleParticles 활성화 용
            waterDepthRef.current.value = self.progress;
            window.dispatchEvent(
              new CustomEvent('waterDepthChange', {
                detail: { depth: self.progress },
              })
            );
          },
        },
      });

      waterTimeline
        .to('.depth-overlay', {
          // 심해 색조 오버레이: 투명 → 딥 틸 (#3D5A56 계열)
          backgroundColor: 'rgba(61, 90, 86, 0.85)',
          duration: 1,
        }, '<');

      // ─── Transition → Phase 2: 심해 진입 ────────────────────────────────
      const abyssTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: '66% top',
          end: '100% top',
          scrub: 1.0,
          pin: phase2Ref.current,
          pinSpacing: false,
        },
      });

      abyssTimeline
        .from(phase2Ref.current, {
          opacity: 0,
          duration: 0.5,
        })
        .from('.abyss-copy-line-1', {
          y: 30,
          opacity: 0,
          duration: 0.8,
        }, '0.3')
        .from('.abyss-copy-line-2', {
          y: 30,
          opacity: 0,
          duration: 0.8,
        }, '0.6')
        .from('.abyss-copy-line-3', {
          y: 30,
          opacity: 0,
          duration: 0.8,
        }, '0.9');

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="hero-container" style={{ height: '300vh' }}>
      <div ref={phase1Ref} className="phase-1-surface sticky top-0 h-screen">
        {/* Phase 1 내용 */}
      </div>
      <div ref={transitionRef} className="water-transition sticky top-0 h-screen">
        {/* Transition 내용 */}
      </div>
      <div ref={phase2Ref} className="phase-2-abyss sticky top-0 h-screen">
        {/* Phase 2 내용 */}
      </div>
    </div>
  );
}
```

### 2-2. Lenis + GSAP ScrollTrigger 연동

```typescript
// lib/lenis.ts
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initLenis(): Lenis {
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.8,       // 히어로 구간 전환 속도 조절
  });

  // Lenis → GSAP ticker 연동 (필수)
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}
```

### 2-3. Phase 1 — 로고 & 타이틀 진입 애니메이션

```typescript
// components/hero/HeroTitle.tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function HeroTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.from('.logo-mark', {
      opacity: 0,
      y: 20,
      duration: 1.2,
      ease: 'power3.out',
    })
    .from('.title-line', {
      opacity: 0,
      y: 40,
      stagger: 0.18,             // 줄별 0.18초 간격 스태거
      duration: 1.0,
      ease: 'power3.out',
    }, '-=0.6');

    return () => tl.kill();
  }, []);

  return (
    <div ref={titleRef} className="hero-title-wrapper">
      {/* 로고와 타이틀 마크업 */}
    </div>
  );
}
```

---

## 4. Framer Motion 기포 파티클 애니메이션

### 4-1. 기포 파티클 시스템

```typescript
// components/hero/BubbleParticles.tsx
'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Bubble {
  id: number;
  x: number;             // 화면 너비 % (0~100)
  size: number;          // px (4~18)
  duration: number;      // 상승 시간 (초)
  delay: number;         // 시작 딜레이 (초)
  opacity: number;       // 0.15~0.55
  drift: number;         // 좌우 흔들림 px
}

// 기포 데이터 생성 (결정적 시드 기반 — SSR hydration 오류 방지)
function generateBubbles(count: number): Bubble[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 7.3 + 13) % 100,
    size: 4 + (i % 5) * 2.8,
    duration: 4.5 + (i % 7) * 0.8,
    delay: (i * 0.6) % 5,
    opacity: 0.15 + (i % 6) * 0.07,
    drift: ((i % 3) - 1) * 12,
  }));
}

// 데스크톱 16개, 모바일 8개
const BUBBLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 16;
const BUBBLES = generateBubbles(BUBBLE_COUNT);

function BubbleParticle({ bubble, isActive }: { bubble: Bubble; isActive: boolean }) {
  return (
    <motion.div
      className="absolute rounded-full border border-white/30 backdrop-blur-[1px]"
      style={{
        left: `${bubble.x}%`,
        bottom: '-20px',
        width: bubble.size,
        height: bubble.size,
        opacity: bubble.opacity,
        background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.6), rgba(180,220,255,0.1))',
      }}
      animate={isActive ? {
        y: [0, -(window?.innerHeight ?? 900) - 40],
        x: [0, bubble.drift, -bubble.drift * 0.5, bubble.drift * 0.3],
        opacity: [0, bubble.opacity, bubble.opacity * 0.7, 0],
        scale: [0.6, 1, 1.1, 0.9],
      } : { opacity: 0 }}
      transition={{
        duration: bubble.duration,
        delay: bubble.delay,
        repeat: Infinity,
        ease: [0.25, 0.46, 0.45, 0.94],
        times: [0, 0.2, 0.8, 1],
      }}
    />
  );
}

export function BubbleParticles() {
  const [isActive, setIsActive] = useState(false);

  // ScrollTrigger 수면 진입 시점에 활성화
  useEffect(() => {
    const handleDepthChange = (e: CustomEvent<{ depth: number }>) => {
      // depth > 0.05 일 때 기포 시작
      setIsActive(e.detail.depth > 0.05);
    };

    window.addEventListener('waterDepthChange', handleDepthChange as EventListener);
    return () => window.removeEventListener('waterDepthChange', handleDepthChange as EventListener);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {BUBBLES.map((bubble) => (
        <BubbleParticle key={bubble.id} bubble={bubble} isActive={isActive} />
      ))}
    </div>
  );
}
```

### 4-2. 기포 물리 파라미터 기준

| 파라미터 | 값 | 비고 |
|---|---|---|
| 기포 수 | 16개 | 모바일 8개로 축소 |
| 크기 범위 | 4px ~ 18px | 원근감 표현 |
| 상승 속도 | 4.5s ~ 10.1s | 자연스러운 불균형 |
| 좌우 드리프트 | ±12px | 해류 표현 |
| 불투명도 | 0.15 ~ 0.55 | 깊이감 |
| border | 1px white/30 | 수면 굴절 표현 |

---

## 5. 배경 영상 최적화 (Phase 2 심해)

### 5-1. 영상 컴포넌트

```typescript
// components/hero/AbyssVideoBackground.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

interface AbyssVideoBackgroundProps {
  webmSrc: string;
  mp4Src: string;
  posterSrc: string;
}

export function AbyssVideoBackground({
  webmSrc,
  mp4Src,
  posterSrc,
}: AbyssVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intersection Observer: 뷰포트 진입 시에만 로드
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            // lazy load: src 동적 할당
            const sourceWebm = video.querySelector('source[type="video/webm"]') as HTMLSourceElement;
            const sourceMp4 = video.querySelector('source[type="video/mp4"]') as HTMLSourceElement;

            if (sourceWebm) sourceWebm.src = webmSrc;
            if (sourceMp4) sourceMp4.src = mp4Src;

            video.load();
            video.play().catch(() => {
              // autoplay 정책 우회: muted 확인
              video.muted = true;
              video.play();
            });

            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '200px' }  // 200px 전 미리 로드
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [webmSrc, mp4Src, isLoaded]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 포스터 이미지: 영상 로드 전 표시 */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${posterSrc})`,
          opacity: isLoaded ? 0 : 1,
        }}
      />

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="none"              // 초기 로드 차단
        poster={posterSrc}
      >
        {/* WebM 우선 (파일 크기 40% 절감) */}
        <source type="video/webm" />
        <source type="video/mp4" />
      </video>

      {/* 심해 비네팅 */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent to-[#030820]/60" />
    </div>
  );
}
```

### 5-2. 영상 인코딩 스펙 (영상팀 전달용)

| 항목 | WebM (VP9) | MP4 (H.264) |
|---|---|---|
| 해상도 | 1920×1080 | 1920×1080 |
| 프레임레이트 | 24fps | 24fps |
| 비트레이트 | 2~3 Mbps | 4~5 Mbps |
| 길이 | 10~30초 루프 | 동일 |
| 목표 파일 크기 | < 8MB | < 15MB |
| 오디오 | 없음 (silent) | 없음 (silent) |
| 루프 전환 | 시작/끝 동일 프레임 | 동일 |

---

## 6. 카피 오버레이 스타일 — 미확정

> 디자인 스타일 확정 후 이 섹션을 채운다.
> 카피 내용(텍스트)은 확정 → [`04-copywriting-team/hero-copy.md`](../04-copywriting-team/hero-copy.md) 참조

---

## 7. 성능 목표

### 7-1. Core Web Vitals 목표

| 지표 | 목표값 | 측정 조건 |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.0s | 4G 모바일, 크롬 |
| FID / INP | < 100ms | 사용자 첫 인터랙션 |
| CLS (Cumulative Layout Shift) | < 0.05 | 전체 로드 |
| FCP (First Contentful Paint) | < 1.2s | 4G 모바일 |

### 7-2. 렌더링 성능 목표

| 지표 | 목표값 | 비고 |
|---|---|---|
| 히어로 구간 FPS | 60fps (데스크탑) / 30fps (모바일) | Chrome DevTools 기준 |
| 스크롤 jank | 0ms long task | GSAP scrub 1.0+ |
| GPU 메모리 | < 150MB | 셰이더 + 텍스처 합산 |

### 7-3. 번들 사이즈 목표

| 패키지 | 예상 크기 (gzip) | 최적화 방법 |
|---|---|---|
| gsap (core + ScrollTrigger) | ~42KB | registerPlugin 방식 |
| framer-motion | ~38KB | LazyMotion + domMax |
| lenis | ~8KB | — |
| **히어로 JS 총합 (목표)** | **< 280KB** | Code splitting 적용 |

### 7-4. 이미지 / 영상 최적화

| 자산 | 형식 | 크기 목표 | 전략 |
|---|---|---|---|
| 지상 배경 이미지 | WebP | < 350KB | next/image, sizes 지정 |
| 영상 포스터 | WebP | < 80KB | 저해상도 스틸 |
| 브랜딩 영상 (WebM) | VP9 | < 8MB | lazy load, IObs |
| 브랜딩 영상 (MP4) | H.264 | < 15MB | fallback |

### 7-5. 모바일 대응 전략

```typescript
// 모바일: 기포 수 감소 + SVG turbulence 간소화
const isMobileOrLowEnd = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  const isMobile = /iPhone|Android/i.test(ua);
  // GPU 티어 확인 (detectGPU 라이브러리 활용)
  return isMobile || navigator.hardwareConcurrency <= 4;
};

// 폴백: CSS backdrop-filter + transition으로 수면 효과 간소화
```

---

## 8. 의존성 목록

### 8-1. 프로덕션 의존성

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",

    // 애니메이션
    "gsap": "^3.12.5",
    "framer-motion": "^12.0.0",
    "lenis": "^1.1.0",

    // 유틸리티
    "detect-gpu": "^5.0.0"
  }
}
```

### 8-2. 개발 의존성

```json
{
  "devDependencies": {
    "typescript": "^5.7.0",

    // 성능 측정
    "web-vitals": "^4.2.0"
  }
}
```

---

## 9. 파일 구조 (예정)

```
components/
└── hero/
    ├── HeroSection.tsx              # 메인 컨테이너 (300vh)
    ├── Phase1Surface.tsx            # 지상 레이어
    ├── HeroTitle.tsx                # 로고 + 타이틀 (GSAP 진입 애니)
    ├── WaterTransition.tsx          # 수면 관통 전환 래퍼 (시각 효과 미확정)
    ├── BubbleParticles.tsx          # Framer Motion 기포
    ├── Phase2Abyss.tsx              # 심해 레이어
    ├── AbyssVideoBackground.tsx     # 영상 배경 (lazy)
    └── [AbyssCopyOverlay.tsx]       # 카피 오버레이 (스타일 확정 후 추가)

lib/
└── lenis.ts                         # Lenis + GSAP 연동 초기화
```

---

## 10. 미결 사항 (타팀 확인 필요)

| 항목 | 담당 | 기한 |
|---|---|---|
| 브랜딩 영상 인코딩 스펙 전달 | 영상팀 (06) | — |
| 지상 배경 이미지 최종 확정 | 사진팀 (07) | — |
| 카피 3줄 최종 텍스트 확정 | 카피팀 (04) | — |
| 카피 오버레이 스타일 확정 | 디자인팀 (02) + 럭셔리 브랜딩팀 (00) | — |
| 폰트 라이선스 (Cormorant Garamond) | 브랜딩팀 (00) | — |

---

*문서 끝 — Frontend Team / 2026-02-22*
