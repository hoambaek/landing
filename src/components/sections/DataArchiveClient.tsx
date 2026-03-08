"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { calculateWaterPressure, type OceanDataDaily } from "@/lib/supabase";

const CHART_LINES = [
  { key: "sea_temperature_avg", label: "수온", color: "#FFFFFF" },
  { key: "current_velocity_avg", label: "해류", color: "#CCAD7B" },
  { key: "wave_height_avg", label: "파고", color: "#6B4C2A" },
  { key: "wave_period_avg", label: "파주기", color: "#7A9BAE" },
  { key: "water_pressure", label: "수압", color: "#3D3028" },
  { key: "current_direction_dominant", label: "방향", color: "#A08060" },
] as const;

/** Round to 2 decimal places for SVG precision reduction */
function r(n: number): number {
  return Math.round(n * 100) / 100;
}

function normalizeValues(
  data: OceanDataDaily[],
  key: string,
  depth: number,
): number[] {
  const values = data.map((d) => {
    if (key === "water_pressure") {
      return calculateWaterPressure(depth, d.surface_pressure_avg ?? undefined);
    }
    return (d as unknown as Record<string, number | null>)[key] ?? null;
  });

  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return values.map(() => 0.5);

  // Circular data (0-360 degrees) — unwrap to remove jumps
  if (key === "current_direction_dominant") {
    const unwrapped: number[] = [];
    let prev: number | null = null;
    for (const v of values) {
      if (v === null) {
        unwrapped.push(0);
        continue;
      }
      if (prev === null) {
        unwrapped.push(v);
        prev = v;
        continue;
      }
      let delta = v - prev;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      const last = unwrapped[unwrapped.length - 1];
      unwrapped.push(last + delta);
      prev = v;
    }
    // Single-pass min/max
    let uMin = unwrapped[0],
      uMax = unwrapped[0];
    for (let i = 1; i < unwrapped.length; i++) {
      if (unwrapped[i] < uMin) uMin = unwrapped[i];
      if (unwrapped[i] > uMax) uMax = unwrapped[i];
    }
    const uRange = uMax - uMin || 1;
    const norm = unwrapped.map((v) => (v - uMin) / uRange);
    const BLEND = 6;
    const lst = norm[norm.length - 1];
    const fst = norm[0];
    for (let i = 1; i <= BLEND; i++) {
      norm.push(lst + (fst - lst) * (i / BLEND));
    }
    return norm;
  }

  // Single-pass min/max
  let min = valid[0],
    max = valid[0];
  for (let i = 1; i < valid.length; i++) {
    if (valid[i] < min) min = valid[i];
    if (valid[i] > max) max = valid[i];
  }
  const range = max - min || 1;

  const norm = values.map((v) => (v !== null ? (v - min) / range : 0.5));
  const BLEND = 6;
  const last = norm[norm.length - 1];
  const first = norm[0];
  for (let i = 1; i <= BLEND; i++) {
    norm.push(last + (first - last) * (i / BLEND));
  }
  return norm;
}

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
    x: r(i * step + xPhase),
    y: r(padding + (1 - v) * usableH + yOffset),
  }));

  if (points.length < 2) return "";

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = r((prev.x + curr.x) / 2);
    d += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

const ECHOES_PER_LINE = 8;

export default function DataArchiveClient({
  data,
  depth,
  lastUpdate,
}: {
  data: OceanDataDaily[];
  depth: number;
  lastUpdate: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const HALF_W = 1200;
  const W = HALF_W * 2;
  const H = 120;
  const PAD = 8;

  // Memoize normalized data computation
  const normalizedData = useMemo(
    () =>
      CHART_LINES.map((line) => ({
        key: line.key,
        color: line.color,
        norm: normalizeValues(data, line.key, depth),
      })),
    [data, depth],
  );

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
          {normalizedData.map(({ key, color, norm }, li) => {
            if (norm.length < 2) return null;

            return Array.from({ length: ECHOES_PER_LINE }, (_, ei) => {
              const seed = li * 100 + ei;
              const yOff = r(
                (ei - ECHOES_PER_LINE / 2) * 2.2 + seededRandom(seed) * 3,
              );
              const xPhase = r(seededRandom(seed + 50) * 8 - 4);
              const opacity = r(0.12 + seededRandom(seed + 99) * 0.25);
              const strokeW = r(0.3 + seededRandom(seed + 77) * 0.5);
              const path1 = buildOffsetPath(
                norm,
                HALF_W,
                H,
                PAD,
                yOff,
                xPhase,
              );
              const path2 = buildOffsetPath(
                norm,
                HALF_W,
                H,
                PAD,
                yOff,
                xPhase + HALF_W,
              );
              if (!path1 || !path2) return null;

              return (
                <g key={`${key}-${ei}`}>
                  <path
                    d={path1}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeW}
                    opacity={opacity}
                  />
                  <path
                    d={path2}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeW}
                    opacity={opacity}
                  />
                </g>
              );
            });
          })}
        </svg>
      </motion.div>
      <div className="s-data__chart-footer">
        <span className="s-data__chart-update">
          최근 30일간 측정 데이터
          {lastUpdate
            ? ` · ${lastUpdate.replace(/-/g, ".")} KST`
            : ""}
        </span>
      </div>
    </div>
  );
}
