# TODO

> 현재 진행 중인 작업과 발견 사항을 기록한다.

## 진행 중

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
