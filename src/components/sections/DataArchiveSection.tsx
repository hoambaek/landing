"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import CTALink from "@/components/ui/CTALink";
import {
  fetchOceanData30Days,
  calculateWaterPressure,
  type OceanDataDaily,
} from "@/lib/supabase";

const METRICS = [
  { key: "sea_temperature_avg", label: "수온", sub: "temp.", unit: "°C", color: "#E8E5E1", decimals: 1 },
  { key: "current_velocity_avg", label: "해류 속도", sub: "current", unit: "m/s", color: "#DDDAD5", decimals: 2 },
  { key: "current_direction_dominant", label: "해류 방향", sub: "dir.", unit: "°", color: "#C8C4BE", decimals: 0 },
  { key: "wave_height_avg", label: "파고", sub: "wave", unit: "m", color: "#F0EDE8", decimals: 1 },
  { key: "wave_period_avg", label: "파주기", sub: "period", unit: "s", color: "#D2CFC9", decimals: 1 },
  { key: "water_pressure", label: "수압", sub: "pressure", unit: "atm", color: "#B8B4AE", decimals: 2 },
] as const;

// Chart lines config
const CHART_LINES = [
  { key: "sea_temperature_avg", label: "수온", color: "#FFFFFF" },
  { key: "current_velocity_avg", label: "해류", color: "#CCAD7B" },
  { key: "wave_height_avg", label: "파고", color: "#6B4C2A" },
  { key: "wave_period_avg", label: "파주기", color: "#7A9BAE" },
  { key: "water_pressure", label: "수압", color: "#3D3028" },
  { key: "current_direction_dominant", label: "방향", color: "#A08060" },
] as const;

function getLatestValue(data: OceanDataDaily[], key: string, depth: number): number | null {
  if (data.length === 0) return null;
  const latest = data[data.length - 1];
  if (key === "water_pressure") {
    return calculateWaterPressure(depth, latest.surface_pressure_avg ?? undefined);
  }
  return (latest as unknown as Record<string, number | null>)[key] ?? null;
}

function normalizeValues(data: OceanDataDaily[], key: string, depth: number): number[] {
  const values = data.map((d) => {
    if (key === "water_pressure") {
      return calculateWaterPressure(depth, d.surface_pressure_avg ?? undefined);
    }
    return (d as unknown as Record<string, number | null>)[key] ?? null;
  });

  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return values.map(() => 0.5);

  // 해류 방향(0~360°)은 순환 데이터 — 누적 델타로 변환하여 점프 제거
  if (key === "current_direction_dominant") {
    const unwrapped: number[] = [];
    let prev: number | null = null;
    for (const v of values) {
      if (v === null) { unwrapped.push(0); continue; }
      if (prev === null) { unwrapped.push(v); prev = v; continue; }
      let delta = v - prev;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      const last = unwrapped[unwrapped.length - 1];
      unwrapped.push(last + delta);
      prev = v;
    }
    const uMin = Math.min(...unwrapped);
    const uMax = Math.max(...unwrapped);
    const uRange = uMax - uMin || 1;
    const norm = unwrapped.map((v) => (v - uMin) / uRange);
    // 심리스 루프 보간 — 끝→시작을 부드럽게 연결
    const BLEND = 6;
    const lst = norm[norm.length - 1];
    const fst = norm[0];
    for (let i = 1; i <= BLEND; i++) {
      const t = i / BLEND; // t: 1/6, 2/6, ... 6/6=1.0 (정확히 첫 값에 도달)
      norm.push(lst + (fst - lst) * t);
    }
    return norm;
  }

  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const range = max - min || 1;

  const norm = values.map((v) => (v !== null ? (v - min) / range : 0.5));

  // 심리스 루프 보간 — 끝→시작을 부드럽게 연결
  const BLEND = 6;
  const last = norm[norm.length - 1];
  const first = norm[0];
  for (let i = 1; i <= BLEND; i++) {
    const t = i / BLEND; // t: 1/6, 2/6, ... 6/6=1.0 (정확히 첫 값에 도달)
    norm.push(last + (first - last) * t);
  }

  return norm;
}

function buildSvgPath(normalized: number[], width: number, height: number, padding: number): string {
  const usableH = height - padding * 2;
  const step = width / Math.max(normalized.length - 1, 1);

  const points = normalized.map((v, i) => ({
    x: i * step,
    y: padding + (1 - v) * usableH,
  }));

  if (points.length < 2) return "";

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

// Seeded pseudo-random for deterministic wave offsets
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function buildOffsetPath(
  normalized: number[],
  width: number,
  height: number,
  padding: number,
  yOffset: number,
  xPhase: number,
): string {
  const usableH = height - padding * 2;
  const step = width / Math.max(normalized.length - 1, 1);

  const points = normalized.map((v, i) => ({
    x: i * step + xPhase,
    y: padding + (1 - v) * usableH + yOffset,
  }));

  if (points.length < 2) return "";

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

const ECHOES_PER_LINE = 8; // 6 metrics × 8 echoes = 48 lines total

function ScrollingChart({ data, depth, lastUpdate }: { data: OceanDataDaily[]; depth: number; lastUpdate: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const HALF_W = 1200;
  const W = HALF_W * 2; // 두 벌로 심리스 루프
  const H = 120;
  const PAD = 8;

  return (
    <div ref={ref} className="s-data__chart-wrap">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.6 }}
        className="s-data__chart-scroll"
      >
        <svg
          className="s-data__chart-svg"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Dense wave lines — 두 벌 (0~HALF_W, HALF_W~W) */}
          {CHART_LINES.map((line, li) => {
            const norm = normalizeValues(data, line.key, depth);
            if (norm.length < 2) return null;

            return Array.from({ length: ECHOES_PER_LINE }, (_, ei) => {
              const seed = li * 100 + ei;
              const yOff = (ei - ECHOES_PER_LINE / 2) * 2.2 + seededRandom(seed) * 3;
              const xPhase = seededRandom(seed + 50) * 8 - 4;
              const opacity = 0.12 + seededRandom(seed + 99) * 0.25;
              const strokeW = 0.3 + seededRandom(seed + 77) * 0.5;
              const path1 = buildOffsetPath(norm, HALF_W, H, PAD, yOff, xPhase);
              const path2 = buildOffsetPath(norm, HALF_W, H, PAD, yOff, xPhase + HALF_W);
              if (!path1 || !path2) return null;

              return (
                <g key={`${line.key}-${ei}`}>
                  <path d={path1} fill="none" stroke={line.color} strokeWidth={strokeW} opacity={opacity} />
                  <path d={path2} fill="none" stroke={line.color} strokeWidth={strokeW} opacity={opacity} />
                </g>
              );
            });
          })}
        </svg>
      </motion.div>
      <div className="s-data__chart-footer">
        <span className="s-data__chart-update">
          최근 30일간 측정 데이터{lastUpdate ? ` · ${lastUpdate.replace(/-/g, ".")} KST` : ""}
        </span>
      </div>
    </div>
  );
}

export default function DataArchiveSection() {
  const [data, setData] = useState<OceanDataDaily[]>([]);
  const [loading, setLoading] = useState(true);
  const depth = 30; // default aging depth

  useEffect(() => {
    fetchOceanData30Days().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const lastUpdate = data.length > 0 ? data[data.length - 1].date : null;

  return (
    <section id="data-archive" className="s-data" aria-labelledby="data-label">
      <div className="container">
        <h2 className="s-data__title reveal reveal-delay-1" id="data-label">
          living data<span className="dot">.</span>
        </h2>
        <div className="s-data__statements reveal reveal-delay-1">
          <p className="s-data__statement-block">
            단순히 바다에 넣은 것이 아니다.
            <br />
            <mark className="s-data__highlight">설계된 것이다.</mark>
          </p>
          <p className="s-data__statement-block">
            지상의 셀러가 만들 수 없는 조건을
            <br />
            바다가 만든다.
          </p>
        </div>

        {/* 6 Data Points */}
        <p className="s-data__section-note reveal reveal-delay-2">현재 바다의 실측값</p>
        <div className="s-data__grid reveal reveal-delay-2">
          {METRICS.map((m, i) => {
            const val = getLatestValue(data, m.key, depth);
            return (
              <div
                key={m.key}
                className="s-data__point"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <p className="s-data__number" style={{ color: m.color }}>
                  {loading ? "—" : val !== null ? val.toFixed(m.decimals) : "—"}
                  <span className="s-data__unit">{m.unit}</span>
                </p>
                <p className="s-data__metric-label">{m.label}</p>
              </div>
            );
          })}
        </div>

        {/* 30-Day Chart */}
        {data.length > 1 && <ScrollingChart data={data} depth={depth} lastUpdate={lastUpdate} />}

        <div className="s-data__cta reveal">
          <CTALink href="/data" variant="dark">바다의 기록 보기</CTALink>
        </div>
      </div>
    </section>
  );
}
