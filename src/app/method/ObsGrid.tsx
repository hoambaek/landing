"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const [len, setLen] = useState(0);

  /* 곡선 길이는 노드가 붙는 순간 잰다 — dasharray로 선을 그려내려면 실측 길이가 필요하다.
     이펙트로 재면 이펙트 본문의 동기 setState가 되어 연쇄 렌더가 난다
     (react-hooks/set-state-in-effect). 콜백 ref는 커밋 시점에 한 번만 돈다.
     d가 바뀌면 key가 path를 새로 마운트시켜 다시 잰다. */
  const measure = useCallback((node: SVGPathElement | null) => {
    if (node) setLen(node.getTotalLength());
  }, []);

  return (
    <svg viewBox="0 0 270 48" className={s.sparkSvg} aria-hidden="true">
      <path
        key={d}
        ref={measure}
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
