# Muse de Maree — Brand Design Guide

> Abyssal Amber Design System
> 작성 기준: 2026-04-02
> 갱신: 2026-06-10 — 3-Font Trinity(한글·영문·숫자), 시맨틱 역할 토큰, IBM Plex Mono 데이터 서체, 다크 elevation 사다리, 컴포넌트 확장(Forms·Nav·Tags·Footer) 반영
> Source of Truth: Paper 디자인 파일 + frontend-spec.md

---

## 01. Color Palette

**Abyssal Amber** — Hue 연속성(H:30~38) 기반 2색 대비 시스템

### Backgrounds — Dark · Elevation 톤 사다리

다크 배경은 "변형"이 아니라 표면 계층(elevation)으로 의미를 부여한다.

| 토큰 | HEX | 역할 |
|------|-----|------|
| `void-bg` | `#0A0908` | **canvas** — 기본 바닥 (웜 블랙) |
| `navy` | `#0D0B09` | **surface** — 표면 1단 |
| `navy-mid` | `#141110` | **elevated** — 상승 2단 |
| `circle-bg` | `#0A0D12` | **special** — Ocean Cellar (블루 언더톤) |

### Backgrounds — Light

| 토큰 | HEX | 용도 |
|------|-----|------|
| `main` | `#C4BFBB` | **메인 라이트 배경** (따뜻한 그레이) |
| `sand` | `#E8E5E1` | 라이트 배경 변형 (소프트 그레이지) |
| `sand-deep` | `#DDDAD5` | 라이트 배경 변형 (깊은 그레이지) |
| `warm-ivory` | `#ECEAE6` | 라이트 배경 변형 (따뜻한 아이보리) |
| `warm-paper` | `#E3E0DC` | 한지 텍스처 배경 |
| `pro-bg` | `#F5F1E8` | Partnership 섹션 배경 |

### Text & Accent

| 토큰 | HEX | 용도 |
|------|-----|------|
| `earth` | `#312E2A` | 라이트 배경 위 텍스트 (웜 다크) |
| `void-text` | `#F1EFEB` | 다크 배경 위 텍스트 (오프화이트) |
| `amber` | `#CCAD7B` | 유일한 악센트 (샴페인 골드) |
| `amber-muted` | `#b89868` | 악센트 변형 (뮤트 골드) |

### Semantic Roles — 역할 기반 토큰

색 이름이 아니라 **역할**로 참조한다 (Bugatti DESIGN 시스템 비교 후 도입).

| 토큰 | 매핑 / HEX | 용도 |
|------|-----------|------|
| `text-on-light` | → `earth` `#312E2A` | 라이트 배경 위 텍스트 |
| `text-on-dark` | → `void-text` `#F1EFEB` | 다크 배경 위 텍스트 |
| `hairline` | `rgba(49,46,42,.10)` | 구분선 기본 |
| `link` | → `amber` `#CCAD7B` | 인라인 링크 (밑줄) |
| `success` | `#6E7F63` | 폼 완료 (뮤트 모스) |
| `warning` | `#B5703A` | 폼 오류 (번트 앰버) |

### Tailwind CSS 4 토큰 매핑

```css
@theme {
  --color-void-bg: #0A0908;
  --color-navy: #0D0B09;
  --color-navy-mid: #141110;
  --color-circle-bg: #0A0D12;
  --color-main: #C4BFBB;
  --color-sand: #E8E5E1;
  --color-sand-deep: #DDDAD5;
  --color-warm-ivory: #ECEAE6;
  --color-warm-paper: #E3E0DC;
  --color-pro-bg: #F5F1E8;
  --color-earth: #312E2A;
  --color-void-text: #F1EFEB;
  --color-amber: #CCAD7B;
  --color-amber-muted: #b89868;
  --color-border-default: rgba(49, 46, 42, 0.10);
  --color-border-subtle: rgba(49, 46, 42, 0.08);
  --color-border-emphasis: rgba(49, 46, 42, 0.18);

  /* Semantic roles */
  --color-link: #CCAD7B;
  --color-success: #6E7F63;
  --color-warning: #B5703A;

  /* Type families — 3-Font Trinity */
  --font-heading: "Cormorant Garamond", serif;            /* 영문 표제 */
  --font-sans: "Noto Sans KR", sans-serif;                /* 한글 본문·표제 */
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;  /* 숫자·데이터 */
}
```

---

## 02. Typography

3-Font Trinity (한글·영문·숫자) · 극저 웨이트(200–300) · 열린 행간 · 넓은 자간

### Type Families — 3-Font Trinity

폰트를 스크립트별로 분리한다. **숫자는 모노스페이스로 통일** — Cormorant의 올드스타일 숫자를 쓰지 않고, 데이터/아카이브 정체성을 강화한다.

| 역할 | 폰트 | 웨이트 | 용도 |
|------|------|--------|------|
| **영문 / Latin** | Cormorant Garamond | 300 Light | 표제·디스플레이 |
| **한글 / Korean** | Noto Sans KR | 300, 400 | 표제·본문 |
| **숫자 / Numerals** | IBM Plex Mono | 400 | 측정값·좌표·연도·아카이브 No. |

### Heading Scale — 동일 폰트 · 사이즈 램프

헤딩은 **같은 폰트(영문 Cormorant / 한글 Noto)를 사이즈만 다르게** 보여준다. 레벨마다 다른 폰트가 아니라, 하나의 폰트가 스케일을 따라 커진다. 영문·한글 동일 스케일 적용.

| 레벨 | 크기 | 행간 | 자간 |
|------|------|------|------|
| H1 | 72px | 1.1 | .01em |
| H2 | 48px | 1.15 | .01em |
| H3 | 36px | 1.2 | .01em |
| H4 | 28px | 1.25 | .02em |
| H5 | 22px | 1.3 | .02em |

### Body — Noto Sans KR

Weight 300, 400

| 레벨 | 크기 | 행간 | 자간 | 용도 |
|------|------|------|------|------|
| Body L | 16px | 1.8 | 0 | 주요 본문 텍스트 |
| Body M | 14px | 1.75 | 0 | 일반 본문 텍스트 |
| Body S | 13px | 1.7 | 0 | 보조 텍스트 |
| Caption | 11px | 1.5 | .12em | 메타데이터 (uppercase) |
| Label | 10px | 1.4 | .15em | 섹션 라벨·내비·메타데이터 (uppercase) |

### Data — IBM Plex Mono

측정값·좌표·타임스탬프·라이브 데이터 전용. 숫자가 들어가는 모든 데이터 표기는 이 서체로.

| 레벨 | 크기 | 행간 | 자간 | 용도 |
|------|------|------|------|------|
| Metric | 24px | 1.0 | .02em | 단일 측정값 (`1.8°C`) |
| Telemetry | 13px | 1.4 | .04em | `DEPTH 70.0 M · TEMP 1.8°C · PRESSURE 7.1 ATM` |
| Coord | 12px | 1.4 | .08em | 좌표 · `Archive No. 001` |
| Stamp | 11px | 1.4 | .10em | 타임스탬프 · `LIVE` |

### Dark Context

다크 배경(`void-bg #0A0908`) 위:
- 헤딩: `void-text #F1EFEB`
- 본문: `void-text` opacity 0.8
- 악센트 텍스트: `amber #CCAD7B`

---

## 03. Components

평면 디자인 · 0.5px 극가는 보더 · 그림자 없음 · 직각 모서리

### Cards

**Light Card** (라이트 배경 위)
```css
background: var(--sand);           /* #E8E5E1 */
border: 0.5px solid rgba(49, 46, 42, 0.25);
border-radius: 0;
box-shadow: none;
padding: 40px 32px;
transition: border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
```

**Dark Card** (다크 배경 위)
```css
background: transparent;
border: 0.5px solid rgba(241, 239, 235, 0.12);
border-radius: 0;
box-shadow: none;
```

**Hover State** (공통)
```css
border-color: #CCAD7B;             /* amber */
transition: border-color 0.4s;
```

### Buttons & CTA

| 유형 | 스타일 | 용도 |
|------|--------|------|
| Primary CTA | amber 보더, 투명 배경 | "경험 시작하기" |
| Filled CTA | amber 배경, 어두운 텍스트 | "발견하기" |
| Secondary | earth 보더, 투명 배경 | "더 알아보기" |
| Text Link | amber 텍스트 + arrow(→) | "컬렉션 보기 →" |

CTA 언어 규칙:
- "구매" → **"발견"**
- "결제" → **"경험 시작"**
- "가입" → **"초대"**
- "지금 구매", "한정 특가" 등 판매 언어 금지

### Borders & Dividers

| 스타일 | 값 | 용도 |
|--------|-----|------|
| Light 기본 | `0.5px solid rgba(49, 46, 42, 0.25)` | 라이트 배경 위 구분선 |
| Light 미세 | `0.5px solid rgba(49, 46, 42, 0.12)` | 라이트 배경 위 미세 구분 |
| Accent / Hover | `0.5px solid #CCAD7B` | 악센트 구분선, 호버 보더 |
| Dark 기본 | `0.5px solid rgba(241, 239, 235, 0.12)` | 다크 배경 위 구분선 |

> 컴포넌트는 raw hex 대신 토큰을 참조한다: 라이트 카드 → `border-default`, 다크 카드 → `border-dark`, 호버 → `link`(amber).

### Forms & Inputs

밑줄 전용(underline-only) · 투명 배경 · `border-radius: 0`

| 상태 | 스타일 |
|------|--------|
| Default | 하단 보더만 `0.5px solid rgba(49,46,42,0.40)`, placeholder `text` 50% |
| Focus | 하단 보더 `0.5px solid var(--amber)` (#CCAD7B) |
| Error | 하단 보더 `var(--warning)` (#B5703A) |
| Success | 하단 보더 `var(--success)` (#6E7F63) |

높이 44px (터치 타깃). 라벨은 `Label 10px` uppercase / ls .15em.

### Navigation — Top Bar

투명 배경 · 상하 `0.5px hairline` · 워드마크 중앙. 높이 56px.
- 좌: `Menu` (Label 10px uppercase / ls .15em)
- 중앙: 워드마크 `MUSE DE MARÉE` (Cormorant, ls .18em)
- 우: `Ocean Cellar Privé` (amber-muted)

### Tags & Captions

- **캡션**: 서체 자체 (배경·보더 없음). `Caption 11px` uppercase / ls .12em.
- **태그 칩**: 직각(`radius 0`) hairline 보더, padding 7px 14px.
- **한정 넘버**: `Limited 001 / 300` 등 숫자는 IBM Plex Mono.

### Footer

다크 밴드(`void-bg #0A0908`) · padding 48px.
- 워드마크 `Muse de Marée` (Cormorant) + 한 줄 소개
- 링크 컬럼: Explore / Connect (Label 10px uppercase 헤더 + Body 12px 링크)
- 하단 바: `0.5px` hairline 구분 위 — 좌 카피라이트 `© 2026 MUSE DE MARÉE` (Mono), 우 태그라인 (amber)

---

## 04. Spacing & Motion

8px 기반 그리드 · 섹션 간 160-280px · 자연 이징 곡선

### Spacing Scale — 8px Grid

| 크기 | 토큰 | 용도 |
|------|------|------|
| 4px | `micro` | 아이콘 내부 |
| 8px | `xs` | 인접 요소 간격 |
| 16px | `sm` | 카드 내부 요소 |
| 24px | `md` | 그룹 간격 |
| 32px | `lg` | 카드 패딩 |
| 48px | `xl` | 섹션 내부 블록 간격 |
| 80px | `2xl` | 아트보드 마진 |
| 160px | `3xl` | 섹션 패딩 (최소) |
| 280px | `4xl` | 섹션 패딩 (최대) |

### Easing Curves

| 이름 | 값 | 용도 |
|------|-----|------|
| `gentle` | `cubic-bezier(0.25, 0.1, 0.25, 1.0)` | 기본 전환, 페이드, 슬라이드 |
| `water` | `cubic-bezier(0.23, 1.0, 0.32, 1.0)` | 유기적 모션, 물결, 파티클 |
| `slow` | `cubic-bezier(0.4, 0.0, 0.2, 1.0)` | 느린 강조, 보더 호버, 스크롤 반응 |

### Z-Index Scale

| 값 | 토큰 | 용도 |
|----|------|------|
| 0 | `z-bg` | 배경 |
| 1 | `z-content` | 콘텐츠 |
| 10 | `z-overlay` | 오버레이 |
| 50 | `z-header` | 헤더 |
| 100 | `z-menu` | 메뉴 |
| 200 | `z-modal` | 모달 |

---

## 05. Texture Layers

### Film Grain

```css
position: fixed;
inset: 0;
pointer-events: none;
z-index: 9999;
opacity: 0.035;
/* SVG feTurbulence 기반 노이즈 */
```

### Hanji Texture (한지)

```css
position: absolute;
inset: 0;
pointer-events: none;
opacity: 0.04;
/* SVG feTurbulence: type="turbulence" baseFrequency="0.65" numOctaves="3" */
```

---

## 06. Layout System

### 12-Column Grid

```
grid-template-columns: repeat(12, 1fr);
column-gap: 24px;    /* desktop */
column-gap: 16px;    /* tablet */
column-gap: 12px;    /* mobile */
```

| 용도 | 컬럼 배치 |
|------|-----------|
| 히어로 텍스트 | col 2~8 (7 span) |
| 2단 레이아웃 | col 1~5 + col 7~12 |
| 본문 텍스트 | col 3~10 (8 span) |
| 풀와이드 이미지 | col 1~12 (12 span) |
| 3단 카드 | col 1~4 + 5~8 + 9~12 |

### Container Widths

| 토큰 | 값 | 용도 |
|------|-----|------|
| `container-max` | 1280px | 일반 콘텐츠 |
| `container-narrow` | 768px | 본문 텍스트, 스토리 |
| `container-wide` | 1440px | 풀와이드 갤러리 |

### Section Padding

| 크기 | 값 | 용도 |
|------|-----|------|
| `section-sm` | 48px | 소형 섹션 간격 |
| `section-lg` | 96px | 대형 섹션 간격 |
| `section-xl` | 128px | 히어로 → 첫 섹션 전환 |

---

## 07. Do / Don't

### DO

- 평면 디자인, 극가는 보더(0.5px)
- 직각 모서리 (`border-radius: 0`)
- 넓은 여백, 열린 행간
- 필름 그레인 텍스처
- 느리고 유기적 애니메이션 (0.5~1.0s)
- 낮고 고요한 어조
- "발견하기", "경험 시작하기"

### DON'T

- Glassmorphism (backdrop-filter, blur 카드, 반투명 배경) — 메뉴 오버레이만 예외
- box-shadow 기반 깊이감
- border-radius 12px 이상
- 틸(teal) 계열 색상 (#3D5A56, #A7C7C0 등)
- "구매", "결제" 등 판매 언어
- "최고의", "세계 유일의", "놀라운" 등 과잉 수사
- 빠르고 튀는 움직임

---

## 08. Brand Voice

### 톤

> "심연을 닮은 고요함"

- 소란스럽게 외치지 않는다. 깊은 바다처럼 고요하고, 우아하며, 신비롭게 속삭인다.
- 소문자, 마침표, 짧은 문장, 관찰 일기체
- 과잉 수사 금지
- 슬라이드당 한글 60~100자 이내 (인쇄물 기준)

### 언어 치환

| 금지 | 대체 |
|------|------|
| 숙성 효율 | 시간의 농밀함 |
| 수압 | 심연의 포옹 |
| 데이터 | 바다의 맥박 |
| 구매 | 발견 |
| 결제 | 경험 시작 |
| 가입 | 초대 |
| 맛, 향, 풍미 | (직접적 감각 단어 사용 금지) |

### 3단 명제 구조

| 단계 | 명제 | 역할 |
|------|------|------|
| 1차 — 즉시 이해 | "프랑스 샹파뉴에서 양조하고, 한국 남해에서 숙성합니다" | 3초 안에 이해 |
| 2차 — 깊이 | "두 개의 떼루아" / "바다가 숙성을 완성합니다" | 와인을 아는 사람에게 격 |
| 3차 — 철학 | "증명하되, 강요하지 않는다" | 간접 표현 |

---

## 09. Visual Direction

- 선명한 디지털 화질보다 **필름 사진의 질감(Grain)**
- 심해의 일렁임, 병에 묻은 모래, 세월의 더께가 앉은 코르크
- **촉각이 느껴지는 이미지** — 아날로그적 향수
- 이미지 비율: 페이지당 60~80% (인쇄물 기준)

### 이미지 키워드

- 해저숙성 병 스틸라이프 (해양 침전물, 조개껍데기)
- 수중 심해 (위에서 빛, 하단은 완전한 어둠)
- 산화 금속 표면 매크로 텍스처
- 샹파뉴 포도밭 / 셀러 내부 (따뜻한 자연광)
- IoT 센서 / 숙성 구조물 (차가운 블루 톤)

---

## 10. Presentation Spec (인쇄물/PDF)

소개서, 제안서 등 외부 발행물 기준

| 항목 | 값 |
|------|-----|
| 포맷 | 가로형 16:9 PDF |
| 컬러 | Warm Black `#0A0908` + Greige `#E8E5E1` + Gold `#CCAD7B` |
| 영문/프랑스어 폰트 | Cormorant Garamond |
| 한글 폰트 | Noto Sans KR |
| 숫자 폰트 | IBM Plex Mono (측정·연도·아카이브 No.) |
| 본문 최소 크기 | 18pt 이하 금지 |
| 텍스트 한도 | 슬라이드당 한글 60~100자 이내 (캡션 제외) |
| 이미지 비율 | 페이지당 60~80% |

---

## 11. Known Gaps — 미커버 항목

디자인 시스템에서 아직 정의되지 않은 영역 (정직하게 기록):

- 모션 타이밍 상세(ScrollTrigger·캐러셀·리플) → `frontend-spec.md` §5
- 반응형 브레이크포인트·터치 타깃 → `frontend-spec.md` §6
- 폼 검증 전체 상태 — `success`/`warning`는 토큰만 정의, 인라인 에러/메시지 UI 미정
- 데이터 시각화(차트·게이지·라이브 그래프) 컴포넌트 미정의
- 모바일 하단 네비게이션 바 별도 스펙 필요
- **border 토큰값 일원화 미완** — 카드 보더 `rgba(.25)` vs `hairline` `rgba(.10)` 정합 필요

---

*Source: Paper design file "Muse de Maree" + docs/tech/frontend-spec.md + teams/00-luxury-branding-team/brand-standards.md*
*2026-06-10 갱신: Bugatti DESIGN 시스템 비교 분석 → 3-Font Trinity, 시맨틱 토큰, Mono 데이터 서체, elevation 사다리, 컴포넌트 확장 반영*
