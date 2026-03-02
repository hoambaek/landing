# Muse de Maree - Frontend Technical Specification
# 프론트엔드 기술 스펙 문서

> 작성 기준: 2026-02-23 (갱신)
> 레퍼런스: Krug.com (럭셔리 미니멀리즘) + Kinfolk.com (에디토리얼 내비게이션)
> 디자인 언어: Editorial Minimalism — 평면 디자인, 극가는 보더, 필름 그레인 텍스처
> 컬러 팔레트: Abyssal Amber (확정 2026-02-22)

---

## 1. 기술 스택 (Tech Stack)

### 1.1 핵심 프레임워크

| 기술 | 버전 | 선정 근거 |
|------|------|-----------|
| **Next.js** | 16 | App Router 완전 안정화, React 19 네이티브 통합, Partial Prerendering (PPR) 정식 지원으로 동적/정적 콘텐츠 혼합 렌더링 최적화. Krug.com과 같은 이미지/영상 중심 사이트에서 `next/image` 및 `next/video` 최적화 필수 |
| **React** | 19 | Server Components로 번들 사이즈 절감 (럭셔리 사이트의 풍부한 비주얼을 JS 부담 없이 구현). `use()` hook과 Actions를 통한 Ocean Circle 사용자 인터랙션 처리. Suspense 경계를 활용한 점진적 로딩 UX |
| **Tailwind CSS** | 4 | Oxide 엔진 기반 빌드 성능 향상 (빌드 시간 최대 10배 단축). `@theme` 디렉티브로 디자인 토큰을 CSS-first로 관리하여 Krug 스타일의 엄격한 디자인 시스템 유지. Container Queries 네이티브 지원으로 컴포넌트 단위 반응형 구현 |
| **Framer Motion** | 12+ | 선언적 애니메이션 API로 Krug의 절제된 트랜지션 패턴 구현. `layout` 애니메이션으로 페이지 전환 시 유기적 움직임 표현. `useScroll`, `useTransform`으로 스크롤 기반 시차 효과(parallax) 구현 |

### 1.2 배포 및 인프라

| 기술 | 용도 |
|------|------|
| **Vercel Edge** | Edge Runtime 기반 글로벌 저지연 배포. ISR (Incremental Static Regeneration)으로 컬렉션 페이지 캐싱. Edge Middleware로 지역별 언어 감지 및 리다이렉트 |
| **Vercel Image Optimization** | 제품 이미지 자동 WebP/AVIF 변환, 럭셔리 브랜드에 필수적인 고해상도 이미지를 성능 손실 없이 제공 |

### 1.3 분석 도구

| 기술 | 용도 |
|------|------|
| **PostHog** | 사용자 행동 분석, 퍼널 추적 (발견 → 탐험 → 기록 전환율). Feature Flags로 A/B 테스트. Session Replay로 UX 문제 발견. 자체 호스팅 옵션으로 데이터 주권 확보 |

### 1.4 보조 라이브러리

| 라이브러리 | 용도 |
|------------|------|
| **Three.js / React Three Fiber** | WebGL Ripple 물결 인터랙션 효과 |
| **Lenis** | 커스텀 스무스 스크롤 (Krug의 부드러운 스크롤 경험 재현) |
| **sharp** | 서버사이드 이미지 최적화 |

---

## 2. Editorial Minimalism UI 스펙

### 2.1 디자인 철학

**레퍼런스:** Krug.com (럭셔리 미니멀) + Kinfolk.com (에디토리얼 내비게이션)

**핵심 원칙:**
- 평면 디자인 (Flat Design) — 그림자 없음, 극가는 보더로 경계 구분
- 2색 대비 시스템: 웜 블랙(`--void-bg: #0A0908`) ↔ 그레이지(`--sand: #E8E5E1`) + 골드 악센트(`--amber: #CCAD7B`)
- 텍스처 레이어: 필름 그레인 + 한지 질감으로 아날로그 물성 구현
- 넓은 여백과 열린 행간으로 "읽히는" 공간감

**금지 요소:**
- ❌ Glassmorphism (backdrop-filter, blur 카드, 반투명 배경) — 메뉴 오버레이만 예외
- ❌ 그림자 기반 카드 (box-shadow로 깊이감 표현)
- ❌ 틸(teal) 계열 색상 (#3D5A56, #A7C7C0 등)
- ❌ border-radius 12px 이상의 둥근 모서리

### 2.2 카드 컴포넌트 스펙

```css
/* Editorial Card - 기본 (라이트 배경) */
.card {
  background: var(--sand);          /* #E8E5E1 */
  border: 0.5px solid var(--earth-25);  /* rgba(49,46,42,0.25) */
  border-radius: 0;                 /* 직각 모서리 */
  box-shadow: none;
  padding: 40px 32px;
  transition: border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  border-color: var(--amber);       /* #CCAD7B */
}

/* Editorial Card - 다크 배경 위 */
.card--dark {
  background: transparent;
  border: 0.5px solid var(--border-dark-default);  /* rgba(241,239,235,0.12) */
}

.card--dark:hover {
  border-color: var(--amber);
}
```

### 2.3 텍스처 레이어 스펙

```css
/* 필름 그레인 텍스처 */
.texture-grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  /* SVG feTurbulence 기반 노이즈 */
}

/* 한지 텍스처 (섹션 배경) */
.texture-hanji {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  /* SVG feTurbulence: type="turbulence" baseFrequency="0.65" numOctaves="3" */
}
```

### 2.4 Tailwind CSS 4 디자인 토큰 매핑

```css
/* @theme 디렉티브로 Abyssal Amber 팔레트 등록 */
@theme {
  /* 배경 */
  --color-void-bg: #0A0908;
  --color-sand: #E8E5E1;
  --color-warm-ivory: #ECEAE6;

  /* 텍스트 */
  --color-earth: #312E2A;
  --color-void-text: #F1EFEB;

  /* 악센트 */
  --color-amber: #CCAD7B;

  /* 보더 */
  --color-border-default: rgba(49, 46, 42, 0.10);
  --color-border-subtle: rgba(49, 46, 42, 0.08);
  --color-border-emphasis: rgba(49, 46, 42, 0.18);
}

/* 카드 컴포넌트 (Tailwind 클래스) */
<div class="
  bg-sand
  border
  border-earth/25
  rounded-none
  shadow-none
  p-10
  transition-colors
  duration-400
  ease-[cubic-bezier(0.4,0,0.2,1)]
  hover:border-amber
">
```

---

## 3. 레이아웃 시스템

### 3.1 12-Column Grid System

Krug.com은 12컬럼 그리드를 기반으로 넓은 여백과 비대칭 레이아웃을 구현한다.
Muse de Maree는 동일한 12컬럼 구조를 유지하되, 에디토리얼 매거진 느낌을 강화한다.

```
[그리드 설정]
display: grid;
grid-template-columns: repeat(12, 1fr);
column-gap: 24px;          /* 데스크톱 */
column-gap: 16px;          /* 태블릿 */
column-gap: 12px;          /* 모바일 */
```

**컬럼 활용 패턴:**

| 용도 | 컬럼 배치 | 설명 |
|------|-----------|------|
| 히어로 텍스트 | col 2~8 (7 span) | 좌측 여백을 두어 비대칭 구성 |
| 2단 레이아웃 | col 1~5 + col 7~12 | 가운데 1컬럼 거터로 호흡감 확보 |
| 본문 텍스트 | col 3~10 (8 span) | 양쪽 2컬럼씩 여백 (가독성 최적 폭) |
| 풀와이드 이미지 | col 1~12 (12 span) | 풀블리드 시각 효과 |
| 사이드바 + 콘텐츠 | col 1~3 + col 4~12 | Archive 페이지 필터 레이아웃 |
| 3단 카드 | col 1~4 + 5~8 + 9~12 | 컬렉션 라인업 배치 |

### 3.2 섹션 패딩 (Editorial Spacing)

Krug.com의 에디토리얼 여백 체계를 그대로 계승하여 "읽히는" 공간감을 구현한다.

```
[수직 패딩]
--section-padding-sm: 48px;       /* 소형 섹션 간격 */
--section-padding-lg: 96px;       /* 대형 섹션 간격 (주요 구분) */
--section-padding-xl: 128px;      /* 히어로 → 첫 섹션 전환 */

[수평 패딩 (컨테이너 안쪽 여백)]
--container-padding-mobile: 20px;
--container-padding-tablet: 40px;
--container-padding-desktop: 64px;

[Tailwind 적용]
py-12            /* 48px - 소형 */
py-24            /* 96px - 대형 */
py-32            /* 128px - 초대형 */
px-5 md:px-10 lg:px-16
```

### 3.3 섹션 간 구분선 (Krug Style Dividers)

Krug.com은 섹션 사이에 가는 수평선을 배치하여 콘텐츠 경계를 우아하게 구분한다.

```css
/* 기본 구분선 — 극가는 0.5px */
.section-divider {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  height: 0.5px;
  background: var(--earth-25);      /* rgba(49,46,42,0.25) */
}

/* 다크 배경 위 구분선 */
.section-divider--dark {
  background: var(--border-dark-default);  /* rgba(241,239,235,0.12) */
}

/* 장식 구분선 (중앙 심볼 포함) */
.section-divider--ornament {
  display: flex;
  align-items: center;
  gap: 24px;
}
.section-divider--ornament::before,
.section-divider--ornament::after {
  content: '';
  flex: 1;
  height: 0.5px;
  background: linear-gradient(
    to right,
    transparent,
    var(--earth-25),
    transparent
  );
}

/* Tailwind 적용 */
<div class="w-full max-w-screen-xl mx-auto h-px bg-earth/25" />
```

### 3.4 Max Container Width

```
--container-max: 1280px;           /* 일반 콘텐츠 */
--container-narrow: 768px;         /* 본문 텍스트, 스토리 */
--container-wide: 1440px;          /* 풀와이드 갤러리 */

/* Tailwind 적용 */
max-w-screen-xl     /* 1280px */
max-w-3xl           /* 768px */
max-w-screen-2xl    /* 1440px (블리드 여백 포함) */
```

---

## 4. Kinfolk 스타일 내비게이션 스펙

### 4.1 헤더 구조

Kinfolk.com의 내비게이션 철학을 계승한다: 콘텐츠를 방해하지 않는 최소한의 헤더, 풀스크린 오버레이 메뉴로 몰입 경험 유지.

```
[헤더 레이아웃 - 데스크톱/모바일 동일]
+--------------------------------------------------+
|  MUSE DE MAREE              [=] hamburger icon    |
|  (logo, left-aligned)       (right-aligned)       |
+--------------------------------------------------+

높이: 72px (데스크톱) / 56px (모바일)
배경: transparent (스크롤 전) → rgba(232,229,225,0.92) backdrop-blur (스크롤 후)
      ※ backdrop-blur는 내비게이션 오버레이에 한해 예외 허용
위치: position: fixed; top: 0; z-index: 50;
전환: background 0.4s ease, backdrop-filter 0.4s ease
```

**로고 스타일:**
```css
.header-logo {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: 18px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--earth);             /* #312E2A */
}
```

**햄버거 아이콘:**
```css
.hamburger {
  width: 28px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}
.hamburger__line {
  width: 100%;
  height: 1.5px;
  background: var(--earth);        /* #312E2A */
  transition: all 0.3s ease;
  transform-origin: center;
}
/* 열린 상태: X 형태 */
.hamburger--open .hamburger__line:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}
.hamburger--open .hamburger__line:nth-child(2) {
  opacity: 0;
}
.hamburger--open .hamburger__line:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}
```

### 4.2 풀스크린 오버레이 메뉴

```
[메뉴 오픈 시 레이아웃]
+--------------------------------------------------+
|  MUSE DE MAREE              [X] close             |
|                                                    |
|                                                    |
|        the void                                    |
|        observation            첫번째 깊이           |
|        archive                황금의 깊이           |
|        ocean circle           진주의 깊이           |
|        find us                다이아몬드의 깊이      |
|                               왕의 깊이             |
|                                                    |
|                                                    |
|  [instagram] [youtube]           KR / EN / FR      |
+--------------------------------------------------+
```

**오버레이 CSS:**
```css
.nav-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--sand);           /* #E8E5E1 */
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              visibility 0.5s;
  display: grid;
  grid-template-rows: 72px 1fr auto;
  padding: 0 64px;
}

.nav-overlay--open {
  opacity: 1;
  visibility: visible;
}
```

### 4.3 메뉴 항목 스타일

**메인 메뉴 (좌측):**

| 영문 | 기능 | 한국어 병기 |
|------|------|-------------|
| the void | Home (입구, 심해의 공허) | 공허 |
| observation | Story (관찰 일기) | 관찰 |
| archive | Collection (유물 보관소) | 기록 보관소 |
| ocean circle | My Log (사용자 기록) | 바다의 원 |
| find us | Contact/Locations | 만나는 곳 |

```css
.nav-menu__item {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 300;
  font-style: italic;
  color: var(--earth);              /* #312E2A */
  text-transform: lowercase;
  line-height: 1.3;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease;
  opacity: 0;
  transform: translateY(24px);
}

/* 메뉴 열림 시 스태거 애니메이션 */
.nav-overlay--open .nav-menu__item {
  opacity: 1;
  transform: translateY(0);
}
.nav-overlay--open .nav-menu__item:nth-child(1) { transition-delay: 0.1s; }
.nav-overlay--open .nav-menu__item:nth-child(2) { transition-delay: 0.15s; }
.nav-overlay--open .nav-menu__item:nth-child(3) { transition-delay: 0.2s; }
.nav-overlay--open .nav-menu__item:nth-child(4) { transition-delay: 0.25s; }
.nav-overlay--open .nav-menu__item:nth-child(5) { transition-delay: 0.3s; }

/* 호버 */
.nav-menu__item:hover {
  color: var(--amber);              /* #CCAD7B */
  transform: translateX(8px);
}
```

### 4.4 서브 카테고리 (5개 깊이)

Archive 메뉴에 호버/클릭 시 우측에 5개 깊이 서브메뉴가 나타난다.

| 한국어 | 프랑스어 | 깊이 |
|--------|----------|------|
| 첫번째 깊이 | Premiere Profondeur | 15m |
| 황금의 깊이 | Profondeur d'Or | 30m |
| 진주의 깊이 | Profondeur de Perle | 50m |
| 다이아몬드의 깊이 | Profondeur de Diamant | 80m |
| 왕의 깊이 | Profondeur du Roi | 120m |

```css
.nav-sub__item {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: var(--earth-55);           /* rgba(49,46,42,0.55) */
  letter-spacing: 0.05em;
  padding: 8px 0;
  cursor: pointer;
  transition: color 0.3s ease;
}
.nav-sub__item:hover {
  color: var(--earth);              /* #312E2A */
}
```

### 4.5 하단 영역

```
[소셜 링크 - 좌측]
Instagram | YouTube | KakaoTalk
폰트: Noto Sans KR, 12px, tracking 0.1em, uppercase
색상: var(--earth-40)              /* rgba(49,46,42,0.40) */
호버: var(--earth)                 /* #312E2A */

[언어 선택 - 우측]
KR / EN / FR
폰트: Noto Sans KR, 12px, tracking 0.15em
활성: var(--earth) (밑줄)          /* #312E2A */
비활성: var(--earth-40)            /* rgba(49,46,42,0.40) */
```

### 4.6 트랜지션 타이밍

```
오버레이 배경 페이드인: 0.5s cubic-bezier(0.4, 0, 0.2, 1)
메뉴 항목 스태거: 각 0.05s 간격, 0.4s duration
서브메뉴 슬라이드: 0.3s ease-out
닫힘 애니메이션: 0.4s (메뉴 항목 → 오버레이 순서)
```

### 4.7 접근성 (Accessibility)

```html
<!-- 키보드 내비게이션 지원 -->
<nav aria-label="Main navigation">
  <button
    aria-expanded="false"
    aria-controls="nav-overlay"
    aria-label="메뉴 열기"
  >
    <!-- hamburger icon -->
  </button>
</nav>

<div
  id="nav-overlay"
  role="dialog"
  aria-modal="true"
  aria-label="사이트 내비게이션"
>
  <!-- ESC 키로 닫기 -->
  <!-- Tab 키로 메뉴 항목 순환 -->
  <!-- Enter/Space로 메뉴 선택 -->
</div>
```

**포커스 트랩(Focus Trap):** 메뉴가 열린 상태에서 Tab 키가 메뉴 내부에서만 순환하도록 구현. 닫힘 시 포커스를 햄버거 버튼으로 복원.

---

## 5. 인터랙션 & 애니메이션

### 5.1 풀스크린 비디오 히어로

```css
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;  /* 모바일 주소창 대응 */
  overflow: hidden;
}

.hero__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 바닷속 기포 영상: 푸른빛 수중 촬영 */
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(232, 229, 225, 0.1) 0%,     /* --sand 기반 */
    rgba(232, 229, 225, 0) 30%,
    rgba(232, 229, 225, 0) 60%,
    rgba(232, 229, 225, 0.6) 100%
  );
}
```

**비디오 최적화:**
- 포맷: MP4 (H.264) + WebM (VP9) 이중 소스
- 해상도: 데스크톱 1920x1080 / 모바일 720x1280
- 파일 크기: 최대 8MB (데스크톱) / 3MB (모바일)
- 속성: `autoplay muted loop playsinline`
- 대체: `<img>` poster 이미지 (저속 네트워크 또는 `prefers-reduced-motion`)

### 5.2 WebGL Ripple 인터랙션

마우스 커서를 따라 수면 위의 물결 효과가 발생한다. React Three Fiber를 사용하여 구현한다.

```
[동작 명세]
트리거: 마우스 이동 (데스크톱) / 터치 이동 (모바일)
영역: 히어로 섹션 전체 또는 특정 인터랙티브 영역
효과: 마우스 위치를 중심으로 동심원 형태의 물결이 퍼짐
물결 속도: 0.8s per ripple cycle
감쇠: 중심에서 멀어질수록 amplitude 감소
색상: var(--gold-particle) — rgba(204, 173, 123, 0.12) (앰버 골드 기반)

[성능 고려사항]
- requestAnimationFrame 기반 렌더링
- 해상도: window.devicePixelRatio 반영 (레티나 적용)
- 비활성: prefers-reduced-motion 미디어 쿼리 시 정적 이미지로 대체
- 모바일: 데스크톱과 동일하게 상시 렌더링 활성화
- GPU 메모리: 단일 텍스처(256x256) 핑퐁 버퍼

[안전장치]
- GPU 탐지: renderer.capabilities.maxTextureSize < 4096이면 ripple 비활성화, 정적 이미지 전환
- 히어로 이탈 시 dispose: 스크롤로 히어로 벗어나면 renderer.dispose() + canvas 제거하여 이후 섹션 스크롤 성능 확보
- FPS 기반 자동 비활성화: 3프레임 연속 30fps 미만 감지 시 자동으로 ripple 비활성화 후 정적 이미지 전환
```

### 5.3 스크롤 트리거 애니메이션 (Intersection Observer)

```typescript
// Framer Motion useInView 활용
const sectionRef = useRef(null);
const isInView = useInView(sectionRef, {
  once: true,        // 한 번만 트리거
  amount: 0.3,       // 30% 노출 시 활성화
  margin: "-100px",  // 뷰포트 하단 100px 전에 트리거
});

// 애니메이션 variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],  // custom easeOutExpo
    },
  },
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};
```

**스크롤 애니메이션 유형:**

| 유형 | 속성 | 타이밍 | 적용 대상 |
|------|------|--------|-----------|
| Fade In Up | opacity 0→1, y 40→0 | 0.8s easeOutExpo | 텍스트 블록, 카드 |
| Fade In | opacity 0→1 | 0.6s ease | 이미지, 구분선 |
| Scale In | scale 0.95→1, opacity 0→1 | 0.7s easeOutExpo | 제품 카드 |
| Slide In Left | x -60→0, opacity 0→1 | 0.8s easeOutExpo | 스토리 이미지 |
| Slide In Right | x 60→0, opacity 0→1 | 0.8s easeOutExpo | 스토리 텍스트 |
| Draw Line | scaleX 0→1 | 1.2s easeInOut | 구분선, 장식 요소 |
| Counter | 0→target number | 2s easeOut | 수치 (깊이, 숙성 기간) |

### 5.4 버튼 스타일

**Editorial Minimalism 버튼 원칙:**
- 평면, 그림자 없음, 극가는 보더
- 호버 시 보더 색상 변화 또는 배경 미세 전환 (상승 효과 없음)
- 직각 모서리 (border-radius: 0)

| 속성 | 라이트 배경 | 다크 배경 |
|------|------------|----------|
| 텍스트 | var(--earth) #312E2A | var(--void-text) #F1EFEB |
| 보더 | 0.5px solid var(--earth-25) | 0.5px solid var(--border-dark-default) |
| 호버 보더 | var(--amber) #CCAD7B | var(--amber) #CCAD7B |

```css
/* Primary Button — 라이트 배경 위 */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 40px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: lowercase;
  color: var(--earth);              /* #312E2A */
  background: transparent;
  border: 0.5px solid var(--earth-25);  /* rgba(49,46,42,0.25) */
  border-radius: 0;
  cursor: pointer;
  transition: border-color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  border-color: var(--amber);       /* #CCAD7B */
  color: var(--amber);
}

.btn-primary:active {
  opacity: 0.8;
  transition-duration: 0.1s;
}

/* Primary Button — 다크 배경 위 */
.btn-primary--dark {
  color: var(--void-text);          /* #F1EFEB */
  border-color: var(--border-dark-default);  /* rgba(241,239,235,0.12) */
}

.btn-primary--dark:hover {
  border-color: var(--amber);
  color: var(--amber);
}

/* Secondary Button — 텍스트 링크 스타일 */
.btn-secondary {
  padding: 0;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: lowercase;
  color: var(--earth-55);           /* rgba(49,46,42,0.55) */
  background: transparent;
  border: none;
  border-bottom: 0.5px solid var(--earth-30);
  cursor: pointer;
  transition: color 0.35s ease, border-color 0.35s ease;
}

.btn-secondary:hover {
  color: var(--earth);
  border-color: var(--earth);
}

/* Amber Accent Button — CTA 강조 */
.btn-accent {
  padding: 14px 40px;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: lowercase;
  color: var(--void-bg);            /* #0A0908 */
  background: var(--amber);         /* #CCAD7B */
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: background 0.35s ease;
}

.btn-accent:hover {
  background: var(--amber-muted);   /* #b89868 */
}
```

### 5.5 트랜지션 규칙

```
[글로벌 트랜지션 타이밍]
마이크로 인터랙션 (호버, 포커스): 0.3s ease
콘텐츠 전환 (탭, 필터): 0.4s cubic-bezier(0.4, 0, 0.2, 1)
페이지 전환 / 오버레이: 0.5s cubic-bezier(0.4, 0, 0.2, 1)
스크롤 애니메이션: 0.6~1.0s cubic-bezier(0.22, 1, 0.36, 1)

[금지 항목]
- 0.2s 미만의 트랜지션 (너무 급작스러움)
- 1.5s 초과의 트랜지션 (럭셔리 사이트의 절제 원칙 위반)
- linear easing (기계적으로 느껴짐)
- bounce/spring easing (브랜드 톤과 부적합)
```

### 5.6 접근성: prefers-reduced-motion 대응

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .hero__video {
    display: none;
  }
  .hero__poster {
    display: block;
  }
}
```

---

## 6. 모바일 전략

### 6.1 하단 내비게이션 바 (Bottom Navigation)

데스크톱의 햄버거 메뉴 구조는 유지하되, 모바일에서는 핵심 4개 항목을 하단 탭 바로 제공한다.

```
[하단 네비게이션 레이아웃]
+---+--------+--------+--------+--------+---+
|   | void   | observe| archive| circle |   |
|   | (home) | (story)| (coll) | (log)  |   |
+---+--------+--------+--------+--------+---+

높이: 64px + safe-area-inset-bottom
배경: rgba(232, 229, 225, 0.92) backdrop-blur(20px)   /* --sand 기반 */
보더: 상단 0.5px solid rgba(49, 46, 42, 0.25)        /* --earth-25 */
```

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  height: calc(64px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(232, 229, 225, 0.92);  /* --sand 기반 */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);    /* 내비게이션 예외 허용 */
  border-top: 0.5px solid var(--earth-25);  /* rgba(49,46,42,0.25) */
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  color: var(--earth-40);             /* rgba(49,46,42,0.40) */
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 10px;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}

.bottom-nav__item--active {
  color: var(--earth);               /* #312E2A */
}

.bottom-nav__icon {
  width: 22px;
  height: 22px;
  stroke-width: 1.5;
}
```

### 6.2 햅틱 피드백 (Haptic Feedback)

```typescript
// Navigator Vibration API 활용
function triggerHaptic(type: 'light' | 'medium' | 'heavy') {
  if (!navigator.vibrate) return;

  const patterns: Record<string, number | number[]> = {
    light: 10,           // 탭 피드백
    medium: 25,          // 선택 피드백
    heavy: [15, 50, 30], // 특별 인터랙션 (깊이 전환)
  };

  navigator.vibrate(patterns[type]);
}

// 사용 예시
// 하단 네비게이션 탭 전환
onClick={() => {
  triggerHaptic('light');
  navigateTo(route);
}}

// 컬렉션 깊이(Depth) 전환
onDepthChange={(depth) => {
  triggerHaptic('heavy');
  setCurrentDepth(depth);
}}
```

### 6.3 터치 제스처 (Collection Browsing)

```
[수평 스와이프 - 컬렉션 카드 탐색]
제스처: 좌/우 스와이프
임계값: 50px 이동 + 200ms 이내 속도
효과: 카드가 좌우로 슬라이드하며 다음/이전 제품 표시
탄성: overscroll 시 고무줄 효과 (spring damping 0.8)

[수직 스크롤 - 깊이 탐험]
Observation(Story) 페이지에서 스크롤 시 깊이가 변화하는 UX
배경 색상이 점진적으로 어두워지며 깊이 증가를 시각화
```

```typescript
// Framer Motion drag 제스처
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.2}
  onDragEnd={(_, info) => {
    if (info.offset.x > 50 && info.velocity.x > 200) {
      // 이전 카드
      triggerHaptic('medium');
      goToPrev();
    } else if (info.offset.x < -50 && info.velocity.x < -200) {
      // 다음 카드
      triggerHaptic('medium');
      goToNext();
    }
  }}
/>
```

### 6.4 반응형 브레이크포인트

```
[브레이크포인트 체계]
Mobile:        0 ~ 639px       (기본값, 모바일 퍼스트)
Tablet:        640px ~ 1023px  (sm: ~ md:)
Desktop:       1024px ~ 1279px (lg:)
Desktop Wide:  1280px+         (xl:)

[Tailwind CSS 4 적용]
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

**주요 반응형 전환 포인트:**

| 요소 | Mobile | Tablet | Desktop |
|------|--------|--------|---------|
| 헤더 높이 | 56px | 64px | 72px |
| 내비게이션 | 하단 탭 바 | 하단 탭 바 | 상단 햄버거 |
| 그리드 | 1~2열 | 2~3열 | 3~4열 (12-col) |
| 히어로 텍스트 | 28px | 40px | 56px |
| 섹션 패딩 | 32px | 48px | 96px |
| 비디오 소스 | 720x1280 세로 | 1280x720 | 1920x1080 |
| 폰트 크기 | 14px 본문 | 15px 본문 | 16px 본문 |
| 카드 레이아웃 | 수직 스택 | 2열 그리드 | 수평 이미지+텍스트 |
| WebGL Ripple | 상시 활성화 (FPS 감시) | 상시 활성화 | 상시 활성화 |
| 하단 네비게이션 | 표시 | 표시 | 숨김 |

---

## 7. Core Web Vitals 목표치

### 7.1 성능 목표

| 메트릭 | 목표 | 측정 기준 | Krug.com 참고치 |
|--------|------|-----------|-----------------|
| **LCP** (Largest Contentful Paint) | 2.0s 이하 | 히어로 비디오 첫 프레임 또는 poster 이미지 렌더 | 럭셔리 사이트 평균 3~4s |
| **INP** (Interaction to Next Paint) | 150ms 이하 | 메뉴 열기, 깊이 전환, 카드 클릭 | FID 후속 지표 (2024~ 적용) |
| **CLS** (Cumulative Layout Shift) | 0.05 이하 | 웹폰트 로딩, 이미지 리사이즈, 동적 콘텐츠 삽입 | 폰트 FOUT 주의 |

### 7.2 성능 최적화 전략

**LCP 최적화:**

```
1. 비디오 poster 이미지 프리로드
   <link rel="preload" as="image" href="/hero-poster.webp" fetchpriority="high" />

2. 비디오 지연 로딩
   - poster 이미지를 먼저 표시 (LCP 대상)
   - Intersection Observer로 비디오는 뷰포트 진입 시 로딩
   - 또는 requestIdleCallback으로 유휴 시간에 비디오 로딩 시작

3. 폰트 최적화
   - next/font로 Cormorant Garamond, Noto Sans KR 셀프 호스팅
   - font-display: swap으로 FOUT 최소화
   - 서브셋: Latin + Korean (불필요한 글리프 제거)
   - Cormorant Garamond: woff2 약 30~50KB (weight 300, 400만 포함)
   - Noto Sans KR: woff2 약 1~2MB (한글 전체 → Google Fonts slice 활용 시 300KB대로 축소)

4. 이미지 최적화
   - next/image의 자동 WebP/AVIF 변환
   - 제품 이미지: width/height 명시로 CLS 방지
   - priority 속성: 히어로, 첫 화면 이미지에만 적용
```

**INP 최적화:**

```
1. React Server Components 적극 활용
   - 정적 콘텐츠 (스토리, 제품 설명)는 Server Component로 처리
   - Client Component는 인터랙티브 요소에만 제한적 사용
   - 결과: 메인 스레드 JS 실행량 대폭 감소

2. 이벤트 핸들러 최적화
   - WebGL Ripple: rAF 내에서만 렌더링 (입력 이벤트와 분리)
   - 스크롤 이벤트: passive: true 옵션 필수
   - 디바운스/스로틀: 리사이즈 이벤트 100ms, 스크롤 이벤트 16ms(1프레임)

3. 코드 분할 (Code Splitting)
   - WebGL Ripple: dynamic import, 히어로 뷰포트 진입 시 로딩
   - Three.js: 약 150KB gzip → 별도 청크로 분리
   - 풀스크린 메뉴: dynamic import (첫 상호작용 시 로딩)
```

**CLS 최적화:**

```
1. 이미지/비디오 종횡비 예약
   - aspect-ratio CSS 속성 또는 width/height 속성 명시
   - 히어로: aspect-ratio: 16/9 (데스크톱) / 9/16 (모바일)

2. 웹폰트 CLS 방지
   - font-display: swap + size-adjust
   - Cormorant Garamond 대체: Georgia (size-adjust: 105%)
   - Noto Sans KR 대체: system-ui (size-adjust: 100%)

3. 동적 콘텐츠
   - 스켈레톤 UI: 컬렉션 카드, 사용자 로그 영역
   - min-height 설정: 동적으로 로딩되는 섹션에 최소 높이 확보
```

### 7.3 번들 사이즈 목표

```
[초기 로딩 JS 번들 (gzip)]
First Load JS: 90KB 이하

[번들 구성 예측]
React + React DOM:     ~45KB (Server Components로 클라이언트 번들 최소화)
Framer Motion:         ~25KB (tree-shaking 적용)
Next.js Runtime:       ~15KB
앱 코드:               ~5KB (첫 페이지)

[지연 로딩 번들]
Three.js (WebGL):      ~150KB (히어로 인터랙션 시)
Lenis (스무스 스크롤):  ~8KB (첫 스크롤 시)
PostHog:               ~20KB (idle callback)
풀스크린 메뉴:          ~5KB (메뉴 버튼 클릭 시)
```

### 7.4 네트워크 전략

```
[프리로드 우선순위]
Critical (fetchpriority="high"):
  - 히어로 poster 이미지
  - Cormorant Garamond woff2
  - Noto Sans KR woff2 (한글 서브셋)

High:
  - 메인 CSS 번들
  - First Load JS

Low (prefetch):
  - 히어로 비디오 (poster 로드 후)
  - 하위 페이지 데이터

[캐싱 전략]
정적 에셋 (폰트, 이미지): Cache-Control: public, max-age=31536000, immutable
HTML: Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400
API 응답: Cache-Control: private, max-age=300
```

---

## 부록: 컬러 토큰 정리 — Abyssal Amber (확정 2026-02-22)

> Hue 연속성: 웜 블랙(H:30°) → 그레이지(H:35°) → 골드(H:38°)

```css
:root {
  /* ── 다크 배경 ── */
  --void-bg:                 #0A0908;  /* Abyssal Black — 웜 블랙 */
  --navy:                    #0D0B09;  /* Data Archive 배경 */
  --circle-bg:               #0B0A08;  /* Ocean Circle 배경 */

  /* ── 라이트 배경 ── */
  --sand:                    #E8E5E1;  /* Soft Greige — 메인 밝은 배경 */
  --sand-deep:               #DDDAD5;  /* 진한 그레이지 */
  --warm-ivory:              #ECEAE6;  /* 밝은 그레이지 */

  /* ── 악센트 ── */
  --amber:                   #CCAD7B;  /* 샴페인 골드 — 유일한 악센트 */
  --amber-muted:             #b89868;  /* 절제된 앰버 */
  --gold-particle:           rgba(204, 173, 123, 0.12);
  --gold-glow:               rgba(180, 155, 110, 0.06);

  /* ── 다크 배경 위 텍스트 ── */
  --void-text:               #F1EFEB;  /* 따뜻한 오프화이트 */
  --void-text-secondary:     rgba(241, 239, 235, 0.45);
  --void-text-muted:         rgba(241, 239, 235, 0.3);
  --void-cta:                rgba(204, 173, 123, 0.45);  /* 골드 CTA */

  /* ── 라이트 배경 위 텍스트 ── */
  --earth:                   #312E2A;  /* 웜 다크 */
  --earth-80:                rgba(49, 46, 42, 0.80);
  --earth-55:                rgba(49, 46, 42, 0.55);
  --earth-40:                rgba(49, 46, 42, 0.40);
  --earth-30:                rgba(49, 46, 42, 0.30);
  --earth-25:                rgba(49, 46, 42, 0.25);

  /* ── 보더 (라이트 배경) ── */
  --border-default:          rgba(49, 46, 42, 0.10);
  --border-subtle:           rgba(49, 46, 42, 0.08);
  --border-emphasis:         rgba(49, 46, 42, 0.18);

  /* ── 보더 (다크 배경) ── */
  --border-dark-default:     rgba(241, 239, 235, 0.12);
  --border-dark-subtle:      rgba(241, 239, 235, 0.06);

  /* ── 내비게이션 오버레이 전용 (Glass 예외) ── */
  --nav-overlay-bg:          rgba(236, 234, 230, 0.45);
  --nav-overlay-border:      rgba(204, 173, 123, 0.15);

  /* ── 타이포그래피 ── */
  --font-heading:            'Cormorant Garamond', Georgia, serif;
  --font-body:               'Noto Sans KR', -apple-system, sans-serif;
}
```

---

*이 문서는 Muse de Maree 프론트엔드 아키텍트 에이전트가 작성한 기술 스펙이다.*
*homepage-plan.html 기획문서의 "프론트엔드팀" 섹션에 삽입될 콘텐츠 원본이다.*
