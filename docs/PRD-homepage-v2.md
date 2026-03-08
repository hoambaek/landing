# PRD: Muse de Maree Homepage v2

**Version**: 2.0
**Date**: 2026-03-07
**Status**: CEO Review Draft
**Previous**: `teams/00-luxury-branding-team/final-homepage-plan.md` (v1, 2026-02-22)
**References**: `docs/reports/pre-mortem-homepage.md`, `docs/reports/positioning-strategy-analysis.md`

---

## 1. Summary

Muse de Maree 홈페이지를 "완성된 메종의 전시"에서 **"만들어지고 있는 역사의 고요한 기록"**으로 재기획한다. 기존 7섹션 단일 페이지 스크롤 구조와 콰이어트 럭셔리 원칙은 유지하되, Pre-mortem에서 도출된 9개 리스크를 해소하고 "Progressive Quiet Luxury" 포지셔닝을 반영한다. 핵심 변경은 (1) 정적 데이터 전시 → 살아있는 해저 데이터, (2) 1회성 방문 → 재방문 동기 설계, (3) 비현실적 스코프 → MVP/Phase 2 분리이다.

---

## 2. Contacts

| Name | Role | Responsibility |
|------|------|---------------|
| CEO | 최종 의사결정자 | 기획 승인, 해저 데이터 원본 확보, CEO 편지 확정 |
| 럭셔리 브랜딩 총괄팀 | 브랜드 가디언 | 모든 산출물의 브랜드 기준 준수 검증 |
| 프론트엔드 개발 | 구현 | Next.js 16 + React 19 기반 개발 |
| 디자인팀 | 비주얼 | 컬러 토큰 확정, 비주얼 목업 |
| 카피팀 | 언어 | 카피 확정 (v1 승인 완료, Section 4 재작성 필요) |
| 마케팅팀 | 성장 | 트래픽 확보, 전환 추적, 채널 운영 |

---

## 3. Background

### 3.1 현재 상황

Muse de Maree는 프랑스 샹파뉴 샴페인을 한국 심해 60m에서 숙성시키는 세계 유일의 해저숙성 샴페인 브랜드다. 2026년 1월 입수 완료, 7-8월 인양 및 런칭 예정. 홈페이지는 3월 말 베타 오픈을 목표로 하며, 런칭 전 Ocean Circle(초대제 멤버십) 멤버 확보가 핵심 목표다.

### 3.2 v1 기획서의 문제점 (Pre-Mortem 결과)

v1 기획서(2026-02-22)는 5개 팀의 산출물 품질이 높았으나, Pre-mortem 분석에서 다음 구조적 문제가 발견되었다:

**Launch-Blocking Risks**:
1. 1850vh 스크롤 + 다중 애니메이션 라이브러리의 모바일 성능 붕괴 위험 (특히 Instagram 인앱 브라우저)
2. 컬러 토큰 미확정으로 개발 착수 불가

**해소된 리스크**:
- ~~해저 데이터 원본 미확보~~ → **1년치 이상 해저 데이터 확보 완료**, 10회 이상 해저숙성 테스트 실시
- ~~제품 실물 사진 부재~~ → **숙성 전 제품 사진 확보 완료**. 기존 숙성 병의 흔적을 AI 합성하여 숙성 후 이미지 생성 예정
- ~~개발 리소스 부족~~ → **AI 기반 개발로 리소스 제약 없음**

**Elephants (핵심 미언급 리스크)**:
1. 월 5,000명 트래픽 가정에 근거 없음
2. **"콰이어트 럭셔리 vs 스타트업 현실" 충돌** — 인지도 0에서 조용함은 무관심이 될 수 있음

### 3.3 포지셔닝 재정의: Progressive Quiet Luxury

v1의 문제는 "콰이어트 럭셔리를 버려야 하는가?"가 아니라, **"인지도 0 단계의 콰이어트 럭셔리는 어떤 모습이어야 하는가?"**였다.

| 기존 메종의 Quiet Luxury | Muse de Maree의 Progressive Quiet Luxury |
|-------------------------|----------------------------------------|
| 완성된 것의 침묵 | 만들어지고 있는 것의 고요한 기록 |
| 역사가 있으니 말할 필요 없음 | 역사가 없으니 과정을 투명하게 보여줌 |
| 홈페이지 = 완성된 갤러리 | 홈페이지 = 살아있는 아카이브 |
| 정적 콘텐츠 전시 | 시간에 따라 성장하는 기록 |
| 모든 채널에서 동일한 조용함 | 채널별 역할 분리 (홈페이지=증거, 외부=화제) |

**최종 Positioning Statement**:
> For 시간의 가치를 아는 컬렉터와 문화향유층에게,
> Muse de Maree is 세계 유일의 해저숙성 샴페인이다.
> Unlike 수백 년의 완성된 역사를 가진 기존 메종들과 달리,
> We 지금 이 순간 만들어지고 있는 역사를 기록하고, 그 기록을 조용히 공유한다.
> Because 바다가 증명하는 과정 자체가, 우리의 역사이자 예술이다.

---

## 4. Objective

### 4.1 목표

프리런칭 홈페이지를 통해 (1) 브랜드 세계관을 전달하고, (2) Ocean Circle 멤버를 확보하며, (3) B2B 리드를 수집한다. 동시에 "만들어지고 있는 역사"를 기록하는 살아있는 아카이브로서 재방문 동기를 설계한다.

### 4.2 Key Results (SMART)

| KR | 목표 | 기간 | 측정 방법 |
|----|------|------|-----------|
| KR1 | Ocean Circle 멤버 누적 300명 | 런칭 전 4개월 (4-7월) | Supabase DB count |
| KR2 | B2B 문의 누적 60건 | 런칭 전 4개월 | Supabase DB count |
| KR3 | 월 재방문율 25% | 베타 런칭 2개월 후 | PostHog cohort |
| KR4 | LCP < 2.5s, CLS < 0.05 모든 디바이스 | 베타 런칭 시점 | Vercel Web Analytics |
| KR5 | Instagram 인앱 브라우저 60fps 유지 | 베타 런칭 시점 | 수동 테스트 |

**v1 대비 변경**:
- Ocean Circle 목표를 1,200명 → **300명**으로 현실화 (보수적 트래픽 시나리오 반영)
- **재방문율 KR 신규 추가** (Progressive Quiet Luxury의 핵심 지표)
- LCP 기준을 2.0s → **2.5s**로 현실 조정 (130KB JS 예측 반영)

---

## 5. Market Segment(s)

### 5.1 Primary: "첫 번째 목격자" (The First Witness)

역사가 시작되는 순간에 함께하고 싶은 사람. 와인/위스키 컬렉터, 현대미술 초기 구매자, 크라우드펀딩 얼리 서포터 경험이 있는 40-50대. "100번째 고객"이 아닌 "첫 번째 목격자"라는 지위에 가치를 느낌.

**핵심 Job-to-be-Done**: "남들이 아직 모르는 가치 있는 것을 가장 먼저 발견하고 싶다."

### 5.2 Secondary: "지적 감성 소비자" (Engineered Poetry Lover)

과학 다큐멘터리와 현대미술을 동시에 소비하는 35-50대 문화향유층. 데이터와 감성이 교차하는 지점에 반응. 파인다이닝 경험을 중시하며 "왜 이것이 특별한지"를 이해하고 설명할 수 있는 사람.

**핵심 Job-to-be-Done**: "깊이 있는 경험을 발견하고, 그 깊이를 이해하고 싶다."

### 5.3 Tertiary: B2B 전문가

파인다이닝 F&B 디렉터, 호텔 바 매니저, 소믈리에. 고객 경험 차별화 소재를 찾고 있으며, 스토리텔링이 가능한 제품을 원함.

**핵심 Job-to-be-Done**: "고객에게 특별한 경험을 제공할 차별화된 제품을 찾고 싶다."

### 5.4 Constraints

- 주류 관련 법적 규제 준수 (연령 확인 등)
- 제품 숙성 전 사진 확보 완료. 숙성 후 이미지는 AI 합성으로 생성
- 마케팅 예산 제한 (유료 광고 최소화)

---

## 6. Value Proposition(s)

### 6.1 Value Curve: Muse de Maree vs 기존 메종

```
           Dom Perignon  Krug    Ruinart  Muse de Maree
역사         ■■■■■      ■■■■■   ■■■■■    □
유통망       ■■■■■      ■■■■    ■■■■     □
가격 인지도  ■■■■■      ■■■■■   ■■■■     □
과정 투명성  □          ■■      □        ■■■■■
데이터 증거  □          ■       □        ■■■■■
참여 가능성  □          □       □        ■■■■■
원산지 독창  ■■         ■■      ■■       ■■■■■
디지털 경험  ■■         ■■■     ■■       ■■■■■
```

### 6.2 핵심 Value Proposition

| Segment | Gain | Pain Avoided |
|---------|------|-------------|
| First Witness | "역사의 첫 페이지에 이름을 올린다" | 나중에 "그때 알았으면" 하는 후회 |
| Engineered Poetry | "숫자로 쓰인 시를 읽는 지적 경험" | 피상적 럭셔리 경험의 공허함 |
| B2B | "고객에게 설명할 스토리가 있는 제품" | 차별점 없는 와인 리스트 |

### 6.3 경쟁 우위 근거

1. **해저 숙성 데이터**: 1년치 이상의 실제 수온/압력/해류 로깅 데이터 + 10회 이상 숙성 테스트 실적 — 어떤 메종도 보유하지 않음
2. **이중 떼루아**: 프랑스 토양 + 한국 바다 — 물리적으로 유일한 조합
3. **역사의 시작점 참여**: 첫 빈티지의 첫 멤버 — 시간이 지나면 절대 재현 불가
4. **검증된 프로세스**: 10회 이상의 실제 해저숙성 테스트를 통해 공정 검증 완료 — "실험"이 아닌 "검증된 공학"

---

## 7. Solution

### 7.1 페이지 구조 (v1 유지, 스코프 조정)

```
MVP (Beta Launch)                    Phase 2 (Post-Launch)
─────────────────                    ────────────────────
1. The Void (Hero)     — 300vh       애니메이션 풀 구현
2. Observation         — 250vh       풀블리드 이미지 교차 배치
3. Living Data         — 200vh  ★    실시간 데이터 대시보드
4. The Maker           — 150vh       생산자 인터뷰 영상
5. Archive             — 300vh       인양 후 실물 사진 교체
6. Ocean Circle        — 150vh       멤버 전용 아카이브 레이어
7. For Professionals   — 100vh       세일즈 키트 자동 발송

   MVP 총 스크롤: ~1450vh            추가 기능 점진 적용
   (v1 대비 -400vh)
```

**스코프 축소 근거** (Pre-mortem E2 대응):
- Hero 400vh → 300vh: Phase 1(지상) 간소화, 수면 관통 전환에 집중
- Observation 350vh → 250vh: 일기 엔트리 4개 → 3개
- Data Archive 250vh → 200vh: 깊이선택기 제거 확정
- The Maker 200vh → 150vh: 정적 콘텐츠 중심
- Archive 400vh → 300vh: 수평 캐러셀 → 수직 카드 (MVP)
- 총 1850vh → **1450vh** (22% 감소)

---

### 7.2 섹션별 상세 — v1 대비 변경점 중심

#### Section 1: The Void (Hero) — 변경 최소

v1 확정 사항 유지. 3단 전환(지상→수면관통→심해), WebGL 제거 확정, CSS clip-path + GSAP ScrollTrigger.

**MVP 조정**:
- Phase 1(지상) 정적 이미지 1장 + "depth." 타이포로 간소화
- 수면 관통 전환: clip-path 단일 애니메이션 (v1의 200vh → 150vh)
- Phase 2(심해): 브랜딩 영상 미완성 시 **정적 비주얼 + 감각 카피 페이드인**으로 대체 (Pre-mortem T7 대응)

**확정 카피**: v1 유지
```
depth.

차갑다. 아무것도 없다.
기포 하나 올라간다.

더 깊이 →
```

---

#### Section 2: Observation — 변경 최소

v1 확정 사항 유지. 에디토리얼 매거진 레이아웃, 좌측 날짜 sticky + 우측 본문.

**MVP 조정**:
- 일기 엔트리 4개 → **3개** (마지막 "인양 전날" 엔트리는 실제 인양 후 Phase 2에서 추가)
- Parallax 효과: 데스크톱만 적용, 모바일 해제 (v1과 동일)

**확정 카피**: v1 유지 (3개 엔트리)

**v2 추가 — "Living Archive" 적용**:
- 엔트리 상단에 **"마지막 기록: 2026-03-07"** 타임스탬프 표시
- 월 1회 새로운 관찰 기록 추가 → 재방문 동기 (KR3 대응)
- 새 엔트리에 `NEW` 뱃지 없음 (콰이어트 럭셔리 위반). 대신 날짜순 정렬로 자연스럽게 최신 기록이 상단에 위치

---

#### Section 3: Living Data ★ (구 Data Archive) — 핵심 변경

**v1 → v2 변경**: "정적 데이터 시각화" → **"살아있는 해저 데이터"**

이것이 Progressive Quiet Luxury의 핵심 구현이다. 기존 메종은 숙성 과정을 블랙박스로 신비화한다. Muse de Maree는 과정을 투명하게 보여주되, 조용히 보여준다.

**구조**:
```
서브 헤드라인: "단순히 바다에 넣은 것이 아니다. 설계된 것이다."
본문 카피: v1 확정안 유지

─── 데이터 영역 ───

현재 상태 (Live)
  수온: 2.1°C          압력: 7.1 atm
  해류: 0.02 m/s       경과일: 47일째

마지막 업데이트: 2026-03-07 06:00 KST

─── 기하학 파동 (SVG) ───

3개 데이터 라인: 수온 / 압력 / 해류
호버 시 해당 라인 하이라이트 + 수치 표시
```

**데이터 소스**: 1년치 이상의 실제 해저 데이터 확보 완료 (10회 이상 숙성 테스트).

| 데이터 유형 | 상태 | 활용 |
|-----------|------|------|
| 과거 숙성 데이터 (1년+) | 확보 완료 | 기하학 파동 시각화의 실제 데이터 소스 |
| 현재 숙성 데이터 (2026.01~) | 축적 중 | Living Data "현재 상태" 표시 |
| 숙성 테스트 결과 (10회+) | 확보 완료 | Data Archive 신뢰 증거 |

**구현 방식**: Supabase `depth_data` 테이블에 확보된 데이터 import → ISR (revalidate: 3600)로 최신 레코드 표시. 현재 입수 중인 병의 경과일/수온/압력을 "현재 상태"로 노출.

**기술 구현**:
- Supabase `depth_data` 테이블에서 최신 레코드 fetch (ISR, revalidate: 3600)
- 실시간 연동이 아닌 **정기 업데이트** — 성능 부담 없음
- SVG 파동 3레이어: GSAP ScrollTrigger + stroke-dashoffset 드로잉 (v1과 동일)
- 깊이선택기 제거 확정 (v1 결정 유지)

**CTA**: "데이터를 탐색하다 →" → Phase 2에서 별도 `/data` 페이지로 연결

---

#### Section 4: The Maker — 변경: 카피 재작성 방향

v1에서 이미 결정된 방향 유지: CEO 개인 이력 중심 → 생산자/팀/프로세스 중심으로 전환.

**MVP 조정**:
- 영상 없이 **정적 콘텐츠** (사진 + 텍스트)
- CTA 없음 유지 — "편지에 버튼을 다는 것은 품위를 해친다" (v1 확정)

**v2 추가 — "Anti-Heritage" 적용**:
- 편지 톤을 "완성된 브랜드의 회고"가 아닌 **"시작하는 사람의 고백"**으로
- "우리에게는 아직 증명할 역사가 없습니다. 대신 바다가 지금 증명하고 있습니다."
- 이 톤이 기존 메종과의 근본적 차별점이 됨

---

#### Section 5: Archive (Collection) — 변경: MVP 간소화

**v1 → v2 변경**: 수평 스크롤 캐러셀 → **MVP에서 수직 카드 스택**

Pre-mortem T6 대응. 수평 스크롤 하이재킹은 사용성 리스크가 있으며, 개발 복잡도가 높다. MVP에서는 수직 카드 스택으로 구현하고, 사용성 테스트 후 Phase 2에서 수평 캐러셀 전환 여부를 결정한다.

**확정 5-depth 컬렉션**: v1 유지
```
20m  surface murmur.   수면 가까이. 빛이 닿는 마지막 깊이.
30m  quiet pressure.   빛이 사라지기 시작한다. 압력이 대화를 시작한다.
40m  blind current.    조류만이 움직인다. 눈을 감아도 같다.
50m  still archive.    모든 것이 느려진다. 시간이 퇴적된다.
60m  the bed.          바닥이다. 여기서 기다린 것만이 올라간다.
```

**제품 이미지 전략**:

| 요소 | MVP | Phase 2 (인양 후) |
|------|-----|-----------------|
| 제품 이미지 | 숙성 전 사진 + AI 합성 숙성 이미지 (기존 숙성 병의 흔적 합성) | 실제 인양 병 사진으로 교체 |
| 인증서 | 샘플 인증서 (시리얼 넘버 마스킹) | 실제 인증서 |
| 테이스팅 노트 | 과거 숙성 테스트 기반 참고 노트 | 실제 테이스팅 기록 |
| QR 코드 | 콘셉트 설명 + 데모 | 실제 QR 연동 |

**핵심 UX 결정**: 10회 이상의 실제 숙성 테스트 경험과 AI 합성 이미지를 활용하여 MVP부터 충분한 비주얼 완성도를 확보. 인양 후 실제 사진으로 자연스럽게 교체하며, 이 과정 자체가 "기록이 완성되어가는" Progressive Quiet Luxury 서사가 된다.

**CTA**: "발견하기 →" (v1 결정 유지)

---

#### Section 6: Ocean Circle — 변경: 프레이밍 강화

v1 구조/카피 유지하되, **"역사의 첫 페이지"** 프레이밍 추가.

**확정 카피** (v1 유지 + v2 추가):
```
바다의 원.

ocean circle은 가입이 아니다.
초대다.

런칭 이전, 첫 인양분에 대한
우선 구매의 기회가 열린다.

바다의 시간을 가장 먼저 만나는 자리.
수량이 정해져 있고, 자리도 정해져 있다.
```

**v2 추가 서브 카피** (폼 상단):
```
첫 번째 기록에 함께하세요.
```

이 한 문장이 "Anti-Heritage" 포지셔닝을 전달한다. "첫 번째"가 키워드 — 두 번째 빈티지부터는 이 문장을 쓸 수 없다. 지금만 가능한 초대.

**폼 필드**: v1 확정안 유지
```
이메일 (필수)
이름 (필수)
바다에 남길 한 문장 (선택)
개인정보 수집 동의 (필수)
```

**성공 메시지**: "감사합니다. 바다가 답할 것입니다." (v1 확정)

**전환율 목표 조정** (Pre-mortem T5 대응):

| 시나리오 | 월 트래픽 | 도달률 | 전환율 | 월 멤버 | 4개월 누적 |
|---------|---------|-------|-------|--------|-----------|
| 보수적 | 1,500명 | 25% | 3% | 11명 | 45명 |
| 기본 | 3,000명 | 28% | 5% | 42명 | 168명 |
| 낙관적 | 5,000명 | 31% | 8% | 124명 | 496명 |

**공식 목표**: 기본 시나리오 기준 **4개월 누적 150-300명**. v1의 1,200명은 비현실적 목표였다.

**법적 요구사항** (Pre-mortem T9):
- 개인정보처리방침 페이지 별도 구현 (`/privacy`)
- 마케팅 활용 동의와 개인정보 수집 동의 분리
- 법무 검토 마감: 프로토타입 착수 전

---

#### Section 7: For Professionals — 변경 최소

v1 확정 사항 유지.

**확정 카피/폼**: v1 유지
```
바다의 시간을 테이블 위에 놓는 일.

담당자명. 소속. 업종. 연락처. 문의 내용.
CTA: 문의하다 →
성공 메시지: 감사합니다. 영업일 기준 2일 내 회신드리겠습니다.
```

**세일즈 키트**: 게이트 없이 다운로드. MVP에서는 PDF 1종(Brand Lookbook)만 제공. Phase 2에서 Technical Analysis, B2B Terms Sheet 추가.

---

### 7.3 Navigation — v1 유지

v1 확정안 그대로 유지. 변경 없음.

```
MUSE DE MAREE                              [=]

  the void                          surface murmur.
  observation                       quiet pressure.
  living data                       blind current.    ← "data archive" → "living data"
  the maker                         still archive.
  archive                           the bed.
  ocean circle

  ─────────────────────────────────────────────
  for professionals
```

**유일한 변경**: 메뉴 라벨 "data archive" → "living data" (섹션명 변경 반영)

---

### 7.4 채널별 역할 분리 (Quiet Provocation 전략)

홈페이지의 콰이어트 럭셔리 원칙을 100% 유지하면서 인지도를 확보하기 위한 채널 전략.

| 채널 | 역할 | 톤 | 콘텐츠 예시 |
|------|------|-----|-----------|
| **Homepage** | 증거의 장소 | 콰이어트. CTA 최소, 배너/팝업 금지 | 기록, 데이터, 아카이브 |
| **Instagram** | 기록의 공유 | 절제되되 정기적. 주 2회 | "수온 2.1°C. 47일째." + 해저 텍스처 이미지 |
| **YouTube** | 과정의 다큐멘터리 | 롱폼. 2-3주 1회 | 해저 촬영, 생산자 인터뷰, 인양 준비 과정 |
| **PR** | 행위의 화제성 | 팩트 기반. 기자가 쓰고 싶은 이야기 | "한국 스타트업이 프랑스 샴페인을 바다 60m에 넣고 있다" |
| **Newsletter** | 아카이브의 확장 | 월 1-2회. Ocean Circle 멤버 전용 | 미공개 데이터, 비하인드, CEO 편지 |

**핵심 원칙**: 홈페이지는 절대 "소리 지르지 않는다". 외부 채널에서 "행위의 도발성"이 자연스럽게 화제를 만들고, 홈페이지는 찾아온 사람에게 고요한 증거를 제공한다.

---

### 7.5 Technology

**v1 Tech Stack 유지**:
- Next.js 16 + React 19 + TypeScript 5+
- Tailwind CSS 4
- Motion (Framer Motion) 12+ / GSAP 3.14+ / Lenis
- Supabase (PostgreSQL + Auth + RLS)
- Vercel (Edge Runtime)
- PostHog (Analytics)

**v2 추가 기술 요구사항**:

| 항목 | 구현 방식 | 우선순위 |
|------|----------|---------|
| Living Data fetch | 확보된 1년치+ 데이터 → Supabase `depth_data` import → ISR (revalidate: 3600) | MVP |
| 관찰 기록 CMS | Supabase `observation_entries` + Markdown | MVP |
| 컬러 토큰 분리 | CSS Custom Properties로 완전 분리 (Pre-mortem T3) | MVP |
| Instagram 인앱 성능 | 섹션별 lazy mount + IntersectionObserver | MVP |
| 정적 폴백 | prefers-reduced-motion + hardwareConcurrency < 4 감지 | MVP |

**성능 예산** (Pre-mortem T2 대응):

| 지표 | 목표 | 비고 |
|------|------|------|
| First Load JS | < 120KB | v1의 90KB는 비현실적. LazyMotion 필수 |
| LCP | < 2.5s | v1의 2.0s → 현실 조정 |
| CLS | < 0.05 | v1과 동일 |
| FPS (scroll) | 60fps | Instagram 인앱 포함 |
| Total Page Weight | < 2MB | 이미지 제외 |

**MVP 성능 전략**:
1. 섹션별 dynamic import + `ssr: false` (뷰포트 진입 전까지 로드 안 함)
2. 뷰포트 이탈 섹션 애니메이션 kill + GPU 메모리 해제
3. Framer Motion LazyMotion + domMax 필수 적용
4. 이미지: next/image + AVIF/WebP 자동 변환 + priority는 Hero만
5. 폰트: `font-display: swap` + 서브셋 (한글 사용 글자만)

---

### 7.6 Assumptions (검증 필요)

| # | 가정 | 검증 방법 | 마감 |
|---|------|----------|------|
| A1 | Instagram 인앱 브라우저에서 1450vh 스크롤이 안정적 | Hero 단독 프로토타입 벤치마크 | 3월 셋째주 |
| A2 | 월 1,500-3,000명 트래픽을 PR + Instagram으로 확보 가능 | 베타 런칭 후 2주 데이터 | 4월 중순 |
| A3 | "바다에 남길 한 문장" 필드가 전환율을 낮추지 않는다 | A/B 테스트 (필드 있음 vs 없음) | 5월 |
| A4 | AI 합성 숙성 이미지가 충분한 리얼리티를 갖는다 | 내부 리뷰 + 외부 5명 피드백 | 3월 말 |
| A5 | 컬러 토큰을 3월 중순까지 확정할 수 있다 | 디자인팀 마감 설정 | 3월 중순 |

---

## 8. Release

### 8.1 Phase 구분

#### MVP (Beta Launch) — 4주

```
Week 1: 인프라 + Hero + Navigation
  - Next.js 프로젝트 셋업, Supabase 연동, Vercel 배포
  - Hero 섹션 (정적 비주얼 + 카피 + 기본 스크롤 전환)
  - Navigation (풀스크린 오버레이 + 모바일 하단 탭)
  - 컬러 토큰 CSS 변수 체계 구축 (플레이스홀더 적용)

Week 2: Observation + Living Data + The Maker
  - Observation (에디토리얼 레이아웃 + 3개 엔트리 + sticky 날짜)
  - Living Data (Supabase fetch + SVG 파동 + 데이터 표시)
  - The Maker (정적 텍스트 + 이미지)
  - 섹션 간 디바이더

Week 3: Archive + Ocean Circle + For Professionals
  - Archive (수직 카드 스택 + 5-depth 정보)
  - Ocean Circle (폼 + Supabase 저장 + 성공 화면)
  - For Professionals (폼 + 세일즈 키트 다운로드)
  - 개인정보처리방침 페이지

Week 4: 통합 + 성능 + QA
  - 전체 섹션 통합 스크롤 테스트
  - 성능 최적화 (lazy mount, 코드 스플리팅)
  - Instagram 인앱 브라우저 테스트
  - 크로스 브라우저 테스트 (iOS Safari, Android Chrome)
  - PostHog 이벤트 추적 구현
  - 컬러 토큰 확정 후 교체
  - Beta launch
```

#### Phase 2 (Post-Launch, 점진적) — 런칭까지 3개월

| 항목 | 시기 | 트리거 |
|------|------|--------|
| Hero 브랜딩 영상 적용 | 영상 완성 후 | 영상팀 납품 |
| 수면 관통 전환 풀 애니메이션 | Beta 안정화 후 | 성능 여유 확인 |
| Archive 수평 스크롤 캐러셀 | 사용성 테스트 후 | 테스트 결과 긍정적 |
| 실제 제품 사진 교체 | 인양 후 | 7월 |
| 실제 테이스팅 노트 | 인양 후 | 7월 |
| Living Data 실시간 연동 | IoT 센서 확보 후 | 기술 준비 완료 |
| 다국어 (EN) | 해외 트래픽 10% 초과 시 | PostHog 데이터 |
| 멤버 전용 아카이브 레이어 | Ocean Circle 100명 돌파 시 | DB count |
| Observation 4번째 엔트리 추가 | 인양 시점 | "인양 전날" 기록 |
| A/B 테스트: "한 문장" 필드 | 충분한 트래픽 확보 후 | 월 3,000명 이상 |

### 8.2 Rollback Plan

MVP가 성능 목표를 충족하지 못할 경우:

| 단계 | 조치 | 트리거 |
|------|------|--------|
| Level 1 | 모든 스크롤 애니메이션을 CSS transition으로 교체 | FPS < 30 |
| Level 2 | GSAP/Framer Motion 제거, CSS-only | JS bundle > 200KB |
| Level 3 | 정적 HTML + CSS (애니메이션 전면 제거) | LCP > 4s |

---

## 9. v1 → v2 변경 요약

### 유지한 것 (v1의 강점)

- 7섹션 단일 페이지 스크롤 구조
- 콰이어트 럭셔리 원칙 (CTA 최소, 배너/팝업 금지, 가격 비공개)
- 카피팀 확정 카피 전체 (Section 2, 3, 5, 6, 7)
- UX팀 감정 곡선 설계
- 디자인팀 에디토리얼 미니멀리즘 원칙
- 프론트엔드 기술 스택 (Next.js 16 + React 19)
- WebGL 제거, 글래스모피즘 제거 확정
- 5-depth 컬렉션 체계 (20m~60m)
- Ocean Circle 폼 필드 통일안
- B2B 등급별 응답 기준

### 변경한 것

| 항목 | v1 | v2 | 근거 |
|------|-----|-----|------|
| **포지셔닝** | 완성된 메종처럼 행동 | Progressive Quiet Luxury — 진행형 기록 | E4 해소 |
| **Section 3** | 정적 데이터 시각화 | Living Data — 정기 업데이트 | Transparent Quiet |
| **시간관** | 정적 전시 | 시간에 따라 성장하는 아카이브 | Living Archive |
| **재방문 설계** | 없음 (1회성) | 월 1회 콘텐츠 업데이트 + 재방문율 KR | Anti-Heritage |
| **Section 4 톤** | 완성된 브랜드 회고 | 시작하는 사람의 고백 | Anti-Heritage |
| **Section 5 레이아웃** | 수평 스크롤 캐러셀 (MVP) | 수직 카드 스택 (MVP), 캐러셀은 Phase 2 | T6 리스크 |
| **Section 6 프레이밍** | 초대제 멤버십 | "첫 번째 기록에 함께하세요" 추가 | Anti-Heritage |
| **총 스크롤** | 1850vh | 1450vh | 성능 최적화 |
| **Ocean Circle 목표** | 1,200명 | 300명 (4개월) | E3 트래픽 현실 |
| **LCP 목표** | 2.0s | 2.5s | T2 성능 현실 |
| **채널 전략** | 전 채널 콰이어트 | 채널별 역할 분리 | Quiet Provocation |
| **제품 이미지** | 실물 필요 | 숙성 전 사진 + AI 합성 숙성 이미지 | 기존 숙성 테스트 활용 |
| **데이터** | 미확보 | 1년치+ 실제 해저 데이터 활용 | 10회+ 숙성 테스트 실적 |

### 삭제한 것

- 프론트엔드팀의 DepthSelector (깊이 선택 수직 슬라이더) — v1에서 이미 제거 결정
- 마케팅팀의 언어 위반 5건 — v1에서 이미 수정 요청
- 비현실적 목표 수치 (Ocean Circle 1,200명, LCP 2.0s, First Load JS 90KB)
- MVP 단계의 수평 스크롤 캐러셀

---

## 10. Go/No-Go Checklist (MVP Launch)

### Must Have (Launch-Blocking)

- [x] 해저 데이터 확보 (1년치+ 확보 완료)
- [ ] 확보된 데이터 Supabase import 및 Living Data 섹션 연동
- [ ] 컬러 토큰 확정 및 CSS 변수 적용
- [ ] AI 합성 숙성 이미지 생성 및 리뷰
- [ ] 개인정보처리방침 법무 검토 완료
- [ ] Instagram 인앱 브라우저 성능 테스트 통과 (60fps)
- [ ] 전체 섹션 통합 스크롤 테스트 통과
- [ ] Ocean Circle / B2B 폼 → Supabase 저장 검증
- [ ] PostHog 기본 이벤트 추적 구현

### Should Have (Fast-Follow)

- [ ] S2→S3 전환 구간 드롭오프 모니터링 설정
- [ ] 보수적 전환 시나리오 기반 멤버 확보 계획 수립
- [ ] Hero 브랜딩 영상 촬영 일정 확정
- [ ] CEO 편지 (Section 4) 최종본 확보

### Nice to Have (Track)

- [ ] 다국어 (EN) 준비
- [ ] 멤버 전용 아카이브 레이어 설계
- [ ] A/B 테스트 인프라 구축

---

*PRD v2 — Muse de Maree Homepage*
*2026-03-07 | AI Agent Analysis Based on Pre-Mortem + Positioning Strategy*
