import { unstable_cache } from "next/cache";

/**
 * 완도 해역 관측 데이터 — /method CH01 "최근 30일의 관측" + LIVE 스트립.
 * marketing(plan) 앱 data-log와 동일 소스: Open-Meteo(모델) + KHOA 실측(완도 DT_0027 · 부이 TW_0078).
 * KHOA_API_KEY 없거나 호출 실패 시 해당 항목은 null로 두고 컴포넌트가 기본값으로 대체한다.
 */

const WANDO = { latitude: 34.31, longitude: 126.76 };
const DEPTH_M = 30;
/** 수심 정수압 (atm) — marketing ocean-calculations.ts와 동일 계수 0.0993 atm/m */
const DEPTH_ATM = DEPTH_M * 0.0993;

/* ── 표층 수온 → 수심 보정 (marketing uaps-ocean-profile.ts estimateBottomTemperature 이식) ── */

/** 월별 40m 기준 표층 대비 비율 — 성층화 계절 변화 */
const MONTHLY_DEPTH_RATIO_40M: Record<number, number> = {
  1: 0.92, 2: 0.92, 3: 0.88, 4: 0.8, 5: 0.7, 6: 0.58,
  7: 0.5, 8: 0.5, 9: 0.5, 10: 0.55, 11: 0.72, 12: 0.85,
};
/** 한국 남해 심층 기저 수온 (°C) */
const DEEP_BASE_TEMP = 8.0;

function adjustRatioForDepth(ratio40m: number, depth: number): number {
  if (depth <= 5) return 1.0;
  if (depth <= 40) return 1.0 + (ratio40m - 1.0) * (depth / 40);
  return Math.max(0.3, ratio40m - (depth - 40) * 0.005);
}

/** 표층 수온(SST)을 수심 수온으로 보정 */
function estimateBottomTemperature(sst: number, depth: number, month: number): number {
  const m = ((((month - 1) % 12) + 12) % 12) + 1;
  const ratio = adjustRatioForDepth(MONTHLY_DEPTH_RATIO_40M[m] ?? 0.75, depth);
  return Math.round(Math.max(sst * ratio + DEEP_BASE_TEMP * (1 - ratio), 3.0) * 100) / 100;
}

/** YYYY-MM-DD... → 해당 월 (실패 시 현재 월) */
function monthOf(date: string): number {
  const m = parseInt(date.slice(5, 7), 10);
  return Number.isNaN(m) ? new Date().getMonth() + 1 : m;
}

const MARINE_URL = "https://marine-api.open-meteo.com/v1/marine";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
/** 당일 실시간 관측 (reqDate 미지원 — 당일 데이터만) */
const KHOA_DT_URL = "https://apis.data.go.kr/1192136/dtRecent/GetDTRecentApiService";
const KHOA_TW_URL = "https://apis.data.go.kr/1192136/twRecent/GetTWRecentApiService";
/** 과거 이력 (reqDate=yyyyMMdd 지원) */
const KHOA_SURVEY_TEMP_URL = "https://apis.data.go.kr/1192136/surveyWaterTemp/GetSurveyWaterTempApiService";
const KHOA_SURVEY_TIDE_URL = "https://apis.data.go.kr/1192136/surveyTideLevel/GetSurveyTideLevelApiService";

export interface ObsSeries {
  /** 일 평균 시계열 (과거 → 현재) */
  series: number[];
  /** 최신 관측값 */
  latest: number;
}

export interface OceanObservations {
  seaTemp: ObsSeries | null; // 수온 °C (KHOA 실측 우선, 없으면 Open-Meteo)
  salinity: ObsSeries | null; // 염분 psu (KHOA)
  tideLevel: ObsSeries | null; // 조위 cm (KHOA)
  tidalCurrent: ObsSeries | null; // 조류 유속 m/s (KHOA 부이)
  pressure: ObsSeries | null; // 수압 atm (Open-Meteo 기압 + 수심 정수압)
  waveHeight: ObsSeries | null; // 파고 m (Open-Meteo)
  wavePeriod: ObsSeries | null; // 파주기 s (Open-Meteo)
  oceanCurrent: ObsSeries | null; // 해류 속도 m/s (Open-Meteo)
  updatedAt: string;
}

function dailyMeanPairs(time: string[], values: (number | null)[]): [string, number][] {
  const byDay = new Map<string, { sum: number; n: number }>();
  time.forEach((t, i) => {
    const v = values[i];
    if (v === null || v === undefined || Number.isNaN(v)) return;
    const day = t.slice(0, 10);
    const acc = byDay.get(day) ?? { sum: 0, n: 0 };
    acc.sum += v;
    acc.n += 1;
    byDay.set(day, acc);
  });
  return [...byDay.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([day, { sum, n }]) => [day, sum / n]);
}

function dailyMeans(time: string[], values: (number | null)[]): number[] {
  return dailyMeanPairs(time, values).map(([, v]) => v);
}

function lastValid(values: (number | null)[]): number | null {
  for (let i = values.length - 1; i >= 0; i--) {
    const v = values[i];
    if (v !== null && v !== undefined && !Number.isNaN(v)) return v;
  }
  return null;
}

function toSeries(series: number[], latest: number | null): ObsSeries | null {
  if (!series.length || latest === null) return null;
  return { series, latest };
}

/* ── Open-Meteo ── */

async function fetchOpenMeteo() {
  const common = {
    latitude: String(WANDO.latitude),
    longitude: String(WANDO.longitude),
    timezone: "Asia/Seoul",
    past_days: "30",
    forecast_days: "1",
  };
  const marineParams = new URLSearchParams({
    ...common,
    hourly: ["sea_surface_temperature", "ocean_current_velocity", "wave_height", "wave_period"].join(","),
  });
  const weatherParams = new URLSearchParams({
    ...common,
    hourly: "surface_pressure",
  });

  const [marineRes, weatherRes] = await Promise.all([
    fetch(`${MARINE_URL}?${marineParams}`),
    fetch(`${WEATHER_URL}?${weatherParams}`),
  ]);
  if (!marineRes.ok || !weatherRes.ok) throw new Error("Open-Meteo 응답 오류");

  const marine = (await marineRes.json()) as {
    hourly?: Record<string, (number | null)[] | string[]>;
  };
  const weather = (await weatherRes.json()) as {
    hourly?: Record<string, (number | null)[] | string[]>;
  };

  const mTime = (marine.hourly?.time as string[]) ?? [];
  const wTime = (weather.hourly?.time as string[]) ?? [];
  // 미래 예보 시간 제외 — "관측" 시계열이므로 현재 시각까지만
  const now = new Date().toISOString().slice(0, 13);
  const mCut = mTime.filter((t) => t.slice(0, 13) <= now).length;
  const wCut = wTime.filter((t) => t.slice(0, 13) <= now).length;
  const slice = (arr?: (number | null)[] | string[]) => (arr as (number | null)[] | undefined)?.slice(0, mCut) ?? [];

  const kmhToMs = (v: number | null) => (v === null ? null : v / 3.6);
  const currentMs = slice(marine.hourly?.ocean_current_velocity).map(kmhToMs);
  const pressureAtm = ((weather.hourly?.surface_pressure as (number | null)[]) ?? [])
    .slice(0, wCut)
    .map((p) => (p === null ? null : p / 1013.25 + DEPTH_ATM));

  const mTimeCut = mTime.slice(0, mCut);
  return {
    // 표층 수온 — 수심 보정은 통합 단계에서 적용 (월 정보가 필요해 pairs로 반환)
    seaTempPairs: dailyMeanPairs(mTimeCut, slice(marine.hourly?.sea_surface_temperature)),
    seaTempLatest: lastValid(slice(marine.hourly?.sea_surface_temperature)),
    oceanCurrent: { series: dailyMeans(mTimeCut, currentMs), latest: lastValid(currentMs) },
    waveHeight: {
      series: dailyMeans(mTimeCut, slice(marine.hourly?.wave_height)),
      latest: lastValid(slice(marine.hourly?.wave_height)),
    },
    wavePeriod: {
      series: dailyMeans(mTimeCut, slice(marine.hourly?.wave_period)),
      latest: lastValid(slice(marine.hourly?.wave_period)),
    },
    pressure: { series: dailyMeans(wTime.slice(0, wCut), pressureAtm), latest: lastValid(pressureAtm) },
  };
}

/* ── KHOA ── */

function parseXmlNumber(xml: string, tag: string): number | null {
  const m = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  if (!m || m[1].trim() === "") return null;
  const n = parseFloat(m[1]);
  return Number.isNaN(n) ? null : n;
}

interface KhoaRow {
  /** 관측일시 YYYY-MM-DD HH:mm */
  dt: string;
  value: number | null;
}

async function fetchKhoaXml(url: string, obsCode: string, reqDate: string | null, min: number, rows: number): Promise<string | null> {
  const apiKey = process.env.KHOA_API_KEY;
  if (!apiKey) return null;
  const params = new URLSearchParams({
    serviceKey: apiKey,
    obsCode,
    min: String(min),
    numOfRows: String(rows),
  });
  if (reqDate) params.set("reqDate", reqDate);
  const res = await fetch(`${url}?${params}`);
  if (!res.ok) return null;
  const xml = await res.text();
  const code = xml.match(/<resultCode>(\d+)<\/resultCode>/);
  if (code && code[1] !== "00") return null;
  return xml;
}

function parseKhoaRows(xml: string, tag: string): KhoaRow[] {
  const out: KhoaRow[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    out.push({
      dt: m[1].match(/<obsrvnDt>([^<]*)<\/obsrvnDt>/)?.[1] ?? "",
      value: parseXmlNumber(m[1], tag),
    });
  }
  return out;
}

/** survey 이력 서비스에서 최근 30일 시계열 (일자별 reqDate 조회, 4시간 간격 샘플) */
async function fetchKhoaSurvey30d(url: string, obsCode: string, tag: string): Promise<KhoaRow[]> {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    days.push(new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10).replace(/-/g, ""));
  }
  const rows: KhoaRow[] = [];
  const BATCH = 10;
  for (let i = 0; i < days.length; i += BATCH) {
    const results = await Promise.all(
      days.slice(i, i + BATCH).map((d) =>
        fetchKhoaXml(url, obsCode, d, 240, 8)
          .then((xml) => (xml ? parseKhoaRows(xml, tag) : []))
          .catch(() => [] as KhoaRow[]),
      ),
    );
    results.forEach((r) => rows.push(...r));
  }
  return rows;
}

/** recent 서비스의 당일 시간별 관측 (응답은 최신순 → 오름차순으로 뒤집음) */
async function fetchKhoaToday(url: string, obsCode: string, tag: string): Promise<KhoaRow[]> {
  const xml = await fetchKhoaXml(url, obsCode, null, 60, 300);
  return xml ? parseKhoaRows(xml, tag).reverse() : [];
}

function rowsToSeries(rows: KhoaRow[], daily: boolean): ObsSeries | null {
  const values = rows.map((r) => r.value);
  const series = daily
    ? dailyMeans(rows.map((r) => r.dt.slice(0, 10)), values)
    : (values.filter((v) => v !== null) as number[]);
  return toSeries(series, lastValid(values));
}

/* ── 통합 ── */

async function loadOceanObservations(): Promise<OceanObservations> {
  const dtCode = process.env.KHOA_OBS_CODE || "DT_0027";
  const [om, tempRows, tideRows, salinityRows, crspRows, dtTodayTemp, dtTodayTide] = await Promise.all([
    fetchOpenMeteo().catch(() => null),
    fetchKhoaSurvey30d(KHOA_SURVEY_TEMP_URL, dtCode, "wtem").catch(() => [] as KhoaRow[]),
    fetchKhoaSurvey30d(KHOA_SURVEY_TIDE_URL, dtCode, "bscTdlvHgt").catch(() => [] as KhoaRow[]),
    fetchKhoaToday(KHOA_DT_URL, dtCode, "slntQty").catch(() => [] as KhoaRow[]),
    fetchKhoaToday(KHOA_TW_URL, "TW_0078", "crsp").catch(() => [] as KhoaRow[]),
    fetchKhoaToday(KHOA_DT_URL, dtCode, "wtem").catch(() => [] as KhoaRow[]),
    fetchKhoaToday(KHOA_DT_URL, dtCode, "bscTdlvHgt").catch(() => [] as KhoaRow[]),
  ]);

  // 수온: 표층 실측(KHOA 이력, 폴백 Open-Meteo)을 data-log와 동일하게 수심 보정해 표기
  // 보정 수심 40m — data-log의 estimateBottomTemperature(surfaceTemp, 40, month)와 동일 값이 나오도록 고정
  const TEMP_CORRECTION_DEPTH = 40;
  const nowMonth = new Date().getMonth() + 1;
  const seaTemp = (() => {
    const khoaPairs = dailyMeanPairs(tempRows.map((r) => r.dt.slice(0, 10)), tempRows.map((r) => r.value));
    const pairs = khoaPairs.length >= 2 ? khoaPairs : om?.seaTempPairs ?? [];
    if (pairs.length < 2) return null;
    const surfaceLatest =
      lastValid(dtTodayTemp.map((r) => r.value)) ?? om?.seaTempLatest ?? pairs[pairs.length - 1][1];
    return {
      series: pairs.map(([d, v]) => estimateBottomTemperature(v, TEMP_CORRECTION_DEPTH, monthOf(d))),
      latest: estimateBottomTemperature(surfaceLatest, TEMP_CORRECTION_DEPTH, nowMonth),
    };
  })();

  const tideLevel = (() => {
    const s = rowsToSeries(tideRows, true);
    const latest = lastValid(dtTodayTide.map((r) => r.value)) ?? s?.latest ?? null;
    return s && latest !== null ? { series: s.series, latest } : s;
  })();

  // 염분·조류 유속: 이력 서비스가 없어 당일 시간별 실측 시계열 사용
  const salinity = rowsToSeries(salinityRows, false);
  // 부이 유속: 값이 10 이상이면 cm/s로 보고 m/s로 환산
  const normCrsp = (v: number) => (v > 10 ? v / 100 : v);
  const tidalCurrent = (() => {
    const s = rowsToSeries(crspRows, false);
    return s ? { series: s.series.map(normCrsp), latest: normCrsp(s.latest) } : null;
  })();

  return {
    seaTemp,
    salinity,
    tideLevel,
    tidalCurrent,
    pressure: om ? toSeries(om.pressure.series, om.pressure.latest) : null,
    waveHeight: om ? toSeries(om.waveHeight.series, om.waveHeight.latest) : null,
    wavePeriod: om ? toSeries(om.wavePeriod.series, om.wavePeriod.latest) : null,
    oceanCurrent: om ? toSeries(om.oceanCurrent.series, om.oceanCurrent.latest) : null,
    updatedAt: new Date().toISOString(),
  };
}

export const getOceanObservations = unstable_cache(loadOceanObservations, ["method-ocean-observations-v4"], {
  revalidate: 3600,
});
