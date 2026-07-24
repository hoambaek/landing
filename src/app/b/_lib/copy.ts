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
    titleText: "바다가 새긴 사계절",
    subLabel: "남해 30m · 사계절의 기록",
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
    titleText: "Four Seasons the Sea Inscribed",
    subLabel: "NAMHAE 30M · FOUR SEASONS ON RECORD",
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
    titleText: "Quatre saisons gravées par la mer",
    subLabel: "NAMHAE 30M · QUATRE SAISONS DE RELEVÉS",
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
    titleText: "海が刻んだ四季",
    subLabel: "南海 30m · 四季の記録",
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
    titleText: "大海刻下的四季",
    subLabel: "南海 30m · 四季记录",
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

/* ── 입장 페이지 카피 (5개 언어) ───────────────────────────── */
export interface EntryCopy {
  /* 히어로 · 풀필름 */
  filmCaption: string; // "바다 아래의 시간이 깨어납니다"
  filmMeta: string; // "FULL FILM · 00:08"
  /* 01 Bottle Identity */
  identityEyebrow: string; // "NFC AUTHENTICATED"
  identityTagline: string; // "OCEAN AGED · FOUR SEASONS"
  identityBody: string; // {total}·{serial} 치환, \n = 줄바꿈
  identityBodyNoSerial: string; // serial 미부여 시
  /* 02 Provenance */
  provEyebrow: string; // "PROVENANCE"
  provTitle: string; // \n = 줄바꿈
  provBody: string; // \n = 줄바꿈
  fact1Label: string;
  fact1Value: string;
  fact1Sub: string;
  fact2Label: string;
  fact2Value: string;
  fact2Sub: string;
  fact3Label: string;
  fact3Value: string;
  fact3Sub: string;
  provHint: string; // "전체 숙성 기록은 소유 등록 후 열립니다"
  /* 03 Claim Ownership */
  ownEyebrow: string; // "OWNERSHIP"
  ownTitle: string; // \n = 줄바꿈
  ownBody: string; // {serial} 치환, \n = 줄바꿈
  ownBodyNoSerial: string;
  nameLabel: string; // "이름 · NAME"
  namePlaceholder: string;
  emailLabel: string; // "이메일 · EMAIL"
  emailPlaceholder: string;
  privacyNote: string;
  submit: string; // "이름을 새기다"
  submitting: string;
  /* 각인 공개 (등록 완료 화면) */
  inscribedEyebrow: string; // "등록 완료"
  inscribedTitle: string; // \n = 줄바꿈
  inscribedSub: string;
  inscribedOwnerLabel: string; // "첫 소유자"
  inscribedCta: string; // "바다의 기록 보기"
  inscribedCtaSub: string;
  /* 검증 */
  errName: string;
  errEmail: string;
  errGeneric: string;
}

export const ENTRY_COPY: Record<BottleLocale, EntryCopy> = {
  ko: {
    filmCaption: "바다 아래의 시간이 깨어납니다",
    filmMeta: "FULL FILM · 00:08",
    identityEyebrow: "NFC AUTHENTICATED",
    identityTagline: "OCEAN AGED · FOUR SEASONS",
    identityBody: "오직 {total}병만 존재하는 첫 번째 해저 숙성 에디션.\n당신이 태그한 병은 그중 {serial}번째 기록입니다.",
    identityBodyNoSerial: "오직 {total}병만 존재하는 첫 번째 해저 숙성 에디션.\n당신이 태그한 병이 그 기록의 일부입니다.",
    provEyebrow: "PROVENANCE",
    provTitle: "바다가 남긴\n세 가지 증거",
    provBody: "이 병이 지나온 시간은 감상이 아니라\n실제 관측 기록으로 보존되어 있습니다.",
    fact1Label: "숙성 수심",
    fact1Value: "30m",
    fact1Sub: "남해 해저",
    fact2Label: "숙성 기간",
    fact2Value: "12개월",
    fact2Sub: "사계절의 변화",
    fact3Label: "해양 관측",
    fact3Value: "8개 항목",
    fact3Sub: "실제 측정 데이터",
    provHint: "전체 숙성 기록은 소유 등록 후 열립니다",
    ownEyebrow: "OWNERSHIP",
    ownTitle: "이 병의 기록에\n당신의 이름을 남기세요.",
    ownBody: "N° {serial}의 첫 소유자로 기록되며,\n바다 아래에서 보낸 모든 시간이 열립니다.",
    ownBodyNoSerial: "이 병의 첫 소유자로 기록되며,\n바다 아래에서 보낸 모든 시간이 열립니다.",
    nameLabel: "이름 · NAME",
    namePlaceholder: "인증서에 남길 이름",
    emailLabel: "이메일 · EMAIL",
    emailPlaceholder: "디지털 인증서를 받을 주소",
    privacyNote: "이름과 이메일은 소유 기록 및 디지털 인증서 발급에만 사용됩니다.",
    submit: "이름을 새기다",
    submitting: "새기는 중",
    inscribedEyebrow: "등록 완료",
    inscribedTitle: "당신의 이름이\n바다의 기록에 남았습니다.",
    inscribedSub: "소유 인증이 완료되었습니다.",
    inscribedOwnerLabel: "첫 소유자",
    inscribedCta: "바다의 기록 보기",
    inscribedCtaSub: "바다가 남긴 사계절의 기록을 확인합니다.",
    errName: "이름을 입력해 주세요.",
    errEmail: "이메일 주소를 확인해 주세요.",
    errGeneric: "잠시 후 다시 시도해 주세요.",
  },
  en: {
    filmCaption: "The time beneath the sea awakens",
    filmMeta: "FULL FILM · 00:08",
    identityEyebrow: "NFC AUTHENTICATED",
    identityTagline: "OCEAN AGED · FOUR SEASONS",
    identityBody: "The first ocean-aged edition, only {total} bottles in existence.\nThe bottle you tapped is record N° {serial} of them.",
    identityBodyNoSerial: "The first ocean-aged edition, only {total} bottles in existence.\nThe bottle you tapped is part of that record.",
    provEyebrow: "PROVENANCE",
    provTitle: "Three proofs\nthe sea left behind",
    provBody: "The time this bottle passed through is not sentiment\nbut real observation, kept on record.",
    fact1Label: "Cellaring depth",
    fact1Value: "30m",
    fact1Sub: "South Sea bed",
    fact2Label: "Cellaring period",
    fact2Value: "12 months",
    fact2Sub: "Four seasons of change",
    fact3Label: "Ocean readings",
    fact3Value: "8 measures",
    fact3Sub: "Real measured data",
    provHint: "The full cellaring record opens after ownership is registered",
    ownEyebrow: "OWNERSHIP",
    ownTitle: "Leave your name\non this bottle's record.",
    ownBody: "Recorded as the first owner of N° {serial},\nand every hour spent beneath the sea opens to you.",
    ownBodyNoSerial: "Recorded as this bottle's first owner,\nand every hour spent beneath the sea opens to you.",
    nameLabel: "NAME",
    namePlaceholder: "Name for the certificate",
    emailLabel: "EMAIL",
    emailPlaceholder: "Address to receive the certificate",
    privacyNote: "Your name and email are used only for the ownership record and issuing the digital certificate.",
    submit: "Inscribe your name",
    submitting: "Inscribing",
    inscribedEyebrow: "REGISTERED",
    inscribedTitle: "Your name now stays\non the record of the sea.",
    inscribedSub: "Ownership has been verified.",
    inscribedOwnerLabel: "First owner",
    inscribedCta: "View the sea's record",
    inscribedCtaSub: "See the four seasons the sea left behind.",
    errName: "Please enter your name.",
    errEmail: "Please check your email address.",
    errGeneric: "Please try again in a moment.",
  },
  fr: {
    filmCaption: "Le temps sous la mer s'éveille",
    filmMeta: "FULL FILM · 00:08",
    identityEyebrow: "NFC AUTHENTICATED",
    identityTagline: "OCEAN AGED · FOUR SEASONS",
    identityBody: "La première édition élevée en mer, seulement {total} bouteilles existantes.\nLa bouteille que vous avez scannée en est le relevé N° {serial}.",
    identityBodyNoSerial: "La première édition élevée en mer, seulement {total} bouteilles existantes.\nLa bouteille que vous avez scannée fait partie de ce relevé.",
    provEyebrow: "PROVENANCE",
    provTitle: "Trois preuves\nlaissées par la mer",
    provBody: "Le temps traversé par cette bouteille n'est pas un sentiment\nmais une observation réelle, conservée au relevé.",
    fact1Label: "Profondeur d'élevage",
    fact1Value: "30m",
    fact1Sub: "Fond de la mer du Sud",
    fact2Label: "Durée d'élevage",
    fact2Value: "12 mois",
    fact2Sub: "Le cycle des saisons",
    fact3Label: "Relevés marins",
    fact3Value: "8 mesures",
    fact3Sub: "Données réellement mesurées",
    provHint: "Le relevé complet s'ouvre après l'enregistrement de la propriété",
    ownEyebrow: "OWNERSHIP",
    ownTitle: "Laissez votre nom\nau relevé de cette bouteille.",
    ownBody: "Inscrit comme premier propriétaire du N° {serial},\net chaque heure passée sous la mer s'ouvre à vous.",
    ownBodyNoSerial: "Inscrit comme premier propriétaire de cette bouteille,\net chaque heure passée sous la mer s'ouvre à vous.",
    nameLabel: "NOM",
    namePlaceholder: "Nom pour le certificat",
    emailLabel: "E-MAIL",
    emailPlaceholder: "Adresse pour recevoir le certificat",
    privacyNote: "Votre nom et votre e-mail servent uniquement au relevé de propriété et à l'émission du certificat numérique.",
    submit: "Inscrire votre nom",
    submitting: "Inscription",
    inscribedEyebrow: "ENREGISTRÉ",
    inscribedTitle: "Votre nom demeure désormais\nau relevé de la mer.",
    inscribedSub: "La propriété a été authentifiée.",
    inscribedOwnerLabel: "Premier propriétaire",
    inscribedCta: "Voir le relevé de la mer",
    inscribedCtaSub: "Découvrez les quatre saisons laissées par la mer.",
    errName: "Veuillez saisir votre nom.",
    errEmail: "Veuillez vérifier votre adresse e-mail.",
    errGeneric: "Veuillez réessayer dans un instant.",
  },
  ja: {
    filmCaption: "海の底の時間が目を覚まします",
    filmMeta: "FULL FILM · 00:08",
    identityEyebrow: "NFC AUTHENTICATED",
    identityTagline: "OCEAN AGED · FOUR SEASONS",
    identityBody: "わずか{total}本のみ存在する、最初の海底熟成エディション。\nあなたがタグした一本は、その{serial}番目の記録です。",
    identityBodyNoSerial: "わずか{total}本のみ存在する、最初の海底熟成エディション。\nあなたがタグした一本は、その記録の一部です。",
    provEyebrow: "PROVENANCE",
    provTitle: "海が残した\n三つの証",
    provBody: "この一本が辿った時間は感傷ではなく\n実際の観測記録として保存されています。",
    fact1Label: "熟成水深",
    fact1Value: "30m",
    fact1Sub: "南海の海底",
    fact2Label: "熟成期間",
    fact2Value: "12か月",
    fact2Sub: "四季の移ろい",
    fact3Label: "海洋観測",
    fact3Value: "8項目",
    fact3Sub: "実測データ",
    provHint: "全熟成記録は所有登録の後に開きます",
    ownEyebrow: "OWNERSHIP",
    ownTitle: "この一本の記録に\nあなたの名を残してください。",
    ownBody: "N° {serial} の最初の所有者として記録され、\n海の底で過ごしたすべての時間が開きます。",
    ownBodyNoSerial: "この一本の最初の所有者として記録され、\n海の底で過ごしたすべての時間が開きます。",
    nameLabel: "名前 · NAME",
    namePlaceholder: "証明書に残す名前",
    emailLabel: "メール · EMAIL",
    emailPlaceholder: "デジタル証明書を受け取る宛先",
    privacyNote: "お名前とメールは所有記録およびデジタル証明書の発行にのみ使用されます。",
    submit: "名を刻む",
    submitting: "刻んでいます",
    inscribedEyebrow: "登録完了",
    inscribedTitle: "あなたの名が\n海の記録に残りました。",
    inscribedSub: "所有認証が完了しました。",
    inscribedOwnerLabel: "最初の所有者",
    inscribedCta: "海の記録を見る",
    inscribedCtaSub: "海が残した四季の記録を確認します。",
    errName: "お名前を入力してください。",
    errEmail: "メールアドレスをご確認ください。",
    errGeneric: "しばらくしてからもう一度お試しください。",
  },
  zh: {
    filmCaption: "海底的时间正在苏醒",
    filmMeta: "FULL FILM · 00:08",
    identityEyebrow: "NFC AUTHENTICATED",
    identityTagline: "OCEAN AGED · FOUR SEASONS",
    identityBody: "仅存 {total} 瓶的首个海底熟成版本。\n你所轻触的这一瓶，是其中第 {serial} 号记录。",
    identityBodyNoSerial: "仅存 {total} 瓶的首个海底熟成版本。\n你所轻触的这一瓶，是这份记录的一部分。",
    provEyebrow: "PROVENANCE",
    provTitle: "大海留下的\n三重凭证",
    provBody: "这一瓶走过的时间并非感怀，\n而是以真实观测记录保存下来。",
    fact1Label: "熟成水深",
    fact1Value: "30m",
    fact1Sub: "南海海底",
    fact2Label: "熟成时长",
    fact2Value: "12个月",
    fact2Sub: "四季更替",
    fact3Label: "海洋观测",
    fact3Value: "8个项目",
    fact3Sub: "真实测量数据",
    provHint: "完整熟成记录将在登记所有权后开启",
    ownEyebrow: "OWNERSHIP",
    ownTitle: "在这一瓶的记录上\n留下你的名字。",
    ownBody: "作为 N° {serial} 的首位所有者被记录，\n它在海底度过的所有时间将向你开启。",
    ownBodyNoSerial: "作为此瓶的首位所有者被记录，\n它在海底度过的所有时间将向你开启。",
    nameLabel: "姓名 · NAME",
    namePlaceholder: "留在证书上的名字",
    emailLabel: "邮箱 · EMAIL",
    emailPlaceholder: "接收数字证书的地址",
    privacyNote: "你的姓名与邮箱仅用于所有权记录及数字证书的签发。",
    submit: "刻下你的名字",
    submitting: "刻写中",
    inscribedEyebrow: "登记完成",
    inscribedTitle: "你的名字\n已留在大海的记录中。",
    inscribedSub: "所有权认证已完成。",
    inscribedOwnerLabel: "首位所有者",
    inscribedCta: "查看大海的记录",
    inscribedCtaSub: "查看大海留下的四季记录。",
    errName: "请输入你的名字。",
    errEmail: "请检查你的邮箱地址。",
    errGeneric: "请稍后再试。",
  },
};

/* ── 기록 페이지 추가 카피 (표·뉴스레터, 5개 언어) ───────── */
export interface RecordExtraCopy {
  provHead: string;
  seaHead: string;
  provLabels: { maison: string; region: string; cepage: string; style: string; elevage: string };
  seaLabels: { immersion: string; retrieval: string; duration: string; depth: string; location: string };
  wando: string; // 완도 해역
  newsletterLine: string;
  newsletterCta: string;
  newsletterPlaceholder: string;
  newsletterConfirm: string;
  newsletterDone: string;
  newsletterErr: string;
  brandPage: string;
  blogPage: string;
  /* Eight Currents 인트로 (기록 8줄기 섹션 도입부) */
  ecEyebrow: string;
  ecTitle: string; // \n = 줄바꿈
  ecBody: string; // \n = 줄바꿈
  ecLegend: string;
  /* 디지털 인증서 (04) */
  certTag: string; // "소유 인증서"
  certDedication: string; // \n = 줄바꿈
  certVerifiedShort: string; // "NFC 인증 완료"
  certSeal: string; // 진위 확인 문구
  certAuthHead: string; // "인증 정보"
  certIdLabel: string; // "인증서 ID"
  certStatusLabel: string; // "인증 상태"
  certSignHead: string; // "디지털 서명"
  certSave: string; // "인증서 저장"
  certShare: string; // "공유하기"
  certBack: string; // "바다의 기록으로 돌아가기"
  certOwnerFallback: string; // 소유자 미등록 표기
  certSaving: string; // 저장 진행 중
  certSaved: string; // 저장 완료 안내
  certSaveDone: string; // "완료"
  certShareText: string; // 공유 텍스트
  /* 소유 관리 (03A) */
  ownHead: string; // "등록된 소유자"
  ownVerified: string; // "소유 등록 완료"
  ownLinkedSub: string; // "해저 숙성 · 남해 · 12개월"
  ownAccountHead: string; // "소유자 정보"
  ownEditName: string; // "이름과 이메일 수정"
  ownEditNameSub: string;
  ownNotify: string; // "소식 알림"
  ownNotifySub: string;
  ownRightsHead: string; // "소유권"
  ownTransfer: string; // "소유권 이전"
  ownTransferSub: string;
  ownTransferCta: string; // "본인 인증 후 이전하기"
  ownSoon: string; // 준비 중 안내
  ownBackRecord: string; // "바다의 기록으로 돌아가기"
  /* Owner Services (기록 페이지 하단 · Digital Passport) */
  passportTitle: string; // \n = 줄바꿈
  passportBody: string; // \n = 줄바꿈
  passportCta: string; // "디지털 인증서 보기"
  passportSave: string; // "인증서 저장"
  passportManage: string; // "소유 정보 관리"
}

export const RECORD_EXTRA: Record<BottleLocale, RecordExtraCopy> = {
  ko: {
    provHead: "원산지 · 샹파뉴",
    seaHead: "해저 숙성 · 남해",
    provLabels: { maison: "메종", region: "지역", cepage: "품종", style: "스타일", elevage: "숙성" },
    seaLabels: { immersion: "입수", retrieval: "인양", duration: "숙성 기간", depth: "숙성 수심", location: "숙성 위치" },
    wando: "완도 해역",
    newsletterLine: "다음 인양과 새 기록의 소식을 먼저 받아보세요.",
    newsletterCta: "뉴스레터 구독",
    newsletterPlaceholder: "you@example.com",
    newsletterConfirm: "구독하기",
    newsletterDone: "구독이 시작되었습니다. 감사합니다.",
    newsletterErr: "이메일 주소를 확인해 주세요.",
    brandPage: "브랜드 페이지",
    blogPage: "블로그 페이지",
    ecEyebrow: "EIGHT CURRENTS",
    ecTitle: "여덟 개의 관측이\n한 병의 시간을 그립니다.",
    ecBody: "수온·염분·조위·해류·수압·조류·파고·파주기의\n사계절 변화를 하나의 흐름으로 기록했습니다.",
    ecLegend: "금빛 선 · 수온",
    certTag: "소유 인증서",
    certDedication: "이 병과 바다의 기록을\n당신의 이름으로 남깁니다",
    certVerifiedShort: "NFC 인증 완료",
    certSeal: "NFC 원본 태그와 등록 기록이 일치합니다.",
    certAuthHead: "인증 정보",
    certIdLabel: "인증서 ID",
    certStatusLabel: "인증 상태",
    certSignHead: "디지털 서명",
    certSave: "인증서 저장",
    certShare: "공유하기",
    certBack: "바다의 기록으로 돌아가기",
    certOwnerFallback: "소유자 미등록",
    certSaving: "이미지 만드는 중",
    certSaved: "사진 보관함에 저장됨",
    certSaveDone: "완료",
    certShareText: "뮤즈드마레 소유 인증서",
    ownHead: "등록된 소유자",
    ownVerified: "소유 등록 완료",
    ownLinkedSub: "해저 숙성 · 남해 · 12개월",
    ownAccountHead: "소유자 정보",
    ownEditName: "이름과 이메일 수정",
    ownEditNameSub: "인증서와 소유 기록에 반영됩니다.",
    ownNotify: "소식 알림",
    ownNotifySub: "다음 인양과 새 기록을 알려드립니다.",
    ownRightsHead: "소유권",
    ownTransfer: "소유권 이전",
    ownTransferSub: "새 소유자에게 병과 디지털 인증서의 소유 기록을 이전합니다. 이전 후에는 되돌릴 수 없습니다.",
    ownTransferCta: "본인 인증 후 이전하기",
    ownSoon: "본인 인증 기능 준비 중입니다.",
    ownBackRecord: "바다의 기록으로 돌아가기",
    passportTitle: "이 병의 디지털 인증서를\n확인하세요.",
    passportBody: "소유 정보와 해저 숙성 기록이\n공식 인증서에 담겨 있습니다.",
    passportCta: "디지털 인증서 보기",
    passportSave: "인증서 저장",
    passportManage: "소유 정보 관리",
  },
  en: {
    provHead: "ORIGIN · CHAMPAGNE",
    seaHead: "SUBSEA AGING · NAMHAE",
    provLabels: { maison: "MAISON", region: "REGION", cepage: "CÉPAGE", style: "STYLE", elevage: "ÉLEVAGE" },
    seaLabels: { immersion: "IMMERSION", retrieval: "RETRIEVAL", duration: "AGING PERIOD", depth: "AGING DEPTH", location: "AGING SITE" },
    wando: "Wando waters",
    newsletterLine: "Be the first to hear of the next retrieval and new records.",
    newsletterCta: "Subscribe to the newsletter",
    newsletterPlaceholder: "you@example.com",
    newsletterConfirm: "Subscribe",
    newsletterDone: "You're subscribed. Thank you.",
    newsletterErr: "Please check your email address.",
    brandPage: "Brand page",
    blogPage: "Journal",
    ecEyebrow: "EIGHT CURRENTS",
    ecTitle: "Eight readings\ndraw the time of one bottle.",
    ecBody: "Temperature, salinity, tide, current, pressure, flow, wave height and period —\nfour seasons of change kept as one continuous stream.",
    ecLegend: "Golden line · temperature",
    certTag: "CERTIFICATE OF OWNERSHIP",
    certDedication: "This bottle and the sea's record,\nkept in your name",
    certVerifiedShort: "NFC VERIFIED",
    certSeal: "The original NFC tag matches the registration record.",
    certAuthHead: "Certification",
    certIdLabel: "Certificate ID",
    certStatusLabel: "Status",
    certSignHead: "Digital signature",
    certSave: "Save certificate",
    certShare: "Share",
    certBack: "Back to the sea's record",
    certOwnerFallback: "Owner not registered",
    certSaving: "Rendering image",
    certSaved: "Saved to your photos",
    certSaveDone: "Done",
    certShareText: "Muse de Marée certificate of ownership",
    ownHead: "Registered owner",
    ownVerified: "Ownership registered",
    ownLinkedSub: "Subsea aging · Namhae · 12 months",
    ownAccountHead: "Owner details",
    ownEditName: "Edit name & email",
    ownEditNameSub: "Reflected in the certificate and ownership record.",
    ownNotify: "News alerts",
    ownNotifySub: "We'll tell you of the next retrieval and new records.",
    ownRightsHead: "Ownership",
    ownTransfer: "Transfer ownership",
    ownTransferSub: "Transfer the bottle and its digital certificate to a new owner. This cannot be undone.",
    ownTransferCta: "Verify identity to transfer",
    ownSoon: "Identity verification is coming soon.",
    ownBackRecord: "Back to the sea's record",
    passportTitle: "View this bottle's\ndigital certificate.",
    passportBody: "Ownership and the subsea aging record\nare held in the official certificate.",
    passportCta: "View digital certificate",
    passportSave: "Save certificate",
    passportManage: "Manage ownership",
  },
  fr: {
    provHead: "ORIGINE · CHAMPAGNE",
    seaHead: "VIEILLISSEMENT SOUS-MARIN · NAMHAE",
    provLabels: { maison: "MAISON", region: "RÉGION", cepage: "CÉPAGE", style: "STYLE", elevage: "ÉLEVAGE" },
    seaLabels: { immersion: "IMMERSION", retrieval: "REMONTÉE", duration: "DURÉE", depth: "PROFONDEUR", location: "LIEU" },
    wando: "Eaux de Wando",
    newsletterLine: "Soyez informé en premier de la prochaine remontée et des nouveaux relevés.",
    newsletterCta: "S'abonner à la newsletter",
    newsletterPlaceholder: "vous@exemple.com",
    newsletterConfirm: "S'abonner",
    newsletterDone: "Vous êtes abonné. Merci.",
    newsletterErr: "Veuillez vérifier votre adresse e-mail.",
    brandPage: "Page de marque",
    blogPage: "Journal",
    ecEyebrow: "EIGHT CURRENTS",
    ecTitle: "Huit relevés\ndessinent le temps d'une bouteille.",
    ecBody: "Température, salinité, marée, courant, pression, flux, hauteur et période de houle —\nquatre saisons de variations en un seul flux continu.",
    ecLegend: "Ligne dorée · température",
    certTag: "CERTIFICAT DE PROPRIÉTÉ",
    certDedication: "Cette bouteille et le relevé de la mer,\nà votre nom",
    certVerifiedShort: "NFC VÉRIFIÉ",
    certSeal: "Le tag NFC d'origine correspond au relevé d'enregistrement.",
    certAuthHead: "Certification",
    certIdLabel: "ID du certificat",
    certStatusLabel: "Statut",
    certSignHead: "Signature numérique",
    certSave: "Enregistrer le certificat",
    certShare: "Partager",
    certBack: "Retour au relevé de la mer",
    certOwnerFallback: "Propriétaire non enregistré",
    certSaving: "Rendu de l'image",
    certSaved: "Enregistré dans vos photos",
    certSaveDone: "Terminé",
    certShareText: "Certificat de propriété Muse de Marée",
    ownHead: "Propriétaire enregistré",
    ownVerified: "Propriété enregistrée",
    ownLinkedSub: "Vieillissement sous-marin · Namhae · 12 mois",
    ownAccountHead: "Détails du propriétaire",
    ownEditName: "Modifier nom et e-mail",
    ownEditNameSub: "Reporté sur le certificat et le relevé de propriété.",
    ownNotify: "Alertes actualités",
    ownNotifySub: "Nous vous informerons de la prochaine remontée et des nouveaux relevés.",
    ownRightsHead: "Propriété",
    ownTransfer: "Transfert de propriété",
    ownTransferSub: "Transférez la bouteille et son certificat numérique à un nouveau propriétaire. Irréversible.",
    ownTransferCta: "Vérifier l'identité pour transférer",
    ownSoon: "La vérification d'identité arrive bientôt.",
    ownBackRecord: "Retour au relevé de la mer",
    passportTitle: "Consultez le certificat\nnumérique de cette bouteille.",
    passportBody: "La propriété et le relevé de vieillissement sous-marin\nfigurent dans le certificat officiel.",
    passportCta: "Voir le certificat numérique",
    passportSave: "Enregistrer le certificat",
    passportManage: "Gérer la propriété",
  },
  ja: {
    provHead: "原産地 · シャンパーニュ",
    seaHead: "海底熟成 · 南海",
    provLabels: { maison: "メゾン", region: "地域", cepage: "品種", style: "スタイル", elevage: "熟成" },
    seaLabels: { immersion: "入水", retrieval: "引き揚げ", duration: "熟成期間", depth: "熟成水深", location: "熟成地" },
    wando: "莞島海域",
    newsletterLine: "次の引き揚げと新しい記録を、いち早くお届けします。",
    newsletterCta: "ニュースレターを購読",
    newsletterPlaceholder: "you@example.com",
    newsletterConfirm: "購読する",
    newsletterDone: "購読を開始しました。ありがとうございます。",
    newsletterErr: "メールアドレスをご確認ください。",
    brandPage: "ブランドページ",
    blogPage: "ジャーナル",
    ecEyebrow: "EIGHT CURRENTS",
    ecTitle: "八つの観測が\n一本の時間を描きます。",
    ecBody: "水温・塩分・潮位・海流・水圧・潮流・波高・波周期の\n四季の変化を一つの流れとして記録しました。",
    ecLegend: "金色の線 · 水温",
    certTag: "所有証明書",
    certDedication: "この一本と海の記録を\nあなたの名前で残します",
    certVerifiedShort: "NFC認証済み",
    certSeal: "NFCの原本タグと登録記録が一致します。",
    certAuthHead: "認証情報",
    certIdLabel: "証明書ID",
    certStatusLabel: "認証状態",
    certSignHead: "デジタル署名",
    certSave: "証明書を保存",
    certShare: "共有する",
    certBack: "海の記録へ戻る",
    certOwnerFallback: "所有者未登録",
    certSaving: "画像を作成中",
    certSaved: "写真に保存しました",
    certSaveDone: "完了",
    certShareText: "ミューズ・ド・マレ 所有証明書",
    ownHead: "登録された所有者",
    ownVerified: "所有登録完了",
    ownLinkedSub: "海底熟成 · 南海 · 12か月",
    ownAccountHead: "所有者情報",
    ownEditName: "名前とメールを編集",
    ownEditNameSub: "証明書と所有記録に反映されます。",
    ownNotify: "お知らせ",
    ownNotifySub: "次の引き揚げと新しい記録をお知らせします。",
    ownRightsHead: "所有権",
    ownTransfer: "所有権の移転",
    ownTransferSub: "新しい所有者へ一本とデジタル証明書の所有記録を移転します。移転後は取り消せません。",
    ownTransferCta: "本人認証して移転する",
    ownSoon: "本人認証機能は準備中です。",
    ownBackRecord: "海の記録へ戻る",
    passportTitle: "この一本のデジタル証明書を\nご確認ください。",
    passportBody: "所有情報と海底熟成の記録が\n公式証明書に収められています。",
    passportCta: "デジタル証明書を見る",
    passportSave: "証明書を保存",
    passportManage: "所有情報の管理",
  },
  zh: {
    provHead: "原产地 · 香槟区",
    seaHead: "海底熟成 · 南海",
    provLabels: { maison: "酒庄", region: "产区", cepage: "品种", style: "风格", elevage: "陈酿" },
    seaLabels: { immersion: "入水", retrieval: "打捞", duration: "熟成周期", depth: "熟成水深", location: "熟成地点" },
    wando: "莞岛海域",
    newsletterLine: "第一时间获知下一次打捞与新的记录。",
    newsletterCta: "订阅通讯",
    newsletterPlaceholder: "you@example.com",
    newsletterConfirm: "订阅",
    newsletterDone: "订阅已开始，谢谢。",
    newsletterErr: "请检查你的邮箱地址。",
    brandPage: "品牌页面",
    blogPage: "博客",
    ecEyebrow: "EIGHT CURRENTS",
    ecTitle: "八项观测\n描绘一瓶的时间。",
    ecBody: "水温·盐度·潮位·海流·水压·潮流·浪高·波周期的\n四季变化，汇成一条连续的流。",
    ecLegend: "金色线 · 水温",
    certTag: "所有权证书",
    certDedication: "将这一瓶与大海的记录\n以你之名留存",
    certVerifiedShort: "NFC认证完成",
    certSeal: "NFC原始标签与登记记录一致。",
    certAuthHead: "认证信息",
    certIdLabel: "证书编号",
    certStatusLabel: "认证状态",
    certSignHead: "数字签名",
    certSave: "保存证书",
    certShare: "分享",
    certBack: "返回大海的记录",
    certOwnerFallback: "所有者未登记",
    certSaving: "正在生成图片",
    certSaved: "已保存到相册",
    certSaveDone: "完成",
    certShareText: "缪斯德玛雷 所有权证书",
    ownHead: "已登记所有者",
    ownVerified: "所有权登记完成",
    ownLinkedSub: "海底熟成 · 南海 · 12个月",
    ownAccountHead: "所有者信息",
    ownEditName: "修改姓名与邮箱",
    ownEditNameSub: "将同步至证书与所有权记录。",
    ownNotify: "消息提醒",
    ownNotifySub: "我们会通知你下一次打捞与新的记录。",
    ownRightsHead: "所有权",
    ownTransfer: "所有权转让",
    ownTransferSub: "将这一瓶及其数字证书的所有权记录转让给新所有者。转让后不可撤销。",
    ownTransferCta: "完成本人认证后转让",
    ownSoon: "本人认证功能筹备中。",
    ownBackRecord: "返回大海的记录",
    passportTitle: "查看这一瓶的\n数字证书。",
    passportBody: "所有权信息与海底熟成记录\n都收录在官方证书中。",
    passportCta: "查看数字证书",
    passportSave: "保存证书",
    passportManage: "管理所有权",
  },
};

/** 원산지(프랑스) 확정 정보 — 제품별. proper noun은 로케일 공통, élevage만 로케일별. 추정 금지. */
export interface ProvenanceData {
  maison: string;
  region: string;
  cepage: string;
  style: string;
  elevage: Record<BottleLocale, string>;
}

const ATOMES_PROVENANCE: ProvenanceData = {
  maison: "Champagne Mignon-Boulard",
  region: "Venteuil · Vallée de la Marne",
  cepage: "Chardonnay 70% · Petit Meslier 30%",
  style: "Ultra-Brut",
  elevage: {
    ko: "오크통 7개월 · 코르크 5년",
    en: "Oak barrel 7 mo · Cork 5 yr",
    fr: "Fût de chêne 7 mois · Liège 5 ans",
    ja: "オーク樽 7ヶ月 · コルク 5年",
    zh: "橡木桶 7个月 · 软木塞 5年",
  },
};

export const PROVENANCE: Record<string, ProvenanceData> = {
  atomes_crochus_1y: ATOMES_PROVENANCE,
  atomes_crochus_2y: ATOMES_PROVENANCE,
  atomes_crochus: ATOMES_PROVENANCE,
};
