# TODO

> 현재 진행 중인 작업과 발견 사항을 기록한다.

## 진행 중

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
