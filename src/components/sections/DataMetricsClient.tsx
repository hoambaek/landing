"use client";

import { useEffect, useRef, useState } from "react";

interface MetricItem {
  key: string;
  label: string;
  unit: string;
  color: string;
  decimals: number;
  value: number | null;
}

function AnimatedNumber({
  value,
  decimals,
  duration = 1600,
}: {
  value: number;
  decimals: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || !ref.current) return;

    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = eased * value;
      if (ref.current) ref.current.textContent = current.toFixed(decimals);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    ref.current.textContent = (0).toFixed(decimals);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value, decimals, duration]);

  return <span ref={ref}>{value.toFixed(decimals)}</span>;
}

export default function DataMetricsClient({
  metrics,
}: {
  metrics: MetricItem[];
}) {
  return (
    <div className="s-data__grid reveal reveal-delay-2">
      {metrics.map((m, i) => (
        <div
          key={m.key}
          className="s-data__point"
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          <p className="s-data__number" style={{ color: m.color }}>
            {m.value !== null ? (
              <>
                <AnimatedNumber
                  value={m.value}
                  decimals={m.decimals}
                  duration={1600 + i * 100}
                />
                <span className="s-data__unit">{m.unit}</span>
              </>
            ) : (
              <>
                —<span className="s-data__unit">{m.unit}</span>
              </>
            )}
          </p>
          <p className="s-data__metric-label" style={{ color: m.color, borderColor: `${m.color}40` }}>{m.label}</p>
        </div>
      ))}
    </div>
  );
}
