"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { localePrefixMap, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { computeMeasureDays } from "@/lib/measurement";

/** 측정값 숫자 카운팅 — 뷰 진입 시 0→target, 800일 카운터와 동일한 2.0s ease-out. */
function LogVals({
  locale,
  log,
}: {
  locale: Locale;
  log: Dictionary["living"]["log"];
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const [stamp, setStamp] = useState(""); // 오늘 날짜 — 하이드레이션 불일치 방지 위해 클라이언트에서 기록

  useEffect(() => {
    const intl = { ko: "ko-KR", en: "en-US", fr: "fr-FR", ja: "ja-JP" }[locale];
    setStamp(
      new Intl.DateTimeFormat(intl, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date()),
    );
  }, [locale]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let timer = 0;
    let started = false;
    const DELAY = 2000; // 800일 카운터(2.0s)가 끝난 뒤에 시작
    const DURATION = 1500;

    const run = () => {
      if (reduce) {
        setProgress(1);
        return;
      }
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / DURATION, 1);
        setProgress(1 - Math.pow(1 - p, 3)); // ease-out cubic
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          if (reduce) {
            run();
          } else {
            timer = window.setTimeout(run, DELAY);
          }
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  /** "수온 13.5°C" 같은 문자열에서 숫자만 0→target으로 보간 (fr의 쉼표 소수점 유지) */
  const render = (text: string) => {
    const m = text.match(/-?\d+(?:[.,]\d+)?/);
    if (!m || m.index === undefined) return text;
    const raw = m[0];
    const sep = raw.includes(",") ? "," : ".";
    const decimals = raw.includes(sep) ? raw.split(sep)[1].length : 0;
    const target = parseFloat(raw.replace(",", "."));
    const num = (target * progress).toFixed(decimals).replace(".", sep);
    return text.slice(0, m.index) + num + text.slice(m.index + raw.length);
  };

  return (
    <>
      {/* 오늘의 기록 스탬프 — 세리프 날짜 */}
      <span className="s-living__log-time">{stamp}</span>
      <ul className="s-living__log-vals" ref={ref}>
        <li className="s-living__log-live" aria-hidden="true">
          <span className="s-living__live-dot" />
        </li>
        <li><span>{render(log.temp)}</span></li>
        <li><span>{render(log.current)}</span></li>
        <li><span>{render(log.depth)}</span></li>
      </ul>
    </>
  );
}

/** 771 숫자 카운팅 — 뷰 진입 시 0→target, 2.0s ease-out. reduced-motion 즉시 표기. */
function DaysCounter({
  locale,
  dict,
  liveLog,
}: {
  locale: Locale;
  dict: Dictionary["living"];
  liveLog?: Dictionary["living"]["log"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState(0);

  useEffect(() => {
    const target = computeMeasureDays();
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
            unoptimized
            className="s-living__counter-unit"
          />
        ) : (
          <span className="s-living__counter-unit-text">{dict.counterUnit}</span>
        )}
      </div>
      {/* 지금 이 순간의 측정값 (카운팅 + 우측 라이브 인디케이터) */}
      <div className="s-living__log">
        <span className="s-living__log-rule" />
        <LogVals locale={locale} log={liveLog ?? dict.log} />
      </div>

      {/* OCEAN CELLAR™ 방법 페이지 진입 — 브랜드 소개서와 동일한 다크 채움 버튼 */}
      <Link
        href={locale === "ko" ? "/method" : `${localePrefixMap[locale]}/method`}
        className="s-living__method-btn"
        /* 블러는 인라인 — Lightning CSS가 스타일시트의 backdrop-filter를 제거함 */
        style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
      >
        <span className="s-living__method-btn-label">{dict.methodLink}</span>
        <span className="s-living__method-btn-arrow" aria-hidden="true">›</span>
      </Link>
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
  liveLog,
}: {
  locale: Locale;
  dict: Dictionary["living"];
  /** 서버에서 주입한 실측 측정값(method와 동일 소스). 없으면 dict.log 고정값 */
  liveLog?: Dictionary["living"]["log"];
}) {
  const isKo = locale === "ko";
  /** 도입 카피 — ko는 PNG, en/fr은 텍스트 */
  const copy = isKo ? (
    <Image
      src="/text/living-copy.png"
      alt={dict.copy}
      width={354}
      height={184}
      unoptimized
      className="s-living__copy-img"
    />
  ) : (
    <span className="s-living__copy-text">{dict.copy}</span>
  );

  return (
    <section id="data-archive" className="s-living" aria-label="The Living Record">
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

      <div className="s-living__text">
        {/* 도입 카피 — 단일 소스 (데스크톱 3행 / 모바일 축소) */}
        <div className="s-living__copy reveal">{copy}</div>

        {/* 771 카운터 + 측정값 */}
        <DaysCounter locale={locale} dict={dict} liveLog={liveLog} />
      </div>
    </section>
  );
}
