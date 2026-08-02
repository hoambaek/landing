# Paper 시안 → 코드 구현 플랜

> ⚠️ **2026-08-02 대표 확정으로 최장 티어가 2년(T-24)으로 변경됨.** 이 문서 본문의 `3년`·`bottle-outline-3yr.png` 표기는 작성 시점(2026-06-10) 기록이며 현재 정본이 아니다(실제 에셋은 `bottle-outline-2yr.png`). 정본은 `docs-vault/brand/musedemaree/brand-direction-2026.md`.

> **버전:** 1.0 · 2026-06-10
> **소스 오브 트루스:** Paper 파일 "Muse de Marée" (Page 1) — 데스크톱 8섹션 + 모바일 8섹션 + 메뉴 오버레이 2종 + 서브 페이지 3종
> **원칙:** 수직 슬라이스(섹션 단위 구현→검증→다음), 비파괴(기존 섹션 컴포넌트 슬롯 재활용), 기존 패턴 준수
> **참조 문서:** `2026-06-10-homepage-structure.md`(섹션 스펙) · `brand-direction-2026.md`(카피 헌법) · `docs/brand/image-generation-guide.md`(그레이딩) · `tasks/lessons.md`(함정 목록)

---

## 0. 현재 상태 요약

### 코드 (src/components/sections/)
| 기존 컴포넌트 | 운명 |
|---|---|
| HeroSection | **리워크** (h3 이미지 + 새 카피) |
| DataArchiveSection (+Client, Metrics) | **대체** → TheLivingRecordSection |
| ObservationSection | **폐기** (시안에서 삭제됨) |
| — (신규) | **TheFirstRecordSection** 추가 |
| ArchiveSection | **리워크** → Collection (시간 띠 + NFC 카드) |
| TheMakerSection | **리워크** (메이커 캐러셀) |
| OceanCircleSection | **카피·UI 정비** (Privé) |
| ProfessionalsSection | **카피·UI 정비** (Partnership) |
| TastingSection / OriginSection / NfcSection | 시안 외 — 폐기 검토 (게이트 G6) |
| Footer / Header | **리워크** |

### 워킹 트리 미커밋 변경 (주의)
- `Header.tsx` + `globals.css`: 헤더 로고 화이트/블랙 스왑 구현 **이미 절반 진행됨** (세션 초반 작업, 미검증). Phase 1에서 이어서 검증 후 커밋.
- `tasting.mp4/webp` 삭제됨 — TastingSection 폐기와 함께 정리.

### 에셋 현황 (public/images/)
| 에셋 | 상태 |
|---|---|
| h3.png / h3.webp / h3_m.webp / h3_m2.webp | 보유 — **h3.webp(데스크톱)·h3_m2.webp(모바일)가 최종.** h3.png, h3_m.webp 정리 |
| o3.webp / o3_m.webp(+v2,v3) | o3_m.webp 최종(v 사본은 Paper 캐시용 — 코드에선 원본 사용). 데스크톱 o3.webp는 **그레이딩 재보정 필요** (가이드 §4) |
| ai/rec01~04.jpg | First Record 시안용 AI 이미지 — webp 변환 + 그레이딩 통일. **인양 실사 확보 시 교체 전제** |
| bottle-outline-3yr.png | 라인 드로잉 병 — 투명 배경 PNG로 재출력 권장 (현재 흰 배경 + multiply 의존) |
| logo/ (7종 + v2 사본) | 보유 — v2 사본 정리, 코드는 원본 참조 |
| f2.webp, m1/m2.webp, 01~06.webp | 보유 — 그대로 사용 |

---

## 1. 결정 게이트 (구현 착수 전 CEO 확인)

| # | 결정 | 기본값(추천) |
|---|---|---|
| G1 | 히어로: landing.mp4 영상 상태머신 유지 vs 정지 이미지(h3) | 기획서는 영상 유지 — **영상 위에 새 카피**, h3는 포스터/폴백 |
| G2 | 모토 서체: Mrs Saint Delafield(시안 렌더) vs Cormorant Italic(기획서) | 시안 확정대로 **Delafield** → 웹폰트 라이선스 확인 필요 |
| G3 | 771일째 기준일: 측정 시작일 실제 날짜 | 확정 필요 — 카운터는 시작일 기준 자동 계산으로 구현 |
| G4 | 관측 로그 수치(수온·해류·수압): 정적 vs Supabase 라이브 | 1차 정적(실측 스냅샷), 2차 라이브 연동 |
| G5 | 서브 페이지 폼 제출 저장소 | Supabase 테이블 3종(RLS 필수) — invitations / partner_inquiries / brandbook_requests |
| G6 | TastingSection·OriginSection·NfcSection 폐기 여부 | 폐기 (NFC 콘텐츠는 Collection 기록 카드에 흡수됨) |
| G7 | 기획 문서 QR→NFC 표기 갱신 | 갱신 (brand-direction §7, homepage-structure S4) |

---

## 2. Phase 0 — 사전 정비 (½일)

- [ ] 에셋 정리: 최종본 확정·중복 삭제(h3.png, v2/v3 사본), rec01~04 jpg→webp, 전체 그레이딩 가이드 §4 기준 재보정
- [ ] `@theme` 토큰 추가 확인: `--color-circle-bg(#0A0D12)` `--color-warm-paper(#E3E0DC)` `--color-sand(#E8E5E1)` `--color-warm-ivory(#ECEAE6)` 등 시안 사용 색 전수 대조 (lessons: 미정의 변수 사용 금지)
- [ ] 폰트: J1950(--font-jj) 서브셋 점검 — **"월"·"권" 글리프 없음** → 해당 글자가 들어가는 카피 금지 검증 유틸(스크립트로 카피 상수 스캔). 모토 서체(G2) 로드
- [ ] Paper 정확값 추출 워크플로 합의: 스타일은 `get_computed_styles`/`get_jsx`로 추출, 스크린샷은 검증용으로만 (가이드 원칙)
- 검증: 빌드 통과 + 토큰 런타임 해석 확인

## 3. Phase 1 — Header & 메뉴 오버레이 (1일)

- [ ] 워킹 트리의 로고 스왑 변경 재개: 심볼 좌측 + 텍스트 로고 중앙, 다크/라이트 섹션별 화이트↔블랙 크로스페이드 (`useHeaderScroll().isDark` 기존 로직 재사용)
- [ ] LIGHT_SECTIONS 갱신: observation 제거, 새 섹션 id 반영 (the-first-record 라이트 구간 처리 — 섹션 내 명도 전환은 S3 자체 배경 기준)
- [ ] 메뉴 오버레이 리디자인: 아카이브 넘버링 내비(01~07, mono 번호 + Cormorant 항목, 활성 앰버), 심볼 워터마크(4.5%), 하단 REC 라이브 라인 + KR/EN/FR
- [ ] 모바일 메뉴 = 동일 컴포넌트 반응형 (시안: Mobile — Menu Overlay)
- 검증: 스크롤 전 구간 로고 색 전환, 포커스 트랩 회귀(기존 a11y 유지), Playwright 데스크톱+모바일

## 4. Phase 2 — Hero (1일)

- [ ] 카피 교체: H1 "지금 이 순간에도, 한 병의 샴페인이 / 바다 아래에서 1년의 시간을 보내고 있습니다." (J1950, 데스크톱 3행 분할 nowrap)
- [ ] 브랜드 라인: "해저숙성 샴페인"(Noto 300) + "뮤즈드마레"(J1950) 인라인 페어, 앰버
- [ ] 이미지: G1 결정 반영 — `<picture>` 데스크톱 h3.webp / 모바일 h3_m2.webp art direction
- [ ] 좌측 스크림(데스크톱) / 상단 블러 마스크(모바일 — backdrop-filter+mask, -webkit- 프리픽스, will-change)
- [ ] 모바일: H1 5행 분할·중앙 정렬, 헤더 축소판
- 검증: LCP(이미지 preload·priority), 구 카피("두 개의 떼루아") 전 코드 grep 0건, 모바일 뷰포트 스냅샷

## 5. Phase 3 — The Living Record (1일)

- [ ] 신규 `TheLivingRecordSection` (`#data-archive` id 유지 — 비파괴): 풀블리드 o3, 카피 3행, 닫는 선언
- [ ] `<DaysCounter>` 컴포넌트: G3 시작일 기준 일수 자동 계산, J1950 + "일째", 숫자 카운팅 모션(기존 P1 백로그 패턴)
- [ ] 관측 로그 라인: REC 타임코드 + 수온/해류/수압/좌표 (G4 — 1차 정적 상수, mono)
- [ ] 모바일: o3_m 풀블리드 레이아웃
- [ ] DataArchive 구 컴포넌트 제거(또는 보관 폴더)
- 검증: 시제 카피 정합("기록되고 있다"), reduced-motion 폴백, 다크 구간 헤더 화이트 로고

## 6. Phase 4 — The First Record (1.5일)

- [ ] 신규 `TheFirstRecordSection`: 연속 그라데이션 배경(navy→중간조→warm-ivory, 3블록+브릿지 — 기획서 구현 방식), 타임라인 실선, 플레이트 4컷(좌680/우480/중앙920 클라이맥스/중앙920 정방형) + mono 타임코드 캡션
- [ ] 카피: 진입 "2026. 06. 첫 번째 기록이 수면 위로 돌아왔습니다." · 클로징 "병마다 다른 바다의 필적..." · "서막 — ÉDITION ZÉRO"
- [ ] 스크롤 리빌(IntersectionObserver 기존 ScrollReveal 재사용, opacity+8px rise)
- [ ] 모바일: 3컷 압축(어둠/첫 빛 풀블리드/원고 정방형)
- 검증: 명도 전환 구간 텍스트 대비(lessons), reduced-motion 정적 2단 폴백, 이미지 lazy 로딩

## 7. Phase 5 — Collection (1.5일)

- [ ] ArchiveSection 리워크: 상단 f2 풀블리드(하단 sand 그라데이션) → 타이틀+카피 → 시간 띠 → 그리드 → NFC 기록 카드 → 안내 라인
- [ ] 시간 띠: 3열(모바일 세로 스택) "바다에서 180일, / 사계절을 지나 1년, / 그리고 심해에서 3년." + 서브(첫 문장/견딘 병/한 권의 책) + T-12 앰버 도트
- [ ] 큐베 그리드: **박스 없는 진열**, object-fit contain·컨테이너 동일 크기(확정 선호 — crop 절대 금지), Édition Zéro=06.webp+SOLD OUT 55% 투명, 005=라인 병+"3년"(Noto)
- [ ] `<RecordCard>` 컴포넌트: 증서(rotate 2°, 호버 리프트 스프링 — 기획), 데이터 4행 + **NFC 심볼**(QR 아님), 모바일 카드 단독
- [ ] 가격·티어 코드 미노출 (제품 상세에서만 — 기획 확정)
- 검증: contain 규칙 전 카드 확인, 앰버 사용처 점검(도트+카드 No.만), 모바일 2열 그리드

## 8. Phase 6 — The Maker (1일)

- [ ] 메이커 데이터 구조: `makers: Maker[]` 배열 (name, maison no, region, since, desc, stats, image, revealed: boolean) — **확장 전제(10+ 대비)**
- [ ] 캐러셀: 한 슬라이드 풀 + 다음 슬라이드 피크(72px), Framer Motion drag + ‹› 버튼, 카운터 `01 / N` + 비공개 티저 라인
- [ ] 슬라이드 2(비공개): m2 베일 이미지 + "두 번째 서명" + "2027 · 다음 입수와 함께 공개"
- [ ] 모바일: 세로 카드(이미지 상단) 동일 캐러셀
- 검증: 키보드 내비/스와이프, 슬라이드 추가 시 레이아웃 무변경 확인(mock 3번째 추가 테스트)

## 9. Phase 7 — Ocean Cellar Privé & Partnership (½일)

- [ ] 카피: "Ocean Cellar Privé." / "인양을 가장 먼저 지켜보는 사람들." / 태그→점 구분 라인 / Partnership "바다가 기록한 시간을, 당신의 식탁이 잇는다."
- [ ] UI 문법 교체: **필 태그·채운 버튼 전면 제거** → 점 구분 텍스트 + 헤어라인 언더라인 링크(› 앰버) — lessons 항목 준수
- [ ] eyebrow 앰버 통일(MEMBERSHIP/PROFESSIONAL), 모바일 콘텐츠 블록 gap 16/하단 60
- 검증: 높이 Partnership 동일 규칙(확정 선호) 유지 확인

## 10. Phase 8 — Footer (½일)

- [ ] 로고 락업 logo_all_W_KR(250px, 모바일 170px) → 모토(G2 서체, 18px) + 앰버 헤어라인 40px → 내비 3열(COLLECTION/RECORD/RELATION) → 법무 라인
- [ ] 모바일: 전 요소 중앙 정렬, 내비 세로 스택, 이메일 별도 줄, SNS 아이콘 22px
- [ ] 구 카피("두 개의 떼루아") 제거 — 전 코드 grep 최종 확인
- 검증: 수미상관(히어로 서명과 동일 문장·서체)

## 11. Phase 9 — 서브 페이지 3종 (1.5일)

- [ ] 라우트: `/invite`(다크 블루) · `/partner`(#F5F1E8) · `/brand-book`(#E8E5E1) — 편지형 560px 칼럼 공용 레이아웃
- [ ] `<UnderlineField>` 컴포넌트: mono 라벨 + 박스 없는 인풋 + 헤어라인, **focus 시 앰버 전환**(입력=기록 행위)
- [ ] 제출: G5 Supabase 테이블 + RLS(insert-only anon), 성공 상태는 조용한 확인 문구(명사형)
- [ ] 메인 CTA 연결: 초대 신청하기/파트너 문의/브랜드 소개서 → 각 라우트
- [ ] 모바일 반응형 (시안은 데스크톱만 — 같은 칼럼 24px 마진 축소)
- 검증: 폼 a11y(label/required/error), RLS 정책 테스트, 키보드 제출

## 12. Phase 10 — 통합 검증 & 마감 (1일)

- [ ] 카피 전수 대조: 금지어 grep(맛/향/풍미/두 개의 떼루아/luxury/exclusive/timeless/D+), 명사형 종결, J1950 누락 글리프(월·권) 스캔
- [ ] 성능: LCP ≤ 2.0s, First Load JS ≤ 90KB, 이미지 sizes/priority, 폰트 서브셋
- [ ] a11y: 색 대비(앰버 on 다크 확인), skip link(기존 P1), reduced-motion 전 섹션
- [ ] Playwright 풀 패스: 데스크톱 1440 + 모바일 390, 섹션별 스냅샷 vs Paper 시안 대조
- [ ] SEO/OG: 메뉴 구조 변경 반영(sitemap, JsonLd 섹션명)
- [ ] 문서 갱신: G7 QR→NFC, todo.md 체크오프

---

## 13. 일정 요약 (순차 기준 ~9.5일)

| Phase | 내용 | 예상 |
|---|---|---|
| 0 | 사전 정비 | 0.5일 |
| 1 | Header & 메뉴 | 1일 |
| 2 | Hero | 1일 |
| 3 | The Living Record | 1일 |
| 4 | The First Record | 1.5일 |
| 5 | Collection | 1.5일 |
| 6 | The Maker | 1일 |
| 7 | Privé & Partnership | 0.5일 |
| 8 | Footer | 0.5일 |
| 9 | 서브 페이지 3종 | 1.5일 |
| 10 | 통합 검증 | 1일 |

각 Phase 완료 = 동작 검증 + 커밋 (롤백 단위). Phase 2~8은 섹션 독립적이라 필요 시 순서 조정 가능하나, **Phase 1(헤더)이 모든 섹션의 다크/라이트 판별에 걸려 있어 최우선.**

## 14. 리스크

- **J1950 글리프**: 새 카피 추가 때마다 월·권 외 누락 가능 — Phase 0의 스캔 유틸로 상시 검증
- **landing.mp4 ↔ h3 이미지 충돌(G1)**: 영상 유지 시 새 카피 가독성을 영상 톤에서 재검증 필요
- **Turbopack 캐시**: 새 CSS 규칙 미반영 반복 이력 — 적용 안 되면 즉시 `rm -rf .next` (lessons)
- **AI 이미지(rec01~04)**: 케이지 기하 실물 불일치 가능 — 첫 인양 실사 확보 즉시 교체, 시안 임시임을 커밋 메시지에 명기
- **AOC 'Champagne' 법무 게이트**(기획서 §12): 카피 구현과 무관하게 병행 확인 필요
