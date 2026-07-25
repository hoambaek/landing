# Muse de Marée — CLAUDE.md

> **최우선 규칙: 모든 소통은 한국어로만 한다.**
>
> **한글 카피 작성 순서 (항상 디폴트):** 사이트에 들어갈 한글 문안(헤드라인·본문·라벨·CTA 등)을 새로 쓰거나 고칠 때는 반드시 아래 2단계를 순서대로 거친다. 즉흥으로 바로 넣지 않는다.
> 1. **마케팅·카피라이팅 초안** — 브랜드 정본(북극성 §6·§7)과 타겟·욕구·포지셔닝을 반영해 전략적으로 초안을 쓴다. 필요 시 `teams/04-copywriting-team`·`teams/05-marketing-team` 관점 또는 서브에이전트를 활용. 후보 2~3안 검토.
> 2. **`humanize-korean` 스킬로 다듬기** — 초안을 humanize-korean으로 통과시켜 AI 티(특히 "A가 아니라 B" 대구·기계적 병렬·과장어)를 제거하고 자연스러운 한국어로 확정.
>
> **길이·줄바꿈 규칙 (필수):**
> - **짧게.** 헤드라인·본문은 한 줄에 들어갈 길이로 쓴다. 복문·만연체·두 문장 이상 지양. 한 요소당 핵심 메시지 하나만. 다 담으려 늘리지 말 것.
> - **줄바꿈을 통제한다.** 브라우저 자동 감김에 맡기지 않는다. 짧게 만들어 한 줄에 담거나, 꼭 필요하면 의도한 지점에서만 줄바꿈(`\n`/`<br>`)한다. 조사·어절이 어색하게 쪼개지지 않도록 한국어 요소엔 `word-break: keep-all`을 기본 적용한다.
>
> 두 단계 모두 브랜드 금지어(맛/향/풍미·판매어·luxury 등)와 톤(명사형 종결·조용·"숫자는 형용사보다 조용하다")을 지킨다.
>
> **개체 지칭:** 개별 병을 대명사("이 병"·"그 병")로 부르지 않는다. 번호(`N° 89`)로 부르거나, 앞 문장이 대상을 세웠으면 생략한다. "한 병"은 물리적으로 담기는 자리에만. 상세 → [`docs/brand/korean-copy-object-reference.md`](./docs/brand/korean-copy-object-reference.md)

## 프로젝트 개요

**뮤즈드마레** — 바다의 시간을 기록하는 샴페인 브랜드.
**정식 런칭 = 2026년 12월 첫 상품 인양.** (입수 2026-01-30 · 테스트 인양은 완료됐으나 "첫 기록"으로 쓰지 않음 · First Record 인양 실측 데이터는 12월 대기 — 그 전까지 관측 수치는 시드/실시간 연동 예정 값)

> **브랜드 정의 (북극성):** 샴페인 하우스가 아니다. **바다의 시간을 기록하는 브랜드.**
> 샴페인은 샹파뉴가 만들었고, 변화는 바다가 만든다. 우리가 하는 일은 — 지켜보고, 기록하고, 그 기록과 함께 병을 건네는 것.
> **모토(고정):** *Written by the Sea.* / 바다가 쓴 시간 / *Écrit par la mer*
> **방향성 정본 (Source of Truth):** `/Users/hoambaek/Documents/Cursor/hub/docs-vault/brand/musedemaree/brand-direction-2026.md` + `/Users/hoambaek/Documents/Cursor/hub/docs-vault/plans/musedemaree/2026-06-10-brand-north-star.md` — 이 두 문서가 모든 브랜드 결정의 최종 심판. ⚠️ **이 저장소 안이 아니라 hub 저장소의 `docs-vault/` 아래에 있다(2026-07-25 이관).** 정본 목록은 `~/Documents/Cursor/hub/brain/canon/registry.md`. (기존 `project.md`·`brand-guide.md`는 하위 실행 레이어)

레퍼런스: Krug.com + Kinfolk.com

---

## 운영 원칙

1. **정확함 > 화려함**: 읽기 쉽고 유지보수 가능한 코드 우선. 불필요한 리팩터 금지
2. **최소 변경**: 요청된 부분만 수정. 인접 코드 정리하지 않음
3. **기존 패턴 따르기**: 새 추상화 도입 전 프로젝트 내 기존 패턴 확인
4. **검증 후 완료**: 테스트, 빌드, 린트, 수동 확인 없이 완료 선언 금지
5. **불확실하면 명시**: 추측하지 말고 모르는 부분을 밝힐 것

---

## 워크플로우

### 계획 우선
비단순 작업(3단계 이상, 멀티파일 변경, 아키텍처 결정)은 반드시 Plan Mode 사용.
검증 단계를 계획에 포함할 것.

### 서브에이전트 전략
집중된 목적(탐색, 패턴 발견, 테스트 분류, 의존성 조사)은 서브에이전트에 위임.
컨텍스트를 깨끗하게 유지하고 병렬화를 활용한다.

### 점진적 전달
한 번에 큰 변경 대신, 얇은 수직 슬라이스로 전달: 구현 → 테스트 → 검증 → 확장.

### 자기 개선 루프
실수나 교정 발생 시 [`tasks/lessons.md`](./tasks/lessons.md)에 기록.
실패 모드, 감지 신호, 방지 규칙을 포함한다.

### 작업 추적
[`tasks/todo.md`](./tasks/todo.md)에 체크리스트 형식으로 관리.
- 비단순 작업은 반드시 체크리스트 작성
- 성공 기준 명시
- 진행 상황 추적 (동시 진행 1건)
- 발견 사항과 결정 기록
- 결과: 무엇이 바뀌었고, 어디서, 어떻게 검증했는지

---

## 소통 규칙

- **결과 먼저**: 결과와 영향부터 말한다. 구체적 아티팩트(파일 경로, 명령어, 에러 메시지) 참조
- **막힐 때만 질문**: 정확히 하나의 질문 + 추천 기본값 + 답변에 따라 달라지는 것 명시
- **가정 명시**: 추론한 요구사항과 제약 조건을 나열. 검증 불가 시 방법 안내
- **검증 결과 포함**: 무엇을 실행했고 결과가 어땠는지 항상 포함
- **불필요한 업데이트 금지**: 나레이션 생략. 범위 변경, 리스크 발생, 검증 실패, 결정 필요 시에만 보고

---

## 컨텍스트 관리

- **읽고 나서 쓰기**: 수정 전 반드시 해당 파일 읽기. 권위 있는 소스 먼저 확인
- **작업 메모 유지**: `tasks/todo.md`에 러닝 노트 기록. 큰 컨텍스트는 요약으로 압축
- **인지 부하 최소화**: 명시적 이름과 직관적 제어 흐름. 프로젝트에 없는 메타 프로그래밍 금지
- **범위 확장 통제**: 정확성에 필요한 것만 수정. 깊은 이슈는 TODO로 기록

---

## 에러 처리와 복구

- **Stop-the-Line**: 예상치 못한 실패 시 기능 추가 중단. 증거 보존 후 진단으로 복귀
- **트리아지 순서**: 재현 → 실패 레이어 격리 → 최소 실패 케이스 축소 → 근본 원인 수정 → 회귀 테스트 → E2E 검증
- **안전한 폴백**: 부분 동작보다 경고가 있는 안전 기본값 선호. 조용한 실패 금지
- **롤백 전략**: 기능 플래그, 설정 게이팅, 격리된 커밋으로 변경을 되돌릴 수 있게 유지

---

## 팀 구조

> **`00-luxury-branding-team`이 총괄.** 모든 산출물은 럭셔리 기준 검토 후 승인.
> 기준서 → [`teams/00-luxury-branding-team/brand-standards.md`](./teams/00-luxury-branding-team/brand-standards.md)

```
teams/
├── 00-luxury-branding-team/   ← 총괄 · 최종 승인
├── 01-frontend-team/          ← 컴포넌트, 기술 스펙, 성능
├── 02-design-team/            ← 컬러 시스템, 디자인 토큰, 모션 원칙
├── 03-ux-team/                ← 와이어프레임, IA, 사용자 플로우
├── 04-copywriting-team/       ← 섹션별 카피, 톤앤매너
├── 05-marketing-team/         ← 포지셔닝, 캠페인, 채널 전략
├── 06-creative-video-team/    ← 영상 스펙, 시네마그래프
└── 07-creative-photo-team/    ← 사진 디렉션, 에셋
```

### 작업 방식
1. 각 팀 에이전트 **병렬** 작업 (독립적, `teams/` 하위 폴더에 저장)
2. `00-luxury-branding-team` 리더가 전체 검토 + 팀간 조율
3. 리더가 `final-[주제].md` 최종안 작성 → CEO 보고

---

## 문서 맵 (Sources of Truth)

```
docs/
├── brand/                ← 브랜드 철학, 전략, 기획
│   ├── (없음 — 정본은 hub/docs-vault/brand/musedemaree/)
│   ├── project.md           브랜드 철학/전략/타겟 (하위 레이어)
│   ├── brand-book.md        브랜드 소개서(Paper) 문서
│   └── PLAN.md              홈페이지 기획
├── plans/
│   └── (없음 — 정본은 hub/docs-vault/plans/musedemaree/)
├── tech/                 ← 기술 스펙
│   ├── spec.md              기술 스택 전체
│   └── frontend-spec.md     CSS/컴포넌트/성능 상세
├── reference/            ← 참고 자료
│   ├── marketing-strategy.md
│   ├── creator-strategy-2026.md
│   ├── master-plan.md
│   └── ...
└── reports/              ← 분석 보고서, 크리에이티브 제안
    ├── homepage-narrative-analysis.html
    ├── observation-creative-proposals.html
    └── observation-section-analysis.html
```

| 문서 | 역할 | 참조 시점 |
|------|------|-----------|
| `/Users/hoambaek/Documents/Cursor/hub/docs-vault/brand/musedemaree/brand-direction-2026.md` (저장소 밖) | ★ **브랜드 방향성 정본** (정의·포지셔닝·4기둥·톤·금지목록 · **§6 개체 지칭 규칙**) | **카피/디자인 방향 시 최우선** |
| `/Users/hoambaek/Documents/Cursor/hub/docs-vault/plans/musedemaree/2026-06-10-brand-north-star.md` (저장소 밖) | ★ 북극성 (전략 근거·리서치) | 방향성 근거 확인 시 |
| [`docs/tech/spec.md`](./docs/tech/spec.md) | 기술 스택 전체 | 개발 시작 전 필수 |
| [`docs/tech/frontend-spec.md`](./docs/tech/frontend-spec.md) | CSS/컴포넌트/성능 상세 | UI 구현 시 |
| [`docs/brand/PLAN.md`](./docs/brand/PLAN.md) | 홈페이지 기획 | 페이지 구조 파악 시 |
| [`docs/brand/project.md`](./docs/brand/project.md) | 브랜드 철학/전략/타겟 (하위 레이어) | 보조 참조 |
| [`homepage-plan.html`](./homepage-plan.html) | 브랜드 기획 + 라이브 데모 (구버전 레퍼런스 — 수치는 신뢰 금지) | 레이아웃 레퍼런스 |
| [`docs/reports/2026-07-03-landing-brand-audit.md`](./docs/reports/2026-07-03-landing-brand-audit.md) | 랜딩 브랜드 감사 정본 (런칭 타임라인 근거) | 카피·수치 정합 확인 시 |
| [`docs/reports/2026-07-05-landing-layout-stylegallery-audit.md`](./docs/reports/2026-07-05-landing-layout-stylegallery-audit.md) | 레이아웃 감사 정본 (A/B/C 로드맵·실행 결과) | CSS/구조 리팩터 시 |
| [`tasks/todo.md`](./tasks/todo.md) | 작업 추적 | 세션 시작/종료 시 |
| [`tasks/lessons.md`](./tasks/lessons.md) | 실수 기록 (**CSS 함정·폰트·Paper 규칙 다수 — 디자인 작업 전 필독**) | 교정 발생 시 + UI 작업 전 |

---

## 기술 스택 (실사용 기준 — package.json이 정본)

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (Turbopack) + React 19 + TypeScript |
| 스타일링 | Tailwind CSS 4 + `globals.css` raw CSS (섹션별 `.s-*` BEM) · `@theme` 토큰(색·폰트·z-index·`--w-content`·`--gutter-*`) |
| 애니메이션 | **CSS 트랜지션 + IntersectionObserver** (`ScrollReveal` → `.reveal`/`.is-visible` 패턴) |
| i18n | 경량 자체 구현 — `src/i18n`(config·dictionaries·messages/{ko,en,fr}.json) + `/`·`/en`·`/fr` 라우트. 한글 타이틀은 J1950 PNG(ko 전용, `<picture>` 아트디렉션), en/fr은 Cormorant 텍스트 |
| DB | Supabase (blog와 프로젝트 공유) |
| 메일 | Resend + react-email (`src/lib/resend/templates/`) — 폼 3종(초대·파트너·소개서) |
| 아이콘 | @phosphor-icons/react · lucide-react |
| 배포 | Vercel |

> ⚠️ **GSAP·Three.js·Lenis·PostHog·framer-motion은 미사용.** `docs/tech/spec.md`의 해당 항목은 초기 계획(aspirational)이다. framer-motion은 설치만 되어 있고 src에서 import 0건 — 새 모션은 기존 CSS+IO 패턴을 따르고, 라이브러리 도입은 사용자 승인 후.

---

## 개발 환경 (필수 규칙)

- **pnpm 전용 — npm 금지** (`npm install` 하면 node_modules 깨짐)
- **dev 서버: `pnpm dev --port 3600`** (3000은 다른 프로젝트 사용 중)
- **CSS 변경이 반영 안 되면: `rm -rf .next` 후 재시작** — Turbopack이 새 CSS 규칙을 캐시로 무시하는 일이 반복됨 (최다 빈발 함정)
- **`backdrop-filter`는 인라인 스타일로** — Tailwind 4 Lightning CSS가 raw CSS의 backdrop-filter를 스트립함
- **커밋·푸시는 사용자가 명시적으로 요청할 때만** (자동 커밋 금지) · push 계정 = `hoambaek`
- **브라우저 확인은 Playwright MCP** · 스크린샷은 사용 후 반드시 삭제
- **이미지 에셋은 사용자 소유** — 이해 안 되는 에셋 변경을 발견해도 revert 전에 먼저 물어볼 것 (rec04 사건)

---

## 작업 규칙

### UI 작업
- 반드시 `ui-ux-pro-max` 스킬 먼저 호출 (또는 frontend-design 스킬)
- 스타일: Glassmorphism (Ocean Glass) + Editorial Minimalism · **디자인 가이드 정본은 Paper 안에 있음** (코드/문서 아님 — Abyssal Amber + 3-Font Trinity)
- 실제 CSS 토큰은 `src/app/globals.css`의 `@theme` 블록만 사용 (미정의 변수 금지)
- 작업 전 [`tasks/lessons.md`](./tasks/lessons.md)의 CSS·폰트 함정 목록 확인 (dot 클래스·`--font-jj`·J1950 글리프 누락 등)

### 애니메이션
- **기존 패턴 = CSS 트랜지션 + `ScrollReveal`(IntersectionObserver → `.reveal`/`.is-visible`)** — 새 모션도 이 패턴 우선
- 모션 라이브러리 도입(GSAP·Motion 등)은 사용자 승인 후에만

### 코드
- 새 라이브러리 추가 전 package.json 확인 + 사용자 승인
- Supabase: RLS 필수 적용 · 폼 env 4개(Supabase 2 + Resend 2, `.trim()` 주의 — 개행 들어가면 프로덕션만 invalid header)
- 성능 목표: LCP 2.0s↓, First Load JS 90KB↓

### 브랜드 어조
- **숫자는 형용사보다 조용하다**: "깊고 신비로운" 대신 "수심 30m · 11.4°C". 데이터는 이야기의 각주 위치
- 판매 언어 금지: "구매" → "발견", "결제" → "경험 시작"
- "맛", "향", "풍미" 등 직접적 감각 단어 사용 금지
- 명사형 종결 선호. 여백이 카피의 일부. 톤 일관성 = 헤리티지의 대체재
- **🔴 영구 금지어**: "두 개의 떼루아"(Abyss 선점) · 풍미 우위 주장 · 수압 가속 주장 · 깊이/기간 스펙 경쟁 · "luxury/exclusive/timeless" · 연출된 희소성
- **표기 규칙 (2026-07-05 확립)**: em-dash(`—`) 금지 → 쉼표/마침표로 · 가운뎃점(`·`)은 한 줄에 1개까지 · 스크롤 큐(`↓`) 금지 · 좌표/수온 등 정밀 수치는 실측·실시간 연동 값만 (임의 생성 금지)
- **수심 표기는 30m로 통일** (코드베이스 일부 "50미터"는 구표기 — 30m가 정본)
- 상세 → `/Users/hoambaek/Documents/Cursor/hub/docs-vault/brand/musedemaree/brand-direction-2026.md` §6 (톤·금지목록·**개체 지칭**)

---

## 페이지 구조 (실제 렌더 기준 — `LandingPage.tsx`가 정본)

랜딩 = **7섹션**. 컴포넌트는 `src/components/sections/`, CSS는 `globals.css`의 `.s-*` 블록.

| 메뉴명 | 섹션 ID | 컴포넌트 (CSS 접두어) | 역할 |
|--------|---------|--------|------|
| Home | void | HeroSection (`.s-void`) | 히어로 — h1 단일 · ko 타이틀 `<picture>` 아트디렉션 |
| The Living Record | data-archive | TheLivingRecordSection (`.s-living`) | 심해의 시간 · 관측일수 카운터 · 측정 로그 |
| The First Record | the-first-record | TheFirstRecordSection (`.s-first`) | 첫 인양 서사 (2컷·헤드라인 J1950) |
| Collection | archive | ArchiveSection (`.s-col`) | 6개 큐베 그리드 + 기록카드 쇼케이스 + 기프트 |
| The Maker | the-maker | TheMakerSection (`.s-maker`) | Mignon Boulard · 캐러셀(translateX — 구조 변경 주의) |
| Ocean Cellar Privé | ocean-circle | OceanCircleSection (`.s-prive--left`) | 초대제 멤버십 → `/invite` |
| Partnership | professionals | ProfessionalsSection (`.s-prive--right`) | B2B → `/partner`·`/brand-book` |

- 섹션 타이틀 시스템: Collection·Maker·Ocean·Partnership = **Cormorant 300·56px `<h2>`** / Living·First = 서사형(J1950 문장, `aria-label` 부여)
- 다크→라이트→다크 테마 전환 = **의도된 서사 장치** (수면→심해→기록) — "통일" 명목으로 없애지 말 것
- 서브페이지: `/invite`·`/partner`·`/brand-book`(폼 3종, `forms/Letter*` 셸 공유) · `/terms`·`/privacy`·`/cookies`(법적) · `/exit`(연령 게이트 이탈) · 각각 `/en`·`/fr` 변형
- ⚠️ 구버전 문서(PLAN.html 등)의 observation·Living Data 섹션 표기는 폐기됨 — 이 표가 정본

---

## 완료 기준 (Definition of Done)

작업이 완료되려면:
- [ ] 동작이 수용 기준과 일치
- [ ] 테스트/린트/타입체크/빌드 통과 (불가 시 사유 문서화)
- [ ] 위험한 변경은 롤백 전략 포함
- [ ] 프로젝트 컨벤션을 따르고 가독성 확보
- [ ] 검증 스토리 존재: 무엇이 바뀌었고, 어떻게 확인했는지
- [ ] `tasks/todo.md` 업데이트
- [ ] 실수 발생 시 `tasks/lessons.md` 업데이트
