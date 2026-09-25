"use client";

/**
 * /b 병 기록 페이지 — Paper "03 — 바다의 기록 · 여덟 줄기" 시안 구현.
 * S1 병사진 히어로 → S3 여덟 줄기 하강 → S4 수렴 →
 * S5 병 사진 → S6 인증서 미리보기 + 버튼 3개 → 푸터(언어 선택 포함).
 * 원산지·해저 숙성 표는 04(인증서)에만 둔다 — 같은 지면에 같은 값을 두 번 쓰지 않는다(SPEC A).
 * S2 여정(depth profile)은 Paper 캔버스에서 지워져 코드에서도 걷어냈다 —
 * 번호는 Paper 아트보드와 맞춰 그대로 둔다(S2 자리는 비어 있다).
 * 표기 규칙: 입수·인양은 월·계절만(날짜·일수 금지), 좌표는 도 단위. 용어는 "입수".
 * 모션: S3 8줄기 스크럽 성장 + 관측값 기입, S4 수렴 스크럽, S6 카드 페이드 업.
 */

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./bottle.module.css";
import ui from "./ui.module.css";
import BottleFooter from "./BottleFooter";
import CertificateCard from "./CertificateCard";
/* 서문 제목(ko) — J1950은 이 사이트에서 늘 이미지로 간다(tasks/lessons.md).
   로컬 jj.ttf로 27px/40 · 자간 0.02em · #F1EFEB를 @3x로 구웠다(993×240 → 331×80) */
import ecTitleKo from "./assets/ec-title-ko.png";
import { bottleCopy, PRODUCT_META, recordExtra, TWO_YEAR_FROM_MONTHS, type BottleLocale } from "../_lib/copy";
import type { BottleRecordData } from "../_lib/data";
import type { CertCardData } from "../_lib/cert-card";
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
   섹션 상단이 검정에서 시작하도록 바뀌면서, 획 위쪽은 담청(201,214,230)으로 시작해 아래에서 아이보리로 넘어간다.
   전환 구간(y 74~134, 섹션 y로 80~140)이 바탕이 남색으로 밝아지는 자리와 겹쳐야 넘어가는 지점이 보이지 않는다.
   top/bottom은 같은 농도 서열의 담청·아이보리 짝이다 — 아이보리 서열(25/30/35/45%)은 그대로 두고
   담청 쪽만 검정 바탕에서 같은 무게로 읽히도록 한 단 올렸다(33/39/46/56%).
   d·좌표·strokeWidth는 건드리지 않는다. */
const FLOW_PATHS: { d: string; top: string; bottom: string; width: number; amber?: boolean }[] = [
  { d: "M 120 16 C 120 110, 95 210, 95 300 S 145 500, 145 600 S 120 800, 120 900 S 110 1100, 110 1200 L 110 1290", top: "rgba(201,214,230,0.46)", bottom: "rgba(241,239,235,0.35)", width: 0.9 },
  { d: "M 145 33 C 145 123, 180 220, 180 300 S 90 500, 90 600 S 165 800, 165 900 S 135 1100, 135 1200 L 135 1290", top: "rgba(201,214,230,0.39)", bottom: "rgba(241,239,235,0.3)", width: 0.8 },
  { d: "M 170 8 C 170 104, 155 200, 155 300 S 165 500, 165 600 S 180 800, 180 900 S 160 1100, 160 1200 L 160 1290", top: "rgba(201,214,230,0.33)", bottom: "rgba(241,239,235,0.25)", width: 0.7 },
  { d: "M 195 38 C 195 127, 198 230, 198 300 S 192 500, 192 600 S 195 800, 195 900 S 185 1100, 185 1200 L 185 1290", top: "rgba(201,214,230,0.56)", bottom: "rgba(241,239,235,0.45)", width: 1 },
  { d: "M 220 22 C 220 115, 255 220, 255 300 S 175 500, 175 600 S 235 800, 235 900 S 210 1100, 210 1200 L 210 1290", top: "rgba(201,214,230,0.46)", bottom: "rgba(241,239,235,0.35)", width: 0.9 },
  { d: "M 245 43 C 245 131, 220 240, 220 300 S 265 500, 265 600 S 205 800, 205 900 S 235 1100, 235 1200 L 235 1290", top: "rgba(201,214,230,0.39)", bottom: "rgba(241,239,235,0.3)", width: 0.8 },
  { d: "M 270 28 C 270 119, 285 225, 285 300 S 240 500, 240 600 S 260 800, 260 900 S 260 1100, 260 1200 L 260 1290", top: "rgba(201,214,230,0.33)", bottom: "rgba(241,239,235,0.25)", width: 0.7 },
  /* 금빛만 위아래가 다른 두 hex다 — 위쪽은 검정 구간에서 한 단 가라앉힌 브라스(#B99A66),
     아래쪽은 도판 전체의 앰버(bottle.module.css --b-amber와 같은 #CCAD7B)다.
     #B99A66은 이 파일에만 있는 값이다 — --b-bronze(#8a6a3a)와는 무관하다.
     SVG presentation attribute는 var()를 못 받아 hex를 그대로 쓴다. */
  { d: "M 95 0 C 95 100, 120 200, 120 300 S 225 500, 225 600 S 150 800, 150 900 S 85 1100, 85 1200 L 85 1290", top: "#B99A66", bottom: "#CCAD7B", width: 1.4, amber: true },
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
/* 스테이션 라벨 접미 — 최고/수심만 붙인다. 평균은 서문 본문이 한 번만 말한다(SPEC A).
   data.ts 집계 방식과 일치해야 한다. */
const STATION_AGG: Record<MetricKey, "avg" | "max" | "depth"> = {
  temp: "avg", salinity: "avg", tide: "max", current: "avg", pressure: "depth", tidal: "avg", wave: "max", period: "avg",
};

interface StationValue { num: number | null; decimals: number; unit: string }

export default function BottleRecord({
  data,
  card,
  initialLocale = "ko",
}: {
  data: BottleRecordData;
  /** S6 인증서 미리보기 — 04와 같은 한 장(서버가 확정한 값) */
  card: CertCardData;
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
  /* 병 사진은 IO가 아니라 수렴 점이 다 맺힌 뒤에 연다 (아래 renderConverge).
     수렴 아래 카피(「1년의 바다가 한 병에 담겼습니다」)는 걷어냈다(SPEC A — 수렴 아래 카피 없음). */
  const bottlePhotoRef = useRef<HTMLDivElement>(null);

  /* 안드로이드 크롬은 루트 배경이 아니라 theme-color 메타를 본다 — 아래 b-root와 같은 값을 준다 */
  useSafeAreaTint(false);

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

  const immMonth = monthIdxOf(data.aging.immersion, 0);
  const year = immersionYear(data.aging.immersion);
  /* 인양 연도 — 입수와 다르면 기간·축 표기에 두 해가 다 서야 한다.
     배치에 인양일이 없으면 입수 연도로 되돌려, 없는 해를 지어내지 않는다. */
  const retYear = data.aging.retrieval?.slice(0, 4) || year;
  const crossesYear = retYear !== year;

  const yearMonth = (y: string, m: number) => copy.yearMonth.replace("{y}", y).replace("{m}", copy.months[m]);

  const serialTotal = meta.quantity;
  const serial = data.bottle.serial;
  const serialLine = serial !== null ? `N° ${serial} / ${serialTotal}` : null;

  /* 스테이션 라벨 — 지표명만. 최고값(조위·파고)만 「· 최고」, 수압만 「· 수심 30M」을 붙인다.
     「12개월 평균」은 서문 본문에 한 번만 적는다(SPEC A). */
  const stationLabel = (key: MetricKey) => {
    const kind = STATION_AGG[key];
    if (kind === "depth") return `${copy.metrics[key]} · ${extra.metricAgg.depth.replace("{d}", String(data.aging.depth))}`;
    if (kind === "max") return `${copy.metrics[key]} · ${extra.metricAgg.max}`;
    return copy.metrics[key];
  };

  const certTitle =
    serial !== null
      ? extra.certSectionTitle.replace("{serial}", String(serial))
      : extra.certSectionTitleNoSerial;

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

  /* ── GSAP 스크럽 모션 (히어로 N° 카운트업 · S3 8줄기 · S4 수렴) ─────────── */
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

      /* 히어로 디졸브 — 히어로는 일반 흐름이라 아래 지면과 함께 화면 전체가 위로
         슬라이드된다. 덮는 모서리가 없어진 자리를 사진의 소멸이 대신한다: 스크롤이
         진행될수록 사진과 글자가 옅어지고, 히어로 본체의 void(#0a0908)만 남는다.
         스크림(.heroScrim)은 태우지 않는다 — 근거는 bottle.module.css의 그 규칙 주석.

         구간은 뷰포트의 62%다. 그 지점이면 화면 아래 62%를 서문이 채우고 히어로는
         위 38%만 남는데, 그 면이 이미 순수 검정이라 서문 0%(같은 void)와 이어져
         한 박자 검은 화면을 지나 서문으로 넘어간다. 더 짧으면 사진을 볼 새가 없고,
         더 길면 제목이 화면 위로 빠질 때까지 글자가 남아 서문과 겹친다
         (제목 아래끝이 화면 top에 닿는 지점이 100svh − 92px다).

         opacity가 아니라 filter를 쓰는 이유: heroContent의 등장
         애니메이션(settle)이 forwards라 opacity: 1을 계속 주장해서 인라인 opacity가
         먹지 않는다. 두 층을 한 트윈에 묶으려면 사진도 같은 속성을 써야 한다.
         (모션 감축이면 이 블록 전체가 실행되지 않는다 — 사진이 남아 있는 히어로도
          레이아웃은 온전하다. 함께 밀려 올라갈 뿐이다) */
      if (heroRef.current) {
        const fading = heroRef.current.querySelectorAll<HTMLElement>(
          `.${styles.heroPhoto}, .${styles.heroContent}`,
        );
        gsap.fromTo(
          fading,
          { filter: "opacity(1)" },
          {
            filter: "opacity(0)",
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: () => `+=${window.innerHeight * 0.62}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
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

        /* 시작을 늦춘다 — 65%면 서문 제목이 아직 화면 한가운데(하단 48.5%)일 때 첫 획이 그려졌다.
           50%로 내리면 제목 하단이 화면 위 1/3(33.4%)에 올라온 뒤에 시작한다.
           끝도 같은 폭(15%p)만큼 함께 내려 스크럽 구간의 픽셀 길이를 보존한다 —
           시작만 늦추면 구간이 짧아져 그리는 속도가 빨라진다. 390×844에서 1042.8px로 전후 동일.

           제목을 트리거로 삼지 않고 섹션 top을 그대로 쓰는 이유: .ecIntro의 제목 아래로는
           본문·범례·패딩이 고정 높이라, 제목 "하단"은 줄 수가 늘어도 섹션 top 위 139px에 그대로 있다.
           제목이 길어질 때 밀리는 것은 상단뿐이므로, 이 기준에 한해 섹션 top이 제목 하단의 대리값이다. */
        const trigger = {
          trigger: flowSectionRef.current,
          start: "top 50%",
          end: "bottom 80%",
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

      /* S5의 N° 카운트업은 캡션과 함께 걷어냈다 — 번호는 바로 아래 인증서 카드가 세운다 */
    }, rootRef);

    return () => {
      tickers.forEach((f) => gsap.ticker.remove(f));
      ctx.revert();
    };
  }, [serial, serialTotal]);

  return (
    /* b-root — 안전영역(상태바·하단바)을 void로. globals.css의 html:has(.b-root)와 짝이다.
       히어로의 sticky를 걷어낸 뒤로 이 지면에는 fixed/sticky 요소가 하나도 없어서,
       Safari 26이 바를 칠할 때 읽는 것이 이 루트 배경뿐이다 — 폴백이 아니라 유일한 경로다.
       값은 --color-void-bg(#0a0908)이고 히어로의 --b-void와 같다(bottle.module.css .hero 주석).
       도입 당시에는 b-paper였다. 히어로만 어둡고 그 아래는 전부 종이라, 검정으로 두면 스크롤한
       대부분의 시간 동안 위아래 띠만 검게 남는 화면이었기 때문이다. 배경을 블랙→네이비로 바꾸면서
       그 전제가 뒤집혔다 — 어두운 면적이 화면의 다수가 됐고, 종이 띠가 검은 화면을 감싸는 모양이
       됐다. 그래서 void로 잇는다. */
    <main className={`${styles.page} ${scriptClass} b-root`} ref={rootRef}>
      <div className={styles.frame}>
        {/* ── S1 병사진 히어로 ── */}
        <section className={styles.hero} ref={heroRef}>
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

          {/* 상단 라벨(OWNED BY · NFC VERIFIED)은 두지 않는다 — 소유자·검증은 04 인증서가 맡는다(SPEC A) */}

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
            </div>
          </div>
        </section>

        {/* ── Eight Currents 인트로 ── */}
        <section className={styles.ecIntro}>
          <div className={styles.reveal} data-reveal>
            {/* EIGHT CURRENTS 아이브로우는 걷어냈다 — 바로 아래 제목이
                "여덟 개의 관측"이라고 같은 말을 하고 있었다. */}
            {/* 제목은 히어로 제목과 같은 활자(J1950)로 선다. ko는 PNG, 나머지는 같은 자리의 표제 활자 */}
            {locale === "ko" ? (
              <h2 className={styles.ecTitleImgWrap}>
                <Image
                  src={ecTitleKo}
                  alt={extra.ecTitle.replace("\n", " ")}
                  width={331}
                  height={80}
                  sizes="331px"
                  quality={95}
                  className={styles.ecTitleImg}
                />
              </h2>
            ) : (
              <h2 className={styles.ecTitle}>{extra.ecTitle}</h2>
            )}
            <p className={styles.ecBody}>{extra.ecBody.replace("{n}", String(durationMonths))}</p>
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

              {/* 다섯 눈금이 전부 어두운 바탕 위라 근백색 하나로 간다.
                  마지막 눈금만 도착점이라 한 단 밝게 세운다. */}
              {seasonMarks.map((mark, i) => (
                <span
                  key={mark.top}
                  className={`${styles.seasonLabel} ${
                    i === seasonMarks.length - 1 ? styles.seasonLabelOn : ""
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
                    <span className={styles.stationLabel}>{stationLabel(key)}</span>
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
        </section>

        {/* ── S5 병 사진 — 캡션(번호·큐베명·연차) 없음: 바로 아래 인증서 카드와 같은 내용이다(SPEC A) ── */}
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
        </section>

        {/* ── S6 인증서 — 미리보기 카드 페이드 업 → 버튼 3개 (Paper 03 Certificate CTA) ── */}
        <section className={styles.certCta}>
          <h2 className={styles.certCtaTitle}>{certTitle}</h2>
          <Link
            href={`/b/${data.bottle.nfcCode}/certificate`}
            className={`${styles.certPreview} ${styles.reveal}`}
            data-reveal
            aria-label={extra.passportCta}
          >
            <CertificateCard card={card} locale={locale} elevated />
          </Link>
          <div className={styles.certCtaButtons}>
            <Link href={`/b/${data.bottle.nfcCode}/certificate`} className={ui.primaryD}>
              <span>{extra.passportCta}</span>
              <span className={ui.chev} aria-hidden>›</span>
            </Link>
            <Link href={`/b/${data.bottle.nfcCode}/owner`} className={ui.secondaryD}>
              <span>{extra.passportManage}</span>
              <span className={ui.chev} aria-hidden>›</span>
            </Link>

            {/* 다음 인양 소식 — 링크로 열어 그 자리에 구독 칸을 편다 */}
            {nlStatus === "done" ? (
              <p className={styles.newsDone}>{extra.newsletterDone}</p>
            ) : nlOpen ? (
              <form className={styles.newsForm} onSubmit={onSubscribe} noValidate>
                <label className={`${ui.field} ${nlErr ? ui.fieldError : ""}`}>
                  <span className={ui.fieldLabel}>{extra.passportNews}</span>
                  <input
                    type="email"
                    className={ui.input}
                    placeholder={extra.newsletterPlaceholder}
                    value={nlEmail}
                    onChange={(e) => setNlEmail(e.target.value)}
                    autoComplete="email"
                    inputMode="email"
                    aria-invalid={!!nlErr}
                    autoFocus
                  />
                </label>
                {nlErr && <p className={ui.error}>{nlErr}</p>}
                <button
                  type="submit"
                  className={`${ui.secondaryD} ${nlStatus === "submitting" ? styles.newsBusy : ""}`}
                  disabled={nlStatus === "submitting"}
                  aria-busy={nlStatus === "submitting"}
                >
                  <span>{extra.newsletterConfirm}</span>
                  <span className={ui.chev} aria-hidden>›</span>
                </button>
              </form>
            ) : (
              <button type="button" className={`${ui.linkD} ${styles.newsLink}`} onClick={() => setNlOpen(true)}>
                {extra.passportNews}
              </button>
            )}
          </div>
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
