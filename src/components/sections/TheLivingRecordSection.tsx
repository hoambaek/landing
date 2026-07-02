"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

/* G3 — 측정 시작일(입수일). 오늘이 771일째가 되도록 역산한 기준값. */
const MEASURE_START = Date.UTC(2024, 4, 1); // 2024-05-01

function computeDays(): number {
  const elapsed = Date.now() - MEASURE_START;
  return Math.floor(elapsed / 86_400_000) + 1; // 1-indexed "N일째"
}

/** 771 숫자 카운팅 — 뷰 진입 시 0→target, 2.0s ease-out. reduced-motion 즉시 표기. */
function DaysCounter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["living"];
}) {
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
        {locale === "ko" ? (
          <Image
            src="/text/counter-unit.png"
            alt={dict.counterUnit}
            width={59}
            height={40}
            className="s-living__counter-unit"
          />
        ) : (
          <span className="s-living__counter-unit-text">{dict.counterUnit}</span>
        )}
      </div>
      <p className="s-living__counter-caption">{dict.counterCaption}</p>

      {/* 측정은 멈추지 않습니다 — 지금 이 순간의 측정값 */}
      <div className="s-living__log">
        <span className="s-living__log-rule" />
        <div className="s-living__log-vals">
          <span>{dict.log.temp}</span>
          <span>{dict.log.current}</span>
          <span>{dict.log.pressure}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * S2 · The Living Record `data-archive` — 심해의 시간 (다크, Paper 02 1:1)
 * 풀블리드 o3 + 카피 3행 + 771 카운터 + 관측 로그 라인 + 클로징.
 */
export default function TheLivingRecordSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["living"];
}) {
  const isKo = locale === "ko";
  /** 도입 카피 — ko는 PNG, en/fr은 텍스트 */
  const copy = isKo ? (
    <Image
      src="/text/living-copy.png"
      alt={dict.copy}
      width={354}
      height={184}
      className="s-living__copy-img"
    />
  ) : (
    <span className="s-living__copy-text">{dict.copy}</span>
  );

  return (
    <section id="data-archive" className="s-living">
      {/* 풀블리드 배경 — 데스크톱 o3 / 모바일 o3_m */}
      <div className="s-living__bg">
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/o3_m.webp" />
          <Image
            src="/images/o3.webp"
            alt={dict.bgAlt}
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
        <div className="s-living__copy s-living__copy--desktop reveal">{copy}</div>
        {/* 도입 카피 — 모바일 3행 (내용은 데스크톱과 동일) */}
        <div className="s-living__copy s-living__copy--mobile">{copy}</div>

        {/* 771 카운터 + 측정값 */}
        <DaysCounter locale={locale} dict={dict} />
      </div>
    </section>
  );
}
