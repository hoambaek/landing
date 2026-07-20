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
    titleText: "바다가 새긴 일 년",
    subLabel: "남해 30m · 한 해의 기록",
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
    titleText: "A Year the Sea Inscribed",
    subLabel: "NAMHAE 30M · A YEAR ON RECORD",
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
    titleText: "Une année gravée par la mer",
    subLabel: "NAMHAE 30M · UNE ANNÉE DE RELEVÉS",
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
    titleText: "海が刻んだ一年",
    subLabel: "南海 30m · 一年の記録",
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
    titleText: "大海刻下的一年",
    subLabel: "南海 30m · 一年记录",
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
  eyebrow: string;
  thanksTitle: string; // \n = 줄바꿈
  thanksSub: string;
  registerTitle: string;
  registerSub: string; // {serial} 치환
  registerSubNoSerial: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  submit: string;
  submitting: string;
  previewLead: string; // \n = 줄바꿈
  previewJourney: string;
  previewJourneySub: string;
  previewData: string;
  previewDataSub: string;
  note: string;
  errName: string;
  errEmail: string;
  errGeneric: string;
  scroll: string;
}

export const ENTRY_COPY: Record<BottleLocale, EntryCopy> = {
  ko: {
    eyebrow: "NFC 인증 완료 · OCEAN CELLAR™",
    thanksTitle: "사계절의 바다가\n이 한 병에 담겼습니다",
    thanksSub: "그 바다가 지금 당신에게 왔습니다.",
    registerTitle: "당신의 이름으로 등록하세요",
    registerSub: "N° {serial}의 소장자로, 이 한 병의 기록에 남습니다.",
    registerSubNoSerial: "이 한 병의 소장자로, 기록에 남습니다.",
    nameLabel: "이름",
    namePlaceholder: "이름을 입력하세요",
    emailLabel: "이메일",
    emailPlaceholder: "you@example.com",
    submit: "입장하기",
    submitting: "등록하는 중",
    previewLead: "입장하시면, 이 한 병이\n바다 아래에서 보낸 사계절이 펼쳐집니다.",
    previewJourney: "해저 숙성 여정",
    previewJourneySub: "남해 30m 아래에서 보낸 사계절",
    previewData: "바다가 남긴 실측 데이터",
    previewDataSub: "수온·염분부터 파고까지, 여덟 줄기의 관측",
    note: "이 한 병의 기록으로 들어갑니다",
    errName: "이름을 입력해 주세요.",
    errEmail: "이메일 주소를 확인해 주세요.",
    errGeneric: "잠시 후 다시 시도해 주세요.",
    scroll: "SCROLL",
  },
  en: {
    eyebrow: "RECORD AUTHENTICATED · OCEAN CELLAR™",
    thanksTitle: "Four seasons of the sea,\nheld in this one bottle",
    thanksSub: "And that bottle is now yours.",
    registerTitle: "Register in your name",
    registerSub: "Recorded in this bottle's ledger as the keeper of N° {serial}.",
    registerSubNoSerial: "Recorded in this bottle's ledger as its keeper.",
    nameLabel: "NAME",
    namePlaceholder: "Enter your name",
    emailLabel: "EMAIL",
    emailPlaceholder: "you@example.com",
    submit: "Enter",
    submitting: "Registering",
    previewLead: "Enter, and the four seasons this bottle\nspent beneath the sea unfold.",
    previewJourney: "The cellaring journey",
    previewJourneySub: "Four seasons, 30 m below the South Sea",
    previewData: "What the sea recorded",
    previewDataSub: "From temperature to wave height, eight measured streams",
    note: "You are entering this bottle's record",
    errName: "Please enter your name.",
    errEmail: "Please check your email address.",
    errGeneric: "Please try again in a moment.",
    scroll: "SCROLL",
  },
  fr: {
    eyebrow: "ENREGISTREMENT AUTHENTIFIÉ · OCEAN CELLAR™",
    thanksTitle: "Quatre saisons de mer,\nrecueillies dans cette bouteille",
    thanksSub: "Et cette bouteille est désormais la vôtre.",
    registerTitle: "Enregistrez à votre nom",
    registerSub: "Inscrit au registre de cette bouteille comme gardien du N° {serial}.",
    registerSubNoSerial: "Inscrit au registre de cette bouteille comme son gardien.",
    nameLabel: "NOM",
    namePlaceholder: "Entrez votre nom",
    emailLabel: "E-MAIL",
    emailPlaceholder: "vous@exemple.com",
    submit: "Entrer",
    submitting: "Enregistrement",
    previewLead: "Entrez, et les quatre saisons passées\nsous la mer se dévoilent.",
    previewJourney: "Le parcours d'élevage",
    previewJourneySub: "Quatre saisons, à 30 m sous la mer du Sud",
    previewData: "Ce que la mer a consigné",
    previewDataSub: "De la température à la houle, huit mesures",
    note: "Vous entrez dans le relevé de cette bouteille",
    errName: "Veuillez saisir votre nom.",
    errEmail: "Veuillez vérifier votre adresse e-mail.",
    errGeneric: "Veuillez réessayer dans un instant.",
    scroll: "SCROLL",
  },
  ja: {
    eyebrow: "NFC認証済み · OCEAN CELLAR™",
    thanksTitle: "四季の海が\nこの一本に収められました",
    thanksSub: "その一本が今、あなたのもとに届きました。",
    registerTitle: "あなたの名前で登録する",
    registerSub: "N° {serial} の所蔵者として、この一本の記録に名を残します。",
    registerSubNoSerial: "この一本の所蔵者として、記録に名を残します。",
    nameLabel: "名前",
    namePlaceholder: "お名前を入力してください",
    emailLabel: "メール",
    emailPlaceholder: "you@example.com",
    submit: "入場する",
    submitting: "登録中",
    previewLead: "入場すると、この一本が海の底で\n過ごした四季が開きます。",
    previewJourney: "熟成の航跡",
    previewJourneySub: "南海の水深30m、四季のあいだ",
    previewData: "海が残した実測データ",
    previewDataSub: "水温から波高まで、八つの観測",
    note: "この一本の記録へ入ります",
    errName: "お名前を入力してください。",
    errEmail: "メールアドレスをご確認ください。",
    errGeneric: "しばらくしてからもう一度お試しください。",
    scroll: "SCROLL",
  },
  zh: {
    eyebrow: "NFC认证完成 · OCEAN CELLAR™",
    thanksTitle: "四季的大海，\n都封存在这一瓶中",
    thanksSub: "而这瓶酒此刻已来到你身边。",
    registerTitle: "以你之名登记",
    registerSub: "作为 N° {serial} 的藏家，留名于这一瓶的记录。",
    registerSubNoSerial: "作为此瓶的藏家，留名于其记录。",
    nameLabel: "姓名",
    namePlaceholder: "请输入你的名字",
    emailLabel: "邮箱",
    emailPlaceholder: "you@example.com",
    submit: "进入",
    submitting: "登记中",
    previewLead: "进入后，这一瓶在海底\n度过的四季将徐徐展开。",
    previewJourney: "海底熟成之旅",
    previewJourneySub: "南海30米之下的四季",
    previewData: "大海留下的实测数据",
    previewDataSub: "从水温到浪高，八条观测记录",
    note: "正在进入这瓶酒的记录",
    errName: "请输入你的名字。",
    errEmail: "请检查你的邮箱地址。",
    errGeneric: "请稍后再试。",
    scroll: "SCROLL",
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
