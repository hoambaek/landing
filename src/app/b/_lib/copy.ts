/**
 * /b 병 기록 페이지 전용 카피 (5개 언어).
 * 정본: docs/plans/musedemaree/2026-07-17-nfc-bottle-page-v2-plan.md (시문·표기 규칙)
 * 표기 규칙: 입수·인양은 월·계절만(날짜·일수 금지), 용어는 "입수"(침지 금지).
 */

export type BottleLocale = "ko" | "en" | "fr" | "ja" | "zh";

/* 국기 이미지는 전 화면에서 걷어냈다(코드 + 언어명만) — flag 필드도 함께 제거 */
export const BOTTLE_LOCALES: { code: BottleLocale; short: string; native: string }[] = [
  { code: "ko", short: "KO", native: "한국어" },
  { code: "en", short: "EN", native: "English" },
  { code: "fr", short: "FR", native: "Français" },
  { code: "ja", short: "JP", native: "日本語" },
  { code: "zh", short: "ZH", native: "中文" },
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
    converged: "1년의 바다가 한 병에 담겼습니다",
    converging: "바다가 지금도 한 병에 담기고 있습니다",
    passport: { maison: "MAISON", cepage: "CÉPAGE", style: "STYLE" },
    gating: "기록 전문은 인양 참관 초대와 함께 공개됩니다.",
    cta: "N° {serial}의 주인으로 이름을 남기다",
    ctaNoSerial: "첫 주인으로 이름을 남기다",
    ctaSub: "REGISTRE · OCEAN CELLAR™",
    footerTagline: "바다의 시간을 기록합니다",
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
    converged: "A year of the sea, held in this bottle",
    converging: "The sea is still settling into this bottle",
    passport: { maison: "MAISON", cepage: "CÉPAGE", style: "STYLE" },
    gating: "The complete record opens with an invitation to the retrieval.",
    cta: "Sign the Registre as owner of N° {serial}",
    ctaNoSerial: "Sign the Registre as this bottle's owner",
    ctaSub: "REGISTRE · OCEAN CELLAR™",
    footerTagline: "We record the time of the sea",
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
    converged: "Une année de mer, recueillie dans cette bouteille",
    converging: "La mer se dépose encore dans cette bouteille",
    passport: { maison: "MAISON", cepage: "CÉPAGE", style: "STYLE" },
    gating: "Le relevé complet s'ouvre avec une invitation à la remontée.",
    cta: "Inscrire votre nom au Registre du N° {serial}",
    ctaNoSerial: "Inscrire votre nom au Registre",
    ctaSub: "REGISTRE · OCEAN CELLAR™",
    footerTagline: "Nous enregistrons le temps de la mer",
    notFoundTitle: "Bouteille introuvable",
    notFoundBody: "Ce code est invalide ou n'est pas encore enregistré.",
  },
  ja: {
    verified: "NFC認証済み · RECORD AUTHENTICATED",
    titleText: "海が刻んだ四季",
    subLabel: "南海（ナムヘ）水深30m · 四季の記録",
    immersion: "海中投入",
    retrieval: "引き揚げ",
    planned: "予定",
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    seasons: { winter: "冬", spring: "春", summer: "夏", autumn: "秋" },
    journey: { origin: "シャンパーニュ", originSub: "VENTEUIL", aging: "瓶熟成", agingSub: "MAISON" },
    obsHead: "海洋観測 · 年間平均",
    obsHeadPartial: "海洋観測 · 投入後の平均",
    metrics: {
      temp: "水温", salinity: "塩分", tide: "潮位", current: "海流速度",
      pressure: "水圧", tidal: "潮流速度", wave: "波高", period: "波周期",
    },
    metricsShort: { temp: "水温", salinity: "塩分", tide: "潮位", current: "海流", pressure: "水圧", tidal: "潮流", wave: "波高", period: "波周期" },
    converged: "一年の海が、この一本に。",
    converging: "海は今も、この一本に刻まれている。",
    passport: { maison: "MAISON", cepage: "CÉPAGE", style: "STYLE" },
    gating: "記録の全文は、引き揚げ立ち会いへのご招待とともに公開されます。",
    cta: "N° {serial} の所有者として名を残す",
    ctaNoSerial: "この一本の所有者として名を残す",
    ctaSub: "REGISTRE · OCEAN CELLAR™",
    footerTagline: "海の時間を、記録する。",
    notFoundTitle: "ボトルが見つかりません",
    notFoundBody: "コードが無効であるか、このボトルはまだ登録されていません。",
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
    converged: "一年的大海，都封存在这瓶酒中",
    converging: "大海仍在注入这瓶酒",
    passport: { maison: "MAISON", cepage: "CÉPAGE", style: "STYLE" },
    gating: "完整记录将随打捞观礼邀请一同公开。",
    cta: "以您之名登记 N° {serial}",
    ctaNoSerial: "以您之名登记此瓶",
    ctaSub: "REGISTRE · OCEAN CELLAR™",
    footerTagline: "记录大海的时间",
    notFoundTitle: "未找到该瓶信息",
    notFoundBody: "代码无效或尚未登记。",
  },
};

/** 제품 메타 — plan 앱 PRODUCTS와 동기 유지. 여권 필드는 확정 정보만(추정 금지). */
export interface ProductMeta {
  name: string;
  quantity: number;
  image: string;
  /** 인증서 도판용 세로 컷아웃. 없으면 image로 폴백(가로 제품컷이라 프레임 안에서 눕는다). */
  imagePortrait?: string;
  /**
   * record 첫 화면의 풀블리드 사진. 제품마다 다른 병이 서야 하는 자리다.
   * 없으면 En Lieu Sûr 컷으로 폴백한다 — 병이 안 보이는 것보다 낫지만 다른 제품의 사진이므로
   * 새 제품을 넣을 땐 여기부터 채운다.
   */
  imageHero?: string;
  cepage?: string;
  style?: string;
}

/* 자산 규칙 — 세로 컷아웃은 /images/0N.webp, 가로 제품컷은 /images/0N-2.webp,
   record 히어로는 /images/b/{productId}/hero.{png|webp}.
   0N 번호는 Paper의 ARCHIVE N° 00N과 같은 순서다(01 브뤼 · 02 매그넘 · 03 엘레멘 · 04 아톰1Y · 05 아톰2Y · 06 퍼스트에디션). */
export const PRODUCT_META: Record<string, ProductMeta> = {
  /* First Edition은 가로 제품컷이 없다(한지 포장 컷아웃만 있음) — image에도 컷아웃을 둔다. */
  first_edition: { name: "2025 First Edition", quantity: 50, image: "/images/06.webp", imagePortrait: "/images/06.webp" },
  en_lieu_sur_brut: {
    name: "En Lieu Sûr", quantity: 200, style: "Brut",
    image: "/images/01-2.webp", imagePortrait: "/images/01.webp",
    imageHero: "/images/b/en_lieu_sur_brut/hero.webp",
  },
  en_lieu_sur_magnum: {
    name: "En Lieu Sûr Magnum", quantity: 24, style: "Brut",
    image: "/images/02-2.webp", imagePortrait: "/images/02.webp",
    imageHero: "/images/b/en_lieu_sur_magnum/hero.webp",
  },
  element_de_surprise: {
    name: "Élément de Surprise", quantity: 110, cepage: "Chardonnay", style: "Non-dosé",
    image: "/images/03-2.webp", imagePortrait: "/images/03.webp",
    imageHero: "/images/b/element_de_surprise/hero.webp",
  },
  atomes_crochus_1y: {
    name: "Atomes Crochus", quantity: 100, cepage: "Petit Meslier", style: "Ultra-Brut",
    image: "/images/04-2.webp", imagePortrait: "/images/04.webp",
    imageHero: "/images/b/atomes_crochus_1y/hero.webp",
  },
  atomes_crochus_2y: {
    name: "Atomes Crochus", quantity: 40, cepage: "Petit Meslier", style: "Ultra-Brut",
    image: "/images/05-2.webp", imagePortrait: "/images/05.webp",
    imageHero: "/images/b/atomes_crochus_2y/hero.webp",
  },
  atomes_crochus: {
    name: "Atomes Crochus", quantity: 100, cepage: "Petit Meslier", style: "Ultra-Brut",
    image: "/images/04-2.webp", imagePortrait: "/images/04.webp",
    imageHero: "/images/b/atomes_crochus_1y/hero.webp",
  },
};

export const MAISON_NAME = "Mignon-Boulard";

/** 소유 정보 변경 문의처 — 이메일은 셀프 수정 경로가 없다 */
export const OWNER_CONTACT_EMAIL = "info@musedemaree.com";

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
  ownTitle: string; // {serial} 치환, \n = 줄바꿈
  ownTitleNoSerial: string; // 병 번호 미부여 시
  ownBody: string; // {serial} 치환, \n = 줄바꿈
  ownBodyNoSerial: string;
  /* 이미 등록된 병 — 폼 대신 소유자와 기록 입구를 보여준다 */
  claimedTitle: string;
  claimedBody: string;
  claimedCta: string;
  nameLabel: string; // 자국어 이름
  namePlaceholder: string;
  /* 인증서에 새길 로마자 표기 — 등록자가 직접 정한다.
     한글에서 기계로 옮기면 표기가 갈려(백 → Baek/Baik/Paek) 남의 이름이 새겨진다.
     인증서에는 "이름 성" 순서로 새겨진다(서양 증서 어법). */
  latinGivenLabel: string;
  latinGivenPlaceholder: string;
  latinFamilyLabel: string;
  latinFamilyPlaceholder: string;
  latinNote: string; // 로마자 입력란 아래 한 줄 안내
  emailLabel: string;
  emailPlaceholder: string;
  privacyNote: string;
  submit: string; // "N° {serial}{acc} 소장하기" — {acc}는 컴포넌트가 을/를로 치환(ko만)
  /* 종결형 규칙: 기록 페이지 CTA는 흐름으로 들어오라는 초대라 각인체(-다),
     이 버튼은 폼을 닫고 다음으로 넘기는 완결이라 명사형(-기). 무게가 아니라 역할로 가른다 */
  submitNoSerial: string; // 번호 없는 병 — 번호 호명 불가 시(정본 규칙 2: 부르지 않는다)
  submitting: string;
  /* 각인 공개 (등록 완료 화면) */
  inscribedEyebrow: string; // "등록 완료"
  inscribedTitle: string; // \n = 줄바꿈
  inscribedSub: string;
  inscribedCta: string; // "바다의 기록 보기"
  inscribedCtaSub: string;
  /* 이미 등록된 병으로 들어왔을 때만 — 각인 화면에서 입장 화면으로 내려가는 길.
     개체는 번호로 부른다({serial} 치환). 번호가 없으면 부르지 않는다. */
  inscribedBrowse: string;
  inscribedBrowseNoSerial: string;
  /* 검증 */
  errName: string;
  errLatinName: string;
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
    provBody: "지나온 시간은\n실제 관측 기록으로 남아 있습니다.",
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
    ownTitle: "N° {serial}의 기록에\n당신의 이름을 남기세요",
    ownTitleNoSerial: "기록에\n당신의 이름을 남기세요",
    ownBody: "N° {serial}의 첫 소유자로 기록되며,\n바다 아래에서 보낸 모든 시간이 열립니다.",
    ownBodyNoSerial: "첫 소유자로 기록되며,\n바다 아래에서 보낸 모든 시간이 열립니다.",
    claimedTitle: "이름이 새겨진 병입니다",
    claimedBody: "기록은 누구에게나 열려 있습니다.",
    claimedCta: "바다의 기록 보기",
    nameLabel: "이름",
    namePlaceholder: "인증서에 남길 이름",
    latinGivenLabel: "영문 이름",
    latinGivenPlaceholder: "Given name",
    latinFamilyLabel: "영문 성",
    latinFamilyPlaceholder: "Surname",
    latinNote: "인증서에는 이름 다음 성 순서로 새겨집니다.",
    emailLabel: "이메일",
    emailPlaceholder: "디지털 인증서를 받을 주소",
    privacyNote:
      "인증서에 새겨진 이름은 병을 태그하는 누구에게나 보입니다.\n이메일은 공개하지 않고 인증서 발급에만 씁니다.",
    submit: "N° {serial}{acc} 소장하기",
    submitNoSerial: "소장하기",
    submitting: "기록하는 중",
    inscribedEyebrow: "등록 완료",
    inscribedTitle: "바다의 시간이\n당신의 것이 되었습니다",
    inscribedSub: "소유자로 기록되었습니다.",
    inscribedCta: "바다의 기록 보기",
    inscribedCtaSub: "바다가 남긴 사계절의 기록을 확인합니다.",
    inscribedBrowse: "N° {serial}의 내력",
    inscribedBrowseNoSerial: "내력 보기",
    errName: "이름을 입력해 주세요.",
    errLatinName: "인증서에 새길 영문 이름과 성을 입력해 주세요.",
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
    ownTitle: "Leave your name\non this bottle's record",
    ownTitleNoSerial: "Leave your name\non this bottle's record",
    ownBody: "Recorded as the first owner of N° {serial},\nand every hour spent beneath the sea opens to you.",
    ownBodyNoSerial: "Recorded as this bottle's first owner,\nand every hour spent beneath the sea opens to you.",
    claimedTitle: "This bottle already bears a name",
    claimedBody: "The record stays open to everyone.",
    claimedCta: "View the sea's record",
    nameLabel: "NAME",
    namePlaceholder: "Name for the certificate",
    latinGivenLabel: "GIVEN NAME",
    latinGivenPlaceholder: "Given name",
    latinFamilyLabel: "FAMILY NAME",
    latinFamilyPlaceholder: "Surname",
    latinNote: "The certificate is engraved with your given name first.",
    emailLabel: "EMAIL",
    emailPlaceholder: "Address to receive the certificate",
    privacyNote:
      "The name on the certificate is visible to anyone who taps the bottle.\nYour email stays private and is used only to issue the certificate.",
    submit: "Collect N° {serial}",
    submitNoSerial: "Begin your collection",
    submitting: "Recording",
    inscribedEyebrow: "REGISTERED",
    inscribedTitle: "The time of the sea\nis now yours",
    inscribedSub: "You are recorded as the owner.",
    inscribedCta: "View the sea's record",
    inscribedCtaSub: "See the four seasons the sea left behind.",
    inscribedBrowse: "Provenance of N° {serial}",
    inscribedBrowseNoSerial: "See the provenance",
    errName: "Please enter your name.",
    errLatinName: "Please enter your given name and family name.",
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
    ownTitle: "Laissez votre nom\nau relevé de cette bouteille",
    ownTitleNoSerial: "Laissez votre nom\nau relevé de cette bouteille",
    ownBody: "Inscrit comme premier propriétaire du N° {serial},\net chaque heure passée sous la mer s'ouvre à vous.",
    ownBodyNoSerial: "Inscrit comme premier propriétaire de cette bouteille,\net chaque heure passée sous la mer s'ouvre à vous.",
    claimedTitle: "Cette bouteille porte déjà un nom",
    claimedBody: "Le relevé reste ouvert à tous.",
    claimedCta: "Voir le relevé de la mer",
    nameLabel: "NOM",
    namePlaceholder: "Nom pour le certificat",
    latinGivenLabel: "PRÉNOM",
    latinGivenPlaceholder: "Given name",
    latinFamilyLabel: "NOM DE FAMILLE",
    latinFamilyPlaceholder: "Surname",
    latinNote: "Le certificat porte d'abord le prénom, puis le nom.",
    emailLabel: "E-MAIL",
    emailPlaceholder: "Adresse pour recevoir le certificat",
    privacyNote:
      "Le nom gravé sur le certificat est visible par toute personne qui scanne la bouteille.\nVotre e-mail reste privé et sert uniquement à émettre le certificat.",
    submit: "Faire entrer le N° {serial} en collection",
    submitNoSerial: "Faire entrer cette bouteille en collection",
    submitting: "Enregistrement",
    inscribedEyebrow: "ENREGISTRÉ",
    inscribedTitle: "Le temps de la mer\nest désormais le vôtre",
    inscribedSub: "Votre nom est inscrit comme propriétaire.",
    inscribedCta: "Voir le relevé de la mer",
    inscribedCtaSub: "Découvrez les quatre saisons laissées par la mer.",
    inscribedBrowse: "Provenance du N° {serial}",
    inscribedBrowseNoSerial: "Voir la provenance",
    errName: "Veuillez saisir votre nom.",
    errLatinName: "Veuillez saisir votre prénom et votre nom.",
    errEmail: "Veuillez vérifier votre adresse e-mail.",
    errGeneric: "Veuillez réessayer dans un instant.",
  },
  ja: {
    filmCaption: "海の底で、時間が目を覚ます。",
    filmMeta: "FULL FILM · 00:08",
    identityEyebrow: "NFC AUTHENTICATED",
    identityTagline: "OCEAN AGED · FOUR SEASONS",
    identityBody: "世界にわずか{total}本、最初の海底熟成エディション。\nいまかざした一本が、その{serial}番目の記録です。",
    identityBodyNoSerial: "世界にわずか{total}本、最初の海底熟成エディション。\nいまかざした一本も、その記録のひとつです。",
    provEyebrow: "PROVENANCE",
    provTitle: "海が残した\n三つの証",
    provBody: "この一本がたどった時間は、\n実際の観測記録として残っています。",
    fact1Label: "熟成水深",
    fact1Value: "30m",
    fact1Sub: "南海（ナムヘ）の海底",
    fact2Label: "熟成期間",
    fact2Value: "12ヶ月",
    fact2Sub: "四季の移ろい",
    fact3Label: "海洋観測",
    fact3Value: "8項目",
    fact3Sub: "実測データ",
    provHint: "熟成記録の全文は、所有登録の後にご覧いただけます",
    ownEyebrow: "OWNERSHIP",
    ownTitle: "この一本の記録に\nあなたの名前を",
    ownTitleNoSerial: "この一本の記録に\nあなたの名前を",
    ownBody: "N° {serial} の最初の所有者として登録され、\nこの一本が海の底で過ごした、すべての記録をご覧いただけます。",
    ownBodyNoSerial: "この一本の最初の所有者として登録され、\n海の底で過ごした、すべての記録をご覧いただけます。",
    claimedTitle: "すでに名が刻まれた一本です",
    claimedBody: "記録は、どなたでもご覧いただけます。",
    claimedCta: "海の記録を見る",
    nameLabel: "お名前",
    namePlaceholder: "証明書に残すお名前",
    latinGivenLabel: "ローマ字の名",
    latinGivenPlaceholder: "Given name",
    latinFamilyLabel: "ローマ字の姓",
    latinFamilyPlaceholder: "Surname",
    latinNote: "証明書には名・姓の順で刻まれます。",
    emailLabel: "メールアドレス",
    emailPlaceholder: "デジタル証明書を受け取る宛先",
    privacyNote:
      "証明書のお名前は、ボトルにスマートフォンをかざした誰もが見られます。\nメールアドレスは公開されず、証明書の発行にのみ使用します。",
    submit: "N° {serial} を所蔵する",
    submitNoSerial: "この一本を所蔵する",
    submitting: "記録しています",
    inscribedEyebrow: "登録完了",
    inscribedTitle: "海の時間は\nあなたのものになりました",
    inscribedSub: "所有者として記録されました。",
    inscribedCta: "海の記録を見る",
    inscribedCtaSub: "海が残した四季の記録をご覧ください。",
    inscribedBrowse: "N° {serial} の来歴",
    inscribedBrowseNoSerial: "来歴を見る",
    errName: "お名前を入力してください。",
    errLatinName: "証明書に刻むローマ字の名と姓を入力してください。",
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
    ownTitle: "在这一瓶的记录上\n留下你的名字",
    ownTitleNoSerial: "在这一瓶的记录上\n留下你的名字",
    ownBody: "作为 N° {serial} 的首位所有者被记录，\n它在海底度过的所有时间将向你开启。",
    ownBodyNoSerial: "作为此瓶的首位所有者被记录，\n它在海底度过的所有时间将向你开启。",
    claimedTitle: "这一瓶已刻上名字",
    claimedBody: "记录向所有人开放。",
    claimedCta: "查看大海的记录",
    nameLabel: "姓名",
    namePlaceholder: "留在证书上的名字",
    latinGivenLabel: "拼音名",
    latinGivenPlaceholder: "Given name",
    latinFamilyLabel: "拼音姓",
    latinFamilyPlaceholder: "Surname",
    latinNote: "证书上按名、姓的顺序镌刻。",
    emailLabel: "邮箱",
    emailPlaceholder: "接收数字证书的地址",
    privacyNote:
      "刻在证书上的姓名，轻触酒瓶的人都能看到。\n邮箱不公开，仅用于签发证书。",
    submit: "收藏 N° {serial}",
    submitNoSerial: "收藏这一瓶",
    submitting: "记录中",
    inscribedEyebrow: "登记完成",
    inscribedTitle: "大海的时间\n已属于你",
    inscribedSub: "已记录为所有者。",
    inscribedCta: "查看大海的记录",
    inscribedCtaSub: "查看大海留下的四季记录。",
    inscribedBrowse: "N° {serial} 的来历",
    inscribedBrowseNoSerial: "查看来历",
    errName: "请输入你的名字。",
    errLatinName: "请输入证书上镌刻的拼音名与姓。",
    errEmail: "请检查你的邮箱地址。",
    errGeneric: "请稍后再试。",
  },
};

/* ── 기록 페이지 추가 카피 (표·뉴스레터, 5개 언어) ───────── */
export interface RecordExtraCopy {
  provHead: string;
  seaHead: string;
  provLabels: { maison: string; region: string; cepage: string; style: string; elevage: string };
  seaLabels: {
    immersion: string;
    retrieval: string;
    duration: string;
    depth: string;
    location: string;
    environment: string; // 기록 페이지 표 — "숙성 환경"
    coords: string; // 기록 페이지 표 — "위치"
  };
  wando: string; // 완도 해역
  /* 기록 페이지 (Paper 03) 전용 — 히어로 소유자 라벨 · 스테이션 집계 접미 · 표 값 포맷 */
  ownedBy: string; // 히어로 mono 라벨 (뒤에 소유자 이름)
  metricAgg: { avg: string; max: string; depth: string }; // {n}=관측 개월, {d}=수심
  durationFmt: string; // {y}=연도, {m1}·{m2}=시작·종료 월, {n}=개월 수
  envFmt: string; // {site}=해역, {d}=수심(m)
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
  /* 잠긴 서명 자리의 라벨 — 열쇠 글리프와 한 줄. 누르면 서명이 열린다.
     "발행자 서명"은 발행하는 쪽의 말이었고, "터치하여 진위 확인"은 NFC 업계의
     기술 어투다(TAG·TAP·AUTHENTICATE). 메종은 검증을 앞세우지 않는다 —
     Krug iD·Krug 앱은 인증 기능이 있는데도 verify·authenticate·unlock을 한 번도
     쓰지 않고 discover 하나로 간다("discover the story of your bottle").

     다만 Krug의 discover는 이야기를 여는 자리다. 이 자리가 여는 것은 이야기가
     아니라 암호 서명이라 "발견"은 과장이 된다. 비유(봉인)도 걷어냈다.

     한국어 후보를 실측으로 걸렀다. "발행인"은 신문·잡지 쪽 말이고, 인증서의
     발급 주체를 가리키는 한국 표준어는 "발급기관"이다(과기부 전자서명 인증서
     필수 항목). 다만 그 말은 공인인증서 어조라 이 문서에 얹히지 않고,
     소비자 관습어 "정품 인증"은 쇼핑몰 배지처럼 읽힌다.
     열면 실제로 코드가 나오므로 본 대로 적는다 — 전문용어도 비유도 아니다.
     "보기"를 붙이는 이유: 명사만 두면 라벨로 읽혀 누를 수 있다는 것이 안 보인다.
     화면을 여는 동작은 명사형이라는 종결형 규칙과도 맞는다(바다의 기록 보기·내력 보기). */
  signLocked: string;
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
  ownBottleHead: string; // "소유한 병" — 한 병일 때
  ownBottleHeadPlural: string; // 여러 병일 때 (같은 이메일로 등록된 병 전부)
  ownThisBottle: string; // 여러 병 중 지금 태그한 병을 짚는 표시
  ownAccountHead: string; // "소유자 정보"
  ownEditName: string; // "이름 수정"
  ownEditNameSub: string;
  ownLanguage: string; // 설정 행 "언어"
  /* 소유 관리 — 인증·수정 UI (하드코딩이던 문자열을 로케일로 뺐다) */
  ownAuthed: string; // "본인 인증됨"
  ownSignOut: string; // "인증 해제"
  ownAuthOpen: string; // "본인 인증하고 전체 보기"
  ownOtpLead: string;
  ownOtpSend: string;
  ownOtpSending: string;
  ownOtpSent: string; // {email} 치환
  ownOtpPlaceholder: string;
  ownOtpVerify: string;
  ownOtpVerifying: string;
  ownOtpResend: string;
  ownFieldName: string;
  ownFieldEmail: string;
  ownEmailLocked: string; // 이메일이 읽기 전용인 이유
  ownEmailLockedTo: string; // {email} 치환 — 문의처
  ownCancel: string;
  ownSave: string;
  ownSaving: string;
  ownErrGeneric: string;
  ownErrCode: string;
  ownErrSave: string;
  ownMonths: string; // {n} 치환 — "12개월"
  /* Owner Services (기록 페이지 하단 · Digital Passport) */
  passportTitle: string; // \n = 줄바꿈
  passportBody: string; // \n = 줄바꿈
  passportCta: string; // "디지털 인증서 보기"
  passportManage: string; // "소유 정보 관리"
  passportNews: string; // "다음 인양과 새 기록의 소식 받기"
}

export const RECORD_EXTRA: Record<BottleLocale, RecordExtraCopy> = {
  ko: {
    provHead: "원산지 · 샹파뉴",
    seaHead: "해저 숙성 · 남해",
    provLabels: { maison: "메종", region: "지역", cepage: "품종", style: "스타일", elevage: "숙성" },
    seaLabels: {
      immersion: "입수", retrieval: "인양", duration: "숙성 기간", depth: "숙성 수심", location: "숙성 위치",
      environment: "숙성 환경", coords: "위치",
    },
    wando: "완도 해역",
    ownedBy: "OWNED BY",
    metricAgg: { avg: "{n}개월 평균", max: "{n}개월 최고", depth: "수심 {d}M" },
    durationFmt: "{y}년 {m1}–{m2} · {n}개월",
    envFmt: "{site} · 수심 {d}m",
    newsletterLine: "다음 인양과 새 기록의 소식을 먼저 받아보세요.",
    newsletterCta: "뉴스레터 구독",
    newsletterPlaceholder: "you@example.com",
    newsletterConfirm: "구독하기",
    newsletterDone: "구독이 시작되었습니다. 감사합니다.",
    newsletterErr: "이메일 주소를 확인해 주세요.",
    brandPage: "브랜드 이야기",
    blogPage: "바다의 기록",
    ecEyebrow: "EIGHT CURRENTS",
    ecTitle: "여덟 개의 관측이\n한 병의 시간을 그립니다",
    ecBody: "사계절의 변화를 하나의 흐름으로 기록했습니다.",
    ecLegend: "금빛 선 · 수온",
    certTag: "소유 인증서",
    certDedication: "바다의 기록을\n이 이름이 소장합니다",
    certVerifiedShort: "NFC 인증 완료",
    certSeal: "NFC 원본 태그와 등록 기록이 일치합니다.",
    certAuthHead: "인증 정보",
    certIdLabel: "인증서 ID",
    signLocked: "인증 코드 보기",
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
    ownBottleHead: "소유한 병",
    ownBottleHeadPlural: "소유한 병",
    ownThisBottle: "태그한 병",
    ownAccountHead: "소유자 정보",
    ownEditName: "이름 수정",
    ownEditNameSub: "인증서와 소유 기록에 반영됩니다.",
    ownLanguage: "언어",
    ownAuthed: "본인 인증됨",
    ownSignOut: "인증 해제",
    ownAuthOpen: "본인 인증하고 전체 보기",
    ownOtpLead: "등록하신 이메일로 6자리 인증 코드를 보내드립니다.",
    ownOtpSend: "인증 코드 받기",
    ownOtpSending: "보내는 중",
    ownOtpSent: "{email}로 코드를 보냈어요. 5분 안에 입력해 주세요.",
    ownOtpPlaceholder: "6자리 코드",
    ownOtpVerify: "확인",
    ownOtpVerifying: "확인 중",
    ownOtpResend: "코드 다시 받기",
    ownFieldName: "이름",
    ownFieldEmail: "이메일",
    ownEmailLocked: "본인 인증에 쓰이는 주소입니다.",
    ownEmailLockedTo: "변경은 {email}으로 문의해 주세요.",
    ownCancel: "취소",
    ownSave: "저장",
    ownSaving: "저장 중",
    ownErrGeneric: "잠시 후 다시 시도해 주세요.",
    ownErrCode: "코드가 일치하지 않아요.",
    ownErrSave: "저장 중 문제가 발생했습니다.",
    ownMonths: "{n}개월",
    passportTitle: "디지털 인증서를\n확인하세요",
    passportBody: "소유 정보와 해저 숙성 기록이\n공식 인증서에 담겨 있습니다.",
    passportCta: "디지털 인증서 보기",
    passportManage: "소유 정보 관리",
    passportNews: "다음 인양과 새 기록의 소식 받기",
  },
  en: {
    provHead: "ORIGIN · CHAMPAGNE",
    seaHead: "SUBSEA AGING · NAMHAE",
    provLabels: { maison: "MAISON", region: "REGION", cepage: "CÉPAGE", style: "STYLE", elevage: "ÉLEVAGE" },
    seaLabels: {
      immersion: "IMMERSION", retrieval: "RETRIEVAL", duration: "AGING PERIOD", depth: "AGING DEPTH", location: "AGING SITE",
      environment: "ENVIRONMENT", coords: "COORDINATES",
    },
    wando: "Wando waters",
    ownedBy: "OWNED BY",
    metricAgg: { avg: "{n}-MONTH MEAN", max: "{n}-MONTH MAX", depth: "AT {d}M DEPTH" },
    durationFmt: "{m1}–{m2} {y} · {n} months",
    envFmt: "{site} · {d} m depth",
    newsletterLine: "Be the first to hear of the next retrieval and new records.",
    newsletterCta: "Subscribe to the newsletter",
    newsletterPlaceholder: "you@example.com",
    newsletterConfirm: "Subscribe",
    newsletterDone: "You're subscribed. Thank you.",
    newsletterErr: "Please check your email address.",
    brandPage: "Brand page",
    blogPage: "Journal",
    ecEyebrow: "EIGHT CURRENTS",
    ecTitle: "Eight readings\ndraw the time of one bottle",
    ecBody: "Four seasons of change, kept as one continuous stream.",
    ecLegend: "Golden line · temperature",
    certTag: "CERTIFICATE OF OWNERSHIP",
    certDedication: "The record of the sea,\nin the collection of this name",
    certVerifiedShort: "NFC VERIFIED",
    certSeal: "The original NFC tag matches the registration record.",
    certAuthHead: "Certification",
    certIdLabel: "Certificate ID",
    signLocked: "View certificate code",
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
    ownBottleHead: "Your bottle",
    ownBottleHeadPlural: "Your bottles",
    ownThisBottle: "This one",
    ownAccountHead: "Owner details",
    ownEditName: "Edit name",
    ownEditNameSub: "Reflected in the certificate and ownership record.",
    ownLanguage: "Language",
    ownAuthed: "Identity verified",
    ownSignOut: "Sign out",
    ownAuthOpen: "Verify to see full details",
    ownOtpLead: "We'll send a 6-digit code to your registered email.",
    ownOtpSend: "Send code",
    ownOtpSending: "Sending",
    ownOtpSent: "Code sent to {email}. Enter it within 5 minutes.",
    ownOtpPlaceholder: "6-digit code",
    ownOtpVerify: "Confirm",
    ownOtpVerifying: "Checking",
    ownOtpResend: "Resend code",
    ownFieldName: "Name",
    ownFieldEmail: "Email",
    ownEmailLocked: "This address verifies your identity.",
    ownEmailLockedTo: "To change it, contact {email}.",
    ownCancel: "Cancel",
    ownSave: "Save",
    ownSaving: "Saving",
    ownErrGeneric: "Please try again in a moment.",
    ownErrCode: "That code doesn't match.",
    ownErrSave: "Something went wrong while saving.",
    ownMonths: "{n} months",
    passportTitle: "View this bottle's\ndigital certificate",
    passportBody: "Ownership and the subsea aging record\nare held in the official certificate.",
    passportCta: "View digital certificate",
    passportManage: "Manage ownership",
    passportNews: "Get news of the next retrieval and new records",
  },
  fr: {
    provHead: "ORIGINE · CHAMPAGNE",
    seaHead: "VIEILLISSEMENT SOUS-MARIN · NAMHAE",
    provLabels: { maison: "MAISON", region: "RÉGION", cepage: "CÉPAGE", style: "STYLE", elevage: "ÉLEVAGE" },
    seaLabels: {
      immersion: "IMMERSION", retrieval: "REMONTÉE", duration: "DURÉE", depth: "PROFONDEUR", location: "LIEU",
      environment: "ENVIRONNEMENT", coords: "COORDONNÉES",
    },
    wando: "Eaux de Wando",
    ownedBy: "OWNED BY",
    metricAgg: { avg: "MOYENNE {n} MOIS", max: "MAX {n} MOIS", depth: "À {d} M" },
    durationFmt: "{m1}–{m2} {y} · {n} mois",
    envFmt: "{site} · {d} m de fond",
    newsletterLine: "Soyez informé en premier de la prochaine remontée et des nouveaux relevés.",
    newsletterCta: "S'abonner à la newsletter",
    newsletterPlaceholder: "vous@exemple.com",
    newsletterConfirm: "S'abonner",
    newsletterDone: "Vous êtes abonné. Merci.",
    newsletterErr: "Veuillez vérifier votre adresse e-mail.",
    brandPage: "Page de marque",
    blogPage: "Journal",
    ecEyebrow: "EIGHT CURRENTS",
    ecTitle: "Huit relevés\ndessinent le temps d'une bouteille",
    ecBody: "Quatre saisons de variations, en un seul flux continu.",
    ecLegend: "Ligne dorée · température",
    certTag: "CERTIFICAT DE PROPRIÉTÉ",
    certDedication: "Le relevé de la mer\nappartient à la collection de ce nom",
    certVerifiedShort: "NFC VÉRIFIÉ",
    certSeal: "Le tag NFC d'origine correspond au relevé d'enregistrement.",
    certAuthHead: "Certification",
    certIdLabel: "ID du certificat",
    signLocked: "Voir le code du certificat",
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
    ownBottleHead: "Votre bouteille",
    ownBottleHeadPlural: "Vos bouteilles",
    ownThisBottle: "Celle-ci",
    ownAccountHead: "Détails du propriétaire",
    ownEditName: "Modifier le nom",
    ownEditNameSub: "Reporté sur le certificat et le relevé de propriété.",
    ownLanguage: "Langue",
    ownAuthed: "Identité vérifiée",
    ownSignOut: "Se déconnecter",
    ownAuthOpen: "Vérifier pour tout afficher",
    ownOtpLead: "Un code à 6 chiffres sera envoyé à votre e-mail enregistré.",
    ownOtpSend: "Recevoir le code",
    ownOtpSending: "Envoi",
    ownOtpSent: "Code envoyé à {email}. Saisissez-le dans les 5 minutes.",
    ownOtpPlaceholder: "Code à 6 chiffres",
    ownOtpVerify: "Confirmer",
    ownOtpVerifying: "Vérification",
    ownOtpResend: "Renvoyer le code",
    ownFieldName: "Nom",
    ownFieldEmail: "E-mail",
    ownEmailLocked: "Cette adresse sert à vérifier votre identité.",
    ownEmailLockedTo: "Pour la modifier, écrivez à {email}.",
    ownCancel: "Annuler",
    ownSave: "Enregistrer",
    ownSaving: "Enregistrement",
    ownErrGeneric: "Veuillez réessayer dans un instant.",
    ownErrCode: "Ce code ne correspond pas.",
    ownErrSave: "Une erreur est survenue lors de l'enregistrement.",
    ownMonths: "{n} mois",
    passportTitle: "Consultez le certificat\nnumérique de cette bouteille",
    passportBody: "La propriété et le relevé de vieillissement sous-marin\nfigurent dans le certificat officiel.",
    passportCta: "Voir le certificat numérique",
    passportManage: "Gérer la propriété",
    passportNews: "Recevoir la prochaine remontée et les nouveaux relevés",
  },
  ja: {
    provHead: "原産地 · シャンパーニュ",
    seaHead: "海底熟成 · 南海（ナムヘ）",
    provLabels: { maison: "メゾン", region: "地域", cepage: "品種", style: "スタイル", elevage: "熟成" },
    seaLabels: {
      immersion: "海中投入", retrieval: "引き揚げ", duration: "熟成期間", depth: "熟成水深", location: "熟成地",
      environment: "熟成環境", coords: "位置",
    },
    wando: "莞島（ワンド）海域",
    ownedBy: "OWNED BY",
    metricAgg: { avg: "{n}ヶ月平均", max: "{n}ヶ月最高値", depth: "水深 {d}M" },
    durationFmt: "{y}年 {m1}–{m2} · {n}ヶ月",
    envFmt: "{site} · 水深 {d}m",
    newsletterLine: "次の引き揚げと新しい記録を、いち早くお届けします。",
    newsletterCta: "ニュースレターを購読",
    newsletterPlaceholder: "you@example.com",
    newsletterConfirm: "購読する",
    newsletterDone: "購読を開始しました。ありがとうございます。",
    newsletterErr: "メールアドレスをご確認ください。",
    brandPage: "ブランドページ",
    blogPage: "ジャーナル",
    ecEyebrow: "EIGHT CURRENTS",
    ecTitle: "八つの観測項目が\n一本の時間を描く",
    ecBody: "四季の変化を一つの流れとして記録しました。",
    ecLegend: "金色の線 · 水温",
    certTag: "所有証明書",
    certDedication: "海の記録は\nこの名のもとに",
    certVerifiedShort: "NFC認証済み",
    certSeal: "ボトルのNFCタグと登録記録が一致しています。",
    certAuthHead: "認証情報",
    certIdLabel: "証明書ID",
    signLocked: "認証コードを見る",
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
    ownBottleHead: "所有する一本",
    ownBottleHeadPlural: "所有するボトル",
    ownThisBottle: "この一本",
    ownAccountHead: "所有者情報",
    ownEditName: "名前を編集",
    ownEditNameSub: "証明書と所有記録に反映されます。",
    ownLanguage: "言語",
    ownAuthed: "本人確認済み",
    ownSignOut: "ログアウト",
    ownAuthOpen: "本人確認してすべて表示",
    ownOtpLead: "ご登録のメールアドレスに、6桁の認証コードをお送りします。",
    ownOtpSend: "認証コードを受け取る",
    ownOtpSending: "送信中",
    ownOtpSent: "{email} にコードを送りました。5分以内に入力してください。",
    ownOtpPlaceholder: "6桁のコード",
    ownOtpVerify: "確認",
    ownOtpVerifying: "確認中",
    ownOtpResend: "コードを再送する",
    ownFieldName: "名前",
    ownFieldEmail: "メール",
    ownEmailLocked: "本人確認に使うアドレスです。",
    ownEmailLockedTo: "メールアドレスの変更は、{email}までお問い合わせください。",
    ownCancel: "キャンセル",
    ownSave: "保存",
    ownSaving: "保存中",
    ownErrGeneric: "しばらくしてからもう一度お試しください。",
    ownErrCode: "コードが一致しません。",
    ownErrSave: "保存中に問題が発生しました。",
    ownMonths: "{n}ヶ月",
    passportTitle: "この一本のデジタル証明書を\nご確認ください",
    passportBody: "所有情報と海底熟成の記録が\n公式証明書に収められています。",
    passportCta: "デジタル証明書を見る",
    passportManage: "所有情報の管理",
    passportNews: "次の引き揚げと新しい記録のお知らせを受け取る",
  },
  zh: {
    provHead: "原产地 · 香槟区",
    seaHead: "海底熟成 · 南海",
    provLabels: { maison: "酒庄", region: "产区", cepage: "品种", style: "风格", elevage: "陈酿" },
    seaLabels: {
      immersion: "入水", retrieval: "打捞", duration: "熟成周期", depth: "熟成水深", location: "熟成地点",
      environment: "熟成环境", coords: "位置",
    },
    wando: "莞岛海域",
    ownedBy: "OWNED BY",
    metricAgg: { avg: "{n}个月平均", max: "{n}个月最高", depth: "水深 {d}M" },
    durationFmt: "{y}年 {m1}–{m2} · {n}个月",
    envFmt: "{site} · 水深 {d}m",
    newsletterLine: "第一时间获知下一次打捞与新的记录。",
    newsletterCta: "订阅通讯",
    newsletterPlaceholder: "you@example.com",
    newsletterConfirm: "订阅",
    newsletterDone: "订阅已开始，谢谢。",
    newsletterErr: "请检查你的邮箱地址。",
    brandPage: "品牌页面",
    blogPage: "博客",
    ecEyebrow: "EIGHT CURRENTS",
    ecTitle: "八项观测\n描绘一瓶的时间",
    ecBody: "四季变化，汇成一条连续的流。",
    ecLegend: "金色线 · 水温",
    certTag: "所有权证书",
    certDedication: "大海的记录，\n由此名珍藏",
    certVerifiedShort: "NFC认证完成",
    certSeal: "NFC原始标签与登记记录一致。",
    certAuthHead: "认证信息",
    certIdLabel: "证书编号",
    signLocked: "查看认证代码",
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
    ownBottleHead: "所拥有的一瓶",
    ownBottleHeadPlural: "所拥有的酒瓶",
    ownThisBottle: "当前这瓶",
    ownAccountHead: "所有者信息",
    ownEditName: "修改姓名",
    ownEditNameSub: "将同步至证书与所有权记录。",
    ownLanguage: "语言",
    ownAuthed: "已完成本人验证",
    ownSignOut: "解除验证",
    ownAuthOpen: "完成验证后查看全部",
    ownOtpLead: "我们将向您登记的邮箱发送6位验证码。",
    ownOtpSend: "获取验证码",
    ownOtpSending: "发送中",
    ownOtpSent: "验证码已发送至 {email}，请在5分钟内输入。",
    ownOtpPlaceholder: "6位验证码",
    ownOtpVerify: "确认",
    ownOtpVerifying: "验证中",
    ownOtpResend: "重新获取验证码",
    ownFieldName: "姓名",
    ownFieldEmail: "邮箱",
    ownEmailLocked: "此地址用于本人验证。",
    ownEmailLockedTo: "如需修改，请联系 {email}。",
    ownCancel: "取消",
    ownSave: "保存",
    ownSaving: "保存中",
    ownErrGeneric: "请稍后再试。",
    ownErrCode: "验证码不匹配。",
    ownErrSave: "保存时出现问题。",
    ownMonths: "{n}个月",
    passportTitle: "查看这一瓶的\n数字证书",
    passportBody: "所有权信息与海底熟成记录\n都收录在官方证书中。",
    passportCta: "查看数字证书",
    passportManage: "管理所有权",
    passportNews: "获取下一次打捞与新记录的消息",
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
  /* 6개월 — 메종 공식 기술자료(fiche technique) 기준.
     "Élevage en fût de chêne sur lies, 6 mois / Vieillissement 5 ans minimum".
     홈페이지 본문에는 7개월로 읽히는 대목이 있으나 기술자료를 정본으로 삼는다.
     출처: champagne-mignon-boulard.com/wp-content/uploads/2023/06/
           FICHESTECHNIQUES-CHAMPAGNEMIGNON-BOULARD_ATOMESCROCHUS.pdf */
  elevage: {
    ko: "오크통 6개월 · 코르크 5년",
    en: "Oak barrel 6 mo · Cork 5 yr",
    fr: "Fût de chêne 6 mois · Liège 5 ans",
    ja: "オーク樽 6ヶ月 · コルク 5年",
    zh: "橡木桶 6个月 · 软木塞 5年",
  },
};

export const PROVENANCE: Record<string, ProvenanceData> = {
  atomes_crochus_1y: ATOMES_PROVENANCE,
  atomes_crochus_2y: ATOMES_PROVENANCE,
  atomes_crochus: ATOMES_PROVENANCE,
};
