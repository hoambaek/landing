# 뮤즈드마레 홈페이지 리스트럭처링 플랜

> 기반 문서: `muse_de_maree_website_restructuring.docx` (2026.03.21)
> 핵심 진단: "아름답지만 설득하지 못하는 구조" → 감성 → 근거 → 욕망 → 행동 흐름 설계

---

## 목표 구조

```
01. Hero (카피 개선)
02. Observation + Sea Log 시각적 통합 (카피 개선)
03. The Tasting ★신규 — 관능적 차이
04. Collection (카피 보강 + CTA 추가)
05. de key ★신규 — NFC 프로비넌스 (기존 NfcSection 리뉴얼)
06. The Maker (서사 강화 + Nº2 삭제)
07. Origin ★신규 — 브랜드 탄생
08. Ocean Cellar 멤버십 (카피 개선 + CTA 강화)
09. Partnership (카피 개선 + CTA 강화)
```

---

## 섹션별 작업 상세

### 01. Hero — 카피 교체
- 파일: `HeroSection.tsx`
- 현재: `두 개의 떼루아` / `한국 바다가 숙성한 샴페인`
- 변경: `두 개의 떼루아, 하나의 샴페인.` / `샹파뉴에서 태어나, 한국의 바다에서 완성됩니다.`

### 02. Observation + Sea Log — 카피 개선 + 시각적 연결
- 파일: `ObservationSection.tsx`, `DataArchiveSection.tsx`
- Observation 카피: `수심 50미터. 빛이 사라진 곳에서 숙성이 시작됩니다.` + 실측값을 카피에 녹임
- 브릿지 문장: `이 조건들은 상상이 아닙니다. 지금 이 순간에도 측정되고 있습니다.`
- Sea Log는 별도 컴포넌트 유지 (Supabase 서버 컴포넌트), 시각적 경계만 제거

### 03. The Tasting ★신규
- 파일: 새로 생성 `TastingSection.tsx`
- 카피: `the tasting.` / `첫 모금에서 다릅니다.` + 기포/산미/질감 묘사
- CTA: `[테이스팅 예약하기]`
- 이미지: placeholder (에셋 미확보)

### 04. Collection — 카피 보강 + CTA
- 파일: `ArchiveSection.tsx`
- 서브타이틀: `여섯 개의 큐베, 하나의 바다. 같은 해저에서 시작하지만, 도착하는 깊이가 다릅니다.`
- 각 큐베 서사적 설명 추가 (문서 참조)
- 하단 CTA: `[컬렉션 문의하기]` `[Ocean Cellar 멤버십으로 우선 예약하기]`

### 05. de key ★신규 (NfcSection 리뉴얼)
- 파일: `NfcSection.tsx` 리뉴얼
- 타이틀: `de key.` / `모든 병에는 바다의 기록이 담겨 있습니다.`
- NFC 태그 + 블록체인 프로비넌스 시각화
- 이미지: placeholder (에셋 미확보)

### 06. The Maker — 서사 강화 + Nº2 삭제
- 파일: `TheMakerSection.tsx`
- 서브타이틀: `바다에 맡길 수 있는 샴페인은 많지 않습니다.`
- Mignon Boulard: 서사적 스토리텔링으로 교체
- **Nº 2 "To Be Announced" 삭제**

### 07. Origin ★신규
- 파일: 새로 생성 `OriginSection.tsx`
- 카피: `origin.` / `뮤즈드마레는 하나의 질문에서 시작되었습니다.`
- 이미지: placeholder (에셋 미확보)

### 08. Ocean Cellar 멤버십 — 카피 개선
- 파일: `OceanCircleSection.tsx`
- 서브타이틀: `바다 아래, 당신의 셀러.`
- CTA: `Ocean Cellar 초대 신청하기`

### 09. Partnership — 카피 개선
- 파일: `ProfessionalsSection.tsx`
- 서브타이틀: `이 샴페인이 열리는 순간을 함께 만들 공간을 찾습니다.`
- 추가: `뮤즈드마레는 유통하지 않습니다. 경험을 설계할 수 있는 공간과만 함께합니다.`
- CTA: `브랜드 소개서 다운로드`

---

## 필요 에셋

| 섹션 | 필요 에셋 | 상태 |
|------|----------|------|
| The Tasting | 샴페인 클로즈업 / 기포 이미지 | ❌ placeholder |
| de key | NFC 태그 탭 장면 / 앱 화면 | ❌ placeholder |
| Origin | 브랜드 관련 이미지 | ❌ placeholder |

## 최종 page.tsx

```tsx
<HeroSection />
<ObservationSection />
<DataArchiveSection />
<TastingSection />          // ★신규
<ArchiveSection />
<NfcSection />              // de key 리뉴얼
<TheMakerSection />
<OriginSection />           // ★신규
<OceanCircleSection />
<ProfessionalsSection />
```

## 디자인 원칙
- 프론트엔드디자인 스킬로 모든 디자인 작업
- 완료 후 ui-ux-pro-max 스킬로 최종 점검
- 콰이어트 럭셔리 톤 유지
- 데스크탑/모바일 분리 설계
