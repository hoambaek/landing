/**
 * 숙성 기간 — 입수·인양 날짜 사이의 실제 경과.
 *
 * 전에는 연도 뺄셈(retrievalYear - immersionYear)으로 재고 하한을 1년으로 잡았다.
 * 두 군데가 틀렸다.
 *   Atomes 2년  2026-01-01 → 2027-12-30 : 2027-2026 = 1  → 12개월 (실제 24개월)
 *   En Lieu Sûr 2026-01-01 → 2026-06-30 : 2026-2026 = 0  → 하한에 걸려 12개월 (실제 6개월)
 * 달력 연도는 기간이 아니다. 일수로 잰다.
 *
 * record·certificate·owner 세 곳에 같은 식이 복제돼 있었다 — 여기 하나만 둔다.
 */

/** 하루(ms) */
const DAY = 86_400_000;
/** 평균 한 달(일) — 윤년 포함 그레고리력 기준 365.25/12 */
const DAYS_PER_MONTH = 365.25 / 12;

/**
 * 최소 숙성 기간 12개월 — 제품 규칙이다. 모든 라인이 최소 1년이고 Atomes 2Y만 2년이다.
 *
 * 2026-07-27 기준 inventory_batches는 이 규칙과 일치한다(En Lieu Sûr 6개월·매그넘 11개월로
 * 잡혀 있던 인양일을 aging_products.planned_duration_months=12에 맞춰 바로잡았다).
 * 하한은 그 뒤 잘못 입력된 배치가 규칙보다 짧은 기간을 대외 표기로 내보내는 것만 막는다.
 */
const MIN_MONTHS = 12;

/** 날짜가 없거나 뒤집힌 병 */
const FALLBACK_MONTHS = 12;

export function agingMonths(immersion: string | null, retrieval: string | null): number {
  if (!immersion || !retrieval) return FALLBACK_MONTHS;
  const from = Date.parse(immersion);
  const to = Date.parse(retrieval);
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) return FALLBACK_MONTHS;
  return Math.max(MIN_MONTHS, Math.round((to - from) / DAY / DAYS_PER_MONTH));
}

/** 연 단위 표기용. 12로 나눠 반올림하되 최소 1년 — "0년 숙성"은 표기가 아니다. */
export function agingYears(immersion: string | null, retrieval: string | null): number {
  return Math.max(1, Math.round(agingMonths(immersion, retrieval) / 12));
}

/**
 * 입수 연차 — 제품 식별의 두 번째 조각(큐베명 · 입수 연차 · 숙성 기간).
 *
 * 해저 숙성은 매년 반복되므로 연차가 없으면 2027년 1년물이 2026년 1년물과 같은 이름이 된다.
 * 기준은 인양이 아니라 입수 연도다. 페이지가 숙성 중에도 열려 인양 연도는 그때 미래 날짜이고,
 * 인증서 ID가 이미 입수 연도로 만들어진다(MDM-{입수연도}-{병번호}) — 어긋나면 한 문서에 연도가 둘이 된다.
 *
 * record·certificate 두 곳과 인증서 ID 생성부에 같은 식이 복제돼 있었다. 여기 하나만 둔다.
 */
export function immersionYear(immersion: string | null): string {
  return immersion?.slice(0, 4) || String(new Date().getFullYear());
}
