# 뮤즈드마레 랜딩 — StyleGallery 레이아웃 감사

> 2026-07-05. 분석 렌즈: [StyleGallery / layout-gallery](https://github.com/changeroa/StyleGallery) — 공간 문제별 최소 견고한 CSS 레이아웃 패턴 카탈로그.
> 로컬 클론: `/Users/hoambaek/Documents/Cursor/StyleGallery` (실행 도구가 아니라 문서 저장소 = 클론이 곧 설치).
> 대상: 실제 코드 랜딩(`src/components/LandingPage.tsx` + 섹션 + `src/app/globals.css` 6,935줄).

## 총평

**패턴 선택 자체는 건강하다.** 각 섹션이 StyleGallery 패턴에 깔끔하게 매핑되고(cover·overlay-stack·imposter·stack·frame·card-grid·media-object·reel·sticky-header), **스크롤 소유권은 모범적**이다 — body 단일 스크롤, 중첩 스크롤 컨테이너 없음, `overflow:clip`으로 가로 넘침만 차단.

문제는 패턴이 아니라 **구현이 Paper 아트보드 픽셀에 묶여 있다는 점**이다. StyleGallery가 경고하는 "고정이라 견고한 게 아니라 그냥 깨지기 쉬운" 방식이 곳곳에 있다. 특히 다국어(EN/FR)·반응형에서 취약하다.

## 스코프 발견 (중요)

`LandingPage.tsx:29-37` 기준 **실제 렌더되는 섹션은 7개**:
Hero(`.s-void`) · TheLivingRecord(`.s-living`) · TheFirstRecord(`.s-first`) · Archive/Collection(`.s-col`) · TheMaker(`.s-maker`) · OceanCircle(`.s-prive--left`) · Professionals(`.s-prive--right`). + `Header`(`.header`+`.menu-overlay`), `Footer`(`.s-footer`).

**죽은 코드 (~1,500줄+ 추정):**
- 미사용 컴포넌트: `DataArchiveSection`(`.s-data`) · `ObservationSection`(`.s-obs`) · `OriginSection`(`.s-origin`) · `NfcSection`(`.s-nfc`) · `TastingSection`(`.s-tasting`) — `grep src/app` import 0.
- legacy CSS: `.footer`(globals.css:5376-5624) · `.indicator`(5627, LandingPage:27 주석 처리) · `.s-bridge` · `.s-archive`(4028~) · `.s-diptych`.
- 살아있는 컴포넌트 내 죽은 하위 클래스: `.s-col__band*`(1815-1868) · `.s-first__plate--01/02`·`__row--left/right`·`__edition`(1531-1645) · `.s-maker__slide--veiled`(3743).
- ⚠️ `id="data-archive"` 중복(TheLivingRecord:126 vs 죽은 DataArchive:49) — 죽은 쪽 부활 시 충돌.

## 섹션별 패턴 매핑

| 섹션 (클래스) | StyleGallery 패턴 | 적합/어긋남 | 대표 근거 (globals.css) |
|---|---|---|---|
| Hero `.s-void` | `cover` + `overlay-stack` + `imposter` + `center`(모바일) | 대체로 적합. imposter를 매직 오프셋(`top:61%`)으로 앵커 | shell `height:100vh;min-height:800px` :848-849 · 레이어 4장 `inset:0` :856·870·883·897 · 카피 `absolute;left:80px;top:61%` :914-923 |
| Living `.s-living` | `cover`(고정높이) + `overlay-stack` + `imposter` + `stack` | 어긋남: 뷰포트가 아닌 **하드코딩 픽셀 높이** | `height:1196px /* Paper 아트보드와 동일 */` :1146 · 텍스트 `absolute;left:80px;top:35%` :1195-1198 |
| First `.s-first` | `stack`(flex-column center) + `frame` + `line-up` | 적합. content-limiter 없이 고정폭 plate로 폭 제어 | flex-column align-center :1447-1450 · plate `aspect-ratio` :1565-1568 · connector `width:1px;height:120px` :1550 |
| Collection `.s-col` | `stack` + `card-grid`(3열) + `media-object` + `cluster` | 적합. grid가 `list` 시맨틱 없이 `div>figure` | `grid-template-columns:repeat(3,1fr);gap:28px;width:1238px` :1872-1877 · showcase flex gap:120px :1970 |
| Maker `.s-maker` | `reel`(translateX 캐러셀) + `media-object` + `split-nav` | 적합. 스크롤 아닌 transform — ownership 명확 | track `transform:translateX(...)` :3719, `--slide-w` :3714 · nav space-between :3823 |
| OceanCircle/Partnership `.s-prive` | `cover`(고정 700px) + `imposter` + `overlay-stack` + `cluster` + `split-nav` | 적합. 좌/우를 `--left`/`--right` modifier로 처리(깔끔) | media `height:700px` :2292 · content `absolute;bottom:80px` :2324, `left:120px`/`right:120px` :2335·2340 |
| Footer `.s-footer` | `stack` + `columns` + `cluster` + `split-nav` | 적합. nav가 `nav>div>a`로 `list` 부재 | nav flex gap:140px :2584 · legal `flex-wrap` :2630 · bar space-between :2695 |
| Header `.header` | `sticky-header` + `super-center` + `imposter` | 적합 | `position:fixed;z-index:var(--z-menu)` :400 · `justify-content:center` :408 · symbol `left:48px`/menu `right:48px` absolute :419·457 |
| Menu `.menu-overlay` | `imposter`/`overlay-stack`(fixed inset:0) + `super-center` | 적합 | `position:fixed;inset:0` :518 |

## 가장 큰 리스크 Top 5 (우선순위순)

### 1. 하드코딩 고정 높이 = 다국어·반응형 최대 취약점 (최우선)
`.s-living height:1196px`(:1146) · `.s-col__hero:710px`(:1766) · `.s-prive__media:700px`(:2292) · `.s-maker__viewport:522px`(:3709) · Hero `min-height:800px`(:849) — 전부 "Paper 아트보드와 동일" 주석과 함께 박혀 있다. **EN/FR 텍스트가 한글 PNG보다 길어서** 콘텐츠가 늘면 `overflow:clip`이 잘라낸다.
→ **StyleGallery `cover`**: `min-block-size:100dvh` + `grid-template-rows:auto 1fr auto`로 높이를 콘텐츠가 정하게. 고정 px 지양.

### 2. 레이아웃 매직넘버 미토큰화
거터 `80px`×48회 · `24px`×79회 · `48px`×52회 · `120px`×22회. 콘텐츠 폭 `1240/1238/1200px` 혼재. 리미터 관용구 `width:1240px;max-width:calc(100% - 48px)`가 최소 3곳 복붙(:1817·1876·1975). `@theme`(:3-77)에 색·폰트·z-index 토큰은 있으나 **spacing/width/breakpoint 토큰 전무**.
→ **StyleGallery `content-limiter`**(`margin-inline:auto;max-inline-size;padding-inline`) 유틸 하나로 통일 + spacing/width 토큰 도입.

### 3. 죽은 CSS 1,500줄+
위 스코프 발견 참조. 삭제 시 리스크 없이 파일이 크게 가벼워짐.

### 4. desktop/mobile DOM 이중화 + 뷰포트 전용 반응형
같은 콘텐츠를 DOM에 두 벌 넣고 `display:none` 토글(Hero HeroSection:69·89 · Living TheLivingRecordSection:145 · First rows--desktop/--mobile). 결과: **문서에 `<h1>` 2개**(HeroSection:70·90, CSS 토글 :1069-1074) = 접근성/문서개요 결함. `@container` 0개, `@media` 28개 전량 뷰포트. `768px`(15회)/`767px`(4회) 혼용.
→ 컴포넌트-로컬 반응형은 **container query**로, DOM 이중화는 단일 소스로.

### 5. 시맨틱-레이아웃 결합 부족
반복 목록이 리스트 아님: Collection 큐베 그리드(`div>figure` ArchiveSection:114) · Footer nav(`nav>div>a` Footer:93) · Prive tags(`div>span` OceanCircleSection:23). 활성 `<section>` 7개에 `aria-label` 없음 — 정작 죽은 `DataArchiveSection:49`에만 `aria-labelledby` 존재. Hero `<h1>` 2개.
→ `ul/li` 복원 + section에 `aria-labelledby` + h1 단일화.

## 그 외 (낮은 우선순위)
- **논리 속성 0개** — 전부 물리(`left`/`right`). LTR 3개 로케일이라 당장 안 깨지나 StyleGallery 기준 미달. Prive 좌우 변형도 물리 미러링.
- **6,000줄이 `@layer` 밖 raw CSS**(844~6935) — Tailwind 유틸을 cascade로 이김. `@layer`는 base(:78)·utilities(:183) 2개뿐.
- **element-qualified 셀렉터 39곳**(`.s-void__h1 span` :953 등) → specificity 필요 이상, 재사용 저해.
- **모호 클래스명**: `.container`(:186) · `__content`(StyleGallery 지목 모호명) · `__lower`/`__bottom`/`__bar`(위치기반).

## globals.css 구조 관찰
- 6,935줄 단일 파일. `@import "tailwindcss"`(:1) 위 raw CSS.
- `═══` 배너 주석으로 구획은 양호하나 활성(S1~S7)·legacy 섹션이 한 파일에 뒤섞임(활성 `.s-maker` :3659, 죽은 `.s-archive` :4028 인접).
- 반응형이 두 곳 분산: 섹션별 인라인 `@media`(:1068·1346·1649·2161·2762) + 하단 전역 RESPONSIVE(:5689·5743).
- 반복 관용구(유틸 부재로 매번 재선언): ① 리미터 폭 3곳 ② `overflow:clip` 6곳 ③ imposter absolute+물리오프셋 ④ desktop/mobile display 토글 ⑤ `flex-direction:column;align-items:center` 섹션 래퍼.

## 실행 로드맵 (제안)

| 단계 | 내용 | 리스크 | 효과 |
|---|---|---|---|
| **A. 죽은 CSS 정리** ✅ **완료(2026-07-05)** | 미사용 컴포넌트·legacy·죽은 하위 클래스 삭제, id 중복 해소 | 낮음 | 즉시 경량화·가독성 |
| **B. 토큰화** ✅ **완료(2026-07-05)** | `@theme`에 spacing/width/breakpoint 토큰 + `content-limiter` 유틸 통일 + 768/767 표준화 | 중간 | 유지보수·일관성 |
| **C. 구조 리팩터** | C1 시맨틱(ul/li·aria·h1) ✅ · C2 DOM 이중화 제거(단일 소스+`<picture>`) ✅ · **C3 고정높이→cover = 스킵(2026-07-05)** | 큼 | 다국어·접근성·반응형 |

권장 순서: **A → B → C**. A는 리스크 없이 시작 가능.

### A단계 실행 결과 (2026-07-05)

삭제 전 각 대상을 **직접 재검증**(grep 참조·동적 클래스 조립·@keyframes 라이브 참조)해 감사의 오탐 1건을 교정했다:
- 🔴 **감사 오탐 교정**: 감사는 `.card-slider`를 "살아있음"으로 표기했으나, `CardSlider.tsx`가 **어디서도 렌더되지 않는 죽은 컴포넌트**였다(자기참조만 존재). 따라서 `.card-slider*` CSS·`.m-card*`·masonry·muselog까지 S5 ARCHIVE 영역 전체가 죽음 → 4027~4746 720줄을 통삭제 가능했다.
- **삭제 컴포넌트 8개**: DataArchiveSection·ObservationSection·OriginSection·NfcSection·TastingSection·DataArchiveClient·DataMetricsClient·CardSlider.
- **`globals.css` 6,936 → 4,845줄 (−2,091, ≈30%)**: s-bridge·s-obs·s-data·s-tasting·s-archive(+m-card·card-slider·masonry·muselog)·s-nfc·s-origin·s-diptych·`.footer`(bare) 데스크톱+모바일@media 전부 + 죽은 하위클래스(s-col__band*·s-first__plate--01/02·s-maker__slide--veiled) + 라인단위(m-card/.footer__*:active).
- **의도적 보존**: `.indicator`/`SectionIndicator.tsx`는 삭제가 아니라 "주석 처리 보류" 상태(LandingPage 4·27줄)라 남겼다. `id="data-archive"` 중복은 죽은 DataArchiveSection 삭제로 자동 해소(라이브 앵커는 TheLivingRecordSection).
- **검증**: 중괄호 728/728 균형 · 삭제 대상 잔여 참조 0건 · 프로덕션 빌드 28라우트 정상.

### B단계 실행 결과 (2026-07-05)

A단계 삭제로 리미터 중복이 3곳→2곳, `max-width:767px`가 다수→1곳으로 이미 줄어든 상태에서 진행.

- **`@theme`에 레이아웃 토큰 3종 신설**: `--w-content: 1240px`(내부 콘텐츠 폭) · `--gutter-page: 80px`(페이지 좌우 여백 데스크톱) · `--gutter-limit: 48px`(와이드 블록 리미터 여백). 기존 `@theme`엔 색·폰트·이징·z-index만 있었다.
- **동일-개념 9곳 치환** (전부 직접 검증한 같은 역할의 값만): 콘텐츠폭 3곳(`.s-col__grid` 1238→통일·`.s-col__showcase`·`.s-maker__nav`) · 페이지거터 3곳(`.container` `padding:0 80px`·히어로/리빙 `left:80px`) · 리미터거터 2곳(`calc(100% - 48px)`) · breakpoint 1곳(`767→768`, 나머지 12곳과 일치. min-width:768 페어 없어 오버랩 리스크 없음).
- **의도적 축소 (스코프 규율)**: 리스크#2가 지목한 매직넘버 대량(80×48회·24×79회·48×52회·120×22회)의 **무차별 var() 치환은 하지 않았다**. 같은 `48px`가 리미터 여백일 수도, 컴포넌트 수직 하단 패딩(`60px 120px 48px`)일 수도 있어 역할이 뒤섞여 있다 — blanket 치환은 회귀를 부른다. "공유 어휘"가 명확한 폭·페이지거터·리미터거터만 토큰화하고, 광범위 spacing 스케일 이관은 각 컴포넌트를 리팩터하는 **C단계에서 사이트별로** 진행하는 게 안전하다.
- **breakpoint 토큰 불가 고지**: `@media`는 `var()`를 못 쓰므로 breakpoint는 토큰이 아니라 리터럴 표준화(768)로만 통일. Tailwind `--breakpoint-*`는 유틸 variant(`md:`)용이라 raw `@media`엔 무효.
- **검증**: 중괄호 728/728 · 빌드 28라우트 정상 · Playwright 데스크톱 풀페이지 **픽셀 동일**(var()는 동일 계산값 → 시각 회귀 0) · 콘솔 에러 0.
