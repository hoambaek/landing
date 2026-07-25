import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * /b 병 기록 조회 — service_role 서버 전용.
 * 공개 응답에 고객명·가격·메모는 절대 포함하지 않는다 (필드 필터링).
 * UAPS 계수·예측값은 조회 자체를 하지 않는다 (게이팅).
 */

export interface BottleIdentity {
  productId: string;
  serial: number | null; // 병 번호 (없으면 미표기)
  nfcCode: string;
}

export interface AgingWindow {
  immersion: string | null; // YYYY-MM-DD
  retrieval: string | null;
  depth: number; // m
  retrieved: boolean; // 인양 완료 여부 (오늘 기준)
}

export interface OceanAverages {
  temp: number | null; // °C
  salinity: number | null; // psu
  tide: number | null; // cm
  current: number | null; // m/s
  pressure: number; // atm (수심 유도값)
  tidal: number | null; // cm/s
  wave: number | null; // m
  period: number | null; // s
}

export interface BottleRecordData {
  bottle: BottleIdentity;
  aging: AgingWindow;
  averages: OceanAverages;
  monthlyTemps: (number | null)[]; // index 0 = 1월, 관측 없으면 null
  currentMonthIndex: number; // 발광 포인트가 설 달 (0-based)
  partial: boolean; // 인양 전(기록 진행 중)
}

interface OceanRow {
  date: string;
  sea_temperature_avg: number | null;
  salinity: number | null;
  tide_level_avg: number | null;
  current_velocity_avg: number | null;
  tidal_current_speed: number | null;
  wave_height_avg: number | null;
  wave_period_avg: number | null;
}

/**
 * 표층 수온 → 40m 보정 (plan 앱 uaps-ocean-profile과 동일 모델).
 * 대외 표기 정본: 수온 표시는 40m 보정값 유지 (케이지 수심 30m와 별개).
 * 완도 해역 KODC/NIFS 관측 기반 월별 혼합비 + 심층 기저 수온 8.0°C.
 */
const MONTHLY_DEPTH_RATIO_40M: Record<number, number> = {
  1: 0.92, 2: 0.92, 3: 0.88, 4: 0.8, 5: 0.7, 6: 0.58,
  7: 0.5, 8: 0.5, 9: 0.5, 10: 0.55, 11: 0.72, 12: 0.85,
};
const DEEP_BASE_TEMP = 8.0;

function bottomTemp40(sst: number | null, month: number): number | null {
  if (sst === null || !Number.isFinite(sst)) return null;
  const ratio = MONTHLY_DEPTH_RATIO_40M[month] ?? 0.75;
  return Math.max(sst * ratio + DEEP_BASE_TEMP * (1 - ratio), 3.0);
}

function mean(values: (number | null)[]): number | null {
  const nums = values.filter((v): v is number => v !== null && Number.isFinite(v));
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** 최고값 — 조위·파고는 시안 라벨("최고")에 맞춰 일평균 중 최댓값으로 집계한다. */
function max(values: (number | null)[]): number | null {
  const nums = values.filter((v): v is number => v !== null && Number.isFinite(v));
  if (nums.length === 0) return null;
  return Math.max(...nums);
}

/**
 * 병 식별만 조회 (경량) — 입장 페이지용. 해양 집계 없이 N°·제품만 필요.
 * numbered_bottles 우선, bottle_units 차선. 민감 컬럼은 select하지 않는다.
 */
export async function fetchBottleIdentity(code: string): Promise<BottleIdentity | null> {
  if (!supabaseAdmin) return null;
  if (!/^[A-Za-z0-9]{4,12}$/.test(code)) return null;

  const { data: nb } = await supabaseAdmin
    .from("numbered_bottles")
    .select("product_id, bottle_number, nfc_code")
    .eq("nfc_code", code)
    .maybeSingle();

  if (nb) {
    return { productId: nb.product_id ?? "first_edition", serial: nb.bottle_number ?? null, nfcCode: nb.nfc_code };
  }

  const { data: bu } = await supabaseAdmin
    .from("bottle_units")
    .select("product_id, serial_number, nfc_code")
    .eq("nfc_code", code)
    .maybeSingle();
  if (bu) {
    return { productId: bu.product_id, serial: bu.serial_number ?? null, nfcCode: bu.nfc_code };
  }

  return null;
}

/* ── 소유자 조회 (인증서·소유 관리용) ──────────────────────────
 * /b/[code]는 NFC 태그로 열리는 공개 URL이다. 병은 선물·접대 자리에 놓이므로
 * "태그할 수 있는 사람 = 소유자"가 아니다. 그래서 노출 범위를 둘로 나눈다.
 *
 *  - 이름  : 등록자가 "인증서에 남길 이름"으로 직접 정한 값이라 그대로 공개한다.
 *            무엇을 보일지는 시스템이 아니라 본인이 등록 시점에 선택한다.
 *  - 이메일: 인증서에 있을 이유가 없고 연락처 식별자라 항상 마스킹한다.
 *            원본은 소유자 인증(OTP) 통과 시 fetchBottleOwnerRaw로만 꺼낸다.
 *
 * 필드명이 곧 노출 범위다. emailMasked를 그대로 두면 실수로 원본이 새기 어렵다.
 */
export interface BottleOwner {
  name: string;
  emailMasked: string;
  registeredAt: string | null; // YYYY-MM-DD
}

/* maskName은 제거했다. 이름은 등록자가 인증서용으로 정한 공개값이라 가리지 않는다.
   되살릴 일이 생기면 노출 정책부터 다시 정할 것. */

export function maskEmail(email: string): string {
  const e = email.trim();
  const at = e.indexOf("@");
  if (at < 1) return "•••";
  const local = e.slice(0, at);
  const domain = e.slice(at + 1);
  const head = local.slice(0, Math.min(2, local.length));
  return `${head}•••@${domain}`;
}

/** 이미 소유 등록된 병인지 여부 — 입장 페이지 재등록 차단용(경량). */
export async function isBottleRegistered(code: string): Promise<boolean> {
  if (!supabaseAdmin) return false;
  if (!/^[A-Za-z0-9]{4,12}$/.test(code)) return false;
  const { data } = await supabaseAdmin
    .from("bottle_registrations")
    .select("id")
    .eq("nfc_code", code)
    .limit(1)
    .maybeSingle();
  return !!data;
}

export async function fetchBottleOwner(code: string): Promise<BottleOwner | null> {
  if (!supabaseAdmin) return null;
  if (!/^[A-Za-z0-9]{4,12}$/.test(code)) return null;

  const { data } = await supabaseAdmin
    .from("bottle_registrations")
    .select("name, email, created_at")
    .eq("nfc_code", code)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data || !data.name) return null;
  return {
    name: data.name,
    emailMasked: data.email ? maskEmail(data.email) : "",
    registeredAt: data.created_at ? String(data.created_at).slice(0, 10) : null,
  };
}

/** 원본 소유자 정보 — 소유자 인증 완료 시에만 호출한다(마스킹 없음). */
export interface BottleOwnerRaw {
  name: string;
  email: string;
  registeredAt: string | null;
}

export async function fetchBottleOwnerRaw(code: string): Promise<BottleOwnerRaw | null> {
  if (!supabaseAdmin) return null;
  if (!/^[A-Za-z0-9]{4,12}$/.test(code)) return null;
  const { data } = await supabaseAdmin
    .from("bottle_registrations")
    .select("name, email, created_at")
    .eq("nfc_code", code)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data || !data.name) return null;
  return {
    name: data.name,
    email: data.email ?? "",
    registeredAt: data.created_at ? String(data.created_at).slice(0, 10) : null,
  };
}

export async function fetchBottleRecord(code: string): Promise<BottleRecordData | null> {
  if (!supabaseAdmin) return null;
  if (!/^[A-Za-z0-9]{4,12}$/.test(code)) return null;

  // 1) 병 식별 — 경량 조회 재사용.
  const bottle = await fetchBottleIdentity(code);
  if (!bottle) return null;

  // 2) 숙성 창 — inventory_batches
  const { data: batch } = await supabaseAdmin
    .from("inventory_batches")
    .select("immersion_date, retrieval_date, aging_depth")
    .eq("product_id", bottle.productId)
    .maybeSingle();

  const today = new Date().toISOString().slice(0, 10);
  const immersion: string | null = batch?.immersion_date ?? null;
  const retrieval: string | null = batch?.retrieval_date ?? null;
  const depth: number = batch?.aging_depth ?? 30;
  // 배치 미등록 병은 NFC 발급(판매·증정) 시점상 이미 인양된 병으로 본다
  const retrieved = immersion ? Boolean(retrieval && retrieval <= today) : true;

  // 3) 해양 관측 — 입수~인양(또는 오늘) 창. 창이 없으면 관측소 전체 실측(기록의 존재를 보여주는 대표값).
  const from = immersion ?? undefined;
  const to = immersion ? (retrieved && retrieval ? retrieval : today) : undefined;

  let query = supabaseAdmin
    .from("ocean_data_daily")
    .select(
      "date, sea_temperature_avg, salinity, tide_level_avg, current_velocity_avg, tidal_current_speed, wave_height_avg, wave_period_avg"
    )
    .order("date", { ascending: true })
    .limit(800);
  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);

  const { data: oceanRows } = await query;
  const rows: OceanRow[] = (oceanRows ?? []) as OceanRow[];

  // 4) 집계 — 8지표 평균 + 월별 수온
  const averages: OceanAverages = {
    temp: round1(mean(rows.map((r) => bottomTemp40(r.sea_temperature_avg, Number(r.date.slice(5, 7)))))),
    salinity: round1(mean(rows.map((r) => r.salinity))),
    tide: round0(max(rows.map((r) => r.tide_level_avg))),
    // ocean_data_daily.current_velocity_avg는 Open-Meteo 기본 단위(km/h)로 수집됨 → m/s 변환
    current: round2(divOrNull(mean(rows.map((r) => r.current_velocity_avg)), 3.6)),
    pressure: round1(1 + depth / 10.33) ?? 3.9,
    tidal: round0(mean(rows.map((r) => r.tidal_current_speed))),
    wave: round1(max(rows.map((r) => r.wave_height_avg))),
    period: round1(mean(rows.map((r) => r.wave_period_avg))),
  };

  const byMonth: (number | null)[][] = Array.from({ length: 12 }, () => []);
  for (const r of rows) {
    const m = Number(r.date.slice(5, 7)) - 1;
    if (m >= 0 && m < 12) byMonth[m].push(bottomTemp40(r.sea_temperature_avg, m + 1));
  }
  const monthlyTemps = byMonth.map((vals) => round1(mean(vals)));

  const currentMonthIndex = immersion
    ? Math.min(11, Math.max(0, Number((retrieved && retrieval ? retrieval : today).slice(5, 7)) - 1))
    : new Date().getMonth();

  return {
    bottle,
    aging: { immersion, retrieval, depth, retrieved },
    averages,
    monthlyTemps,
    currentMonthIndex,
    partial: Boolean(immersion) && !retrieved,
  };
}

function divOrNull(v: number | null, by: number): number | null {
  return v === null ? null : v / by;
}
function round0(v: number | null): number | null {
  return v === null ? null : Math.round(v);
}
function round1(v: number | null): number | null {
  return v === null ? null : Math.round(v * 10) / 10;
}
function round2(v: number | null): number | null {
  return v === null ? null : Math.round(v * 100) / 100;
}
