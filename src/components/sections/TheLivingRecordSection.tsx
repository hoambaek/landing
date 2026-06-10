"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* G3 — 측정 시작일(입수일). 오늘이 771일째가 되도록 역산한 기준값. */
const MEASURE_START = Date.UTC(2024, 4, 1); // 2024-05-01

function computeDays(): number {
  const elapsed = Date.now() - MEASURE_START;
  return Math.floor(elapsed / 86_400_000) + 1; // 1-indexed "N일째"
}

/** 771 숫자 카운팅 — 뷰 진입 시 0→target, 2.0s ease-out. reduced-motion 즉시 표기. */
function DaysCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState(0);

  useEffect(() => {
    const target = computeDays();
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let started = false;
    const DURATION = 2000;

    const run = () => {
      if (reduce) {
        setDays(target);
        return;
      }
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / DURATION, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        setDays(Math.round(target * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="s-living__counter" ref={ref}>
      <div className="s-living__counter-num">
        <span className="s-living__counter-value">{days}</span>
        <span className="s-living__counter-unit">일째</span>
      </div>
      <p className="s-living__counter-caption">
        이 바다를 기록한 시간 — 측정은 멈추지 않습니다.
      </p>
    </div>
  );
}

/**
 * S2 · The Living Record `data-archive` — 심해의 시간 (다크, Paper 02 1:1)
 * 풀블리드 o3 + 카피 3행 + 771 카운터 + 관측 로그 라인 + 클로징.
 */
export default function TheLivingRecordSection() {
  return (
    <section id="data-archive" className="s-living">
      {/* 풀블리드 배경 — 데스크톱 o3 / 모바일 o3_m */}
      <div className="s-living__bg">
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/o3_m.webp" />
          <Image
            src="/images/o3.webp"
            alt="남해 수심 30m, 인양 케이지 — 측정 현장"
            fill
            sizes="100vw"
            className="s-living__bg-img"
          />
        </picture>
      </div>
      <div className="s-living__overlay" aria-hidden="true" />
      <div className="s-living__overlay-m" aria-hidden="true" />

      <div className="s-living__text">
        {/* 도입 카피 — 데스크톱 3행 */}
        <div className="s-living__copy s-living__copy--desktop reveal">
          <span>깊은 바다 속</span>
          <span>빛이 사라진 곳에서,</span>
          <span>기록이 시작됩니다</span>
        </div>
        {/* 도입 카피 — 모바일 3행 (내용은 데스크톱과 동일) */}
        <div className="s-living__copy s-living__copy--mobile">
          <span>깊은 바다 속</span>
          <span>빛이 사라진 곳에서,</span>
          <span>기록이 시작됩니다</span>
        </div>

        {/* 771 카운터 */}
        <DaysCounter />
      </div>

      {/* 관측 로그 — 데스크톱 1행 5항목 */}
      <div className="s-living__log s-living__log--desktop">
        <span className="s-living__log-rule" />
        <div className="s-living__log-row">
          <span>기록 · 2026.06.10 KST</span>
          <span>수온 13.5°C</span>
          <span>해류 2.46 m/s</span>
          <span>수압 3.98 atm</span>
          <span>남해 34.1434°N · 126.5792°E</span>
        </div>
      </div>
      {/* 관측 로그 — 모바일 2행 */}
      <div className="s-living__log s-living__log--mobile">
        <span className="s-living__log-rule" />
        <div className="s-living__log-row">
          <span>기록 · 2026.06.10 KST</span>
          <span>수온 13.5°C · 수압 3.98atm</span>
        </div>
        <div className="s-living__log-row">
          <span>해류 2.46 m/s</span>
          <span>남해 34.1434°N · 126.5792°E</span>
        </div>
      </div>
    </section>
  );
}
