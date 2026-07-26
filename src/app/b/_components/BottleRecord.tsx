"use client";

/**
 * /b 병 기록 페이지 — Paper "NFC 병 페이지 v2 — 여덟 줄기의 수렴" 시안 구현.
 * S1 병사진 히어로 → S2 여정(depth profile) → S3 여덟 줄기 하강 → S4 수렴 →
 * S5 개체 선언 + 원산지/해저 2개 표 → S6 뉴스레터 → 푸터(언어 선택 포함).
 * 표기 규칙: 입수·인양은 월·계절만(날짜·일수 금지), 좌표는 도 단위. 용어는 "입수".
 * 모션: S3 8줄기 스크럽 성장 + 연평균 카운트업, S4 수렴 스크럽, S5 N° 카운트업.
 */

import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./bottle.module.css";
import BottleFooter from "./BottleFooter";
import {
  BOTTLE_COPY,
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

/* Paper 03 좌표 — SVG는 섹션 top 6px, 스테이션·계절 라벨은 아트보드 절대 좌표 그대로 */
const FLOW_SVG_TOP = 6;
const FLOW_HEIGHT = 1296;
const SEASON_TOPS = [18, 300, 600, 900, 1200];
const STATION_TOPS: Record<MetricKey, number> = {
  temp: 126, salinity: 266, tide: 406, current: 546, pressure: 696, tidal: 836, wave: 976, period: 1116,
};
/* 스테이션 라벨 접미 — 평균/최고/수심. data.ts 집계 방식과 일치해야 한다. */
const STATION_AGG: Record<MetricKey, "avg" | "max" | "depth"> = {
  temp: "avg", salinity: "avg", tide: "max", current: "avg", pressure: "depth", tidal: "avg", wave: "max", period: "avg",
};

interface StationValue { num: number | null; decimals: number; unit: string }

export default function BottleRecord({
  data,
  ownerName,
  initialLocale = "ko",
}: {
  data: BottleRecordData;
  ownerName?: string | null;
  initialLocale?: BottleLocale;
}) {
  /* 서버가 쿠키에서 읽어 넘긴 값으로 시작 — 앞 화면의 선택이 이어진다 */
  const [locale, setLocale] = useState<BottleLocale>(initialLocale);
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
  /* 병 사진은 IO가 아니라 수렴 점이 다 맺힌 뒤에 연다 (아래 renderConverge) */
  const bottlePhotoRef = useRef<HTMLDivElement>(null);
  const bottleSerialRef = useRef<HTMLParagraphElement>(null);

  const copy = BOTTLE_COPY[locale];
  const extra = RECORD_EXTRA[locale];
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

  const durationMonths = durationYears * 12;

  /* 스테이션 라벨 접미 — "12개월 평균" / "12개월 최고" / "수심 30M" */
  const aggSuffix = (key: MetricKey) => {
    const kind = STATION_AGG[key];
    if (kind === "depth") return extra.metricAgg.depth.replace("{d}", String(data.aging.depth));
    return extra.metricAgg[kind].replace("{n}", String(durationMonths));
  };

  /* 원산지 표 — Paper 03은 메종·지역·품종 3행. PROVENANCE 없으면 메타에서 가능한 항목만. */
  const provRows: { label: string; value: string }[] = prov
    ? [
        { label: extra.provLabels.maison, value: prov.maison },
        { label: extra.provLabels.region, value: prov.region },
        { label: extra.provLabels.cepage, value: prov.cepage },
      ]
    : [
        { label: extra.provLabels.maison, value: `Champagne ${MAISON_NAME}` },
        ...(meta.cepage ? [{ label: extra.provLabels.cepage, value: meta.cepage }] : []),
      ];

  /* 해저 숙성 표 — Paper 03은 숙성 기간·숙성 환경·위치 3행. 입수·인양 시점은 S2 여정이 담당. */
  const durationValue = extra.durationFmt
    .replace("{y}", year)
    .replace("{m1}", copy.months[immMonth])
    .replace("{m2}", copy.months[retMonth])
    .replace("{n}", String(durationMonths));

  const seaRows: { label: string; value: string }[] = [
    {
      label: extra.seaLabels.duration,
      value: durationValue,
    },
    {
      label: extra.seaLabels.environment,
      value: extra.envFmt.replace("{site}", extra.wando).replace("{d}", String(data.aging.depth)),
    },
    { label: extra.seaLabels.coords, value: "34°N 126°E" },
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

    /* gsap.context는 ticker 콜백을 되돌리지 않는다 — 직접 걷어낸다 */
    const tickers: Array<() => void> = [];

    const ctx = gsap.context(() => {
      /* 히어로 N° 카운트업 (0 → serial, 1.4s) */
      if (serial !== null && heroSerialRef.current) {
        heroSerialRef.current.textContent = `N° 0 / ${serialTotal}`;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: serial,
          duration: 2.0,
          delay: 0.55,
          ease: "expo.out",
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
          jtl.to(jpaths, { strokeDashoffset: 0, duration: 1.25, ease: "expo.out", stagger: 0.16 });
          /* 오버슈트 바운스는 장난감 톤 — 무게 있게 안착시킨다 */
          jtl.to(jcircles, { opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.08 }, "-=0.7");
        }
      }

      /* S3 금빛 줄기의 진행도 — S4 수렴이 이 값에 종속된다(아래 게이트 참조) */
      let amberPath: SVGPathElement | null = null;
      let amberLen = 0;
      const amberDrawn = () => {
        if (!amberPath || !amberLen) return 1;
        const off = parseFloat(amberPath.style.strokeDashoffset || `${amberLen}`);
        return Math.max(0, Math.min(1, (amberLen - off) / amberLen));
      };
      /* S4 블록에서 채운다. S3가 매 프레임 호출해 수렴선을 다시 눌러준다. */
      let gateConverge: (() => void) | null = null;

      /* S3: 8줄기 스크럽 성장 + 금색 줄기 선단이 지나는 스테이션 앰버 점등 */
      if (flowSvgRef.current && flowSectionRef.current) {
        const paths = Array.from(flowSvgRef.current.querySelectorAll("path"));
        paths.forEach((p) => {
          const len = p.getTotalLength();
          p.style.strokeDasharray = `${len}`;
          p.style.strokeDashoffset = `${len}`;
        });
        amberPath = paths[paths.length - 1];
        amberLen = amberPath ? amberPath.getTotalLength() : 0;
        const stations = Array.from(flowSectionRef.current.querySelectorAll<HTMLElement>("[data-stop]"));

        /* 관측값은 금빛 줄기가 "지나가며 쓴다" — 선단이 오기 전에는 0.
           별도 트리거로 먼저 세면 서사가 끊기므로 스크럽에 묶는다. */
        const WRITE_FROM = 40; // 선단이 스테이션 40px 위에 오면 쓰기 시작
        const WRITE_SPAN = 110; // 110px 지나는 동안 목표값까지
        const numOf = (el: HTMLElement) => el.querySelector<HTMLElement>("[data-count]");
        const paint = (num: HTMLElement, ratio: number) => {
          const target = Number(num.dataset.count);
          if (!Number.isFinite(target)) return;
          const decimals = Number(num.dataset.decimals ?? 0);
          const unit = num.dataset.unit ?? "";
          num.textContent = `${(target * ratio).toFixed(decimals)}${unit}`;
        };
        stations.forEach((el) => {
          const num = numOf(el);
          if (num) paint(num, 0);
        });

        const trigger = {
          trigger: flowSectionRef.current,
          start: "top 65%",
          end: "bottom 95%",
          scrub: 0.8,
        } as const;

        /* 회색 7줄 — 서로 시차를 두고 엮여 내려온다.
           duration을 늘려 겹침을 확보한 위에서 stagger를 줘야 "순번"이 아닌 "다발"로 읽힌다. */
        gsap.to(paths.slice(0, -1), {
          strokeDashoffset: 0,
          ease: "none",
          duration: 1.1,
          stagger: 0.06,
          scrollTrigger: trigger,
        });

        /* 금빛은 stagger에서 빼고 전 구간을 고르게 훑는다.
           스테이션 점등이 이 선단에 묶여 있어, 시차를 주면 8개 관측이
           스크롤 한쪽에 몰리고 나머지 구간이 비어버린다. */
        gsap.to(amberPath, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: trigger,
          onUpdate: () => {
            if (!amberPath || !amberLen) return;
            const off = parseFloat(amberPath.style.strokeDashoffset || `${amberLen}`);
            const drawn = Math.max(0, Math.min(amberLen, amberLen - off));
            const tip = amberPath.getPointAtLength(drawn);
            const flowY = FLOW_SVG_TOP + tip.y;
            stations.forEach((el) => {
              const top = Number(el.dataset.stop);
              const lit = drawn > 1 && flowY >= top - 30 && flowY <= top + 110;
              el.classList.toggle(styles.stationLit, lit);

              const num = numOf(el);
              if (!num) return;
              const raw = (flowY - (top - WRITE_FROM)) / WRITE_SPAN;
              const p = Math.max(0, Math.min(1, drawn > 1 ? raw : 0));
              paint(num, 1 - Math.pow(1 - p, 3)); // power3.out — 빠르게 차오르고 조용히 안착
            });
            /* 금빛이 바뀔 때마다 수렴선을 다시 눌러준다 */
            gateConverge?.();
          },
        });
      }

      /* S4: 수렴 스크럽 + 완료 시 점 등장 */
      if (convergeSvgRef.current) {
        const paths = Array.from(convergeSvgRef.current.querySelectorAll("path, line")) as (SVGPathElement | SVGLineElement)[];
        const lens = paths.map((p) => ("getTotalLength" in p ? p.getTotalLength() : 100));
        paths.forEach((p, i) => {
          p.style.strokeDasharray = `${lens[i]}`;
          p.style.strokeDashoffset = `${lens[i]}`;
        });

        /* 빠른 스크롤 대응 — S3와 S4는 별개 트리거라 각자 scrub 지연으로 따라잡는다.
           지연이 짧은 쪽이 먼저 도착하면 금빛이 다 내려오기 전에 수렴선이 그려져 끊겨 보인다.
           스크롤 간격을 벌려도 소용없다(지연은 시간 축 문제).
           그래서 스크롤 진행도를 프록시(state.p)로만 받고, 실제 획 길이는 매 프레임
           "스크롤 진행도 × 금빛 게이트"로 직접 계산한다. GSAP이 DOM을 건드리지 않으므로
           트윈이 멎어도 게이트가 풀리는 즉시 정상값으로 복귀한다. */
        /* 금빛 경로의 마지막 7%는 곧은 수직선(y 1200→1290)이라, 0.94면 이음새에 닿은 상태다 */
        const GATE_FROM = 0.94;
        const state = { p: 0 };
        gsap.to(state, {
          p: 1,
          ease: "none",
          scrollTrigger: {
            trigger: convergeSvgRef.current,
            start: "top 80%",
            end: "center 45%",
            scrub: 1.1,
          },
        });

        const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
        const STEP = 0.02; // 줄기별 시차
        const SPAN = 0.74; // 한 줄기가 다 그려지는 데 쓰는 구간
        const GOLD = paths.length - 1; // 금빛은 맨 위에 그리려고 DOM 마지막에 둔다

        /* 금빛 한 획에서 "수렴점까지"가 차지하는 비율 — 곡선부와 꼬리부의 속도를 따로 주려면 필요.
           경로상 y는 단조 증가하므로 이분 탐색으로 y=200 지점을 찾는다. */
        const goldPath = paths[GOLD] as SVGPathElement;
        let lo = 0;
        let hi = lens[GOLD];
        for (let k = 0; k < 24; k++) {
          const mid = (lo + hi) / 2;
          if (goldPath.getPointAtLength(mid).y < 200) lo = mid;
          else hi = mid;
        }
        const CURVE_RATIO = lo / lens[GOLD];

        const dot = convergeDotRef.current;
        if (dot) gsap.set(dot, { opacity: 0, scale: 0.72, transformOrigin: "center" });

        const renderConverge = () => {
          const gate = clamp01((amberDrawn() - GATE_FROM) / (1 - GATE_FROM));
          const p = state.p * gate;
          paths.forEach((pathEl, i) => {
            let prog: number;
            if (i < GOLD) {
              prog = clamp01((p - i * STEP) / SPAN);
            } else {
              /* 곡선부는 흰 줄기들과 함께(0→0.72), 꼬리는 그 뒤에 원까지(0.72→0.95) */
              prog =
                clamp01(p / 0.72) * CURVE_RATIO +
                clamp01((p - 0.72) / 0.23) * (1 - CURVE_RATIO);
            }
            pathEl.style.strokeDashoffset = `${lens[i] * (1 - prog)}`;
          });
          /* 여덟 줄기가 맺힌 뒤에야 점이 앉는다 — 튕기지 않고 조용히 */
          const d = clamp01((p - 0.9) / 0.1);
          if (dot) {
            const e = 1 - Math.pow(1 - d, 3);
            gsap.set(dot, { opacity: e, scale: 0.72 + 0.28 * e });
          }
          /* 점이 다 맺힌 다음에야 아래 병 사진이 열린다.
             p가 부동소수점 탓에 정확히 1에 닿지 않으므로 0.95로 본다.
             점은 이징(power3) 때문에 d≈0.79면 이미 눈에는 다 나타난 상태다. */
          if (d >= 0.95 && bottlePhotoRef.current) {
            bottlePhotoRef.current.classList.add(styles.revealIn);
          }
        };
        renderConverge();
        gsap.ticker.add(renderConverge);
        tickers.push(renderConverge);
        gateConverge = renderConverge;
      }

      /* S5: N° 카운트업 (0.8s) */
      if (serial !== null && bottleSerialRef.current) {
        const el = bottleSerialRef.current;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: serial,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = `N° ${Math.round(obj.v)} / ${serialTotal}`;
          },
        });
      }
    }, rootRef);

    return () => {
      tickers.forEach((f) => gsap.ticker.remove(f));
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serial, serialTotal]);

  return (
    <main className={styles.page} ref={rootRef}>
      <div className={styles.frame}>
        {/* ── S1 병사진 히어로 ── */}
        <section className={styles.hero}>
          <Image
            /* 제품별 히어로 — Paper의 Product 아트보드(ARCHIVE N° 002~005)에 쓰인 컷과 같은 사진.
               폴백은 En Lieu Sûr 컷이라 다른 제품에 서면 틀린 병이 보인다. 새 제품은 imageHero부터 채울 것. */
            src={meta.imageHero ?? "/images/b-hero-bottle.webp"}
            alt=""
            fill
            priority
            /* object-fit:cover — 폭이 아니라 높이가 제약이다. 제품 히어로가 가로 컷(1672×941)이라
               100svh(≈844)를 덮으려면 폭 ≈ 1500px가 필요하다. sizes를 화면 폭(390)에 맞추면
               그만큼 작은 후보를 받아 확대되며 뭉갠다. 세로 원본은 원본 폭에서 잘리니 손해가 없다. */
            sizes="1500px"
            className={styles.heroPhoto}
          />
          <div className={styles.heroScrim} />

          <div className={`${styles.heroStatus} ${styles.introFade} ${styles.introFadeD2}`}>
            <div className={styles.heroStatusId}>
              {ownerName && (
                <span className={styles.heroStatusOwner}>
                  {extra.ownedBy} <span className={styles.heroOwnerName}>{ownerName}</span>
                </span>
              )}
            </div>
            <div className={styles.heroVerified}>
              {/* 자물쇠 — 초록 네모(상태 점)는 대시보드 관용구라 한정판의 무게와 안 맞고
                  브랜드 팔레트 밖 색이었다. 몸통은 채우고 고리만 헤어라인으로 그려
                  8px에서도 형태가 뭉개지지 않게 한다. */}
              <svg className={styles.heroVerifiedLock} width="8" height="10" viewBox="0 0 8 10" aria-hidden>
                <path
                  d="M2.4 4.4 V3 a1.6 1.6 0 0 1 3.2 0 V4.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
                <rect x="1" y="4.4" width="6" height="4.7" rx="0.9" fill="currentColor" />
              </svg>
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
              {/* 타이틀 원본은 798×96(표시의 3배). sizes가 없으면 2x(640)까지만 만들어
                  고밀도 화면에서 글자가 흐려진다 — 활자 이미지라 특히 눈에 띈다. */}
              {locale === "ko" ? (
                <Image
                  src="/images/b-record-title-ko.png"
                  alt={copy.titleText}
                  width={266}
                  height={32}
                  sizes="266px"
                  quality={95}
                  className={styles.titleImg}
                  priority
                />
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
            {/* EIGHT CURRENTS 아이브로우는 걷어냈다 — 바로 아래 제목이
                "여덟 개의 관측"이라고 같은 말을 하고 있었다. */}
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
          <div className={styles.flowScaler} style={{ transform: `scale(${flowScale})`, height: FLOW_HEIGHT * flowScale }}>
            <div className={styles.flow}>
              <svg ref={flowSvgRef} className={styles.flowSvg} width="390" height="1290" viewBox="0 0 390 1290" aria-hidden>
                {FLOW_PATHS.map((p, i) => (
                  <path key={i} d={p.d} fill="none" stroke={p.stroke} strokeWidth={p.width} opacity={p.amber ? 0.95 : 1} />
                ))}
              </svg>

              <span className={`${styles.seasonLabel} ${styles.seasonLabelOn}`} style={{ top: SEASON_TOPS[0] }}>{`${copy.months[0]} ${copy.seasons.winter}`}</span>
              <span className={styles.seasonLabel} style={{ top: SEASON_TOPS[1] }}>{`${copy.months[3]} ${copy.seasons.spring}`}</span>
              <span className={styles.seasonLabel} style={{ top: SEASON_TOPS[2] }}>{`${copy.months[6]} ${copy.seasons.summer}`}</span>
              <span className={styles.seasonLabel} style={{ top: SEASON_TOPS[3] }}>{`${copy.months[9]} ${copy.seasons.autumn}`}</span>
              <span className={`${styles.seasonLabel} ${styles.seasonLabelOn}`} style={{ top: SEASON_TOPS[4] }}>{`${copy.months[11]} ${copy.seasons.winter}`}</span>

              {(Object.keys(STATION_TOPS) as MetricKey[]).map((key) => {
                const v = stationValues[key];
                return (
                  <span key={`st-${key}`} className={styles.station} style={{ top: STATION_TOPS[key] }} data-stop={STATION_TOPS[key]}>
                    <span className={styles.stationLabel}>{`${copy.metrics[key]} · ${aggSuffix(key)}`}</span>
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
            <defs>
              {/* 금빛이 수렴점을 지나며 흰색으로 바뀐다 — 색만 바뀔 뿐 한 획이다.
                  수렴점(y=200)에서 흰 줄기 7개가 한꺼번에 끝나 밝기가 떨어지므로,
                  그 구간은 밝게 유지하고 색 전환은 더 아래(y 214~250)에서 끝낸다. */}
              <linearGradient id="bConvergeTail" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="268">
                <stop offset="0" stopColor="#CCAD7B" stopOpacity="0.95" />
                <stop offset="0.70" stopColor="#CCAD7B" stopOpacity="0.95" />
                <stop offset="0.80" stopColor="#E4D7BF" stopOpacity="0.95" />
                <stop offset="0.93" stopColor="#F1EFEB" stopOpacity="0.8" />
                <stop offset="1" stopColor="#F1EFEB" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* 흰 줄기 7 — 금빛보다 먼저 그려 아래에 깔린다.
                butt 캡이면 수렴점에 납작한 가로 단면이 생겨 단차로 보인다 → round */}
            {CONVERGE_XS.slice(1).map((x, i) => (
              <path
                key={x}
                d={`M ${x} 0 C ${x} 80, 195 140, 195 200`}
                fill="none"
                stroke={CONVERGE_STYLE[i + 1].stroke}
                strokeWidth={CONVERGE_STYLE[i + 1].width}
                strokeLinecap="round"
              />
            ))}
            {/* 금빛 — 맨 위에 그려 흰 줄기에 가려지지 않는다.
                수렴점에서 끊고 별도 선을 잇던 걸 없애고, 원까지 한 획으로 내려온다. */}
            <path
              /* 코어 원(cy 278 · r 3.5)의 윗변에 맞춰 끝낸다. round 캡이 0.7 더 나가 맞닿는다.
                 268은 헤일로에만 걸쳐 애매했고, 중심(278)까지 넣으면 코어가 호흡으로
                 옅어질 때 안쪽 선 끝이 비친다. */
              d={`M ${CONVERGE_XS[0]} 0 C ${CONVERGE_XS[0]} 80, 195 140, 195 200 L 195 274.5`}
              fill="none"
              stroke="url(#bConvergeTail)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <g ref={convergeDotRef}>
              <circle cx="195" cy="278" r="13" fill="rgba(204,173,123,0.08)" />
              <circle cx="195" cy="278" r="7" fill="rgba(204,173,123,0.2)" />
              <circle cx="195" cy="278" r="3.5" fill="#CCAD7B" className={styles.glowDot} />
            </g>
          </svg>
          <p className={`${styles.convergeText} ${styles.reveal}`} data-reveal>
            {/* 인양이 끝나 고객 손에 있는 병에서 열리는 페이지다 —
                진행형("담기고 있습니다")이 아니라 완료형으로 고정한다.
                data.partial은 배치의 인양일이 미래로 남아 있을 때 참이 되는데,
                그건 재고 데이터의 사정이지 이 화면을 보는 사람의 시점이 아니다. */}
            {copy.converged}
          </p>
        </section>

        {/* ── S5 개체 선언 + 원산지/해저 표 ── */}
        <section className={styles.bottleSection}>
          {/* data-reveal(IO) 대신 수렴 점에 묶는다 — 점보다 먼저 뜨면 순서가 뒤집힌다 */}
          <div className={styles.reveal} ref={bottlePhotoRef}>
            <Image
              src={meta.image}
              alt={meta.name}
              width={342}
              height={274}
              sizes="(max-width: 430px) 100vw, 342px"
              quality={90}
              className={styles.bottlePhoto}
            />
          </div>
          {serialLine && (
            <p ref={bottleSerialRef} className={styles.bottleSerial}>
              {serialLine}
            </p>
          )}
          <h2 className={styles.bottleName}>{meta.name}</h2>

          {/* --i = 리빌 순번. 캡션·행이 한 줄씩 순차 기입된다. */}
          <div className={styles.tables} data-reveal>
            <div className={styles.tableCaption} style={{ "--i": 0 } as CSSProperties}>
              <span className={styles.tableDot} />
              <span>{extra.provHead}</span>
            </div>
            {provRows.map((r, i) => (
              <div key={`p-${i}`} className={styles.tableRow} style={{ "--i": i + 1 } as CSSProperties}>
                <span className={styles.tableLabel}>{r.label}</span>
                <span className={styles.tableValue}>{r.value}</span>
              </div>
            ))}

            <div
              className={`${styles.tableCaption} ${styles.tableCaptionGap}`}
              style={{ "--i": provRows.length + 1 } as CSSProperties}
            >
              <span className={styles.tableDot} />
              <span>{extra.seaHead}</span>
            </div>
            {seaRows.map((r, i) => (
              <div
                key={`s-${i}`}
                className={styles.tableRow}
                style={{ "--i": provRows.length + 2 + i } as CSSProperties}
              >
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
          {/* 화살표 없음 — 채워진 버튼은 이미 누르는 것임이 명백하다.
              화살표는 맨몸 텍스트 링크에만 남겨 "링크"라는 신호를 되살린다. */}
          <Link href={`/b/${data.bottle.nfcCode}/certificate`} className={styles.passportCta}>
            {extra.passportCta}
          </Link>
          {/* "인증서 저장"은 위 CTA와 목적지가 같아 뺐다(같은 화면에서 같은 의도의 버튼 둘).
              저장·공유는 인증서 페이지 안에 있다. */}
          <div className={styles.passportRow}>
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
              <button
                type="submit"
                className={`${styles.passportNewsSubmit} ${nlStatus === "submitting" ? styles.passportNewsSubmitBusy : ""}`}
                disabled={nlStatus === "submitting"}
                aria-busy={nlStatus === "submitting"}
              >
                {extra.newsletterConfirm}
              </button>
            </form>
          ) : (
            <button type="button" className={styles.passportNews} onClick={() => setNlOpen(true)}>
              <span>{extra.passportNews}</span>
              <svg className={styles.passportNewsArrow} width="5" height="9" viewBox="0 0 5 9" aria-hidden>
                <polyline
                  points="0.9,0.9 4.1,4.5 0.9,8.1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {nlErr && <p className={styles.newsletterErr}>{nlErr}</p>}
        </section>

        {/* ── 푸터 (컴팩트 · Paper 7AI-0) ── */}
        <BottleFooter
          locale={locale}
          onLocaleChange={setLocale}
          tagline={copy.footerTagline}
          brandPage={extra.brandPage}
          blogPage={extra.blogPage}
          year={year}
        />
      </div>
    </main>
  );
}
