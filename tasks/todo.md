# TODO

> 현재 진행 중인 작업과 발견 사항을 기록한다.

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

## NFC 병 페이지 v2 — phase-3 (소유자 인증 · 소유권 이전) — 2026-07-24
결정: 이메일 OTP 6자리 인증 + 소유권 이전까지 전부. 성공기준: 세션 게이팅으로 안전한 변경/이전 + tsc/eslint/build 통과 + OTP 흐름 E2E 검증.
- [x] DB(마이그레이션 bottle_owner_auth_and_transfer, marketing 프로젝트): bottle_owner_verifications(OTP)·bottle_ownership_audit(감사)·bottle_transfers(이전). 전부 RLS on(정책 없음=service_role 전용)
- [x] env: BOTTLE_SESSION_SECRET(.env.local 추가, 64hex) — HMAC 서명 쿠키용. ⚠️ Vercel 등록 필요. 이전 링크용 NEXT_PUBLIC_SITE_URL도 미설정 시 musedemaree.com 폴백
- [x] owner-auth.ts(server-only): HMAC 서명 세션 토큰(httpOnly 쿠키, /b/{code} 스코프, 30분) sign/verify/get/set/clear + genOtp + hashCode/hashToken(비밀키 해시, 평문 미저장)
- [x] owner-actions.ts("use server"): requestOwnerOtp(등록 이메일로 6자리 발송, 10분 5회 레이트리밋)·verifyOwnerOtp(해시 timingSafe 비교, 5회 시도 제한, 성공 시 세션+감사)·signOutOwner·updateOwnerInfo(세션 재확인 후 최신 등록행 수정)·initiateTransfer(세션 게이팅, 토큰 이메일 발송, 기존 대기 취소)·acceptTransfer(토큰=이메일 통제 증명, 새 소유자 등록행 삽입=최신 소유자, 감사, 세션 이양)
- [x] data.ts: maskName/maskEmail export + fetchBottleOwnerRaw(인증 시에만 원본 반환)
- [x] UI: BottleOwnerManage 재작성(미인증=마스킹+"본인 인증하고 전체 보기" OTP 인라인 / 인증=전체 이름·이메일+수정 폼+이전 폼+인증 해제, window.confirm으로 이전 재확인). BottleCertificate=ownerNameFull prop으로 인증 시 언마스킹. certificate/owner page.tsx=getOwnerSession 읽어 authed·원본 전달. 신규 /b/[code]/transfer(BottleTransferAccept + transfer.module.css)=이메일 링크 수락 화면
- [x] 검증: tsc 0 · eslint 0 · pnpm build 성공(신규 transfer 라우트) · **OTP E2E**: 요청→행 생성·이메일 발송 확인→DB 해시에서 코드 역산(031594)→UI 입력→verify→세션 발급→owner/cert 전체 이름 "백호암" 언마스킹 확인. 수정·이전 폼 렌더 확인(실제 데이터 변경·이전 발송은 미실행)
- ⚠️ 알려진 한계: 소유권 모델=최신 bottle_registrations 행=현 소유자. 입장 페이지가 누구나 재등록 허용 → 재등록으로 소유자 덮어쓰기 가능(선행 이슈). OTP는 "인증 시점의 등록 이메일 통제"를 증명. 향후 하드닝=정규 소유자 테이블 + 입장 재등록 게이팅
