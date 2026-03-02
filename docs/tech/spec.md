# Muse de Marée — 기술 스펙 (Tech Spec)

> 작성 기준: 2026-02-22
> 레퍼런스: [`frontend-spec.md`](./frontend-spec.md), [`PLAN.md`](../brand/PLAN.md), [`homepage-plan.html`](../../homepage-plan.html)

---

## 1. 핵심 프레임워크

| 기술 | 버전 | 역할 | 공식 문서 |
|------|------|------|----------|
| **Next.js** | 16 | App Router, SSR/SSG, Partial Prerendering (PPR) | [nextjs.org/docs](https://nextjs.org/docs) · [v16 업그레이드](https://nextjs.org/docs/app/guides/upgrading/version-16) |
| **React** | 19 | Server Components, `use()` hook, Actions | [react.dev](https://react.dev) · [v19 릴리즈](https://react.dev/blog/2024/12/05/react-19) |
| **TypeScript** | 5+ | 타입 안전성 | [typescriptlang.org](https://www.typescriptlang.org/docs/) |
| **Tailwind CSS** | 4 | Oxide 엔진, `@theme` 디렉티브, Container Queries | [tailwindcss.com](https://tailwindcss.com/) · [v4 업그레이드](https://tailwindcss.com/docs/upgrade-guide) |

---

## 2. 애니메이션 & 인터랙션

| 기술 | 버전 | 역할 | 공식 문서 |
|------|------|------|----------|
| **Motion** (prev Framer Motion) | 12+ | 선언적 애니메이션, 스크롤 기반 parallax, 페이지 전환, 드래그 제스처 | [motion.dev/docs](https://motion.dev/docs) · [업그레이드](https://motion.dev/docs/react-upgrade-guide) |
| **GSAP** (GreenSock) | 3.14+ | 고성능 타임라인 애니메이션, ScrollTrigger, 복잡한 시퀀스 제어 | [gsap.com/docs](https://gsap.com/docs/v3/GSAP/) · [GitHub](https://github.com/greensock/GSAP) |
| **Lenis** | latest | 커스텀 스무스 스크롤 | [lenis.darkroom.engineering](https://lenis.darkroom.engineering/) · [GitHub](https://github.com/darkroomengineering/lenis) |

### Framer Motion vs GSAP 사용 기준

| 상황 | 도구 |
|------|------|
| React 컴포넌트 진입/퇴장 애니메이션 | Framer Motion |
| 스크롤 기반 시차(parallax) | Framer Motion `useScroll` / GSAP `ScrollTrigger` |
| 복잡한 멀티-스텝 타임라인 시퀀스 | GSAP |
| 숫자 카운터 애니메이션 | GSAP |
| 페이지 전환 레이아웃 애니메이션 | Framer Motion `layout` |
| SVG 드로잉 / 경로 애니메이션 | GSAP `DrawSVG` |
| 드래그 & 스와이프 제스처 | Framer Motion `drag` |

---

## 3. 데이터베이스 & 백엔드

| 기술 | 역할 |
|------|------|
| **Supabase** | PostgreSQL DB, 실시간 구독, Row Level Security, Auth | [supabase.com/docs](https://supabase.com/docs) · [Next.js 가이드](https://supabase.com/docs/guides/getting-started) |

### Supabase 주요 테이블 (예상)

| 테이블 | 설명 |
|--------|------|
| `profiles` | 사용자 프로필 (Ocean Circle 멤버) |
| `products` | 제품 컬렉션 (5개 깊이 라인업) |
| `ocean_logs` | 사용자 개인 관찰 기록 |
| `newsletters` | 뉴스레터 구독자 |
| `depth_data` | 해저 숙성 실시간 데이터 |

---

## 4. 배포 & 인프라

| 기술 | 역할 | 공식 문서 |
|------|------|----------|
| **Vercel** | Edge Runtime 글로벌 배포, ISR, Image Optimization, Edge Middleware | [vercel.com/docs](https://vercel.com/docs) |
| **Vercel Image Optimization** | 제품 이미지 WebP/AVIF 자동 변환 | [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image) |

### Vercel 설정

- **프로젝트 ID**: `prj_PGuAYH989D9104vAc0gNRZKHtqId`
- **Org ID**: `team_aygG0SHN1XQVXGihBflGngsp`
- **배포 대상**: Edge Runtime (글로벌 저지연)
- **캐싱 전략**:
  - 정적 에셋 (폰트, 이미지): `Cache-Control: public, max-age=31536000, immutable`
  - HTML: `s-maxage=3600, stale-while-revalidate=86400`
  - API 응답: `private, max-age=300`

---

## 5. 분석 & 모니터링

| 기술 | 역할 |
|------|------|
| **PostHog** | 사용자 행동 분석, 퍼널 추적, Feature Flags, Session Replay | [posthog.com/docs](https://posthog.com/docs) |

---

## 6. 보조 라이브러리

| 라이브러리 | 역할 | 공식 문서 |
|------------|------|----------|
| **sharp** | 서버사이드 이미지 최적화 | [sharp.pixelplumbing.com](https://sharp.pixelplumbing.com/) |
| **Zustand** | 클라이언트 상태 관리 | [zustand.docs.pmnd.rs](https://zustand.docs.pmnd.rs/) · [GitHub](https://github.com/pmndrs/zustand) |
| **Three.js / R3F** | WebGL Ripple 물결 인터랙션 | [r3f.docs.pmnd.rs](https://r3f.docs.pmnd.rs/) · [GitHub](https://github.com/pmndrs/react-three-fiber) |
| **next/font** | Cormorant Garamond + Noto Sans KR 셀프 호스팅 | [Next.js Font](https://nextjs.org/docs/app/api-reference/components/font) |

---

## 7. 디자인 시스템

### 디자인 언어: Editorial Minimalism
- **스킬**: `ui-ux-pro-max` — 모든 프론트엔드 디자인 작업 시 이 스킬을 먼저 호출
- **스타일**: Editorial Minimalism — 평면 디자인, 극가는 보더, 필름 그레인 텍스처
- **레퍼런스**: Krug.com (럭셔리 미니멀) + Kinfolk.com (에디토리얼 내비게이션)
- **금지**: Glassmorphism (backdrop-filter, blur 카드, 반투명 배경) 사용 금지. 메뉴 오버레이만 예외

### 디자인 특징
| 요소 | 방향 |
|------|------|
| 색상 | 2색 대비 (웜 블랙 ↔ 베이지) + 골드 악센트 |
| 카드 | 평면, 0.5px 극가는 보더, 그림자 없음 |
| 텍스처 | 필름 그레인 (opacity 0.035) + 한지 터뷸런스 (opacity 0.04) |
| 애니메이션 | 자연 모션 (입자, 파형, 호흡), 0.4–0.9s 이징 |
| 타이포 | 극저 웨이트 (200–300), 열린 행간 (1.8–2.1) |
| 공간 | 넓은 여백, 섹션 간 160–280px 패딩 |

### 컬러 토큰 — Abyssal Amber (확정 2026-02-22)

> 팔레트: "Abyssal Amber" — Hue 연속성(H:30°~38°) 기반. 상세 → `docs/frontend-spec.md` 부록

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--void-bg` | `#0A0908` | 다크 배경 (웜 블랙) |
| `--sand` | `#E8E5E1` | 라이트 배경 (소프트 그레이지) |
| `--warm-ivory` | `#ECEAE6` | 라이트 배경 변형 |
| `--amber` | `#CCAD7B` | 유일한 악센트 (샴페인 골드) |
| `--earth` | `#312E2A` | 라이트 배경 위 텍스트 (웜 다크) |
| `--void-text` | `#F1EFEB` | 다크 배경 위 텍스트 (오프화이트) |

### 타이포그래피

| 용도 | 폰트 |
|------|------|
| 제목 | Cormorant Garamond (weight 300) |
| 본문 | Noto Sans KR (weight 300, 400) |

---

## 8. Core Web Vitals 목표

| 메트릭 | 목표 |
|--------|------|
| LCP | 2.0s 이하 |
| INP | 150ms 이하 |
| CLS | 0.05 이하 |
| First Load JS | 90KB 이하 (gzip) |

---

## 9. 번들 구성 예측

| 모듈 | 크기 (gzip) | 로딩 방식 |
|------|-------------|-----------|
| React + React DOM | ~45KB | 즉시 |
| Framer Motion | ~25KB | 즉시 (tree-shaking) |
| Next.js Runtime | ~15KB | 즉시 |
| GSAP Core | ~25KB | 지연 (ScrollTrigger 필요 시) |
| Lenis | ~8KB | 지연 (첫 스크롤 시) |
| PostHog | ~20KB | 지연 (idle callback) |

---

## 10. 개발 환경

```bash
# 패키지 매니저
pnpm

# 주요 스크립트
pnpm dev      # 개발 서버
pnpm build    # 프로덕션 빌드
pnpm lint     # ESLint
```
