# Muse de Maree — 홈페이지 전체 UX 플로우 문서

> 담당팀: 03-ux-team
> 브랜드 기준 참조: [`../00-luxury-branding-team/brand-standards.md`](../00-luxury-branding-team/brand-standards.md)
> 히어로 섹션 참조: [`hero-flow.md`](./hero-flow.md) (확정 완료, 본 문서에서 상세 기술 생략)
> 작성일: 2026-02-22
> 상태: v1.0 (총괄팀 검토 대기)

---

## 개요

Muse de Marée는 5개 페이지로 구성된 멀티 페이지 웹사이트이며, 홈페이지는 그 중 하나의 페이지로서 7개 섹션의 단일 페이지 스크롤 경험을 제공한다.
사용자는 "바다의 시간을 기록하는 디지털 아카이브"를 탐험하듯 자발적으로 내려간다.
판매가 아닌 발견. 설명이 아닌 체험. 각 섹션은 감정 곡선을 따라 배치되어 있으며, 전환은 강제하지 않는다.

**사이트 전체 구조**
```
Home (홈페이지)                  ← 단일 페이지 스크롤 (본 문서의 범위)
├── Story (Observation)         ← 별도 페이지 (/story)
├── Collection (Archive)        ← 별도 페이지 (/collection)
├── Journal (Editorial)         ← 별도 페이지 (/journal) — 블로그
└── Experience (Encounter)      ← 별도 페이지 (/experience) — 이벤트/문의
```

> **중요**: 홈페이지의 Observation 섹션(S2)과 Archive 섹션(S5)은 각각 Story 페이지와 Collection 페이지의 **티저(teaser)** 역할을 한다. 전체 콘텐츠는 별도 페이지에서 제공되며, 홈페이지에서는 핵심만 발췌하여 해당 페이지로의 탐색을 유도한다.

**설계 원칙**
- 압박하지 않는다. 사용자가 스스로 발견하게 설계한다.
- 모든 애니메이션은 0.5~1.0s 범위, 유기적 이징 사용.
- `prefers-reduced-motion` 환경에서 완전한 기능 제공 필수.
- LCP < 2.0s, CLS < 0.05, 60fps 유지.

---

## 1. 전체 사용자 여정 맵

### 1-1. 감정 곡선 (Emotional Arc)

```
감정 강도
  ↑
  │
5 │          ●                                    ●
  │         / \                                  / \
4 │   ●    /   \          ●                     /   \
  │  / \  /     \        / \                   /     \
3 │ /   \/       \      /   \        ●        /       ●
  │/     S2       \    /     \      / \      /
2 │ S1             \  / S4    \    /   \    / S6
  │                 \/         \  /     \  /
1 │                 S3          \/       \/
  │                             S5       S7
  └──────────────────────────────────────────────→ 스크롤
   The Void  Observation  Data   Maker  Archive  Ocean  Pro
                         Archive               Circle
```

| 구간 | 감정 상태 | 키워드 |
|------|----------|--------|
| S1. The Void | 경이, 침잠 | 고요, 몰입, 두 바다 |
| S2. Observation | 호기심, 공감 | 이야기, 일기, 바다의 시간 |
| S3. Data Archive | 신뢰, 경외 | 정밀, 공학, 기록 |
| S4. The Maker | 친밀, 존경 | 사람, 교차점, 편지 |
| S5. Archive | 소유욕, 발견 | 유물, 인증, 희소 |
| S6. Ocean Circle | 소속감, 특별함 | 초대, 원, 우선권 |
| S7. For Professionals | 신뢰, 협력 | B2B, 파트너십, 전문 |

### 1-2. 섹션별 스크롤 깊이 및 전환

| 섹션 | 뷰포트 높이 | 누적 스크롤 | 전환 방식 |
|------|------------|------------|----------|
| S1. The Void (Hero) | 100vh + 200vh(전환) + 100vh = **400vh** | 0~400vh | sticky pin + scrub (hero-flow.md 참조) |
| S2. Observation | **350vh** | 400~750vh | 부드러운 크로스페이드. 심해 배경 → 한지 텍스처 전환 |
| S3. Data Archive | **250vh** | 750~1000vh | 기하학 파동이 화면 하단에서 상승하며 등장 |
| S4. The Maker | **200vh** | 1000~1200vh | 가는 수평 구분선이 왼쪽에서 오른쪽으로 draw |
| S5. Archive | **400vh** | 1200~1600vh | 수직 스크롤 → 수평 카드 캐러셀 전환 (sticky) |
| S6. Ocean Circle | **150vh** | 1600~1750vh | 배경 색조 점진적 어두워짐, 원형 프레임 등장 |
| S7. For Professionals | **100vh** + 푸터 | 1750~1850vh+ | 구분선 + 톤 전환 (따뜻한 → 중립) |
| **총 스크롤 깊이** | **~1850vh** | | |

### 1-3. 섹션 간 전환 상세

```
S1 → S2: 심해 배경 영상 brightness 점진 상승 (0.75 → 1.0)
         배경색 틸(#3D5A56) → 모래(#EFDFBB) 크로스페이드
         duration: 스크롤 100vh 구간에 걸쳐 진행
         한지 텍스처 오버레이 opacity 0 → 0.15

S2 → S3: 관찰 일기 마지막 엔트리 퇴장 후
         기하학 파동 라인이 화면 하단에서 성장하듯 올라옴
         배경: 모래 → 짙은 네이비(#1A365D) 점진 전환
         duration: 스크롤 80vh 구간

S3 → S4: 데이터 파동이 정적 수평선으로 수렴
         수평선이 구분선(section-divider)으로 전환
         배경: 네이비 → 모래 복귀
         duration: 스크롤 60vh 구간

S4 → S5: Maker 편지 마지막 문장 체류 후 자연 퇴장
         아카이브 선반 프레임이 화면 양쪽에서 slide-in
         duration: 스크롤 80vh 구간

S5 → S6: 마지막 컬렉션 카드 패스 후
         배경 어두워짐, 원형 마스크가 중앙에서 확장
         duration: 스크롤 60vh 구간

S6 → S7: section-divider--ornament 등장 (중앙 심볼 포함)
         톤 전환: 감성적 → 비즈니스 (폰트 무게 미세 증가)
         duration: 스크롤 40vh 구간
```

---

## 2. 섹션별 인터랙션 설계

### 2-1. Observation (관찰 일기)

**콘셉트:** 바다가 주인공인 관찰 일기. 에디토리얼 매거진 레이아웃.

**와이어프레임 — 데스크톱**
```
┌─────────────────────────────────────────────────────────────────┐
│  [한지 텍스처 배경 — rgba(239,223,187,1) + grain overlay]        │
│                                                                 │
│  col 2~5                         col 7~11                       │
│  ┌──────────────┐               ┌──────────────────┐           │
│  │              │               │ OBSERVATION      │           │
│  │  [수중 사진   │               │ 관찰             │           │
│  │   — 필름 그레인│               │                  │           │
│  │   처리된      │               │ 2026년 1월 15일   │           │
│  │   해저 풍경]  │               │                  │           │
│  │              │               │ "병이 바다에       │           │
│  │              │               │  들어간 첫째 날.   │           │
│  └──────────────┘               │  수온 4.2°C.      │           │
│                                 │  고요하다."        │           │
│                                 │                  │           │
│                                 │ ── (가는 구분선)   │           │
│                                 └──────────────────┘           │
│                                                                 │
│  col 3~10                                                       │
│  ┌──────────────────────────────────────────┐                  │
│  │ 2026년 2월 8일                            │                  │
│  │                                          │                  │
│  │ "23일째. 압력이 병을 어루만지고 있다.       │                  │
│  │  기포가 더 조밀해졌다.                     │                  │
│  │  바다는 서두르지 않는다."                   │                  │
│  │                                          │                  │
│  │  [풀블리드 수중 이미지 — col 1~12]          │                  │
│  └──────────────────────────────────────────┘                  │
│                                                                 │
│  (반복: 3~4개 일기 엔트리)                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**스크롤 트리거 및 인터랙션**

```
진입 시 (뷰포트 상단 도달):
  progress 0.00  섹션 타이틀 "OBSERVATION" 등장
                 font: Cormorant Garamond, 72px, italic, weight 300
                 opacity: 0 → 1 (duration: 1.0s, ease: easeOutExpo)
                 translateY: 40px → 0

  progress 0.05  한국어 "관찰" 등장
                 font: Noto Sans KR, 14px, letter-spacing 0.2em
                 opacity: 0 → 0.6 (duration: 0.6s, delay: 0.3s)

일기 엔트리 등장 패턴 (각 엔트리 반복):
  뷰포트 하단 30% 도달 시 트리거 (IntersectionObserver amount: 0.3)

  텍스트 블록:
    opacity: 0 → 1 (duration: 0.8s)
    translateY: 40px → 0
    ease: cubic-bezier(0.22, 1, 0.36, 1)

  이미지:
    opacity: 0 → 1 (duration: 0.6s)
    scale: 1.05 → 1.0 (미세 줌아웃, 체류감)
    parallax: translateY 속도 0.15 (배경보다 느리게)

  날짜 표시:
    typewriter 효과 없음. 정적 텍스트.
    font: Noto Sans KR, 12px, rgba(61,90,86,0.5)

호버 인터랙션:
  이미지 위 호버 시:
    scale: 1.0 → 1.02 (duration: 0.4s)
    cursor: default (링크 아님, 관찰 대상)

  텍스트 블록: 호버 인터랙션 없음
```

**모바일 적응 (< 768px)**
```
레이아웃: 단일 컬럼
이미지: 풀블리드 (좌우 패딩 0, 상하 24px)
텍스트: 좌측 정렬, 패딩 24px
일기 엔트리: 수직 스택 (이미지 → 날짜 → 본문)
parallax: 비활성화 (터치 스크롤 관성과 충돌 방지)
이미지 해상도: 720p WebP
엔트리 수: 4개 → 3개로 축소 (스크롤 피로 방지)
```

---

### 2-2. Data Archive (해저 데이터 시각화)

**콘셉트:** "공학적으로 설계된 예술품"의 증거. 원시 그래프가 아닌, 미니멀 기하학 파동 애니메이션으로 데이터를 감각화한다.

**와이어프레임 — 데스크톱**
```
┌─────────────────────────────────────────────────────────────────┐
│  [배경: 짙은 네이비 #1A365D → 심해 톤]                            │
│                                                                 │
│           D A T A   A R C H I V E                              │
│           바다의 맥박                                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐       │
│  │                                                     │       │
│  │   [기하학 파동 애니메이션 — 전체 너비]                  │       │
│  │                                                     │       │
│  │   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~      │       │
│  │     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~        │       │
│  │       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~          │       │
│  │                                                     │       │
│  │   수온 4.2°C        압력 6.1 atm        해류 0.3 m/s │       │
│  │   [호버: 해당 파동 라인 하이라이트]                     │       │
│  │                                                     │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  col 2~6                          col 7~11                      │
│  ┌──────────────┐               ┌──────────────────┐           │
│  │ 수온 변화     │               │ "바다는 매일      │           │
│  │ ─────────    │               │  다른 손길로       │           │
│  │ Jan  Feb  Mar │               │  병을 어루만진다." │           │
│  │ 3.8  4.2  5.1 │               │                  │           │
│  └──────────────┘               └──────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**스크롤 트리거 및 인터랙션**

```
배경 전환 (S2 → S3 경계):
  배경색: #EFDFBB → #1A365D (스크롤 80vh 구간에 걸쳐 전환)
  텍스트색: #3D5A56 → #F8F9F9 (동기 전환)
  한지 텍스처: opacity 0.15 → 0

섹션 진입:
  progress 0.00  "DATA ARCHIVE" 타이틀
                 color: #A7C7C0 (Bottle Teal)
                 opacity: 0 → 1 (duration: 0.8s)
                 letter-spacing: 0.3em → 0.2em (미세 수축, 집중감)

  progress 0.05  "바다의 맥박" 서브타이틀
                 color: rgba(248,249,249,0.6)
                 opacity: 0 → 1 (duration: 0.6s)

기하학 파동 애니메이션:
  progress 0.10  첫 번째 파동 라인 draw (왼쪽 → 오른쪽)
                 SVG path stroke-dashoffset 애니메이션
                 duration: 1.2s, ease: easeInOut
                 stroke: rgba(167, 199, 192, 0.4)

  progress 0.15  두 번째 파동 라인 draw (0.15s 딜레이)
                 stroke: rgba(167, 199, 192, 0.25)

  progress 0.20  세 번째 파동 라인 draw (0.15s 딜레이)
                 stroke: rgba(167, 199, 192, 0.15)

  파동 라인 특성:
    각 라인 = 실제 해저 데이터 (수온/압력/해류)를 기하학적으로 변환
    amplitude: 스크롤 진행도에 비례하여 미세 변동 (breathing 효과)
    frequency: 0.8Hz 기본, 스크롤 속도와 약한 커플링
    stroke-width: 1.5px (데스크톱), 1px (모바일)

데이터 수치 카운터:
  progress 0.30  수온/압력/해류 수치 카운팅 시작
                 0 → target 값 (duration: 2.0s, ease: easeOut)
                 font: Cormorant Garamond, 36px, weight 300
                 단위: Noto Sans KR, 14px, rgba(248,249,249,0.5)

호버 인터랙션 (데스크톱):
  데이터 수치 영역 호버:
    해당 파동 라인 stroke opacity 0.4 → 0.8 (duration: 0.3s)
    나머지 라인 opacity → 0.1 (포커스 효과)
    수치 아래 작은 스파크라인(48px 높이) 등장 (duration: 0.4s)
    tooltip 없음 — 데이터는 장식이 아닌 증거지만, 과잉 설명 금지

하단 보조 영역:
  progress 0.50  좌측: 미니 차트 (3개월 수온 변화 — 정적, 호버로 값 확인)
                 우측: 감성 카피 (fade-in, duration: 0.8s)
                 두 블록은 비대칭 레이아웃 (col 2~6 + col 7~11)
```

**모바일 적응 (< 768px)**
```
레이아웃: 단일 컬럼
파동 애니메이션: 3개 라인 → 2개 라인 (GPU 부담 경감)
수치 카운터: 수평 3열 → 수직 스택 (각 수치 사이 가는 구분선)
호버 인터랙션: 탭으로 대체 (탭 시 해당 라인 하이라이트, 재탭 시 해제)
미니 차트: 숨김 (모바일에서 불필요한 정보 밀도 제거)
감성 카피: 전체 너비, 중앙 정렬
파동 stroke-width: 1px
navigator.hardwareConcurrency < 4 시: 파동 애니메이션 → 정적 SVG
```

---

### 2-3. The Maker (만든 이의 아카이브)

**콘셉트:** 셀렉션한 샴페인 생산자와 한국 바다에서 숙성하는 팀의 이야기를 "만든 이의 편지" 형식으로 전달. 사진과 글로 존재감을 드러낸다.

**와이어프레임 — 데스크톱**
```
┌─────────────────────────────────────────────────────────────────┐
│  [배경: #EFDFBB 모래색 복귀, 한지 텍스처 복원]                     │
│                                                                 │
│  col 2~5                                                        │
│  T H E   M A K E R                                             │
│  만든 이                                                         │
│                                                                 │
│  col 2~5                         col 7~11                       │
│  ┌──────────────┐               ┌──────────────────┐           │
│  │              │               │                  │           │
│  │  [사진       │               │ "좋은 샴페인을     │           │
│  │   — 생산자,   │               │  찾았고,           │           │
│  │   숙성 과정,  │               │  바다가 나머지를    │           │
│  │   또는 해안]  │               │  완성했습니다."     │           │
│  │              │               │                  │           │
│  │  [필름 그레인  │               │  ── (구분선)       │           │
│  │   + 약간의    │               │                  │           │
│  │   비네팅]     │               │  [생산자 소개]      │           │
│  │              │               │                  │           │
│  └──────────────┘               │  [숙성 팀 소개]     │           │
│                                 │                  │           │
│                                 │                  │           │
│                                 │                  │           │
│                                 │  ── (구분선)       │           │
│                                 │                  │           │
│                                 │  [편지 본문 — 2~3  │           │
│                                 │   단락, 짧고       │           │
│                                 │   담백하게]         │           │
│                                 └──────────────────┘           │
│                                                                 │
│  col 3~10                                                       │
│  "이 병은 설계되었습니다. 그리고 바다에게 맡겨졌습니다."              │
│  [풀너비 인용문 — Cormorant Garamond italic, 큰 타입]              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**스크롤 트리거 및 인터랙션**

```
섹션 진입:
  progress 0.00  구분선(section-divider) draw animation
                 scaleX: 0 → 1 (duration: 1.2s, ease: easeInOut)
                 origin: left center

  progress 0.05  "THE MAKER" 타이틀 fade-in
                 opacity: 0 → 1, translateY: 30px → 0
                 duration: 0.8s

  progress 0.08  "만든 이" 서브타이틀
                 opacity: 0 → 0.6, duration: 0.6s

좌측 이미지:
  progress 0.12  이미지 fade-in + 미세 scale
                 opacity: 0 → 1, scale: 0.97 → 1.0
                 duration: 0.8s, ease: easeOutExpo
                 이미지에 CSS filter: grayscale(0.9) saturate(0.3)
                 필름 그레인 오버레이: mix-blend-mode: overlay, opacity 0.3

우측 텍스트:
  progress 0.15  인용문 첫 줄 fade-in
                 opacity: 0 → 1, translateY: 24px → 0
                 duration: 0.8s
  progress 0.18  인용문 둘째 줄 (stagger delay: 0.12s)

  progress 0.25  구분선 draw (width: 40px)
  progress 0.28  약력 텍스트 fade-in (stagger: 각 줄 0.1s)
                 font: Noto Sans KR, 13px, weight 300
                 color: rgba(61,90,86,0.6)

  progress 0.40  두 번째 구분선
  progress 0.45  편지 본문 fade-in (단락 단위 stagger: 0.15s)
                 font: Noto Sans KR, 15px, line-height 1.9

하단 풀너비 인용문:
  progress 0.70  중앙 정렬 인용문
                 font: Cormorant Garamond, clamp(28px, 4vw, 48px), italic
                 opacity: 0 → 1 (duration: 1.0s)
                 이 문장은 섹션의 결론. 체류 시간 충분히 확보.

호버 인터랙션:
  이미지: 호버 시 grayscale 0.9 → 0.7 (duration: 0.4s) — 약간의 색 복원
  텍스트: 인터랙션 없음
```

**모바일 적응 (< 768px)**
```
레이아웃: 단일 컬럼 (이미지 → 인용문 → 약력 → 편지 → 하단 인용문)
이미지: 풀블리드, aspect-ratio 4:5
편지 본문: 좌측 정렬, 패딩 24px
하단 인용문: font-size clamp(24px, 6vw, 36px)
이미지 grayscale 호버: 비활성 (모바일에서 호버 없음)
```

---

### 2-4. Archive (컬렉션 라인업)

**콘셉트:** 5개 깊이 라인업을 유물처럼 전시한다. 상품 나열이 아닌 아카이브 열람 경험. 수평 스크롤 캐러셀로 깊이별 탐험 구현.

**와이어프레임 — 데스크톱 (sticky 수평 스크롤)**
```
┌─────────────────────────────────────────────────────────────────┐
│  [배경: #EFDFBB]                                                │
│                                                                 │
│  A R C H I V E                                                 │
│  기록 보관소                                       [1 / 5]       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                                                      │      │
│  │  col 1~5                   col 6~12                  │      │
│  │  ┌──────────────┐        ┌──────────────────┐       │      │
│  │  │              │        │ PREMIERE PROFONDEUR│       │      │
│  │  │  [제품 사진    │        │ 첫번째 깊이        │       │      │
│  │  │   — 병 + 해저  │        │                  │       │      │
│  │  │   오브제      │        │ 수심 15m           │       │      │
│  │  │   배치]       │        │ 숙성 12개월        │       │      │
│  │  │              │        │                  │       │      │
│  │  │              │        │ "빛이 아직 닿는     │       │      │
│  │  │              │        │  곳에서 첫 번째     │       │      │
│  │  │              │        │  변화가 시작된다."   │       │      │
│  │  │              │        │                  │       │      │
│  │  └──────────────┘        │ ── 구분선 ──       │       │      │
│  │                          │                  │       │      │
│  │                          │ [Aging Certificate]│       │      │
│  │                          │ [QR Code 미리보기]  │       │      │
│  │                          │                  │       │      │
│  │                          │ 발견하기 →          │       │      │
│  │                          └──────────────────┘       │      │
│  │                                                      │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  ● ○ ○ ○ ○  (깊이 인디케이터 — 하단 중앙)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**스크롤 트리거 및 인터랙션**

```
섹션 진입:
  progress 0.00  "ARCHIVE" + "기록 보관소" 타이틀 fade-in
                 동일 패턴: opacity 0→1, translateY 30→0, duration 0.8s

수평 스크롤 메커니즘:
  sticky pin 활성화 (start: "top top", end: "+=300%")
  수직 스크롤 → 수평 translateX 매핑
  5개 카드 × 화면 너비 = 총 500vw 수평 이동
  scrub: 1.0 (스크롤과 수평 이동 간 부드러운 동기)

각 카드 등장 패턴 (수평 진입 시):
  제품 이미지:
    opacity: 0 → 1, scale: 0.95 → 1.0
    duration: 0.7s, ease: easeOutExpo

  텍스트 블록:
    stagger 등장 (제목 → 수심 → 카피 → 구분선 → 인증서 → CTA)
    각 요소 간 stagger: 0.1s
    duration: 0.6s per element

깊이 인디케이터:
  하단 중앙 5개 도트
  활성: #3D5A56, width 24px (가로 확장)
  비활성: rgba(61,90,86,0.25), width 8px
  전환: width + color (duration: 0.3s, ease)

카드별 배경 미세 변화:
  깊이 1 (15m):  배경 unchanged, 밝음
  깊이 2 (30m):  배경 brightness 0.95
  깊이 3 (50m):  배경 brightness 0.90
  깊이 4 (80m):  배경 brightness 0.85
  깊이 5 (120m): 배경 brightness 0.80, 틸 오버레이 opacity 0.05 추가
  → 깊이가 깊어질수록 시각적으로 어두워지는 간접 체험

Aging Certificate 미리보기:
  각 카드 우측 하단에 인증서 썸네일 (64 × 90px)
  호버 시: scale 1.0 → 1.5, shadow 추가 (duration: 0.4s)
  클릭/탭 시: 라이트박스 오버레이로 인증서 전체 표시
  라이트박스: backdrop-filter blur(20px), 중앙 정렬, ESC/외부 클릭으로 닫기

QR 코드:
  정적 표시 (16 × 16px 아이콘 크기)
  호버 시 툴팁: "각 병에 부여되는 고유 시리얼"
  font: Noto Sans KR, 12px

CTA "발견하기 →":
  텍스트 링크 전용 (버튼 형태 금지)
  font: Noto Sans KR, 13px, letter-spacing 0.1em
  color: #3D5A56, 하단 밑줄 1px
  호버: color → #C4956A, 밑줄 translateX 4px 이동 (duration: 0.3s)
  각 깊이의 상세 페이지로 연결
```

**모바일 적응 (< 768px)**
```
수평 스크롤 → 수직 카드 스택으로 전환
sticky pin 해제 (모바일에서 수평 스크롤은 직관적이지 않음)
카드: 풀너비, 수직 스크롤로 탐색
이미지: aspect-ratio 3:4, 풀블리드
텍스트: 이미지 아래 배치
인증서 미리보기: 탭으로 라이트박스
깊이 인디케이터: 우측 세로 도트로 전환 (position: fixed, right: 16px)
좌우 스와이프: 지원하되 필수 아님 (스크롤로 충분히 탐색 가능)
```

---

### 2-5. Ocean Circle (초대제 멤버십)

**콘셉트:** "가입"이 아닌 "초대". 뉴스레터가 아닌 멤버십. 바다의 원에 들어오는 특별한 경험.

**와이어프레임 — 데스크톱**
```
┌─────────────────────────────────────────────────────────────────┐
│  [배경: #EFDFBB → 점진적으로 어두워짐, 원형 비네팅]                  │
│                                                                 │
│                                                                 │
│              ┌─────────────────────────┐                       │
│              │                         │                       │
│              │    O C E A N            │                       │
│              │    C I R C L E          │                       │
│              │                         │                       │
│              │    바다의 원에            │                       │
│              │    들어오세요.            │                       │
│              │                         │                       │
│              │    ── (구분선) ──         │                       │
│              │                         │                       │
│              │    런칭 전 우선 구매권     │                       │
│              │    만든 이의 편지 (계절별)  │                       │
│              │    아카이브 선공개         │                       │
│              │                         │                       │
│              │    ── (구분선) ──         │                       │
│              │                         │                       │
│              │    [이메일 입력 필드]      │                       │
│              │    [이름 입력 필드]        │                       │
│              │                         │                       │
│              │    초대 요청하기 →         │                       │
│              │                         │                       │
│              └─────────────────────────┘                       │
│              [Glass Card — Ocean Glass 강조 변형]                │
│                                                                 │
│  "모든 초대는 검토 후 발송됩니다."                                  │
│  [하단 작은 텍스트, rgba(61,90,86,0.4)]                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**스크롤 트리거 및 인터랙션**

```
배경 전환 (S5 → S6 경계):
  원형 비네팅 — radial-gradient
    background: radial-gradient(
      ellipse at center,
      transparent 30%,
      rgba(26, 54, 93, 0.15) 70%,
      rgba(26, 54, 93, 0.3) 100%
    )
  opacity: 0 → 1 (스크롤 60vh 구간에 걸쳐)

섹션 진입:
  progress 0.00  Glass Card 프레임 등장
                 opacity: 0 → 1, scale: 0.95 → 1.0
                 duration: 0.8s, ease: easeOutExpo

  progress 0.10  "OCEAN CIRCLE" 타이틀 fade-in
                 Cormorant Garamond, clamp(36px, 5vw, 56px), weight 300
                 letter-spacing: 0.25em

  progress 0.15  "바다의 원에 들어오세요." 서브 카피
                 Noto Sans KR, 16px, weight 300
                 opacity: 0 → 1, duration: 0.8s

  progress 0.25  혜택 목록 stagger 등장
                 각 항목: opacity 0 → 1, translateX: -16px → 0
                 stagger: 0.12s, duration: 0.6s
                 항목 앞 미니 도트(4px, #A7C7C0)

  progress 0.40  입력 필드 등장
                 opacity: 0 → 1, translateY: 16px → 0
                 duration: 0.6s

  progress 0.50  CTA 텍스트 등장
                 opacity: 0 → 1, duration: 0.6s

입력 필드 인터랙션:
  스타일: Glass Card 내부 투명 입력
    background: rgba(248,249,249,0.2)
    border-bottom: 1px solid rgba(61,90,86,0.2)
    border-radius: 0 (밑줄 스타일)
    font: Noto Sans KR, 14px
    padding: 12px 0

  포커스 시:
    border-bottom-color: #A7C7C0 (duration: 0.3s)
    label 텍스트: translateY -20px, font-size 11px (float label)

  placeholder:
    이메일: "your@email.com"
    이름: "성함"
    color: rgba(61,90,86,0.3)

CTA "초대 요청하기 →":
  텍스트 링크 스타일 (버튼 형태 금지)
  font: Noto Sans KR, 14px, letter-spacing 0.08em
  color: #3D5A56
  밑줄: 1px solid, width 0 → 100% 애니메이션 (호버 시, duration: 0.3s)
  클릭 → 화살표 회전(90deg) + "감사합니다. 바다가 답할 것입니다." 메시지 전환
  메시지 전환: 입력 필드 fade-out (0.4s) → 감사 메시지 fade-in (0.6s)

하단 안내 텍스트:
  "모든 초대는 검토 후 발송됩니다."
  position: Glass Card 외부, 아래 24px
  font: Noto Sans KR, 12px, rgba(61,90,86,0.4)
  → 희소성 강화. "누구나 가입"이 아닌 "검토 후 초대" 뉘앙스.
```

**모바일 적응 (< 768px)**
```
Glass Card: 좌우 마진 16px (거의 풀너비)
타이틀: font-size clamp(28px, 7vw, 40px)
입력 필드: 풀너비
CTA: 중앙 정렬
비네팅 효과: 동일 유지 (모바일에서도 집중감 효과적)
키보드 팝업 시: 폼 영역 auto-scroll (viewport 확보)
```

---

### 2-6. For Professionals (B2B 전용)

**콘셉트:** 메인 감성 흐름과 분리. 파인다이닝/호텔/소믈리에 전용. 톤을 유지하되 목적 지향적으로.

**와이어프레임 — 데스크톱**
```
┌─────────────────────────────────────────────────────────────────┐
│  ──────── section-divider--ornament (중앙 로고 심볼) ────────     │
│                                                                 │
│  [배경: #EFDFBB, 비네팅 해제, 한지 텍스처 유지]                     │
│                                                                 │
│  col 2~6                                                        │
│  F O R                                                          │
│  P R O F E S S I O N A L S                                     │
│  전문가를 위한 공간                                               │
│                                                                 │
│  col 2~6                         col 7~11                       │
│  ┌──────────────┐               ┌──────────────────┐           │
│  │              │               │ 문의 양식         │           │
│  │ "파인다이닝과  │               │                  │           │
│  │  호텔의 테이블 │               │ 업종 [select]     │           │
│  │  위에서 바다의 │               │ 성함 [input]      │           │
│  │  시간이 열립   │               │ 이메일 [input]     │           │
│  │  니다."       │               │ 연락처 [input]     │           │
│  │              │               │ 메시지 [textarea]  │           │
│  │ ── 구분선 ──  │               │                  │           │
│  │              │               │ 문의하기 →         │           │
│  │ 디지털 세일즈  │               │                  │           │
│  │ 키트 다운로드  │               └──────────────────┘           │
│  │              │                                               │
│  │  룩북 PDF →   │                                               │
│  │  성분 분석서 → │                                               │
│  │  B2B 조건서 → │                                               │
│  │              │                                               │
│  └──────────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**스크롤 트리거 및 인터랙션**

```
섹션 진입:
  progress 0.00  ornament 구분선 draw (양방향 확장)
                 scaleX: 0 → 1, origin: center
                 duration: 1.0s, ease: easeInOut

  progress 0.05  "FOR PROFESSIONALS" 타이틀
                 font: Cormorant Garamond, clamp(24px, 3vw, 40px)
                 letter-spacing: 0.2em
                 opacity: 0 → 1, duration: 0.8s
                 "전문가를 위한 공간": Noto Sans KR, 13px

  progress 0.10  좌측 소개 텍스트 + 우측 폼 동시 fade-in
                 staggerChildren: 0.08s

좌측 — 소개 + 다운로드:
  소개 카피:
    font: Noto Sans KR, 15px, weight 300, line-height 1.9
    color: rgba(61,90,86,0.8)

  다운로드 링크:
    텍스트 링크 스타일, 각 항목 사이 간격 16px
    아이콘: 작은 PDF 심볼 (12px, inline)
    호버: translateX 4px + color #C4956A (duration: 0.3s)
    클릭: 즉시 PDF 다운로드 (새 탭 없음)

우측 — 문의 폼:
  업종 선택:
    <select> 드롭다운
    옵션: "파인다이닝", "호텔 / 리조트", "와인 바", "소믈리에", "기타"
    Glass Card 서브틀 스타일 적용

  입력 필드:
    Ocean Circle과 동일 스타일 (밑줄형, float label)
    validation: 실시간, 에러 시 밑줄 color → #C4956A (따뜻한 경고)
    에러 메시지: 필드 아래, 12px, 같은 색

  CTA "문의하기 →":
    텍스트 링크 (버튼 형태 금지)
    제출 성공 시: 폼 fade-out → "감사합니다. 영업일 기준 2일 내 회신드리겠습니다." fade-in
    제출 실패 시: 해당 필드 하이라이트 + 에러 메시지
```

**모바일 적응 (< 768px)**
```
레이아웃: 단일 컬럼 (소개 텍스트 → 다운로드 → 폼)
다운로드 링크: 풀너비 탭 가능 영역 (최소 터치 타깃 48px)
폼: 풀너비
업종 선택: 네이티브 <select> (OS 기본 피커 사용 — 커스텀 드롭다운 금지)
textarea: min-height 120px
```

---

## 3. 내비게이션 구조

### 3-1. 풀스크린 오버레이 메뉴

frontend-spec.md 섹션 4에 상세 스펙 정의 완료. UX 관점 보충:

```
메뉴 열기:
  [≡] 햄버거 클릭/탭
  → body scroll 잠금 (overflow: hidden)
  → 오버레이 fade-in (0.5s)
  → 메뉴 항목 stagger 등장 (0.05s 간격)
  → 포커스: 첫 번째 메뉴 항목으로 이동

메뉴 닫기:
  [X] 또는 ESC 키 또는 메뉴 항목 클릭
  → 메뉴 항목 stagger 퇴장 (역순, 0.03s 간격)
  → 오버레이 fade-out (0.4s)
  → body scroll 복원
  → 포커스: 햄버거 버튼으로 복원

메뉴 항목 클릭 시:
  해당 섹션으로 smooth scroll (Lenis)
  duration: 거리에 비례, 최소 0.8s ~ 최대 2.0s
  ease: cubic-bezier(0.22, 1, 0.36, 1)
  메뉴 자동 닫힘 (항목 클릭 후 0.3s 딜레이 → 닫기 시작)
```

**메뉴 항목 구조**

```
메인 내비게이션 (좌측):              컬렉션 큐베명 (우측, 은은하게):
  the void          → S1 (히어로)     surface murmur.
  observation        → S2 (관찰 일기)  quiet pressure.
  data archive       → S3 (데이터)    blind current.
  the maker          → S4 (만든 이)   still archive.
  archive            → S5 (컬렉션)    the bed.
  ocean circle       → S6 (멤버십)

  ─────────────────────────────
  for professionals  → S7 (B2B) — 구분선 아래 분리 배치

하단:
  [Instagram] [YouTube] [KakaoTalk]           KR / EN / FR

좌측 항목: 같은 페이지 내 섹션 앵커 스크롤 이동
우측 큐베명: Archive 섹션 내 해당 깊이로 딥링크 (호버 시 표시)
```

### 3-2. 활성 섹션 인디케이터

```
위치: 화면 우측 가장자리, 세로 중앙 (데스크톱 전용)
형태: 7개 세로 도트 + 활성 섹션명 텍스트

비활성 도트:
  width: 6px, height: 6px
  border-radius: 50%
  background: rgba(61,90,86,0.2)

활성 도트:
  width: 6px, height: 6px → width: 6px, height: 24px (세로 확장)
  border-radius: 3px
  background: #3D5A56
  transition: all 0.4s ease

활성 섹션명:
  도트 좌측 8px에 텍스트 표시
  font: Noto Sans KR, 10px, letter-spacing 0.1em
  color: rgba(61,90,86,0.5)
  opacity: 0 → 1 (활성 시)
  translateX: 8px → 0 (활성 시)

전환 기준:
  IntersectionObserver — 각 섹션 상단이 뷰포트 40% 지점 통과 시 활성 전환
  rootMargin: "-40% 0px -60% 0px"

"For Professionals" 도트:
  다른 도트와 8px 추가 간격으로 시각적 분리
  도트 색상: rgba(196,149,106,0.3) (따뜻한 톤으로 차별화)

모바일: 활성 섹션 인디케이터 숨김 (화면 공간 부족)
```

### 3-3. Back-to-Top

```
등장 조건: 스크롤 위치 > 200vh (S2 진입 이후)
위치: 우하단 (데스크톱), 하단 네비게이션 바 위 16px (모바일)
형태: 가는 원형 아웃라인 + 상향 화살표 (32px × 32px)
  border: 1px solid rgba(61,90,86,0.2)
  background: rgba(248,249,249,0.6)
  backdrop-filter: blur(8px)

등장: opacity 0 → 0.7, scale 0.8 → 1.0 (duration: 0.4s)
퇴장: opacity → 0 (200vh 이하로 돌아가면)

호버: opacity 0.7 → 1.0, border-color → rgba(61,90,86,0.4)
클릭: smooth scroll to top (Lenis, duration: 2.0s)

모바일: 탭 시 동일 동작. 하단 네비게이션 바와 겹치지 않도록 right: 16px, bottom: 80px + safe-area.
```

---

## 4. 모바일 UX 플로우

### 4-1. 터치 제스처 체계

```
수직 스와이프 (기본):
  전체 페이지 스크롤. Lenis smooth scroll 적용.
  passive: true 리스너로 성능 확보.
  overscroll-behavior: contain (페이지 이탈 방지)

수평 스와이프:
  Archive 섹션(S5) 카드 탐색 전용 (모바일에서는 수직 스택이므로 비활성)
  메뉴 오버레이에서는 수평 스와이프 무시 (메뉴 닫힘 방지)

탭:
  Data Archive 파동 라인 탭: 해당 데이터 하이라이트
  Archive 인증서 탭: 라이트박스
  모든 터치 타깃: 최소 48 × 48px (WCAG 2.5.5)

핀치줌:
  제한 없음. 사용자 에이전시 존중.
  단, 줌 상태에서도 레이아웃 깨짐 없도록 QA 필수.

풀투리프레시:
  overscroll-behavior-y: contain으로 방지 (단일 페이지 경험 보존)
```

### 4-2. 섹션별 모바일 간소화 정리

| 섹션 | 데스크톱 → 모바일 변경사항 |
|------|--------------------------|
| S1. Hero | 전환 구간 250vh (200vh → 확대). 영상 720p. |
| S2. Observation | 엔트리 4개→3개. parallax 해제. 단일 컬럼. |
| S3. Data Archive | 파동 3라인→2라인. 호버→탭. 미니차트 숨김. |
| S4. The Maker | 단일 컬럼. 이미지 grayscale 호버 해제. |
| S5. Archive | 수평 스크롤→수직 스택. sticky pin 해제. 깊이 인디케이터 우측 세로. |
| S6. Ocean Circle | Glass Card 거의 풀너비. 키보드 팝업 대응. |
| S7. For Professionals | 네이티브 select. 단일 컬럼. 터치 타깃 48px 확보. |

### 4-3. 모바일 성능 제약

```
총 JS 번들 (초기):
  목표: 90KB 이하 (gzipped)
  Three.js: 모바일 미포함 (WebGL Ripple → CSS gradient 대체)

이미지:
  모든 이미지 WebP, srcset 3단계 (1x/2x/3x)
  Archive 제품 이미지: lazy loading (loading="lazy")
  Hero poster: loading="eager", fetchpriority="high"

영상:
  모바일 720p 강제 (Connection API 또는 화면폭 기준)
  Save-Data 헤더 감지 시: 정적 poster 이미지 대체
  자동재생 차단 환경: poster + play 버튼

SVG 파동 (Data Archive):
  navigator.hardwareConcurrency < 4: 정적 SVG
  requestAnimationFrame 프레임 스킵: 30fps 캡 (모바일)

스크롤 애니메이션:
  will-change: transform, opacity 선제 적용
  composite-only 속성만 애니메이션 (transform, opacity)
  margin/padding/width/height 애니메이션 금지
```

### 4-4. 하단 내비게이션 바 (모바일 전용)

frontend-spec.md 섹션 6.1 참조. UX 보충:

```
표시 항목 (4개):
  void (home) | observe (story) | archive (coll) | circle (log)

"For Professionals"는 하단 바에서 제외 (B2B는 메인 플로우 분리 원칙)
접근 경로: 풀스크린 메뉴 또는 페이지 최하단 스크롤

활성 상태:
  IntersectionObserver 기반 현재 섹션 감지
  활성 아이콘: color #3D5A56
  비활성 아이콘: rgba(61,90,86,0.45)
  전환: color 0.3s ease

탭 시:
  해당 섹션으로 smooth scroll
  햅틱 피드백: light (10ms vibration)
  현재 위치와 동일 섹션 탭 시: scroll to section top

Hero(S1) 구간에서:
  하단 바 opacity 0 (몰입 보호)
  S2 진입 시 fade-in (duration: 0.4s)
```

---

## 5. 접근성 (a11y)

### 5-1. 키보드 내비게이션

```
Tab 순서 (논리적 흐름):
  1. 헤더 로고 (홈 링크)
  2. 햄버거 메뉴 버튼
  3. [메뉴 열림 시] 메뉴 내부 항목 (포커스 트랩)
  4. S1 Hero CTA "발견하기 →"
  5. S2 Observation — 탭 가능한 요소 없음 (순수 콘텐츠)
  6. S3 Data Archive — 탭 가능한 요소 없음
  7. S4 The Maker — 탭 가능한 요소 없음
  8. S5 Archive — 각 깊이의 "발견하기 →" 링크 (5개) + 인증서 버튼
  9. S6 Ocean Circle — 이메일 input → 이름 input → "초대 요청하기" 링크
  10. S7 For Professionals — 업종 select → 성함 → 이메일 → 연락처 → 메시지 → "문의하기" 링크 + PDF 링크 3개
  11. 푸터 링크

포커스 표시:
  모든 포커스 가능 요소:
    outline: 2px solid #A7C7C0
    outline-offset: 4px
    border-radius: inherit
  :focus-visible만 적용 (마우스 클릭 시 포커스 링 미표시)

Skip Link:
  페이지 최상단에 시각적으로 숨겨진 "본문으로 건너뛰기" 링크
  Tab 포커스 시 화면 상단에 노출
  target: #main-content (S1 시작점)
  background: #3D5A56, color: #F8F9F9, padding: 12px 24px
```

### 5-2. 스크린 리더 플로우

```html
<!-- 전체 구조 -->
<a href="#main-content" class="skip-link">본문으로 건너뛰기</a>

<header>
  <a href="/" aria-label="Muse de Maree 홈">MUSE DE MAREE</a>
  <button aria-expanded="false" aria-controls="nav-overlay" aria-label="메뉴 열기">
    <!-- hamburger -->
  </button>
</header>

<main id="main-content">

  <!-- S1: Hero — hero-flow.md 참조 -->
  <section aria-label="Muse de Maree 히어로" role="banner">...</section>

  <!-- S2: Observation -->
  <section aria-label="관찰 일기 — 브랜드 스토리">
    <h2>Observation — 관찰</h2>
    <article aria-label="2026년 1월 15일 관찰 기록">
      <time datetime="2026-01-15">2026년 1월 15일</time>
      <p>병이 바다에 들어간 첫째 날...</p>
      <img src="..." alt="해저 15미터, 샴페인 병이 해저면에 안착한 모습" />
    </article>
    <!-- 반복 -->
  </section>

  <!-- S3: Data Archive -->
  <section aria-label="해저 숙성 데이터 기록">
    <h2>Data Archive — 바다의 맥박</h2>
    <!-- 파동 애니메이션: 장식용 -->
    <div aria-hidden="true" role="presentation">
      <!-- SVG wave animation -->
    </div>
    <!-- 데이터 수치: 의미 있는 콘텐츠 -->
    <dl>
      <div>
        <dt>수온</dt>
        <dd>4.2°C</dd>
      </div>
      <div>
        <dt>압력</dt>
        <dd>6.1 atm</dd>
      </div>
      <div>
        <dt>해류 속도</dt>
        <dd>0.3 m/s</dd>
      </div>
    </dl>
  </section>

  <!-- S4: The Maker -->
  <section aria-label="만든 이의 아카이브">
    <h2>The Maker — 만든 이</h2>
    <blockquote>공학은 정밀함을 가르쳤고, 예술은 기다림을 가르쳤습니다.</blockquote>
    <img src="..." alt="작업실에서 샴페인 병을 검수하는 손 클로즈업" />
    <!-- 편지 본문 -->
  </section>

  <!-- S5: Archive -->
  <section aria-label="컬렉션 기록 보관소">
    <h2>Archive — 기록 보관소</h2>
    <ol aria-label="5개 깊이 컬렉션">
      <li aria-label="첫번째 깊이 — 수심 15미터">
        <h3>Premiere Profondeur — 첫번째 깊이</h3>
        <img src="..." alt="수심 15미터 숙성 샴페인 병과 인증서" />
        <p>수심 15m, 숙성 12개월</p>
        <a href="/archive/d15" aria-label="첫번째 깊이 상세 페이지">발견하기</a>
      </li>
      <!-- 4개 반복 -->
    </ol>
  </section>

  <!-- S6: Ocean Circle -->
  <section aria-label="Ocean Circle 초대제 멤버십">
    <h2>Ocean Circle — 바다의 원</h2>
    <p>바다의 원에 들어오세요.</p>
    <form aria-label="멤버십 초대 요청">
      <label for="oc-email">이메일</label>
      <input id="oc-email" type="email" required aria-required="true" />
      <label for="oc-name">이름</label>
      <input id="oc-name" type="text" required aria-required="true" />
      <button type="submit">초대 요청하기</button>
    </form>
  </section>

  <!-- S7: For Professionals -->
  <section aria-label="전문가를 위한 B2B 문의">
    <h2>For Professionals — 전문가를 위한 공간</h2>
    <div aria-label="디지털 세일즈 키트">
      <a href="/pdf/lookbook.pdf" download aria-label="룩북 PDF 다운로드">룩북 PDF</a>
      <a href="/pdf/analysis.pdf" download aria-label="성분 분석서 PDF 다운로드">성분 분석서</a>
      <a href="/pdf/b2b.pdf" download aria-label="B2B 조건서 PDF 다운로드">B2B 조건서</a>
    </div>
    <form aria-label="B2B 문의 양식">
      <!-- 폼 필드 with label -->
    </form>
  </section>

</main>

<footer>...</footer>
```

### 5-3. prefers-reduced-motion 대응

```css
@media (prefers-reduced-motion: reduce) {

  /* 전체 애니메이션 비활성화 */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.15s !important;  /* 완전 제거가 아닌 최소값 */
    scroll-behavior: auto !important;
  }

  /* Lenis smooth scroll 비활성화 */
  html { scroll-behavior: auto; }

  /* 섹션 간 전환: 즉각 크로스페이드 (0.15s) */

  /* S1 Hero → hero-flow.md prefers-reduced-motion 참조 */

  /* S2 Observation: parallax 해제, 모든 콘텐츠 즉각 표시 */
  .observation-entry { opacity: 1; transform: none; }

  /* S3 Data Archive: 파동 애니메이션 → 정적 SVG 표시 */
  .data-wave-animated { display: none; }
  .data-wave-static { display: block; }
  .data-counter { /* 카운팅 없이 최종값 즉시 표시 */ }

  /* S4 The Maker: 모든 fade-in → 즉각 표시 */

  /* S5 Archive: 수평 스크롤 → 정적 수직 스택 */
  .archive-carousel { display: none; }
  .archive-static-list { display: block; }

  /* S6 Ocean Circle: 비네팅 유지, 등장 애니메이션만 제거 */

  /* S7 For Professionals: 동일 */

  /* 배경 영상 → 정적 poster */
  video { display: none; }
  .video-poster { display: block; }

  /* WebGL Ripple 완전 비활성화 */
  canvas.ripple { display: none; }
}
```

**감소 모션 모드 사용자 경험 요약:**
- 모든 콘텐츠 즉각 표시 (순차 등장 없음)
- 스크롤 기반 진행도 애니메이션 → 위치 기반 즉각 전환
- 영상 → poster 이미지
- 파동 애니메이션 → 정적 SVG
- 기능 손실 없음. 모든 인터랙티브 요소(폼, 링크, 라이트박스) 정상 작동.

### 5-4. 포커스 관리

```
메뉴 오버레이:
  열림 시: 포커스 트랩 활성화 (Tab이 메뉴 내부에서만 순환)
  닫힘 시: 포커스 → 햄버거 버튼 복원

라이트박스 (인증서):
  열림 시: 포커스 → 라이트박스 닫기 버튼
  닫힘 시: 포커스 → 열기를 트리거한 요소로 복원

폼 제출 후:
  성공: 포커스 → 감사 메시지 (role="status", aria-live="polite")
  실패: 포커스 → 첫 번째 에러 필드

섹션 네비게이션 (메뉴 항목 클릭):
  스크롤 완료 후: 포커스 → 해당 섹션 <h2> (tabindex="-1"로 프로그래밍적 포커스)
```

### 5-5. 추가 접근성 요구사항

| 항목 | 기준 | 구현 |
|------|------|------|
| 색 대비 | WCAG AA (4.5:1) | 모든 텍스트/배경 조합 검증. 어두운 배경(S3) 텍스트 대비 특별 주의 |
| 색맹 대응 | 색만으로 정보 전달 금지 | 깊이 인디케이터: 색 + 크기 + 텍스트 라벨 병행 |
| 텍스트 크기 | 200% 확대 지원 | rem 단위 + clamp() 함수 조합. overflow 깨짐 QA |
| 터치 타깃 | 최소 48 × 48px | 모든 인터랙티브 요소 (링크, 버튼, 입력 필드) |
| 자동 재생 | 5초 이상 자동 진행 금지 예외 | 영상 루프: 배경 장식 aria-hidden="true". 카피 자동 진행: S1 전용, S2 이후 없음 |
| 언어 속성 | lang 명시 | 한국어 본문: lang="ko", 프랑스어 제목: lang="fr", 영어: lang="en" |

---

## 6. 전환율 터치포인트

### 6-1. 자연스러운 전환 발생 지점

압박하지 않는다. 사용자가 충분히 몰입한 후, 자발적으로 행동하도록 설계한다.

```
전환 지점 1 — S1 Hero CTA "발견하기 →"
  위치: Phase 2 심해 카피 3개 완료 후
  심리 상태: 브랜드 세계관에 첫 진입, 호기심 최고조
  목적: 다음 섹션(S2)으로의 자연 유도
  강도: 매우 약함 (텍스트 링크, 안내 수준)

전환 지점 2 — S5 Archive 각 깊이 "발견하기 →"
  위치: 각 컬렉션 카드 하단
  심리 상태: 제품에 대한 발견 욕구 형성 후
  목적: 제품 상세 페이지 진입
  강도: 약함 (텍스트 링크, 반복 배치이므로 자연스러움)

전환 지점 3 — S6 Ocean Circle "초대 요청하기 →"    ★ 핵심 전환
  위치: 전체 여정의 80% 지점 (감정 곡선 두 번째 피크)
  심리 상태: 브랜드에 대한 정서적 연결 완성, 소속 욕구 발생
  목적: 잠재 고객 DB 확보 (런칭 전 우선 구매권)
  강도: 중간 (입력 필드는 존재하되 강요하지 않음)
  설계 원칙:
    - "가입" 아닌 "초대 요청" → 사용자가 선택하는 것이 아닌, 요청하는 것
    - "검토 후 발송" 문구 → 희소성 강화
    - Glass Card 프레임 → 특별한 공간이라는 시각 신호
    - 비네팅 배경 → 집중감 강화 (화면 주변부 어두워짐)

전환 지점 4 — S7 For Professionals "문의하기 →"
  위치: 페이지 최하단
  심리 상태: B2B 담당자의 목적 지향적 방문
  목적: 비즈니스 문의 확보
  강도: 중간 (폼이지만, 전문가 대상이므로 직접적 허용)
```

### 6-2. Ocean Circle CTA 배치 논리

```
왜 S6 (전체 여정의 ~80% 지점)인가:

1. 감정 축적 완료
   S1(경이) → S2(공감) → S3(신뢰) → S4(친밀) → S5(소유욕)
   → 이 모든 감정이 축적된 후에야 "소속"이라는 행동이 자연스럽다.

2. 정보 충분
   브랜드 스토리, 데이터 근거, 만든 이의 신뢰, 제품 라인업을
   모두 확인한 사용자만이 이 지점에 도달한다.
   → 전환 품질 > 전환 수량

3. 위치적 호흡
   S5(Archive) 직후에 배치하여 제품 탐색의 여운이 남아 있을 때 제안.
   S7(B2B) 앞에 배치하여 개인 고객과 비즈니스 고객을 물리적으로 분리.

4. CTA 반복 금지
   Ocean Circle CTA는 S6에서 단 한 번만 노출.
   다른 섹션에 배너, 팝업, 플로팅 CTA 금지.
   → 콰이어트 럭셔리 원칙: 한 번 제안하고, 기다린다.
```

### 6-3. B2B 문의 플로우

```
진입 경로 (3가지):

1. 자연 스크롤: S6 → S7 순차 도달
   - 개인 고객이 호기심으로 볼 수 있으나, 업종 선택 필드가 자연 필터 역할

2. 내비게이션 메뉴: "for professionals" 직접 클릭
   - 메뉴에서 하단 분리 배치 (메인 항목과 시각적 구분)
   - 목적 의식 있는 방문자용

3. 외부 직접 링크: musedemaree.com/#professionals
   - 세일즈 키트, 명함, 이메일 시그니처에서 직접 연결
   - 해당 앵커로 바로 스크롤

문의 제출 후:
  1. 즉각 UI 피드백: 폼 → 감사 메시지 전환 (0.4s fade)
  2. 이메일 자동 발송: 문의 접수 확인 이메일 (즉시)
  3. 내부 알림: 슬랙/이메일로 영업팀 알림
  4. 응답 기한: "영업일 기준 2일 내 회신" (UI에 명시)

디지털 세일즈 키트:
  문의 없이도 PDF 다운로드 가능 (게이트 없음)
  → 럭셔리 원칙: 정보를 가두지 않는다. 자유롭게 열람할 수 있어야 한다.
  → 다운로드 이벤트는 PostHog로 추적 (전환 퍼널 분석용)

PDF 구성:
  1. 룩북 (제품 비주얼 + 브랜드 스토리) — 12~16p
  2. 성분 분석서 (공학적 데이터 + 테이스팅 노트) — 4~6p
  3. B2B 조건서 (MOQ, 가격, 납품 조건) — 2~4p
```

---

## 압력 체험 효과 (글로벌)

PLAN.md에 명시된 "스크롤 시 화면 선들이 미세하게 눌리거나 왜곡"되는 압력 체험 효과의 UX 명세.

```
적용 범위: S2 ~ S5 (Observation ~ Archive 구간)
비적용: S1 (Hero 고유 전환 체계), S6~S7 (폼 영역, 입력 정확도 보존)

구현 방식:
  섹션 구분선(section-divider)과 텍스트 블록에 미세한 왜곡 적용
  스크롤 속도에 비례하여 skewY(0 ~ 0.5deg) + scaleY(1.0 ~ 0.998) 적용
  CSS transform만 사용 (reflow 유발 금지)
  transition: transform 0.1s ease-out (즉각 반응, 부드러운 해제)

체감 강도:
  의식적으로 인지하면 안 된다. 무의식적 불편함 = 압력의 간접 체험.
  최대 skew: 0.5deg (이 이상은 시각적으로 눈에 띄어 럭셔리 훼손)
  최대 scaleY: 0.998 (2px 이하 수축)

prefers-reduced-motion: 비활성화 (motion 관련이므로)
모바일: 동일 적용 (터치 스크롤 속도 기반)
```

---

## 성공 기준

### 기술 성능 KPI (전체 페이지)

| 지표 | 목표값 | 비고 |
|------|--------|------|
| LCP | ≤ 2.0s | Hero poster 기준 |
| CLS | ≤ 0.05 | 전 섹션 레이아웃 안정 |
| INP | ≤ 150ms | 메뉴, 폼, 캐러셀 반응성 |
| 프레임레이트 | 60fps | 스크롤 + 애니메이션 동시 |
| 총 페이지 무게 | ≤ 5MB (초기) | 영상 제외, 이미지 + JS + CSS |
| First Load JS | ≤ 90KB (gzip) | Three.js 제외 |

### 사용자 행동 KPI

| 지표 | 목표값 | 측정 |
|------|--------|------|
| 스크롤 깊이 50% 도달률 | ≥ 40% | S4 (The Maker) 진입 비율 |
| 스크롤 깊이 80% 도달률 | ≥ 20% | S6 (Ocean Circle) 진입 비율 |
| Ocean Circle 전환율 | ≥ 5% | S6 도달자 중 제출 비율 |
| B2B 문의 전환율 | ≥ 15% | S7 도달자 중 제출 비율 |
| PDF 다운로드 | 추적만 | 전환 퍼널 보조 지표 |
| 평균 체류 시간 | ≥ 3분 | 몰입도 간접 지표 |

### 접근성 기준

```
□ WCAG 2.1 AA 전체 통과 (axe-core 자동 검사)
□ prefers-reduced-motion: reduce 환경에서 모든 기능 정상 작동
□ 키보드만으로 모든 인터랙티브 요소 도달 가능
□ 스크린 리더(VoiceOver, NVDA)에서 논리적 콘텐츠 순서 보장
□ 색 대비 AA (4.5:1) 모든 텍스트 조합
□ 터치 타깃 48 × 48px 이상
□ lang 속성 올바르게 적용 (ko, fr, en)
```

---

## 부록 — 의존성 및 팀 간 협업 포인트

| 항목 | 관련 팀 | 요청 내용 |
|------|---------|----------|
| S2 관찰 일기 이미지 (3~4장) | `07-creative-photo-team` | 필름 그레인 처리된 해저 풍경 (4K, 가로/세로 혼합) |
| S2 관찰 일기 카피 | `04-copywriting-team` | 3~4개 날짜별 일기 엔트리, 각 30자 이내 |
| S3 데이터 원본 | 사업팀 / 해양팀 | 실제 수온/압력/해류 로깅 데이터 (최소 3개월분) |
| S3 감성 카피 | `04-copywriting-team` | 데이터 영역 보조 카피 1문장 |
| S4 CEO 사진 | `07-creative-photo-team` | 흑백, 작업실/해안 촬영 (인물 얼굴 미포함 가능) |
| S4 만든 이의 편지 | CEO 직접 작성 또는 `04-copywriting-team` | 2~3단락, 담백한 어조 |
| S5 제품 사진 (5개 깊이) | `07-creative-photo-team` | 각 깊이별 병 + 오브제 배치 (4K, 동일 구도) |
| S5 인증서/QR 디자인 | `02-design-team` | Underwater Aging Certificate 샘플 + QR 코드 비주얼 |
| S5 컬렉션 카피 | `04-copywriting-team` | 각 깊이별 설명 카피, 각 20자 이내 |
| S6 Ocean Circle 백엔드 | `01-frontend-team` | 이메일 수집 API, 확인 이메일 발송 시스템 |
| S7 PDF 세일즈 키트 | `05-marketing-team` + `02-design-team` | 룩북, 성분 분석서, B2B 조건서 PDF 제작 |
| S7 문의 폼 백엔드 | `01-frontend-team` | 문의 접수 API, 알림 시스템 |
| 전체 색상 토큰 | `02-design-team` | #1A365D (네이비) 등 S3 전용 팔레트 확장 승인 |
| 한지 텍스처 에셋 | `02-design-team` | 배경용 한지 질감 텍스처 (tileable, 2K 해상도) |
| 브랜드 기준 검토 | `00-luxury-branding-team` | 본 문서 전체 승인 요청 |

---

> 다음 단계: 브랜딩팀 검토 → 승인 후 `02-design-team` 전체 페이지 시각 목업 → `01-frontend-team` 프로토타입 구현
