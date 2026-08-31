"use client";

/**
 * /b 병 기록 페이지 — Paper "NFC 병 페이지 v2 — 여덟 줄기의 수렴" 시안 구현.
 * S1 병사진 히어로 → S3 여덟 줄기 하강 → S4 수렴 →
 * S5 개체 선언 + 원산지/해저 2개 표 → S6 뉴스레터 → 푸터(언어 선택 포함).
 * S2 여정(depth profile)은 Paper 캔버스에서 지워져 코드에서도 걷어냈다 —
 * 번호는 Paper 아트보드와 맞춰 그대로 둔다(S2 자리는 비어 있다).
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
  bottleCopy,
  MAISON_NAME,
  PRODUCT_META,
  recordExtra,
  PROVENANCE,
  TWO_YEAR_FROM_MONTHS,
  type BottleLocale,
} from "../_lib/copy";
import type { BottleRecordData } from "../_lib/data";
import { submitNewsletter } from "@/lib/forms";
import { agingMonths, immersionYear } from "../_lib/duration";
import { useSafeAreaTint } from "../_lib/use-safe-area-tint";

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

/* S3 여덟 줄기 — Paper 확정 지오메트리 (viewBox 390×1290, 시작 높이는 0~43px 안에서만 미세하게 다르게)
   섹션 상단이 종이색에서 시작하도록 바뀌면서, 획도 위쪽은 잉크로 시작해 아래에서 원래 색으로 넘어간다.
   전환 구간(y 74~134, 섹션 y로 80~140)이 바탕이 뒤집히는 자리와 겹쳐야 넘어가는 지점이 보이지 않는다.
   top/bottom은 같은 농도 서열의 잉크·아이보리 짝이다 — 서열(25/30/35/45%)은 그대로 두고
   잉크 쪽만 밝은 바탕 대응으로 1.2배 올렸다. d·좌표·strokeWidth는 건드리지 않는다. */
const FLOW_PATHS: { d: string; top: string; bottom: string; width: number; amber?: boolean }[] = [
  { d: "M 120 16 C 120 110, 95 210, 95 300 S 145 500, 145 600 S 120 800, 120 900 S 110 1100, 110 1200 L 110 1290", top: "rgba(20,17,14,0.42)", bottom: "rgba(241,239,235,0.35)", width: 0.9 },
  { d: "M 145 33 C 145 123, 180 220, 180 300 S 90 500, 90 600 S 165 800, 165 900 S 135 1100, 135 1200 L 135 1290", top: "rgba(20,17,14,0.36)", bottom: "rgba(241,239,235,0.3)", width: 0.8 },
  { d: "M 170 8 C 170 104, 155 200, 155 300 S 165 500, 165 600 S 180 800, 180 900 S 160 1100, 160 1200 L 160 1290", top: "rgba(20,17,14,0.3)", bottom: "rgba(241,239,235,0.25)", width: 0.7 },
  { d: "M 195 38 C 195 127, 198 230, 198 300 S 192 500, 192 600 S 195 800, 195 900 S 185 1100, 185 1200 L 185 1290", top: "rgba(20,17,14,0.52)", bottom: "rgba(241,239,235,0.45)", width: 1 },
  { d: "M 220 22 C 220 115, 255 220, 255 300 S 175 500, 175 600 S 235 800, 235 900 S 210 1100, 210 1200 L 210 1290", top: "rgba(20,17,14,0.42)", bottom: "rgba(241,239,235,0.35)", width: 0.9 },
  { d: "M 245 43 C 245 131, 220 240, 220 300 S 265 500, 265 600 S 205 800, 205 900 S 235 1100, 235 1200 L 235 1290", top: "rgba(20,17,14,0.36)", bottom: "rgba(241,239,235,0.3)", width: 0.8 },
  { d: "M 270 28 C 270 119, 285 225, 285 300 S 240 500, 240 600 S 260 800, 260 900 S 260 1100, 260 1200 L 260 1290", top: "rgba(20,17,14,0.3)", bottom: "rgba(241,239,235,0.25)", width: 0.7 },
  /* 금빛은 밝은 구간에서 브라스(1.8:1)로 두면 사라진다 — 위쪽은 브론즈(--b-bronze와 같은 값)로 내려 받는다.
     SVG presentation attribute는 var()를 못 받아 hex를 그대로 쓴다. bottle.module.css의 --b-bronze와 함께 고칠 것. */
  { d: "M 95 0 C 95 100, 120 200, 120 300 S 225 500, 225 600 S 150 800, 150 900 S 85 1100, 85 1200 L 85 1290", top: "#8A6A3A", bottom: "#CCAD7B", width: 1.4, amber: true },
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
/* S4 수렴 SVG의 viewBox 높이. S3와 같은 스케일러에 태우므로 높이를 코드가 세운다 —
   height:auto에 맡기면 폭 결정이 CSS(100vw)로 갈라져 S3와 좌표계가 어긋난다. */
const CONVERGE_HEIGHT = 320;
/* 왼쪽 세로축의 계절 눈금 자리 — 1년물은 Paper가 확정한 다섯 좌표를 그대로 쓴다.
   더 긴 배치만 같은 상하한 안에서 균등 분할한다(아래 seasonMarks). */
const SEASON_TOPS_1Y = [18, 300, 600, 900, 1200];
const AXIS_TOP = SEASON_TOPS_1Y[0];
const AXIS_BOTTOM = SEASON_TOPS_1Y[SEASON_TOPS_1Y.length - 1];
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
  /* ja·zh 지면의 CJK 세리프를 각 언어 서체로 돌린다. 규칙마다 modifier를 달지 않고
     루트에서 --b-serif-cjk 토큰 하나를 갈아끼운다(bottle.module.css). */
  const scriptClass = locale === "ja" ? styles.pageJa : locale === "zh" ? styles.pageZh : "";
  const [flowScale, setFlowScale] = useState(1);
  const [nlOpen, setNlOpen] = useState(false);
  const [nlEmail, setNlEmail] = useState("");
  const [nlStatus, setNlStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [nlErr, setNlErr] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroSerialRef = useRef<HTMLDivElement>(null);
  const flowSectionRef = useRef<HTMLElement>(null);
  const flowSvgRef = useRef<SVGSVGElement>(null);
  const convergeSvgRef = useRef<SVGSVGElement>(null);
  const convergeDotRef = useRef<SVGGElement>(null);
  /* 수렴 텍스트도 IO가 아니라 점이 나타나기 시작할 때 함께 연다 (아래 renderConverge) */
  const convergeTextRef = useRef<HTMLParagraphElement>(null);
  /* 병 사진은 IO가 아니라 수렴 점이 다 맺힌 뒤에 연다 (아래 renderConverge) */
  const bottlePhotoRef = useRef<HTMLDivElement>(null);
  const bottleSerialRef = useRef<HTMLParagraphElement>(null);

  /* 안드로이드 크롬은 루트 배경이 아니라 theme-color 메타를 본다 — 위 b-paper와 같은 값을 준다 */
  useSafeAreaTint(true);

  /* 숙성 기간 — 실제 경과 일수 기준 (연도 뺄셈은 틀린다, duration.ts 참고).
     카피보다 먼저 구한다: 기간이 문장 안에 박혀 있어(1년의 바다·사계절의 기록)
     어느 묶음을 세울지 이 값이 정한다. */
  const durationMonths = useMemo(
    () => agingMonths(data.aging.immersion, data.aging.retrieval),
    [data.aging.immersion, data.aging.retrieval]
  );

  const copy = bottleCopy(locale, durationMonths);
  const extra = recordExtra(locale, durationMonths);
  const meta = PRODUCT_META[data.bottle.productId] ?? PRODUCT_META.atomes_crochus_1y;
  const prov = PROVENANCE[data.bottle.productId];

  const immMonth = monthIdxOf(data.aging.immersion, 0);
  const retMonth = monthIdxOf(data.aging.retrieval, 11);
  const year = immersionYear(data.aging.immersion);
  /* 인양 연도 — 입수와 다르면 기간·축 표기에 두 해가 다 서야 한다.
     배치에 인양일이 없으면 입수 연도로 되돌려, 없는 해를 지어내지 않는다. */
  const retYear = data.aging.retrieval?.slice(0, 4) || year;
  const crossesYear = retYear !== year;

  const yearMonth = (y: string, m: number) => copy.yearMonth.replace("{y}", y).replace("{m}", copy.months[m]);

  const serialTotal = meta.quantity;
  const serial = data.bottle.serial;
  const serialLine = serial !== null ? `N° ${serial} / ${serialTotal}` : null;

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

  /* 해저 숙성 표 — Paper 03은 숙성 기간·숙성 환경·위치 3행.
     입수·인양 시점은 아래 숙성 기간 행이 함께 세운다(S2 여정은 걷어냈다).
     해를 넘긴 병은 연도를 하나만 세울 수 없다 — durationFmt는 「{y}년 {m1}–{m2}」라
     입수 연도 하나에 두 해치 개월 수를 얹어, 2년물이 「2026년 1월–12월 · 24개월」이 됐다.
     한 해에 24개월이 흐르지 않고, 같은 병의 인증서는 인양을 2027년 12월로 쓴다.
     두 해가 걸리면 양끝에 각자의 연도를 붙인다(어순은 인증서와 같은 yearMonth).
     개월 수 문자열은 소유 관리 화면과 같은 ownMonths를 쓴다 — 같은 값에 두 문안을 두지 않는다. */
  const durationValue = crossesYear
      ? `${yearMonth(year, immMonth)} – ${yearMonth(retYear, retMonth)} · ${extra.ownMonths.replace("{n}", String(durationMonths))}`
      : extra.durationFmt
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

  /* S3 왼쪽 세로축의 계절 눈금 — 입수 달부터 세 달마다 하나, 마지막은 숙성 마지막 달.
     이 축은 달력 한 해가 아니라 이 병이 바다에 있던 기간이다. 1월→12월 한 바퀴로 고정하면
     2년물은 사계절이 두 번인데 화면은 한 번만 돌고, 같은 「1월 겨울」이 어느 해인지 갈리지 않는다.
     12개월이면 다섯 눈금(Paper 확정 좌표 그대로), 24개월이면 여덟 계절 + 마지막 달로 아홉이 된다.
     스물넷을 다 찍으면 9px 모노가 뭉개지므로 계절 단위로만 끊는다.
     연도는 해가 바뀌는 눈금에만 붙인다 — 전부 붙이면 아홉 줄이 연도로 도배된다. */
  const seasonMarks = (() => {
    const offsets: number[] = [];
    for (let o = 0; o + 1 < durationMonths; o += 3) offsets.push(o);
    offsets.push(durationMonths - 1);
    const tops =
      offsets.length === SEASON_TOPS_1Y.length
        ? SEASON_TOPS_1Y
        : offsets.map((_, i) => AXIS_TOP + (i * (AXIS_BOTTOM - AXIS_TOP)) / (offsets.length - 1));
    const startYear = Number(year);
    let shown = -1;
    return offsets.map((o, i) => {
      const abs = immMonth + o;
      const m = abs % 12;
      const y = startYear + Math.floor(abs / 12);
      const head = crossesYear && y !== shown ? yearMonth(String(y), m) : copy.months[m];
      shown = y;
      return { top: tops[i], text: `${head} ${copy.seasons[seasonOf(m)]}` };
    });
  })();

  /* S3·S4 공통 스케일 (390px 고정 지오메트리 → 좁은 화면 축소).
     이 값 하나를 두 섹션이 같이 쓴다 — 이음매가 어긋나지 않는 근거는 bottle.module.css의
     .flowScaler 주석에 있다(정렬 규칙까지 함께 묶어야 맞는다).
     clientWidth가 아니라 getBoundingClientRect().width로 잰다: clientWidth는 정수로
     반올림돼, CSS 뷰포트 폭이 소수인 안드로이드(1080/2.75 = 392.7…)에서 배율이 실제 폭과
     최대 0.5px 어긋난다. 이음매 어긋남의 주원인은 아니었지만, 축소가 걸리는 구간에서
     그만큼 도판이 밀리거나 삐져나온다.
     리사이즈도 window가 아니라 ResizeObserver로 본다 — 이 섹션의 폭은 뷰포트 폭만이 아니라
     .frame(min(430px,100vw))·스크롤바 출현으로도 바뀐다. */
  useEffect(() => {
    const el = flowSectionRef.current;
    if (!el) return;
    const update = () => setFlowScale(Math.min(1, el.getBoundingClientRect().width / 390));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* 스케일이 바뀌면 두 스케일러의 인라인 높이가 바뀐다 = 그 아래 지면이 통째로 올라온다.
     ScrollTrigger는 만들어질 때의 좌표를 들고 있어, 갱신하지 않으면 S3·S4 스크럽 구간이
     실제 지면과 어긋난 채로 남는다(리사이즈가 한 번도 없으면 스스로 낫지 않는다). */
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [flowScale]);

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

  /* 해류 필드 이름이 current라 memo 본문의 data.averages.current를 컴파일러가 ref 접근으로 읽는다.
     그러면 추론한 의존성이 수동 의존성과 어긋나 이 컴포넌트의 최적화를 통째로 건너뛴다.
     memo 밖에서 미리 풀어 두면 본문에 .current 접근이 남지 않는다. */
  const { temp, salinity, tide, current, pressure, tidal, wave, period } = data.averages;

  const stationValues: Record<MetricKey, StationValue> = useMemo(
    () => ({
      temp: { num: temp, decimals: 1, unit: "°C" },
      salinity: { num: salinity, decimals: 1, unit: " psu" },
      tide: { num: tide, decimals: 0, unit: " cm" },
      current: { num: current, decimals: 2, unit: " m/s" },
      pressure: { num: pressure, decimals: 1, unit: " atm" },
      tidal: { num: tidal, decimals: 0, unit: " cm/s" },
      wave: { num: wave, decimals: 1, unit: " m" },
      period: { num: period, decimals: 1, unit: " s" },
    }),
    [temp, salinity, tide, current, pressure, tidal, wave, period]
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

      /* 히어로 시차 — 히어로는 제자리에 붙어 있고(sticky) 종이 지면이 그 위로 올라온다.
         그런데 붙어만 있으면 덮이는 내내 사진의 가장 어두운 윗부분만 화면에 남는다.
         스크롤의 42%만큼 속을 위로 밀어, 덮이는 동안 병목·병몸이 계속 올라오게 한다.
         (모션 감축이면 이 블록 전체가 실행되지 않는다 — 정지한 히어로도 레이아웃은 온전하다) */
      if (heroRef.current) {
        const layers = Array.from(heroRef.current.children);
        gsap.to(layers, {
          y: () => -window.innerHeight * 0.42,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        /* 제목은 종이가 닿기 전에 비운다 — 안 그러면 올라오는 지면이 글자를 가로로
           썰고 지나가는 순간이 생긴다. 종이 모서리가 제목에 닿는 지점이 ≈160px라
           그 전에 끝낸다.
           opacity 대신 filter를 쓰는 이유: 이 요소의 등장 애니메이션(settle)이
           forwards라 opacity: 1을 계속 주장해서 인라인 opacity가 먹지 않는다. */
        const heroText = heroRef.current.querySelector<HTMLElement>(`.${styles.heroContent}`);
        if (heroText) {
          gsap.fromTo(
            heroText,
            { filter: "opacity(1)" },
            {
              filter: "opacity(0)",
              ease: "none",
              scrollTrigger: { trigger: heroRef.current, start: "top -40", end: "top -200", scrub: true },
            },
          );
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
          /* 점이 나타나기 "시작"하면 텍스트도 함께 뜬다 — 병 사진(d>=0.95)보다 앞서야
             "점이 나타날 때 함께"라는 요구를 만족한다. */
          if (d > 0.05 && convergeTextRef.current) {
            convergeTextRef.current.classList.add(styles.revealIn);
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
  }, [serial, serialTotal]);

  return (
    /* b-paper — 안전영역(상태바·하단바)을 종이색으로. globals.css의 html:has(.b-paper)와 짝이다.
       히어로만 어둡고 그 아래는 전부 종이인 화면이라, 검정으로 두면 스크롤한 대부분의 시간 동안
       위아래 띠만 검게 남는다. 처음 한 화면에서 종이 띠가 어두운 히어로를 감싸는 것은 감수한다 —
       이 페이지는 종이 문서이고 히어로가 그 안에 끼워 넣은 도판이라는 구조와도 맞는다. */
    <main className={`${styles.page} ${scriptClass} b-paper`} ref={rootRef}>
      <div className={styles.frame}>
        {/* ── S1 병사진 히어로 ── */}
        <section className={styles.hero} ref={heroRef}>
          {/* void는 본체가 아니라 이 자식이 칠한다 — 본체에 칠하면 Safari 26이
              sticky의 background-color를 안전영역 바 색으로 삼아 위아래가 검게 잠긴다 */}
          <div className={styles.heroVoid} aria-hidden />
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
                  /* 기간이 문구에 박혀 있어 파일도 갈린다 — 「바다가 새긴 사계절」 / 「바다가 새긴 두 해」.
                     글자 수는 다르지만 두 PNG 모두 같은 266×32 슬롯에 가운데 정렬로 앉아 있다
                     (798×96 3x). 짧은 쪽을 타이트 크롭하면 폭 고정 슬롯에서 글자만 커진다 —
                     그래서 캔버스가 같다. 여기서 크기를 다시 계산하지 말 것. */
                  src={
                    durationMonths >= TWO_YEAR_FROM_MONTHS
                      ? "/images/b-record-title-2y-ko.png"
                      : "/images/b-record-title-ko.png"
                  }
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
                <defs>
                  {FLOW_PATHS.map((p, i) => (
                    <linearGradient key={i} id={`bFlow${i}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="170">
                      <stop offset="0" stopColor={p.top} />
                      <stop offset="0.435" stopColor={p.top} />
                      <stop offset="0.79" stopColor={p.bottom} />
                      <stop offset="1" stopColor={p.bottom} />
                    </linearGradient>
                  ))}
                </defs>
                {FLOW_PATHS.map((p, i) => (
                  <path key={i} d={p.d} fill="none" stroke={`url(#bFlow${i})`} strokeWidth={p.width} opacity={p.amber ? 0.95 : 1} />
                ))}
              </svg>

              {/* 첫 눈금만 잉크다 — 이 높이(y 18~30)는 아직 종이색 위다.
                  나머지는 y 134 아래라 이미 남색·심해 구간이므로 그대로 둔다.
                  마지막 눈금은 도착점이라 한 단 밝게 세운다. */}
              {seasonMarks.map((mark, i) => (
                <span
                  key={mark.top}
                  className={`${styles.seasonLabel} ${
                    i === 0
                      ? styles.seasonLabelInk
                      : i === seasonMarks.length - 1
                        ? styles.seasonLabelOn
                        : ""
                  }`}
                  style={{ top: mark.top }}
                >
                  {mark.text}
                </span>
              ))}

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
          {/* S3와 같은 스케일러에 태운다 — 근거는 bottle.module.css의 .flowScaler 주석 */}
          <div
            className={styles.convergeScaler}
            style={{ transform: `scale(${flowScale})`, height: CONVERGE_HEIGHT * flowScale }}
          >
            <svg
              ref={convergeSvgRef}
              className={styles.convergeSvg}
              width="390"
              height={CONVERGE_HEIGHT}
              viewBox={`0 0 390 ${CONVERGE_HEIGHT}`}
              aria-hidden
            >
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
          </div>
          {/* data-reveal(IO) 대신 수렴 점에 묶는다 — 점보다 먼저 뜨면 병 사진처럼 순서가 뒤집힌다 */}
          <p className={`${styles.convergeText} ${styles.reveal}`} ref={convergeTextRef}>
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
          {/* 입수 연차 — 큐베명만으로는 이듬해 입수분과 같은 이름이 된다.
              숙성 기간은 붙이지 않는다: 바로 아래 해저 숙성 표에 「숙성 기간」 행이 있다.
              배치가 없는 병은 세우지 않는다 — 없는 연도를 지어내지 않는다. */}
          {data.aging.immersion && <p className={styles.bottleYear}>{year}</p>}

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
