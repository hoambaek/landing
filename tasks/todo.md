# TODO

> 현재 진행 중인 작업과 발견 사항을 기록한다.
> ⚠️ **2026-08-02 대표 확정으로 최장 티어가 2년(T-24)으로 변경됨.** 완료 항목에 남은 `T-36`·`3년 병` 표기는 당시 작업 기록이며 현재 정본이 아니다.

## 진행 중

- [x] **CLAUDE.md 현행화 — 거짓 정보 제거·정본 승격** (2026-07-05)
  - 정정: 런칭 7-8월→**12월 첫 인양** · 기술스택 표에서 GSAP/Three.js/Lenis/PostHog 삭제(전부 미사용, framer-motion도 import 0건)·실스택으로 교체 · 애니메이션 규칙 GSAP→**CSS+IntersectionObserver(ScrollReveal) 패턴** · 페이지 구조 표를 실제 7섹션(컴포넌트·CSS 접두어 포함)으로 교체(observation·Living Data 구표기 폐기)
  - 수리: 깨진 href 4곳(`docs/spec.md`→`docs/tech/spec.md` 등)
  - 승격: **개발 환경 섹션 신설**(pnpm 전용·포트 3600·Turbopack 캐시·backdrop-filter 인라인·커밋은 요청 시·에셋 revert 전 확인) · 표기 규칙(em-dash 금지·가운뎃점 1개·정밀수치 실측만) · 문서 맵에 감사 정본 2종 추가
  - 검증: 상대 링크 12개 전수 실존 ✅

- [x] **taste-skill(design-taste-frontend) anti-slop 감사 + 즉시개선** (2026-07-05)
  - 설치: `npx skills add Leonxlnx/taste-skill` (`.agents/skills/` 14종). audit-first 리디자인 프로토콜로 랜딩 대조
  - **삼분류 결과**: 대부분 tell이 아니라 의도적 헤리티지 보이스(Cormorant serif·"Written by the Sea" 모토·다크→라이트→다크 서사·큐베 N° 번호 = 전부 유지). 진짜 개선점만 실행
  - **실행**: ①스크롤 큐 `↓` 제거(HeroSection+CSS+keyframe) ②em-dash 전량 `,`로(ko3·en8·fr7, 페이지 내 0) ③다중 가운뎃점 정리(recLine 라벨 제거→점1개, 폼 3항목 나열 쉼표) ④gift eyebrow 제거(4→3) ⑤장식점 `.s-col__note-dot`×2 제거(gap 18px로 자연 간격)
  - **보존(사용자 결정)**: 좌표·수온 수치=실시간 데이터 연동 예정이라 유지 · 다크전환·큐베번호=의도적 브랜드 장치
  - 검증: 빌드28 · 중괄호702 · Playwright(scroll_cue 없음·note_dots 0·em-dash 0·recLine 점1개) · 콘솔0

- [x] **랜딩 구조 리팩터 (StyleGallery 감사 로드맵 C단계)** — C1·C2 완료, C3 스킵 (플랜 `~/.claude/plans/magical-dreaming-wilkinson.md`)
  - 범위: 저·중리스크만. 제외(고위험) = Maker 캐러셀 cover·Maker/Header 리스트화(애니메이션)·container query 전면·Privé 모바일 고정높이
  - **[x] C1 시맨틱 접근성** (2026-07-05): 7섹션 aria 부여(void·archive·maker·ocean·professionals=labelledby+h2 id, living·first=aria-label "The Living/First Record") · 4종 리스트 ul/li 변환(Footer nav·Archive 큐베그리드 figure→li·Living 로그값·Privé 태그×2) · Privé 구분점 span→`li:not(:last-child)::after` 재현 · 새 ul마다 `list-style:none;margin:0;padding:0` 리셋. 검증: 빌드28 · Playwright 데스크톱+모바일 시각동일·구분점 유지 · 접근성 트리(7섹션 라벨·ul 7개·h1 2개[C2에서 1개로]) · 콘솔0
  - **[x] C2 DOM 이중화 제거** (2026-07-05): Hero 데스크톱/모바일 두 블록→단일 `.s-void__content` + 단일 `<h1 id=void-title>`(ko는 `<picture>`로 hero-h1-m/d.png 아트디렉션) → **h1 2→1** · Living copy/overlay 2벌→1벌 · First rows 2벌→1벌(단일 DOM에 데스크톱+모바일 클래스 병기, `@media`가 소스순서로 오버라이드) + headline `<picture>` · 죽은 CSS 정리(s-first__cl--*·plate--m1). 검증: 빌드28 · Playwright **ko/en/fr × 데스크톱/모바일** — h1=1·아트디렉션 스왑(ko m/d, en/fr 텍스트)·plate 블리드/센터·connector dim·시각 회귀 0·콘솔0
  - [~] **C3 안전 cover = 스킵** (2026-07-05): 텍스트 담은 고정높이 섹션(Living·Hero)이 전부 `position:absolute`라 min-height 전환이 클립을 실제로 못 고치고, 텍스트 없는 배너(s-col__hero)는 전환 불필요. 진짜 위험한 Maker 캐러셀·Privé 모바일은 이미 고위험 제외. → 이 코드베이스엔 실익 없어 스킵(사용자 승인)

- [x] **랜딩 레이아웃 토큰화 (StyleGallery 감사 로드맵 B단계)** (2026-07-05)
  - `@theme`에 레이아웃 토큰 3종 신설: `--w-content: 1240px` · `--gutter-page: 80px` · `--gutter-limit: 48px` (기존엔 색·폰트·z-index 토큰만 있었음)
  - 검증된 동일-개념 9곳 치환: 콘텐츠폭 3곳(s-col__grid·showcase·maker__nav, `1238/1240`→`var(--w-content)`으로 통일) · 페이지거터 3곳(.container·히어로·리빙 `left/padding 80px`→`var(--gutter-page)`) · 리미터거터 2곳(`calc(100%-48px)`→`var(--gutter-limit)`) · breakpoint 표준화(단 1곳 남은 `max-width:767px`→`768px`, 나머지 12곳과 일치)
  - **의도적 축소**: 감사가 지목한 매직넘버 무차별 치환(80×48회·24×79회·48×52회)은 **하지 않음** — 같은 숫자가 거터·line-height·수직패딩 등 역할이 제각각이라 blanck 치환은 위험. "공유 어휘"가 명확한 폭·페이지거터·리미터거터만 토큰화. 광범위 spacing 스케일 이관은 C단계/후속으로 유보
  - 검증: 중괄호 728/728 · 빌드 28라우트 정상 · Playwright 데스크톱 풀페이지 픽셀 동일(시각 회귀 0)·콘솔 에러 0
  - 미커밋. 남은 로드맵: C(구조 리팩터 — 고정높이→cover·DOM이중화→container query·시맨틱 ul/li·aria·h1)

- [x] **랜딩 죽은 코드 정리 (StyleGallery 감사 로드맵 A단계)** (2026-07-05)
  - 정본: [`docs/reports/2026-07-05-landing-layout-stylegallery-audit.md`](../docs/reports/2026-07-05-landing-layout-stylegallery-audit.md)
  - **삭제 전 전량 직접 검증**(grep 참조 0건 + 동적 클래스 조립 없음 + @keyframes 라이브 참조 없음). 서브에이전트 오탐 1건 교정: `.card-slider`는 "살아있음"이 아니라 `CardSlider.tsx`가 렌더 0건인 죽은 컴포넌트였음 → CSS까지 죽음
  - 삭제 컴포넌트 8개: DataArchiveSection·ObservationSection·OriginSection·NfcSection·TastingSection·DataArchiveClient·DataMetricsClient·CardSlider(전부 import 0건)
  - `globals.css` **6,936 → 4,845줄 (−2,091, ≈30%)**: s-bridge·s-obs·s-data·s-tasting·s-archive(+m-card·card-slider·masonry·muselog)·s-nfc·s-origin·s-diptych·footer(bare, s-footer 아님) 데스크톱·모바일@media 전부 + 죽은 하위클래스(s-col__band*·s-first__plate--01/02·s-maker__slide--veiled) + 라인단위(m-card/.footer__*:active)
  - **스코프 확장 고지**: 감사 A목록엔 없던 `.m-card*`·`.card-slider*`·CardSlider.tsx도 archive 영역에 얽힌 죽은 코드라 함께 제거(직접 검증). `.indicator`/SectionIndicator.tsx는 "주석 처리 보류"라 **의도적으로 남김**
  - 검증: 중괄호 728/728 균형 · 잔여 참조 0건 · **프로덕션 빌드 28라우트 정상** (tsc/CSS 컴파일 통과)
  - 미커밋(요청 시 커밋). 남은 로드맵: B(토큰화)·C(구조 리팩터 — 고정높이→cover·DOM이중화→container query·시맨틱)

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

## The Method (OCEAN CELLAR™) 페이지 — 2026-07-08
- [x] `/method` 라우트 신설 (page.tsx + MethodView.tsx + method.module.css, meetup 패턴)
- [x] J1950 타이틀 11종 → PNG @3x (`public/text/method/`, Paper 원본에서 추출·투명 트리밍) — 데스크톱/모바일 아트디렉션 `<picture>`
- [x] 차트 4종 인라인 SVG (숙성 타임라인 D/M · 풍미 레이더 D/M · 관측 스파크라인 8종 · 수렴 다이어그램) — UAPS 엔진 실측값(Atomes Crochus 배치)
- [x] 사진 2종 (`public/images/method/`: measure-cage, archive-bottle) + 플레이스홀더 3곳(인양 풀블리드·NFC·초상)
- [x] 검증: 빌드 29 정적 생성 ✓ · Playwright 1440/390 풀페이지 렌더 ✓ · dOnly/mOnly 캐스케이드 버그 수정(!important 유틸)
- [x] 이미지 채우기 (Paper 원본에서 추출): retrieval-cage.webp(인양 풀블리드) · quote-tablet.webp(기록팀 태블릿, 초상 대체) · nfc-phone.webp(병+폰, object-position center 20%)
- [x] Paper 파리티 수정: 소프트 CTA 삭제 · 히어로 서브텍스트 amber · verb index 가운데정렬 · ARCHIVE·WANDO 스탬프 삭제 · 귀속 "뮤즈드마레 기록팀/WANDO STATION" · LEARN 섹션(차트 480px 고정, 차트→제목 순서, 간격 36/12, 카피 폭 420/480) · 모바일 tlProduct 숨김
- [x] 홈 진입 링크: Living Record 섹션 선언문 아래 amber 텍스트 링크 "바다는 어떻게 기록되는가 →" (`living.methodLink`, ko/en/fr 사전)
- [x] 메뉴·푸터 라벨 정리: "The Living Record" → "Ocean Cellar™", "The First Record" → "First Record" (Header·LetterMenu·Footer 3곳, 별도 메뉴 항목은 추가하지 않음)
- [x] /method에 사이트 공통 크롬 장착: hero 자체 헤더(THE METHOD·워드마크·REC) 제거 → LetterHeader(햄버거 메뉴) + Footer 재사용
- [x] 메뉴 오버레이 vh 계수 재조정 (top 14vh·라벨 4.8vh·패딩 1.3vh) — 900px 높이에서 하단 문구와 겹침 해소
- [x] en/fr 로케일: `/en/method` `/fr/method` 라우트 신설, 전체 카피 번역(`src/app/method/copy.ts` — ko/en/fr 단일 소스), ko=J1950 PNG·en/fr=Cormorant 텍스트 타이틀, SVG 차트 라벨·태그(폭 자동 계산)·aria 로케일 분기, 모바일 레이더는 축약 라벨(radarAxesShort), Living Record 진입 링크·CTA 로케일 라우팅, hreflang alternates + sitemap 등록. 빌드 31 페이지 ✓
- [x] CH01 관측·LIVE 실데이터 연동 (`src/lib/ocean-observations.ts`, unstable_cache 1h): 수온·조위=KHOA survey 30일 이력+당일 실측, 염분·조류 유속=KHOA recent 당일 시간별(이력 서비스 없음), 수압·파고·파주기·해류=Open-Meteo 30일. 실패 시 정적 폴백. ⚠️ 배포 시 Vercel에 KHOA_API_KEY·KHOA_OBS_CODE 환경변수 추가 필요 (.env.local에는 복사됨)
- [x] 관측 그리드 후속: 수온=estimateBottomTemperature 수심 30m 보정(data-log 로직 이식), 수압=표층기압+30m×0.0993atm 소수2자리(3.97), 8카드 1회 애니메이션(ObsGrid.tsx — 카운트업+패스 드로잉, SSR은 최종값, reduced-motion 스킵), 시계열 4포인트 미만이면 곡선만 폴백·수치는 실측

## NFC 병 페이지 v2 리디자인 (Paper 시안) — 2026-07-24 · phase-1 (프론트 4화면)
범위: 사용자가 Paper에서 NFC 페이지를 새로 디자인 → 프론트 4화면만 우선 구현(인증서 04·소유관리 03A·PNG저장은 phase-2). 성공기준: Paper 시안 파리티 + 기존 데이터/GSAP 재사용 + 타입/린트 통과 + Playwright 검증.
- [x] copy.ts ENTRY_COPY 전면 개편(5개국어): 필름·Bottle Identity·Provenance 3증거·Claim Ownership·각인공개 필드 신설. RECORD_EXTRA에 Eight Currents 인트로(ecEyebrow/ecTitle/ecBody/ecLegend) 추가. titleText/subLabel "일 년→사계절"
- [x] 01 입장 개편(BottleEntry.tsx + entry.module.css): 필름 히어로(KO 언어칩·재생·"바다 아래의 시간이 깨어납니다") → Bottle Identity(productName·N° Cormorant 카운트업·에디션 본문) → Provenance(수심30m/12개월/8항목 3증거 표) → Claim Ownership("이름을 새기다"). 섹션 IO 리빌
- [x] 02 각인완료(BottleInscription.tsx 신설): 등록 성공 시 상태 전환(라우트 아님, 소유자명 메모리 유지) → 각인 리빌 애니메이션(위→아래 stagger, CTA 2s 후) → "바다의 기록 보기" CTA로 /record. 실제 제출은 이메일 부작용 있어 초기상태 강제로 시각검증만
- [x] 03 record 개편(BottleRecord.tsx + bottle.module.css): 히어로 상단 소유상태칩(YOUR OCEAN CELLAR RECORD·NFC VERIFIED 초록점) + 타이틀 "바다가 새긴 사계절"(J1950 PNG로 렌더) + 서브라벨 "남해 30m·사계절의 기록". Eight Currents 인트로 섹션(여정↔8줄기 사이) 신설, 옛 flowHead 제거, flow 배경 void 시작으로 이음새 보정. 8줄기·수렴·병·표·뉴스레터·푸터는 기존 유지
- [x] J1950 타이틀 이미지: Paper export가 이 하네스에서 이미지 미반환 → ~/Library/Fonts/jj.ttf(설치됨) + Pillow로 "바다가 새긴 사계절" @3x 투명 PNG 로컬 렌더 → public/images/b-record-title-ko.png (글리프 8자 전수 확인)
- [x] 언어선택(screen-4): entry 히어로 KO칩 → 기능형 드롭다운(BOTTLE_LOCALES 5개국 국기·코드·네이티브·활성 앰버체크), BottleEntry에 locale 상태 + ENTRY_COPY[locale] + 제출 locale 반영. record는 기존 푸터 드롭다운 유지
- [x] 검증: tsc 0 · eslint 0 error(기존 warning 1) · Playwright 390×844 — 필름/Identity(N°15 카운트업·치환)/Provenance/Claim, 각인완료, record 히어로(J1950 이미지)·EC 인트로·병·표, 언어 KO→EN 전환 본문 변경 전수 확인
- phase-2 대기: 04 디지털 인증서(소유자 데이터 노출 인증 모델 결정 필요) · 03A 소유정보관리·이전(재인증+감사로그) · 04A/B PNG 저장(html-to-image 등). 03의 "디지털 인증서 보기·인증서 저장·소유 정보 관리" CTA는 phase-2까지 비노출

## NFC 병 페이지 v2 리디자인 — phase-2 (인증서·소유관리·PNG저장) — 2026-07-24
결정: 소유자 이름=마스킹(공개 URL 프라이버시), PNG=html-to-image 추가, 소유권 이전=재인증 없이는 미구현(읽기전용). 성공기준: Paper 파리티 + 안전한 기본값 + tsc/eslint/build 통과 + Playwright 검증.
- [x] data.ts fetchBottleOwner(code): bottle_registrations 최신 1행 조회, **서버에서 마스킹**(maskName "백호암"→"백••", maskEmail "hoambaek@gmail.com"→"ho•••@gmail.com")해서만 반환 — 원본 PII 클라이언트 미전달(게이팅 원칙)
- [x] 04 디지털 인증서: 라우트 /b/[code]/certificate/page.tsx(서버 — certId "MDM-{연}-{병4자리}", node:crypto SHA-256 앞16 서명) + BottleCertificate.tsx + certificate.module.css. 로고 헤더·소유인증서 태그·N°·병·헌정·마스킹 소유자·✓씰·인증정보·원산지·해저숙성·디지털서명·저장/공유/뒤로·푸터(5개국어 언어선택). provRows/seaRows는 record 로직 재사용, 숙성기간은 개월 표기(12개월)
- [x] 04A/B PNG 저장: 오프스크린 인증서 카드(printCard, 포트레이트)를 html-to-image toPng(pixelRatio 3)로 렌더 → 다운로드(파일명 certId.png). 공유=navigator.share(files) → 미지원 시 다운로드 폴백. 검증: MDM-2026-0015.png 다운로드·카드 디자인 확인(로고·태그·병·헌정·백••·N°15·certId)
- [x] 03A 소유정보관리: 라우트 /b/[code]/owner/page.tsx + BottleOwnerManage.tsx + owner.module.css. 읽기전용 — 등록 소유자(마스킹)·"소유 등록 완료"(정직 라벨, "본인 인증 완료" 아님)·연결 병 카드(→인증서)·설정(이름수정/소식알림)·소유권 이전. 변경/이전 액션은 인증 없이 실행 안 함 → 탭 시 "본인 인증 기능 준비 중입니다." 표시
- [x] 03 record에 Owner Services(Digital Passport) 섹션 추가: "디지털 인증서 보기"(→certificate)·"인증서 저장"(→certificate)·"소유 정보 관리"(→owner) 링크. phase-1에서 비노출했던 CTA 활성화. 링크는 data.bottle.nfcCode 사용. 기존 뉴스레터·푸터는 유지
- [x] 카피: RECORD_EXTRA에 cert*(16)·own*(15)·passport*(5) 필드 5개국어 추가. certOwnerFallback "소유자 미등록"
- [x] 검증: tsc 0 · eslint 0 error · **pnpm build 성공**(신규 2라우트 dynamic 등록) · Playwright — 인증서 전체(마스킹 백••·certId MDM-2026-0015·서명)·PNG 다운로드·03A(마스킹·준비중 안내)·record Passport 링크 확인
- phase-3 대기: 소유자 인증(로그인/토큰) — 도입 시 이름 전체 노출 전환 + 이름·이메일 수정 + 소유권 이전(재인증+수락+감사로그+단일 트랜잭션) 실제 구현. 04A/04B 별도 화면(저장 확인·결과)은 인라인 처리로 대체함

## NFC 병 페이지 v2 — phase-3 (소유자 인증 · ~~소유권 이전~~) — 2026-07-24
> ⚠️ **소유권 이전은 이후 폐기됐다 (db6b312, 2026-07-25).** 아래 이전 관련 항목은 당시 기록이며 지금 코드에 없다. 폐기 경위는 「소유권 이전 폐기」 절 참조. **소유자 인증(OTP·세션)은 그대로 살아 있다.**

결정: 이메일 OTP 6자리 인증 + 소유권 이전까지 전부. 성공기준: 세션 게이팅으로 안전한 변경/이전 + tsc/eslint/build 통과 + OTP 흐름 E2E 검증.
- [x] DB(마이그레이션 bottle_owner_auth_and_transfer, marketing 프로젝트): bottle_owner_verifications(OTP)·bottle_ownership_audit(감사)·bottle_transfers(이전). 전부 RLS on(정책 없음=service_role 전용)
- [x] env: BOTTLE_SESSION_SECRET(.env.local 추가, 64hex) — HMAC 서명 쿠키용. ⚠️ Vercel 등록 필요. 이전 링크용 NEXT_PUBLIC_SITE_URL도 미설정 시 musedemaree.com 폴백
- [x] owner-auth.ts(server-only): HMAC 서명 세션 토큰(httpOnly 쿠키, /b/{code} 스코프, 30분) sign/verify/get/set/clear + genOtp + hashCode/hashToken(비밀키 해시, 평문 미저장)
- [x] owner-actions.ts("use server"): requestOwnerOtp(등록 이메일로 6자리 발송, 10분 5회 레이트리밋)·verifyOwnerOtp(해시 timingSafe 비교, 5회 시도 제한, 성공 시 세션+감사)·signOutOwner·~~updateOwnerInfo(세션 재확인 후 최신 등록행 수정)·initiateTransfer(세션 게이팅, 토큰 이메일 발송, 기존 대기 취소)·acceptTransfer(토큰=이메일 통제 증명, 새 소유자 등록행 삽입=최신 소유자, 감사, 세션 이양)~~ → 폐기. **현재 남은 액션은 4개**: requestOwnerOtp·verifyOwnerOtp·signOutOwner·updateOwnerName
- [x] data.ts: maskName/maskEmail export + fetchBottleOwnerRaw(인증 시에만 원본 반환)
- [x] UI: BottleOwnerManage 재작성(미인증=마스킹+"본인 인증하고 전체 보기" OTP 인라인 / 인증=전체 이름·이메일+수정 폼+이전 폼+인증 해제, window.confirm으로 이전 재확인). BottleCertificate=ownerNameFull prop으로 인증 시 언마스킹. certificate/owner page.tsx=getOwnerSession 읽어 authed·원본 전달. ~~신규 /b/[code]/transfer(BottleTransferAccept + transfer.module.css)=이메일 링크 수락 화면~~ → 라우트·컴포넌트·CSS 전부 삭제됨
- [x] 검증: tsc 0 · eslint 0 · pnpm build 성공(신규 transfer 라우트) · **OTP E2E**: 요청→행 생성·이메일 발송 확인→DB 해시에서 코드 역산(031594)→UI 입력→verify→세션 발급→owner/cert 전체 이름 "백호암" 언마스킹 확인. 수정·이전 폼 렌더 확인(실제 데이터 변경·이전 발송은 미실행)
- ⚠️ 알려진 한계: 소유권 모델=최신 bottle_registrations 행=현 소유자. 입장 페이지가 누구나 재등록 허용 → 재등록으로 소유자 덮어쓰기 가능(선행 이슈). OTP는 "인증 시점의 등록 이메일 통제"를 증명. 향후 하드닝=정규 소유자 테이블 + 입장 재등록 게이팅

## NFC 재등록 구멍 차단 — 2026-07-24 (phase-3 후속)
- 입장 페이지(/b/[code]): 이미 등록된 토큰이면 isBottleRegistered 체크 후 redirect(/record). 미등록 토큰만 등록 폼 노출
- submitBottleRegistration: 이미 등록된 nfc_code면 서버에서 거부("이미 등록된 병입니다"). 폼 우회 직접 호출 대비 defense-in-depth. 소유권 이전(acceptTransfer)은 별도 경로라 영향 없음
- 결과: 소유자 변경은 소유권 이전(재인증)으로만 가능 → phase-3의 "누구나 재등록 덮어쓰기" 한계 해소
- 검증: 등록 7Fz44v6c→/record 리다이렉트 확인, 미등록 Ypv7eDfD→입장 폼 확인, tsc 0

## 03 기록 페이지 — Paper "03 — 바다의 기록 · 여덟 줄기" 아트보드 파리티 — 2026-07-25
정본: Paper NFC 페이지 아트보드 03(66A-0, 390×4700). get_jsx(inline-styles)로 실측값을 뽑아 코드와 대조 후 차이만 수정.
- [x] S1 히어로: "OWNED BY {소유자}" 라인 추가(`heroStatusOwner`, mono 8px/0.12em/62%). record/page.tsx가 fetchBottleOwner로 마스킹 이름 전달
- [x] S2 여정: 섹션 padding 44/52 → 40/56
- [x] S3 여덟 줄기: 배경을 blue2→blue1(22%) 그라디언트로(기존 flat void) · 높이 1380→1296 · SVG top 90→6 · 계절 라벨 top 84/384/684/984/1284 → 18/300/600/900/1200 · 스테이션 top +84 오프셋 제거(126/266/406/546/696/836/976/1116) · 계절·스테이션 라벨 10px→9px, font-weight 500 제거
- [x] S3 스테이션 라벨 접미: "수온 · 12개월 평균" 형식(`metricAgg` avg/max/depth, 5개국어). 개월 수는 입수·인양 연도차×12, 수압은 "수심 30M"
- [x] data.ts: 조위·파고를 mean → **max**로 변경(시안 라벨이 "12개월 최고"). 컬럼이 `*_avg`뿐이라 "일평균 중 최댓값" 의미
- [x] S4 수렴: 배경을 blue1→void(55%) 그라디언트로(기존 flat void)
- [x] S5 표: 원산지 5행→3행(메종·지역·품종), 해저 숙성 5행→3행(숙성 기간·숙성 환경·위치). 값 포맷 `durationFmt`("2026년 1월–12월 · 12개월")·`envFmt`("완도 해역 · 수심 30m")·좌표. 마지막 행 하단 보더 제거(시안은 열린 표) · tables margin-top 30→28
- [x] Owner Services: padding 60/52 → 64/58
- [x] 푸터: padding-bottom 40→30 · 로고 27px→34×28(opacity .82)/워드마크 124→132×20(opacity .9, -2px)/gap 8→12 · 태그라인 mt 14→16, 색 72%→56% · cols mt 30→32 · base mt 32→34, 9px→8px, 60%→36% · 보더 12%→10%
- [x] 언어 선택: 국기 이미지 제거(Paper 03·SPEC B 모두 국기 없음 — 버튼/패널 모두 코드+언어명만). 버튼 필 형태는 SPEC B 기준 유지
- [x] 검증: tsc 0 · eslint /b 신규 error 0(기존 warning 1) · pnpm build 성공 · Playwright 390×844 실측 — 섹션 높이 journey 246 / flow 1296 / converge 436 / footer 291로 Paper 계산치와 일치, 히어로 OWNED BY·S3 라벨 정렬·표 3+3행·푸터 렌더 확인
- 남은 차이(의도): 히어로는 Paper 820px 고정 대신 100svh 유지(실기기 대응) · ko 타이틀은 J1950 텍스트 대신 PNG 아트디렉션 유지 · 원산지 3행은 PROVENANCE 보유 제품(atomes_crochus)에서만 전부 표시, first_edition은 메종 1행

## 03 기록 페이지 — S3 모션 리파인 (design-taste-frontend 기준) — 2026-07-25
디자인 리드: premium-consumer 기록 페이지, 조용한 서사 언어. 다이얼 VARIANCE 7 / MOTION 5 / DENSITY 4.
- [x] **카운트업을 스크럽에 결속** — 기존엔 `[data-count]`가 자기 IO 트리거(`top 85%`)로 발화해 금빛 줄기가 도착하기 전에 숫자가 다 세어짐. 서사("바다가 기록한다")가 깨지는 최대 원인. 줄기 선단 y좌표 기준 쓰기 구간(top-40 ~ +110px)으로 묶고 power3.out 보간. 진입 전 0, 통과 후 목표값 유지, 역스크롤 시 되감김
- [x] 이징 토큰 `--b-out: cubic-bezier(0.16, 1, 0.3, 1)` 신설. 파일 전역의 브라우저 기본 ease(0.25,0.1,0.25,1)를 일괄 교체 (리빌·인트로·태그)
- [x] 태그 점등 비대칭화 — 켜짐 0.34s / 꺼짐 0.9s. 대칭 페이드는 기계적으로 읽힘. `translateY(-2px)` 미세 변위 추가(색만 바뀌던 상태 → 물리적 반응)
- [x] `back.out(2)` 오버슈트 2곳 제거 — S2 여정 원 → power3.out, S4 수렴 점 → expo.out 1.4s. 바운스는 장난감 톤이라 브랜드 어긋남
- [x] S2 패스 드로잉 power2.out 1.0s → expo.out 1.25s, stagger 0.14→0.16
- [x] 검증: tsc 0 · build 성공 · Playwright 스크롤 실측 — y1250 전부 0 → y1400 수온 완료·염분 31.4 쓰는 중 → y1450 조위 280 쓰는 중 → y1520 조위 369 완료·해류 0.31 → y1700 조류 37. 점등은 항상 "쓰는 중"인 1개만
- 미적용(후보): 8줄기 scrub stagger 0.04 → 0.08(줄기별 시차 가시화) · S4 glowDot 무한 펄스(3s, 1→0.55)는 "살아있는 기록" 의미로 유지했으나 진폭 과함

## 03 기록 페이지 — 전체 모션 감사 (design-taste-frontend) — 2026-07-25
스킬 핵심 잣대: "MOTION MUST BE MOTIVATED"(위계·서사·피드백·상태전환 중 하나로 한 문장 설명 불가면 삭제) + §4.5 촉각 피드백 + §6.B 감축 필수.
- [x] **촉각 피드백 전무 → 추가** (§4.5). passportCta·passportSub·passportNews·footerCol·langBtn·langOpt·newsSubmit에 `:active` 없음이었음. NFC = 전부 탭인데 눌러도 무반응 → 죽은 버튼. scale(0.985)/translateY(1px)/opacity로 8ms 즉시 반응, hover는 `(hover:hover) and (pointer:fine)`에서만
- [x] **표 통짜 리빌 → 행 단위 stagger**. `.tables` 컨테이너 페이드를 걷고 캡션·행에 `--i` 인라인 변수 + `transition-delay: calc(var(--i)*55ms)`. "기록이 한 줄씩 적힌다" 서사와 일치. 실측 0s→0.275s 순차
- [x] **히어로 위계 신설**. heroStatus와 heroContent가 같은 delay 0.3s로 동시 등장 → 무엇을 볼지 지시 못 함. 주인공(N°·타이틀) 0.3s, 상태 라벨 `introFadeD2` 0.85s
- [x] **상태 전환 모션 추가**. 언어 패널·뉴스레터 폼이 애니메이션 0으로 팝인했음 → `panelRise`(버튼 기준 transform-origin bottom right, 0.34s)·`formOpen`(0.4s)
- [x] glowDot 무한 펄스 완화 — 3s/1→0.55(45% 스윙, 깜빡임으로 읽힘) → 4.5s/1→0.82(호흡)
- [x] 카운트업 이징 통일 — 히어로 power2.out 1.4s → expo.out 2.0s, S5 power1.out 0.8s → expo.out 1.6s
- [x] **8줄기 구조 재설계**(3회 반복 후 확정). 0.04=한 덩어리 / 0.09=앞줄 완주 후 금빛 출발 / from:"end"=금빛 선두지만 8개 관측이 스크롤 앞쪽에 몰리고 뒤가 빔. → **금빛을 stagger에서 분리**해 전 구간을 고르게 훑는 기준선으로 두고(점등이 여기 묶여 있음), 회색 7줄만 duration 1.1 + stagger 0.06으로 엮음
- [x] 감축 모드 가드 갱신 — 신규 애니메이션(panelRise·formOpen·표 stagger·station·촉각) 전부 `prefers-reduced-motion: reduce`에서 무효화
- [x] 검증: tsc 0 · build 성공 · eslint /b 신규 error 0. 스크롤 실측 y1000→126 점등 / y1200→406 / y1600→836 / y1800→1116, 8개가 전 구간 균등 분포. 금빛은 회색 다발 중앙 관통(y1400 회색 35~67% · 금빛 51%)
- 미해결(우선순위 낮음): `.station` 트랜지션에 box-shadow 포함(§6.A는 transform/opacity만 권장) — 동시 활성 1개뿐이라 실측 부담 작다고 판단해 유지 · 스케일 계산에 `window.addEventListener("resize")` 2곳, ResizeObserver가 정확하나 모션 아님

## NFC 페이지 세션 — Paper 파리티·모션·iOS 저장·프라이버시 — 2026-07-25
하루 분량이 커서 결정 근거 위주로 남긴다. 수치는 코드가 정본.

### Paper ↔ 코드 양방향 정합
- [x] 03 기록 아트보드 실측(get_jsx inline-styles) 후 코드 수정 — S3 배경 그라디언트·좌표(SVG top 90→6, 스테이션 +84 오프셋 제거)·라벨 9px·표 3+3행·푸터 수치. 상세는 위 "Paper 파리티" 절
- [x] 코드가 앞서간 항목을 Paper에 역반영 — 04 헤더(인장형)·도판+캡션·블록 배경 void 통일·03 스테이션 태그·수렴 금색 한 획
- [x] SPEC A에 구현 확정 모션 사양 기록(이징 토큰·스크럽·게이트·순서 종속·감축). **값만이 아니라 이유를 적었다** — 근거 없으면 "stagger 주면 예쁘겠는데" 하고 되돌려진다
- 04H(헤더 3안)·04I(상단 정돈 2안)은 선택 완료된 시안 이력. 정리 여부 미정

### 모션
- [x] 관측값 카운트업을 금빛 선단에 결속(별도 IO 트리거 제거) — 서사 단절의 최대 원인이었다
- [x] 이징 토큰 `--b-out: cubic-bezier(0.16,1,0.3,1)`. 브라우저 기본 ease 전면 폐기
- [x] 태그 점등 비대칭(0.34s/0.9s) + translateY(-2px). 앰버가 아이보리보다 어두워 색만 바꾸면 가라앉는다
- [x] 빠른 스크롤 끊김 — S3(0.8)보다 S4가 0.6이라 지연이 짧은 쪽이 먼저 도착했다. **스크롤 간격으로는 못 고친다(시간 축 문제)** → S4 획 길이를 금빛 진행도(0.94~1.00)로 게이팅, 티커에서 직접 계산(트윈이 멎어도 해제됨)
- [x] 금빛을 흰 줄기 **위**에 그리고 원까지 한 획(`L 195 274.5`). 아래 깔면 겹치는 구간에서 가려져 끊겨 보였다
- [x] 병 사진 리빌을 수렴 점(d≥0.95)에 종속. IO 쓰면 순서가 뒤집힌다

### iOS 인증서 저장 (실기기 시뮬레이터 검증)
- [x] **원인**: WebKit이 foreignObject 안에서 큰 이미지를 통째로 흘린다(로고 PNG 37KB는 나오고 병 WebP 326KB만 빠짐). 예열 렌더·포맷 변환·createImageBitmap 전부 우회 실패
- [x] **해법**: 사진만 foreignObject 밖으로. 사진 숨긴 판을 toPng로 굽고 캔버스 drawImage로 얹는다(`object-fit: contain` letterbox 재현). drawImage는 이 문제가 없다
- [x] 저장·공유를 `deliver()`로 통합 → 공유 시트(iOS는 사진첩 직행 API 없음). AbortError는 실패로 처리하지 않음
- [x] 저장 중 스윕 애니메이션. `will-change: transform`로 컴포지터에 올려야 toPng가 메인 스레드를 잡는 동안에도 돈다
- ⚠️ `cacheBust: true`가 예열을 무력화한다(매번 새 URL). 제거 필수

### 이름 공개 정책 전환 (되돌리기 쉬운 결정이라 근거 필수)
- [x] **이름은 공개, 이메일만 마스킹.** 근거: NFC 근접 ≠ 소유(병은 선물·접대 자리에 놓인다). 이메일은 인증서에 있을 이유가 0인데 연락처 식별자라 위험만 크다. 이름은 등록자가 "인증서에 남길 이름"으로 **직접 정한 값**이라 시스템이 아니라 본인이 노출 범위를 통제한다
- [x] `BottleOwner.nameMasked` → `name`. 필드명이 곧 노출 범위. `maskName` 삭제(살려두면 되살아난다)
- [x] 등록 폼 안내에 "병을 태그하는 누구에게나 보입니다" 명시. 옛 문구("발급에만 사용")로는 공개 동의로 못 본다
- 전환 시점 등록 3건(전부 테스트)이라 소급 문제 없었음

### 안전영역 (gbrain `ios26-사파리-상태바-루트틴트-전면fixed금지` 참조)
- [x] iOS 26은 `theme-color`를 무시하고 `html` 배경을 샘플링한다. `/b` 레이아웃에 `b-root` 마커 + `html:has(.b-root)`로 모바일 아이보리 규칙을 되돌림
- ⚠️ CSS가 안 먹으면 Turbopack 캐시. `rm -rf .next` 후 재시작 (이번에도 걸림)

### 미결
- 되돌아가기 링크 4곳의 `→` — 왼쪽 셰브론 `‹` 제안했으나 미결
- meetup 푸터 태그라인이 /b와 다름(`~하는 브랜드` vs `~합니다`)
- 저작권 2줄과 언어 버튼 밑선 정렬 어긋남
- 저장 PNG에 서명 미포함
- 인증서 해시는 앞 16자만 표시(전체 64자 아님)

## NFC 페이지 — 인증서 서명 실체화 + 미결 정리 — 2026-07-25 (세션 후속)

### 인증서 디지털 서명을 실제 서명으로 (HMAC)
- [x] 기존 `makeSignature`는 공개 필드(코드·병번호·제품)만 SHA-256으로 해싱했다. 입력이 전부 화면에 있는 값이라 **누구나 같은 값을 계산할 수 있었다** — 지문이지 서명이 아니다. `디지털 서명`·`ISSUED BY ...` 라벨이 실제보다 큰 주장을 하고 있었음
- [x] `signCertificate()`를 `owner-auth.ts`로 옮기고 `createHmac("sha256", SECRET)`로 전환. **비밀키를 그 파일 밖으로 내보내지 않기 위해** 인증서 page.tsx는 함수만 호출한다
- [x] 도메인 분리자 `mdm-cert-v1|` 부착. 세션·OTP·이전 토큰이 같은 키를 쓰므로, 구분자가 없으면 한 용도의 서명이 다른 용도에서 통용될 여지가 생긴다. `v1`은 나중에 방식을 바꿔도 구값과 안 부딪히게
- [x] SECRET 미설정이면 `null` 반환 → 호출부가 블록 자체를 숨긴다. 평문 해시로 폴백하면 겉보기는 같은데 보증만 사라진 상태가 되고 그게 제일 위험
- [x] 검증: 같은 입력으로 이전 `29F4 5C52 8832 DD64` → 이후 `C52C 6B0C 1436 63BB`. 비밀키 없이 재현 시도 불일치(false) 확인
- 판단 유지: **앞 16자(64비트)만 표시.** 위조에 2^64 작업이 필요해 표시용 검증코드로 충분하고, 64자를 모바일 인증서에 넣으면 4줄짜리 난수 덩어리가 되어 디자인이 무너진다. 500병 규모에서 충돌 위험도 없음
- ⚠️ `SHA-256` 라벨은 엄밀히는 HMAC-SHA256이다. 사용자 확인 전이라 문구는 건드리지 않음

### 저장 PNG에 서명 포함
- [x] printCard 문서번호 아래에 자물쇠+다이제스트 한 줄 추가(`printSign`). **저장본은 화면을 떠나 혼자 남는다** — 문서번호만 있으면 대조할 근거가 없다
- [x] 색 0.34 → 0.42. 옮겨 적을 수 있어야 증거 구실을 한다. 문서번호(10px/0.5)보다는 눌러 위계는 유지

### 되돌아가기 화살표 4곳 → 셰브론 SVG
- [x] `→` 문자 전부 제거하고 푸터와 같은 5×9 폴리라인 셰브론으로 통일. **방향이 곧 의미** — 되돌아가기는 텍스트 왼쪽에 좌향(`4.1,0.9 0.9,4.5 4.1,8.1`), 진행은 오른쪽에 우향
- [x] 좌향: certificate `backLink`, owner `footerLink` / 우향: transfer `secondary`, entry `provHint`
- [x] 4곳 모두 `flex-shrink: 0` + `translateY(1px)` 광학 보정(푸터 화살표와 동일 규칙)

### 푸터 저작권·언어 버튼 밑선 정렬
- [x] 원인: `align-items: flex-end`가 **상자**를 맞춘다. 저작권은 대문자뿐이라 시각적 밑선 = 베이스라인인데, 필의 밑선은 테두리 → 필이 3px 밑으로 흘러내려 보였다
- [x] `.footerLang`(record)·`.langSelect`(certificate)에 `margin-bottom: 3px`. 실측 결과 필 하단이 저작권 베이스라인과 정확히 일치(gap 0), 덤으로 필 상단도 저작권 블록 상단과 일치
- 측정법: 대상 끝에 `display:inline-block;height:0;vertical-align:baseline` 스팬을 붙였다 떼서 베이스라인 y를 읽음. 스크린샷 육안으로는 3px을 못 잡는다

### 태그라인 통일
- [x] meetup 푸터 `바다의 시간을 기록하는 브랜드` → `바다의 시간을 기록합니다.` (/b와 통일, 자기규정 제거 원칙 적용)
- [x] OTP 메일 셸 푸터도 폐기 문구 `~하는 디지털 아카이브.`가 남아 있어 같이 교체
- meetup 히어로(`MeetupView.tsx:137`)의 `~하는 브랜드`는 유지 — 그 자리는 브랜드 정의문이고, 덕분에 푸터와 겹쳐 읽히던 중복도 없어졌다

### 검증
- tsc 0 · pnpm build 성공 · eslint /b 신규 error 0(meetup `no-html-link-for-pages`는 355행 기존 이슈, 이번 변경과 무관)
- Playwright 390×844 실측 — 인증서 되돌아가기 셰브론·서명 블록(`C52C 6B0C 1436 63BB`)·푸터 정렬, printCard 서명 줄, entry provHint 셰브론, owner 푸터 셰브론 확인
- transfer `done` 상태는 실제 수락된 이전이 있어야 렌더돼 **라이브 확인 못 함**(빌드·타입만 통과). 마크업은 나머지 3곳과 동일 패턴

### ⚠️ 프로덕션 환경변수 미등록 (배포 전 필수)
`vercel env ls production` 결과 아래 3개가 없다.
- `BOTTLE_SESSION_SECRET` — **없으면 소유자 인증이 통째로 죽는다.** `verifySession`이 항상 null을 반환해 OTP를 맞춰도 세션이 안 서고, 인증서 서명 블록도 사라진다
- `KHOA_OBS_CODE` · `KHOA_TIDAL_OBS_CODE` — 관측 실데이터 연동용. 없으면 정적 폴백으로 떨어진다(`KHOA_API_KEY`는 등록돼 있음)
- 미결: 프로덕션 비밀키를 로컬 것과 공유할지 새로 발급할지 — 분리 발급을 권함

### 프로덕션 환경변수 등록 — 2026-07-25
- [x] `BOTTLE_SESSION_SECRET` 프로덕션 등록. **로컬과 분리해 새로 발급**(32바이트 랜덤 64hex). 로컬 `.env.local`은 여러 도구를 거치고 백업에도 남아, 한쪽이 새면 프로덕션 세션까지 위조 가능해진다
- [x] `KHOA_OBS_CODE`·`KHOA_TIDAL_OBS_CODE` 프로덕션 등록(로컬 값과 동일 — 관측소 식별자라 분리할 이유 없음)
- [x] 생성한 키 사본은 스크래치패드에서 삭제. 프로덕션 키는 Vercel에만 존재
- ⚠️ **값 회수 불가**: Vercel이 셋 다 Sensitive로 저장해 `vercel env pull`에 빈 문자열로 내려온다. 기존 `RESEND_API_KEY`도 동일하게 빈 값으로 내려오는 걸로 이게 정상 동작임을 확인(비-Sensitive인 `KHOA_API_KEY`는 값이 그대로 보임). **최종 확인은 프로덕션 배포 후 인증서 서명 블록이 보이는지로만 가능**
- 마이그레이션 영향 없음: 프로덕션은 그동안 SECRET이 비어 있어 유효한 세션·토큰이 존재할 수 없었다. DB의 `bottle_owner_verifications` 2행은 로컬 E2E 테스트분(로컬 키로 해싱·TTL 만료), `bottle_transfers` 0행
- 미등록으로 남김: **Preview 환경**. 프리뷰 배포에서 소유자 인증을 테스트하려면 별도 등록 필요(프로덕션 키 재사용 말 것)

## 소유권 이전 기능 제거 — 2026-07-25
결정 근거(사용자): 실제로 병 소유권을 넘길 일이 없다고 판단. 안 쓰는 기능은 남겨두면 공격면·유지보수 부담만 된다.

### 삭제
- 라우트·화면: `/b/[code]/transfer`(page.tsx) · `BottleTransferAccept.tsx` · `transfer.module.css`
- 서버 액션: `initiateTransfer` · `acceptTransfer`(owner-actions.ts). 딸린 `randomBytes` import, 이전 요청 메일 템플릿, `NEXT_PUBLIC_SITE_URL` 참조도 함께 사라짐
- `hashToken()`(owner-auth.ts) — 이전 수락 토큰 해시 전용이라 유일한 호출부가 없어졌다
- 소유관리 UI: 「소유권」 그룹 전체(카드·폼·`window.confirm` 재확인) + `Panel` 타입의 `"transfer"` + tr* 상태 3개
- CSS: `.transferCard/.transferTitle/.transferSub/.transferBtn/.transferSent`
- 카피 5개국어: `ownRightsHead` · `ownTransfer` · `ownTransferSub` · `ownTransferCta` (24줄)

### 남은 문구 정리 (이게 진짜 버그였다)
- `forms.ts:283` 재등록 차단 메시지가 **"소유권 이전으로만 소유자를 변경할 수 있습니다"**였다. 이전 기능을 지운 순간 존재하지 않는 경로를 안내하는 문구가 된다 → `info@musedemaree.com으로 문의해 주세요`로 교체
- 같은 취지로 `forms.ts:274`·`b/[code]/page.tsx:12` 주석도 갱신

### 남겨둔 것
- **DB `bottle_transfers` 테이블은 그대로 둠**(0행). 드롭은 되돌릴 수 없고 지금 지워서 얻는 게 없다. 정리하려면 별도 마이그레이션으로
- `bottle_ownership_audit`의 `transfer_initiated`/`transfer_accepted` 이벤트 문자열 — 기록된 행이 없어 손댈 것 없음
- `NEXT_PUBLIC_SITE_URL` — 유일한 사용처가 이전 링크였다. 지금은 코드베이스에서 미사용(env 등록도 안 돼 있음)

### 검증
- tsc 0 · eslint /b error 0(기존 warning 2) · `pnpm build` 성공
- 라우트 목록에서 `/b/[code]/transfer` 사라짐 확인 · 실제 접근 404
- Playwright 390×844 — 소유관리 페이지가 「소유자 정보」 그룹에서 바로 푸터로 이어짐. 레이아웃 깨짐 없음
- ⚠️ `.next` 캐시가 삭제된 라우트 타입을 붙들고 tsc를 깨뜨린다 → `rm -rf .next` 필요(이번에도 걸림)

### 후속: 이름 수정 = 사실상 소유권 이전이었다 — 2026-07-25
사용자 질문("이름 수정이 소유자 변경과 뭐가 다른거야?")으로 드러난 구멍. **결론: 달랐던 게 없었다.**

기존 `updateOwnerInfo`는 `bottle_registrations` 최신 행의 `name`과 **`email`을 함께** 덮어썼다. 소유권 모델이 "최신 행 = 현 소유자"라, 이메일을 남의 주소로 바꾸면 그 순간부터 OTP를 그쪽이 받는다. 심지어 방금 지운 이전 흐름보다 안전장치가 적었다.

| | 소유권 이전(삭제됨) | 기존 이름·이메일 수정 |
|---|---|---|
| 받는 쪽 동의 | 토큰 링크 수락 필요 | 없음(즉시) |
| 되돌리기 경고 | window.confirm | 없음 |
| 감사 기록 | initiated → accepted 2단 | edit 1줄 |
| 이전 소유자 기록 | 새 행 추가로 보존 | **덮어쓰기로 소실** |

#### 조치 — 이메일 변경 차단(옵션 1)
- [x] `updateOwnerInfo(nfc, name, email)` → **`updateOwnerName(nfc, name)`**. 이메일 파라미터 자체를 없앴다. 인자로 남겨두면 언젠가 다시 쓰인다
- [x] 세션 이양(`setOwnerSession`) 제거 — 인증 주체가 안 바뀌므로 필요 없다
- [x] **행 특정을 세션 이메일로 검증**: 최신 행만 집으면 그 사이 소유자가 바뀌었을 때 인증한 사람과 다른 행을 고친다. `latest.email !== session.email`이면 거부
- [x] 감사 이벤트 `edit` → `edit_name`, detail에 `{from, to}` 기록(이전엔 바뀐 값만 남아 무엇이 어떻게 변했는지 몰랐다)
- [x] 이름 60자 상한
- [x] UI: 편집 패널의 이메일을 읽기 전용으로. 입력칸과 같은 자리에 두되 밑줄을 빼서 "못 고친다"가 보이게(`panelStatic`) + 안내 한 줄(`panelNote`). 줄바꿈은 `<br>`로 통제 — 자동 감김에 맡기면 "문의해 / 주세요"로 쪼개진다
- [x] 카피 5개국어: `ownEditName` "이름과 이메일 수정" → "이름 수정"
- [x] `EMAIL_RE` 삭제(유일한 사용처였음)

#### 검증
- tsc 0 · eslint /b error 0 · build 성공
- 로컬 비밀키로 세션 쿠키를 만들어 인증 상태 재현 → 이름 "백호암"→"백호암 테스트" 저장
  - DB 확인: `name` 변경, **`email` 그대로**
  - 감사 로그: `edit_name` / `{from:"백호암", to:"백호암 테스트"}`
  - 테스트 후 이름 원복
- 미인증 상태로 「이름 수정」 클릭 → 편집 패널 대신 OTP 인증 패널이 열림(서버 액션에도 세션 가드 이중)

### 이름 수정 패널 — 편집 대상만 강조 — 2026-07-25
이메일이 읽기 전용이 됐는데 이름과 같은 크기(16px)로 나란히 있어, 둘 다 고칠 수 있어 보였다. **크기가 편집 가능 여부를 먼저 말하게 한다.**
- [x] 이름 입력 16px → **22px**/lh 30, 밑줄 0.24 → 0.32. 위 아이덴티티 헤드라인(26px)보다 한 단계 작게 둬서 "그걸 고치는 중"으로 읽히되 주인 자리는 안 뺏게 (`panelInputLead` 수정자 — `.panelInput`은 OTP 코드 입력과 공유라 기본값 유지)
- [x] 이메일 값 16px → **12px**, 0.62 → 0.5. 라벨도 0.46 → 0.3(`panelLabelMuted`). 안내문 0.4 → 0.34, 간격 8 → 6
- [x] 22px는 iOS 자동 확대 임계값(16px) 위라 입력 시 줌 안 걸림
- [x] 실측 확인: 22px/30px·rgba(...,0.32) · 이메일 12px/0.5 · 라벨 9px/0.3 · 안내 10px/0.34, 안내는 의도한 2줄
- 함정 주의: `.panelInputLead`의 `border-bottom-color`(longhand)가 `.panelInput`의 `border-bottom`(shorthand)을 덮으려면 **파일에서 뒤에 와야** 한다. `:focus`는 (0,2,0)이라 앰버 포커스는 그대로 이김

### 편집 패널 경계 — 어디부터가 편집 영역인지 — 2026-07-25
지적: 「이름 수정」을 눌러 열린 편집 폼이 설정 행들과 구분 없이 이어져, 어디가 수정 가능한 곳인지 안 보인다.

**원인**: `.settingRow`가 `border-top` 하나로 구분되는데, 입력칸 밑줄(`border-bottom`)이 그 구분선과 굵기·색이 거의 같다. 결국 라벨·값·구분선이 한 줄기로 읽힌다.

- [x] `.editPanel` 신설 — `--o-elev` 배경 + 0.5px 테두리 + 패딩 18px. **인증 패널(`.authPanel`)과 같은 처리**를 써서 "행에서 펼쳐진 면"이라는 언어를 하나로 맞췄다(새 스타일 발명 대신 기존 패턴 재사용)
- [x] 여백을 위 6px / 아래 20px로 비대칭 — 카드는 위 행에 속하므로 근접성으로 소속을 표시
- [x] 열린 행 표시(`settingRowOpen`): 제목·화살표 앰버 + 화살표 90° 회전(`›` → 아래). `aria-expanded`도 부여. 어느 행에서 나온 면인지 보여준다
- [x] 회전 트랜지션 0.34s(프로젝트 이징) + `prefers-reduced-motion` 가드. 이 파일의 유일한 모션이라 상태 전환에만 한정
- [x] **덤으로 잡은 버그**: 취소 126px / 저장 169px로 반반이 아니었다. 크롬이 `flex-basis: 0`을 콘텐츠 박스로 잡아 `.panelBtn`의 좌우 패딩 44px이 그 위에 더해진다. `.panelRow .panelBtn`에서 패딩 제거 → 148/147
- [x] 검증: 카드 x24 w342(섹션 거터와 동일) · 행→카드 6px · 카드→다음행 20px · 화살표 `matrix(0,1,-1,0,0,0)` · 제목 rgb(204,173,123) · 버튼 148/147. OTP 패널은 `.panelRow` 밖이라 영향 없음

### 소유 병 카드 N° 가로 조판 + 셰브론 정렬 재보정 — 2026-07-25
- [x] `.linkedSerial` 세로(54×68 고정) → **가로 1줄**. `align-items: baseline` + gap 7px + 패딩 9/14/11로 크기는 내용이 정하게. 인증서 print 카드의 에디션 표기(`.printEdition`)와 같은 규칙 — 새로 만들지 않고 기존 조판 언어를 가져왔다. 실측 72×51(전 54×68), 카드 높이 89
- [x] **셰브론 `translateY(1px)` → `0.5px` (7곳 일괄)**. 지적("살짝 내려가 있다")이 맞았고 1px이 과했다

#### 측정 방법 (눈대중으로는 못 잡는 크기라 기록해 둔다)
줄상자 중심이 아니라 **글자의 실제 잉크 중심**과 비교해야 한다. 캔버스 `measureText`의 `actualBoundingBoxAscent/Descent`로 잉크 범위를 얻고, 대상 끝에 `display:inline-block;height:0;vertical-align:baseline` 스팬을 붙였다 떼서 베이스라인 y를 읽어 합산.

| 위치 | 글자 | 1px일 때 오차 | 0.5px일 때 |
|---|---|---|---|
| owner 되돌아가기 | 11px | +0.37 (아래) | −0.13 |
| certificate 되돌아가기 | 11px | +0.37 | −0.13 |
| record 뉴스레터 | 11.5px | +0.43 | −0.07 |
| entry provHint | 12px | +0.53 | +0.03 |
| record 푸터 BRAND·JOURNAL | 12px | — | −0.01 |

- 0.5px을 고른 이유: 필요값이 폰트·크기별로 0.47~0.63px이라 하나로 묶으면 ±0.2px 안에 다 든다. **DPR 2에서 정확히 1디바이스픽셀**이라 1px 획이 흐려지지도 않는다. em 단위는 비율이 0.039~0.057로 안 맞아 포기

### 소유한 병 카드 재설계 — 2026-07-25
지적: "내가 소유한 리스트를 보는 곳인데 대충 보인다. 바다에서 숙성된 제품을 소유하고 있다고 느껴져야 한다."
디자인 리드: 소장품 레지스터 카드 · 소유자 본인용 · 조용한 editorial luxury(Abyssal Amber) · VARIANCE 7 / MOTION 4 / DENSITY 3.

#### 진단 (왜 대충 보였나)
1. **병이 없었다.** 소장품 카드인데 제품 사진이 0장. 숫자 상자 하나가 유일한 시각 요소라 설정 행처럼 읽혔다 (스킬 §4.8 — 텍스트만 있는 건 미니멀이 아니라 미완성)
2. **위계 역전.** 유일한 시각 요소가 N° 상자라 그게 주인공이 되고 제품명이 눌렸다
3. **정보가 캡션 한 줄.** "해저 숙성 · 남해 · 12개월"을 점으로 이어붙여 무엇이 무엇인지 안 읽혔다. 게다가 **"12개월"이 하드코딩 카피**라 실제 숙성 기간과 무관했다
4. **소장 맥락 없음.** 섹션 제목조차 없어 목록이 아니라 떠 있는 위젯이었다

#### 설계
- **병 사진 도입** — `meta.imagePortrait`(b-cert-bottle.webp)를 앰버 헤어라인 액자에. 인증서의 도판 액자(`.plateFrame`)와 같은 언어라 두 화면이 이어진다. next/image 사용(인증서와 동일)
- **위계**: 사진(실체) → N° 89 / 100(몇 번째인가, 세리프 30px 앰버) → 제품명(Cormorant 21px) → 품종·스타일 → 짧은 앰버 획 → 바다 기록
- **바다 기록은 라벨 위·값 아래 2열**. 점으로 잇지 않는다. 값은 전부 실제 데이터에서 파생 — `data.aging.depth`, 입수·인양 연도차×12 (하드코딩 제거)
- **카드 재질**: 평평한 elev 한 겹 → 좌상단 앰버 radial(0.09) + 아래로 void에 가라앉는 linear. "케이스 안에 놓인 한 병"의 결
- 섹션 제목 `ownBottleHead` 신설(5개국어) + 설정 그룹과 같은 틀(윗선 + 30/34 여백). NFC 1개 = 병 1개라 **개수 표기는 넣지 않았다** — 늘어날 수 없는 목록에 카운트를 달면 거짓말이 된다
- `:active` 촉각 피드백 추가(§4.5). 기존 카드엔 없었다

#### 조판 함정 2건
- **셰브론 제거**: 행 화살표가 28px을 먹어 "Petit Meslier · Ultra-Brut"이 "Ultra- / Brut"로 쪼개지고 있었다. 카드 자체가 큰 탭 대상이라 화살표는 군더더기
- **여유 0 → 31px**: 셰브론을 빼도 품종 줄이 정보칸(175px)에 딱 맞았다(여유 0). 9px→8.5px·자간 0.06→0.05em으로 144px까지 줄이고 말줄임을 안전장치로. `PRODUCT_META` 6종 중 이 조합이 가장 길다
- 라벨 폰트: 모노는 한글이 폴백돼 8px에서 뭉갠다 → 본문 폰트 9px + 자간 0.06em

#### 검증
- 실측: 카드 342×218 · 액자 108×178 · 병 72×148 · 품종 줄 1줄(여유 31px) · 앰버 획 26×1
- tsc 0 · eslint /b error 0 · build 성공

### 등록된 소유자 블록 재설계 — 2026-07-25
지적: "너무 심플해."

#### 진단
1. **왼쪽 정렬 텍스트 4줄이 전부.** 라벨 9px → 이름 26px → 이메일 12px → 상태 9px. 크기만 다르고 형태가 같아 폼 출력값처럼 읽혔다
2. **이름이 주인공인데 무게가 없었다.** 26px sans 300은 그냥 큰 글씨. 정작 인증서는 같은 이름을 세리프로 각인한다(`.ownerName`)
3. **브랜드 자산 0.** 인증서·기록엔 인장·액자·헤어라인이 있는데 여기만 맨몸
4. **원형 상태 점이 페이지의 유일한 곡선.** 나머지가 전부 sharp이라 도형 언어가 깨져 있었다(스킬 §4.4 SHAPE CONSISTENCY LOCK)

#### 설계 — "각인된 이름"
- 인장 획(40×1 앰버) → 라벨 → **이름을 `--o-serif-kr` 30px/400으로**. 인증서 `.ownerName`과 같은 언어라 두 화면에서 같은 이름으로 읽힌다. `--o-serif-kr` 변수 신설
- 이메일은 모노 11px로 내려 기록 항목처럼
- 섹션에 위에서 스미는 앰버 radial(0.08). 카드와 같은 재질 언어
- **상태 표시를 두 상태로 갈랐다** — 뜻이 다르기 때문:
  - 미인증 "소유 등록 완료" = 사실 진술 → 작은 사각 마크 + 흘리는 텍스트. **테두리를 두르면 바로 아래 인증 CTA와 같은 상자가 되어 눌리는 것처럼 보인다**
  - 인증 "본인 인증됨" = 증명 완료 → 앰버 테두리 배지 + 자물쇠(record 히어로·인증서 서명과 같은 글리프). 아래가 밑줄 텍스트 링크뿐이라 혼동 없음

#### 검증
- 이름 Noto Serif KR 30px/400 · 인증 배지 91×28 앰버 0.5 테두리 · 미인증 마크 4×4
- 두 상태 스크린샷 확인 · tsc 0 · eslint /b error 0 · build 성공

### 「소식 알림」 행 제거 — 2026-07-25
동작하지 않았다. `›`가 `/b/{code}/record`로 **이동만** 시켰고 앵커도 없어 긴 페이지 맨 위에 떨궜다.

지운 이유:
- **중복 진입점** — 동작하는 구독 폼은 record 하단에 이미 있다(`submitNewsletter` → `newsletter_subscribers`)
- **상태를 못 보여주는 알림 설정** — 설정 토글처럼 생겼는데 구독 여부를 조회할 방법이 없어 켜졌는지 꺼졌는지 표시할 수 없었다. 사용자가 "켜뒀다"고 착각하게 만든다. 없느니만 못함
- 지우면 「소유자 정보」에 "이름 수정"만 남지만, 그게 이 페이지가 실제로 제공하는 전부라는 정직한 반영

제대로 살리려면 필요했던 것(하지 않음): `newsletter_subscribers` 이메일 조회 함수 + 해지 경로(토큰 또는 인증 게이팅). 둘 다 없으면 토글이 아니라 일회성 버튼이어야 하고, 그러면 record 하단과 기능이 겹친다.

- [x] 행 마크업 제거 · `ownNotify`/`ownNotifySub` 5개국어 12줄 제거
- [x] 죽은 CSS 정리: `.toggle`·`.toggleKnob`(마크업에서 이미 미사용), `.soonNote`(옛 "준비 중" 안내 잔재)
- [x] tsc 0 · eslint /b error 0 · build 성공 · 렌더 확인(「소유자 정보」 1행)

### 소유 관리 페이지 푸터 제거 — 2026-07-25
- [x] `소유 기록 · N° 89`(footerMeta) 삭제 — 바로 위 병 카드에 이미 있는 정보였다
- [x] **푸터 통째 제거.** 백링크가 헤더 `‹`와 목적지(`/b/{code}/record`)까지 **완전히 같은 중복**이었다(스킬 §4.5 NO DUPLICATE CTA INTENT). 390×844에서 페이지가 63px만 스크롤돼 하단 출구도 불필요
- [x] `.footer`/`.footerLink`/`.footerLinkArrow`/`.footerMeta` CSS + `ownBackRecord` 5개국어 + 미사용이 된 `serialLabel` 정리
- [x] `.frame`에 하단 여백 `max(40px, env(safe-area-inset-bottom) + 26px)` — 푸터가 없어져 마지막 섹션이 홈 인디케이터에 붙었다

#### 파생 이슈 2건 (제거만 하고 끝냈으면 놓쳤을 것)
- **작은 화면에서 출구 소실**: 375×667은 172px 스크롤되는데 헤더가 `static`이라 내려가면 유일한 출구인 백버튼이 사라졌다 → 헤더 `position: sticky; top: 0; z-index: 5` + void 배경
- **`overflow: hidden`이 sticky를 죽였다**: `.frame`의 `overflow: hidden`이 스크롤 컨테이너를 만들어 sticky가 문서 스크롤에 반응하지 않았다(적용은 됐는데 헤더 top이 -172로 밀림). `overflow-x: clip`으로 교체 — clip은 스크롤 컨테이너를 만들지 않으면서 가로 넘침만 자른다
- 검증: 375×667 최하단 스크롤에서 헤더 top 0 · 백버튼 보임 · 가로 스크롤 없음. 390×844는 스크롤 0(한 화면)

## /b 로케일 지속 (쿠키) — 1단계 — 2026-07-25
문제: 언어 선택이 화면마다 로컬 `useState("ko")`라 페이지를 넘어가면 초기화됐다. 실측으로 확인 — record에서 FR을 골라도 「소유 정보 관리」로 넘어가면 한국어, certificate로 가면 언어칩이 KO로 리셋. **선택이 그 화면에 머무는 동안만 유효**했다.

### 쿠키를 고른 이유 (URL·localStorage 대비)
- 경로 스코프(`path=/b`)로 세 화면이 자동으로 따라온다. 내부 링크에 `?lang=` 파라미터를 달 필요가 없다
- **서버에서 읽히므로 첫 렌더부터 맞는 언어**로 그린다. localStorage는 서버가 못 읽어 첫 프레임이 한국어로 깜빡인다
- 이미 `bo_{code}` 세션 쿠키를 쓰고 있어 패턴이 있다
- 한계(수용): 링크를 공유하면 언어는 따라가지 않는다. 개인 소장 화면이라 공유 시나리오가 약하다고 판단

### 구현
- `src/app/b/_lib/locale.ts` 신설 — `BOTTLE_LANG_COOKIE("b_lang")` · `parseBottleLocale()`(화이트리스트 검증, 모르는 값이면 ko) · `persistBottleLocale()`(브라우저 전용, https일 때만 `secure`)
- 서버: entry·record·certificate `page.tsx`가 쿠키를 읽어 `initialLocale`로 전달 (세 라우트 모두 `force-dynamic`이라 쿠키 읽기 문제 없음)
- 클라이언트: 세 컴포넌트가 `useState(initialLocale)`로 시작하고, 선택 시 `persistBottleLocale()` 호출
- httpOnly 아님 — 클라이언트가 직접 써야 하고 담긴 값은 언어 코드뿐

### 검증
- Playwright E2E: record에서 FR 선택 → 쿠키 `b_lang=fr` (path `/b`) → certificate 이동 시 칩 FR·"Enregistrer le certificat" → record 재방문도 FR 유지
- **SSR 실측**(깜빡임 없음 확인): `curl -H "Cookie: b_lang=fr"` 첫 응답 HTML에 "Nous enregistrons le temps de la mer" 포함
- 입장 페이지도 따라옴: 쿠키 FR → "Inscrire votre nom", 쿠키 없음 → "이름을 새기다"
- 잘못된 값 폴백: `b_lang=xx` → 한국어
- tsc 0 · eslint /b error 0 · build 성공

### 2단계 대기 (owner 다국어)
owner 페이지는 여전히 `RECORD_EXTRA.ko` 하드코딩이고 UI 문자열 18개가 카피 키 없이 JSX에 박혀 있다("이름"·"이메일"·"취소"·"저장"·"본인 인증됨"·"본인 인증에 쓰이는 주소입니다" 등). 추출 후에야 언어 선택이 의미를 갖는다(문자열 18 × 5언어).

## /b 로케일 지속 — 2단계 (owner 다국어) — 2026-07-25
- [x] 하드코딩 문자열 **20건**을 카피 키로 추출, 5개국어 작성(`ownAuthed`·`ownSignOut`·`ownAuthOpen`·`ownOtp*` 8개·`ownField*` 2개·`ownEmailLocked`/`ownEmailLockedTo`·`ownCancel`/`ownSave`/`ownSaving`·`ownErr*` 3개·`ownMonths`)
- [x] `{email}` 치환 2곳(OTP 발송 안내, 문의처). 문의 주소는 `OWNER_CONTACT_EMAIL` 상수로 빼서 5개국어에 중복하지 않음
- [x] `{n}개월`도 하드코딩이었다 → `ownMonths`로. 병 카드의 숙성 기간이 로케일을 안 따르고 있었다
- [x] owner `page.tsx`가 `b_lang` 쿠키를 읽어 `locale` prop 전달. 컴포넌트는 `RECORD_EXTRA[locale]`
- [x] **owner에 언어 선택기는 두지 않았다.** 전환은 입장·기록·인증서에서 하고 여기는 따라오기만 한다 — 선택 지점을 늘리면 어디서 바꾸는지 흐려진다
- [x] 죽은 카피 키 정리: `ownLinkedSub`(병 카드 재설계로 대체) · `ownSoon`(옛 "준비 중" 안내) · `passportSave`(저장 CTA 통합 때 사라짐) 5개국어 18줄

### 긴 로케일에서 드러난 레이아웃 버그
- `.settingRow`가 프랑스어에서 342 → **352px로 넘쳤다**. `.settingText`가 플렉스 기본 `min-width: auto`라 줄어들지 못했다("Reporté sur le certificat et le relevé de propriété."). `flex: 1; min-width: 0` 추가
- 한국어만 보고 있었으면 못 잡았을 문제 — **다국어 배선의 실제 값어치는 번역이 아니라 레이아웃 검증**에 있었다

### 검증
- 5개 로케일 SSR 전수(`curl -H "Cookie: b_lang=..."`) — 섹션 제목·CTA·개월 표기가 전부 해당 언어로
- 5개 로케일 가로 넘침 0 · 문서폭 390 고정
- fr 인증 상태 편집 패널 실측 — "Identité vérifiée" 배지, 안내문 2줄 유지, 버튼 148/147
- 컴포넌트에 남은 하드코딩 한글 0건(주석 제외) · tsc 0 · eslint /b error 0 · build 성공

### owner 설정 화면에 언어 행 추가 — 2026-07-25
사용자 제안: "설정 같은 페이지니까 이름 변경 아래 언어 선택을 추가할까?" — 동의. 앞서 반대했던 건 **푸터** 복제였고, 설정 행은 성격이 다르다. 기록·인증서는 언어를 푸터 맨 아래에 묻어 두는데, 설정 화면의 행이 훨씬 찾기 쉽다.

- [x] 「소유자 정보」 그룹에 언어 행 추가. 서브 텍스트가 현재 언어(`한국어`·`Français`…)라 열지 않아도 상태가 보인다
- [x] 열면 5개 목록이 펼쳐진다(코드 · 언어명 · 앰버 체크). 드롭다운이 아니라 리스트 — 설정 화면이고 탭 대상이 크다
- [x] 선택 시 `persistBottleLocale()` + `router.refresh()`. **이 화면의 언어는 서버 prop이라 refresh 없이는 안 바뀐다**
- [x] `.editPanel` → `.rowPanel`로 개명(이름 수정·언어 두 곳이 쓰므로 역할에 맞게)
- [x] 카피 `ownLanguage` 5개국어

#### 조판 함정 (실측 아니면 못 봤을 것)
- 열린 행의 `›` 글리프를 90° 회전하니 **바운딩 박스가 5×24 → 24×5**로 커져 행이 10px 넘쳤다. transform은 레이아웃에 영향이 없지만 overflow는 만든다
- 16×16 정사각 박스로 고정 → 10px에서 4px로 줄었을 뿐. 글리프의 라인박스가 여전히 새어 나왔다
- **해결: `›` 글리프를 5×9 SVG 셰브론으로 교체**(2곳). SVG는 크기가 정확해 이 문제가 원천적으로 없고, /b의 다른 셰브론과 모양도 하나로 맞는다
- ⚠️ **dev 서버를 켠 채 `rm -rf .next`를 하면 Turbopack 영속 캐시 DB가 깨진다**(`Unable to open static sorted file ... .sst`, 500). 서버를 먼저 내리고 지울 것

#### 검증
- 5개 로케일 × 두 패널(언어·이름 수정) 열린 상태 가로 넘침 0
- 한국어 → Français 선택 → 즉시 전면 프랑스어("Propriétaire enregistré"·"Modifier le nom"·"Langue"), 서브에 "Français", 쿠키 `b_lang=fr`
- 이어서 기록 페이지 CTA "Voir le certificat numérique" — 화면 간 전파 확인
- tsc 0 · eslint /b error 0 · build 성공

## 등록된 병도 입장 화면을 보게 — 2026-07-25
질문: "소유 등록된 건 지금 무조건 바로 record로 이동하게 되어있는거야?" → 그랬다. 조건이 `isBottleRegistered` 하나뿐이라 **누가 태그하든** 서버에서 `/record`로 보냈다.

### 문제
입장 화면이 **병당 딱 한 번만** 보였다. 등록되는 순간 로고 인트로·풀필름 히어로·Bottle Identity(N° 카운트업)·Provenance가 영구히 사라진다. 병은 선물·접대 자리에 놓여 여러 사람이 태그하는데, 그들에게 보여줄 게 기록표가 되어 있었다.

원래 목적(재등록으로 소유자 덮어쓰기 차단)은 이미 두 겹으로 방어된다 — `submitBottleRegistration` 서버 가드 + 소유권 이전 기능 제거. 리다이렉트 없이도 덮어쓰기는 불가능했다.

### 조치 — 화면은 보여주고 폼만 잠근다
- [x] `page.tsx`에서 `redirect()` 제거. `fetchBottleOwner` 한 번으로 등록 여부와 소유자 이름을 동시에 얻는다(질의 2회 → 1회)
- [x] Claim Ownership 섹션이 등록 상태에 따라 갈린다:
  - 미등록 → 기존 폼 그대로
  - 등록됨 → 제목 `claimedTitle` + 본문 + **OWNED BY 소유자 이름**(인증서·기록과 같은 라틴 라벨 위 세리프 이름 조판) + "바다의 기록 보기" CTA
- [x] `provHint`("전체 숙성 기록은 소유 등록 후 열립니다") 등록 시 숨김 — 이미 열려 있는데 잠겼다고 말하면 거짓이다
- [x] 카피 `claimedTitle`·`claimedBody`·`claimedCta` 5개국어
- 필름·Identity·Provenance는 두 상태 모두 그대로 — 그게 이 변경의 목적

### 검증
- 등록된 병(7Fz44v6c): `/b/{code}` 머무름(리다이렉트 없음) · 폼 0개 · provHint 없음 · "백호암" · CTA → `/record`
- 미등록 병(GnMc5aab): 입력칸 2개 · "이름을 새기다" · provHint 그대로 · claimed 블록 없음
- 5개 로케일 claimed 문구 전수 확인
- 서버 가드 유지 확인(`forms.ts:284`) — 폼을 우회해 직접 호출해도 거부
- tsc 0 · eslint /b error 0 · build 성공

### 입장 페이지 — 자물쇠 + 국기 없는 언어 선택 — 2026-07-25
- [x] `NFC AUTHENTICATED` 앞의 빈 네모(`.eyebrowDot`, 5×5 테두리) → **자물쇠 SVG**. 기록 히어로(`.heroVerifiedLock`)·인증서 서명 블록과 같은 글리프. 빈 네모는 아무 뜻도 없는 장식이었는데, 자물쇠는 "암호로 확인된 태그"라는 뜻을 형태에 싣는다
- [x] 히어로 언어 선택에서 **국기 이미지 제거**(칩·패널 양쪽). 코드 + 언어명만 — 기록·인증서 푸터에서 이미 걷어냈던 규칙을 입장에도 맞췄다
- [x] `BOTTLE_LOCALES`의 `flag` 필드 삭제 — 마지막 사용처가 여기였다. `.langFlag` CSS도 함께
- `public/flags/*.svg` 5개는 남겨 뒀다(사용자 에셋, 코드 참조는 0건)

#### 검증
- 아이브로우: "NFC AUTHENTICATED" + 자물쇠 렌더, 빈 네모 없음
- 언어: 칩 "KO", 옵션 5개 전부 코드+언어명, 패널·칩 내 `<img>` 0개
- tsc 0 · eslint /b error 0 · build 성공

### 자물쇠 아이콘 광학 정렬 — 2026-07-25
지적: 입장 페이지 "NFC AUTHENTICATED"의 자물쇠가 살짝 아래.

**원인**: 자물쇠 SVG는 `viewBox="0 0 8 10"`인데 **잉크가 1.4~9.1에만 그려져 있다**(고리 위 여백 1.4, 몸통 아래 여백 0.9). 즉 상자 중심보다 잉크 중심이 **0.25 아래**다. 셰브론 때 쓰던 `translateY(0.5px)`를 여기에 그대로 얹으니 이중으로 내려갔다.

- [x] `.eyebrowLock`(entry) · `.statusLock`(owner) 의 `translateY(0.5px)` **제거**. 이 글리프는 nudge가 필요 없다
- [x] `.heroVerifiedLock`(record)은 원래 nudge가 없어 이미 정렬돼 있었다(오차 0.04) — 손대지 않음
- [x] 인증서 `.signAlgo` 자물쇠도 확인 — **1px 안쪽으로 정상**

#### 측정 방법 (셰브론 때보다 한 단계 더 필요했다)
셰브론은 SVG 잉크가 상자에 꽉 차서 `getBoundingClientRect`로 충분했지만, 자물쇠는 잉크가 상자 안에서 치우쳐 있어 **`svg.getBBox()`로 자식들의 실제 잉크 범위**를 구해 viewBox 스케일로 환산해야 한다. 글자 쪽은 동일하게 캔버스 `actualBoundingBox` + 베이스라인 프로브.

⚠️ **프로브 함정**: 인증서 `.signAlgo`는 텍스트가 `<span>`이 아니라 익명 flex 아이템이라, 프로브 스팬을 flex 컨테이너에 붙이면 중앙 정렬돼 **3.04px 오차라는 거짓 수치**가 나왔다. Range로 텍스트 노드 사각형을 직접 잡아 재확인 → 실제로는 정상. **고치기 전에 원인을 확인해서 헛수정을 피했다.**

#### 검증 (교정 후 오차)
| 위치 | 크기 | 전 | 후 |
|---|---|---|---|
| entry NFC AUTHENTICATED | 9px | +0.64 | **+0.14** |
| owner 본인 인증됨 | 9px | +0.38 | **−0.12** |
| record NFC VERIFIED | 8px | +0.04 | +0.04 (무변경) |

6배 확대 육안 확인 · tsc 0 · eslint /b error 0 · build 성공

### "이 병" 지시 표현 제거 + provHint 화살표 삭제 — 2026-07-25
지적: (1) "이 병의 기록에" 같은 표현이 한국어 어감상 별로다 (2) "전체 숙성 기록은 소유 등록 후 열립니다" 오른쪽 화살표는 링크도 아닌데 있어 헷갈린다.

- [x] provHint 셰브론 SVG 제거(마크업 + `.provHintArrow` CSS). 안내문에 화살표가 붙으면 누를 수 있다고 읽힌다
- [x] 한국어 카피 **9건**에서 "이 병" 제거. `humanize-korean` v1.5 fast 통과(자체검증 A, 초안 9건 전건 채택)

| # | 전 | 후 |
|---|---|---|
| converged | 1년의 바다가 **이 병에** 담겼습니다. | 1년의 바다가 담겼습니다. |
| converging | 바다가 지금도 **이 병에** 담기고 있습니다. | 바다가 지금도 담기고 있습니다. |
| gating | **이 병의** 기록 전문은… | 기록 전문은… |
| ctaNoSerial | **이 병의** 주인으로 이름을 남기다 | 첫 주인으로 이름을 남기다 |
| provBody | **이 병이** 지나온 시간은 **감상이 아니라**\n실제 관측 기록으로 **보존되어** 있습니다. | 지나온 시간은\n실제 관측 기록으로 남아 있습니다. |
| ownTitle | **이 병의** 기록에\n당신의 이름을 남기세요. | 바다의 기록에\n당신의 이름을 남기세요. |
| ownBodyNoSerial | **이 병의** 첫 소유자로… | 첫 소유자로… |
| certDedication | **이 병과** 바다의 기록을… | 바다의 기록을… |
| passportTitle | **이 병의** 디지털 인증서를\n확인하세요. | 디지털 인증서를\n확인하세요. |

윤문 결과 함께 잡힌 것: `provBody`의 **"A가 아니라 B" 대구**(C-8)와 한자어 이중피동 **"보존되어 있습니다"**(A-8 → "남아 있습니다").

### 2차 교정 — 지운 게 아니라 "한 병"으로 바꿔야 했다
지적: "그냥 지워버린거야? 다른거로 변경하지 않고?" — 9건 중 7건이 순수 삭제였다. 타당한 지적.

**내 오진**: "이 병"이 어색한 이유를 *지시사* 문제로 보고 지시사를 걷어냈다. 실제로는 **수량사가 빠진** 문제였다. 일본어 `この一本`·중국어 `这一瓶`은 이미 수량사를 쓰는데 한국어만 맨 지시사였다.

**놓친 정본 어휘**: `"한 병"`이 이미 브랜드 언어다 — 랜딩 H1 "지금 이 순간에도, 한 병의 샴페인이" · "바다가 조각한 단 한 병의 아카이브" · 홈페이지 구조 "스크롤 = 한 병의 여정".

2차 판정(humanize-korean 재호출): **6건 "한 병" 삽입 / 3건 삭제 유지**

| # | 확정 | 판정 근거 |
|---|---|---|
| converged | 1년의 바다가 **한 병에** 담겼습니다. | "담기다"가 요구하는 처소 자리 복원 |
| converging | 바다가 지금도 **한 병에** 담기고 있습니다. | 랜딩 H1 "지금 이 순간에도 + 한 병"과 겹쳐 두 화면이 이어짐 |
| gating | 기록 전문은 인양 참관 초대와 함께 공개됩니다. | 삭제 유지 — 절차 문장이라 대상을 다시 부를 이유 없음 |
| ctaNoSerial | **한 병의** 주인으로 이름을 남기다 | 번호 변형과 같은 자리를 채워 한 문형으로 맞물림. 1차의 "첫"은 원문에 없던 말 |
| provBody | **한 병이** 지나온 시간은
실제 관측 기록으로 남아 있습니다. | 1차의 주어 모호성 해소 |
| ownTitle | **한 병의** 기록에
당신의 이름을 남기세요. | 1차 "바다의 기록"은 대상이 병→바다로 이동하는 문제 |
| ownBodyNoSerial | 첫 소유자로 기록되며,
… | 삭제 유지 — 두 줄 위 제목이 대상을 이미 세웠음 |
| certDedication | **한 병과** 바다의 기록을
당신의 이름으로 남깁니다 | 헌정문이 무엇을 건네는지 복원 |
| passportTitle | 디지털 인증서를
확인하세요. | 삭제 유지 — 자기 병 페이지 하단, 소유 관계 확정된 자리 |

수량 오독 검토: 1·2번이 위험이 가장 높지만 주어가 "바다"라 병 단위 계량 해석이 성립하지 않아 단일성 읽기가 이긴다. 화면당 "한 병" 빈도 — 기록 1회(1·2는 상태 배타) · 입장 2회(서로 다른 블록) · 인증서 1회. 한 블록 내 중복 없음.

### ⚠️ 남은 미결 2건
1. **"주인" vs "소유자"** — CTA는 "주인"(`cta`·`ctaNoSerial`), 본문은 "소유자"(`ownBody`·`ownBodyNoSerial`). **원래부터 갈려 있던 것**이고 CTA는 따뜻하게·본문은 문서적으로 쓴 의도된 분리로 보인다. 통일하려면 본문을 "첫 주인으로"로 내리는 쪽 권장
2. **로케일 divergence** — ko만 손봐서 en·fr·ja·zh는 그대로. 지시사 문제는 한국어 고유("병"이 질병과 동음)라 두었지만, `provBody`는 **한국어만 "감상이 아니라" 절이 빠져 내용이 다르다** → **2026-07-25 현행 유지로 종결** (아래 절)

### 개체 지칭 규칙 정립 + gbrain 증류 — 2026-07-25
- [x] `ctaNoSerial`: "한 병의 주인으로" → **"첫 주인으로 이름을 남기다"** (유일한 변경)
- [x] 규칙 문서 신설: `docs/brand/korean-copy-object-reference.md`
- [x] gbrain 증류: `brain/claims/뮤즈드마레-한국어카피-개체지칭-3단원칙` (hub 저장소에도 write-through)

#### 조사로 뒤집힌 것 (내 초기 판단이 틀렸던 부분)
- **"보틀" 대안 폐기.** 주류 카피 31건 실측에서 "보틀"은 형태·디자인·패키지에만 쓰인다("가로형 보틀에 담았다"). `이 보틀` 0건. 랜딩의 "소장 보틀"은 멤버십 혜택 목록이라 실무 레지스터였다
- **"이 병"은 금지어가 아니었다.** 맥캘란 공식 "이 병은 벤틀리의…", 크룩 코리아 "그 병에 담긴 이야기". 한국어 규칙 문제가 아니라 **우리 톤 판단**이었다
- **병(甁)/병(病) 동음 기피는 근거 없음.** 광고·브랜딩 논의 전무. 단 표준국어대사전에서 "술병"만 [용기]와 [음주로 생긴 병]이 충돌하고 질병이 먼저 등재 → "술병"만 피하면 된다
- **크룩이 결정적 선례.** 병별 ID → 스캔 → 그 병의 이야기라는 우리와 동일 구조에서 `bottle`을 **"병"으로** 옮긴다. "크루그 샴페인 **한 병에는** 한 가지 이야기가 담겨 있습니다" — 우리 `converged`와 같은 구문
- **2인칭 소유의 유일한 럭셔리 선례도 크룩** — "귀하의 병의 크루그 아이디". 다른 브랜드(로얄살루트·발렌타인·발베니·페르노리카) 공식 지면은 2인칭 0건

#### 확립한 3단 원칙
1. 개체 지목 → **번호**(`N° 89`) 2. 번호 불가 → **지칭 생략, 기록을 주어로** 3. 서사 구간만 **"한 병"**
⚠️ 소유격 `한 병의 X`는 회피(수량 오독). 주어·처소격은 안전.

#### 남은 미결 → **전부 종결됨 (2026-07-25)**
- ~~`ownTitle`("한 병의 기록에")이 소유격 회피 규칙에 걸리지만, 등록 *전* 화면이라 2인칭 소유를 못 쓰고 대안이 더 나쁘다. 주어가 "기록"이라 수량 해석이 약하다고 판단해 유지~~ → **해결됨.** 같은 날 db6b312에서 `N° {serial}의 기록에`로 바뀌었다(번호=원칙 1). 병 번호 없으면 `ownTitleNoSerial`이 지칭을 생략(원칙 2). 소유격 회피에 더 이상 걸리지 않는다
- `provBody` 로케일 divergence → **현행 유지로 종결** (아래 절)
- ~~⚠️ **CLAUDE.md가 가리키는 브랜드 정본 2종이 저장소에 없다**~~ → 해결됨. 70f471d에서 hub `docs-vault/` 경로로 갱신

### 개체 지칭 최종 확정 — 대명사 대신 번호 — 2026-07-25
조사 에이전트의 첫 줄 결론을 내가 놓치고 있었다: **"한국 고급 주류 공식 카피에서 개별 한 병을 대명사로 지칭하는 관습은 사실상 없다."** 31건 실측에서 `이 병` 1회·`그 병` 1회·`이 보틀` 0회. 나는 "이 병/한 병/그 병 중 뭘 고를까"에 매달렸는데 **질문 자체가 틀렸다.**

크룩도 개체 지시를 **"이 샴페인"**(카테고리명)이 담당하게 하고 "병"은 물리적 용기에만 쓴다.

#### 확정 규칙 3
1. **개체 지목 → 번호**(`N° 89`) — 대명사보다 정확하고 개체를 격상
2. **앞 문장·도판이 세웠으면 안 부른다** — 기록을 주어로
3. **"한 병"은 물리적으로 담기는 자리만** — 소유격 `한 병의 X`는 수량 오독이라 회피

#### 코드 적용 (4곳)
| 자리 | 전 | 후 |
|---|---|---|
| ownTitle | 한 병의 기록에 | **N° {serial}의** 기록에 (+ `ownTitleNoSerial` 신설, 5개국어) |
| provBody | 한 병이 지나온 시간은 | 지나온 시간은 (앞 문장이 "당신이 태그한 병은 그중 89번째 기록입니다"로 세움) |
| certDedication | 한 병과 바다의 기록을 | 바다의 기록을 (바로 위 병 도판 + N° 대형 표기) |
| converged·converging | 한 병에 담겼/담기고 | **유지** — 물리적으로 담기는 자리 |

`BottleEntry`에 `ownBody`와 같은 번호 분기 배선. 검증: N° 50 병에서 "N° 50의 기록에" 렌더 확인 · 인증서 "바다의 기록을" · tsc 0 · eslint error 0 · build 성공

#### 정본·브레인 반영
- **정본 `brand-direction-2026.md` §6 「개체 지칭」 재작성** — 처음에 "그 병" 규칙으로 썼다가 조사 결론과 어긋나 전면 교체. 금지 목록에 개체 지칭어 "보틀"·"술병" 유지
- §9 전환 히어로의 "이 병은…"은 **브랜드 서사 최상위 한 자리에 한정, 실행 지면 복제 금지**로 명시
- brain claim 교체: `뮤즈드마레-개체지칭-대명사대신-번호로-부른다` (구 `...한병-이병-그병-상태별` 삭제) · MOC·registry·activation 동기화
- ⚠️ **gbrain은 2026-07-20 제거된 시스템** — 초기에 `gbrain put`을 써서 규칙 위반. 마크다운 직접 작성 + MOC 등록 + activation 갱신 + generate.py가 정상 절차
- ⚠️ CLAUDE.md의 브랜드 정본 2종은 **저장소 상대경로가 아니라 `~/Documents/Cursor/docs/` 아래**에 있다. "정본 없음"이라고 두 번 잘못 보고했다

### 정본 보완 — 반대 근거·판정·한계 3건 추가 (2026-07-25)
정본 대조 결과 조사 내용 중 셋이 빠져 있었다. 특히 첫 번째는 **우리 규칙에 불리한 근거**라 반드시 남겨야 했다.
- [x] **규칙 1(번호 호명)은 국내 선례가 없다** — "보틀 넘버"를 쓴 한국 공식 카피 0건, 개별 병 일련번호 각인을 명시한 수입사 문구도 없음. 한정판 개체성은 병 번호가 아니라 **라벨 디자인·패키지 각인**으로 표현된다. 우리 근거는 업계 관행이 아니라 Krug iD와 동형인 우리 구조 → **이 전제가 흔들리면 규칙 1도 재검토**
- [x] **병(甁)/병(病) 동음 기피는 근거 없음** — 광고·브랜딩 논의도, "그래서 업계가 보틀을 쓴다"는 인과 설명도 없음. **동음을 이유로 "보틀"로 도피하지 않는다**를 명시(안 적으면 같은 제안이 반복된다). 실제 충돌은 "술병" 하나
- [x] **근거 범위·한계 명시** — 31건이라는 숫자만 남으면 근거가 실제보다 강해 보인다. 맥캘란·돔 페리뇽·뵈브 클리코·헤네시·시바스·글렌피딕은 한국어 공식 사이트가 없어 **판정 불가**, 인스타그램 전량 접근 불가 → **SNS로 일반화 금지**
- [x] 정본 §6 · brain claim · 랜딩 문서 3곳 동기화

### 랜딩 카피 정본 대조 + 정본 결함 2건 수정 (2026-07-25)
새로 만든 §6 개체 지칭 규칙으로 랜딩 ko 152개 문자열 전수 대조.

#### 랜딩 실측 — 대체로 깨끗
개체 대명사 0 · 술병 0 · em-dash 0 · 감각어 0 · 판매어 0 · 스크롤 큐 0. **개체 지칭 문제는 랜딩에 없었다** — 오늘 고친 NFC가 유일한 위반 지점이었다.

- [x] **"소장 보틀의 기록, 평생 열람" → "소장 기록, 평생 열람"** (2곳: `oceanCellar.tags.archive`, `forms.invite.benefits[1].title`). 형태가 아니라 개체를 가리켜 금지 목록 위반이었다. 대상 생략 채택(규칙 2). 형제 태그("출시 소식 가장 먼저"·"준비된 병만큼만")와 명사구 구조도 맞는다
- en/fr(`Your bottle's record` / `Le relevé de votre bouteille`)은 **그대로** — "보틀" 문제는 한국어 고유
- `forms.partner...cellar.desc`의 "멤버십 보틀"은 개체가 아니라 카테고리(복수)라 유지
- "럭셔리 호텔 바"는 자기 규정이 아니라 **파트너 분류어**(luxury hotel = 5성급 업계 카테고리)라 유지 — 대표 확인

#### 대조가 드러낸 정본 결함 2건 (이번 분석의 실질 소득)
1. **`한 병의 X` 회피 규칙이 자기모순이었다.** 정본이 "소유격 회피"라고 썼는데 정작 확정 히어로가 "한 병의 샴페인이"다. 구분을 넣었다 —
   - `한 병의` + **내용물** = 정상(수량 표현이 본래 용법): "한 병의 샴페인"
   - `한 병의` + **속성·소유물** = 회피("한 병 분량"으로 읽힘): ~~한 병의 기록~~·~~한 병의 주인~~
   오늘 NFC에서 걸린 건 전부 후자였고 히어로는 전자라 문제가 없었다
2. **2인칭 규칙이 필요 이상으로 넓었다.** "2인칭 소유는 소유 확정 후에만"이 랜딩의 "당신의 테이블"(파트너십)·"당신을 초대합니다"(초대)까지 잡았다. 대상을 **"당신의 병/제품"**으로 좁히고, 소유 대상이 우리 제품이 아닌 2인칭은 **규칙 밖**임을 명시

- [x] 정본 §6 · brain claim · 랜딩 문서 3곳 동기화
- [x] 재검사: 랜딩·NFC 양쪽 개체 대명사 0 · 보틀 0(카테고리 1건 제외) · `한 병의 + 속성` 0 · build 성공

### 인증서 서명 라벨 `SHA-256` → `HMAC-SHA256` (2026-07-25)
해시 함수 이름만 적혀 있어 **비밀키가 들어갔다는 사실이 안 드러났다** — 실제보다 약하게 말하는 표기였다(아침에 서명을 HMAC으로 전환하고 라벨은 그대로 뒀던 잔여).
- [x] 라벨 교체. 실측: 라벨 폭 84px / 박스 내폭 341px · 가로 넘침 0 · 한 줄 유지
- [x] tsc 0 · eslint /b error 0 · build 성공

## 재고 앱(musedemaree/marketing) NFC 쓰기 안정화 — 2026-07-25
랜딩에서 흐름을 역추적하다 발견. 코드 생성·DB 저장이 태그 쓰기보다 **먼저** 일어나는 구조라 실패 시 "DB엔 코드, 실물 태그엔 아무것도"인 병이 남는다.

### ❌ 내가 틀렸던 지적 (실측으로 기각)
`nfc_registered_at`이 DB에 안 들어간다고 했으나 **사실이 아니다.** `updateNumberedBottleNfc`가 직접 쓰고 `bottle_units`는 DB 기본값으로 채워진다. 실측: numbered_bottles 코드 6건·시각 누락 0 / bottle_units 코드 1건·시각 누락 0. **zustand 상태 코드만 보고 DB 저장 경로를 확인하지 않은 채 단정했다.**

### 실제 문제와 수정
- [x] **넘버링 병 — 모달 닫으면 재진입 불가.** `handleBottleClick`이 항상 상태 모달만 열었다 → **이미 `nfcCode`가 있는 병은 NFC 모달로 재진입**하도록 분기. 그리드에 시안 점 표식 + 툴팁("눌러서 태그 쓰기/재시도")
- [x] **배치 재고 — 재진입 목록 신설.** 처음엔 "닫기 전 경고 대화"로 막았으나 **재진입 버튼을 만들면 되지 않느냐**는 지적으로 제대로 고침. 파고 보니 문제가 더 깊었다 — `bottleUnits`는 **DB에서 로드되는 코드가 아예 없었다**(초기값 `[]`, 생성 시에만 append → 새로고침하면 소멸)
  - `fetchBottleUnits()` 신설(`bottle_units` 전량, created_at desc) + index export
  - `mapDbUnitToUnit` 매퍼 + `initializeInventory`·`refreshFromSupabase` 두 경로에 배선
  - 거래 내역 아래 **「NFC 발급 병」 목록** — 코드·제품·고객·날짜·상태, 누르면 NFC 모달 재오픈
  - 재진입 경로가 생겼으므로 **경고 대화는 걷어냄**(쓰는 도중 닫기 방지만 유지). 코드 복사 버튼은 수동 프로그래밍용으로 유지
- [x] **실패를 삼키던 `catch {}` 2곳** — 넘버링·배치 양쪽에서 `generateNfcCode` 실패가 무시됐다(10회 시도 소진 시 null 반환도 무시). `alert` + `console.error`로 표면화
- 모달 안 "다시 시도" 버튼은 **이미 있었다** — 문제는 모달을 닫은 뒤였다

### 작업 중 사고 1건
`onClose` → `guardedClose` 치환을 전역 `replace`로 해서 **다른 모달 9곳까지 바꿨다**(tsc가 즉시 잡음). `NfcWriteModal` 함수 범위를 파싱해 바깥만 되돌림. **넓은 문자열 치환 전 범위를 먼저 좁힐 것.**

### 검증
- `npx tsc --noEmit` 통과 · `npm run build` 성공
- eslint: 변경 파일 error 7건은 전부 `setState in effect` 기존 패턴(166·383·396·830·1010·1131·2207), 내 편집 구간 밖
- ⚠️ 이 저장소는 **작업 시작 전부터 16개 파일이 미커밋 상태**였다. `page.tsx`의 `Eye` 임포트 제거·ProductCard 미리보기 버튼 삭제 hunk는 **내 변경이 아니라 기존 WIP**(`/b/preview` 라우트 삭제와 한 세트). 커밋 시 분리 필요

#### 체인 E2E 검증 (2026-07-25)
재고 앱이 만든 실제 배치 유닛 코드 `L5vfZJvR`(en_lieu_sur_magnum)로 전 구간 확인:
- `bottle_units` 행 → 랜딩 `/b/L5vfZJvR` 200 → `numbered_bottles` 미스 → **`bottle_units` 폴백 적중** → "En Lieu Sûr Magnum" 렌더
- **번호 미부여 변형 정상 작동** — `N°` 0회, `첫 소유자로`(ownBodyNoSerial) 출력. 오늘 만든 `ownTitleNoSerial`/`ctaNoSerial` 분기가 실물 데이터에서 검증됨
- ⚠️ **재고 앱 UI는 렌더 검증 못 함** — Clerk가 로컬 보호 라우트를 404로 막는다. CLAUDE.md에 middleware 임시 개방 절차가 있으나 **미커밋 파일 16개 상태라 시도하지 않음**. 데이터 경로(쿼리 결과 ↔ 매퍼 필드)로 대체 검증

### 문서 금고 이관 — docs → hub/docs-vault (2026-07-25)
문제: 브랜드 정본(`brand-direction-2026.md`)이 **어느 git 저장소에도 속하지 않았다.** 오늘 §6을 세 번 고쳤는데 이력이 남지 않았고 되돌릴 수도 없었다. registry가 "정본"으로 가리키는 파일이 정작 추적 밖.
- [x] `~/Documents/Cursor/docs` (2.3GB) → `hub/docs-vault/` 이동. hub는 private
- [x] **바이너리 제외 gitignore 선행** — pdf·zip·indd·ai·psd·영상·폰트·오피스 등. GitHub 100MB 한도 초과 파일이 3개 있어 그대로 올리면 푸시가 거부된다
- [x] 추적 대상 **271개 전부 텍스트**(md 172·html 52·txt 34·jsonl·csv). 50MB 초과 잔존 0
- [x] 절대경로 참조 **103개 파일 342건 일괄 치환** + 축약 표기(`~/Documents/Cursor/docs/`)·훅 패턴 3곳 수동 정리
- [x] 검증: registry가 가리키는 정본 6종 전부 실제로 열림 · landing CLAUDE.md 경로 열림 · 옛 경로 잔존 0
- ⚠️ `hub/docs`와 이름 충돌(`docs/plans` 존재)이 있어 `docs-vault`로 명명
- 작업 함정: 파일마다 python 프로세스를 띄우는 루프가 10분 타임아웃(2.3GB를 rg가 반복 스캔). **단일 프로세스 os.walk로 전환해 해결**

---

## 소유권 이전 폐기 + 프로덕션 배포 — 2026-07-25

### 소유권 이전 폐기 (db6b312)
phase-3에서 만든 소유권 이전을 **기능째로 걷어냈다.** 실사용이 없었고, 제거하는 과정에서 오히려 구멍이 드러났다 — `updateOwnerInfo`가 email까지 덮어써서 **"이름 수정"이 사실상 이전**이었다. OTP를 받는 주소가 바뀌면 동의도 감사 기록도 없이 소유자가 갈린다.

- [x] 서버액션 `initiateTransfer`·`acceptTransfer` 삭제. `updateOwnerInfo` → **`updateOwnerName`**으로 좁히고 email 파라미터 제거
- [x] 라우트 `/b/[code]/transfer` + `BottleTransferAccept` + `transfer.module.css` 삭제
- [x] 이메일은 읽기 전용 필드로. 변경은 문의 경로(`OWNER_CONTACT_EMAIL`)로만
- [x] 카피 키 정리 — `src/app/b/` 전체에 `transfer` 문자열 **0건**

**남은 액션 4개**: `requestOwnerOtp` · `verifyOwnerOtp` · `signOutOwner` · `updateOwnerName`

⚠️ **DB에 `bottle_transfers` 테이블이 남아 있다** (행 0개, RLS on·정책 없음). 코드에서 아무도 안 쓴다. 드롭할지는 미결 — 남겨도 무해하지만 스키마를 읽는 사람에겐 있지도 않은 기능으로 읽힌다.

### `provBody` 로케일 divergence — 현행 유지로 종결
**위치:** 입장 페이지(`/b/[code]`) 프로비넌스 블록 본문 (`BottleEntry.tsx:285`)

| 언어 | 현재 |
|---|---|
| ko | 지나온 시간은 / 실제 관측 기록으로 남아 있습니다. |
| en·fr·ja·zh | …**감상이 아니라**(not sentiment / n'est pas un sentiment / 感傷ではなく / 并非感怀) 실제 관측… |

한국어에만 그 절이 없는 건 실수가 아니라 **`humanize-korean`이 "A가 아니라 B" 대구를 AI 티(C-8)로 잡아내서 지운 결과**다. 되살리면 브랜드 톤 규칙을 거스른다. 반대로 en·fr·ja·zh에서는 자연스러운 수사라 뺄 이유가 없다.

**확정: 언어별로 다르게 쓴다.** 카피는 번역이 아니라 각 언어로 쓰는 것이고, 한 언어에서만 문제가 되는 패턴은 그 언어에서만 고친다. 이 원칙을 적어두지 않아서 같은 항목이 두 번 미결로 올라왔다 — **다음에 또 걸리면 여기를 근거로 닫는다.**

### 프로덕션 배포 (PR #1 → main 7e3a85f)
브랜치가 main보다 5커밋 앞선 채 PR도 없이 멈춰 있었다. NFC v2가 통째로 라이브가 아니었다.

- [x] PR #1 생성 → merge commit으로 main 병합 → Vercel 프로덕션 배포
- [x] **`BOTTLE_SESSION_SECRET` 실동작 확인** — 배포 전까지 검증 불가였던 유일한 항목. Vercel이 Sensitive로 저장해 값 회수가 안 되니 **인증서 서명 블록이 렌더되는지가 유일한 판정 수단**이었다. N° 16(`Ypv7eDfD`)에서 `HMAC-SHA256` / `BB2D 4C99 A26C 33B7` / `ISSUED BY MUSE DE MARÉE OCEAN CELLAR` / `MDM-2026-0016` 출력 확인 → 키가 없으면 `signCertificate`가 null을 반환해 블록째 사라지므로, **서명이 보인다 = 소유자 인증도 살아 있다**
- [x] 4개 라우트 전부 200 (입장·record·certificate·owner), 콘솔 에러 0
- [x] 로케일 쿠키 SSR 실측 — `b_lang=fr` → 첫 응답 HTML에 프랑스어 / 쿠키 없음 → 한국어 / `b_lang=xx` → 한국어 폴백
- [x] 관측 실데이터 확인 — 정적 폴백이 아니라 실측값(수온 13.5·15.6°C, 염분 34.7)

⚠️ **PR #1 본문이 부정확하다.** 소유권 이전을 기능으로 설명하고 "미검증: transfer done 상태"까지 적혀 있다. 폐기 전 기록을 그대로 옮긴 탓 — 정정 필요.

### 이번에 내가 틀린 것 (→ lessons)
`tasks/todo.md`의 옛 절을 현재 상태로 읽고 미결 2건을 보고했는데, **둘 다 이미 닫혀 있었다.** 소유권 이전은 폐기됐고 `ownTitle`은 `N° {serial}`로 바뀐 뒤였다. todo는 시간순 로그라 **뒤쪽 절이 앞쪽을 무효화한다** — 상태를 물으면 문서가 아니라 코드를 먼저 봐야 한다.
