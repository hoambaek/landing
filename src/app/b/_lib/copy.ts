/**
 * /b 병 기록 페이지 전용 카피 (5개 언어).
 * 정본: docs/plans/musedemaree/2026-07-17-nfc-bottle-page-v2-plan.md (시문·표기 규칙)
 * 표기 규칙: 입수·인양은 월·계절만(날짜·일수 금지), 용어는 "입수"(침지 금지).
 */

export type BottleLocale = "ko" | "en" | "fr" | "ja" | "zh";

export const BOTTLE_LOCALES: { code: BottleLocale; short: string; native: string; flag: string }[] = [
  { code: "ko", short: "KO", native: "한국어", flag: "/flags/kr.svg" },
  { code: "en", short: "EN", native: "English", flag: "/flags/us.svg" },
  { code: "fr", short: "FR", native: "Français", flag: "/flags/fr.svg" },
  { code: "ja", short: "JA", native: "日本語", flag: "/flags/jp.svg" },
  { code: "zh", short: "ZH", native: "中文", flag: "/flags/cn.svg" },
];

type MetricKey = "temp" | "salinity" | "tide" | "current" | "pressure" | "tidal" | "wave" | "period";

export interface BottleCopy {
  verified: string;
  titleText: string; // ko는 PNG(alt로 사용), 나머지는 텍스트 렌더
  subLabel: string; // {year} 치환
  immersion: string;
  retrieval: string;
  planned: string;
  months: string[]; // index 0 = 1월
  seasons: { winter: string; spring: string; summer: string; autumn: string };
  journey: { origin: string; originSub: string; aging: string; agingSub: string };
  obsHead: string;
  obsHeadPartial: string; // 인양 전
  metrics: Record<MetricKey, string>;
  metricsShort: Record<MetricKey, string>;
  converged: string;
  converging: string; // 인양 전
  passport: { maison: string; cepage: string; style: string };
  gating: string;
  cta: string; // {serial} 치환 (병 번호 있을 때)
  ctaNoSerial: string; // 병 번호 없는 병용
  ctaSub: string;
  footerTagline: string;
  notFoundTitle: string;
  notFoundBody: string;
}

export const BOTTLE_COPY: Record<BottleLocale, BottleCopy> = {
  ko: {
    verified: "NFC 인증 완료 · RECORD AUTHENTICATED",
    titleText: "바다가 기억하는 일 년",
    subLabel: "수온의 기록 · {year}",
    immersion: "입수",
    retrieval: "인양",
    planned: "예정",
    months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    seasons: { winter: "겨울", spring: "봄", summer: "여름", autumn: "가을" },
    journey: { origin: "샹파뉴", originSub: "VENTEUIL", aging: "병숙성", agingSub: "MAISON" },
    obsHead: "해양 관측 · 1년 평균",
    obsHeadPartial: "해양 관측 · 입수 후 평균",
    metrics: {
      temp: "수온", salinity: "염분", tide: "조위", current: "해류 속도",
      pressure: "수압", tidal: "조류 유속", wave: "파고", period: "파주기",
    },
    metricsShort: { temp: "수온", salinity: "염분", tide: "조위", current: "해류", pressure: "수압", tidal: "조류", wave: "파고", period: "파주기" },
    converged: "1년의 바다가 이 병에 담겼습니다.",
    converging: "바다가 지금도 이 병에 담기고 있습니다.",
    passport: { maison: "MAISON", cepage: "CÉPAGE", style: "STYLE" },
    gating: "이 병의 기록 전문은 인양 참관 초대와 함께 공개됩니다.",
    cta: "N° {serial}의 주인으로 이름을 남기다",
    ctaNoSerial: "이 병의 주인으로 이름을 남기다",
    ctaSub: "REGISTRE · OCEAN CELLAR™",
    footerTagline: "바다의 시간을 기록하는 디지털 아카이브.",
    notFoundTitle: "병 정보를 찾을 수 없습니다",
    notFoundBody: "유효하지 않은 코드이거나 아직 등록되지 않은 병입니다.",
  },
  en: {
    verified: "RECORD AUTHENTICATED · NFC",
    titleText: "A Year the Sea Remembers",
    subLabel: "TEMPERATURE RECORD · {year}",
    immersion: "IMMERSION",
    retrieval: "RETRIEVAL",
    planned: "PLANNED",
    months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    seasons: { winter: "WINTER", spring: "SPRING", summer: "SUMMER", autumn: "AUTUMN" },
    journey: { origin: "Champagne", originSub: "VENTEUIL", aging: "Bottle aging", agingSub: "MAISON" },
    obsHead: "OCEAN OBSERVATION · ANNUAL MEAN",
    obsHeadPartial: "OCEAN OBSERVATION · SINCE IMMERSION",
    metrics: {
      temp: "WATER TEMP", salinity: "SALINITY", tide: "TIDE LEVEL", current: "CURRENT SPEED",
      pressure: "PRESSURE", tidal: "TIDAL CURRENT", wave: "WAVE HEIGHT", period: "WAVE PERIOD",
    },
    metricsShort: { temp: "TEMP", salinity: "SALT", tide: "TIDE", current: "CURRENT", pressure: "PRESS", tidal: "TIDAL", wave: "WAVE", period: "PERIOD" },
    converged: "A year of the sea, held in this bottle.",
    converging: "The sea is still settling into this bottle.",
    passport: { maison: "MAISON", cepage: "CÉPAGE", style: "STYLE" },
    gating: "The complete record opens with an invitation to the retrieval.",
    cta: "Sign the Registre as owner of N° {serial}",
    ctaNoSerial: "Sign the Registre as this bottle's owner",
    ctaSub: "REGISTRE · OCEAN CELLAR™",
    footerTagline: "A digital archive of the sea's time.",
    notFoundTitle: "Bottle not found",
    notFoundBody: "This code is invalid or not yet registered.",
  },
  fr: {
    verified: "ENREGISTREMENT AUTHENTIFIÉ · NFC",
    titleText: "Une année dont la mer se souvient",
    subLabel: "RELEVÉ DE TEMPÉRATURE · {year}",
    immersion: "IMMERSION",
    retrieval: "REMONTÉE",
    planned: "PRÉVUE",
    months: ["JANV", "FÉVR", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEPT", "OCT", "NOV", "DÉC"],
    seasons: { winter: "HIVER", spring: "PRINTEMPS", summer: "ÉTÉ", autumn: "AUTOMNE" },
    journey: { origin: "Champagne", originSub: "VENTEUIL", aging: "Élevage", agingSub: "MAISON" },
    obsHead: "OBSERVATION MARINE · MOYENNE ANNUELLE",
    obsHeadPartial: "OBSERVATION MARINE · DEPUIS L'IMMERSION",
    metrics: {
      temp: "TEMPÉRATURE", salinity: "SALINITÉ", tide: "MARÉE", current: "COURANT",
      pressure: "PRESSION", tidal: "COURANT DE MARÉE", wave: "HOULE", period: "PÉRIODE",
    },
    metricsShort: { temp: "TEMP", salinity: "SEL", tide: "MARÉE", current: "COURANT", pressure: "PRESS", tidal: "C. MARÉE", wave: "HOULE", period: "PÉRIODE" },
    converged: "Une année de mer, recueillie dans cette bouteille.",
    converging: "La mer se dépose encore dans cette bouteille.",
    passport: { maison: "MAISON", cepage: "CÉPAGE", style: "STYLE" },
    gating: "Le relevé complet s'ouvre avec une invitation à la remontée.",
    cta: "Inscrire votre nom au Registre du N° {serial}",
    ctaNoSerial: "Inscrire votre nom au Registre",
    ctaSub: "REGISTRE · OCEAN CELLAR™",
    footerTagline: "Une archive numérique du temps de la mer.",
    notFoundTitle: "Bouteille introuvable",
    notFoundBody: "Ce code est invalide ou n'est pas encore enregistré.",
  },
  ja: {
    verified: "NFC認証済み · RECORD AUTHENTICATED",
    titleText: "海が記憶する一年",
    subLabel: "水温の記録 · {year}",
    immersion: "入水",
    retrieval: "引き揚げ",
    planned: "予定",
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    seasons: { winter: "冬", spring: "春", summer: "夏", autumn: "秋" },
    journey: { origin: "シャンパーニュ", originSub: "VENTEUIL", aging: "瓶熟成", agingSub: "MAISON" },
    obsHead: "海洋観測 · 年間平均",
    obsHeadPartial: "海洋観測 · 入水後平均",
    metrics: {
      temp: "水温", salinity: "塩分", tide: "潮位", current: "海流速度",
      pressure: "水圧", tidal: "潮流速度", wave: "波高", period: "波周期",
    },
    metricsShort: { temp: "水温", salinity: "塩分", tide: "潮位", current: "海流", pressure: "水圧", tidal: "潮流", wave: "波高", period: "波周期" },
    converged: "一年の海が、このボトルに収められました。",
    converging: "海は今も、このボトルに刻まれています。",
    passport: { maison: "MAISON", cepage: "CÉPAGE", style: "STYLE" },
    gating: "この記録の全文は、引き揚げ立ち会いへの招待とともに公開されます。",
    cta: "N° {serial} の所有者として名を残す",
    ctaNoSerial: "この一本の所有者として名を残す",
    ctaSub: "REGISTRE · OCEAN CELLAR™",
    footerTagline: "海の時間を記録するデジタルアーカイブ。",
    notFoundTitle: "ボトルが見つかりません",
    notFoundBody: "コードが無効か、まだ登録されていません。",
  },
  zh: {
    verified: "NFC认证完成 · RECORD AUTHENTICATED",
    titleText: "大海记得的一年",
    subLabel: "水温记录 · {year}",
    immersion: "入水",
    retrieval: "打捞",
    planned: "预定",
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    seasons: { winter: "冬", spring: "春", summer: "夏", autumn: "秋" },
    journey: { origin: "香槟区", originSub: "VENTEUIL", aging: "瓶中陈酿", agingSub: "MAISON" },
    obsHead: "海洋观测 · 年均值",
    obsHeadPartial: "海洋观测 · 入水后均值",
    metrics: {
      temp: "水温", salinity: "盐度", tide: "潮位", current: "海流速度",
      pressure: "水压", tidal: "潮流流速", wave: "浪高", period: "波周期",
    },
    metricsShort: { temp: "水温", salinity: "盐度", tide: "潮位", current: "海流", pressure: "水压", tidal: "潮流", wave: "浪高", period: "波周期" },
    converged: "一年的大海，都封存在这瓶酒中。",
    converging: "大海仍在注入这瓶酒。",
    passport: { maison: "MAISON", cepage: "CÉPAGE", style: "STYLE" },
    gating: "完整记录将随打捞观礼邀请一同公开。",
    cta: "以您之名登记 N° {serial}",
    ctaNoSerial: "以您之名登记此瓶",
    ctaSub: "REGISTRE · OCEAN CELLAR™",
    footerTagline: "记录大海时间的数字档案。",
    notFoundTitle: "未找到该瓶信息",
    notFoundBody: "代码无效或尚未登记。",
  },
};

/** 제품 메타 — plan 앱 PRODUCTS와 동기 유지. 여권 필드는 확정 정보만(추정 금지). */
export interface ProductMeta {
  name: string;
  quantity: number;
  image: string;
  cepage?: string;
  style?: string;
}

export const PRODUCT_META: Record<string, ProductMeta> = {
  first_edition: { name: "2025 First Edition", quantity: 50, image: "/images/04-2.webp" },
  en_lieu_sur_brut: { name: "En Lieu Sûr", quantity: 200, image: "/images/01-2.webp", style: "Brut" },
  en_lieu_sur_magnum: { name: "En Lieu Sûr Magnum", quantity: 24, image: "/images/02-2.webp", style: "Brut" },
  element_de_surprise: { name: "Élément de Surprise", quantity: 110, image: "/images/03-2.webp", cepage: "Chardonnay", style: "Non-dosé" },
  atomes_crochus_1y: { name: "Atomes Crochus", quantity: 100, image: "/images/05-2.webp", cepage: "Petit Meslier", style: "Ultra-Brut" },
  atomes_crochus_2y: { name: "Atomes Crochus", quantity: 40, image: "/images/06.webp", cepage: "Petit Meslier", style: "Ultra-Brut" },
  atomes_crochus: { name: "Atomes Crochus", quantity: 100, image: "/images/05-2.webp", cepage: "Petit Meslier", style: "Ultra-Brut" },
};

export const MAISON_NAME = "Mignon-Boulard";
