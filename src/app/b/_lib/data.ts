import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatOwnerLatin } from "./owner-name";

/**
 * /b 병 기록 조회 — service_role 서버 전용.
 * 공개 응답에 고객명·가격·메모는 절대 포함하지 않는다 (필드 필터링).
 * UAPS 계수·예측값은 조회 자체를 하지 않는다 (게이팅).
 *
 * 2026-07-27 — 여기의 질의 한 번은 왕복 한 번이고, /b는 전부 force-dynamic이라
 * 매 요청이 실제로 DB를 친다. 그래서 두 가지를 지킨다.
 *
 *  1) 실행 지역. Supabase는 ap-northeast-2(서울)에 있는데 Vercel 기본 함수 지역은
 *     iad1(버지니아)이라, 질의 하나당 태평양을 두 번 건너 ~200ms씩 붙었다
 *     (입장 페이지 TTFB 실측 2.1초). vercel.json의 regions: ["icn1"]이 이걸 맞춘다.
 *     주석을 못 다는 파일이라 근거를 여기 남긴다 — 지우면 다시 2초가 된다.
 *  2) 호출부는 Promise.all로 묶는다. 순차 await는 왕복을 그대로 더한다.
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

/**
 * 숙성 창만 조회 (경량) — 제품 식별 캡션(입수 연차 · 숙성 기간)에 필요한 최소치.
 * 입장 페이지는 해양 집계를 쓰지 않으므로 fetchBottleRecord를 부르지 않는다.
 * 배치가 없는 병은 기본 수심으로 되돌린다(record와 같은 규칙).
 */
export async function fetchAgingBatch(
  productId: string
): Promise<{ immersion: string | null; retrieval: string | null; depth: number }> {
  const fallback = { immersion: null, retrieval: null, depth: 30 };
  if (!supabaseAdmin) return fallback;
  const { data } = await supabaseAdmin
    .from("inventory_batches")
    .select("immersion_date, retrieval_date, aging_depth")
    .eq("product_id", productId)
    .maybeSingle();
  if (!data) return fallback;
  return {
    immersion: data.immersion_date ?? null,
    retrieval: data.retrieval_date ?? null,
    depth: data.aging_depth ?? 30,
  };
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
  /* 인증서에 새길 로마자 표기 — "이름 성" 순서로 합쳐 둔다(서양 증서 어법).
     등록자가 직접 입력한 값만 담기며, 없으면 null이라 인증서는 자국어 이름만 세운다. */
  nameLatin: string | null;
  emailMasked: string;
  /** 발행일 YYYY-MM-DD — KST 달력 날짜로 확정된 값이다(issuedDate 참조) */
  registeredAt: string | null;
}

/* maskName은 제거했다. 이름은 등록자가 인증서용으로 정한 공개값이라 가리지 않는다.
   되살릴 일이 생기면 노출 정책부터 다시 정할 것. */

/**
 * 등록 시각(timestamptz) → 발행일(KST 달력 날짜).
 *
 * bottle_registrations.created_at은 timestamptz라 저장된 값이 UTC 순간이다.
 * 앞서 String(created_at).slice(0, 10)으로 잘랐는데 그건 UTC 달력 날짜라,
 * 한국 시간 아침 9시 이전에 등록한 병은 인증서에 하루 전 날짜가 찍혔다
 * (07-28 00:30 KST 등록 → 07-27T15:30Z 저장 → 「27일」).
 *
 * 인증서는 문서다. 발행일이 보는 사람·보는 곳에 따라 달라지면 안 된다.
 * 그래서 뷰어의 로컬 시간대가 아니라 발행 주체의 시간대(KST)로 고정한다 —
 * 소유자가 파리에서 열어도 서울에서 열어도 같은 날짜가 나온다.
 * 인증서 ID(MDM-{입수연도}-…)의 입수 연도가 date 컬럼(시간대 없음)에서 오므로
 * 두 값이 어긋날 여지도 없다.
 *
 * ⚠️ 실행 환경의 로컬 시간대에 기대지 않는다. Date.parse는 오프셋이 붙은 문자열을
 *    절대 시각으로 읽고 toISOString은 항상 UTC로 쓴다 — 둘 다 TZ 무관이다.
 *    KST는 서머타임이 없어 고정 +9h 이동이면 정확하다.
 *    (toLocaleDateString("ko-KR", { timeZone })은 런타임의 ICU 유무에 걸린다.)
 * ⚠️ 서버에서 이 문자열로 확정해 클라이언트로 넘긴다. 클라이언트는 표기만 조립하므로
 *    SSR·하이드레이션이 같은 값을 낸다.
 */
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function issuedDate(ts: string | null | undefined): string | null {
  if (!ts) return null;
  const t = Date.parse(ts);
  if (!Number.isFinite(t)) return null;
  return new Date(t + KST_OFFSET_MS).toISOString().slice(0, 10);
}

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
    .select("name, given_name_latin, family_name_latin, email, created_at")
    .eq("nfc_code", code)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data || !data.name) return null;
  return {
    name: data.name,
    nameLatin: formatOwnerLatin(data.given_name_latin, data.family_name_latin),
    emailMasked: data.email ? maskEmail(data.email) : "",
    registeredAt: issuedDate(data.created_at),
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
    registeredAt: issuedDate(data.created_at),
  };
}

export async function fetchBottleRecord(code: string): Promise<BottleRecordData | null> {
  if (!supabaseAdmin) return null;
  if (!/^[A-Za-z0-9]{4,12}$/.test(code)) return null;

  // 1) 병 식별 — 경량 조회 재사용.
  const bottle = await fetchBottleIdentity(code);
  if (!bottle) return null;

  // 2) 숙성 창 — inventory_batches
  const { immersion, retrieval, depth } = await fetchAgingBatch(bottle.productId);

  const today = new Date().toISOString().slice(0, 10);
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

/* ── 같은 소유자의 병 목록 ─────────────────────────────────────
 * 인증 없이 부른다. 담는 값은 병 번호·제품·수심·기간뿐으로, 각 병의 인증서가
 * 이미 공개하는 범위와 같다. 이메일은 기준으로만 쓰고 결과에 담지 않는다.
 *
 * 기준은 이메일이다. 이름은 소유자가 나중에 고칠 수 있어(updateOwnerName)
 * 오타 하나를 바로잡는 순간 소장품이 둘로 갈린다. OTP가 증명하는 것도 이메일이다.
 * 대소문자는 무시한다 — 등록 시점에 정규화하지 않고 입력한 그대로 저장하기 때문이다.
 *
 * 소유권은 "nfc_code별 최신 등록 행"이 갖는다. 그래서 이메일로 뽑은 뒤
 * 코드마다 최신 행을 다시 확인해, 그 사이 다른 사람에게 넘어간 병은 뺀다.
 */
export interface OwnedBottle {
  code: string;
  productId: string;
  serial: number | null;
  depth: number;
  immersion: string | null;
  retrieval: string | null;
  registeredAt: string | null;
}

export async function fetchOwnedBottles(email: string): Promise<OwnedBottle[]> {
  if (!supabaseAdmin) return [];
  const target = (email ?? "").trim().toLowerCase();
  if (!target) return [];

  /* 이 이메일이 등장하는 모든 등록 행. 코드별 최신 행을 가리기 위해 created_at까지 받는다.
     ilike의 %·_는 와일드카드라 그대로 넘기면 남의 주소까지 걸린다 — 이스케이프한다. */
  const pattern = target.replace(/([\\%_])/g, "\\$1");
  const { data: mine } = await supabaseAdmin
    .from("bottle_registrations")
    .select("nfc_code, created_at")
    .ilike("email", pattern);
  if (!mine?.length) return [];

  const codes = [...new Set(mine.map((r) => r.nfc_code).filter((c): c is string => !!c))];
  if (!codes.length) return [];

  /* 코드별 최신 소유자 확인 — 최신 행의 주인이 내가 아니면 뺀다 */
  const { data: allRows } = await supabaseAdmin
    .from("bottle_registrations")
    .select("nfc_code, email, created_at")
    .in("nfc_code", codes);

  const latest = new Map<string, { email: string; createdAt: string | null }>();
  for (const r of allRows ?? []) {
    if (!r.nfc_code) continue;
    const prev = latest.get(r.nfc_code);
    const at = r.created_at ? String(r.created_at) : null;
    if (!prev || (at ?? "") > (prev.createdAt ?? "")) {
      latest.set(r.nfc_code, { email: (r.email ?? "").toLowerCase(), createdAt: at });
    }
  }
  const owned = codes.filter((c) => latest.get(c)?.email === target);
  if (!owned.length) return [];

  /* 병 식별 — 두 테이블에 나뉘어 있다(번호 병 / 배치 병). 한 번씩만 훑는다. */
  const [{ data: nbs }, { data: bus }] = await Promise.all([
    supabaseAdmin.from("numbered_bottles").select("nfc_code, product_id, bottle_number").in("nfc_code", owned),
    supabaseAdmin.from("bottle_units").select("nfc_code, product_id, serial_number").in("nfc_code", owned),
  ]);

  const identity = new Map<string, { productId: string; serial: number | null }>();
  for (const r of nbs ?? []) {
    if (r.nfc_code) identity.set(r.nfc_code, { productId: r.product_id ?? "first_edition", serial: r.bottle_number ?? null });
  }
  for (const r of bus ?? []) {
    if (r.nfc_code && !identity.has(r.nfc_code)) {
      identity.set(r.nfc_code, { productId: r.product_id, serial: r.serial_number ?? null });
    }
  }

  /* 재고에서 기록이 초기화된 옛 코드는 등록 행만 남아 있다. 그 카드를 그리면
     열리지 않는 페이지로 보내게 되므로 여기서 떨군다. */
  const live = owned.filter((c) => identity.has(c));
  if (!live.length) return [];

  const productIds = [...new Set(live.map((c) => identity.get(c)!.productId))];
  const { data: batches } = await supabaseAdmin
    .from("inventory_batches")
    .select("product_id, immersion_date, retrieval_date, aging_depth")
    .in("product_id", productIds);
  const batchOf = new Map((batches ?? []).map((b) => [b.product_id, b]));

  return live
    .map((code) => {
      const id = identity.get(code)!;
      const b = batchOf.get(id.productId);
      return {
        code,
        productId: id.productId,
        serial: id.serial,
        depth: b?.aging_depth ?? 30,
        immersion: b?.immersion_date ?? null,
        retrieval: b?.retrieval_date ?? null,
        registeredAt: issuedDate(latest.get(code)?.createdAt),
      };
    })
    /* 번호 순으로 세운다 — 소장품은 등록한 날짜가 아니라 병 번호로 기억된다 */
    .sort((a, b) => (a.productId === b.productId ? (a.serial ?? 0) - (b.serial ?? 0) : a.productId.localeCompare(b.productId)));
}
