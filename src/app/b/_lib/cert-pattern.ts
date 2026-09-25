/**
 * 인증서 문양 — 번호 양옆 물결 띠(guilloché)와 인장(seal)을 그 병의 주간 수온으로 그린다.
 *
 * 병마다 입수~인양 창이 달라 수온 곡선이 다르고, 그래서 문양이 다르다.
 * 여덟 줄기(S3)와 같은 원리다 — 장식이 아니라 그 병이 지나온 바다의 모양이다.
 *
 * 수식은 시안 제작에 쓴 파이썬 생성기를 그대로 옮겼다(2026-09-25, Paper 04).
 *   띠   = gen.py  band(290, 34) — 8줄 · 선 #A8834A 0.45 · 불투명도 .55
 *   인장 = seal6.py — 흘러가는 등고선 17겹(바깥 원 없음) + 녹은 금박 형태의 중심
 * 좌표 자릿수(소수 둘째 자리)도 원본과 같다. 식을 고치면 시안과 문양이 갈린다.
 *
 * 순수 함수만 둔다 — 서버(폴백 계열 생성)와 클라이언트(경로 계산)가 함께 쓴다.
 */

/** 0~1 정규화. 값이 전부 같으면(진폭 0) 가운데(0.5)로 둔다 — 0으로 나누지 않는다. */
function normalize(temps: number[]): number[] {
  const lo = Math.min(...temps);
  const hi = Math.max(...temps);
  if (!(hi - lo > 1e-6)) return temps.map(() => 0.5);
  return temps.map((t) => (t - lo) / (hi - lo));
}

/** gen.py samp — 계열을 u∈[0,1]로 훑으며 코사인 보간한다. */
function sampler(temps: number[]): (u: number) => number {
  const n = normalize(temps);
  const last = n.length - 1;
  return (u: number) => {
    const x = u * last;
    const i = Math.floor(x);
    const f = x - i;
    const j = Math.min(i + 1, last);
    const a = n[Math.min(i, last)];
    const b = n[j];
    const e = (1 - Math.cos(f * Math.PI)) / 2;
    return a + (b - a) * e;
  };
}

/**
 * 관측이 없는 병의 대체 계열 — 코드로 시드를 잡아 결정적으로 만든다.
 * 같은 병은 언제 열어도 같은 문양이어야 한다(인증서는 문서다). 모양은 남해의
 * 한 해 수온처럼 겨울 저점·여름 고점을 갖는 52주 곡선에 작은 흔들림을 얹는다.
 * 이 값은 문양에만 쓰고 수치로 표기하지 않는다.
 */
export function fallbackTemps(seed: string): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let s = h >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const phase = rand() * 0.6;
  return Array.from({ length: 52 }, (_, k) => {
    const season = Math.sin(((k / 52) - 0.3 + phase * 0.1) * 2 * Math.PI);
    return Math.round((16 + 9 * season + (rand() - 0.5) * 2.4) * 100) / 100;
  });
}

/** 문양에 쓸 계열 — 점이 둘 미만이면 곡선이 안 되므로 대체 계열로 간다. */
export function patternTemps(temps: number[], seed: string): number[] {
  return temps.length >= 2 ? temps : fallbackTemps(seed);
}

const f1 = (v: number) => v.toFixed(1);
const f2 = (v: number) => v.toFixed(2);

/* ── 물결 띠 (gen.py band) ─────────────────────────── */
export const BAND_W = 290;
export const BAND_H = 34;
const BAND_LINES = 8;
const BAND_CYCLES = 3.0;

export function bandPaths(temps: number[], w = BAND_W, h = BAND_H): string[] {
  const samp = sampler(temps);
  const out: string[] = [];
  for (let k = 0; k < BAND_LINES; k++) {
    const ph = (k / BAND_LINES) * 2 * Math.PI;
    const pts: string[] = [];
    for (let s = 0; s <= 240; s++) {
      const u = s / 240;
      const x = u * w;
      const d = samp(u);
      const y =
        h / 2 +
        h * 0.3 * Math.sin(u * BAND_CYCLES * 2 * Math.PI + ph) * (0.55 + 0.45 * d) +
        h * 0.12 * (d - 0.5) * Math.cos(ph);
      pts.push(`${f1(x)},${f2(y)}`);
    }
    out.push(`M${pts.join(" L")}`);
  }
  return out;
}

/* ── 인장 (seal6.py) ─────────────────────────────── */
export const SEAL_SIZE = 96; // 2 * (R + 2), R = 46
const SEAL_C = SEAL_SIZE / 2;
const RINGS = 17;

export interface SealRing {
  d: string;
  width: number;
  opacity: number;
}

/** 등고선 17겹 — 조류처럼 한 방향(오른쪽 아래)으로 흘러가는 중심 */
export function sealRings(temps: number[]): SealRing[] {
  const samp = sampler(temps);
  const c = SEAL_C;
  const rings: SealRing[] = [];
  for (let k = 0; k < RINGS; k++) {
    const t = k / (RINGS - 1);
    const base = 24.5 + t * 17.5;
    const cx = c + Math.pow(t, 1.4) * 3.2;
    const cy = c + Math.pow(t, 1.4) * 1.6;
    const ph = t * 2.2;
    const pts: string[] = [];
    for (let s = 0; s <= 360; s++) {
      const th = (s / 360) * 2 * Math.PI;
      const u = (s / 360 + t * 0.18) % 1.0;
      const d = samp(u) - 0.5;
      const wob =
        2.6 * d * (0.4 + t) +
        0.9 * Math.sin(3 * th + ph) * (0.3 + t) +
        0.5 * Math.sin(7 * th - ph * 1.7) * t;
      const r = base + wob;
      pts.push(`${f2(cx + r * Math.cos(th))},${f2(cy + r * Math.sin(th))}`);
    }
    rings.push({
      d: `M${pts.join(" L")}Z`,
      width: k % 4 ? 0.35 : 0.6,
      opacity: Math.round((0.35 + 0.45 * (1 - Math.abs(t - 0.55))) * 100) / 100,
    });
  }
  return rings;
}

/** seal6.py blobpath — 수온으로 일그러진 녹은 금박 형태 */
function blobPath(
  samp: (u: number) => number,
  r0: number,
  amp: number,
  seed: number,
  cx: number,
  cy: number,
): string {
  const pts: string[] = [];
  for (let s = 0; s <= 240; s++) {
    const th = (s / 240) * 2 * Math.PI;
    const d = samp((s / 240 + seed) % 1.0) - 0.5;
    const r =
      r0 +
      amp *
        (0.9 * d +
          0.55 * Math.sin(2 * th + seed * 9) +
          0.35 * Math.sin(5 * th + seed * 4) +
          0.18 * Math.sin(9 * th + seed * 13));
    pts.push(`${f2(cx + r * Math.cos(th))},${f2(cy + r * Math.sin(th))}`);
  }
  return `M${pts.join(" L")}Z`;
}

export interface SealBlob {
  shadow: string; // 그림자 — #5E4520 · .28
  body: string; // 금박 — foil2 채움 위에 sheen을 한 번 더
  rimLight: string; // 밝은 테 — #F6E8C6 · .45 · .55
  rimDark: string; // 어두운 테 — #6E5226 · .35 · .4
}

export function sealBlob(temps: number[]): SealBlob {
  const samp = sampler(temps);
  const c = SEAL_C;
  return {
    shadow: blobPath(samp, 21.2, 1.6, 0.31, c + 0.3, c + 1.1),
    body: blobPath(samp, 20.6, 1.6, 0.31, c, c),
    rimLight: blobPath(samp, 17.6, 1.3, 0.47, c - 0.2, c + 0.1),
    rimDark: blobPath(samp, 17.0, 1.2, 0.62, c + 0.2, c + 0.3),
  };
}
