import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import LetterHeader from "@/components/forms/LetterHeader";
import Footer from "@/components/layout/Footer";
import { localePrefixMap, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getOceanObservations, type OceanObservations } from "@/lib/ocean-observations";
import { METHOD_COPY, type MethodCopy } from "./copy";
import ObsGrid from "./ObsGrid";
import s from "./method.module.css";

/* ────────────────────────────────────────────────────────────
   The Method (OCEAN CELLAR™ · 기록의 방법)
   ko 타이틀은 J1950 사전 렌더링 PNG(@3x, public/text/method/), en/fr은 텍스트.
   차트 데이터는 plan 앱 UAPS 엔진 실측 산출값(Atomes Crochus 배치).
   ──────────────────────────────────────────────────────────── */

const MARKER_LABELS = ["MEASURE", "PREDICT", "VERIFY", "LEARN"];

/** 히어로 서브카피에서 시스템명(OCEAN CELLAR™)을 강조 스팬으로 감싼다.
 *  ko는 "AI OCEAN CELLAR™", en/fr은 "OCEAN CELLAR™"가 대상. */
function highlightBrand(text: string, brandClass: string) {
  const phrase = text.includes("AI OCEAN CELLAR™") ? "AI OCEAN CELLAR™" : "OCEAN CELLAR™";
  const idx = text.indexOf(phrase);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className={brandClass}>{phrase}</span>
      {text.slice(idx + phrase.length)}
    </>
  );
}

function ChapterMarker({ step, tone }: { step: number; tone: "dark" | "light" }) {
  return (
    <div className={s.marker} data-tone={tone}>
      <div className={s.markerSegs}>
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={s.markerSeg} data-active={n === step} />
        ))}
      </div>
      <span className={s.markerLabel}>{MARKER_LABELS[step - 1]}</span>
    </div>
  );
}

/* ── CH.01 관측 스파크라인 ──
   실데이터는 getOceanObservations()(Open-Meteo + KHOA 완도)에서 오고,
   소스 장애 시 아래 폴백 스냅샷으로 렌더링한다. */
const OBS_FALLBACK: { value: string; d: string; endY: number }[] = [
  { value: "14.8°C", d: "M0,30 C30,22 60,18 90,20 C120,22 150,30 180,34 C210,36 240,28 270,24", endY: 24 },
  { value: "31.1 ‰", d: "M0,26 C45,24 90,28 135,25 C180,23 225,27 270,26", endY: 26 },
  { value: "182 cm", d: "M0,24 C22,10 45,38 67,14 C90,36 112,12 135,34 C157,12 180,36 202,14 C225,34 247,14 270,26", endY: 26 },
  { value: "0.4 m/s", d: "M0,28 C30,20 60,34 90,22 C120,32 150,20 180,30 C210,22 240,32 270,26", endY: 26 },
  { value: "3.97 atm", d: "M0,25 C45,24 90,26 135,25 C180,24 225,26 270,25", endY: 25 },
  { value: "0.6 m", d: "M0,30 C30,34 60,18 90,26 C120,38 150,20 180,28 C210,16 240,30 270,24", endY: 24 },
  { value: "3.7 s", d: "M0,26 C45,20 90,30 135,24 C180,18 225,28 270,22", endY: 22 },
  { value: "1.2 m/s", d: "M0,28 C40,24 80,30 120,26 C160,22 200,28 240,24 C252,23 262,24 270,25", endY: 25 },
];

/** 일 평균 시계열 → 270×48 스파크라인 패스 (y 6~42 정규화) */
function seriesToPath(series: number[]): { d: string; endY: number } {
  const min = Math.min(...series);
  const span = Math.max(...series) - min || 1;
  const pts = series.map((v, i) => [
    (i / (series.length - 1)) * 270,
    42 - ((v - min) / span) * 36,
  ]);
  return {
    d: "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L"),
    endY: pts[pts.length - 1][1],
  };
}

const OBS_DEFS: { key: keyof Omit<OceanObservations, "updatedAt">; fmt: (v: number) => string }[] = [
  { key: "seaTemp", fmt: (v) => `${v.toFixed(1)}°C` },
  { key: "salinity", fmt: (v) => `${v.toFixed(1)} ‰` },
  { key: "tideLevel", fmt: (v) => `${Math.round(v)} cm` },
  { key: "tidalCurrent", fmt: (v) => `${v.toFixed(v < 0.095 ? 2 : 1)} m/s` },
  { key: "pressure", fmt: (v) => `${v.toFixed(2)} atm` },
  { key: "waveHeight", fmt: (v) => `${v.toFixed(1)} m` },
  { key: "wavePeriod", fmt: (v) => `${v.toFixed(1)} s` },
  { key: "oceanCurrent", fmt: (v) => `${v.toFixed(1)} m/s` },
];

function buildObs(ocean: OceanObservations | null, names: readonly string[]) {
  return OBS_DEFS.map((def, i) => {
    const label = names[i];
    const data = ocean?.[def.key];
    if (!data) return { label, ...OBS_FALLBACK[i] };
    // 시계열이 너무 짧으면(자정 직후의 당일 시리즈 등) 곡선만 폴백하고 수치는 실측 유지
    if (data.series.length < 4) return { label, ...OBS_FALLBACK[i], value: def.fmt(data.latest) };
    const { d, endY } = seriesToPath(data.series);
    return { label, value: def.fmt(data.latest), d, endY };
  });
}

/* ── CH.02 숙성 타임라인 (데스크톱) ── */
const TL = {
  texture:
    "0,275 34,260 69,244 103,226 137,208 171,202 206,168 240,151 274,131 309,115 343,100 377,87 411,79 446,68 480,60 514,54 549,50 583,55 617,46 1200,46",
  bubble: "0,161 34,117 69,94 103,78 137,67 171,57 206,52 240,48 274,46 1200,46",
  aroma:
    "0,113 34,113 69,114 103,115 137,117 171,118 206,120 240,122 274,123 309,124 343,125 377,123 411,122 446,121 480,124 514,126 549,129 583,133 617,141 651,147 686,148 720,152 754,151 789,141 823,133 857,130 891,140 926,148 960,155 994,160 1029,170 1063,176 1097,176 1131,181 1166,178 1200,164",
  risk:
    "0,312 34,313 69,310 103,307 137,304 171,302 206,298 240,295 274,293 309,291 343,290 377,293 411,295 446,295 480,288 514,281 549,275 583,269 617,261 651,255 686,251 720,246 754,245 789,250 823,256 857,258 891,248 926,241 960,235 994,232 1029,225 1063,222 1097,222 1131,220 1166,222 1200,233",
  composite:
    "0,175 34,160 69,150 103,142 137,134 171,131 206,115 240,107 274,96 309,90 343,85 377,79 411,75 446,70 480,71 514,72 549,73 583,79 617,81 651,86 686,87 720,91 754,90 789,84 823,78 857,75 891,83 926,89 960,94 994,97 1029,103 1063,107 1097,107 1131,110 1166,108 1200,99",
};
const TL_TICKS: [number, string][] = [
  [0, "1"], [167, "6"], [370, "12"], [576, "18"], [782, "24"], [987, "30"],
];
const TL_YLABELS: [number, string][] = [
  [30, "100"], [93, "80"], [156, "60"], [219, "40"], [282, "20"], [345, "0"],
];

const MONO = "var(--font-mono), monospace";

/** 태그 라벨 폭 추정 — 한글 등 전각 11px, 라틴 6.7px (mono 11px 기준) */
function estTagWidth(text: string): number {
  let w = 0;
  for (const ch of text) w += /[ᄀ-퟿]/.test(ch) ? 11 : 6.7;
  return Math.ceil(w) + 20;
}

function TimelineChartDesktop({ t }: { t: MethodCopy["ch02"] }) {
  const tags: { cx: number; y: number; text: string; fill: string; stroke: string; color: string }[] = [
    { cx: 333, y: 6, text: t.svgTagPlan, fill: "rgba(44,110,117,0.13)", stroke: "#2C6E75", color: "#2C6E75" },
    { cx: 269, y: 60, text: t.svgTagRec, fill: "rgba(59,107,72,0.13)", stroke: "#3B6B48", color: "#3B6B48" },
    { cx: 539, y: 8, text: t.svgTagPeak, fill: "rgba(138,106,46,0.13)", stroke: "#8A6A2E", color: "#8A6A2E" },
  ];
  return (
    <svg viewBox="-52 0 1266 412" className={s.tlSvg} role="img" aria-label={t.tlAria}>
      {TL_YLABELS.map(([y]) => (
        <line key={y} x1="0" y1={y} x2="1200" y2={y} stroke={y === 345 ? "rgba(49,46,42,0.30)" : "rgba(49,46,42,0.06)"} strokeWidth="1" />
      ))}
      {/* 배경과 분리되게 채움을 진하게, 데이터 라인은 채도·명도 up (굵기·점선은 유지) */}
      <polygon points={`0,345 ${TL.composite} 1200,345`} fill="rgba(176,138,74,0.20)" />
      <polyline points={TL.texture} fill="none" stroke="rgba(49,46,42,0.68)" strokeWidth="1.2" />
      <polyline points={TL.bubble} fill="none" stroke="rgba(49,46,42,0.55)" strokeWidth="1.2" strokeDasharray="7 5" />
      <polyline points={TL.aroma} fill="none" stroke="rgba(150,54,42,0.85)" strokeWidth="1.2" />
      <polyline points={TL.risk} fill="none" stroke="rgba(150,54,42,0.62)" strokeWidth="1.2" strokeDasharray="3 3" />
      <polyline points={TL.composite} fill="none" stroke="#8A6A2E" strokeWidth="2.8" />
      {/* 계획 12개월 · 피크 기준선 */}
      <line x1="377" y1="34" x2="377" y2="345" stroke="rgba(44,110,117,0.62)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="446" y1="34" x2="446" y2="345" stroke="rgba(138,106,46,0.60)" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="377" cy="79" r="5" fill="#3B6B48" stroke="#ECEAE6" strokeWidth="1.5" />
      <circle cx="446" cy="70" r="5.5" fill="#8A6A2E" stroke="#ECEAE6" strokeWidth="2" />
      {/* 태그 */}
      <g fontFamily={MONO} fontSize="12" fontWeight="500" letterSpacing="0.04em">
        {tags.map((tag) => {
          const w = estTagWidth(tag.text);
          return (
            <g key={tag.text}>
              <rect x={tag.cx - w / 2} y={tag.y} width={w} height="26" fill={tag.fill} stroke={tag.stroke} />
              <text x={tag.cx} y={tag.y + 17} textAnchor="middle" fill={tag.color}>{tag.text}</text>
            </g>
          );
        })}
      </g>
      {/* 축 */}
      <g fontFamily={MONO} fontSize="10" fill="rgba(49,46,42,0.45)">
        {TL_YLABELS.map(([y, tk]) => (
          <text key={tk} x="-10" y={y + 3} textAnchor="end">{tk}</text>
        ))}
        {TL_TICKS.map(([x, tk]) => (
          <text key={tk} x={x} y="366">{tk}</text>
        ))}
        <text x="1152" y="366">{t.tlTick36}</text>
        <text x="600" y="392" textAnchor="middle" fontSize="11" fontWeight="500" letterSpacing="0.14em" fill="rgba(49,46,42,0.8)">{t.tlXAxis}</text>
        <text x="-40" y="187" textAnchor="middle" fontSize="11" fontWeight="500" letterSpacing="0.14em" fill="rgba(49,46,42,0.8)" transform="rotate(-90 -40 187)">{t.tlYAxis}</text>
      </g>
    </svg>
  );
}

/* ── CH.02 숙성 타임라인 (모바일 간이판) ── */
function TimelineChartMobile({ t }: { t: MethodCopy["ch02"] }) {
  return (
    <svg viewBox="0 0 342 224" className={s.tlSvgM} role="img" aria-label={t.tlAria}>
      <line x1="0" y1="27" x2="342" y2="27" stroke="rgba(49,46,42,0.06)" strokeWidth="1" />
      <line x1="0" y1="99" x2="342" y2="99" stroke="rgba(49,46,42,0.06)" strokeWidth="1" />
      <line x1="0" y1="172" x2="342" y2="172" stroke="rgba(49,46,42,0.25)" strokeWidth="1" />
      <polyline points="0,140 25,124 49,106 80,84 107,53 122,46 137,41 152,39 166,39 176,34 342,34" fill="none" stroke="rgba(49,46,42,0.4)" strokeWidth="1" />
      <polyline points="0,87 15,66 29,49 50,40 68,35 78,34 342,34" fill="none" stroke="rgba(49,46,42,0.45)" strokeWidth="1" strokeDasharray="5 4" />
      <polyline points="0,65 55,68 107,70 145,74 176,78 215,83 230,79 244,73 270,82 293,91 322,96 342,89" fill="none" stroke="rgba(160,82,72,0.45)" strokeWidth="1" />
      <polyline points="0,157 55,152 107,148 150,138 186,131 215,126 230,129 244,132 270,124 293,117 322,114 342,120" fill="none" stroke="rgba(160,82,72,0.35)" strokeWidth="1" strokeDasharray="5 4" />
      <path d="M 0 94 C 20 80, 35 76, 49 73 C 70 64, 90 55, 107 50 C 114 48, 120 46, 127 45 C 140 44, 155 47, 166 49 C 180 52, 195 54, 205 55 C 220 53, 235 49, 244 48 C 258 50, 272 55, 283 58 C 300 61, 320 62, 342 59 L 342 172 L 0 172 Z" fill="rgba(184,152,104,0.10)" />
      <path d="M 0 94 C 20 80, 35 76, 49 73 C 70 64, 90 55, 107 50 C 114 48, 120 46, 127 45 C 140 44, 155 47, 166 49 C 180 52, 195 54, 205 55 C 220 53, 235 49, 244 48 C 258 50, 272 55, 283 58 C 300 61, 320 62, 342 59" fill="none" stroke="#B89868" strokeWidth="2" />
      <line x1="107" y1="14" x2="107" y2="172" stroke="rgba(44,110,117,0.5)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="127" y1="14" x2="127" y2="172" stroke="rgba(184,152,104,0.5)" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx="107" cy="50" r="4" fill="#4a7c59" stroke="#ECEAE6" strokeWidth="1.2" />
      <circle cx="127" cy="45" r="4.5" fill="#B89868" stroke="#ECEAE6" strokeWidth="1.5" />
      <g fontFamily={MONO} fontSize="10" fill="rgba(49,46,42,0.45)">
        <text x="0" y="190">1</text>
        <text x="101" y="190">12</text>
        <text x="220" y="190">24</text>
        <text x="342" y="190" textAnchor="end">{t.tlTick36}</text>
        <text x="4" y="20" fontSize="9">{t.tlTop}</text>
        <text x="171" y="212" textAnchor="middle" letterSpacing="0.1em" fill="rgba(49,46,42,0.55)">{t.tlXAxis}</text>
      </g>
    </svg>
  );
}

/* ── CH.02 풍미 레이더 ── */
const RADAR_CHANGES: { before: number; after: number }[] = [
  { before: 78, after: 76 },
  { before: 89, after: 97 },
  { before: 74, after: 91 },
  { before: 92, after: 90 },
  { before: 81, after: 94 },
  { before: 86, after: 98 },
];

function RadarDesktop({ t }: { t: MethodCopy["ch02"] }) {
  const [a1, a2, a3, a4, a5, a6] = t.radarAxes;
  return (
    <svg viewBox="0 0 620 400" className={s.radarSvg} role="img" aria-label={t.radarAria}>
      <g fill="none" strokeWidth="1">
        <polygon points="310,172.5 342.5,191.25 342.5,228.75 310,247.5 277.5,228.75 277.5,191.25" stroke="rgba(49,46,42,0.08)" />
        <polygon points="310,135 374.9,172.5 374.9,247.5 310,285 245,247.5 245,172.5" stroke="rgba(49,46,42,0.08)" />
        <polygon points="310,97.5 407.4,153.75 407.4,266.25 310,322.5 212.6,266.25 212.6,153.75" stroke="rgba(49,46,42,0.08)" />
        <polygon points="310,60 439.9,135 439.9,285 310,360 180.1,285 180.1,135" stroke="rgba(49,46,42,0.22)" />
        {[[310, 60], [439.9, 135], [439.9, 285], [310, 360], [180.1, 285], [180.1, 135]].map(([x, y], i) => (
          <line key={i} x1="310" y1="210" x2={x} y2={y} stroke="rgba(49,46,42,0.08)" />
        ))}
      </g>
      <polygon points="310,93 425.6,143.3 406.1,265.5 310,348 204.8,270.8 198.3,145.5" fill="rgba(49,46,42,0.05)" stroke="rgba(49,46,42,0.68)" strokeWidth="1.2" strokeDasharray="4 4" />
      <polygon points="310,96 436,137.25 428.2,278.3 310,345 187.9,280.5 182.7,136.5" fill="rgba(176,138,74,0.20)" stroke="#8A6A2E" strokeWidth="2.2" />
      {[[310, 96], [436, 137.25], [428.2, 278.3], [310, 345], [187.9, 280.5], [182.7, 136.5]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#8A6A2E" />
      ))}
      <g fontFamily={MONO} fontSize="11" letterSpacing="0.06em" fill="rgba(49,46,42,0.6)">
        <text x="310" y="44" textAnchor="middle">{a1}</text>
        <text x="452" y="139">{a2}</text>
        <text x="452" y="291">{a3}</text>
        <text x="310" y="384" textAnchor="middle">{a4}</text>
        <text x="168" y="291" textAnchor="end">{a5}</text>
        <text x="168" y="139" textAnchor="end">{a6}</text>
      </g>
    </svg>
  );
}

function RadarMobile({ t }: { t: MethodCopy["ch02"] }) {
  const [a1, a2, a3, a4, a5, a6] = t.radarAxesShort;
  return (
    <svg viewBox="0 0 342 276" className={s.radarSvgM} role="img" aria-label={t.radarAria}>
      <g fill="none" strokeWidth="1">
        <polygon points="171,122 192,134 192,159 171,171 149,159 149,134" stroke="rgba(49,46,42,0.08)" />
        <polygon points="171,98 213,122 213,171 171,195 128,171 128,122" stroke="rgba(49,46,42,0.08)" />
        <polygon points="171,73 234,110 234,183 171,220 107,183 107,110" stroke="rgba(49,46,42,0.08)" />
        <polygon points="171,49 255,98 255,195 171,244 86,195 86,98" stroke="rgba(49,46,42,0.18)" />
        {[[171, 49], [255, 98], [255, 195], [171, 244], [86, 195], [86, 98]].map(([x, y], i) => (
          <line key={i} x1="171" y1="147" x2={x} y2={y} stroke="rgba(49,46,42,0.08)" />
        ))}
      </g>
      <polygon points="171,70 246,103 233,183 171,236 102,186 98,105" fill="rgba(49,46,42,0.04)" stroke="rgba(49,46,42,0.45)" strokeWidth="1" strokeDasharray="3 3" />
      <polygon points="171,80 249,101 247,191 171,227 91,192 95,103" fill="rgba(184,152,104,0.14)" stroke="#B89868" strokeWidth="1.6" />
      {[[171, 80], [249, 101], [247, 191], [171, 227], [91, 192], [95, 103]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#B89868" />
      ))}
      <g fontFamily={MONO} fontSize="9" fill="rgba(49,46,42,0.6)">
        <text x="171" y="38" textAnchor="middle">{a1}</text>
        <text x="260" y="101">{a2}</text>
        <text x="260" y="198">{a3}</text>
        <text x="171" y="260" textAnchor="middle">{a4}</text>
        <text x="82" y="198" textAnchor="end">{a5}</text>
        <text x="82" y="101" textAnchor="end">{a6}</text>
      </g>
    </svg>
  );
}

/* ── CH.04 수렴 다이어그램 ── */
const CONV_PAIRS: [number, number, number][] = [
  // [x, 예측 y(○), 실측 y(●)]
  [20, 66, 156], [68, 150, 78], [116, 82, 144], [164, 140, 90], [212, 94, 132],
  [260, 126, 98], [308, 100, 122], [356, 119, 102], [404, 105, 116],
];

function ConvergenceChart({ t }: { t: MethodCopy["ch04"] }) {
  return (
    <svg viewBox="0 0 480 248" className={s.convSvg} role="img" aria-label={t.convAria}>
      <path d="M 20 52 C 150 68, 290 88, 460 98 L 460 122 C 290 132, 150 152, 20 168 Z" fill="rgba(184,152,104,0.10)" />
      <path d="M 20 52 C 150 68, 290 88, 460 98" fill="none" stroke="rgba(184,152,104,0.4)" strokeWidth="1" strokeDasharray="3 4" />
      <path d="M 20 168 C 150 152, 290 132, 460 122" fill="none" stroke="rgba(184,152,104,0.4)" strokeWidth="1" strokeDasharray="3 4" />
      <line x1="20" y1="110" x2="460" y2="110" stroke="rgba(49,46,42,0.18)" strokeWidth="1" strokeDasharray="2 3" />
      {CONV_PAIRS.map(([x, py, ay]) => (
        <g key={x}>
          <line x1={x} y1={py} x2={x} y2={ay} stroke="rgba(49,46,42,0.25)" strokeWidth="1" />
          <circle cx={x} cy={py} r="3.5" fill="#ECEAE6" stroke="rgba(49,46,42,0.55)" strokeWidth="1.2" />
          <circle cx={x} cy={ay} r="3" fill="rgba(49,46,42,0.6)" />
        </g>
      ))}
      <line x1="452" y1="107" x2="452" y2="113" stroke="rgba(184,152,104,0.8)" strokeWidth="1.2" />
      <circle cx="452" cy="107" r="3.5" fill="#ECEAE6" stroke="#B89868" strokeWidth="1.4" />
      <circle cx="452" cy="113" r="3" fill="#B89868" />
      <g fontFamily={MONO} fontSize="11" letterSpacing="0.08em" fill="rgba(49,46,42,0.45)">
        <text x="8" y="240">{t.convStart}</text>
        <text x="476" y="240" textAnchor="end">{t.convEnd}</text>
      </g>
    </svg>
  );
}

export default async function MethodView({ locale = "ko" }: { locale?: Locale }) {
  const isKo = locale === "ko";
  const t = METHOD_COPY[locale];
  const dict = await getDictionary(locale);
  const base = localePrefixMap[locale];
  const href = (path: string) => (base === "/" ? path : `${base}${path}`);

  const ocean = await getOceanObservations().catch(() => null);
  const obs = buildObs(ocean, t.ch01.obsNames);
  const lp = t.ch01.livePrefix;
  const live = {
    temp: ocean?.seaTemp ? `${lp.temp} ${ocean.seaTemp.latest.toFixed(1)}°C` : `${lp.temp} 14.8°C`,
    // 해류: Open-Meteo가 자주 null이라 KHOA 조류(tidalCurrent) 실측을 다음 우선 (plan data-log와 동일 계단식)
    current: `${lp.current} ${(ocean?.oceanCurrent?.latest ?? ocean?.tidalCurrent?.latest ?? 1.2).toFixed(1)} m/s`,
    wave: ocean?.waveHeight ? `${lp.wave} ${ocean.waveHeight.latest.toFixed(1)} m` : `${lp.wave} 0.6 m`,
    pressure: ocean?.pressure ? `${lp.pressure} ${ocean.pressure.latest.toFixed(2)} atm` : `${lp.pressure} 3.97 atm`,
    salinity: ocean?.salinity ? `${lp.salinity} ${ocean.salinity.latest.toFixed(1)} ‰` : `${lp.salinity} 31.1 ‰`,
  };

  /** ko는 J1950 PNG, en/fr은 텍스트 챕터 타이틀 */
  const h2 = (png: { src: string; width: number }, text: string) =>
    isKo ? (
      <Image src={png.src} alt={text} width={png.width} height={39} unoptimized className={s.h2Img} />
    ) : (
      <span className={s.h2Text}>{text}</span>
    );

  return (
    <>
    <LetterHeader locale={locale} dict={dict.header} />
    <main className={s.page}>
      {/* ═══ S1. Hero ═══ */}
      <section className={s.hero}>
        {/* 풀블리드 배경 — 심해 케이지 (Paper Hero BG), 블랙 오버레이로 아주 연하게 */}
        <div className={s.heroBg} aria-hidden="true">
          <picture>
            <source media="(max-width: 768px)" srcSet="/images/method/hero-bg-m.webp" />
            <Image
              src="/images/method/hero-bg-d.webp"
              alt=""
              fill
              sizes="100vw"
              priority
              unoptimized
              className={s.heroBgImg}
            />
          </picture>
          <span className={s.heroScrim} />
        </div>
        <div className={s.heroCopy}>
          <h1 className={s.heroTitle}>
            {isKo ? (
              <picture>
                <source media="(max-width: 768px)" srcSet="/text/method/hero-m.png" />
                <Image
                  src="/text/method/hero-d.png"
                  alt={t.hero.title}
                  width={678}
                  height={222}
                  priority
                  unoptimized
                  className={s.heroTitleImg}
                />
              </picture>
            ) : (
              <span className={s.heroTitleText}>{t.hero.title}</span>
            )}
          </h1>
          <p className={s.heroSub}>
            {highlightBrand(t.hero.sub[0], s.heroBrand)}
            <br className={s.mOnly} /> {t.hero.sub[1]}
          </p>
        </div>
      </section>

      {/* ═══ S2. CH.01 기록한다 ═══ */}
      <section className={`${s.chapter} ${s.dark}`}>
        <div className={s.inner}>
          <ChapterMarker step={1} tone="dark" />
          <h2 className={s.h2}>{h2({ src: "/text/method/h-measure.png", width: 533 }, t.ch01.h2)}</h2>
        </div>
        <div className={`${s.inner} ${s.measureBody}`}>
          <figure className={s.measurePhoto}>
            <Image
              src="/images/method/measure-cage.webp"
              alt={t.ch01.photoAlt}
              width={640}
              height={450}
              unoptimized
              className={s.photoFill}
            />
          </figure>
          <div className={s.measureCopy}>
            <p>{t.ch01.p1}</p>
            <p>{t.ch01.p2}</p>
          </div>
        </div>
        <div className={`${s.inner} ${s.obsBlock}`}>
          <div className={s.obsHead}>
            <span className={s.monoLabel}>{t.ch01.obsLabel}</span>
            <span className={s.monoDim}>{t.ch01.obsSource}</span>
          </div>
          <div className={s.obsRule} />
          <ObsGrid items={obs} />
        </div>
        <div className={`${s.liveStrip} ${s.dOnly}`}>
          <span className={s.liveLabel}>{t.ch01.liveLabel}</span>
          <span>{live.temp}</span>
          <span>{live.current}</span>
          <span>{live.wave}</span>
          <span>{live.pressure}</span>
          <span>{live.salinity}</span>
        </div>
      </section>

      {/* ═══ S3. CH.02 예측한다 ═══ */}
      <section className={`${s.chapter} ${s.light}`}>
        <div className={s.inner}>
          <ChapterMarker step={2} tone="light" />
          <h2 className={s.h2}>{h2({ src: "/text/method/h-predict.png", width: 574 }, t.ch02.h2)}</h2>
          <p className={s.lead}>{t.ch02.lead}</p>
        </div>
        {/* 모바일 전용 태그 (데스크톱은 차트 안 SVG 태그) */}
        <div className={`${s.inner} ${s.tlTags} ${s.mOnly}`}>
          <span className={s.tagTeal}><em>{t.ch02.tagPlan.em}</em>{t.ch02.tagPlan.text}</span>
          <span className={s.tagGreen}><em>{t.ch02.tagRec.em}</em>{t.ch02.tagRec.text}</span>
          <span className={s.tagAmber}><em>{t.ch02.tagPeak.em}</em>{t.ch02.tagPeak.text}</span>
        </div>
        <div className={`${s.inner} ${s.tlWrap}`}>
          <div className={s.dOnly}><TimelineChartDesktop t={t.ch02} /></div>
          <div className={s.mOnly}><TimelineChartMobile t={t.ch02} /></div>
        </div>
        <div className={`${s.inner} ${s.tlLegend}`}>
          <span className={s.lgItem}><i className={s.swAmber} />{t.ch02.legend[0]}</span>
          <span className={s.lgItem}><i className={s.swSolid} />{t.ch02.legend[1]}</span>
          <span className={s.lgItem}><i className={s.swDash} />{t.ch02.legend[2]}</span>
          <span className={s.lgItem}><i className={s.swRust} />{t.ch02.legend[3]}</span>
          <span className={s.lgItem}><i className={s.swRustDash} />{t.ch02.legend[4]}</span>
          <span className={`${s.tlProduct} ${s.dOnly}`}>{t.ch02.tlProduct}</span>
        </div>

        {/* 풍미 레이더 */}
        <div className={`${s.inner} ${s.radarBlock}`}>
          <div className={s.radarRule} />
          <div className={s.radarHead}>
            <h3 className={s.h3}>{t.ch02.radarH3}</h3>
            <span className={`${s.monoDim} ${s.dOnly}`}>{t.ch02.radarHint}</span>
          </div>
          <div className={s.radarRow}>
            <div className={s.radarChart}>
              <div className={s.dOnly}><RadarDesktop t={t.ch02} /></div>
              <div className={s.mOnly}><RadarMobile t={t.ch02} /></div>
              <div className={s.radarLegend}>
                <span className={s.lgItem}><i className={s.swDashDark} />{t.ch02.radarLegendLand}</span>
                <span className={s.lgItem}><i className={s.swAmber} />{t.ch02.radarLegendSea}</span>
              </div>
            </div>
            <div className={`${s.changeList} ${s.dOnly}`}>
              {RADAR_CHANGES.map((c, i) => {
                const diff = c.after - c.before;
                const up = diff > 0;
                const strong = Math.abs(diff) >= 12;
                const badge = strong ? s.changeBadge : up ? s.changeUp : s.changeDown;
                return (
                  <div key={t.ch02.radarAxes[i]} className={s.changeRow}>
                    <span className={`${s.changeAxis}${strong ? " " + s.changeAxisStrong : ""}`}>{t.ch02.radarAxes[i]}</span>
                    <div className={s.changeMeta}>
                      <span className={s.changeVals}>
                        {c.before} → <span className={up ? s.valUp : s.valDown}>{c.after}</span>
                      </span>
                      <span className={badge}>{up ? "▲" : "▼"} {Math.abs(diff)}</span>
                    </div>
                  </div>
                );
              })}
              <p className={s.changeNote}>{t.ch02.changeNote}</p>
            </div>
          </div>
        </div>
        <div className={`${s.footnote} ${s.dOnly}`}>
          <span>SIX AXES · WSET 0–100</span>
          <span>ARRHENIUS · HENRY</span>
        </div>
      </section>

      {/* ═══ S4. CH.03 검증받는다 ═══ */}
      <section className={`${s.chapter} ${s.dark} ${s.verifySection}`}>
        <div className={`${s.inner} ${s.verifyGrid}`}>
          <div className={s.verifyCopy}>
            <ChapterMarker step={3} tone="dark" />
            <h2 className={s.h2}>{h2({ src: "/text/method/h-verify.png", width: 545 }, t.ch03.h2)}</h2>
            <p>{t.ch03.p1}</p>
            <p>{t.ch03.p2}</p>
            <span className={s.nextRetrieval}>{t.ch03.nextRetrieval}</span>
          </div>

          {/* 예측 기록서 — 아이폰 목업 (Dynamic Island + SEALED, 인양 시 공개) */}
          <div className={s.phone}>
            <span className={s.phoneIsland} aria-hidden="true" />
            <div className={s.card}>
            <div className={s.cardHead}>
              <span>OCEAN CELLAR™</span>
              <span className={s.cardNo}>{t.ch03.cardNo}</span>
            </div>
            <div className={s.cardTitle}>
              <strong>{t.ch03.cardTitle} <em>{t.ch03.cardTitleEn}</em></strong>
              <span>{t.ch03.cardSub}</span>
            </div>
            <div className={s.cardBadgeRow}>
              <span className={s.cardBadge}><i />{t.ch03.cardSealedBadge}</span>
              <Image src="/images/logo/logo_trans_W.png" alt="" width={54} height={46} unoptimized className={s.cardMark} />
            </div>
            {/* BATCH 카드 */}
            <div className={s.batchCard}>
              <span className={s.batchLabel}>{t.ch03.cardBatchLabel}</span>
              {t.ch03.cardBatch.map(([k, v]) => (
                <div key={k} className={s.batchRow}>
                  <span className={s.batchKey}>{k}</span>
                  <span className={s.batchVal}>{v}</span>
                </div>
              ))}
            </div>
            {/* 풍미 예측 — 잠김 */}
            <div className={s.axesCard}>
              <div className={s.axesHead}>
                <span>{t.ch03.cardAxesLabel}</span>
                <svg className={s.axesLock} width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden>
                  <rect x="0.5" y="5" width="10" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1" />
                  <path d="M2.8 5V3.6a2.7 2.7 0 0 1 5.4 0V5" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
              {t.ch03.cardAxes.map((a) => (
                <div key={a} className={s.axisRow}>
                  <span className={s.axisName}>{a}</span>
                  <span className={s.axisBar}><i /></span>
                  <span className={s.axisVal}>{t.ch03.sealed}</span>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>

        {/* 인양 풀블리드 */}
        <figure className={s.retrieval}>
          <Image
            src="/images/method/retrieval-cage.webp"
            alt={t.ch03.retrievalAlt}
            fill
            sizes="100vw"
            unoptimized
            className={s.coverImg}
          />
          <figcaption className={s.retrievalCap}>RETRIEVAL · 34°N · 126°E</figcaption>
        </figure>

        {/* 검증의 다섯 원칙 */}
        <div className={`${s.inner} ${s.principles}`}>
          <span className={s.monoLabel}>{t.ch03.principlesLabel}</span>
          <div className={s.principleRow}>
            {t.ch03.principles.map((p, i) => (
              <Fragment key={p}>
                {i > 0 && <i />}
                <span>{p}</span>
              </Fragment>
            ))}
          </div>
          <div className={s.principleGrid}>
            <div><span>{t.ch03.principles[0]}</span><span>{t.ch03.principles[1]}</span><span>{t.ch03.principles[3]}</span></div>
            <div><span>{t.ch03.principles[2]}</span><span>{t.ch03.principles[4]}</span></div>
          </div>
        </div>

      </section>

      {/* ═══ S5. CH.04 보정한다 ═══ */}
      <section className={`${s.chapter} ${s.light}`}>
        <div className={s.inner}>
          <ChapterMarker step={4} tone="light" />
          <h2 className={s.h2}>{h2({ src: "/text/method/h-learn.png", width: 546 }, t.ch04.h2)}</h2>
          <p className={s.lead}>{t.ch04.lead}</p>
        </div>
        <div className={`${s.inner} ${s.learnGrid}`}>
          <div className={s.learnBlock}>
            <ConvergenceChart t={t.ch04} />
            <h3 className={s.h3}>{t.ch04.loopH3}</h3>
            <p className={s.blockCopy}>{t.ch04.loopCopy}</p>
          </div>
          <div className={s.learnBlock}>
            <figure className={s.nfcPhoto}>
              <Image
                src="/images/method/nfc-phone.webp"
                alt={t.ch04.nfcAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                className={s.coverImg}
              />
            </figure>
            <h3 className={s.h3}>{t.ch04.certH3}</h3>
            <p className={s.blockCopy}>{t.ch04.certCopy}</p>
          </div>
        </div>
      </section>

      {/* ═══ S6. 화자 ═══ */}
      <section className={s.quoteSection}>
        <figure className={s.portrait}>
          <Image
            src="/images/method/quote-tablet.webp"
            alt={t.quote.portraitAlt}
            width={1672}
            height={941}
            unoptimized
            className={s.photoFill}
          />
        </figure>
        <blockquote className={s.quote}>
          {isKo ? (
            <picture>
              <source media="(max-width: 768px)" srcSet="/text/method/quote-m.png" />
              <Image
                src="/text/method/quote-d.png"
                alt={t.quote.text}
                width={889}
                height={147}
                unoptimized
                className={s.quoteImg}
              />
            </picture>
          ) : (
            <span className={s.quoteText}>{t.quote.text}</span>
          )}
        </blockquote>
        <div className={s.attribution}>
          <i />
          <span className={s.attrName}>{t.quote.attrName}</span>
          <span className={s.attrOrg}>{t.quote.attrOrg}</span>
        </div>
      </section>

      {/* ═══ S7. Archive ═══ */}
      <section className={`${s.chapter} ${s.light} ${s.archiveSection}`}>
        <div className={s.inner}>
          <span className={s.archiveEyebrow}>ARCHIVE</span>
          <h2 className={s.h2}>{h2({ src: "/text/method/h-archive.png", width: 492 }, t.archive.h2)}</h2>
          <p className={s.lead}>{t.archive.lead}</p>
          <figure className={s.archivePhoto}>
            <Image
              src="/images/method/archive-bottle.webp"
              alt={t.archive.photoAlt}
              width={1200}
              height={400}
              unoptimized
              className={s.photoFill}
            />
          </figure>
          <div className={s.archiveRows}>
            {t.archive.rows.map((r) => (
              <div key={r.date} className={s.archiveRow}>
                <span className={s.archiveDate}>{r.date}</span>
                <span className={s.archiveTitle}>{r.title}</span>
                <span className={r.accent ? s.archiveStatusAccent : s.archiveStatus}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ S8. Closing ═══ */}
      <section className={s.closing}>
        <h2 className={s.closingTitle}>
          {isKo ? (
            <picture>
              <source media="(max-width: 768px)" srcSet="/text/method/closing-m.png" />
              <Image
                src="/text/method/closing-d.png"
                alt={t.closing.title}
                width={611}
                height={135}
                unoptimized
                className={s.closingImg}
              />
            </picture>
          ) : (
            <span className={s.closingText}>{t.closing.title}</span>
          )}
        </h2>
        <p className={s.closingSub}>
          {t.closing.sub[0]}<br />{t.closing.sub[1]}
        </p>
        <Link href={href("/invite")} className={s.closingCta}>{t.closing.cta}</Link>
        <Link href={href("/partner")} className={s.closingSecondary}>{t.closing.secondary}</Link>
      </section>
    </main>
    <Footer locale={locale} dict={dict.footer} />
    </>
  );
}
