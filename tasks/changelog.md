# Changelog

## 2026-03-22

- 히어로 하단 블러 그라데이션 강화 — observation 연결부 어두운 띠 제거 (160px 유지, 커브 조정)
- Observation 상단 블러 그라데이션 동일 커브 적용 + 높이 240px로 확대
- Sea Log 날짜 텍스트("최근 30일간 측정 데이터 · KST") 위치 변경 — 그래프 하단 → 메트릭 숫자 상단
- Collection 히어로 이미지 타이틀 상단으로 이동
- Collection 히어로 이미지 reveal-scale 애니메이션 추가 (30% 노출 시 scale 1.12→1 축소 페이드인)
- ScrollReveal에 reveal-scale observer 추가 (threshold 0.3)

## 2026-03-17

- NFC 체험 섹션 신설 — image-dominant 레이아웃 (Collection↔The Maker 사이)
- The Maker 세대/연도 정보 시각적 강조 — heritage 분리 + Cormorant Infant italic + amber 컬러
- Collection 큐베 카드 희소성 표시 강화 — edition `<strong>` 볼드 처리
- "living data." → "sea log." 전체 사이트 네이밍 변경 (Header, Footer, DataArchiveSection)

## 이전

- 헤더 색상 전환 구현 (S1 라이트↔S2 다크 스크롤 기반)
- 메뉴 접근성 보강 (aria-expanded, 포커스 트랩, ESC 포커스 복원)
- Ocean Cellar 섹션 디자인 통일 + 텍스트 가시성 개선
- 메뉴 오버레이 리디자인 (다크 배경, 센터 정렬, 골드 그라데이션)
- 메뉴 호버 딜레이 수정 (inline transitionDelay → CSS nth-child)
- 멤버십 텍스트 삭제 + rewards 수평 인라인 레이아웃
- 히어로 라이트 배경 전환
- Phase 2 감각 카피 제거
- Observation 섹션 전면 재기획 (Pressure Descent + Before/After)
- 컬렉션 라인업 실제 큐베명으로 교체
- Data Archive 스펙 실제 수치 반영 (20-40m, 6-12°C)
- The Maker "이중의 떼루아" 서브타이틀 적용

## 발견 사항

- Observation Part A: 스크롤 중간 지점 텍스트 가독성 이슈 → 팩트별 대비색 자동 지정으로 해결
- 카피 톤: "맛"이라는 단어는 판매 언어에 가까움 → 브랜드 기준서 위반
- homepage-plan.html의 스펙(60m, 1.8°C)과 실제 스펙(20-40m, 6-12°C) 불일치 → 실제 기준 적용
