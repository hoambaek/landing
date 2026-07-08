"use client";

import { useEffect, useRef, useState } from "react";
import s from "./method.module.css";

/** CH01 관측 그리드 — 뷰포트 진입 시 1회: 수치 카운트업 + 스파크라인 드로잉 */

export interface ObsItem {
  label: string;
  value: string;
  d: string;
  endY: number;
}

/** "30.8 ‰" → { num: 30.8, decimals: 1, suffix: " ‰" } */
function splitValue(value: string): { num: number; decimals: number; suffix: string } | null {
  const m = value.match(/^(-?\d+(?:\.(\d+))?)(.*)$/);
  if (!m) return null;
  return { num: parseFloat(m[1]), decimals: m[2]?.length ?? 0, suffix: m[3] };
}

function AnimatedSpark({ d, endY, progress }: { d: string; endY: number; progress: number }) {
  const ref = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  useEffect(() => {
    setLen(ref.current?.getTotalLength() ?? 0);
  }, [d]);
  return (
    <svg viewBox="0 0 270 48" className={s.sparkSvg} aria-hidden="true">
      <path
        ref={ref}
        d={d}
        fill="none"
        stroke="rgba(232,229,225,0.35)"
        strokeWidth="1.4"
        strokeDasharray={len || undefined}
        strokeDashoffset={len ? len * (1 - progress) : undefined}
      />
      <circle
        cx="270"
        cy={endY}
        r="3.5"
        fill="var(--color-amber)"
        style={{ opacity: progress >= 1 ? 1 : 0, transition: "opacity 0.4s ease" }}
      />
    </svg>
  );
}

export default function ObsGrid({ items }: { items: ObsItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  // 초기값 1 — SSR·애니메이션 시작 전에는 최종값과 완성 곡선을 보여준다 (SEO·no-JS 안전)
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const DUR = 1600;
        const tick = (now: number) => {
          const p = Math.min((now - t0) / DUR, 1);
          setProgress(1 - Math.pow(1 - p, 3)); // ease-out cubic
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={s.obsGrid} ref={rootRef}>
      {items.map((o) => {
        const parsed = splitValue(o.value);
        const shown = parsed ? `${(parsed.num * progress).toFixed(parsed.decimals)}${parsed.suffix}` : o.value;
        return (
          <div key={o.label} className={s.obsCell}>
            <div className={s.obsCellHead}>
              <span className={s.obsLabel}>{o.label}</span>
              <span className={s.obsValue}>{shown}</span>
            </div>
            <AnimatedSpark d={o.d} endY={o.endY} progress={progress} />
          </div>
        );
      })}
    </div>
  );
}
