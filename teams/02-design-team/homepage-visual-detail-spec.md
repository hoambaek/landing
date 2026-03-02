# 홈페이지 비주얼 디테일 스펙

> 작성: 2026-02-23 | 02-design-team
> 기준 문서: `wireframe/homepage-wireframe.html` CSS 기반 추출
> 참조: `homepage-visual-spec.md`, `00-luxury-branding-team/brand-standards.md`

---

## 1. 섹션별 배경색 프로그레션

### 배경 시퀀스

```
S1 The Void      → #ECEAE6 (warm-ivory, 라이트)
S2 Observation    → #ECEAE6 → #0A0908 (스크롤 연동 그라디언트 전환)
   Evidence       → #0A0908 (void-bg, 다크)
S3 Data Archive   → #0D0B09 (navy, 다크)
S4 The Maker      → #ECEAE6 (warm-ivory, 라이트)
S5 Archive        → #E8E5E1 (archive-bg, 라이트 그레이지)
S6 Ocean Circle   → #0A0D12 (circle-bg, 다크 네이비)
S7 For Pro        → #F5F1E8 (pro-bg, 밝은 워밍)
   Footer         → #0A0908 (다크)
```

### 전환 방식

| 구간 | 전환 방식 | 상세 |
|------|----------|------|
| S1 → S2 | **스크롤 연동 보간** | JS `lerpColor` — `#ECEAE6` → `#0A0908`, 스크롤 progress 0→1에 매핑. `transition: background-color 0.05s linear` |
| S2 Descent → Evidence | 하드컷 | Descent 끝나면 Evidence 영역이 `#0A0908` 고정 |
| Evidence → S3 | 하드컷 | `#0A0908` → `#0D0B09` (미세 차이, 거의 동일) |
| S3 → S4 | 하드컷 | `#0D0B09` → `#ECEAE6` (다크 → 라이트) |
| S4 → S5 | 하드컷 | `#ECEAE6` → `#E8E5E1` (미세 톤 시프트) |
| S5 → S6 | 하드컷 | `#E8E5E1` → `#0A0D12` (라이트 → 다크) |
| S6 → S7 | 하드컷 | `#0A0D12` → `#F5F1E8` (다크 → 라이트) |
| S7 → Footer | 하드컷 | `#F5F1E8` → `#0A0908` |

### 명암 리듬

```
Light → (scroll)Dark → Dark → Dark → Light → Light → Dark → Light → Dark
 S1       S2-desc   S2-evid   S3      S4       S5      S6      S7    Footer
```

---

## 2. 타이포그래피 스펙 테이블

### 2.1 글로벌 설정

| 속성 | 값 |
|------|------|
| Base font-size | `16px` |
| Body font-family | `'Noto Sans KR', 'Helvetica Neue', sans-serif` |
| Body font-weight | `300` |
| Body color | `#312E2A` (var(--earth-muted)) |
| Font smoothing | `-webkit-font-smoothing: antialiased` |

### 2.2 Header

| 요소 | font-family | size | weight | letter-spacing | line-height | color |
|------|------------|------|--------|----------------|-------------|-------|
| Logo | Cormorant Garamond | `0.875rem` (14px) | 300 | `0.25em` | inherit | `rgba(241,239,235,0.85)` |
| Menu lines | — | — | — | — | — | `rgba(241,239,235,0.6)` → hover `1.0` |

### 2.3 Fullscreen Menu Overlay

| 요소 | font-family | size | weight | style | letter-spacing | color |
|------|------------|------|--------|-------|----------------|-------|
| Close button | Cormorant Garamond | `1.125rem` (18px) | 300 | normal | `0.1em` | `rgba(232,228,223,0.5)` → hover `0.9` |
| Nav link | Cormorant Garamond | `clamp(32px, 4.5vw, 56px)` | 300 | italic | — | `rgba(241,239,235,0.75)` → hover `1.0` |
| Nav link (pro) | Cormorant Garamond | `clamp(18px, 2.5vw, 28px)` | 300 | normal | — | `rgba(241,239,235,0.35)` → hover `0.6` |
| Cuvée list | Cormorant Garamond | `clamp(14px, 1.8vw, 20px)` | 300 | italic | — | `rgba(232,228,223,0.2)` → hover `0.5` |
| Social/Lang | — | `0.6875rem` (11px) | — | — | `0.06em` | `rgba(232,228,223,0.25)` → hover `0.55` |

### 2.4 S1 — The Void

| 요소 | font-family | size | weight | letter-spacing | line-height | color |
|------|------------|------|--------|----------------|-------------|-------|
| Headline (h1) | Noto Sans KR (body) | `clamp(36px, 6vw, 64px)` | 200 | `0.08em` | `1.3` | `#312E2A` (var(--earth)) |
| Sub | Cormorant Garamond | `clamp(0.875rem, 1.5vw, 1.125rem)` | 300, italic | `0.06em` | inherit | `rgba(49,46,42,0.35)` |
| Scroll text | Cormorant Garamond | `0.625rem` (10px) | 300 | `0.2em` | inherit | `rgba(49,46,42,0.25)` |

### 2.5 S2 — Observation (Pressure Descent)

| 요소 | font-family | size | weight | style | letter-spacing | line-height | color |
|------|------------|------|--------|-------|----------------|-------------|-------|
| Depth counter | Cormorant Garamond | `clamp(2.5rem, 5vw, 4rem)` | 300 | italic | `-0.02em` | — | 스크롤 보간 (light→dark) |
| Fact depth label | Cormorant Garamond | `0.75rem` (12px) | — | italic | `0.15em` | — | opacity `0.4` |
| Fact text | Noto Sans KR | `clamp(0.875rem, 1.3vw, 1.0625rem)` | 400 | — | — | `2` | 스크롤 보간 + `text-shadow` |
| Climax text | Noto Sans KR | `clamp(1.125rem, 2.2vw, 1.625rem)` | 200 | — | `0.06em` | `2` | 스크롤 보간 |

> **Fact text-shadow**: `0 1px 20px rgba(0,0,0,0.3), 0 0 60px rgba(0,0,0,0.15)`

### 2.6 S2 — Evidence (Before/After)

| 요소 | font-family | size | weight | style | letter-spacing | line-height | color |
|------|------------|------|--------|-------|----------------|-------------|-------|
| Evidence title | Cormorant Garamond | `clamp(24px, 3vw, 36px)` | 300 | — | `0.03em` | — | `#F1EFEB` |
| Evidence sub | — | `0.8125rem` (13px) | 200 | — | `0.08em` | — | `rgba(241,239,235,0.25)` |
| Pair title | Cormorant Garamond | `0.6875rem` (11px) | — | italic | `0.15em` | — | `rgba(241,239,235,0.15)` |
| Pair label | Cormorant Garamond | `0.6875rem` (11px) | — | italic | `0.2em` | — | `rgba(241,239,235,0.2)` |
| Pair desc | — | `0.75rem` (12px) | 200 | — | — | `1.8` | `rgba(241,239,235,0.3)` |
| Closing text | Noto Sans KR | `clamp(1rem, 1.8vw, 1.375rem)` | 200 | — | `0.04em` | `2` | `rgba(241,239,235,0.5)` |

### 2.7 S3 — Data Archive

| 요소 | font-family | size | weight | letter-spacing | line-height | color |
|------|------------|------|--------|----------------|-------------|-------|
| Label | Noto Sans KR | `0.625rem` (10px) | 400 | `0.3em` | — | `rgba(204,173,123,0.4)` |
| Title | Cormorant Garamond | `clamp(36px, 4.5vw, 56px)` | 300 | `-0.01em` | — | `rgba(204,173,123,0.85)` |
| Sub | Noto Sans KR | `1rem` (16px) | 200 | — | `1.8` | `rgba(232,228,223,0.4)` |
| Metric label | Noto Sans KR | `0.5625rem` (9px) | 400 | `0.15em` | — | `rgba(232,228,223,0.3)` |
| Metric value | Cormorant Garamond | `clamp(32px, 4vw, 48px)` | 300 | — | — | `rgba(232,228,223,0.85)` |
| Metric unit | Noto Sans KR | `0.875rem` (14px) | 200 | — | — | `rgba(232,228,223,0.3)` |
| Bottom copy | Noto Sans KR | `1rem` (16px) | 200 | — | `2.1` | `rgba(232,228,223,0.45)` |

### 2.8 S4 — The Maker

| 요소 | font-family | size | weight | style | letter-spacing | line-height | color |
|------|------------|------|--------|-------|----------------|-------------|-------|
| Section title | Cormorant Garamond | `clamp(28px, 3.5vw, 44px)` | 300 | — | `0.03em` | — | `#312E2A` |
| Title KR | Noto Sans KR | `0.8125rem` (13px) | 300 | — | `0.15em` | — | `rgba(49,46,42,0.35)` |
| Sub | Noto Sans KR | `0.875rem` (14px) | 300 | — | `0.02em` | `2.2` | `rgba(49,46,42,0.4)` |
| Card label | Cormorant Garamond | `0.6875rem` (11px) | — | — | `0.15em` | — | `rgba(49,46,42,0.25)` |
| Card name | Cormorant Garamond | `clamp(20px, 2.5vw, 28px)` | 300 | italic | — | — | `rgba(49,46,42,0.7)` |
| Card desc | Noto Sans KR | `0.8125rem` (13px) | 300 | — | — | `2` | `rgba(49,46,42,0.45)` |

### 2.9 S5 — Archive

| 요소 | font-family | size | weight | style | letter-spacing | line-height | color |
|------|------------|------|--------|-------|----------------|-------------|-------|
| Section title | Cormorant Garamond | `clamp(36px, 4.5vw, 56px)` | 300 | — | — | — | `#312E2A` |
| Sub | Noto Sans KR | `1.0625rem` (17px) | 300 | — | — | — | `rgba(49,46,42,0.55)` |
| Card depth | Cormorant Garamond | `0.875rem` (14px) | — | italic | `0.02em` | — | `rgba(49,46,42,0.4)` |
| Card name | Cormorant Garamond | `1.375rem` (22px) | 300 | italic | — | — | `#312E2A` |
| Card desc | Noto Sans KR | `0.8125rem` (13px) | 300 | — | — | `1.7` | `rgba(49,46,42,0.5)` |
| Provenance text | Noto Sans KR | `0.8125rem` (13px) | 300 | — | — | `2` | `rgba(49,46,42,0.4)` |

### 2.10 S6 — Ocean Circle

| 요소 | font-family | size | weight | letter-spacing | line-height | color |
|------|------------|------|--------|----------------|-------------|-------|
| Title | Cormorant Garamond | `clamp(28px, 3.5vw, 44px)` | 300 | `0.03em` | — | `#F1EFEB` |
| Headline | Noto Sans KR | `1rem` (16px) | 200 | — | `2` | `rgba(232,228,223,0.45)` |
| CTA | Noto Sans KR | `0.8125rem` (13px) | 300 | `0.08em` | — | `rgba(232,228,223,0.45)` → hover `0.75` |

### 2.11 S7 — For Professionals

| 요소 | font-family | size | weight | letter-spacing | line-height | color |
|------|------------|------|--------|----------------|-------------|-------|
| Title | Cormorant Garamond | `clamp(24px, 3vw, 36px)` | 300 | — | — | `#312E2A` |
| Title KR | Noto Sans KR | `0.6875rem` (11px) | — | `0.15em` | — | `rgba(49,46,42,0.3)` |
| Desc | Noto Sans KR | `0.875rem` (14px) | 300 | — | `2` | `rgba(49,46,42,0.5)` |
| CTA | Noto Sans KR | `0.8125rem` (13px) | 300 | `0.06em` | — | `rgba(49,46,42,0.45)` → hover `0.75` |

### 2.12 Footer

| 요소 | font-family | size | weight | letter-spacing | color |
|------|------------|------|--------|----------------|-------|
| Logo | Cormorant Garamond | `0.75rem` (12px) | — | `0.2em` | `rgba(232,228,223,0.15)` |
| Copyright | Noto Sans KR | `0.625rem` (10px) | — | `0.04em` | `rgba(232,228,223,0.1)` |

---

## 3. 간격/여백 시스템

### 3.1 디자인 토큰 (CSS Custom Properties)

| 토큰 | 값 | 용도 |
|------|------|------|
| `--grid-margin` | `80px` | 좌우 페이지 마진 |
| `--grid-gutter` | `24px` | 컬럼 간 거터 |
| `--max-width` | `1440px` | 최대 콘텐츠 너비 |
| `--text-max` | `680px` | 텍스트 최대 너비 |

### 3.2 섹션별 패딩

| 섹션 | padding-top | padding-bottom | 비고 |
|------|-------------|----------------|------|
| S1 The Void | — | — | `height: 200vh`, sticky pin 구조 |
| S2 Observation | — | — | `height: 400vh`, sticky pin 구조 |
| S2 Evidence | `160px` | `160px` | 정적 섹션 |
| S3 Data Archive | `240px` | `280px` | |
| S4 The Maker | `160px` | `140px` | |
| S5 Archive | `200px` | `120px` | |
| S6 Ocean Circle | `160px` | `160px` | |
| S7 For Pro | `120px` | `140px` | |
| Footer | `56px` | `56px` | |

### 3.3 섹션 내부 주요 간격

| 섹션 | 요소 | gap/margin |
|------|------|-----------|
| **S2 Evidence** | header → pairs | `margin-bottom: 100px` |
| | pair 간 | `margin-bottom: 100px` |
| | closing margin-top | `120px` |
| **S3 Data** | header margin-bottom | `120px` |
| | wave margin-bottom | `100px` |
| | metrics gap | `100px` (flex gap) |
| | metrics margin-bottom | `120px` |
| | bottom grid gap | `80px` |
| **S4 Maker** | header margin-bottom | `80px` |
| | cards grid gap | `60px` |
| | card image margin-bottom | `32px` |
| | card label margin-bottom | `12px` |
| | card name margin-bottom | `16px` |
| **S5 Archive** | header margin-bottom | `100px` |
| | carousel card gap | `28px` |
| | carousel wrap margin-bottom | `160px` |
| | dots margin-top | `40px` |
| | provenance padding-top | `56px` |
| | provenance margin-top (from border) | `80px` |
| | provenance icon-text gap | `20px` |
| **S6 Circle** | inner grid gap | `80px` |
| | title margin-bottom | `32px` |
| | headline margin-bottom | `40px` |
| **S7 Pro** | title margin-bottom | `8px` |
| | title-kr margin-bottom | `32px` |
| | desc margin-bottom | `40px` |

### 3.4 컨테이너 너비

| 요소 | max-width |
|------|-----------|
| `.container` | `1440px` |
| S3 data sub text | `420px` |
| S3 data wave | `900px` |
| S3 data bottom | `900px` |
| S4 maker cards | `1000px` |
| S5 archive pair | `960px` |
| S6 circle inner | `1100px` |
| S6 circle content | `400px` |
| S7 pro center | `520px` |

---

## 4. 모션 스펙

### 4.1 이징 커브 (CSS Custom Properties)

| 토큰 | 값 | 용도 |
|------|------|------|
| `--ease-gentle` | `cubic-bezier(0.25, 0.1, 0.25, 1.0)` | 스크롤 진입 reveal, 타이틀 등장 |
| `--ease-water` | `cubic-bezier(0.23, 1.0, 0.32, 1.0)` | 호버 반응, 카드 이동, 메뉴 인터랙션 |
| `--ease-slow` | `cubic-bezier(0.4, 0.0, 0.2, 1.0)` | 메뉴 오버레이 fade |

### 4.2 Scroll Reveal (공통)

| 속성 | 값 |
|------|------|
| 초기 상태 | `opacity: 0; transform: translateY(32px)` |
| 최종 상태 | `opacity: 1; transform: translateY(0)` |
| Duration | `0.9s` |
| Easing | `var(--ease-gentle)` |
| Trigger | IntersectionObserver, `threshold: 0.15`, `rootMargin: '0px 0px -8% 0px'` |
| Delay 단계 | `0.15s` / `0.3s` / `0.45s` / `0.6s` (reveal-delay-1~4) |

### 4.3 S1 — The Void 애니메이션

| 애니메이션 | duration | delay | easing | 상세 |
|-----------|----------|-------|--------|------|
| **title-in** (headline) | `2s` | `0.5s` | `var(--ease-gentle)` | `opacity: 0 → 1`, `translateY(20px) → 0` |
| **title-in** (sub) | `1.5s` | `1.2s` | `var(--ease-gentle)` | 동일 |
| **title-in** (scroll indicator) | `1s` | `2.5s` | `var(--ease-gentle)` | 동일 |
| **scroll-pulse** (scroll line) | `1.8s` | — | `ease-in-out`, infinite | `top: -50% → 100%`, `opacity: 0→1→0` |
| **float-up** (particles) | `18~25s` | `0~10s` (각 파티클) | `linear`, infinite | `translateY(100vh) → -10vh`, `translateX(0→20px)` |
| **Hero fade-out** (scroll) | — | — | — | `scrollY` 기반: `opacity = 1 - progress`, `translateY = -scrollY * 0.3` |

### 4.4 S2 — Observation 스크롤 연동 모션

| 요소 | 속성 | 범위 | 비고 |
|------|------|------|------|
| 배경색 | `background-color` | `#ECEAE6` → `#0A0908` | progress 0→1 보간 |
| 텍스트색 | `color` | `#312E2A` → `#F1EFEB` | 동시 보간 |
| Depth line 너비 | `width` | `1px` → `3px` | `1 + progress * 2` |
| Depth line opacity | `opacity` | `0.06` → `0.12` | `0.06 + progress * 0.06` |
| Letter-spacing | — | `0.04em` → `0.01em` | `0.04 - progress * 0.03` |
| Line-height | — | `2.2` → `1.7` | `2.2 - progress * 0.5` |
| Fact 등장 | `opacity + translateY` | `0→1→0`, `20px→0→-10px` | zone 0.05~0.82 내 순차 |
| Climax 등장 | `opacity` | `0 → 1` | zone 0.85~1.0 |
| 전체 transition | `background-color` | `0.05s linear` | pin 요소에 적용 |

### 4.5 S3 — Data Archive 파동 애니메이션

| 파동 | stroke 색상 | duration | direction | dash |
|------|------------|----------|-----------|------|
| wave-path--1 | `rgba(204,173,123,0.25)` | `10s` | normal | `8 4` |
| wave-path--2 | `rgba(204,173,123,0.14)` | `14s` | reverse | `12 6` |
| wave-path--3 | `rgba(204,173,123,0.06)` | `18s` | normal | `16 8` |

- Animation: `stroke-dashoffset: 0 → -200`, `linear`, `infinite`
- stroke-width: `1`

### 4.6 S5 — Archive 카드 호버

| 속성 | 값 |
|------|------|
| Transform | `translateY(-6px)` |
| Duration | `0.5s` |
| Easing | `var(--ease-water)` |

### 4.7 S6 — Ocean Circle 링 애니메이션

| 애니메이션 | duration | easing | 상세 |
|-----------|----------|--------|------|
| **ring-breathe** (외부 링) | `8s` | `ease-in-out`, infinite | `scale(1) → scale(1.06)`, `opacity: 1 → 0.7` |
| **ring-breathe** (중간 링, ::before) | `8s` | `ease-in-out`, infinite, **reverse** | 동일 |
| **ring-breathe** (내부 링, ::after) | `12s` | `ease-in-out`, infinite | 동일 |

### 4.8 CTA / 인터랙션 공통

| 요소 | 속성 | duration | easing |
|------|------|----------|--------|
| text-cta (밝은 배경) | color + border-color | `0.4s` | `var(--ease-water)` |
| s-circle__cta (어두운 배경) | color + border-color | `0.4s` | `var(--ease-water)` |
| s-pro__cta | color + border-color | `0.4s` | `var(--ease-water)` |
| Header padding | padding | `0.5s` | `var(--ease-water)` |
| Menu overlay | opacity + visibility | `0.6s` | `var(--ease-slow)` |
| Menu link hover | opacity + transform | `0.4s` | `var(--ease-water)` |
| Menu link translateX | `0 → 12px` | `0.4s` | `var(--ease-water)` |
| Menu hamburger lines | all | `0.4s` | `var(--ease-water)` |
| Section indicator dot | all | `0.5s` | `var(--ease-water)` |

### 4.9 Reduced Motion 대응

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.15s !important;
  }
  .reveal { opacity: 1; transform: none; }
  .particle { display: none; }
}
```

---

## 5. 텍스처/이펙트

### 5.1 필름 그레인 (Global)

| 속성 | 값 |
|------|------|
| 위치 | `body::after`, `position: fixed`, `inset: 0` |
| z-index | `9999` |
| pointer-events | `none` |
| **opacity** | **`0.035`** (3.5%) |
| 패턴 | SVG `feTurbulence`, `type: fractalNoise`, `baseFrequency: 0.85`, `numOctaves: 4` |
| background-size | `128px 128px` |

### 5.2 한지 텍스처 (`.hanji-texture::before`)

| 속성 | 값 |
|------|------|
| 위치 | `::before`, `position: absolute`, `inset: 0` |
| pointer-events | `none` |
| **기본 opacity** | **`0.04`** (4%) |
| 패턴 | SVG `feTurbulence`, `type: fractalNoise`, `baseFrequency: 0.015`, `numOctaves: 6`, `seed: 3` + `feColorMatrix saturate: 0` |
| background-size | `512px 512px` |

#### 섹션별 한지 opacity 오버라이드

| 섹션 | opacity |
|------|---------|
| S4 The Maker | `0.05` (5%) |
| S5 Archive | `0.035` (3.5%) |
| S7 For Pro | `0.035` (3.5%) |

### 5.3 이미지 플레이스홀더 (`.img-placeholder`)

| 속성 | 값 |
|------|------|
| background | `linear-gradient(145deg, rgba(49,46,42,0.06) 0%, rgba(49,46,42,0.02) 50%, rgba(204,173,123,0.03) 100%)` |
| 그레인 오버레이 (::after) | 필름 그레인과 동일 SVG, `baseFrequency: 0.8` |
| 그레인 opacity | `0.08` (8%) |
| 그레인 mix-blend-mode | `overlay` |
| 그레인 background-size | `128px` |

#### Aspect Ratio 변형

| 클래스 | 비율 |
|--------|------|
| `--16x9` | `16 / 9` |
| `--3x4` | `3 / 4` |
| `--4x5` | `4 / 5` |
| `--7x10` | `7 / 10` |

### 5.4 S1 — The Void 배경 그라디언트

```css
radial-gradient(ellipse 80% 60% at 50% 70%, rgba(204,173,123,0.04), transparent 70%),
radial-gradient(ellipse 40% 30% at 50% 85%, rgba(204,173,123,0.02), transparent 60%),
var(--warm-ivory)
```

> 매우 미묘한 골드 글로우가 하단 70~85% 지점에 집중. 거의 인식 불가 수준.

### 5.5 S1 — 파티클

| 속성 | 값 |
|------|------|
| 크기 | `2px` (기본), `1px` / `1.5px` (변형) |
| 형태 | `border-radius: 50%` (원형) |
| 색상 | `rgba(204,173,123,0.2)` (골드, 20%) |
| 개수 | 7개 |
| 분포 | `left: 15%~88%` (수평 분산) |

### 5.6 S2 Evidence — 비교 이미지 그라디언트

| 타입 | background |
|------|-----------|
| Before (기본) | `linear-gradient(135deg, rgba(241,239,235,0.03) 0%, rgba(241,239,235,0.01) 100%)` |
| After | `linear-gradient(135deg, rgba(204,173,123,0.04) 0%, rgba(241,239,235,0.01) 100%)` |
| 공통 border | `0.5px solid rgba(241,239,235,0.04)` |

### 5.7 S3 — Data Archive 파동 SVG

- **캔버스**: `viewBox="0 0 960 320"`, `preserveAspectRatio="none"`
- **패스**: 사인파 형태, 좌측 -50에서 우측 1060까지 확장 (overflow 커버)
- **stroke-width**: `1` (모든 패스)
- 색상/속도: 위 §4.5 참조

### 5.8 S5 — Archive 카드 이미지 처리

```css
background: linear-gradient(180deg,
  rgba(49,46,42,0.04) 0%,
  rgba(49,46,42,0.01) 60%,
  rgba(204,173,123,0.02) 100%
);
/* + 0.5px solid rgba(49,46,42,0.06) 인셋 보더 */
```

### 5.9 S6 — Ocean Circle 비네팅

```css
radial-gradient(
  ellipse 70% 60% at 50% 50%,
  transparent 20%,
  rgba(8, 14, 24, 0.4) 70%,
  rgba(5, 10, 18, 0.7) 100%
)
```

### 5.10 S6 — Ocean Circle 링

| 링 | 크기 | border | 색상 |
|-----|------|--------|------|
| 외부 | `200px x 200px` | `0.5px solid` | `rgba(204,173,123,0.15)` |
| 중간 (::before) | inset `24px` | `0.5px solid` | `rgba(204,173,123,0.10)` |
| 내부 (::after) | inset `48px` | `0.5px solid` | `rgba(204,173,123,0.06)` |

### 5.11 보더/구분선 정리

| 위치 | 두께 | 색상 |
|------|------|------|
| Menu separator | `0.5px` | `rgba(232,228,223,0.08)` |
| Scroll line (S1) | `1px` | `rgba(49,46,42,0.1)` |
| Maker card image border | `0.5px` | `rgba(49,46,42,0.06)` |
| Archive provenance top | `0.5px` | `rgba(49,46,42,0.06)` |
| CTA underline (light bg) | `0.5px` | `rgba(49,46,42,0.15)` → hover `0.3` |
| CTA underline (dark bg) | `0.5px` | `rgba(232,228,223,0.15)` → hover `0.3` |
| Menu hamburger lines | `0.5px` height | `rgba(241,239,235,0.6)` → hover `1.0` |
| Depth line (S2) | `1px` → `3px` | gradient: `rgba(49,46,42,0.06)` → `rgba(241,239,235,0.08)` |

---

## 6. 반응형 브레이크포인트

### 6.1 Tablet (`max-width: 1023px`)

| 토큰/요소 | 변경 |
|-----------|------|
| `--grid-margin` | `80px` → **`40px`** |
| Menu overlay inner gap | `80px` → **`40px`** |
| S4 Maker cards gap | `60px` → **`40px`** |
| S3 Data metrics gap | `100px` → **`56px`** |

### 6.2 Mobile (`max-width: 767px`)

#### 디자인 토큰 변경

| 토큰 | Desktop | Mobile |
|------|---------|--------|
| `--grid-margin` | `80px` | **`24px`** |
| `--grid-gutter` | `24px` | **`16px`** |

#### Header

| 속성 | 변경 |
|------|------|
| padding | `36px var(--grid-margin)` → **`24px var(--grid-margin)`** |

#### Section Indicator

| 속성 | 변경 |
|------|------|
| display | `flex` → **`none`** (완전 숨김) |

#### Menu Overlay

| 속성 | 변경 |
|------|------|
| grid-template-columns | `1fr 1fr` → **`1fr`** |
| gap | `80px` → **`40px`** |
| right panel align-items | `flex-end` → **`flex-start`** |
| right panel padding-right | `40px` → **`0`** |

#### S1 — The Void

| 요소 | Desktop | Mobile |
|------|---------|--------|
| Headline size | `clamp(36px, 6vw, 64px)` | **`clamp(28px, 8vw, 40px)`** |
| Headline letter-spacing | `0.08em` | **`0.06em`** |

#### S2 — Observation

| 요소 | Desktop | Mobile |
|------|---------|--------|
| Depth counter position right | `80px` | **`24px`** |
| Depth counter font-size | `clamp(2.5rem, 5vw, 4rem)` | **`2.5rem`** |
| Evidence padding | `160px 0` | **`100px 0`** |
| Pair grid columns | `1fr 1fr` | **`1fr`** (스택) |
| Pair gap | `2px` | **`32px`** |
| Pair padding | `0` | **`0 24px`** |
| Pair title grid-column | `1 / -1` | **`1`** |

#### S3 — Data Archive

| 요소 | Desktop | Mobile |
|------|---------|--------|
| Section padding | `240px 0 280px` | **`160px 0 200px`** |
| Wave height | `320px` | **`200px`** |
| Metrics direction | `row` (flex) | **`column`** |
| Metrics gap | `100px` | **`48px`** |
| Bottom grid columns | `1fr 1fr` | **`1fr`** |
| Bottom copy grid-column | `2` | **`1`** |
| Bottom copy text-align | left | **`center`** |

#### S4 — The Maker

| 요소 | Desktop | Mobile |
|------|---------|--------|
| Section padding | `160px 0 140px` | **`100px 0 100px`** |
| Cards grid columns | `1fr 1fr` | **`1fr`** (스택) |
| Cards gap | `60px` | **`48px`** |

#### S5 — Archive

| 요소 | Desktop | Mobile |
|------|---------|--------|
| Section padding | `200px 0 120px` | **`120px 0 80px`** |
| Card flex-basis | `272px` | **`240px`** |

#### S6 — Ocean Circle

| 요소 | Desktop | Mobile |
|------|---------|--------|
| Section padding | `160px 0` | **`100px 0`** |
| Inner grid columns | `1fr 1fr` | **`1fr`** (스택) |
| Inner gap | `80px` | **`48px`** |
| Inner text-align | left | **`center`** |
| Visual aspect-ratio | `4 / 3` | **`auto`** |
| Visual padding | — | **`20px 0`** |
| Ring size | `200px` | **`160px`** |

#### S7 — For Professionals

| 요소 | Desktop | Mobile |
|------|---------|--------|
| Section padding | `120px 0 140px` | **`80px 0 100px`** |

#### Footer

| 요소 | Desktop | Mobile |
|------|---------|--------|
| Padding | `56px var(--grid-margin)` | **`40px var(--grid-margin)`** |
| Inner layout | `flex row` | **`flex column, gap: 12px, center`** |

---

## 부록: 검증 결과 (와이어프레임 vs 기존 스펙 차이)

기존 `homepage-visual-spec.md`와 와이어프레임 CSS 사이에서 발견된 차이점을 기록한다.

| 항목 | 기존 스펙 | 와이어프레임 실제 값 | 판단 |
|------|----------|-------------------|------|
| S1 배경색 | `#0A0908` (다크) | `#ECEAE6` (warm-ivory, 라이트) | **와이어프레임 우선** — 라이트 히어로 |
| S2 Observation | 정적 그레이지 배경 | 스크롤 연동 light→dark 그라디언트 + Evidence 분리 | **와이어프레임 우선** — Pressure Descent 구현 |
| S6 Ocean Circle 배경 | `#0B0A08` | `#0A0D12` | **와이어프레임 우선** — 미세한 네이비 시프트 |
| S7 For Pro 배경 | `#ECEAE6` | `#F5F1E8` | **와이어프레임 우선** — 더 따뜻한 톤 |
| Tablet margin | `40px` (스펙) vs 미언급 | `40px` (확인) | 일치 |
| Mobile margin | `20px` (스펙) | `24px` (와이어프레임) | **와이어프레임 우선** — `24px` 적용 |
| S1 Hero 타이포 | Cormorant Garamond Display | Noto Sans KR (body font), weight 200 | **와이어프레임 우선** — 한글 헤드라인이므로 본문 서체 사용 |
| S3 Data 섹션 패딩 | `200px` top/bottom | `240px top / 280px bottom` | **와이어프레임 우선** |
| S5 Archive 카드 너비 | `280px` | `272px` | **와이어프레임 우선** |
| Menu overlay bg | 미정의 | `rgba(10,9,8,0.96)` + `blur(40px) saturate(0.8)` | 와이어프레임 값 채택 |

> 와이어프레임 CSS가 최신 구현 기준이므로, 충돌 시 와이어프레임 값을 우선 적용한다.
