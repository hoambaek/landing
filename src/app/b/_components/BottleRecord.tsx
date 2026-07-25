"use client";

/**
 * /b 병 기록 페이지 — Paper "NFC 병 페이지 v2 — 여덟 줄기의 수렴" 시안 구현.
 * S1 병사진 히어로 → S2 여정(depth profile) → S3 여덟 줄기 하강 → S4 수렴 →
 * S5 개체 선언 + 원산지/해저 2개 표 → S6 뉴스레터 → 푸터(언어 선택 포함).
 * 표기 규칙: 입수·인양은 월·계절만(날짜·일수 금지), 좌표는 도 단위. 용어는 "입수".
 * 모션: S3 8줄기 스크럽 성장 + 연평균 카운트업, S4 수렴 스크럽, S5 N° 카운트업.
 */

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./bottle.module.css";
import {
  BOTTLE_COPY,
  BOTTLE_LOCALES,
  MAISON_NAME,
  PRODUCT_META,
  RECORD_EXTRA,
  PROVENANCE,
  type BottleLocale,
} from "../_lib/copy";
import type { BottleRecordData } from "../_lib/data";
import { submitNewsletter } from "@/lib/forms";

gsap.registerPlugin(ScrollTrigger);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

interface StationValue { num: number | null; decimals: number; unit: string }

export default function BottleRecord({ data }: { data: BottleRecordData }) {
  const [locale, setLocale] = useState<BottleLocale>("ko");
  const [langOpen, setLangOpen] = useState(false);
  const [flowScale, setFlowScale] = useState(1);
  const [journeyScale, setJourneyScale] = useState(1);
  const [nlOpen, setNlOpen] = useState(false);
  const [nlEmail, setNlEmail] = useState("");
  const [nlStatus, setNlStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [nlErr, setNlErr] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const heroSerialRef = useRef<HTMLDivElement>(null);
  const journeySectionRef = useRef<HTMLElement>(null);
  const flowSectionRef = useRef<HTMLElement>(null);
  const flowSvgRef = useRef<SVGSVGElement>(null);
  const convergeSvgRef = useRef<SVGSVGElement>(null);
  const convergeDotRef = useRef<SVGGElement>(null);
  const bottleSerialRef = useRef<HTMLParagraphElement>(null);

  const copy = BOTTLE_COPY[locale];
  const extra = RECORD_EXTRA[locale];
  const activeLocale = BOTTLE_LOCALES.find((l) => l.code === locale)!;
  const meta = PRODUCT_META[data.bottle.productId] ?? PRODUCT_META.atomes_crochus_1y;
  const prov = PROVENANCE[data.bottle.productId];

  const immMonth = monthIdxOf(data.aging.immersion, 0);
  const retMonth = monthIdxOf(data.aging.retrieval, 11);
  const year = data.aging.immersion ? data.aging.immersion.slice(0, 4) : String(new Date().getFullYear());

  const monthSeason = (m: number) => `${copy.months[m]} ${copy.seasons[seasonOf(m)]}`;

  const serialTotal = meta.quantity;
  const serial = data.bottle.serial;
  const serialLine = serial !== null ? `N° ${serial} / ${serialTotal}` : null;

  /* 숙성 기간(년) — 입수·인양 연도 차 */
  const durationYears = useMemo(() => {
    const i = data.aging.immersion;
    const r = data.aging.retrieval;
    if (i && r) return Math.max(1, Number(r.slice(0, 4)) - Number(i.slice(0, 4)));
    return 1;
  }, [data.aging.immersion, data.aging.retrieval]);

  const fmtYears = (n: number) => {
    if (locale === "en") return `${n} yr`;
    if (locale === "fr") return `${n} an${n > 1 ? "s" : ""}`;
    return `${n}${locale === "ja" || locale === "zh" ? "年" : "년"}`;
  };

  const seaWhen = (date: string | null, fallback: number) => {
    const m = monthIdxOf(date, fallback);
    const y = date ? date.slice(0, 4) : year;
    const mo = copy.months[m];
    const se = copy.seasons[seasonOf(m)];
    if (locale === "ko") return `${y}년 ${mo}, ${se}`;
    if (locale === "ja" || locale === "zh") return `${y}年 ${mo}, ${se}`;
    return `${mo} ${y} · ${se}`;
  };

  /* 원산지 표 행 — 확정 정보만. PROVENANCE 없으면 메타에서 가능한 항목만. */
  const provRows: { label: string; value: string }[] = prov
    ? [
        { label: extra.provLabels.maison, value: prov.maison },
        { label: extra.provLabels.region, value: prov.region },
        { label: extra.provLabels.cepage, value: prov.cepage },
        { label: extra.provLabels.style, value: prov.style },
        { label: extra.provLabels.elevage, value: prov.elevage[locale] },
      ]
    : [
        { label: extra.provLabels.maison, value: `Champagne ${MAISON_NAME}` },
        ...(meta.cepage ? [{ label: extra.provLabels.cepage, value: meta.cepage }] : []),
        ...(meta.style ? [{ label: extra.provLabels.style, value: meta.style }] : []),
      ];

  /* 해저 숙성 표 행 — 데이터 기반(입수·인양 계절, 수심). */
  const seaRows: { label: string; value: string }[] = [
    { label: extra.seaLabels.immersion, value: seaWhen(data.aging.immersion, immMonth) },
    {
      label: extra.seaLabels.retrieval,
      value: seaWhen(data.aging.retrieval, retMonth) + (data.aging.retrieved ? "" : ` (${copy.planned})`),
    },
    { label: extra.seaLabels.duration, value: fmtYears(durationYears) },
    { label: extra.seaLabels.depth, value: `${data.aging.depth} m` },
    { label: extra.seaLabels.location, value: `${extra.wando} · 34°N 126°E` },
  ];

  /* S3 스케일 (390px 고정 지오메트리 → 좁은 화면 축소) */
  useEffect(() => {
    const el = flowSectionRef.current;
    if (!el) return;
    const update = () => setFlowScale(Math.min(1, el.clientWidth / 390));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* S2 여정 스케일 (342px 고정 지오메트리 → 좁은 화면 축소) */
  useEffect(() => {
    const el = journeySectionRef.current;
    if (!el) return;
    const update = () => {
      const inner = el.clientWidth - 48; // 좌우 padding 24
      setJourneyScale(Math.min(1, inner / 342));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* IO 리빌 */
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

  async function onSubscribe(e: FormEvent) {
    e.preventDefault();
    if (nlStatus === "submitting") return;
    const em = nlEmail.trim();
    if (!EMAIL_RE.test(em)) {
      setNlErr(extra.newsletterErr);
      return;
    }
    setNlErr(null);
    setNlStatus("submitting");
    try {
      const res = await submitNewsletter({ email: em, locale, source: "bottle_record" });
      if (res.ok) {
        setNlStatus("done");
      } else {
        setNlErr(res.error ?? extra.newsletterErr);
        setNlStatus("idle");
      }
    } catch {
      setNlErr(extra.newsletterErr);
      setNlStatus("idle");
    }
  }

  /* ── GSAP 스크럽 모션 (S3 8줄기 · S4 수렴 · S5 N° 카운트업) ─────────── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      /* 히어로 N° 카운트업 (0 → serial, 1.4s) */
      if (serial !== null && heroSerialRef.current) {
        heroSerialRef.current.textContent = `N° 0 / ${serialTotal}`;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: serial,
          duration: 1.4,
          delay: 0.6,
          ease: "power2.out",
          onUpdate: () => {
            if (heroSerialRef.current) heroSerialRef.current.textContent = `N° ${Math.round(obj.v)} / ${serialTotal}`;
          },
        });
      }

      /* S2 여정 곡선 드로잉 — 뷰 진입 시 선이 그려지고 점이 순차 등장 */
      if (journeySectionRef.current) {
        const jsvg = journeySectionRef.current.querySelector("svg");
        if (jsvg) {
          const jpaths = Array.from(jsvg.querySelectorAll("path"));
          jpaths.forEach((p) => {
            const len = p.getTotalLength();
            p.style.strokeDasharray = `${len}`;
            p.style.strokeDashoffset = `${len}`;
          });
          const jcircles = Array.from(jsvg.querySelectorAll("circle"));
          gsap.set(jcircles, { opacity: 0, transformOrigin: "center" });
          const jtl = gsap.timeline({
            scrollTrigger: { trigger: journeySectionRef.current, start: "top 78%", once: true },
          });
          jtl.to(jpaths, { strokeDashoffset: 0, duration: 1.0, ease: "power2.out", stagger: 0.14 });
          jtl.to(jcircles, { opacity: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.07 }, "-=0.55");
        }
      }

      /* S3: 8줄기 스크럽 성장 + 금색 줄기 선단이 지나는 스테이션 앰버 점등 */
      if (flowSvgRef.current && flowSectionRef.current) {
        const paths = Array.from(flowSvgRef.current.querySelectorAll("path"));
        paths.forEach((p) => {
          const len = p.getTotalLength();
          p.style.strokeDasharray = `${len}`;
          p.style.strokeDashoffset = `${len}`;
        });
        const amberPath = paths[paths.length - 1];
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
            const flowY = 90 + tip.y;
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
  }, [serial, serialTotal]);

  return (
    <main className={styles.page} ref={rootRef}>
      <div className={styles.frame}>
        {/* ── S1 병사진 히어로 ── */}
        <section className={styles.hero}>
          <Image
            src="/images/b-hero-bottle.webp"
            alt=""
            fill
            priority
            sizes="430px"
            className={styles.heroPhoto}
          />
          <div className={styles.heroScrim} />

          <div className={`${styles.heroStatus} ${styles.introFade} ${styles.introFadeD1}`}>
            <div className={styles.heroStatusId}>
              <span className={styles.heroStatusLabel}>YOUR OCEAN CELLAR RECORD</span>
            </div>
            <div className={styles.heroVerified}>
              <span className={styles.heroVerifiedDot} aria-hidden />
              <span>NFC VERIFIED</span>
            </div>
          </div>

          <div className={`${styles.heroContent} ${styles.introFade} ${styles.introFadeD1}`}>
            {serialLine && (
              <div ref={heroSerialRef} className={styles.serial}>
                {serialLine}
              </div>
            )}
            <div className={styles.titleZone}>
              {locale === "ko" ? (
                <Image src="/images/b-record-title-ko.png" alt={copy.titleText} width={266} height={32} className={styles.titleImg} priority />
              ) : (
                <h1 className={styles.titleText}>{copy.titleText}</h1>
              )}
              <p className={styles.subLabel}>{copy.subLabel.replace("{year}", year)}</p>
            </div>
          </div>
        </section>

        {/* ── S2 여정 (depth profile) ── */}
        <section className={styles.journey} ref={journeySectionRef}>
          <div
            className={styles.journeyScaler}
            style={{ transform: `scale(${journeyScale})`, height: 150 * journeyScale }}
            data-reveal
          >
            <div className={styles.journeyInner}>
              <svg className={styles.journeySvg} width="342" height="110" viewBox="0 0 342 110" aria-hidden>
                <defs>
                  <linearGradient id="bJourneyEmerge" gradientUnits="userSpaceOnUse" x1="333" y1="90" x2="333" y2="28">
                    <stop offset="0" stopColor="#CCAD7B" stopOpacity="0.92" />
                    <stop offset="1" stopColor="#CCAD7B" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="24" x2="342" y2="24" stroke="#F1EFEB" strokeWidth="0.5" strokeDasharray="1 5" opacity="0.16" />
                <line x1="0" y1="90" x2="342" y2="90" stroke="#CCAD7B" strokeWidth="0.5" strokeDasharray="1 5" opacity="0.22" />
                <text x="0" y="14" fontSize="8" fontFamily="IBM Plex Mono, monospace" letterSpacing="1" fill="rgba(241,239,235,0.4)">0m</text>
                <text x="0" y="105" fontSize="8" fontFamily="IBM Plex Mono, monospace" letterSpacing="1" fill="rgba(204,173,123,0.65)">30m</text>
                <path d="M 37 24 L 126 24 C 166 24 182 90 216 90" fill="none" stroke="rgba(241,239,235,0.68)" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M 216 90 L 305 90" fill="none" stroke="#CCAD7B" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 305 90 C 322 86 331 58 333 30" fill="none" stroke="url(#bJourneyEmerge)" strokeWidth="1.7" strokeLinecap="round" />
                <circle cx="37" cy="24" r="5" fill="#0E1A2B" stroke="rgba(241,239,235,0.85)" strokeWidth="1.4" />
                <circle cx="126" cy="24" r="5" fill="#0E1A2B" stroke="rgba(241,239,235,0.85)" strokeWidth="1.4" />
                <circle cx="216" cy="90" r="9" fill="rgba(204,173,123,0.14)" />
                <circle cx="216" cy="90" r="5.5" fill="#CCAD7B" />
                <circle cx="305" cy="90" r="9" fill="rgba(204,173,123,0.14)" />
                <circle cx="305" cy="90" r="5.5" fill="#CCAD7B" />
              </svg>
              <div className={styles.jStop} style={{ left: 0, top: 40 }}>
                <span className={styles.jName}>{copy.journey.origin}</span>
                <span className={styles.jSub}>{copy.journey.originSub}</span>
              </div>
              <div className={styles.jStop} style={{ left: 89, top: 40 }}>
                <span className={styles.jName}>{copy.journey.aging}</span>
                <span className={styles.jSub}>{copy.journey.agingSub}</span>
              </div>
              <div className={styles.jStop} style={{ left: 179, top: 106 }}>
                <span className={`${styles.jName} ${styles.jNameOn}`}>{copy.immersion}</span>
                <span className={`${styles.jSub} ${styles.jSubAmber}`}>{monthSeason(immMonth)}</span>
              </div>
              <div className={styles.jStop} style={{ left: 268, top: 106 }}>
                <span className={`${styles.jName} ${styles.jNameOn}`}>{copy.retrieval}</span>
                <span className={`${styles.jSub} ${styles.jSubAmber}`}>{monthSeason(retMonth)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Eight Currents 인트로 ── */}
        <section className={styles.ecIntro}>
          <div className={styles.reveal} data-reveal>
            <span className={styles.ecEyebrow}>{extra.ecEyebrow}</span>
            <h2 className={styles.ecTitle}>{extra.ecTitle}</h2>
            <p className={styles.ecBody}>{extra.ecBody}</p>
            <div className={styles.ecLegend}>
              <span className={styles.ecLegendLine} aria-hidden />
              <span className={styles.ecLegendText}>{extra.ecLegend}</span>
            </div>
          </div>
        </section>

        {/* ── S3 여덟 줄기의 하강 (스크럽 성장) ── */}
        <section className={styles.flowSection} ref={flowSectionRef}>
          <div className={styles.flowScaler} style={{ transform: `scale(${flowScale})`, height: 1380 * flowScale }}>
            <div className={styles.flow}>
              <svg ref={flowSvgRef} className={styles.flowSvg} width="390" height="1290" viewBox="0 0 390 1290" aria-hidden>
                {FLOW_PATHS.map((p, i) => (
                  <path key={i} d={p.d} fill="none" stroke={p.stroke} strokeWidth={p.width} opacity={p.amber ? 0.95 : 1} />
                ))}
              </svg>

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

        {/* ── S5 개체 선언 + 원산지/해저 표 ── */}
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

          <div className={styles.tables} data-reveal>
            <div className={styles.tableCaption}>
              <span className={styles.tableDot} />
              <span>{extra.provHead}</span>
            </div>
            {provRows.map((r, i) => (
              <div key={`p-${i}`} className={`${styles.tableRow} ${i === provRows.length - 1 ? styles.tableRowLast : ""}`}>
                <span className={styles.tableLabel}>{r.label}</span>
                <span className={styles.tableValue}>{r.value}</span>
              </div>
            ))}

            <div className={`${styles.tableCaption} ${styles.tableCaptionGap}`}>
              <span className={styles.tableDot} />
              <span>{extra.seaHead}</span>
            </div>
            {seaRows.map((r, i) => (
              <div key={`s-${i}`} className={`${styles.tableRow} ${i === seaRows.length - 1 ? styles.tableRowLast : ""}`}>
                <span className={styles.tableLabel}>{r.label}</span>
                <span className={styles.tableValue}>{r.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Owner Services · Digital Passport ── */}
        <section className={styles.passport}>
          <span className={styles.passportEyebrow}>DIGITAL PASSPORT</span>
          <h2 className={`${styles.passportTitle} ${styles.reveal}`} data-reveal>{extra.passportTitle}</h2>
          <p className={styles.passportBody}>{extra.passportBody}</p>
          <Link href={`/b/${data.bottle.nfcCode}/certificate`} className={styles.passportCta}>
            {extra.passportCta}  →
          </Link>
          <div className={styles.passportRow}>
            <Link href={`/b/${data.bottle.nfcCode}/certificate`} className={styles.passportSub}>
              {extra.passportSave}
            </Link>
            <Link href={`/b/${data.bottle.nfcCode}/owner`} className={styles.passportSub}>
              {extra.passportManage}
            </Link>
          </div>

          {/* 뉴스레터 — Paper: 텍스트 링크로 열어 인라인 폼 */}
          {nlStatus === "done" ? (
            <p className={styles.passportNewsDone}>{extra.newsletterDone}</p>
          ) : nlOpen ? (
            <form className={styles.passportNewsForm} onSubmit={onSubscribe} noValidate>
              <input
                type="email"
                className={styles.passportNewsInput}
                placeholder={extra.newsletterPlaceholder}
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                autoFocus
              />
              <button type="submit" className={styles.passportNewsSubmit} disabled={nlStatus === "submitting"}>
                {extra.newsletterConfirm}
              </button>
            </form>
          ) : (
            <button type="button" className={styles.passportNews} onClick={() => setNlOpen(true)}>
              <span>{extra.passportNews}</span>
              <span className={styles.passportNewsArrow} aria-hidden>→</span>
            </button>
          )}
          {nlErr && <p className={styles.newsletterErr}>{nlErr}</p>}
        </section>

        {/* ── 푸터 (컴팩트 · Paper 7AI-0) ── */}
        <footer className={styles.footer}>
          <div className={styles.footerTop}>
            <div className={styles.footerLogoRow}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo/logo_trans_W_lg.png" alt="" className={styles.footerSymbol} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo/logo_text_trans_W.png" alt="Muse de Marée" className={styles.footerWordmark} />
            </div>

            <div className={styles.footerLang}>
              <button
                type="button"
                className={styles.langBtn}
                onClick={() => setLangOpen((v) => !v)}
                aria-expanded={langOpen}
                aria-label="Language"
              >
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
          </div>

          <p className={styles.footerTagline}>{copy.footerTagline}</p>

          <div className={styles.footerCols}>
            <a href="https://musedemaree.com" className={styles.footerCol}>
              <span className={styles.footerColHead}>BRAND</span>
              <span className={styles.footerColRow}>
                <span>{extra.brandPage}</span>
                <span className={styles.footerArrow} aria-hidden>→</span>
              </span>
              <span className={styles.footerColUrl}>musedemaree.com</span>
            </a>
            <a href="https://blog.musedemaree.com" className={styles.footerCol}>
              <span className={styles.footerColHead}>JOURNAL</span>
              <span className={styles.footerColRow}>
                <span>{extra.blogPage}</span>
                <span className={styles.footerArrow} aria-hidden>→</span>
              </span>
              <span className={styles.footerColUrl}>blog.musedemaree.com</span>
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
