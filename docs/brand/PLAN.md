# Muse de Marée — 홈페이지 기획

> 작성 기준: 2026-02-22
> 마케팅 피드백 반영 → [`teams/05-marketing-team/marketing-feedback-reflection.md`](../../teams/05-marketing-team/marketing-feedback-reflection.md)
> 원본 기획 → [`homepage-plan.html`](../../homepage-plan.html)

---

## 콘셉트

**"바다의 시간을 기록하는 디지털 아카이브"**
단순히 해저에 넣은 것이 아니다. 설계된 것이다.
감성과 정밀함이 공존하는 예술품.

레퍼런스: Krug.com (럭셔리 미니멀) + Kinfolk.com (에디토리얼 내비게이션)

---

## 홈페이지 섹션 구조

단일 페이지 스크롤. 7개 섹션이 하나의 연속된 내러티브를 구성한다.

```
1. Home (The Void)   ← 히어로 섹션
2. Observation       ← 브랜드 스토리 (관찰 일기 형식) — 메뉴 미노출
3. Data Archive      ← 해저 데이터 시각화
4. The Maker         ← CEO 아카이브 / 만든 이의 편지
5. Collection        ← 5개 깊이 컬렉션 라인업 (구 Archive)
6. Ocean Circle      ← 초대제 멤버십
7. For Professionals ← B2B 전용 섹션
```

---

## 섹션별 기획

### 1. The Void (히어로)
상세 기획 → 각 팀 폴더 참조
- UX: `03-ux-team/hero-flow.md`
- 기술: `01-frontend-team/hero-tech-spec.md`
- 카피: `04-copywriting-team/hero-copy.md`
- 영상: `06-creative-video-team/hero-video-direction.md`
- 최종안: `00-luxury-branding-team/final-hero.md` (작성 예정)

**핵심:** 지상(화석 산호 + 오브제) → 수면 관통(POV) → 심해(영상 + 감각 카피)

---

### 2. Observation (스토리)
관찰 일기 형식의 브랜드 스토리. 바다가 주인공.

---

### 3. Data Archive [신규]
**목적:** "공학적으로 설계된 예술품"임을 데이터로 증명

- 실제 해저 60m 수온/압력 로깅 데이터
- 표현 방식: 원시 그래프 X → 미니멀 기하학 파동 애니메이션 O
- 돔 페리뇽(갤러리) + 크루그(데이터) 방식 결합
- 인터랙티브: 스크롤/호버로 데이터 탐색

---

### 4. The Maker [신규]
**목적:** 만든 사람의 신뢰 = 제품의 신뢰

- 셀렉션한 샴페인 생산자 소개
- 한국 바다에서 숙성하는 팀의 이야기
- "만든 이의 편지" 또는 아카이브 형식

---

### 5. Archive (컬렉션)
5개 깊이 라인업 + 희소성 구체화

- Underwater Aging Certificate 샘플 노출
- 병마다 부여되는 시리얼 QR 코드
- Sea Whisper 카드 + 테이스팅 리추얼 가이드
- 권장 온도/페어링 — 고감도 영상과 함께

---

### 6. Ocean Circle (초대제 멤버십)
기존 뉴스레터 구독 → **초대제 멤버십**으로 격상

- 혜택: 런칭 전 우선 구매권
- 언어: "가입" 아닌 "초대" — "바다의 원에 들어오세요"
- 잠재 고객 DB 선제 확보

---

### 7. For Professionals [신규]
파인다이닝 / 호텔 바 / 소믈리에 전용

- B2B 전용 문의(Inquiry) 폼
- 디지털 세일즈 키트 (PDF 다운로드)
  - 룩북
  - 성분 분석서
  - B2B 조건서
- 메인 플로우와 분리 (하단 또는 별도 탭)

---

## UI/UX 전체 방향

### 압력 체험 효과 [신규]
- 스크롤 시 화면 선들이 미세하게 눌리거나 왜곡
- 사용자가 탐험하는 과정 자체가 해저 압력의 간접 체험
- 담당: 프론트엔드 + UX

### 텍스처 레이어 [신규]
- 한지 질감 + 수묵화 파동이 배경/섹션 구분선에 은은하게 적용
- 디지털 공간에서 실물의 아날로그 럭셔리함 구현
- 크루그 아트웍 요소 참조
- 담당: 디자인팀

### 로고 연동
- 심볼 로고 확정 후 전체 디자인 언어와 정합성 검토 필수
- 확정 시 00-luxury-branding-team에 공유

---

## 내비게이션 구조

> 참고: [`homepage-plan.html`](../homepage-plan.html) — 08. 사이트 구조, 내비게이션 전략

### 헤더 (상단 고정)

```
MUSE DE MARÉE                              [≡]
(좌측: 로고)                    (우측: 햄버거 메뉴)
```

- 투명 상단바, 스크롤 기반 변화 (Contextual Navigation)
- 모바일: Bottom Navigation 병행

### 풀스크린 메뉴 오버레이 (Kinfolk 스타일)

```
┌─────────────────────────────────────────────────────┐
│ muse de marée                                    ✕  │
│                                                     │
│  Membership            │  Home                      │
│                        │  Data Archive              │
│  Collection            │  The Maker                 │
│  En Lieu Sûr.          │  Collection                │
│  En Lieu Sûr Magnum.   │  Ocean Circle              │
│  Élément de Surprise.  │  For Professionals         │
│  Atomes Crochus 1yr.   │                            │
│  Atomes Crochus 3yr.   │                            │
│                        │                            │
│  KR  EN  FR            │                            │
└─────────────────────────────────────────────────────┘
```

- 배경: 따뜻한 아이보리 (#F5F1E8, Kinfolk 레퍼런스)
- 좌측: 보조 링크 (Membership) + Collection 큐베 리스트 + 언어 스위처
- 우측: 메인 네비게이션 (큰 세리프 이탤릭), 세로 구분선으로 분리
- For Professionals는 메인 네비게이션 맨 하단 배치
- Observation은 메뉴에서 제외 (스크롤로만 접근)
