# Paper 시안 → 코드 구현 체인지로그

> **작성일:** 2026-06-11
> **기준 플랜:** [`2026-06-10-paper-to-code-plan.md`](./2026-06-10-paper-to-code-plan.md)
> **소스 오브 트루스:** Paper 파일 "Muse de Marée" (Page 1) — 데스크톱 8섹션 + 모바일 8섹션 + 메뉴 오버레이
> **원칙:** Paper 스타일을 `get_computed_styles`/`get_jsx`로 정확값 추출 후 이식, 이미지는 Paper 에셋과 바이트 단위 매핑 검증

---

## 1. 전 섹션 구현 (Paper 01~08 → 1:1)

### Phase 1 — Header & 메뉴 오버레이
- 헤더 바: 패딩 `20px 48px`, 심볼 좌측 48px, 햄버거 우측 48px 3줄, 텍스트 로고 25px·심볼 37px(모바일 18/34)
- 메뉴 오버레이: 7항목 좌측 넘버링 내비(IBM Plex Mono 번호 + Cormorant 46px) + 심볼 워터마크 + 하단 `기록 · 남해…` 관측 라인 + KR/EN/FR
- 모바일 메뉴 오버레이 전용 레이아웃(Paper 1L5): 좌측 24px·라벨 30px·하단 라인
- `LIGHT_SECTIONS` = `archive`, `the-maker` (Partnership·Footer는 다크/라이트 별도 처리)
- 메뉴 전환 시 헤더 로고 위치·크기 고정(헤더 바 ↔ 오버레이 로고 동일 좌표)

### Phase 2 — 01 Hero (`HeroSection`)
- 정적 히어로(영상 상태머신 폐기): h3.webp(데스크톱)/h3_m2.webp(모바일) + Cool Shadow Grade + Hero Scrim
- H1: J1950, 데스크톱 3행 / 모바일 4행("지금 이 순간에도 / 한 병의 샴페인이 / 바다 아래에서 / 시간을 기록하고 있습니다")
- 브랜드 라인: 해저숙성 샴페인 + 뮤즈드마레(앰버)
- 모바일 상단 **프로스티드 블러**(`backdrop-filter: blur(15px)`, 다크 틴트 없음, 마스크 상단 30%→75% 페이드) — Lightning CSS 우회 위해 인라인 스타일 적용

### Phase 3 — 02 The Living Record (`TheLivingRecordSection`, `#data-archive`)
- 풀블리드 o3 + 도입 카피 3행 + **771 카운터**(시작일 2024-05-01 자동 계산, 0→타깃 카운팅, reduced-motion 폴백)
- 관측 로그: `기록 · 2026.06.10 KST · 수온 13.5°C · 해류 2.46 m/s · 수압 3.98 atm · 남해 34.1434°N · 126.5792°E`
- 데스크톱 높이 Paper 동일 `1196px`, 모바일 `100svh`

### Phase 4 — 03 The First Record (`TheFirstRecordSection`, `#the-first-record`)
- 연속 그라데이션(navy→중간조→warm-ivory) + Entry + 플레이트(데스크톱 4컷 / 모바일 3컷, rec01~04)
- 이미지 크기 축소: 440 / 312 / 580 / 580px (좌/우/중앙/중앙)
- 캡션 `기록 01~04` (다크 컷 화이트, 라이트 컷 earth), 커넥터는 REC03↔04 한 곳만
- 클로징 "병마다 다른 바다의 지문 / 같은 병은 없습니다" (ÉDITION ZÉRO 삭제)

### Phase 5 — 04 Collection (`ArchiveSection`, `#archive`)
- f2 히어로 + 인트로(2행) + 큐베 6카드(contain) + 기록 카드(증서 rotate 2° + NFC 심볼) + 하단 노트
- 시간 띠(바다에서 180일…) **삭제**
- 카드: 002 "24병 한정" 삭제, 000 SOLD OUT을 설명 맨 아래로, 003·004·005 설명 2행 줄바꿈
- 좌표 `34.1434°N · 126.5792°E`

### Phase 6 — 05 The Maker (`TheMakerSection`, `#the-maker`)
- 캐러셀 2슬라이드(‹›·스와이프·카운터): 슬라이드1 Mignon Boulard(이미지 좌+텍스트 우)
- 슬라이드2 = **coming soon** 카드(동일 레이아웃, "앞으로 해저 숙성에 어울리는 새로운 생산자를 차례로 소개합니다")

### Phase 7 — 06 Ocean Cellar Privé / 07 Partnership
- 풀블리드(c1/p1) + 편지형(좌하단 1링크 / 우하단 2링크) + 점 구분 태그 + 헤어라인 언더라인 링크
- 마침표 제거: "Ocean Cellar Privé" / "Partnership"

### Phase 8 — F Footer (`Footer`)
- 로고 락업 + 모토(Mrs Saint Delafield) + 앰버 헤어라인 + 내비 3열 + 법인 정보
- **라이트 테마**: 배경 `#C4BFBB` + 전경 다크(로고 brightness(0), 텍스트 earth 계열)
- 내비를 실제 `<a>` 링크로(각 섹션 앵커), **Contact 삭제**
- 이메일 강조(주소보다 진한 0.75, 동일 서체·크기) + `mailto:` 링크
- 사업자번호 `859-85-03139`
- 메뉴 오버레이도 배경 `#C4BFBB` 라이트 전환(골드는 `#8C6B33` 딥 브론즈로 대비 확보)

---

## 2. 카피 정비 (마침표 제거 / 콤마 유지)
The Living Record · First Record · Collection 인트로 · The Maker · Ocean Cellar · Partnership 전 문장 끝 마침표 제거. 중간 콤마는 유지.

## 3. 기술적 발견 / 함정
- **Turbopack 캐시**: 새 CSS 규칙 미반영 반복 → `rm -rf .next` 후 재시작 (lessons)
- **CSS specificity**: `.parent span { display:block }`가 토글 클래스를 덮음 → 셀렉터 결합
- **Lightning CSS(Tailwind4)**: raw CSS의 `backdrop-filter`를 컴파일 시 스트립 → React 인라인 스타일로 적용 (Header·HeroSection)

## 4. 에셋 정리
- 중복 본 `public/images/old/`로 이동, rec01~04 jpg→webp 변환
- 글리프 검사 유틸 `scripts/check-glyphs.mjs` (J1950 누락 글리프 방지)
- `@theme` 토큰 추가: `--color-main(#C4BFBB)`, `--font-motto`(Mrs Saint Delafield), `--font-delafield`

## 5. 검증
- 타입체크·ESLint·프로덕션 빌드 통과, 콘솔 에러 0
- Playwright 데스크톱 1440 + 모바일 390 전 섹션 Paper 대조

## 6. 서브 페이지 3종 (Paper Page 1M8/1N0/1O7 — 완료)
- `/invite`(초대 신청, 다크블루 #0A0D12) · `/partner`(파트너 문의, #F5F1E8) · `/brand-book`(브랜드 소개서, #E8E5E1)
- 편지형 560px 공용 셸(`LetterShell`) + `UnderlineField`(포커스 시 앰버) + 테마별 CSS 변수
- 제출 → Supabase insert(RLS `anon insert-only`). 테이블 `invitations`/`partner_inquiries`/`brandbook_requests` 생성
- 이메일 검증·성공 확인 문구·robots noindex·모바일 반응형, 실제 저장 검증 완료

## 7. 후속 (미구현)
- 인양 실사 확보 시 First Record AI 이미지(rec01~04) 교체
- 미사용 옛 섹션 파일(ObservationSection·DataArchiveSection·TastingSection 등) 정리
- 폼 제출 알림(이메일/슬랙) 연동 검토
