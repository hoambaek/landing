# Muse de Maree — Brand Design Guide

> Abyssal Amber Design System
> 작성 기준: 2026-04-02
> Source of Truth: Paper 디자인 파일 + frontend-spec.md

---

## 01. Color Palette

**Abyssal Amber** — Hue 연속성(H:30~38) 기반 2색 대비 시스템

### Backgrounds — Dark

| 토큰 | HEX | 용도 |
|------|-----|------|
| `void-bg` | `#0A0908` | 기본 다크 배경 (웜 블랙) |
| `navy` | `#0D0B09` | 다크 배경 변형 |
| `navy-mid` | `#141110` | 중간 다크 배경 |
| `circle-bg` | `#0A0D12` | Ocean Cellar 배경 (블루 언더톤) |

### Backgrounds — Light

| 토큰 | HEX | 용도 |
|------|-----|------|
| `sand` | `#E8E5E1` | 기본 라이트 배경 (소프트 그레이지) |
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

### Tailwind CSS 4 토큰 매핑

```css
@theme {
  --color-void-bg: #0A0908;
  --color-navy: #0D0B09;
  --color-navy-mid: #141110;
  --color-circle-bg: #0A0D12;
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
}
```

---

## 02. Typography

극저 웨이트(200-300), 열린 행간(1.8-2.1), 넓은 자간

### Heading — Cormorant Garamond

Weight 300 (Light)

| 레벨 | 크기 | 예시 |
|------|------|------|
| H1 | 72px | 두 개의 떼루아 |
| H2 | 48px | collection. |
| H3 | 36px | the maker. |
| H4 | 28px | Ocean Cellar Prive |
| H5 | 22px | living data. |

### Body — Noto Sans KR

Weight 300, 400

| 레벨 | 크기 | 용도 |
|------|------|------|
| Body L | 16px | 주요 본문 텍스트 |
| Body M | 14px | 일반 본문 텍스트 |
| Body S | 13px | 보조 텍스트 |
| Caption | 11px | 데이터 캡션 (uppercase) |
| Label | 10px | 섹션 라벨, 내비게이션, 메타데이터 (uppercase, letter-spacing: 0.15em) |

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
| 본문 최소 크기 | 18pt 이하 금지 |
| 텍스트 한도 | 슬라이드당 한글 60~100자 이내 (캡션 제외) |
| 이미지 비율 | 페이지당 60~80% |

---

*Source: Paper design file "Muse de Maree" + docs/tech/frontend-spec.md + teams/00-luxury-branding-team/brand-standards.md*
