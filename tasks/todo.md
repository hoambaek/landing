# TODO

> 현재 진행 중인 작업과 발견 사항을 기록한다.

## 진행 중

- [x] **주류 연령확인(19금) 게이트 + 면허 확인** (2026-07-02)
  - 면허 확보 확인: 오크니 주류수출입업면허(나) 409-2-00256 → 국민건강증진법 §8의2 광고 적법 (메모리 `reference_liquor_license`)
  - 진입 1회 19세 확인 모달 `src/components/legal/AgeGate.tsx`(루트 layout 마운트, useSyncExternalStore로 localStorage 90일 지속) · "아니요, 19세 미만입니다"→`/exit` 안내 페이지(`AgeExit` + ko/en/fr 라우트 3개)
  - 콘텐츠 `src/content/age-gate.ts`(ko/en/fr, 경고문구는 전 로케일 ko 유지)
  - **디자인 = MDM 디자인 가이드 재정합(1차 글라스모피즘 폐기)**: 합본 로고 이미지(`logo_all_W_KR`) · 평면·직각·무테(글라스/box-shadow 제거) · 경고문구 무테 중앙정렬("경고" 라벨 + 문구, 본문 폭에 맞춤) · amber 0.5px 보더 CTA · 모바일 대응 · `word-break: keep-all`
  - **버그 수정**: 자동 포커스를 확인버튼→다이얼로그 패널로 이동(focus-visible 이중 테두리 제거)
  - **테마 = 다크 확정** (2026-07-02): Paper에 라이트 대안(`Age Gate — Light (대안)`) 제작·비교 후 다크 유지. 정본 Paper 아트보드 = `Age Gate — Dark (현재 적용)`
  - CSS `.age-gate`/`.age-exit`(void 다크 · 앰버 헤어라인 · 필름그레인)
  - 검증: tsc·eslint 0 · 프로덕션 빌드(exit 3라우트 정적) · Playwright 데스크톱/모바일/en, 확인·거부·지속성·스크롤잠금·포커스·이중테두리 전 항목 통과
  - 커밋: `e280d34`(초기) · 정본 문서 `docs/plans/2026-07-02-legal-review-verdict.md`

- [x] **법적 문서 페이지 3종** (이용약관·개인정보처리방침·쿠키 정책) — 2026-07-02 **ko 구현 완료** (Paper 라이트 템플릿 → 코드)
  - content `src/content/legal/{terms,privacy,cookies}.ts` + `LegalDoc`/`LegalShell`(LetterHeader --brand 재사용) · 라우트 `/terms`·`/privacy`·`/cookies`(ko, 색인 허용)
  - 푸터 `<span>`→`<Link>` 연결(전 로케일 공통 ko 페이지) · sitemap 3경로 · CSS `.s-legal__*`(라이트 pro-bg)
  - 국외이전 §6 Resend 5항목 완비(P0) · 검증 tsc·lint·빌드·Playwright(데스크톱/모바일/푸터링크) 통과
  - 배포 전 변호사 감수(국외이전·약관 면책) 권장. en/fr 번역은 향후(플랜 B로 ko만)
  - 플랜/법무검토 정본: [`docs/plans/2026-07-02-legal-pages-plan.md`](../docs/plans/2026-07-02-legal-pages-plan.md)(§8 리스크 등록부) · [`2026-07-02-legal-review-verdict.md`](../docs/plans/2026-07-02-legal-review-verdict.md)
  - 남은 배포 전 변호사 감수: 국외이전 판단(Supabase 서울리전 국내 표기)·약관 면책조항
  - 커밋: `a122d24`(법적 페이지) · `65d51e3`(푸터 링크 폰트 크기 fix)

- [x] **푸터 정책·언어 링크 폰트 크기 fix** (2026-07-02, `65d51e3`)
  - 정책 `<span>`→`<Link>`(a) 전환 후 `.s-footer__policies span` 셀렉터 미적용 → 기본 크기로 커짐. 셀렉터에 `a` 추가(데스크톱 11px·모바일 9px) + 링크 호버색. 언어(KR/EN/FR)도 동일 적용

- [x] **Paper 캔버스 코드 동기화** (2026-07-02, Paper 전용 — 레포 커밋 없음)
  - 푸터: 사업자번호 509-88-03399→**859-85-03139** · RELATION "Contact" 제거 (데스크톱·모바일)
  - 메뉴 오버레이: 다크→**라이트(#C4BFBB)** 전환 (코드가 골드대비 라이트로 리디자인된 것 반영, 데스크톱·모바일)
  - 법적 페이지 라이트 템플릿 `Age Gate — Light (대안)`·`Legal — 개인정보처리방침 (Light)` 아트보드 신설

- [x] **다국어(KR/EN/FR) 랜딩페이지** (2026-07-01 착수 · 구현 완료, 감수·커밋 대기)
  - 성공 기준: `/`(ko)·`/en`·`/fr` 3개 URL이 각 언어로 렌더 · 언어 스위처 동작 · hreflang · 빌드/타입/린트 통과
  - 방식: 경량 자체 i18n(딕셔너리 JSON + 라우트 분리). next-intl 미도입(범위 격리 — 서브페이지 5개·root html 구조 무손상)
  - 한글 이미지 타이틀은 ko 전용 유지, en/fr은 웹폰트 텍스트로 조건부 렌더
  - [x] Phase A 인프라: `src/i18n`(config·dictionaries·types·metadata) + `messages/{ko,en,fr}.json`
  - [x] Phase B 첫 슬라이스: Hero+Header+Footer + `/en`·`/fr` 라우트 — 데스크톱/모바일 Playwright 검증(히어로 텍스트 렌더·언어 스위처 라우팅·REC/aria 번역·콘솔0), 타입체크 통과
    - 발견: Footer가 LetterShell(서브페이지)에서도 공유 → ko 기본값 부여로 무손상. HeroSection은 en/fr 텍스트=Cormorant Garamond
  - [x] Phase C 나머지 6섹션 카피 키화 + en/fr 초안 — 6섹션 전부 dict화, 이미지 타이틀 6종(living-copy·counter-unit·first-headline·first-closing·col-sub·maker-subtitle) ko PNG/en·fr 텍스트 조건부. Playwright로 전 섹션 텍스트 렌더 검증(넘침·accent·앰버 카운터 단위 정상)
  - [x] Phase D `<html lang>` 로케일 분기 — HtmlLang 클라이언트 컴포넌트(hydration 후 교정, root layout ko 고정 한계 보완) + sitemap.ts에 en/fr·hreflang alternates 추가
  - [x] Phase E 검증: 프로덕션 빌드 통과(/·/en·/fr 정적 프리렌더) · 타입체크 통과 · 린트(변경분 클린, 기존 에러만 잔존) · Playwright 데스크톱/모바일
  - [x] Phase F 서브페이지 폼 3종 i18n (2026-07-02) — 초대신청·파트너문의·브랜드소개서
    - PartnerForm(편집 중단분 마무리: JSX 하드코딩→dict, `CATEGORIES`→`CATEGORY_KEYS`+`dict.categories`) · BrandBookForm(dict/common props 신규 배선, note1/note2) 완료
    - 공용 Letter 컴포넌트 3종(InviteLetter·PartnerLetter·BrandBookLetter — LandingPage 패턴, locale→dict 로드) + `buildFormMetadata(locale, form)` 헬퍼(noindex 고정)
    - 라우트 9개: ko 3개(dict 미배선 상태였음) 재작성 + `/en/{invite,partner,brand-book}`·`/fr/{...}` 6개 신규
    - 검증: `tsc --noEmit` 0 · en/fr forms 딕셔너리 구조 ko와 완전일치(78키, 누락·잉여 0) · 프로덕션 빌드 통과(폼 9라우트 정적 프리렌더)
  - 남은 권장: 프랑스어 네이티브 감수 · 법적 문구(음주경고·법인정보)는 전 로케일 ko 원문 유지(의도적)

- [ ] **Paper 디자인 시안 — 새 페이지 구조 전체** (2026-06-10 대규모 세션)
  - [x] 데스크톱 8섹션 신규/리디자인: 01 Hero(h3 이미지+기획 카피+J1950) · 02 The Living Record(풀블리드 관측일지, 771일째 카운터) · 03 The First Record(타임라인 플레이트 4컷, xAI 생성 rec01~04) · 04 Collection(시간 띠+큐베 그리드+NFC 기록 카드+라인 드로잉 3년 병) · 05 The Maker(메이커 캐러셀, N°2 비공개 티저) · 06 Ocean Cellar Privé / 07 Partnership 분리 · 08 Footer(통합 로고+모토 수미상관)
  - [x] 모바일 8섹션 + 메뉴 오버레이 전체 신규 (히어로 h3_m2 세로 이미지, First Record 3컷 압축, Collection 2열 그리드, 푸터 중앙 정렬)
  - [x] 데스크톱 메뉴 오버레이 (아카이브 넘버링 내비 + 라이브 관측 라인)
  - [x] 헤더 로고 시스템: 심볼 좌 + 텍스트 로고 중앙, 다크 섹션 화이트/라이트 섹션 블랙
  - [x] 캔버스 정렬: 1행 가이드 / 2행 데스크톱 / 3행 모바일 / 보관 구역([보관] 구버전 8개)
  - [x] 컬러 그레이딩 기준 확립 → `docs/brand/image-generation-guide.md` (웜 하이라이트/콜드 섀도우 스플릿 토닝)
  - [x] UI 문법 통일: 필 태그·채운 버튼 제거 → 점 구분 라인 + 헤어라인 언더라인 링크 (Ocean Cellar·Partnership 4곳)
  - [x] 카피 정비: D+201→771일째(직관 표기) · 가격/티어 코드 제거 · "기다리는 사람의 것"→"천 일의 기록, 한 권의 책" · 시간 띠 한 문장화 · QR→NFC 전환
  - [x] 서브 페이지 3종 디자인 (초대 신청 · 파트너 문의 · 브랜드 소개서 — 편지형 언더라인 폼)
  - [x] **코드 구현 — Paper 01~08 전 섹션 1:1** (2026-06-10) → `docs/plans/2026-06-10-paper-to-code-plan.md`
    - [x] Phase 1 헤더(20/48 패딩·심볼48·로고22·심볼33·3줄 햄버거) + 메뉴 오버레이(7항목 좌측 넘버링·워터마크·REC 라인·KR/EN/FR) · LIGHT_SECTIONS 갱신
    - [x] Phase 2 Hero(정적 h3/h3_m2 + Cool Shadow Grade + Scrim/Top Blur + J1950 3행/5행 + 브랜드 라인) — 영상 상태머신 폐기
    - [x] Phase 3 The Living Record(풀블리드 o3/o3_m + 771 카운터 시작일 2024-05-01 자동계산 + 관측 로그 + 클로징)
    - [x] Phase 4 The First Record(다크→라이트 그라데이션 + Entry + 4컷/3컷 플레이트 rec01~04 + 타임코드 캡션 + ÉDITION ZÉRO)
    - [x] Phase 5 Collection(f2 히어로 + 시간 띠 3단계 + 큐베 6카드 contain + SOLD OUT 디밍 + 라인드로잉 병 multiply + 증서 카드 rotate2° + NFC 심볼)
    - [x] Phase 6 The Maker(캐러셀 2슬라이드 m1/m2 + 카운터·티저·‹›·스와이프 + 비공개 피크) — 옛 maker CSS 충돌 제거
    - [x] Phase 7 Ocean Cellar Privé(좌하단 1링크)·Partnership(우하단 2링크) — c1/p1 풀블리드 + 점 구분 태그 + 헤어라인 언더라인, s-diptych 해제
    - [x] Phase 8 Footer(로고 락업 + Mrs Saint Delafield 모토 + 앰버 헤어라인 + 3열 내비 + 법인 정보 + SNS·약관·언어)
    - [x] Phase 0 정비: 에셋 중복 정리(old/ 이동)·rec webp 변환·글리프 검사 유틸(scripts/check-glyphs.mjs)·@theme 토큰 추가(main/delafield)
    - [x] 검증: 타입체크·린트·프로덕션 빌드 통과 · Playwright 데스크톱1440+모바일390 Paper 대조 · 콘솔 에러 0
    - [x] 커밋 `e651360` 푸시 → 체인지로그 `docs/plans/2026-06-11-paper-to-code-changelog.md`
  - [x] **2026-06-11 리파인 세션** (커밋 `e651360` 포함)
    - [x] Hero: 영상 폐기 정적 히어로, 모바일 프로스티드 블러(인라인 backdrop-filter blur 15px — Lightning CSS 스트립 우회), 타이틀 위치/크기 미세조정(모바일 21px)
    - [x] Living Record 데스크톱 높이 Paper 동일 1196px, 클로징 데스크톱 삭제
    - [x] First Record 이미지 축소(440/312/580/580)·REC02 커넥터 제거·간격 120px·캡션 화이트·ÉDITION ZÉRO 삭제
    - [x] Collection 시간 띠 삭제·24병한정 삭제·SOLD OUT 하단 이동·desc 줄바꿈
    - [x] The Maker 2번 카드 = coming soon(이미지 좌+텍스트 우)
    - [x] 카피 마침표 일괄 제거(중간 콤마 유지)·좌표 34.1434°N/126.5792°E·수온 13.5°C·REC→기록·사업자번호 859-85-03139
    - [x] Footer 라이트 테마(#C4BFBB→ 내비 실제 링크·Contact 삭제·이메일 강조)·헤더 푸터 위 검정
    - [x] 메뉴 오버레이 라이트(#C4BFBB)·골드 #8C6B33 대비 확보
  - [x] **서브 페이지 3종 구현** (커밋 `1e92d36`) — `/invite`·`/partner`·`/brand-book`
    - [x] 편지형 셸(LetterShell) + UnderlineField(포커스 앰버) + 테마별 CSS 변수
    - [x] Supabase insert(RLS anon insert-only): `invitations`/`partner_inquiries`/`brandbook_requests` 테이블 생성 + 실제 저장 검증
    - [x] 이메일 검증·성공 확인 문구·robots noindex·모바일 반응형
  - [ ] 데스크톱 히어로/S2 이미지 원본 재보정 (현재 CSS 근사 — 가이드 §4 기준)
  - [ ] 기획 문서 QR→NFC 표기 갱신 (brand-direction-2026.md §7, homepage-structure.md S4)
  - [ ] 인양 실사 확보 시 First Record AI 이미지(rec01~04) 교체
  - [ ] 미사용 옛 섹션 파일 정리(ObservationSection·DataArchiveSection·TastingSection·NfcSection·OriginSection)
  - [ ] 폼 제출 알림(이메일/슬랙) 연동 검토

- [ ] **브랜드 북극성 채택 검토** (`docs/plans/2026-06-10-brand-north-star.md`)
  - [x] 내부 기획 3편 분석 + 외부 24개 브랜드 4트랙 리서치
  - [x] 북극성 제안: "바다의 시간을 기록하는 브랜드" — 병별 기록 동봉이 핵심 차별
  - [x] 방향성+기획 마스터 문서 정리 → `docs/brand/brand-direction-2026.md`
  - [x] 모토 확정: Written by the Sea / 바다가 쓴 시간 · 히어로 1년 기준(진행형) · 시간 3단계(T-6 지속/T-12 정식/T-36)
  - [x] 메인 페이지 구조 기획 → `docs/plans/2026-06-10-homepage-structure.md` (스크롤=한 병의 여정)
  - [ ] CEO 확인 후 수직 슬라이스 구현 시작 (Hero → Footer → 서막 비트 → Living Record → Collection)
  - [ ] CEO 결정: 북극성 채택 / 병별 기록 실행 수준 / 히어로 A·B안 선택
  - [ ] 승인 시 히어로부터 수직 슬라이스 카피 교체

- [ ] **The Proof — 4섹션 재기획 실행** (`docs/plans/2026-05-15-the-proof.md`)
  - [ ] page.tsx 4섹션으로 축소 (Observation · Tasting · TheMaker · Bridge 제거)
  - [ ] Sea Log 섹션 리뉴얼: 입수/인양 사진 슬롯 + 메타데이터 + 감각의 닻 카피 + 미세 떨림 모션
  - [ ] Hero 카피 점검 — "한국 바다에서 숙성한 샴페인" 직격 보강
  - [ ] Access 섹션 CTA 톤 조정 — `Request →` / `Inquire →` / `Access Granted`
  - [ ] Collection 카드 톤 점검 — Archive No. 노출 강화
  - [ ] 검증: 타입체크 · 린트 · 빌드 · Playwright 모바일 점검
- [x] **Claude Design 온보딩 사전 정비 (Phase 1-4)** — 커밋 faccd40
  - [x] Phase 1 토큰 누수 차단: @theme +17 토큰, hex → var() 참조 전환 (METRICS/CHART_LINES), SVG stroke style 이관, OG BRAND 상수 분리, Archive 레이블 BEM
  - [x] Phase 2 인라인 스타일 제거: `--particle-*`, `--metric-color` (color-mix 25% alpha)
  - [x] Phase 3 구조 정비: 빈 3d/ 삭제, 루트 스크린샷 10개 정리, 고아 ObservationImageSection 제거, S2 중복 헤더 통합
  - [x] Phase 4 검증: 타입체크·린트(기존 경고 2건만)·빌드(3.3s) 통과, Playwright 런타임 토큰 해석 확인 (메트릭 색상 일치, 레이블 border rgba 동일)
- [x] P0: 헤더 색상 전환 구현 (S1 라이트↔S2 다크 스크롤 기반)
- [x] P0: 메뉴 접근성 보강 (aria-expanded, 포커스 트랩, ESC 포커스 복원)

## 대기

- [ ] P1: Skip link 추가
- [ ] P1: S3 메트릭 카운팅 애니메이션 (0→target, 2.0s ease-out)
- [ ] P1: S5 캐러셀 도트 스크롤 동기
- [ ] P1: S1 파티클 페이드아웃 (progress 30~60%)
- [ ] P1: 헤더 스크롤 축소 (scrollY>100px → padding 36→20)
- [ ] P1: 영상 에셋 제작 착수 (히어로 3건 우선)
- [ ] P1: 사진 에셋 제작 착수 (S2 Before/After 6장 우선)
- [ ] P2: 장식 요소 aria-hidden 적용
- [ ] P2: 프랑스어 큐베명 lang="fr" 적용
- [ ] P2: S2 reduced-motion 정적 폴백 (fact 세로 나열)
- [ ] Brand Core Value 01 (손길) — The Maker 브릿지 카피 적용
- [ ] Brand Core Value 03 (물성) — Archive 프로비넌스 영역 적용
- [ ] The Maker 섹션 카피 재작성 (생산자 철학 + 팀 이야기)
- [ ] Before & After 실제 촬영 에셋 교체 (현재 플레이스홀더)

## 완료

### 2026-06 디자인·성능·iOS 라운드

- [x] J1950(jj) 폰트 텍스트 → 투명 PNG 이미지화 후 폰트 파일(jj.ttf) 제거 (sharp+pango 렌더, `_workspace/font2img/`)
- [x] 카운터 숫자 779 → Diphylleia, "일째"는 J1950 이미지로 (baseline 정렬)
- [x] Ocean Cellar·Partnership 버튼 → Filled CTA (amber 배경, 0.5px 보더)
- [x] em dash(—) → 한국어 부호로 일괄 교체 (마침표·쉼표·가운뎃점·말줄임표·괄호 / 제목은 `|`)
- [x] THE FIRST RECORD 정리 — rec00 교체 후 삭제, 2컷만, 캡션 텍스트 제거
- [x] next/image 최적화 활성화(`unoptimized` 해제) — 얇은 라인 모아레 해결
- [x] priority 히어로 이미지(h3·LetterShell)는 `unoptimized` — webp 재변환 cold(~300ms) 제거
- [x] 푸터 다크(void #0A0908) 통일 — 메인+서브, 화이트 로고, amber 액센트
- [x] 서브페이지 헤더 client 전환(LetterHeader) — 스크롤 시 다크 배경+blur, 로고 흰색, 노치 차폐
- [x] iOS safe-area(노치) — viewport-fit=cover + theme-color(#0A0908) + 노치 차폐 바(z 110, 합성 강제)
- [x] 헤더 로고 푸터 영역 판정 수정 — 다크 푸터에서 흰 로고 유지 (`isDarkAtY` 푸터 false→true)
- [x] 파트너 폼 PARTNERSHIP TYPE 섹션 구분선 + 한글 안내문

- [x] 히어로 스크롤 화살표 가로 중앙 정렬 — scroll-in 전용 애니메이션 생성 (title-in이 translateX 덮어쓰는 문제 해결)
- [x] 히어로 타이틀 크기 축소 — clamp(22px,3.2vw,42px) → clamp(20px,2.9vw,38px)
- [x] Tasting 영상 크롭 — object-position: center bottom + scale(1.15)
- [x] Sea Log → Tasting 그라데이션 개선 — 두 섹션에 걸쳐 16단계 자연스러운 전환, CTA부터 시작
- [x] Hydration mismatch 에러 수정 — ScrollReveal MutationObserver 대기열 패턴 적용 (Suspense 스트리밍 호환)
- [x] Collection 카드 설명 정리 — story 필드 제거, desc 한 줄 통일, 카피 전면 수정, word-break: keep-all 적용
- [x] Collection CTA 버튼 하단 여백 확대
- [x] Ocean Cellar 섹션 디자인 통일 (타이틀 font-jj + dot 패턴 + membership 태그 위치/가시성)
- [x] Ocean Cellar 섹션 텍스트 가시성 개선 (copy/rewards/rule/form opacity 상향, 컬러 밝게)
- [x] 메뉴 오버레이 리디자인 (다크 배경, 센터 정렬, 골드 그라데이션)
- [x] 메뉴 호버 딜레이 수정 (inline transitionDelay → CSS nth-child)
- [x] 멤버십 "초대는 순차적으로 발송됩니다" 텍스트 삭제
- [x] 멤버십 rewards 01~03 수평 인라인 레이아웃 변경
- [x] 홈페이지 구현 1차 총괄 검토 (`teams/00-luxury-branding-team/final-homepage-implementation-review.md`)
- [x] 와이어프레임 Observation 섹션 최종 검토 (Part A + Part B)
- [x] 히어로 라이트 배경 전환
- [x] Phase 2 감각 카피 제거
- [x] Observation 섹션 전면 재기획 (Pressure Descent + Before/After)
- [x] 컬렉션 라인업 실제 큐베명으로 교체
- [x] Data Archive 스펙 실제 수치 반영 (20-40m, 6-12°C)
- [x] The Maker "이중의 떼루아" 서브타이틀 적용
- [x] 팀 폴더 `teams/`로 이동

## 발견 사항

- Observation Part A: 스크롤 중간 지점 텍스트 가독성 이슈 → 팩트별 대비색 자동 지정으로 해결
- 카피 톤: "맛"이라는 단어는 판매 언어에 가까움 → 브랜드 기준서 위반
- homepage-plan.html의 스펙(60m, 1.8°C)과 실제 스펙(20-40m, 6-12°C) 불일치 → 실제 기준 적용
