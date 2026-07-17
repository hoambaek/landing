"use client";

/**
 * /b 병 기록 페이지 — Paper v2 시안 + "Motion & Data Notes v2" 스펙 구현.
 * 표기 규칙: 입수·인양은 월·계절만(날짜·일수 금지). 용어는 "입수".
 * 모션: 인트로 정착 → S1 핀 스크럽(포인트 이동·칩 갱신) → S2 점 순차 점등 →
 *       S3 8줄기 스크럽 성장 + 연평균 카운트업 → S4 수렴 스크럽 → S5 N° 카운트업.
 * ⚠️ pin은 래퍼를 JSX에 사전 배치(pinSpacer)해 CSS 인트로 재시작을 막는다 (랜딩 DescentEffect 실증).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./bottle.module.css";
import { BOTTLE_COPY, BOTTLE_LOCALES, MAISON_NAME, PRODUCT_META, type BottleLocale } from "../_lib/copy";
import type { BottleRecordData } from "../_lib/data";

gsap.registerPlugin(ScrollTrigger);

type SeasonKey = "winter" | "spring" | "summer" | "autumn";

function seasonOf(monthIdx: number): SeasonKey {
  if (monthIdx === 11 || monthIdx <= 1) return "winter";
  if (monthIdx <= 4) return "spring";
  if (monthIdx <= 7) return "summer";
  return "autumn";
}

function monthIdxOf(date: string | null, fallback: number): number {
  if (!date) return fallback;
  const m = Number(date.slice(5, 7)) - 1;
  return m >= 0 && m < 12 ? m : fallback;
}

/* 히어로 곡선 스무딩 — Catmull-Rom을 베지에로 변환. 발광 포인트도 같은 식으로 곡선 위를 따라간다. */
type CurvePt = { x: number; y: number };

/* 지나온 구간 실선 리빌용 호길이 LUT 샘플 수 (세그먼트당) */
const CURVE_SAMPLES = 20;

function crControls(pts: CurvePt[], i: number): { c1: CurvePt; c2: CurvePt } {
  const p0 = pts[Math.max(0, i - 1)];
  const p1 = pts[i];
  const p2 = pts[i + 1];
  const p3 = pts[Math.min(pts.length - 1, i + 2)];
  return {
    c1: { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
    c2: { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
  };
}

function smoothPathD(pts: CurvePt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const { c1, c2 } = crControls(pts, i);
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${pts[i + 1].x.toFixed(1)} ${pts[i + 1].y.toFixed(1)}`;
  }
  return d;
}

function evalSmooth(pts: CurvePt[], i: number, f: number): CurvePt {
  if (i >= pts.length - 1) return pts[pts.length - 1];
  const p1 = pts[i];
  const p2 = pts[i + 1];
  const { c1, c2 } = crControls(pts, i);
  const u = 1 - f;
  return {
    x: u * u * u * p1.x + 3 * u * u * f * c1.x + 3 * u * f * f * c2.x + f * f * f * p2.x,
    y: u * u * u * p1.y + 3 * u * u * f * c1.y + 3 * u * f * f * c2.y + f * f * f * p2.y,
  };
}

/* S3 여덟 줄기 — Paper 확정 지오메트리 (viewBox 390×1290, 시작 높이는 0~43px 안에서만 미세하게 다르게) */
const FLOW_PATHS: { d: string; stroke: string; width: number; amber?: boolean }[] = [
  { d: "M 120 16 C 120 110, 95 210, 95 300 S 145 500, 145 600 S 120 800, 120 900 S 110 1100, 110 1200 L 110 1290", stroke: "rgba(241,239,235,0.35)", width: 0.9 },
  { d: "M 145 33 C 145 123, 180 220, 180 300 S 90 500, 90 600 S 165 800, 165 900 S 135 1100, 135 1200 L 135 1290", stroke: "rgba(241,239,235,0.3)", width: 0.8 },
  { d: "M 170 8 C 170 104, 155 200, 155 300 S 165 500, 165 600 S 180 800, 180 900 S 160 1100, 160 1200 L 160 1290", stroke: "rgba(241,239,235,0.25)", width: 0.7 },
  { d: "M 195 38 C 195 127, 198 230, 198 300 S 192 500, 192 600 S 195 800, 195 900 S 185 1100, 185 1200 L 185 1290", stroke: "rgba(241,239,235,0.45)", width: 1 },
  { d: "M 220 22 C 220 115, 255 220, 255 300 S 175 500, 175 600 S 235 800, 235 900 S 210 1100, 210 1200 L 210 1290", stroke: "rgba(241,239,235,0.35)", width: 0.9 },
  { d: "M 245 43 C 245 131, 220 240, 220 300 S 265 500, 265 600 S 205 800, 205 900 S 235 1100, 235 1200 L 235 1290", stroke: "rgba(241,239,235,0.3)", width: 0.8 },
  { d: "M 270 28 C 270 119, 285 225, 285 300 S 240 500, 240 600 S 260 800, 260 900 S 260 1100, 260 1200 L 260 1290", stroke: "rgba(241,239,235,0.25)", width: 0.7 },
  { d: "M 95 0 C 95 100, 120 200, 120 300 S 225 500, 225 600 S 150 800, 150 900 S 85 1100, 85 1200 L 85 1290", stroke: "#CCAD7B", width: 1.4, amber: true },
];

const CONVERGE_XS = [85, 110, 135, 160, 185, 210, 235, 260];
const CONVERGE_STYLE = [
  { stroke: "#CCAD7B", width: 1.4 },
  { stroke: "rgba(241,239,235,0.35)", width: 0.9 },
  { stroke: "rgba(241,239,235,0.3)", width: 0.8 },
  { stroke: "rgba(241,239,235,0.25)", width: 0.7 },
  { stroke: "rgba(241,239,235,0.45)", width: 1 },
  { stroke: "rgba(241,239,235,0.35)", width: 0.9 },
  { stroke: "rgba(241,239,235,0.3)", width: 0.8 },
  { stroke: "rgba(241,239,235,0.25)", width: 0.7 },
];

type MetricKey = "temp" | "salinity" | "tide" | "current" | "pressure" | "tidal" | "wave" | "period";

const STATION_TOPS: Record<MetricKey, number> = {
  temp: 210, salinity: 350, tide: 490, current: 630, pressure: 780, tidal: 920, wave: 1060, period: 1200,
};

/* 스테이션 카운트업용 수치 분해 */
interface StationValue { num: number | null; decimals: number; unit: string }

export default function BottleRecord({ data }: { data: BottleRecordData }) {
  const [locale, setLocale] = useState<BottleLocale>("ko");
  const [langOpen, setLangOpen] = useState(false);
  const [flowScale, setFlowScale] = useState(1);

  const rootRef = useRef<HTMLDivElement>(null);
  const heroPinWrapRef = useRef<HTMLDivElement>(null); // pinSpacer 사전 배치 (CSS 인트로 재시작 방지)
  const heroRef = useRef<HTMLElement>(null);
  const heroSerialRef = useRef<HTMLDivElement>(null);
  const pointRef = useRef<SVGGElement>(null);
  const solidRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const dropRef = useRef<SVGLineElement>(null);
  const areaClipRef = useRef<SVGRectElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const flowSectionRef = useRef<HTMLElement>(null);
  const flowSvgRef = useRef<SVGSVGElement>(null);
  const convergeSvgRef = useRef<SVGSVGElement>(null);
  const convergeDotRef = useRef<SVGGElement>(null);
  const bottleSerialRef = useRef<HTMLParagraphElement>(null);
  const labelFnRef = useRef<(m: number, t: number | null) => string>(() => "");

  const copy = BOTTLE_COPY[locale];
  const activeLocale = BOTTLE_LOCALES.find((l) => l.code === locale)!;
  const meta = PRODUCT_META[data.bottle.productId] ?? PRODUCT_META.atomes_crochus_1y;

  const immMonth = monthIdxOf(data.aging.immersion, 0);
  const retMonth = monthIdxOf(data.aging.retrieval, 11);
  const year = data.aging.immersion ? data.aging.immersion.slice(0, 4) : String(new Date().getFullYear());

  const monthSeason = (m: number) => `${copy.months[m]} ${copy.seasons[seasonOf(m)]}`;

  /* 히어로 수온 곡선 좌표 */
  const curve = useMemo(() => {
    const temps = data.monthlyTemps;
    const xs = temps.map((_, i) => 14 + (i * 314) / 11);
    const known = temps.filter((t): t is number => t !== null);
    const min = known.length ? Math.min(...known) - 0.8 : 6;
    const max = known.length ? Math.max(...known) + 0.8 : 17;
    const range = Math.max(max - min, 1);
    const ys = temps.map((t) => (t === null ? null : 30 + ((max - t) / range) * 230));

    const measured: { x: number; y: number; m: number; t: number }[] = [];
    temps.forEach((t, i) => {
      if (t !== null && ys[i] !== null) measured.push({ x: xs[i], y: ys[i] as number, m: i, t });
    });

    let cur = data.currentMonthIndex;
    while (cur > 0 && temps[cur] === null) cur -= 1;
    const curPt = measured.find((p) => p.m === cur) ?? measured[measured.length - 1] ?? { x: 14, y: 100, m: 0, t: 0 };

    /* 곡선 파라미터 → 호길이 % LUT (pathLength=100 정규화 기준). 실선이 포인트 위치에서 정확히 끝나게 */
    const cum: number[] = [0];
    let total = 0;
    if (measured.length > 1) {
      let prev: CurvePt = measured[0];
      for (let i = 0; i < measured.length - 1; i += 1) {
        for (let s = 1; s <= CURVE_SAMPLES; s += 1) {
          const q = evalSmooth(measured, i, s / CURVE_SAMPLES);
          total += Math.hypot(q.x - prev.x, q.y - prev.y);
          cum.push(total);
          prev = q;
        }
      }
    }
    const pct = cum.map((v) => (total > 0 ? (v / total) * 100 : 0));
    const curIdx = Math.max(0, measured.findIndex((p) => p.m === curPt.m));
    const curPct = pct.length ? pct[Math.min(pct.length - 1, curIdx * CURVE_SAMPLES)] : 0;

    const pathD = smoothPathD(measured);
    const first = measured[0];
    const last = measured[measured.length - 1];
    return {
      pathD,
      /* 지나온 구간 면적 채움용 닫힌 경로 (x 클립으로 포인트까지만 드러남) */
      areaD: pathD && first && last ? `${pathD} L ${last.x.toFixed(1)} 290 L ${first.x.toFixed(1)} 290 Z` : "",
      measured,
      curIdx,
      curPt,
      pct,
      curPct,
    };
  }, [data.monthlyTemps, data.currentMonthIndex]);

  /* 칩 라벨 함수 — 로케일 바뀌어도 스크럽 트리거 재생성 없이 참조로 갱신 */
  useEffect(() => {
    labelFnRef.current = (m: number, t: number | null) =>
      t !== null ? `${monthSeason(m)} · ${t.toFixed(1)}°C` : monthSeason(m);
    // 현재 칩 텍스트도 즉시 갱신
    if (chipRef.current) {
      const mAttr = chipRef.current.dataset.month;
      const tAttr = chipRef.current.dataset.temp;
      if (mAttr !== undefined) {
        chipRef.current.textContent = labelFnRef.current(Number(mAttr), tAttr ? Number(tAttr) : null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  /* S3 스케일 (390px 고정 지오메트리 → 좁은 화면 축소) */
  useEffect(() => {
    const el = flowSectionRef.current;
    if (!el) return;
    const update = () => setFlowScale(Math.min(1, el.clientWidth / 390));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* IO 리빌 (컨테이너에 revealIn 부여 → 자식 stagger는 CSS가 담당) */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.revealIn);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const stationValues: Record<MetricKey, StationValue> = useMemo(
    () => ({
      temp: { num: data.averages.temp, decimals: 1, unit: "°C" },
      salinity: { num: data.averages.salinity, decimals: 1, unit: " psu" },
      tide: { num: data.averages.tide, decimals: 0, unit: " cm" },
      current: { num: data.averages.current, decimals: 2, unit: " m/s" },
      pressure: { num: data.averages.pressure, decimals: 1, unit: " atm" },
      tidal: { num: data.averages.tidal, decimals: 0, unit: " cm/s" },
      wave: { num: data.averages.wave, decimals: 1, unit: " m" },
      period: { num: data.averages.period, decimals: 1, unit: " s" },
    }),
    [data.averages]
  );

  const fmtStation = (v: StationValue) => (v.num === null ? "—" : `${v.num.toFixed(v.decimals)}${v.unit}`);

  const serialTotal = meta.quantity;
  const serial = data.bottle.serial;

  /* ── GSAP 스크럽 모션 (Motion Spec v2) ───────────────────────────── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      /* 인트로: 병 번호 카운트업 N° 0 → serial (mono · 0.8s) */
      if (serial !== null && heroSerialRef.current) {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: serial,
          duration: 0.8,
          delay: 0.5,
          ease: "power1.out",
          onUpdate: () => {
            if (heroSerialRef.current) heroSerialRef.current.textContent = `N° ${Math.round(obj.v)} / ${serialTotal}`;
          },
        });
      }

      /* S1 핀 스크럽: 발광 포인트가 곡선 위를 이동, 지나온 구간은 실선으로 채워지고 칩 갱신 */
      if (heroRef.current && heroPinWrapRef.current && pointRef.current && curve.measured.length > 1) {
        const pts = curve.measured;
        const lut = curve.pct;
        const pctAt = (p: number) => {
          if (!lut.length) return 0;
          const j = Math.max(0, Math.min(lut.length - 1, p * CURVE_SAMPLES));
          const j0 = Math.floor(j);
          const j1 = Math.min(lut.length - 1, j0 + 1);
          return lut[j0] + (lut[j1] - lut[j0]) * (j - j0);
        };
        const state = { p: 0 };
        const apply = (pFloat: number) => {
          const i = Math.max(0, Math.min(pts.length - 1, pFloat));
          const i0 = Math.floor(i);
          const i1 = Math.min(pts.length - 1, i0 + 1);
          const f = i - i0;
          const pos = evalSmooth(pts, i0, f);
          pointRef.current!.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
          const reveal = `${100 - pctAt(i)}`;
          if (solidRef.current) solidRef.current.style.strokeDashoffset = reveal;
          if (glowRef.current) glowRef.current.style.strokeDashoffset = reveal;
          if (areaClipRef.current) areaClipRef.current.setAttribute("width", `${pos.x}`);
          if (dropRef.current) {
            dropRef.current.setAttribute("x1", `${pos.x}`);
            dropRef.current.setAttribute("x2", `${pos.x}`);
            dropRef.current.setAttribute("y1", `${pos.y}`);
          }
          const near = f < 0.5 ? pts[i0] : pts[i1];
          if (chipRef.current) {
            const chip = chipRef.current;
            chip.textContent = labelFnRef.current(near.m, near.t);
            chip.dataset.month = String(near.m);
            chip.dataset.temp = String(near.t);
            /* 곡선 끝(11~12월)에서 칩이 프레임 밖으로 잘리지 않게 px로 클램프 */
            const ww = chip.parentElement?.clientWidth ?? 342;
            const cw = chip.offsetWidth;
            const px = Math.max(0, Math.min(ww - cw, (pos.x / 342) * ww - 14));
            chip.style.transform = "none";
            chip.style.left = `${px}px`;
            chip.style.top = `${Math.max(0, ((pos.y - 55) / 290) * 100)}%`;
          }
        };
        apply(0);

        // fromTo로 시작값(1월)을 명시 — 연 전체(입수→인양)를 스크럽으로 여행
        gsap.fromTo(state, { p: 0 }, {
          p: pts.length - 1,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            pin: heroRef.current,
            pinSpacer: heroPinWrapRef.current, // 사전 배치 래퍼 — CSS 인트로 재시작 방지
            start: "top top",
            end: "+=120%",
            scrub: 0.6,
          },
          onUpdate: () => apply(state.p),
        });
      }

      /* S3: 8줄기 스크럽 성장 (stroke-dashoffset) + 금색 줄기 선단이 지나는 스테이션 앰버 점등 */
      if (flowSvgRef.current && flowSectionRef.current) {
        const paths = Array.from(flowSvgRef.current.querySelectorAll("path"));
        paths.forEach((p) => {
          const len = p.getTotalLength();
          p.style.strokeDasharray = `${len}`;
          p.style.strokeDashoffset = `${len}`;
        });
        const amberPath = paths[paths.length - 1]; // FLOW_PATHS 마지막이 수온(앰버)
        const amberLen = amberPath ? amberPath.getTotalLength() : 0;
        const stations = Array.from(flowSectionRef.current.querySelectorAll<HTMLElement>("[data-stop]"));
        gsap.to(paths, {
          strokeDashoffset: 0,
          ease: "none",
          stagger: 0.04,
          scrollTrigger: {
            trigger: flowSectionRef.current,
            start: "top 65%",
            end: "bottom 95%",
            scrub: 0.8,
          },
          onUpdate: () => {
            if (!amberPath || !amberLen) return;
            const off = parseFloat(amberPath.style.strokeDashoffset || `${amberLen}`);
            const drawn = Math.max(0, Math.min(amberLen, amberLen - off));
            const tip = amberPath.getPointAtLength(drawn);
            const flowY = 90 + tip.y; // SVG는 flow 컨테이너 top 90px에서 시작
            stations.forEach((el) => {
              const top = Number(el.dataset.stop);
              const lit = drawn > 1 && flowY >= top - 30 && flowY <= top + 110;
              el.classList.toggle(styles.stationLit, lit);
            });
          },
        });
      }

      /* S3: 연평균 카운트업 (1.5s, 눈금 통과 시 1회) */
      if (flowSectionRef.current) {
        const stationEls = flowSectionRef.current.querySelectorAll<HTMLElement>("[data-count]");
        stationEls.forEach((el) => {
          const target = Number(el.dataset.count);
          const decimals = Number(el.dataset.decimals ?? 0);
          const unit = el.dataset.unit ?? "";
          if (!Number.isFinite(target)) return;
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onUpdate: () => {
              el.textContent = `${obj.v.toFixed(decimals)}${unit}`;
            },
          });
        });
      }

      /* S4: 수렴 스크럽 + 완료 시 점 등장 */
      if (convergeSvgRef.current) {
        const paths = Array.from(convergeSvgRef.current.querySelectorAll("path, line")) as (SVGPathElement | SVGLineElement)[];
        paths.forEach((p) => {
          const len = "getTotalLength" in p ? p.getTotalLength() : 100;
          p.style.strokeDasharray = `${len}`;
          p.style.strokeDashoffset = `${len}`;
        });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: convergeSvgRef.current,
            start: "top 80%",
            end: "center 45%",
            scrub: 0.6,
          },
        });
        tl.to(paths.slice(0, 8), { strokeDashoffset: 0, ease: "none", stagger: 0.03 });
        tl.to(paths[8], { strokeDashoffset: 0, ease: "none", duration: 0.4 }, ">-0.1");
        if (convergeDotRef.current) {
          gsap.set(convergeDotRef.current, { opacity: 0, scale: 0.6, transformOrigin: "center" });
          gsap.to(convergeDotRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "back.out(2)",
            scrollTrigger: { trigger: convergeSvgRef.current, start: "center 50%", once: true },
          });
        }
      }

      /* S5: N° 카운트업 (0.8s) */
      if (serial !== null && bottleSerialRef.current) {
        const el = bottleSerialRef.current;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: serial,
          duration: 0.8,
          ease: "power1.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = `N° ${Math.round(obj.v)} / ${serialTotal}`;
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curve, serial, serialTotal]);

  const serialLine = serial !== null ? `N° ${serial} / ${serialTotal}` : null;
  const chipLabel = curve.curPt ? `${monthSeason(curve.curPt.m)} · ${curve.curPt.t.toFixed(1)}°C` : "";

  return (
    <main className={styles.page} ref={rootRef}>
      <div className={styles.frame}>
        {/* ── S1 수온의 1년 (핀 래퍼 사전 배치) ── */}
        <div ref={heroPinWrapRef}>
          <section className={styles.hero} ref={heroRef}>
            <div className={styles.langWrap}>
              <button type="button" className={styles.langBtn} onClick={() => setLangOpen((v) => !v)} aria-expanded={langOpen} aria-label="Language">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeLocale.flag} alt="" className={styles.flagImg} />
                <span>{activeLocale.short}</span>
                <svg width="7" height="5" viewBox="0 0 7 5" aria-hidden>
                  <polyline points="1,1 3.5,4 6,1" fill="none" stroke="rgba(241,239,235,0.55)" strokeWidth="1" />
                </svg>
              </button>
              {langOpen && (
                <div className={styles.langPanel} role="listbox">
                  {BOTTLE_LOCALES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      role="option"
                      aria-selected={l.code === locale}
                      className={`${styles.langOpt} ${l.code === locale ? styles.langOptActive : ""}`}
                      onClick={() => {
                        setLocale(l.code);
                        setLangOpen(false);
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={l.flag} alt="" className={styles.flagImg} />
                      <span className={styles.langOptCode}>{l.short}</span>
                      <span>{l.native}</span>
                      {l.code === locale && (
                        <svg className={styles.langCheck} width="9" height="7" viewBox="0 0 9 7" aria-hidden>
                          <polyline points="1,3.5 3.5,6 8,1" fill="none" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`${styles.verified} ${styles.introFade}`}>
              <span className={styles.liveDot} />
              <span>{copy.verified}</span>
            </div>

            <div className={styles.heroSpacerLg} />

            {serialLine && (
              <div ref={heroSerialRef} className={`${styles.serial} ${styles.introFade} ${styles.introFadeD1}`}>
                {serialLine}
              </div>
            )}

            <div className={`${styles.titleZone} ${styles.introFade} ${styles.introFadeD2}`}>
              {locale === "ko" ? (
                <Image src="/images/b-title-ko-v2.png" alt={copy.titleText} width={317} height={32} className={styles.titleImg} priority />
              ) : (
                <h1 className={styles.titleText}>{copy.titleText}</h1>
              )}
              <p className={styles.subLabel}>{copy.subLabel.replace("{year}", year)}</p>
            </div>

            <div className={styles.heroSpacerSm} />

            <div className={`${styles.heroCurveWrap} ${styles.introFade} ${styles.introFadeD3}`}>
              <svg className={styles.heroCurve} viewBox="0 0 342 290" aria-hidden>
                <defs>
                  <filter id="bCurveGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2.4" />
                  </filter>
                  <linearGradient id="bAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F1EFEB" stopOpacity="0.16" />
                    <stop offset="55%" stopColor="#F1EFEB" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#F1EFEB" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="bAreaClip">
                    <rect ref={areaClipRef} x="0" y="0" width={curve.curPt.x} height="290" />
                  </clipPath>
                </defs>
                {curve.pathD && (
                  <path
                    className={styles.drawPath}
                    d={curve.pathD}
                    fill="none"
                    stroke="rgba(241,239,235,0.55)"
                    strokeWidth="1.2"
                    strokeDasharray="2 5"
                  />
                )}
                {curve.areaD && <path d={curve.areaD} fill="url(#bAreaGrad)" clipPath="url(#bAreaClip)" />}
                <line
                  ref={dropRef}
                  x1={curve.curPt.x}
                  y1={curve.curPt.y}
                  x2={curve.curPt.x}
                  y2="290"
                  stroke="rgba(241,239,235,0.22)"
                  strokeWidth="0.6"
                />
                {/* 지나온 구간 — 점선 위에 실선(발광)이 포인트까지만 드러남 */}
                {curve.pathD && (
                  <>
                    <path
                      ref={glowRef}
                      d={curve.pathD}
                      pathLength={100}
                      fill="none"
                      stroke="rgba(241,239,235,0.5)"
                      strokeWidth="3.2"
                      filter="url(#bCurveGlow)"
                      strokeDasharray="100"
                      strokeDashoffset={100 - curve.curPct}
                    />
                    <path
                      ref={solidRef}
                      d={curve.pathD}
                      pathLength={100}
                      fill="none"
                      stroke="rgba(241,239,235,0.95)"
                      strokeWidth="1.6"
                      strokeDasharray="100"
                      strokeDashoffset={100 - curve.curPct}
                    />
                  </>
                )}
                <g ref={pointRef} transform={`translate(${curve.curPt.x}, ${curve.curPt.y})`}>
                  <circle r="14" fill="rgba(241,239,235,0.06)" />
                  <circle r="8" fill="rgba(241,239,235,0.16)" />
                  <circle r="3.5" fill="#F1EFEB" className={styles.glowDot} />
                </g>
              </svg>
              <div
                ref={chipRef}
                className={styles.tempChip}
                data-month={curve.curPt.m}
                data-temp={curve.curPt.t}
                style={{ left: `${(curve.curPt.x / 342) * 100}%`, top: `${Math.max(0, ((curve.curPt.y - 55) / 290) * 100)}%` }}
              >
                {chipLabel}
              </div>
            </div>
            <div className={styles.heroAxis}>
              <span>{`${monthSeason(immMonth)} · ${copy.immersion}`}</span>
              <span>{`${monthSeason(retMonth)} · ${copy.retrieval}${data.aging.retrieved ? "" : ` ${copy.planned}`}`}</span>
            </div>
          </section>
        </div>

        {/* ── S2 여정 (점 4개 순차 점등 stagger 0.15s — CSS) ── */}
        <section className={styles.journey}>
          <div className={styles.journeyStrip} data-reveal>
            <div className={styles.journeyLine} />
            <div className={styles.stops}>
              <div className={styles.stop}>
                <span className={styles.stopDot} />
                <span className={styles.stopText}>
                  <span className={styles.stopName}>{copy.journey.origin}</span>
                  <span className={styles.stopSub}>{copy.journey.originSub}</span>
                </span>
              </div>
              <div className={styles.stop}>
                <span className={styles.stopDot} />
                <span className={styles.stopText}>
                  <span className={styles.stopName}>{copy.journey.aging}</span>
                  <span className={styles.stopSub}>{copy.journey.agingSub}</span>
                </span>
              </div>
              <div className={styles.stop}>
                <span className={styles.stopDotAmber} />
                <span className={styles.stopText}>
                  <span className={`${styles.stopName} ${styles.stopNameOn}`}>{copy.immersion}</span>
                  <span className={`${styles.stopSub} ${styles.stopSubAmber}`}>{monthSeason(immMonth)}</span>
                </span>
              </div>
              <div className={styles.stop}>
                <span className={styles.stopDotAmber} />
                <span className={styles.stopText}>
                  <span className={`${styles.stopName} ${styles.stopNameOn}`}>{copy.retrieval}</span>
                  <span className={`${styles.stopSub} ${styles.stopSubAmber}`}>{monthSeason(retMonth)}</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── S3 여덟 줄기의 하강 (스크럽 성장) ── */}
        <section className={styles.flowSection} ref={flowSectionRef}>
          <div className={styles.flowScaler} style={{ transform: `scale(${flowScale})`, height: 1380 * flowScale }}>
            <div className={styles.flow}>
              <span className={styles.flowHead}>{data.partial ? copy.obsHeadPartial : copy.obsHead}</span>

              <svg ref={flowSvgRef} className={styles.flowSvg} width="390" height="1290" viewBox="0 0 390 1290" aria-hidden>
                {FLOW_PATHS.map((p, i) => (
                  <path key={i} d={p.d} fill="none" stroke={p.stroke} strokeWidth={p.width} opacity={p.amber ? 0.95 : 1} />
                ))}
              </svg>

              {/* 계절 눈금 (시문 삭제됨, 2026-07-17) */}
              <span className={`${styles.seasonLabel} ${styles.seasonLabelOn}`} style={{ top: 84 }}>{`${copy.months[0]} ${copy.seasons.winter}`}</span>
              <span className={styles.seasonLabel} style={{ top: 384 }}>{`${copy.months[3]} ${copy.seasons.spring}`}</span>
              <span className={styles.seasonLabel} style={{ top: 684 }}>{`${copy.months[6]} ${copy.seasons.summer}`}</span>
              <span className={styles.seasonLabel} style={{ top: 984 }}>{`${copy.months[9]} ${copy.seasons.autumn}`}</span>
              <span className={`${styles.seasonLabel} ${styles.seasonLabelOn}`} style={{ top: 1284 }}>{`${copy.months[11]} ${copy.seasons.winter}`}</span>

              {(Object.keys(STATION_TOPS) as MetricKey[]).map((key) => {
                const v = stationValues[key];
                return (
                  <span key={`st-${key}`} className={styles.station} style={{ top: STATION_TOPS[key] }} data-stop={STATION_TOPS[key]}>
                    <span className={styles.stationLabel}>{copy.metrics[key]}</span>
                    <span
                      className={styles.stationValue}
                      {...(v.num !== null ? { "data-count": v.num, "data-decimals": v.decimals, "data-unit": v.unit } : {})}
                    >
                      {fmtStation(v)}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── S4 수렴 (스크럽 드로잉 + 점 등장) ── */}
        <section className={styles.converge}>
          <svg ref={convergeSvgRef} className={styles.convergeSvg} viewBox="0 0 390 320" aria-hidden>
            {CONVERGE_XS.map((x, i) => (
              <path
                key={i}
                d={`M ${x} 0 C ${x} 80, 195 140, 195 200`}
                fill="none"
                stroke={CONVERGE_STYLE[i].stroke}
                strokeWidth={CONVERGE_STYLE[i].width}
                opacity={i === 0 ? 0.95 : 1}
              />
            ))}
            <line x1="195" y1="200" x2="195" y2="268" stroke="rgba(241,239,235,0.75)" strokeWidth="1" />
            <g ref={convergeDotRef}>
              <circle cx="195" cy="278" r="13" fill="rgba(204,173,123,0.08)" />
              <circle cx="195" cy="278" r="7" fill="rgba(204,173,123,0.2)" />
              <circle cx="195" cy="278" r="3.5" fill="#CCAD7B" className={styles.glowDot} />
            </g>
          </svg>
          <p className={`${styles.convergeText} ${styles.reveal}`} data-reveal>
            {data.partial ? copy.converging : copy.converged}
          </p>
        </section>

        {/* ── S5 개체 선언 (N° 카운트업 + 여권 순차 리빌) ── */}
        <section className={styles.bottleSection}>
          <div className={styles.reveal} data-reveal>
            <Image src={meta.image} alt={meta.name} width={342} height={274} className={styles.bottlePhoto} />
          </div>
          {serialLine && (
            <p ref={bottleSerialRef} className={styles.bottleSerial}>
              {serialLine}
            </p>
          )}
          <h2 className={styles.bottleName}>{meta.name}</h2>
          <div className={styles.passport} data-reveal>
            <div className={styles.passportRow}>
              <span className={styles.passportLabel}>{copy.passport.maison}</span>
              <span className={styles.passportValue}>{MAISON_NAME}</span>
            </div>
            {meta.cepage && (
              <div className={styles.passportRow}>
                <span className={styles.passportLabel}>{copy.passport.cepage}</span>
                <span className={styles.passportValue}>{meta.cepage}</span>
              </div>
            )}
            {meta.style && (
              <div className={styles.passportRow}>
                <span className={styles.passportLabel}>{copy.passport.style}</span>
                <span className={styles.passportValue}>{meta.style}</span>
              </div>
            )}
          </div>
        </section>

        {/* ── S6 명부 ── */}
        <section className={styles.registre}>
          <p className={`${styles.gating} ${styles.reveal}`} data-reveal>{copy.gating}</p>
          <a href="https://musedemaree.com/#ocean-circle" className={styles.ctaBtn}>
            {serial !== null ? copy.cta.replace("{serial}", String(serial)) : copy.ctaNoSerial}
          </a>
          <p className={styles.ctaSub}>{copy.ctaSub}</p>
        </section>

        {/* ── 푸터 ── */}
        <footer className={styles.footer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo/logo_text_trans_W.png" alt="Muse de Marée" className={styles.footerLogo} />
          <p className={styles.footerTagline}>{copy.footerTagline}</p>
          <div className={styles.footerLinks}>
            <a href="https://musedemaree.com" className={styles.footerLinkRow}>
              <span className={styles.footerLinkLabel}>HOME</span>
              <span className={styles.footerLinkUrl}>musedemaree.com →</span>
            </a>
            <a href="https://blog.musedemaree.com" className={styles.footerLinkRow}>
              <span className={styles.footerLinkLabel}>JOURNAL</span>
              <span className={styles.footerLinkUrl}>blog.musedemaree.com →</span>
            </a>
          </div>
          <div className={styles.footerBase}>
            <span>© {year} MUSE DE MARÉE</span>
            <span>ORKNEY CORP. · KOREA</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
