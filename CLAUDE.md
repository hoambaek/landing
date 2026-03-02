# Muse de Marée — CLAUDE.md

> **최우선 규칙: 모든 소통은 한국어로만 한다.**

## 프로젝트 개요

**뮤즈드마레** — 한국 심해에서 숙성한 샴페인 브랜드 랜딩 페이지. 런칭 2026년 7-8월.
콘셉트: "바다의 시간을 기록하는 디지털 아카이브" | 레퍼런스: Krug.com + Kinfolk.com

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
│   ├── project.md           브랜드 철학/전략/타겟
│   └── PLAN.md              홈페이지 기획
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
| [`docs/tech/spec.md`](./docs/tech/spec.md) | 기술 스택 전체 | 개발 시작 전 필수 |
| [`docs/tech/frontend-spec.md`](./docs/tech/frontend-spec.md) | CSS/컴포넌트/성능 상세 | UI 구현 시 |
| [`docs/brand/PLAN.md`](./docs/brand/PLAN.md) | 홈페이지 기획 | 페이지 구조 파악 시 |
| [`docs/brand/project.md`](./docs/brand/project.md) | 브랜드 철학/전략/타겟 | 카피/디자인 방향 시 |
| [`homepage-plan.html`](./homepage-plan.html) | 브랜드 기획 + 라이브 데모 | 레이아웃 레퍼런스 |
| [`tasks/todo.md`](./tasks/todo.md) | 작업 추적 | 세션 시작/종료 시 |
| [`tasks/lessons.md`](./tasks/lessons.md) | 실수 기록 | 교정 발생 시 |

---

## 기술 스택

상세: [`docs/tech/spec.md`](./docs/spec.md)

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 + React 19 + TypeScript |
| 스타일링 | Tailwind CSS 4 |
| 애니메이션 | Framer Motion 12+ · GSAP 3+ |
| 3D/WebGL | Three.js / React Three Fiber |
| 스크롤 | Lenis |
| DB | Supabase (PostgreSQL + RLS) |
| 배포 | Vercel Edge Runtime |
| 분석 | PostHog |

---

## 작업 규칙

### UI 작업
- 반드시 `ui-ux-pro-max` 스킬 먼저 호출
- 스타일: Glassmorphism (Ocean Glass) + Editorial Minimalism
- CSS 스펙 → [`docs/tech/frontend-spec.md`](./docs/frontend-spec.md) §2
- 컬러 토큰 → [`docs/tech/spec.md`](./docs/spec.md) §7

### 애니메이션
- Framer Motion: 컴포넌트 전환 · 드래그
- GSAP: 타임라인 · 카운터 · ScrollTrigger

### 코드
- 새 라이브러리 추가 전 [`docs/tech/spec.md`](./docs/spec.md) 확인
- Supabase: RLS 필수 적용
- 성능 목표: LCP 2.0s↓, First Load JS 90KB↓

### 브랜드 어조
- 판매 언어 금지: "구매" → "발견", "결제" → "경험 시작"
- "맛", "향", "풍미" 등 직접적 감각 단어 사용 금지
- 명사형 종결 선호. 여백이 카피의 일부
- 상세 → [`docs/brand/project.md`](./docs/project.md)

---

## 페이지 구조

| 메뉴명 | 섹션 ID | 역할 |
|--------|---------|------|
| Home | The Void | 히어로 (라이트 배경) |
| *(메뉴 미노출)* | Observation | Story — Pressure Descent + Before/After |
| Data Archive | Data Archive | 해저 숙성 데이터 시각화 |
| The Maker | The Maker | 생산자 철학 + 이중의 떼루아 |
| Collection | Archive | 5개 큐베 라인업 |
| Ocean Circle | Ocean Circle | 초대제 멤버십 |
| For Professionals | Professionals | B2B 문의 |

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
