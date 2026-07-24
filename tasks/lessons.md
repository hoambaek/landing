# Lessons Learned

> 실수와 교정 사항을 기록하여 반복을 방지한다.

## 카피 관련

### "바다의 기록" 일기 형식 거부
- **실패**: 바다를 화자로 한 관찰 일기 형식 → CEO가 "오글거린다, 진정성 없다"고 거부
- **신호**: 럭셔리 브랜드에서 감성 과잉은 역효과. 바다를 의인화하지 말 것
- **방지**: 카피 작성 시 현대예술/설치미술 레퍼런스 기반으로 접근. 설명하지 말고 체험시킬 것

### 프로세스 로그/필드 노트 방향도 거부
- **실패**: "기록" 프레임 자체를 3가지 변형으로 재제안 → 전부 거부
- **신호**: CEO가 "완전히 새로워도 돼"라고 할 때는 프레임 자체를 바꿔야 함
- **방지**: 같은 콘셉트의 변형이 아닌, 근본적으로 다른 5개 이상의 창의적 방향 제시

### "맛" 단어 사용 금지
- **실패**: 클라이맥스 "이 압력이 맛이 된다" → 판매 언어에 가까움
- **방지**: "맛", "향", "풍미" 등 직접적 감각 묘사는 브랜드 기준서 위반. 결과를 암시할 것

## 데이터 관련

### homepage-plan.html vs 실제 스펙 불일치
- **실패**: 와이어프레임에 plan 문서의 수치(60m, 1.8°C)를 그대로 사용
- **신호**: plan 문서는 초기 기획. 실제 운영 스펙과 다를 수 있음
- **방지**: 데이터 수치는 반드시 CEO 확인 후 적용. 현재 확정 스펙: 수심 20-40m, 수온 6-12°C

## 리팩터 관련

### 데스크톱/모바일 블록 병합 시 transform 리셋 누락 (C2, 2026-07-05)
- **실패**: Hero 데스크톱/모바일 이중 DOM을 단일 `.s-void__content`로 병합하며 base에 데스크톱용 `transform: translateY(-50%)`(top:61% 세로중앙 보정)를 넣었으나, 모바일 `@media`에서 해제하지 않음 → 모바일 콘텐츠가 자기 높이 절반만큼 위로 당겨져 "텍스트가 원래보다 위로 올라감". 사용자 지적으로 발견
- **신호**: 원본에서 한쪽 브레이크포인트에만 있던 속성(transform·margin·position 보정)을 병합 base에 넣으면, 그 속성이 없던 반대쪽 브레이크포인트로 **누수**됨
- **방지**: 이중 블록 병합 시, 한쪽에만 있던 속성을 base에 올릴 때는 반대쪽 `@media`에서 반드시 명시적으로 초기값(`transform:none` 등)으로 재설정. 병합 후 **양쪽 브레이크포인트 모두** Playwright로 위치 검증(computed `transform`·`getBoundingClientRect().top` 대조)

## 디자인 관련

### 섹션 타이틀 마침표는 dot 클래스 사용
- **실패**: Ocean Cellar 타이틀에 마침표를 plain text로 넣음 → 다른 섹션들은 모두 `<span className="dot">.</span>`으로 Pretendard font-weight 200 적용
- **방지**: 새 섹션 타이틀 추가 시 반드시 기존 패턴 확인. `living data.`, `collection.`, `the maker.`, `Partnership.` 모두 dot 클래스 사용

### 타이틀 폰트는 반드시 --font-jj
- **실패**: Ocean Cellar 타이틀을 `--font-heading`(Cormorant Infant)으로 변경 → 전혀 다른 폰트가 적용됨
- **신호**: 모든 섹션 타이틀은 `--font-jj` (weight 400). `--font-heading`은 본문/서브 텍스트용
- **방지**: 타이틀 폰트 수정 시 다른 섹션 CSS 먼저 확인

### Ocean Cellar 높이는 Partnership과 동일
- **실패**: `min-height: 100vh`로 설정 → 사용자가 여러 번 교정
- **방지**: Ocean Cellar padding은 `clamp(64px, 8vh, 120px) 0 clamp(80px, 10vh, 140px)` 고정. Partnership과 반드시 동일

### 스크롤 전환 구간 텍스트 가독성
- **실패**: 배경색 light→dark 전환 중간에서 텍스트 대비 부족
- **방지**: 색상 전환 섹션에서는 각 텍스트 요소에 해당 시점 배경 밝기 기반 대비색 자동 지정

### J1950(jj.ttf) 폰트에 "월" 글리프 없음
- **실패**: Paper에서 "2026년 6월.", "바다에서 6개월." 등 "월"이 포함된 카피가 빈칸으로 렌더 (2회 발생)
- **신호**: J1950년 M_TT는 KSCpc-EUC 구형 인코딩이라 일부 한글 음절 누락. 확인된 누락 글자: "월", "권"
- **방지**: J1950으로 새 문구 작성 시 반드시 스크린샷으로 글리프 확인. 날짜는 "2026. 06." 숫자 표기, 기간은 "180일" 일수 표기로 우회. 본문 텍스트에는 J1950 사용 금지(헤드라인 전용)

### Paper 에셋은 경로 기준 캐시 — 같은 파일명 덮어쓰기 미반영
- **실패**: 사용자가 이미지 파일을 같은 경로에 덮어썼는데 Paper에 계속 이전 버전이 렌더됨
- **방지**: 이미지 수정 시 새 파일명(v2, v3...)으로 사본을 만들어 참조 교체. 코드 구현 시에는 원본 경로 사용

### 아트보드 정렬은 실측 좌표로 (추정 금지)
- **실패**: First Record 높이를 추정값(4,080)으로 잡고 모바일 행을 배치 → 실제 4,942px이라 두 번 겹침. 사용자 두 차례 지적
- **방지**: 행 재배치 전 반드시 `get_basic_info`로 실측 top/height 확인. fit-content 아트보드는 빌드 후 높이가 변함

### 풀블리드 강한 이미지 연속 배치 = 섹션 분절감
- **실패**: First Record를 풀블리드 4컷 적층으로 만들자 "각각이 다른 섹션 같다"는 피드백
- **방지**: 한 섹션 안의 멀티 이미지는 동일 규격 플레이트 + 연속 배경 + 연결 장치(타임라인 실선)로 묶을 것. 스케일 변주는 클라이맥스 1곳만

### 분할 패널 + 수치 그리드 = SaaS 문법
- **실패**: The Living Record 초안을 좌우 2단(이미지/데이터 패널)로 만들자 "SaaS 페이지 같다"는 피드백
- **방지**: 이 브랜드의 기본 문법은 시네마틱 풀블리드 + 오버레이 기록. 데이터는 패널이 아니라 다큐 타임코드/각주 위치로 (기획서 "대시보드 격자 금지")

### 둥근 필 태그·채운 앰버 버튼 = 조형 언어 위반
- **실패**: Ocean Cellar·Partnership의 알약형 칩 태그 + 앰버 채움 버튼이 "다른 사이트 같다"는 피드백
- **신호**: 사이트 조형 언어는 직선·헤어라인뿐. 곡선 모서리·솔리드 CTA 블록은 이커머스/SaaS 문법. 앰버는 "기록의 잉크"라 큰 면적 장식 금지
- **방지**: 태그 → 점 구분 텍스트 라인, CTA → 헤어라인 언더라인 텍스트 링크(› 화살표에만 앰버 한 점)

### 마케팅 화법 카피는 사실의 무게로 교체
- **실패**: "기다리는 사람의 것"(수요 호소), "D+201"(군사 용어), 가격·티어 코드 노출 → 전부 약하거나 비럭셔리 판정
- **방지**: 수요자 관점 호소 대신 제품이 견딘 사실("천 일의 기록, 한 권의 책"), 직관 표기("201일째"), 가격은 상세에서만. "숫자는 형용사보다 조용하다"

### Turbopack 캐시로 새 CSS 규칙 미적용 (반복 발생)
- **실패**: globals.css에 새 CSS 규칙(timeline 등)을 추가했으나 브라우저에 전혀 반영 안 됨. 브라우저 스타일시트에서 해당 셀렉터가 아예 존재하지 않음
- **신호**: CSS 문법은 정상이고, 빌드도 통과하는데 스타일이 적용 안 되면 Turbopack 캐시 문제
- **방지**: 새 CSS 규칙 추가 후 적용 안 되면 즉시 `rm -rf .next && npm run dev`로 캐시 삭제 + 재시작. CSS 문법 에러 탓으로 돌리지 말고 캐시부터 의심할 것
- **추가**: `@theme`에 없는 CSS 변수(예: `--color-cream`) 사용하면 해당 속성이 무시됨. 반드시 정의된 변수만 사용

### 다국어(i18n) — next-intl 대신 경량 자체 딕셔너리 (2026-07-01)
- **맥락**: KR/EN/FR 랜딩 다국어화. next-intl 표준([locale]/layout.tsx)은 root layout의 <html>·폰트와 서브페이지 5개(meetup·partner 등)를 전부 [locale] 아래로 이전해야 해 범위가 크게 번짐
- **선택**: `src/i18n`(config·dictionaries·types·metadata) + `messages/{ko,en,fr}.json` + 정적 라우트(`/`·`/en`·`/fr`)가 `LandingPage locale=` 재사용. 컴포넌트는 dict를 props로 받음(client 컴포넌트도 직렬화 OK)
- **한글 이미지 타이틀**: ko는 특수서체(J1950) PNG 유지, en/fr은 라틴이라 `locale==='ko' ? <Image> : <span 텍스트>` 조건부 + Cormorant Garamond CSS. 새 폰트/이미지 생성 불필요
- **함정 1 — 공유 컴포넌트**: Footer가 LetterShell(서브페이지)에서도 쓰임 → props 필수화하면 타입 에러. `locale='ko', dict=koDict.footer` 기본값으로 무손상
- **함정 2 — <html lang>**: 방법 B는 root layout이 정적 라우트 locale을 몰라 ko 고정. HtmlLang 클라이언트 컴포넌트가 hydration 후 documentElement.lang 교정(SEO 언어 신호는 hreflang이 담당)
- **금지어**: 번역 시 "luxury/exclusive/timeless" 회피 — ko "럭셔리 호텔 바" → en "Grand hotel bars". 법적 문구(음주경고·법인정보)는 한국 법령 기준이라 전 로케일 ko 원문 유지
- **검증**: `.reveal`은 IntersectionObserver로 opacity:0 시작 → Playwright 정적 캡처 시 안 보임. `document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-visible'))`로 강제 후 캡처

### 럭셔리 톤 = 평면·직각·무채 (글라스모피즘 금지) (2026-07-02)
- **맥락**: 연령확인 게이트 모달 1차 구현이 "촌스럽다" 지적받음. 원인: backdrop-filter blur(글라스모피즘) + box-shadow + 텍스트 로고 사용
- **근본 원인**: **Paper 디자인 가이드 Components 아트보드의 DON'T** — 글라스효과·그림자·둥근 모서리는 "소비자 테크"로 읽힘. 럭셔리 = 평면·0.5px 보더·직각·무채·넓은 여백. CLAUDE.md의 "Ocean Glass glassmorphism" 표기와 상충하나 **Paper 가이드가 정본**
- **감지 신호**: 다크 모달/오버레이에 blur·shadow·card box를 쓰고 싶을 때 → 멈추고 Paper Components 가이드 확인. 브랜드 자체 UI 문법(헤어라인 언더라인 링크·직각 hairline 보더)을 먼저 볼 것
- **방지 규칙**: ① UI 디자인 전 Paper "MDM 디자인 가이드" 페이지(특히 Components DO/DON'T)를 get_screenshot으로 먼저 확인 ② 로고는 반드시 이미지 에셋(합본=logo_all_W_KR.png, 심볼=logo_trans_W.png, 텍스트=logo_text_trans_W.png), 텍스트로 대체 금지 ③ Paper 로컬이미지 삽입은 paper-asset:// 실패 시 기존 노드 x-paper-clone
- **검증**: Paper에서 아트보드 디자인 → get_computed_styles로 값 이식 → 코드 반영 후 Playwright 대조. CSS 새 규칙은 Turbopack HMR이 부분 누락 → `rm -rf .next` 후 재시작으로 확정 검증(getComputedStyle로 확인)

## Paper MCP 스크린샷·export가 이 하네스에서 이미지 바이트를 반환하지 않음 (2026-07-24)
- **실패 모드**: `mcp__paper__get_screenshot`은 "completed with no output", `mcp__paper__export`는 `"exports": []`만 반환 — 실제 이미지 데이터가 대화로 전달되지 않음.
- **감지 신호**: Paper 스크린샷/export 호출 결과에 이미지가 안 보임.
- **방지/대안**:
  1. 디자인 시각 검증은 **Playwright 스크린샷 → Read(png)** 로 한다(dev 서버 실렌더). Paper는 구조 파악용으로 `get_jsx`/`get_tree_summary`(정확한 CSS 값·카피)만 쓴다.
  2. 디자인의 폰트-이미지 에셋(예: J1950 한글 타이틀)이 필요하면 Paper export 대신 **로컬 폰트로 직접 렌더**한다. J1950 M 폰트는 이 Mac에 설치돼 있음: `~/Library/Fonts/jj.ttf` ("J1950년 M_TT", PS명 J1950M-KSCpc-EUC-H). Pillow로 @3x 투명 PNG 렌더 → `getbbox()` 타이트 크롭. 렌더 전 `fontTools`로 글리프 존재(cmap) 확인.
- **관련**: 랜딩·/method의 J1950 한글 타이틀도 전부 PNG(라이브 텍스트 아님) — 이 프로젝트에서 J1950은 항상 이미지로 간다.

## /b NFC 라우트는 GSAP 사용이 정상 (2026-07-24)
- CLAUDE.md의 "GSAP 미사용"은 **메인 랜딩** 한정. `/b`(BottleRecord)는 이미 GSAP+ScrollTrigger로 8줄기 스크럽·카운트업 구현 중 → 이 라우트의 새 스크롤 모션은 기존 GSAP 패턴을 확장하면 된다(라이브러리 도입 승인 불필요).

## 인증서 PNG 저장 = html-to-image + 오프스크린 카드 (2026-07-24)
- 인증서를 고해상 PNG로 저장할 땐 스크롤 페이지 전체가 아니라 **별도의 포트레이트 "저장용 카드"**를 오프스크린(`position:absolute; left:-99999px`)으로 두고 `toPng(node, { pixelRatio: 3, backgroundColor })`로 렌더한다. 병 이미지는 same-origin(`/images/...`) 직접 `<img>`(next/Image 아님)라 CORS 타인트 없음.
- 공유: `navigator.canShare({files})` 지원 시 `navigator.share({files})`, 아니면 다운로드 폴백.
- 좁은 pill에 한글(예: "소유 인증서")이 줄바꿈될 수 있음 → 태그류엔 `white-space: nowrap` 필수.

## /b 공개 URL의 PII는 서버에서 마스킹 (2026-07-24)
- /b/[code]는 NFC 태그로 열리는 **공개 URL** — 소유자 이름/이메일 원본을 클라이언트로 보내지 말 것. `data.ts`에서 마스킹(`백••`, `ho•••@gmail.com`)한 값만 반환한다(data.ts 상단 게이팅 원칙과 일치).
- 인증 없는 상태에서 "본인 인증 완료" 같은 문구를 쓰지 말 것(거짓 표시) → "소유 등록 완료"처럼 실제 상태만. 소유권 이전·정보 수정 등 변경 액션은 소유자 인증 도입 전까지 실행하지 말고 "준비 중"으로 둔다.

## /b 소유자 인증 = 이메일 OTP + HMAC 서명 쿠키 (2026-07-24, phase-3)
- 세션은 DB 테이블 없이 **HMAC 서명 토큰(httpOnly 쿠키, /b/{code} 스코프, 30분)**. `BOTTLE_SESSION_SECRET` env 필요(.env.local + Vercel). OTP·토큰은 `sha256(secret|nfc|code)`로 해시 저장, 평문 미저장, 비교는 timingSafeEqual.
- 쿠키 `cookies().set/delete`는 **서버 액션/라우트 핸들러에서만** 가능(서버 컴포넌트 page에선 읽기 getOwnerSession만). 그래서 verify/signout은 액션, page는 세션 읽어 authed·원본 전달.
- 변경/이전 액션은 클라이언트 신뢰 금지 — 서버 액션 내부에서 getOwnerSession으로 **재확인 후에만** 실행.
- OTP E2E 테스트 시 인박스 없이 검증: DB에서 code_hash 조회 → 비밀키로 6자리 브루트포스(1M SHA-256, 즉시). 단 `. ./.env.local` source가 값 로드에 실패할 수 있으니 파일에서 직접 파싱해 secret을 읽을 것(길이 검증).
- 소유권 이전은 되돌릴 수 없음: 새 소유자가 이메일 토큰 링크로 수락(토큰 소유=이메일 통제 증명) → 새 등록행 삽입=최신 소유자 + 감사 로그. Supabase JS는 멀티스테이트먼트 트랜잭션이 없어 순차 처리(삽입 성공 후 상태 갱신).
