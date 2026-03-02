# 홈페이지 구현 1차 검토 — 총괄팀

> 검토일: 2026-02-23
> 검토자: 00-luxury-branding-team (총괄 리더)
> 기준: `brand-standards.md`, `wireframe/homepage-wireframe.html`

---

## 핵심 결론

코드 구현이 와이어프레임에 높은 충실도로 완성되었다. 7개 섹션의 구조, 카피, 스타일이 와이어프레임과 거의 1:1로 일치하며, CSS 토큰/이징/간격 시스템이 정확히 이식되었다. 럭셔리 기준서의 4대 축(언어, 시각, 경험, 기술) 중 언어와 시각은 높은 수준으로 통과한다. 경험 측면에서 S2 Pressure Descent의 스크롤 연동 경험이 핵심 차별점으로 잘 구현되었으나, 헤더 색상 전환 미구현, 섹션 인디케이터의 Ocean Circle 네비게이션 링크 불일치, 접근성 보강(포커스 트랩, aria-expanded, skip link) 등 기술 측면의 보완이 필요하다. 크리에이티브 팀 산출물(영상/사진 프롬프트)은 브랜드 톤에 정합하며, 에셋 제작 착수가 가능한 상태다.

---

## 팀별 산출물 검토

### 01-frontend-team — 코드 구현

#### 와이어프레임 충실도

**구조** — 통과

| 항목 | 와이어프레임 | 코드 구현 | 일치 |
|------|------------|----------|------|
| 페이지 섹션 순서 | S1→S2(Descent+Evidence)→S3→S4→S5→S6→S7→Footer | 동일 | O |
| Header (fixed, 햄버거) | Logo + 3줄 메뉴 | 동일 | O |
| Fullscreen menu overlay | 좌측 nav + 우측 큐베 + 하단 SNS/언어 | 동일 | O |
| S1 sticky pin 200vh | `height: 200vh`, sticky top:0 | 동일 | O |
| S2 sticky pin 400vh | `height: 400vh`, 5 facts + climax | 동일 | O |
| S2 Evidence (Before/After) | 3쌍, 2컬럼 그리드 | 동일 | O |
| S3 SVG 파동 + 3메트릭 | wave-path 3개, 메트릭 3개 | 동일 | O |
| S4 2컬럼 카드 | Mignon Boulard + Muse de Maree | 동일 | O |
| S5 캐러셀 + 프로비넌스 | 5카드 + NFC/블록체인 | 동일 | O |
| S6 링 애니메이션 + 카피 | 3중 링 + CTA | 동일 | O |
| S7 중앙 정렬 카피 | 타이틀 + 설명 + CTA | 동일 | O |
| Section Indicator | 우측 도트 7개 + gap | 동일 | O |
| ScrollReveal | IO threshold 0.15, rootMargin -8% | 동일 | O |
| Footer | 로고 + 카피 | 동일 | O |

**카피** — 통과

모든 섹션의 한국어/영어/프랑스어 카피가 와이어프레임과 문자 단위로 일치한다.

| 섹션 | 주요 카피 | 일치 |
|------|----------|------|
| S1 | "깊이의 증거" / "한국의 심해에서 숙성된 샴페인" | O |
| S2 Descent | 5개 수심 fact + "아무것도 하지 않았다. 전부 달라졌다." | O |
| S2 Evidence | "같은 병." / 3쌍 before/after 설명 / "겉에서 일어난 일. 안에서도 일어났다." | O |
| S3 | "depth record" / "data archive." / 메트릭 수치 / 하단 카피 | O |
| S4 | "the maker." / "이중의 떼루아" / 카드 설명 | O |
| S5 | "archive." / 5개 큐베 이름+설명 / NFC 프로비넌스 카피 | O |
| S6 | "ocean circle." / "가입이 아니다. 초대." / "원에 들어오다" | O |
| S7 | "for professionals." / "바다의 시간을 테이블 위에 놓는 일." | O |

**스타일 (CSS)** — 통과 (일부 차이 존재)

globals.css가 와이어프레임 CSS를 Tailwind v4 `@theme` 구조로 정확히 이식했다. 주요 검증 항목:

| 항목 | 와이어프레임 | 코드 | 일치 |
|------|------------|------|------|
| 컬러 토큰 (Abyssal Amber) | 13개 토큰 | 동일 | O |
| 이징 커브 3종 | gentle, water, slow | 동일 | O |
| 필름 그레인 overlay | opacity 0.035, fractalNoise 0.85 | 동일 | O |
| 한지 텍스처 | opacity 0.04, fractalNoise 0.015 | 동일 | O |
| 한지 섹션별 오버라이드 | S4: 0.05, S5: 0.035, S7: 0.035 | 동일 | O |
| 반응형 tablet (1023px) | margin 40px, 간격 축소 | 동일 | O |
| 반응형 mobile (767px) | margin 24px, 그리드 단일컬럼 | 동일 | O |
| prefers-reduced-motion | 애니메이션 비활성, reveal 즉시, particle 숨김 | 동일 | O |
| 타이포그래피 | Cormorant Garamond + Noto Sans KR, 모든 사이즈/웨이트 | 동일 | O |

**차이점**: 와이어프레임은 `var(--grid-margin)` CSS 변수로 padding을 제어하지만, 코드 구현은 반응형에서 직접 px 값을 하드코딩했다. 기능적으로 동일하나, 변수 기반이 유지보수에 유리하다.

#### 럭셔리 기준 통과 여부

- **언어**: 통과. 판매 언어 없음. CTA가 "원에 들어오다", "문의하기"로 절제됨.
- **시각**: 통과. Abyssal Amber 팔레트 100% 준수. 여백 넓고 의도적.
- **경험**: 조건부 통과. 3초 몰입 구조 확보(라이트 히어로 + 파티클). 자발적 발견 유도.
- **기술**: 조건부 통과. reduced-motion 대응 완료. 접근성 보강 필요.

#### 발견된 이슈

| # | 우선순위 | 이슈 | 상세 |
|---|---------|------|------|
| F-01 | P0 | 헤더 색상 전환 미구현 | S1(라이트 배경)에서 헤더 로고/메뉴가 `--void-text`(#F1EFEB, 밝은 색)로 고정. 라이트 배경에서 헤더가 거의 보이지 않음. 03-ux-team 문서에서도 "와이어프레임 미반영 사항, 반드시 추가 필요"로 명시함. 스크롤 기반 `.header--light` / `.header--dark` 클래스 토글 필요. |
| F-02 | P0 | 메뉴 버튼 aria-expanded 미적용 | `aria-label="메뉴 열기"`는 있으나 `aria-expanded` 상태 토글이 없음. 스크린 리더 사용자가 메뉴 상태를 알 수 없음. |
| F-03 | P0 | 메뉴 오버레이 포커스 트랩 미구현 | Tab 키가 오버레이 밖으로 나감. 럭셔리 브랜드의 접근성 기준 미달. |
| F-04 | P0 | ESC 후 포커스 복원 미구현 | 메뉴 닫기 후 포커스가 메뉴 버튼으로 돌아가지 않음. |
| F-05 | P1 | Skip link 미구현 | 페이지 최상단 "본문으로 건너뛰기" 링크 없음. |
| F-06 | P1 | S3 메트릭 카운팅 애니메이션 미구현 | 와이어프레임에 정적 텍스트로 되어 있으나, `homepage-flow.md` 및 03-ux-team 문서에서 "0 → target 카운팅, 2.0s ease-out, IO 트리거" 명시. |
| F-07 | P1 | S5 캐러셀 도트 스크롤 동기 미구현 | 도트가 정적으로 첫 번째만 활성화. `scrollLeft` 기반 동기 로직 필요. |
| F-08 | P1 | 파티클 페이드아웃 미구현 | S1 스크롤 시 콘텐츠는 퇴장하지만, 파티클 컨테이너의 별도 페이드아웃(progress 30~60%)이 없음. |
| F-09 | P1 | 헤더 스크롤 축소 미구현 | CSS에 `transition: padding 0.5s` 정의되어 있으나, `scrollY > 100px` 시 패딩 축소 트리거 로직 없음. |
| F-10 | P2 | 메뉴 nav에서 Ocean Circle이 `#ocean-circle` 아닌 `/ocean-circle`로 링크 | 와이어프레임에서는 `#void` 등 앵커 링크로 통일. 코드에서 ocean-circle만 별도 페이지 링크. NAV_LINKS 배열에도 `#ocean-circle`이 포함되어 있으므로 정합성 확인 필요. |
| F-11 | P2 | 장식 요소에 aria-hidden 미적용 | S2 깊이 카운터, 수직 라인, S3 SVG, S6 링에 `aria-hidden="true"` 필요. |
| F-12 | P2 | 프랑스어 큐베명에 lang 속성 미적용 | `lang="fr"` 속성 누락. 스크린 리더 발음 정확도에 영향. |

---

### 02-design-team — 비주얼 스펙

**검토 결과**: 통과

`homepage-visual-detail-spec.md`는 와이어프레임 CSS에서 모든 수치를 정밀하게 추출하여 문서화했다. 6개 영역(배경색, 타이포그래피, 간격, 모션, 텍스처, 반응형)이 체계적으로 정리되어 있다.

**우수한 점**:
- 기존 `homepage-visual-spec.md`와 와이어프레임 사이의 차이점을 부록에 명시하고, "와이어프레임 우선" 원칙을 명확히 선언.
- S1 Hero 헤드라인이 Noto Sans KR(본문 서체, weight 200)로 변경된 이유를 "한글 헤드라인이므로 본문 서체 사용"으로 합리적 판단.
- 섹션별 한지 텍스처 opacity 오버라이드까지 추출.

**이슈 없음**.

---

### 03-ux-team — 인터랙션 디테일

**검토 결과**: 통과

`homepage-interaction-details.md`는 프론트엔드 팀이 코드를 작성할 때 놓치기 쉬운 세부사항을 정확히 짚었다. 특히:

**우수한 점**:
- S2 Pressure Descent의 fact 등장/퇴장 타이밍을 수학적 공식으로 정리. 프론트엔드 구현과 정확히 일치함을 확인.
- 가독성 보장 로직(`factBgBrightness` 계산)을 명시하고, S2 전환 중간점의 대비비 위험을 경고.
- 접근성 체크리스트가 구체적이고 실행 가능.
- 구현 우선순위(P0~P2)가 현실적.

**발견 사항**:
- 이 문서에서 지적한 "와이어프레임에 없지만 구현 시 필요한 인터랙션" 5건 중, 프론트엔드가 구현한 것은 body scroll lock(1건)뿐. 나머지 4건(카운팅 애니메이션, 캐러셀 도트 동기, 헤더 스크롤 축소, 헤더 색상 전환)은 미구현. 이는 프론트엔드 이슈(F-06, F-07, F-09, F-01)로 이미 기록됨.

---

### 06-creative-video-team — 영상 프롬프트

**검토 결과**: 통과

`homepage-video-prompts.md`는 11건의 AI 영상 생성 프롬프트를 섹션별로 체계적으로 정리했다.

**럭셔리 기준 검증**:

| 기준 | 판정 | 근거 |
|------|------|------|
| 금지 사항 준수 | 통과 | 텍스트/로고/워터마크, 사람/손/얼굴, 네온/비비드 컬러, 빠른 카메라 이동 모두 명시적 금지 |
| 색온도 구분 | 통과 | 지상 2700K~3200K, 수중 7500K~8500K, 데이터 앰버-골드 — 브랜드 팔레트와 정합 |
| 어조 | 통과 | "meditative, contemplative, quiet luxury" 기조. 자극적/상업적 키워드 없음 |
| 필름 그레인 | 통과 | 전 프롬프트에 "35mm film grain" 필수 적용 |
| 기술 스펙 | 통과 | 4K UHD 원본, FHD 납품, 24fps, MP4+WebM 이중 납품, 무음, 10MB 이내 목표 |

**특기 사항**:
- S5 큐베별 조명 변형 가이드(D20~T18)가 5개 큐베의 성격 차이를 조명 색온도와 표면 질감으로 구분한 것은 브랜드 세계관에 부합.
- 후처리 가이드(채도 -10~-20%, 속도 50~70% 감속, 루프 수동 편집)가 AI 생성물의 과도한 디지털 느낌을 억제하기 위한 구체적 지침 포함.

**보완 권장**:
- S4(The Maker), S6(Ocean Circle), S7(For Professionals)에 대한 영상 프롬프트가 없음. S6의 링 애니메이션 배경에 수중 앰비언트 영상이 있으면 몰입감이 강화될 수 있으나, 현재 CSS 링 애니메이션만으로도 충분히 절제된 표현이므로 필수는 아님.

---

### 07-creative-photo-team — 사진 프롬프트

**검토 결과**: 통과

`homepage-photo-prompts.md`는 13장의 AI 사진 생성 프롬프트를 섹션별로 정리했다.

**럭셔리 기준 검증**:

| 기준 | 판정 | 근거 |
|------|------|------|
| 공통 스타일 | 통과 | "Kodak Portra 400, film grain, warm amber, muted desaturated, no HDR, no studio lighting" |
| 구도 | 통과 | "no centered composition" — 모든 프롬프트에서 오프센터 배치 명시 |
| 제품 표현 | 통과 | "유물처럼, 시간의 기록으로" — "artifact", "geological object", "document of time" 등 |
| 판매 언어 부재 | 통과 | 상업적 제품 사진이 아닌 에디토리얼 스틸 라이프 접근 |
| 큐베별 차별화 | 통과 | 숙성 기간에 따라 해양 부착물 정도가 점진적으로 증가 (09: minimal → 13: 거의 원형 불가) |

**특기 사항**:
- Before/After 6장(S2)이 관찰 일기 형식에 부합. 3쌍(병 전체, 라벨, 코르크)의 비율이 각각 다름(3:4, 4:5, 1:1) — 단조로움 방지.
- S4 Partner Maison 이미지의 "no tourist postcard, no drone shot — this is intimate, ground-level"은 브랜드의 과시하지 않는 태도와 일치.
- 후처리 가이드(채도 -15~-20%, 화이트밸런스 2800K~3200K, 비네팅 추가)가 브랜드 톤 유지에 효과적.

**보완 권장**:
- 웹 포맷이 WebP로 통일되어 있으나, AVIF 대응 여부 검토 필요(더 작은 용량으로 동일 품질 가능).

---

## 크로스-팀 정합성

### 불일치 사항

| # | 관련 팀 | 내용 | 심각도 |
|---|---------|------|--------|
| C-01 | 01 / 03 | 03-ux-team이 명시한 "와이어프레임에 없지만 필요한 인터랙션" 5건 중 4건이 01-frontend에서 미구현 | 높음 |
| C-02 | 01 / 02 | 02-design-team이 추출한 S1 Hero 배경이 라이트(`#ECEAE6`)인데, 01-frontend의 헤더 색상이 라이트 텍스트(`#F1EFEB`) 고정 → 가시성 문제 | 높음 |
| C-03 | 06 / 07 / 01 | 영상 11건 + 사진 13건의 에셋이 아직 생성되지 않아 코드에는 플레이스홀더(그라디언트 배경)만 존재. 에셋 투입 시 이미지 최적화(WebP/AVIF, srcset, lazy loading) 구현 필요 | 중간 |
| C-04 | 03 / 01 | 03-ux-team이 S2 `prefers-reduced-motion: reduce` 시 "모든 fact를 정적으로 세로 나열" 권장했으나, 01-frontend에서 이 대응 미구현. 현재는 CSS 전역 규칙만 적용됨 | 중간 |
| C-05 | 07 / 02 | 07-photo-team의 이미지 비율(3:4, 4:5, 1:1)과 02-design-team의 img-placeholder 비율(3:4 통일)이 불일치. 코드는 S2 Before/After에서 모두 `aspect-ratio: 3/4`로 통일되어 있음. 사진팀의 의도(비율 다양화)를 반영하려면 pair별로 비율을 다르게 설정해야 함 | 낮음 |

### 정합 사항 (잘 맞는 부분)

- 02-design의 모든 타이포그래피 스펙이 01-frontend의 CSS와 px 단위까지 일치.
- 03-ux의 IO 설정(threshold 0.15, rootMargin -8%)이 01-frontend의 `ScrollReveal.tsx`와 정확히 일치.
- 06-video의 S3 파동 시각화 프롬프트가 01-frontend의 SVG 파동 CSS 애니메이션과 동일한 미학적 방향(앰버-골드, 유기적, 느린 움직임).
- 07-photo의 Kodak Portra 400 기조가 02-design의 "필름 그레인, 촉각적" 기준과 일치.

---

## 럭셔리 기준 최종 검토 테이블

| 섹션 | 언어 | 시각 | 경험 | 기술 | 종합 |
|------|------|------|------|------|------|
| S1 The Void | O | O | O | **헤더 가시성** | 조건부 통과 |
| S2 Observation (Descent) | O | O | O | 접근성 보강 | 조건부 통과 |
| S2 Evidence (Before/After) | O | O | O | O | 통과 |
| S3 Data Archive | O | O | 카운팅 없음 | O | 조건부 통과 |
| S4 The Maker | O | O | O | O | 통과 |
| S5 Archive | O | O | 도트 미동기 | O | 조건부 통과 |
| S6 Ocean Circle | O | O | O | O | 통과 |
| S7 For Professionals | O | O | O | O | 통과 |
| Header/Menu | O | O | — | **접근성 3건** | 미통과 |
| Footer | O | O | — | O | 통과 |

**범례**: O = 기준 통과, 굵은 글씨 = 수정 필요

---

## 수정 요청 목록

### 01-frontend-team

| # | 우선순위 | 요청 | 상세 |
|---|---------|------|------|
| F-01 | **P0** | 헤더 색상 전환 구현 | S1 라이트 배경에서 로고/메뉴를 다크(`#312E2A`)로, S2 후반 다크 배경에서 라이트(`#F1EFEB`)로 전환. 스크롤 기반 또는 IO 기반. transition 0.5s var(--ease-water). |
| F-02 | **P0** | 메뉴 버튼 aria-expanded 추가 | `aria-expanded={isOpen}` 토글 적용. |
| F-03 | **P0** | 메뉴 오버레이 포커스 트랩 | 열림 시 Tab이 오버레이 내부에서만 순환. `focusTrap` 구현. |
| F-04 | **P0** | ESC 후 포커스 복원 | 메뉴 닫힐 때 포커스를 `.header__menu` 버튼으로 복원. |
| F-05 | **P1** | Skip link 추가 | 페이지 최상단에 "본문으로 건너뛰기" 링크. `:focus-visible`시 노출. |
| F-06 | **P1** | S3 메트릭 카운팅 애니메이션 | IO `is-visible` 트리거 시 `0 → 20–40`, `0 → 6–12`, `0 → 365`. 2.0s ease-out. |
| F-07 | **P1** | S5 캐러셀 도트 동기 | `scrollLeft` 기반 활성 도트 전환 JS 로직. |
| F-08 | **P1** | S1 파티클 페이드아웃 | 스크롤 progress 30~60%에서 `.s-void__particles` opacity 1→0. |
| F-09 | **P1** | 헤더 스크롤 축소 | `scrollY > 100px`일 때 padding 36px→20px 전환. |
| F-10 | **P2** | Ocean Circle 메뉴 링크 정합성 | NAV_LINKS의 `#ocean-circle`과 메뉴의 `/ocean-circle` 혼재 확인. 앵커 vs 별도 페이지 결정 후 통일. |
| F-11 | **P2** | 장식 요소 aria-hidden | S2 깊이카운터/라인, S3 SVG, S6 링에 `aria-hidden="true"` 적용. |
| F-12 | **P2** | 프랑스어 lang 속성 | 큐베명에 `lang="fr"` 적용 (Header, ArchiveSection 등). |
| F-13 | **P2** | S2 reduced-motion 정적 폴백 | `prefers-reduced-motion: reduce`시 5개 fact를 세로 나열하여 정적 표시. |

### 02-design-team

이슈 없음. 현 상태 유지.

### 03-ux-team

이슈 없음. 현 상태 유지. 향후 프론트엔드 구현 검증 시 이 문서를 기준으로 QA 진행.

### 06-creative-video-team

| # | 우선순위 | 요청 |
|---|---------|------|
| V-01 | **P1** | S1-V01, S1-V02, S1-C01 (히어로 3건) 우선 제작 착수. 프론트엔드의 플레이스홀더 교체를 위해 가장 먼저 필요. |
| V-02 | P2 | S6 Ocean Circle용 수중 앰비언트 루프 추가 검토 (선택 사항). |

### 07-creative-photo-team

| # | 우선순위 | 요청 |
|---|---------|------|
| P-01 | **P1** | S2 Before/After 6장 우선 제작. 코드에서 3:4 비율로 통일되어 있으므로, 라벨(4:5)과 코르크(1:1) 이미지는 3:4 크롭 버전도 함께 납품하거나, 프론트엔드에 비율 변경 요청. |
| P-02 | P1 | S5 큐베 5장 제작. 카드 이미지 비율 3:4에 맞춰 납품. |
| P-03 | P2 | AVIF 포맷 추가 납품 검토 (WebP 대비 30~50% 용량 절감 가능). |

---

## 다음 단계

1. **즉시 (P0)**: 01-frontend-team이 헤더 색상 전환 + 접근성 3건(aria-expanded, 포커스 트랩, 포커스 복원) 수정. 수정 후 총괄팀 재검토.
2. **1주 이내 (P1)**: 프론트엔드 P1 이슈 5건 해결. 영상팀 히어로 3건 + 사진팀 S2 6장 에셋 1차 납품.
3. **2주 이내 (P2)**: 남은 접근성 보강, 에셋 투입, 이미지 최적화 파이프라인 구축.
4. **에셋 투입 후**: 실제 이미지/영상이 들어간 상태에서 럭셔리 기준 2차 검토 실시. 플레이스홀더 상태에서는 "시각 — 이미지 질감" 항목을 정확히 평가할 수 없으므로, 에셋 투입 후 재검토가 필수.

---

*00-luxury-branding-team — 2026-02-23*
