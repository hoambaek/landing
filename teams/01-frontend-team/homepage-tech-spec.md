# Muse de Marée — Homepage Technical Specification

**작성일**: 2026-02-22
**담당**: Frontend Team (01)
**버전**: 1.0.0
**상태**: 초안 (CEO 확인 전)
**레퍼런스**: [`hero-tech-spec.md`](./hero-tech-spec.md), [`spec.md`](../docs/spec.md), [`PLAN.md`](../docs/PLAN.md), [`frontend-spec.md`](../docs/frontend-spec.md)

---

## 개요

Muse de Marée 홈페이지는 7개 섹션으로 구성된 단일 페이지(Single Page) 경험이다. "바다의 시간을 기록하는 디지털 아카이브"라는 콘셉트 아래, 관람자가 해수면에서 심해까지 하강하는 여정을 스크롤로 체험한다.

> **WebGL/Three.js 제거 확정.** 모든 시각 효과는 CSS, SVG, Framer Motion, GSAP으로 구현한다.
> **컬러 토큰 미확정.** `frontend-spec.md` 부록의 초안 값을 참고하되, 디자인팀 확정 후 교체 예정.

---

## 1. 전체 컴포넌트 트리 구조

```
<RootLayout>                                    # Server Component — app/layout.tsx
├── <LenisProvider>                             # Client — Lenis 초기화 + GSAP ticker 연동
├── <Navigation>                                # Client — 고정 헤더 + 풀스크린 오버레이 메뉴
│   ├── <HeaderBar>                             # 로고 + 햄버거 (fixed, z-50)
│   ├── <FullscreenOverlay>                     # 풀스크린 메뉴 (fixed, z-100)
│   │   ├── <MenuItemList>                      # 메인 메뉴 항목 (스태거 애니메이션)
│   │   ├── <ArchiveSubmenu>                    # 5-depth 서브메뉴
│   │   ├── <SocialLinks>                       # Instagram, YouTube, KakaoTalk
│   │   └── <LanguageSelector>                  # KR / EN / FR
│   └── <MobileBottomNav>                       # 모바일 하단 탭 바 (md 이하)
│
├── <HomePage>                                  # Server Component — app/page.tsx
│   │
│   ├── <HeroSection>                           # Client — Section 1: The Void (hero-tech-spec.md 참조)
│   │   ├── <Phase1Surface>
│   │   ├── <WaterTransition>
│   │   └── <Phase2Abyss>
│   │
│   ├── <SectionDivider variant="hanji" />      # Server — 한지 질감 구분선
│   │
│   ├── <ObservationSection>                    # Client — Section 2: Observation
│   │   ├── <DiaryHeader>                       # 날짜 + 관찰 번호
│   │   ├── <DiaryEntry>                        # 텍스트 + 이미지 교차 레이아웃
│   │   │   ├── <DiaryImage>                    # 에디토리얼 사진 (next/image)
│   │   │   └── <DiaryCopy>                     # 관찰 일기 텍스트
│   │   └── <DiaryTimeline>                     # 수직 타임라인 장식선
│   │
│   ├── <SectionDivider variant="ink-wave" />   # Server — 수묵화 파동 구분선
│   │
│   ├── <DataArchiveSection>                    # Client — Section 3: Data Archive
│   │   ├── <ArchiveHeader>                     # "설계된 예술품" 헤드라인
│   │   ├── <GeometricWaveCanvas>               # CSS/SVG 기하학 파동 애니메이션
│   │   ├── <DataExplorer>                      # 인터랙티브 데이터 탐색 영역
│   │   │   ├── <DepthSelector>                 # 깊이 선택 (15m ~ 120m)
│   │   │   ├── <TemperatureGraph>              # SVG 수온 그래프
│   │   │   ├── <PressureGraph>                 # SVG 압력 그래프
│   │   │   └── <DataTooltip>                   # 호버/터치 시 상세 데이터
│   │   └── <ArchiveStatement>                  # 마무리 카피
│   │
│   ├── <SectionDivider variant="hanji" />
│   │
│   ├── <MakerSection>                          # Hybrid — Section 4: The Maker
│   │   ├── <MakerPhoto>                        # CEO 아카이브 사진 (next/image)
│   │   ├── <MakerCredentials>                  # 생산자 소개 + 숙성 팀 이야기
│   │   └── <MakerLetter>                       # "만든 이의 편지" 텍스트
│   │
│   ├── <SectionDivider variant="ink-wave" />
│   │
│   ├── <ArchiveCollectionSection>              # Client — Section 5: Archive
│   │   ├── <DepthLineup>                       # 5-depth 컬렉션 카드 캐러셀
│   │   │   └── <DepthCard>                     # 개별 깊이 카드 (Glass Card)
│   │   ├── <CertificatePreview>                # Underwater Aging Certificate 샘플
│   │   ├── <QRCodeDisplay>                     # 시리얼 QR 코드 시각화
│   │   └── <TastingRitual>                     # Sea Whisper 카드 + 테이스팅 가이드
│   │       ├── <RitualSteps>                   # 리추얼 단계별 일러스트
│   │       └── <PairingInfo>                   # 온도 / 페어링 추천
│   │
│   ├── <SectionDivider variant="hanji" />
│   │
│   ├── <OceanCircleSection>                    # Client — Section 6: Ocean Circle
│   │   ├── <CircleInvitation>                  # 초대 카피 + 혜택 안내
│   │   └── <MembershipForm>                    # 멤버십 가입 폼 (Supabase)
│   │       ├── <FormFields>                    # 이름, 이메일, 전화번호
│   │       └── <FormFeedback>                  # 성공/에러 상태
│   │
│   ├── <SectionDivider variant="ink-wave" />
│   │
│   └── <ProfessionalsSection>                  # Client — Section 7: For Professionals
│       ├── <ProfessionalHeader>                # B2B 전용 헤드라인
│       ├── <InquiryForm>                       # B2B 문의 폼 (Supabase)
│       │   ├── <BusinessFields>                # 업종, 회사명, 담당자 등
│       │   └── <FormFeedback>
│       └── <SalesKitDownload>                  # PDF 다운로드 (룩북, 성분 분석서, B2B 조건서)
│
└── <Footer>                                    # Server Component
    ├── <FooterBrand>                           # 로고 + 브랜드 한 줄 설명
    ├── <FooterLinks>                           # 사이트맵, 법적 고지
    └── <FooterSocial>                          # SNS 링크
```

### Client vs Server Component 판단 기준

| 기준 | Server Component | Client Component |
|------|-----------------|-----------------|
| 정적 텍스트/이미지만 렌더링 | O | — |
| 스크롤 애니메이션 필요 | — | O |
| 사용자 인터랙션 (폼, 호버) | — | O |
| GSAP/Framer Motion 사용 | — | O |
| Supabase 데이터 fetch (빌드 시) | O | — |
| Supabase 데이터 mutation (런타임) | — | O |

> **원칙**: 가능한 한 Server Component로 유지하고, `'use client'` 경계를 최소화한다. 애니메이션이 필요한 래퍼만 Client Component로 분리.

---

## 2. 섹션별 기술 스펙 (Sections 2–7)

### Section 2 — Observation (스토리: 관찰 일기)

#### 컴포넌트 구조

```typescript
// components/observation/ObservationSection.tsx
'use client';

interface DiaryEntry {
  id: number;
  date: string;              // "2024.03.15"
  observationNumber: string; // "관찰 #047"
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';  // 교차 레이아웃
}
```

#### 애니메이션: Framer Motion

**선정 근거**: 컴포넌트 단위 진입 애니메이션 + 스크롤 parallax. 복잡한 타임라인이 없으므로 Framer Motion의 선언적 API가 적합.

```typescript
// components/observation/DiaryEntry.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function DiaryEntry({ entry }: { entry: DiaryEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // 이미지: 스크롤에 따라 미세한 시차 이동
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // 텍스트: 진입 시 fade-in-up
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div ref={ref} className="grid grid-cols-12 gap-6 py-24">
      {/* 이미지: 12-col 중 5칸 */}
      <motion.div
        className={`col-span-12 md:col-span-5 ${
          entry.imagePosition === 'right' ? 'md:col-start-8' : 'md:col-start-1'
        }`}
        style={{ y: imageY }}
      >
        {/* next/image */}
      </motion.div>

      {/* 텍스트: 나머지 칸 */}
      <motion.div
        className="col-span-12 md:col-span-5"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <span className="text-xs tracking-[0.2em] uppercase opacity-50">
          {entry.date} — {entry.observationNumber}
        </span>
        <h3 className="font-heading text-3xl mt-4">{entry.title}</h3>
        <p className="font-body text-sm leading-relaxed mt-6 opacity-70">
          {entry.body}
        </p>
      </motion.div>
    </div>
  );
}
```

#### 스크롤 동작

| 동작 | 방식 | 비고 |
|------|------|------|
| 이미지 parallax | Framer Motion `useTransform` | ±40px 수직 이동 |
| 텍스트 fade-in-up | Framer Motion `whileInView` | viewport 30% 진입 시 |
| 타임라인 선 드로잉 | CSS `scaleY` + `IntersectionObserver` | 수직선이 위→아래로 확장 |

#### 데이터 소스: 정적 (하드코딩)

관찰 일기 콘텐츠는 카피팀이 제공하는 정적 데이터. `constants/observation-data.ts`에 배열로 관리.

#### Lazy Loading

- 이미지: `next/image`의 기본 lazy loading (`loading="lazy"`)
- 섹션 전체: 히어로 아래에 위치하므로 자연스럽게 지연 로드. 별도 `dynamic()` 불필요.

---

### Section 3 — Data Archive (해저 데이터 시각화)

> **이 섹션이 기술적으로 가장 복잡하다. 별도 상세 스펙은 3장에서 다룬다.**

#### 컴포넌트 구조

```typescript
// components/data-archive/DataArchiveSection.tsx
'use client';

interface DepthDataPoint {
  timestamp: string;          // ISO 8601
  depth_m: number;            // 측정 깊이 (m)
  temperature_c: number;      // 수온 (°C)
  pressure_atm: number;       // 압력 (atm)
  salinity_psu: number;       // 염도 (PSU)
}

interface DataArchiveProps {
  data: DepthDataPoint[];     // SSG 시 fetch → props로 전달
}
```

#### 애니메이션: GSAP ScrollTrigger + CSS @keyframes 혼합

**선정 근거**: 스크롤 기반 핀 + 복잡한 시퀀스 타임라인(데이터 포인트 순차 등장, 그래프 드로잉)에 GSAP ScrollTrigger가 필수. 기하학 파동 루프 애니메이션은 CSS @keyframes로 GPU 가속.

#### Lazy Loading

```typescript
// app/page.tsx — Data Archive만 dynamic import
import dynamic from 'next/dynamic';

const DataArchiveSection = dynamic(
  () => import('@/components/data-archive/DataArchiveSection'),
  {
    loading: () => <DataArchiveSkeleton />,
    ssr: false,  // SVG 인터랙션은 클라이언트 전용
  }
);
```

---

### Section 4 — The Maker (CEO 아카이브)

#### 컴포넌트 구조

```typescript
// components/maker/MakerSection.tsx
// Server Component (정적 텍스트 + 이미지 중심)
// 애니메이션 래퍼만 Client Component로 분리

interface MakerData {
  photo: {
    src: string;
    alt: string;
    caption: string;
  };
  credentials: {
    producer: string;          // 셀렉션 샴페인 생산자명
    team: string;              // 숙성 팀 소개
  };
  letter: {
    title: string;            // "만든 이의 편지"
    paragraphs: string[];
    signature: string;
  };
}
```

#### 애니메이션: Framer Motion

**선정 근거**: 단순한 진입 애니메이션(사진 fade-in, 편지 텍스트 스태거)만 필요. 타임라인 시퀀스 없음.

```typescript
// components/maker/MakerLetter.tsx
'use client';

import { motion } from 'framer-motion';

const letterStagger = {
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const paragraphVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function MakerLetter({ letter }: { letter: MakerData['letter'] }) {
  return (
    <motion.div
      variants={letterStagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="max-w-prose mx-auto"
    >
      <motion.h3 variants={paragraphVariant} className="font-heading text-2xl italic mb-8">
        {letter.title}
      </motion.h3>
      {letter.paragraphs.map((p, i) => (
        <motion.p key={i} variants={paragraphVariant} className="font-body text-sm leading-loose opacity-70 mb-6">
          {p}
        </motion.p>
      ))}
      <motion.span variants={paragraphVariant} className="font-heading text-lg italic block mt-12">
        {letter.signature}
      </motion.span>
    </motion.div>
  );
}
```

#### 스크롤 동작

| 동작 | 방식 |
|------|------|
| CEO 사진 parallax | Framer Motion `useTransform` — ±30px |
| 경력 태그 스태거 | Framer Motion `staggerChildren` 0.1s |
| 편지 문단 순차 등장 | Framer Motion `staggerChildren` 0.15s |

#### 데이터 소스: 정적 (하드코딩)

`constants/maker-data.ts`에 정적 객체로 관리. 사진은 `public/images/maker/`에 배치.

#### Lazy Loading

정적 콘텐츠 위주이므로 별도 dynamic import 불필요. `next/image` 기본 lazy loading만 적용.

---

### Section 5 — Archive (컬렉션)

#### 컴포넌트 구조

```typescript
// components/archive/ArchiveCollectionSection.tsx
'use client';

interface DepthProduct {
  id: string;
  depth_m: number;            // 15 | 30 | 50 | 80 | 120
  name_kr: string;            // "첫번째 깊이"
  name_fr: string;            // "Premiere Profondeur"
  description: string;
  imageSrc: string;
  certificate: {
    serialNumber: string;
    agingStartDate: string;
    agingDuration: string;
    qrCodeUrl: string;
  };
  tasting: {
    temperature: string;      // "8-10°C"
    pairing: string[];        // ["장어구이", "트러플 리조또"]
    ritualSteps: string[];
  };
}
```

#### 애니메이션: Framer Motion (드래그) + GSAP (핀 스크롤)

**선정 근거**: 카드 캐러셀의 드래그/스와이프는 Framer Motion `drag`가 최적. 인증서 확대 시 핀 스크롤은 GSAP ScrollTrigger 사용.

```typescript
// components/archive/DepthLineup.tsx
'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';

export function DepthLineup({ products }: { products: DepthProduct[] }) {
  const x = useMotionValue(0);

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-8 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -(products.length - 1) * 360, right: 0 }}
        dragElastic={0.1}
        style={{ x }}
      >
        {products.map((product) => (
          <DepthCard key={product.id} product={product} />
        ))}
      </motion.div>
    </div>
  );
}
```

#### 스크롤 동작

| 동작 | 방식 | 비고 |
|------|------|------|
| 컬렉션 카드 수평 드래그 | Framer Motion `drag="x"` | 모바일: 스와이프 |
| 카드 진입 스태거 | Framer Motion `staggerChildren` | 0.12s 간격 |
| 인증서 확대 오버레이 | Framer Motion `layoutId` | 카드 → 풀스크린 전환 |
| QR 코드 SVG 드로잉 | GSAP `drawSVG` 대안 — CSS `stroke-dashoffset` | CSS 전용 |

#### 데이터 소스: 정적 + Supabase (하이브리드)

- 5-depth 라인업 기본 데이터: 정적 (`constants/products.ts`)
- 시리얼 번호, 인증서 이미지: Supabase `products` 테이블 (SSG `generateStaticParams`)
- QR 코드: 동적 생성 (클라이언트 사이드 SVG)

#### Lazy Loading

```typescript
// 인증서 오버레이 — 사용자 클릭 시에만 로드
const CertificateOverlay = dynamic(
  () => import('@/components/archive/CertificateOverlay'),
  { ssr: false }
);
```

---

### Section 6 — Ocean Circle (초대제 멤버십)

#### 컴포넌트 구조

```typescript
// components/ocean-circle/OceanCircleSection.tsx
'use client';

interface OceanCircleFormData {
  name: string;
  email: string;
  phone?: string;
  agreeToTerms: boolean;
}

interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message: string;
}
```

#### 애니메이션: Framer Motion

**선정 근거**: 폼 진입 애니메이션 + 성공 상태 전환만 필요. 복잡한 시퀀스 없음.

```typescript
// 성공 상태 전환 애니메이션
const successVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};
```

#### 스크롤 동작

| 동작 | 방식 |
|------|------|
| 초대 카피 fade-in-up | Framer Motion `whileInView` |
| 폼 영역 scale-in | Framer Motion `whileInView` + `scale` |

#### 데이터 소스: Supabase (런타임 mutation)

폼 제출 → Supabase `ocean_circle_signups` 테이블 insert. 상세 스키마는 9장 참조.

#### Lazy Loading

폼 섹션은 페이지 하단이므로 자연스럽게 지연 렌더링. 별도 dynamic import 불필요.

---

### Section 7 — For Professionals (B2B)

#### 컴포넌트 구조

```typescript
// components/professionals/ProfessionalsSection.tsx
'use client';

interface B2BInquiryFormData {
  companyName: string;
  businessType: 'fine-dining' | 'hotel-bar' | 'sommelier' | 'distributor' | 'other';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  message?: string;
  preferredKit: ('lookbook' | 'analysis' | 'b2b-terms')[];
}

interface SalesKit {
  id: string;
  title_kr: string;
  title_en: string;
  description: string;
  fileUrl: string;           // Supabase Storage or static
  fileSize: string;          // "2.4 MB"
  thumbnailSrc: string;
}
```

#### 애니메이션: Framer Motion

**선정 근거**: Section 6과 동일 — 폼 위주 섹션. 선언적 진입 애니메이션만 필요.

#### 스크롤 동작

| 동작 | 방식 |
|------|------|
| 헤드라인 fade-in | Framer Motion `whileInView` |
| PDF 카드 스태거 | Framer Motion `staggerChildren` 0.1s |
| 폼 slide-in | Framer Motion `x: 40 → 0` |

#### 데이터 소스: Supabase (런타임 mutation) + 정적 PDF

- B2B 문의 → Supabase `b2b_inquiries` 테이블 insert
- PDF 파일: `public/sales-kit/` 정적 호스팅 또는 Supabase Storage

#### Lazy Loading

```typescript
// B2B 문의 폼 — 섹션 진입 시 로드
const InquiryForm = dynamic(
  () => import('@/components/professionals/InquiryForm'),
  { loading: () => <FormSkeleton /> }
);
```

---

## 3. Section 3 — Data Archive 상세 기술 스펙

### 3-1. 설계 방침

**원칙**: 원시 그래프(raw chart)가 아닌, 미니멀 기하학 파동으로 데이터를 표현한다. "공학적으로 설계된 예술품"임을 시각적으로 증명하되, WebGL 없이 CSS/SVG만으로 구현한다.

### 3-2. 데이터 형식

```typescript
// types/depth-data.ts

/** 해저 숙성 환경 데이터 — 실제 로깅 장비에서 수집 */
interface DepthDataPoint {
  timestamp: string;          // "2024-03-15T08:00:00Z"
  depth_m: number;            // 15 | 30 | 50 | 80 | 120
  temperature_c: number;      // 수온 (°C), 범위: 2.0 ~ 18.0
  pressure_atm: number;       // 압력 (atm), 범위: 2.5 ~ 13.0
  salinity_psu: number;       // 염도 (PSU), 범위: 33.0 ~ 35.5
  dissolved_oxygen_ml: number; // 용존 산소 (ml/L)
}

/** 깊이별 집계 데이터 */
interface DepthSummary {
  depth_m: number;
  label_kr: string;           // "첫번째 깊이"
  label_fr: string;           // "Premiere Profondeur"
  avgTemperature: number;
  avgPressure: number;
  dataPoints: DepthDataPoint[];
  agingCharacteristic: string; // "빛이 아직 닿는 곳에서 첫 번째 변화가 시작됩니다"
}
```

### 3-3. 기하학 파동 애니메이션 (CSS @keyframes)

WebGL 대신 **CSS `@keyframes` + SVG `<path>`** 조합으로 구현한다. 해저 수압과 수온 변화를 추상적 파동으로 시각화.

```css
/* styles/data-archive-waves.css */

/* 기본 파동 레이어 — 느린 주기 */
@keyframes wave-slow {
  0% { transform: translateX(0) scaleY(1); }
  25% { transform: translateX(-3%) scaleY(1.02); }
  50% { transform: translateX(-6%) scaleY(0.98); }
  75% { transform: translateX(-3%) scaleY(1.01); }
  100% { transform: translateX(0) scaleY(1); }
}

/* 보조 파동 레이어 — 빠른 주기 */
@keyframes wave-fast {
  0% { transform: translateX(0) scaleY(1); }
  50% { transform: translateX(-8%) scaleY(1.04); }
  100% { transform: translateX(0) scaleY(1); }
}

/* 깊이에 따른 진폭 변화 — 깊을수록 진동 감소 */
@keyframes wave-depth-15 { /* ... amplitude: large */ }
@keyframes wave-depth-120 { /* ... amplitude: minimal */ }

.wave-layer {
  position: absolute;
  inset: 0;
  will-change: transform;
}
.wave-layer--slow {
  animation: wave-slow 12s ease-in-out infinite;
}
.wave-layer--fast {
  animation: wave-fast 7s ease-in-out infinite;
  opacity: 0.4;
}
```

```typescript
// components/data-archive/GeometricWaveCanvas.tsx
'use client';

interface GeometricWaveCanvasProps {
  activeDepth: number;        // 현재 선택된 깊이
  temperature: number;        // 수온 → 파동 색상에 반영
  pressure: number;           // 압력 → 파동 진폭에 반영
}

export function GeometricWaveCanvas({
  activeDepth,
  temperature,
  pressure,
}: GeometricWaveCanvasProps) {
  // 압력에 따른 진폭 계산: 깊을수록 작은 진폭
  const amplitude = Math.max(2, 20 - pressure * 1.2);
  // 수온에 따른 파동 주기: 차가울수록 느린 파동
  const period = 8 + (18 - temperature) * 0.5;

  // SVG path 생성: 사인파 기반 기하학 패턴
  const generateWavePath = (
    width: number,
    height: number,
    amp: number,
    frequency: number,
    phase: number
  ): string => {
    const points: string[] = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const y = height / 2 + amp * Math.sin((i / steps) * frequency * Math.PI * 2 + phase);
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    return points.join(' ');
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {/* 배경 레이어: 3개의 겹친 SVG 파동 */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        {/* 레이어 1: 주 파동 — 수온 데이터 반영 */}
        <path
          d={generateWavePath(1200, 400, amplitude, 3, 0)}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-[#3D5A56]/30 wave-layer--slow"
          style={{ animationDuration: `${period}s` }}
        />
        {/* 레이어 2: 보조 파동 */}
        <path
          d={generateWavePath(1200, 400, amplitude * 0.6, 5, Math.PI / 3)}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-[#A7C7C0]/40 wave-layer--fast"
        />
        {/* 레이어 3: 미세 파동 — 수압 데이터 반영 */}
        <path
          d={generateWavePath(1200, 400, amplitude * 0.3, 8, Math.PI / 5)}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          className="text-[#3D5A56]/15"
          style={{ animation: `wave-fast ${period * 0.6}s ease-in-out infinite` }}
        />
      </svg>

      {/* 데이터 포인트 오버레이 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="font-heading text-6xl">{activeDepth}m</span>
          <span className="block font-body text-xs tracking-[0.2em] uppercase mt-2 opacity-50">
            depth
          </span>
        </div>
      </div>
    </div>
  );
}
```

### 3-4. SVG 그래프 컴포넌트

```typescript
// components/data-archive/TemperatureGraph.tsx
'use client';

import { motion } from 'framer-motion';

interface TemperatureGraphProps {
  data: { timestamp: string; value: number }[];
  width?: number;
  height?: number;
}

export function TemperatureGraph({
  data,
  width = 600,
  height = 200,
}: TemperatureGraphProps) {
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minVal = Math.min(...data.map((d) => d.value));
  const maxVal = Math.max(...data.map((d) => d.value));
  const range = maxVal - minVal || 1;

  // SVG path 생성
  const linePath = data
    .map((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartW;
      const y = padding.top + chartH - ((d.value - minVal) / range) * chartH;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* 그리드 라인 (미니멀) */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
        <line
          key={ratio}
          x1={padding.left}
          y1={padding.top + chartH * (1 - ratio)}
          x2={width - padding.right}
          y2={padding.top + chartH * (1 - ratio)}
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-[#3D5A56]/10"
        />
      ))}

      {/* 데이터 라인 — stroke-dashoffset 애니메이션으로 드로잉 */}
      <motion.path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-[#3D5A56]/60"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Y축 라벨 */}
      <text
        x={padding.left - 8}
        y={padding.top}
        textAnchor="end"
        className="text-[10px] fill-current opacity-40"
      >
        {maxVal.toFixed(1)}°C
      </text>
      <text
        x={padding.left - 8}
        y={padding.top + chartH}
        textAnchor="end"
        className="text-[10px] fill-current opacity-40"
      >
        {minVal.toFixed(1)}°C
      </text>
    </svg>
  );
}
```

### 3-5. 인터랙티브 데이터 탐색

```typescript
// components/data-archive/DataExplorer.tsx
'use client';

import { useState, useCallback } from 'react';

export function DataExplorer({ depthSummaries }: { depthSummaries: DepthSummary[] }) {
  const [activeDepth, setActiveDepth] = useState(60);
  const [hoveredPoint, setHoveredPoint] = useState<DepthDataPoint | null>(null);

  const activeData = depthSummaries.find((d) => d.depth_m === activeDepth);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* 좌측: 깊이 선택기 (수직 슬라이더) */}
      <div className="col-span-2">
        <DepthSelector
          depths={[15, 30, 50, 80, 120]}
          active={activeDepth}
          onChange={setActiveDepth}
        />
      </div>

      {/* 중앙: 기하학 파동 + 그래프 */}
      <div className="col-span-7">
        <GeometricWaveCanvas
          activeDepth={activeDepth}
          temperature={activeData?.avgTemperature ?? 10}
          pressure={activeData?.avgPressure ?? 6}
        />
        <div className="grid grid-cols-2 gap-4 mt-8">
          <TemperatureGraph data={/* ... */} />
          <PressureGraph data={/* ... */} />
        </div>
      </div>

      {/* 우측: 데이터 카드 */}
      <div className="col-span-3">
        <DataCard
          depth={activeDepth}
          temperature={activeData?.avgTemperature}
          pressure={activeData?.avgPressure}
          characteristic={activeData?.agingCharacteristic}
        />
      </div>
    </div>
  );
}
```

### 3-6. 스크롤 동작 (GSAP ScrollTrigger)

```typescript
// DataArchiveSection 내부 GSAP 설정
useEffect(() => {
  const ctx = gsap.context(() => {
    // Phase 1: 헤드라인 + 기하학 파동 등장 (pin)
    const introTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
        end: 'top 20%',
        scrub: 1,
      },
    });

    introTl
      .from('.archive-headline', { opacity: 0, y: 60, duration: 1 })
      .from('.wave-canvas', { opacity: 0, scale: 0.95, duration: 1.2 }, '-=0.5');

    // Phase 2: 그래프 SVG path 드로잉 (scroll-linked)
    gsap.from('.data-graph-line', {
      strokeDashoffset: 1000,
      scrollTrigger: {
        trigger: '.data-explorer',
        start: 'top 50%',
        end: 'bottom 60%',
        scrub: 0.8,
      },
    });

  }, sectionRef);

  return () => ctx.revert();
}, []);
```

### 3-7. 데이터 소스

- **빌드 시**: Supabase `depth_data` 테이블에서 SSG fetch → props로 전달
- **런타임**: 깊이 변경 시 클라이언트 캐시에서 즉시 전환 (전체 데이터를 빌드 시 프리로드)
- **폴백**: `constants/sample-depth-data.ts`에 샘플 데이터 하드코딩 (Supabase 장애 시)

---

## 4. 내비게이션 시스템

### 4-1. 컴포넌트 구조

```typescript
// components/navigation/Navigation.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  sections: {
    id: string;
    label: string;
    labelKr?: string;
  }[];
}

interface NavigationState {
  isMenuOpen: boolean;
  activeSection: string;       // 현재 뷰포트에 보이는 섹션 ID
  isScrolled: boolean;         // 스크롤 여부 (헤더 배경 전환)
  scrollProgress: number;      // 0~1 전체 페이지 스크롤 진행률
}
```

### 4-2. 풀스크린 오버레이 메뉴

```typescript
// components/navigation/FullscreenOverlay.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

const overlayVariants = {
  closed: { opacity: 0, visibility: 'hidden' as const },
  open: {
    opacity: 1,
    visibility: 'visible' as const,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

const menuItemVariants = {
  closed: { opacity: 0, y: 24 },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.05,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function FullscreenOverlay({
  isOpen,
  onClose,
  sections,
  onNavigate,
}: {
  isOpen: boolean;
  onClose: () => void;
  sections: { id: string; label: string }[];
  onNavigate: (sectionId: string) => void;
}) {
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Focus trap: ESC로 닫기 + Tab 순환
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    firstFocusRef.current?.focus();
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#EFDFBB] grid grid-rows-[72px_1fr_auto] px-16"
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="closed"
          role="dialog"
          aria-modal="true"
          aria-label="사이트 내비게이션"
        >
          {/* 상단: 로고 + 닫기 버튼 */}
          <div className="flex items-center justify-between">
            <span className="font-heading text-lg tracking-[0.15em] uppercase">
              Muse de Marée
            </span>
            <button
              ref={firstFocusRef}
              onClick={onClose}
              aria-label="메뉴 닫기"
              className="w-7 h-7 relative"
            >
              {/* X 아이콘 */}
            </button>
          </div>

          {/* 중앙: 좌측 섹션 링크 + 우측 컬렉션 큐베명 */}
          <nav className="flex items-center">
            <div className="grid grid-cols-2 gap-x-16 w-full items-start">
              {/* 좌측: 섹션 앵커 링크 (같은 페이지 내 스크롤) */}
              <ul className="space-y-2">
                {sections.filter(s => s.id !== 'professionals').map((section, i) => (
                  <motion.li
                    key={section.id}
                    custom={i}
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                  >
                    <button
                      onClick={() => {
                        onNavigate(section.id);
                        onClose();
                      }}
                      className="font-heading text-[clamp(32px,5vw,56px)] font-light italic
                                 text-[#3D5A56] lowercase leading-tight
                                 hover:text-[#C4956A] hover:translate-x-2
                                 transition-all duration-300"
                    >
                      {section.label}
                    </button>
                  </motion.li>
                ))}
              </ul>

              {/* 우측: 5개 컬렉션 큐베명 (Archive 섹션 딥링크) */}
              <ul className="space-y-3 pt-2">
                {DEPTH_CUVEES.map((cuvee, i) => (
                  <motion.li
                    key={cuvee.id}
                    custom={i + 2}
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                  >
                    <button
                      onClick={() => {
                        onNavigate(`archive-${cuvee.id}`);
                        onClose();
                      }}
                      className="font-heading text-[clamp(14px,2vw,20px)] font-light italic
                                 text-[#3D5A56]/40 lowercase
                                 hover:text-[#3D5A56] hover:translate-x-1
                                 transition-all duration-300"
                    >
                      {cuvee.label}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          </nav>

          {/* 구분선 + for professionals */}
          <div className="border-t border-[#3D5A56]/10 pt-4">
            <button
              onClick={() => { onNavigate('professionals'); onClose(); }}
              className="font-heading text-sm font-light italic text-[#3D5A56]/50
                         lowercase tracking-[0.05em]
                         hover:text-[#3D5A56] transition-all duration-300"
            >
              for professionals
            </button>
          </div>

          {/* 하단: 소셜 + 언어 */}
          <div className="flex items-center justify-between py-8">
            <div className="flex gap-6 text-xs tracking-[0.1em] uppercase opacity-40">
              <a href="#">Instagram</a>
              <a href="#">YouTube</a>
              <a href="#">KakaoTalk</a>
            </div>
            <div className="flex gap-3 text-xs tracking-[0.15em]">
              <button className="underline">KR</button>
              <span className="opacity-30">/</span>
              <button className="opacity-40 hover:opacity-100">EN</button>
              <span className="opacity-30">/</span>
              <button className="opacity-40 hover:opacity-100">FR</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 4-3. 스크롤 위치 추적 (Active Section Detection)

```typescript
// hooks/useActiveSection.ts
'use client';

import { useState, useEffect } from 'react';

const SECTION_IDS = [
  'the-void',
  'observation',
  'data-archive',
  'the-maker',
  'archive',
  'ocean-circle',
  'professionals',
];

export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState(SECTION_IDS[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-40% 0px -40% 0px', // 뷰포트 중앙 20% 영역 기준
          threshold: 0,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return activeSection;
}
```

### 4-4. Lenis 스무스 스크롤 연동

```typescript
// hooks/useSmoothScroll.ts
'use client';

import { useCallback } from 'react';
import { useLenis } from '@/lib/lenis-context';

export function useSmoothScroll() {
  const lenis = useLenis();

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const element = document.getElementById(sectionId);
      if (!element || !lenis) return;

      lenis.scrollTo(element, {
        offset: -72,           // 헤더 높이만큼 오프셋
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    },
    [lenis]
  );

  return { scrollToSection };
}
```

### 4-5. 모바일 하단 내비게이션

`frontend-spec.md` 6.1절의 하단 탭 바 스펙을 그대로 구현. `md:hidden`으로 데스크톱에서는 숨김.

```typescript
// components/navigation/MobileBottomNav.tsx
'use client';

export function MobileBottomNav({
  activeSection,
  onNavigate,
}: {
  activeSection: string;
  onNavigate: (id: string) => void;
}) {
  const tabs = [
    { id: 'the-void', label: 'void', icon: '◯' },
    { id: 'observation', label: 'observe', icon: '◎' },
    { id: 'archive', label: 'archive', icon: '▣' },
    { id: 'ocean-circle', label: 'circle', icon: '◉' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden
                 h-[calc(64px+env(safe-area-inset-bottom))]
                 pb-[env(safe-area-inset-bottom)]
                 bg-[#EFDFBB]/92 backdrop-blur-[20px]
                 border-t border-[#3D5A56]/10
                 flex items-center justify-around"
      aria-label="하단 내비게이션"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          className={`flex flex-col items-center gap-1 px-4 py-2 text-[10px] tracking-[0.05em]
                      transition-colors duration-300
                      ${activeSection === tab.id ? 'text-[#3D5A56]' : 'text-[#3D5A56]/45'}`}
          aria-current={activeSection === tab.id ? 'page' : undefined}
        >
          <span className="text-lg">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
```

---

## 5. 폼 시스템

### 5-1. 공통 폼 인프라

```typescript
// lib/form-utils.ts

/** 폼 상태 타입 */
interface FormState<T> {
  status: 'idle' | 'submitting' | 'success' | 'error';
  data: T;
  errors: Partial<Record<keyof T, string>>;
  message: string;
}

/** 이메일 검증 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 전화번호 검증 (한국 형식) */
const PHONE_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/;

/** 공통 검증 함수 */
function validateField(
  field: string,
  value: string,
  rules: { required?: boolean; email?: boolean; phone?: boolean; minLength?: number }
): string | null {
  if (rules.required && !value.trim()) return '필수 입력 항목입니다';
  if (rules.email && !EMAIL_REGEX.test(value)) return '올바른 이메일 주소를 입력해주세요';
  if (rules.phone && value && !PHONE_REGEX.test(value)) return '올바른 전화번호를 입력해주세요';
  if (rules.minLength && value.length < rules.minLength) return `최소 ${rules.minLength}자 이상 입력해주세요`;
  return null;
}
```

### 5-2. Ocean Circle 멤버십 폼

```typescript
// components/ocean-circle/MembershipForm.tsx
'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitOceanCircleSignup } from '@/lib/actions/ocean-circle';

export function MembershipForm() {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<FormState<OceanCircleFormData>>({
    status: 'idle',
    data: { name: '', email: '', phone: '', agreeToTerms: false },
    errors: {},
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 클라이언트 사이드 검증
    const errors: Partial<Record<keyof OceanCircleFormData, string>> = {};
    const nameErr = validateField('name', formState.data.name, { required: true, minLength: 2 });
    if (nameErr) errors.name = nameErr;
    const emailErr = validateField('email', formState.data.email, { required: true, email: true });
    if (emailErr) errors.email = emailErr;
    if (formState.data.phone) {
      const phoneErr = validateField('phone', formState.data.phone, { phone: true });
      if (phoneErr) errors.phone = phoneErr;
    }
    if (!formState.data.agreeToTerms) errors.agreeToTerms = '개인정보 수집에 동의해주세요';

    if (Object.keys(errors).length > 0) {
      setFormState((prev) => ({ ...prev, errors }));
      return;
    }

    // Server Action 호출
    startTransition(async () => {
      setFormState((prev) => ({ ...prev, status: 'submitting', errors: {} }));
      try {
        await submitOceanCircleSignup(formState.data);
        setFormState((prev) => ({
          ...prev,
          status: 'success',
          message: '바다의 원에 오신 것을 환영합니다.',
        }));
      } catch {
        setFormState((prev) => ({
          ...prev,
          status: 'error',
          message: '잠시 후 다시 시도해주세요.',
        }));
      }
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {formState.status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <p className="font-heading text-2xl italic">환영합니다</p>
            <p className="font-body text-sm mt-4 opacity-60">{formState.message}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* 이름 */}
            <FormField
              label="이름"
              value={formState.data.name}
              error={formState.errors.name}
              onChange={(v) => setFormState((p) => ({ ...p, data: { ...p.data, name: v } }))}
            />
            {/* 이메일 */}
            <FormField
              label="이메일"
              type="email"
              value={formState.data.email}
              error={formState.errors.email}
              onChange={(v) => setFormState((p) => ({ ...p, data: { ...p.data, email: v } }))}
            />
            {/* 전화번호 (선택) */}
            <FormField
              label="전화번호"
              type="tel"
              value={formState.data.phone ?? ''}
              error={formState.errors.phone}
              onChange={(v) => setFormState((p) => ({ ...p, data: { ...p.data, phone: v } }))}
              optional
            />
            {/* 동의 */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formState.data.agreeToTerms}
                onChange={(e) =>
                  setFormState((p) => ({ ...p, data: { ...p.data, agreeToTerms: e.target.checked } }))
                }
                className="mt-1"
              />
              <span className="text-xs opacity-60 leading-relaxed">
                개인정보 수집 및 이용에 동의합니다. 수집된 정보는 런칭 안내 목적으로만 사용됩니다.
              </span>
            </label>
            {formState.errors.agreeToTerms && (
              <p className="text-xs text-red-600">{formState.errors.agreeToTerms}</p>
            )}

            {/* 제출 */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full btn-primary disabled:opacity-50"
            >
              {isPending ? '초대장을 준비하고 있습니다...' : '바다의 원에 들어오세요'}
            </button>

            {formState.status === 'error' && (
              <p className="text-xs text-red-600 text-center">{formState.message}</p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### 5-3. Server Action (Supabase 연동)

```typescript
// lib/actions/ocean-circle.ts
'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitOceanCircleSignup(data: OceanCircleFormData) {
  const supabase = await createClient();

  // 중복 체크
  const { data: existing } = await supabase
    .from('ocean_circle_signups')
    .select('id')
    .eq('email', data.email)
    .single();

  if (existing) {
    throw new Error('이미 초대된 이메일입니다.');
  }

  const { error } = await supabase.from('ocean_circle_signups').insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    agreed_to_terms: data.agreeToTerms,
    source: 'homepage',
    created_at: new Date().toISOString(),
  });

  if (error) throw new Error('등록 중 오류가 발생했습니다.');
}
```

### 5-4. B2B 문의 폼

```typescript
// lib/actions/b2b-inquiry.ts
'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitB2BInquiry(data: B2BInquiryFormData) {
  const supabase = await createClient();

  const { error } = await supabase.from('b2b_inquiries').insert({
    company_name: data.companyName,
    business_type: data.businessType,
    contact_name: data.contactName,
    contact_email: data.contactEmail,
    contact_phone: data.contactPhone,
    message: data.message || null,
    preferred_kit: data.preferredKit,
    status: 'new',
    created_at: new Date().toISOString(),
  });

  if (error) throw new Error('문의 등록 중 오류가 발생했습니다.');
}
```

### 5-5. 폼 필드 공통 컴포넌트

```typescript
// components/shared/FormField.tsx
'use client';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'tel';
  value: string;
  error?: string;
  onChange: (value: string) => void;
  optional?: boolean;
}

export function FormField({
  label,
  type = 'text',
  value,
  error,
  onChange,
  optional,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs tracking-[0.1em] uppercase opacity-50 mb-2">
        {label}
        {optional && <span className="ml-1 normal-case tracking-normal">(선택)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent border-b px-0 py-3
                    font-body text-sm
                    focus:outline-none focus:border-[#3D5A56]
                    transition-colors duration-300
                    ${error ? 'border-red-400' : 'border-[#3D5A56]/20'}`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
```

---

## 6. 섹션 디바이더 (한지 질감 + 수묵화 파동)

### 6-1. 컴포넌트 인터페이스

```typescript
// components/shared/SectionDivider.tsx
// Server Component — JS 불필요

interface SectionDividerProps {
  variant: 'hanji' | 'ink-wave';
  className?: string;
}
```

### 6-2. 한지 질감 (CSS Texture)

순수 CSS로 한지(韓紙)의 거친 섬유 질감을 구현한다. 추가 JS 라이브러리 없음.

```css
/* styles/section-divider.css */

/* 한지 질감 디바이더 */
.divider-hanji {
  position: relative;
  width: 100%;
  height: 48px;
  overflow: hidden;
}

/* 레이어 1: 기본 노이즈 텍스처 (CSS만으로 구현) */
.divider-hanji::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    /* 미세 도트 패턴 — 한지 섬유 시뮬레이션 */
    radial-gradient(circle, rgba(61, 90, 86, 0.03) 1px, transparent 1px),
    radial-gradient(circle, rgba(61, 90, 86, 0.02) 1px, transparent 1px);
  background-size: 4px 4px, 7px 7px;
  background-position: 0 0, 3px 3px;
  opacity: 0.8;
}

/* 레이어 2: 수평 섬유선 */
.divider-hanji::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(61, 90, 86, 0.015) 3px,
      rgba(61, 90, 86, 0.015) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 8px,
      rgba(61, 90, 86, 0.01) 8px,
      rgba(61, 90, 86, 0.01) 9px
    );
}

/* 중앙 가로선 */
.divider-hanji .divider-line {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 1280px;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(61, 90, 86, 0.12),
    rgba(61, 90, 86, 0.12),
    transparent
  );
}
```

### 6-3. 수묵화 파동 (SVG Ink-Wave)

인라인 SVG로 수묵화 번짐 효과의 파동 구분선을 구현한다. CSS `filter` 로 번짐 효과 추가.

```typescript
// components/shared/SectionDivider.tsx

export function SectionDivider({ variant, className }: SectionDividerProps) {
  if (variant === 'hanji') {
    return (
      <div className={`divider-hanji ${className ?? ''}`}>
        <div className="divider-line" />
      </div>
    );
  }

  // ink-wave variant
  return (
    <div className={`relative w-full h-16 overflow-hidden ${className ?? ''}`}>
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          {/* 수묵화 번짐 필터 */}
          <filter id="ink-blur" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
        </defs>

        {/* 파동 path — 수묵화 붓터치 느낌 */}
        <path
          d="M0,32 C240,18 480,46 720,32 C960,18 1200,46 1440,32"
          fill="none"
          stroke="rgba(61, 90, 86, 0.12)"
          strokeWidth="1.5"
          filter="url(#ink-blur)"
        />
        {/* 보조 파동 — 더 연한 */}
        <path
          d="M0,36 C360,24 720,48 1080,30 C1260,22 1380,38 1440,34"
          fill="none"
          stroke="rgba(61, 90, 86, 0.06)"
          strokeWidth="1"
          filter="url(#ink-blur)"
        />
      </svg>
    </div>
  );
}
```

> **참고**: SVG `feTurbulence` + `feDisplacementMap` 조합은 모든 모던 브라우저에서 GPU 가속된다. 별도 JS 불필요.

---

## 7. 성능 예산

### 7-1. 섹션별 JS 예산

| 섹션 | JS 번들 (gzip) | 로딩 방식 | 비고 |
|------|---------------|-----------|------|
| Layout (공통) | ~85KB | 즉시 | React + Next.js Runtime + Framer Motion (tree-shaken) |
| Navigation | ~5KB | 즉시 | Framer Motion AnimatePresence 포함 |
| Hero (The Void) | ~50KB | 즉시 (above-fold) | GSAP Core + ScrollTrigger |
| Observation | ~3KB | 지연 | Framer Motion 재사용 (추가 번들 미미) |
| Data Archive | ~8KB | dynamic import | SVG 조작 코드 + GSAP (이미 로드됨) |
| The Maker | ~2KB | 지연 | Framer Motion 재사용 |
| Archive (컬렉션) | ~6KB | dynamic import | 캐러셀 드래그 로직 |
| Ocean Circle | ~4KB | 지연 | 폼 검증 로직 |
| Professionals | ~5KB | dynamic import | 폼 + PDF 다운로드 |
| Lenis | ~8KB | 지연 (첫 스크롤) | — |
| PostHog | ~20KB | idle callback | 분석만 |
| **총합 (First Load)** | **< 90KB** | — | Layout + Nav + Hero |
| **총합 (Full Page)** | **~196KB** | — | 전체 dynamic import 포함 |

### 7-2. 이미지/영상 예산

| 자산 | 형식 | 크기 목표 | 섹션 |
|------|------|----------|------|
| 히어로 배경 이미지 | WebP | < 350KB | Hero |
| 히어로 영상 포스터 | WebP | < 80KB | Hero |
| 히어로 영상 (WebM) | VP9 | < 8MB | Hero |
| 히어로 영상 (MP4) | H.264 | < 15MB | Hero |
| 관찰 일기 이미지 (x4) | WebP | 각 < 200KB | Observation |
| CEO 아카이브 사진 | WebP | < 300KB | Maker |
| 컬렉션 제품 이미지 (x5) | WebP | 각 < 250KB | Archive |
| 인증서 샘플 | WebP | < 150KB | Archive |
| 테이스팅 리추얼 일러스트 | SVG | 각 < 10KB | Archive |
| PDF 썸네일 (x3) | WebP | 각 < 50KB | Professionals |
| **이미지 총합 (추정)** | — | **< 3.5MB** | — |

### 7-3. Code Splitting 전략

```typescript
// app/page.tsx — dynamic import 전략

import dynamic from 'next/dynamic';

// ─── 즉시 로드 (above-fold) ─────────────────────────────
import { HeroSection } from '@/components/hero/HeroSection';

// ─── 지연 로드 (below-fold) ─────────────────────────────
// Intersection Observer가 트리거할 때 로드

const ObservationSection = dynamic(
  () => import('@/components/observation/ObservationSection'),
  { loading: () => <SectionSkeleton height="100vh" /> }
);

const DataArchiveSection = dynamic(
  () => import('@/components/data-archive/DataArchiveSection'),
  { loading: () => <SectionSkeleton height="120vh" />, ssr: false }
);

const MakerSection = dynamic(
  () => import('@/components/maker/MakerSection'),
  { loading: () => <SectionSkeleton height="80vh" /> }
);

const ArchiveCollectionSection = dynamic(
  () => import('@/components/archive/ArchiveCollectionSection'),
  { loading: () => <SectionSkeleton height="100vh" /> }
);

const OceanCircleSection = dynamic(
  () => import('@/components/ocean-circle/OceanCircleSection'),
  { loading: () => <SectionSkeleton height="80vh" /> }
);

const ProfessionalsSection = dynamic(
  () => import('@/components/professionals/ProfessionalsSection'),
  { loading: () => <SectionSkeleton height="80vh" /> }
);
```

### 7-4. 번들 사이즈 프로젝션 (gzip)

```
[핵심 번들]
react + react-dom:        ~45KB
next.js runtime:          ~15KB
framer-motion (shaken):   ~25KB
gsap + ScrollTrigger:     ~42KB
lenis:                    ~8KB
─────────────────────────
합계:                     ~135KB (전체 페이지 로드 시)

[First Load JS 목표: < 90KB]
react + react-dom:        ~45KB
next.js runtime:          ~15KB
framer-motion:            ~25KB
앱 코드 (Hero + Nav):     ~5KB
─────────────────────────
First Load:               ~90KB ✓

* GSAP는 Hero 섹션 hydration 시 로드되지만,
  hero가 above-fold이므로 First Load에 포함됨.
  → First Load 실측치는 ~130KB가 될 수 있음.
  → Framer Motion LazyMotion + domMax로 ~15KB 절감 필요.
```

---

## 8. 파일 구조

```
app/
├── layout.tsx                        # RootLayout (Server) — 폰트, 메타데이터
├── page.tsx                          # HomePage (Server) — 7 섹션 조합 + dynamic import
└── globals.css                       # Tailwind 4 @theme, 커스텀 CSS

components/
├── hero/                             # Section 1: The Void (hero-tech-spec.md 참조)
│   ├── HeroSection.tsx               # 메인 컨테이너 (300vh, GSAP)
│   ├── Phase1Surface.tsx             # 지상 레이어
│   ├── HeroTitle.tsx                 # 로고 + 타이틀
│   ├── WaterTransition.tsx           # 수면 관통 전환
│   ├── BubbleParticles.tsx           # Framer Motion 기포
│   ├── Phase2Abyss.tsx               # 심해 레이어
│   └── AbyssVideoBackground.tsx      # 영상 배경 (lazy)
│
├── observation/                      # Section 2: Observation
│   ├── ObservationSection.tsx        # 섹션 래퍼
│   ├── DiaryHeader.tsx               # 날짜 + 관찰 번호
│   ├── DiaryEntry.tsx                # 텍스트 + 이미지 교차 배치
│   └── DiaryTimeline.tsx             # 수직 타임라인 장식선
│
├── data-archive/                     # Section 3: Data Archive
│   ├── DataArchiveSection.tsx        # 섹션 래퍼 (GSAP ScrollTrigger)
│   ├── GeometricWaveCanvas.tsx       # CSS/SVG 기하학 파동
│   ├── DataExplorer.tsx              # 인터랙티브 데이터 탐색
│   ├── DepthSelector.tsx             # 깊이 선택 수직 슬라이더
│   ├── TemperatureGraph.tsx          # SVG 수온 그래프
│   ├── PressureGraph.tsx             # SVG 압력 그래프
│   └── DataTooltip.tsx               # 호버/터치 상세 데이터
│
├── maker/                            # Section 4: The Maker
│   ├── MakerSection.tsx              # 섹션 래퍼
│   ├── MakerPhoto.tsx                # CEO 아카이브 사진
│   ├── MakerCredentials.tsx          # 경력 태그
│   └── MakerLetter.tsx              # "만든 이의 편지"
│
├── archive/                          # Section 5: Archive (컬렉션)
│   ├── ArchiveCollectionSection.tsx   # 섹션 래퍼
│   ├── DepthLineup.tsx               # 5-depth 캐러셀
│   ├── DepthCard.tsx                 # 개별 깊이 카드 (Glass Card)
│   ├── CertificatePreview.tsx        # 인증서 미리보기
│   ├── CertificateOverlay.tsx        # 인증서 확대 오버레이 (dynamic)
│   ├── QRCodeDisplay.tsx             # 시리얼 QR 코드
│   └── TastingRitual.tsx             # 테이스팅 가이드
│
├── ocean-circle/                     # Section 6: Ocean Circle
│   ├── OceanCircleSection.tsx        # 섹션 래퍼
│   ├── CircleInvitation.tsx          # 초대 카피 + 혜택
│   └── MembershipForm.tsx            # 멤버십 가입 폼
│
├── professionals/                    # Section 7: For Professionals
│   ├── ProfessionalsSection.tsx      # 섹션 래퍼
│   ├── InquiryForm.tsx               # B2B 문의 폼
│   └── SalesKitDownload.tsx          # PDF 다운로드 카드
│
├── navigation/                       # 내비게이션 시스템
│   ├── Navigation.tsx                # 메인 래퍼 (헤더 + 오버레이 + 모바일)
│   ├── HeaderBar.tsx                 # 고정 헤더 (로고 + 햄버거)
│   ├── FullscreenOverlay.tsx         # 풀스크린 오버레이 메뉴
│   ├── ArchiveSubmenu.tsx            # 5-depth 서브메뉴
│   └── MobileBottomNav.tsx           # 모바일 하단 탭 바
│
├── shared/                           # 공통 컴포넌트
│   ├── SectionDivider.tsx            # 한지 + 수묵화 디바이더
│   ├── FormField.tsx                 # 공통 폼 필드
│   ├── FormFeedback.tsx              # 성공/에러 상태 표시
│   ├── SectionSkeleton.tsx           # dynamic import 로딩 스켈레톤
│   └── Footer.tsx                    # 푸터
│
└── ui/                               # 디자인 시스템 프리미티브
    ├── GlassCard.tsx                 # Glassmorphism 카드
    ├── Button.tsx                    # Primary/Secondary/Warm 버튼
    └── Typography.tsx                # 타이포그래피 컴포넌트

constants/
├── observation-data.ts               # 관찰 일기 정적 데이터
├── maker-data.ts                     # CEO 아카이브 정적 데이터
├── products.ts                       # 5-depth 컬렉션 정적 데이터
├── navigation.ts                     # 메뉴 항목 + DEPTH_CUVEES 정의
│   # SECTIONS: 좌측 앵커 링크 (the-void ~ professionals)
│   # DEPTH_CUVEES: 우측 큐베명 [{id:'surface-murmur', label:'surface murmur.'}, ...]
│   # MOBILE_TABS: 모바일 하단 탭 4개 (void, observe, archive, circle)
└── sample-depth-data.ts              # 해저 데이터 샘플 (Supabase 폴백)

hooks/
├── useActiveSection.ts               # 현재 활성 섹션 추적
├── useSmoothScroll.ts                # Lenis 스무스 스크롤
└── useMediaQuery.ts                  # 반응형 브레이크포인트

lib/
├── lenis.ts                          # Lenis + GSAP 연동 초기화
├── lenis-context.tsx                 # Lenis React Context Provider
├── supabase/
│   ├── client.ts                     # 브라우저용 Supabase 클라이언트
│   └── server.ts                     # Server Action용 Supabase 클라이언트
├── actions/
│   ├── ocean-circle.ts               # Ocean Circle Server Action
│   └── b2b-inquiry.ts               # B2B 문의 Server Action
├── form-utils.ts                     # 폼 검증 유틸리티
└── detect-device.ts                  # 모바일/저사양 감지

styles/
├── section-divider.css               # 한지 + 수묵화 CSS
└── data-archive-waves.css            # 기하학 파동 @keyframes

public/
├── images/
│   ├── hero/                         # 히어로 배경, 포스터
│   ├── observation/                  # 관찰 일기 사진
│   ├── maker/                        # CEO 아카이브 사진
│   └── archive/                      # 제품, 인증서 이미지
├── video/
│   ├── abyss-loop.webm               # 심해 영상 (VP9)
│   └── abyss-loop.mp4                # 심해 영상 (H.264)
└── sales-kit/
    ├── lookbook.pdf
    ├── analysis-report.pdf
    └── b2b-terms.pdf
```

---

## 9. Supabase 스키마

### 9-1. 테이블 정의

```sql
-- Ocean Circle 멤버십 가입
CREATE TABLE ocean_circle_signups (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  phone         TEXT,
  agreed_to_terms BOOLEAN NOT NULL DEFAULT false,
  source        TEXT DEFAULT 'homepage',       -- 가입 경로 (homepage, qr, event 등)
  status        TEXT DEFAULT 'pending'         -- pending | confirmed | unsubscribed
                CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  created_at    TIMESTAMPTZ DEFAULT now(),
  confirmed_at  TIMESTAMPTZ
);

-- 이메일 검색 인덱스
CREATE INDEX idx_ocean_circle_email ON ocean_circle_signups (email);
-- 상태별 조회 인덱스
CREATE INDEX idx_ocean_circle_status ON ocean_circle_signups (status);

-- B2B 문의
CREATE TABLE b2b_inquiries (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name    TEXT NOT NULL,
  business_type   TEXT NOT NULL
                  CHECK (business_type IN (
                    'fine-dining', 'hotel-bar', 'sommelier', 'distributor', 'other'
                  )),
  contact_name    TEXT NOT NULL,
  contact_email   TEXT NOT NULL,
  contact_phone   TEXT NOT NULL,
  message         TEXT,
  preferred_kit   TEXT[] DEFAULT '{}',          -- ['lookbook', 'analysis', 'b2b-terms']
  status          TEXT DEFAULT 'new'
                  CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  notes           TEXT                          -- 내부 메모 (관리자용)
);

-- 상태별 조회 인덱스
CREATE INDEX idx_b2b_status ON b2b_inquiries (status);
-- 업종별 조회 인덱스
CREATE INDEX idx_b2b_type ON b2b_inquiries (business_type);

-- 해저 숙성 환경 데이터 (Section 3 Data Archive용)
CREATE TABLE depth_data (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp           TIMESTAMPTZ NOT NULL,
  depth_m             INTEGER NOT NULL,
  temperature_c       NUMERIC(4,2) NOT NULL,
  pressure_atm        NUMERIC(5,2) NOT NULL,
  salinity_psu        NUMERIC(4,2),
  dissolved_oxygen_ml NUMERIC(4,2),
  created_at          TIMESTAMPTZ DEFAULT now()
);

-- 깊이 + 시간순 조회 인덱스
CREATE INDEX idx_depth_data_depth_time ON depth_data (depth_m, timestamp DESC);
```

### 9-2. Row Level Security (RLS) 정책

```sql
-- 모든 테이블에 RLS 활성화
ALTER TABLE ocean_circle_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE depth_data ENABLE ROW LEVEL SECURITY;

-- ─── ocean_circle_signups ──────────────────────────────

-- 익명 사용자: INSERT만 허용 (폼 제출)
CREATE POLICY "Allow anonymous signup insert"
  ON ocean_circle_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 익명 사용자: SELECT 차단 (다른 가입자 정보 조회 불가)
-- 관리자만 SELECT 가능
CREATE POLICY "Allow admin read signups"
  ON ocean_circle_signups
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- 관리자: UPDATE 허용 (status 변경 등)
CREATE POLICY "Allow admin update signups"
  ON ocean_circle_signups
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- ─── b2b_inquiries ─────────────────────────────────────

-- 익명 사용자: INSERT만 허용 (B2B 문의 제출)
CREATE POLICY "Allow anonymous inquiry insert"
  ON b2b_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 관리자만 SELECT/UPDATE 가능
CREATE POLICY "Allow admin read inquiries"
  ON b2b_inquiries
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admin update inquiries"
  ON b2b_inquiries
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- ─── depth_data ────────────────────────────────────────

-- 모든 사용자: SELECT 허용 (공개 데이터)
CREATE POLICY "Allow public read depth data"
  ON depth_data
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- INSERT/UPDATE/DELETE: 관리자만
CREATE POLICY "Allow admin manage depth data"
  ON depth_data
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
```

### 9-3. 참고: 기존 테이블 연동

`spec.md`에 정의된 `products`, `profiles`, `ocean_logs`, `newsletters` 테이블은 이 문서 범위 밖이나, Archive 섹션(Section 5)에서 `products` 테이블을 SSG fetch에 활용한다.

---

## 10. 미결 사항 (타팀 확인 필요)

| 항목 | 담당 | 기한 | 비고 |
|------|------|------|------|
| 컬러 토큰 최종 확정 | 디자인팀 (02) + 럭셔리 브랜딩팀 (00) | — | 전체 CSS 변수 교체 필요 |
| 디자인 스타일 (Editorial Minimalism) 세부 가이드 | 디자인팀 (02) | — | 카드 스타일, 여백, 그리드 확정 |
| 관찰 일기(Section 2) 카피 텍스트 | 카피팀 (04) | — | 4개 엔트리 기준 |
| CEO 편지(Section 4) 카피 텍스트 | 카피팀 (04) | — | |
| 초대 멤버십(Section 6) 카피 톤 확정 | 카피팀 (04) + 럭셔리 브랜딩팀 (00) | — | "초대" 언어 가이드 |
| 해저 데이터 로깅 원본 확보 | CEO / 프로덕션팀 | — | Section 3 실제 데이터 필요 |
| 제품 이미지 촬영 | 사진팀 (07) | — | 5-depth x 정면/측면 |
| CEO 아카이브 사진 촬영 | 사진팀 (07) | — | |
| 히어로 브랜딩 영상 | 영상팀 (06) | — | hero-tech-spec.md 5-2절 스펙 |
| 디지털 세일즈 키트 PDF 제작 | 마케팅팀 (05) | — | 룩북, 성분 분석서, B2B 조건서 |
| 로고 심볼 최종 확정 | 럭셔리 브랜딩팀 (00) | — | 내비게이션 + 파비콘 |
| 한지 질감 SVG 패턴 감수 | 디자인팀 (02) | — | CSS 시뮬레이션 vs 실제 텍스처 스캔 |

---

*문서 끝 — Frontend Team (01) / 2026-02-22*
