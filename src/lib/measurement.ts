/**
 * 해저 측정 경과일 — 숫자의 단일 출처(Single Source of Truth).
 *
 * Living Data 카운터("N일째")와 메뉴 오버레이 관측 라인("측정 N일째")이
 * 반드시 같은 값을 쓰도록 여기서만 계산한다. "측정은 멈추지 않습니다"라는
 * 브랜드 약속상, 한 화면에서 다른 숫자가 나오면 안 된다.
 */

/** 측정 시작일(첫 입수일). 기준값 — 이 날짜로부터 경과일을 1-indexed로 센다.
 *  2023-02-11 = 첫 입수(2026-07-15 대표 확인). method 페이지의 "1차 · 2023",
 *  시즌 축 "2023 겨울 → 2026 겨울"과 같은 기점이다. 월은 0-indexed(1 = 2월). */
export const MEASURE_START = Date.UTC(2023, 1, 11); // 2023-02-11

/** 오늘 기준 경과일 ("N일째" — 입수 당일이 1일째). */
export function computeMeasureDays(): number {
  const elapsed = Date.now() - MEASURE_START;
  return Math.floor(elapsed / 86_400_000) + 1;
}
