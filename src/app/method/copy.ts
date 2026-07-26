import type { Locale } from "@/i18n/config";

/**
 * /method 페이지 카피 — ko가 원본. J1950 타이틀은 ko에서 PNG, en/fr에서 텍스트로 렌더링된다.
 * 용어는 사이트 사전(en/fr.json)의 어휘 체계를 따른다: record=relevé(fr), 남해=off Namhae, 입수=immersion.
 */

export interface MethodCopy {
  meta: { title: string; description: string };
  hero: { title: string; sub: [string, string] };
  ch01: {
    h2: string;
    p1: string;
    p2: string;
    photoAlt: string;
    obsLabel: string;
    obsSource: string;
    obsNames: [string, string, string, string, string, string, string, string];
    liveLabel: string;
    livePrefix: { temp: string; current: string; wave: string; pressure: string; salinity: string };
  };
  ch02: {
    h2: string;
    lead: string;
    tagPlan: { em: string; text: string };
    tagRec: { em: string; text: string };
    tagPeak: { em: string; text: string };
    tlAria: string;
    tlTick36: string;
    tlTop: string;
    tlXAxis: string;
    tlYAxis: string;
    svgTagPlan: string;
    svgTagRec: string;
    svgTagPeak: string;
    legend: [string, string, string, string, string];
    tlProduct: string;
    radarH3: string;
    radarHint: string;
    radarAria: string;
    radarAxes: [string, string, string, string, string, string];
    /** 모바일 레이더용 축약 라벨 — viewBox 342 안에서 잘리지 않는 길이 */
    radarAxesShort: [string, string, string, string, string, string];
    radarLegendLand: string;
    radarLegendSea: string;
    changeNote: string;
  };
  ch03: {
    h2: string;
    p1: string;
    p2: string;
    nextRetrieval: string;
    cardNo: string;
    cardTitle: string;
    cardTitleEn: string;
    cardSub: string;
    cardSealedBadge: string;
    cardBatchLabel: string;
    cardBatch: [string, string][];
    cardAxesLabel: string;
    cardAxes: [string, string, string, string, string, string];
    sealed: string;
    retrievalAlt: string;
  };
  ch04: {
    h2: string;
    lead: string;
    convAria: string;
    convStart: string;
    convEnd: string;
    convLegendPred: string;
    convLegendActual: string;
    convFeedback: string;
    loopH3: string;
    loopCopy: string;
    nfcAlt: string;
    certH3: string;
    certCopy: string;
    certPhone: {
      aria: string;
      graphTitle: string;
      graphMeta: string;
      seasons: [string, string, string, string];
      rows: { label: string; value: string; accent?: boolean }[];
    };
  };
  quote: { text: string; portraitAlt: string; attrName: string; attrOrg: string };
  archive: {
    h2: string;
    lead: string;
    photoAlt: string;
    rows: { date: string; title: string; status: string; accent: boolean }[];
  };
  closing: { title: string; sub: [string, string]; cta: string; secondary: string };
}

const ko: MethodCopy = {
  meta: {
    title: "The Method · 기록의 방법 | Muse de Marée",
    description:
      "해저 숙성을 예측하는 AI, OCEAN CELLAR™가 남해 수심 30m에서 일하는 방식. 기록하고, 예측하고, 검증받고, 보정합니다.",
  },
  hero: {
    title: "바다는 기록합니다. 우리는 그 기록을 읽는 법을 배우고 있습니다.",
    sub: ["해저 숙성을 예측하는 AI OCEAN CELLAR™가", "남해 수심 30m에서 하는 일입니다."],
  },
  ch01: {
    h2: "바다가 쓰는 것을 기록합니다.",
    p1: "남해는 국립해양조사원이 직접 실측하는 바다입니다. 바다가 써 내려가는 수온과 염분, 조류를 매달 그대로 받아 적습니다. 지어낸 숫자가 아니라 실제 바다의 기록이, 그대로 예측의 바탕이 됩니다.",
    p2: "병이 잠긴 곳은 수심 30m. 이 자리의 물은 계절마다 다르게 흐르고, 병이 바다에 머무는 내내 측정은 멈추지 않습니다.",
    photoAlt: "해저 모래 바닥 위 침지 케이지",
    obsLabel: "최근 30일의 관측",
    obsSource: "KHOA · OPEN-METEO · 남해",
    obsNames: ["수온", "염분", "조위", "조류 유속", "수압", "파고", "파주기", "해류 속도"],
    liveLabel: "LIVE · 지금 이 순간의 측정",
    livePrefix: { temp: "수온", current: "해류", wave: "파고", pressure: "수압", salinity: "염분" },
  },
  ch02: {
    h2: "시간이 지나갈 길을 예측합니다.",
    lead: "풍미가 숙성 시간을 따라 어떻게 변하는지, 112,316건의 테이스팅으로 기록했습니다. 이 데이터로 배운 모델이 여섯 개의 축으로 풍미를 읽습니다. 향이 열리는 속도와 기포가 남는 정도는 물리와 화학의 법칙으로 다듬습니다. 그렇게 36개월의 변화를 하나의 곡선으로 그립니다. 더 좋아지는 길이 아니라, 지상과는 다른 길입니다.",
    tagPlan: { em: "계획", text: "12개월" },
    tagRec: { em: "추천", text: "12개월 · 84점" },
    tagPeak: { em: "PEAK", text: "14개월 · 87점" },
    tlAria: "Atomes Crochus 배치의 36개월 숙성 예측 곡선. 추천 12개월 84점, 피크 14개월 87점.",
    tlTick36: "36개월",
    tlTop: "100점",
    tlXAxis: "입수 후 경과 기간 (개월)",
    tlYAxis: "종합 품질 점수 (점)",
    svgTagPlan: "계획 12개월",
    svgTagRec: "추천 12개월 · 84점",
    svgTagPeak: "PEAK 14개월 · 87점",
    legend: ["종합 품질", "질감", "기포", "향 감쇠", "환원취"],
    tlProduct: "Mignon Boulard Atomes Crochus 배치의 예측",
    radarH3: "같은 시간, 다른 모양",
    radarHint: "여섯 축의 변화 · 지상 → 해저 12개월 예측",
    radarAria: "지상 대비 해저 12개월 풍미 프로파일 레이더",
    radarAxes: ["과실향", "플로럴·미네랄", "효모·숙성향", "산도·상쾌함", "바디감·질감", "여운·복합미"],
    radarAxesShort: ["과실향", "플로럴·미네랄", "효모·숙성향", "산도·상쾌함", "바디감·질감", "여운·복합미"],
    radarLegendLand: "지상 · 입수 전",
    radarLegendSea: "해저 12개월 예측",
    changeNote: "여섯 축이 함께 오르내리며 균형이 다시 잡힙니다. 좋고 나쁨이 아니라, 바다가 만드는 다른 균형입니다.",
  },
  ch03: {
    h2: "인양하는 날, 검증을 받습니다.",
    p1: "바다가 어떻게 숙성시킬지 미리 예측해, 인양하기 전에 적어 둡니다. 인양하는 날에는 지상에 똑같이 보관한 병과 나란히 두고, 비교 시음으로 예측과 실제를 맞춰봅니다.",
    p2: "맞았는지는 우리가 말하지 않습니다. 바다가 판정하고, 결과는 그대로 공개합니다.",
    nextRetrieval: "다음 인양 · 2026년 겨울",
    cardNo: "N° 2026-014",
    cardTitle: "예측 기록서",
    cardTitleEn: "Sealed Prediction",
    cardSub: "먼저 기록하고, 인양하는 날 공개합니다.",
    cardSealedBadge: "SEALED · 인양 시 공개",
    cardBatchLabel: "BATCH — ATOMES CROCHUS",
    cardBatch: [
      ["입수", "2026년 01월 · 겨울"],
      ["좌표", "34°N · 126°E"],
      ["수심", "30 m"],
      ["인양 예정", "2026년 12월 · 겨울"],
    ],
    cardAxesLabel: "풍미 예측 — 6 AXES",
    cardAxes: ["과실향", "플로럴·미네랄", "효모·숙성향", "산도", "바디감", "여운"],
    sealed: "미공개",
    retrievalAlt: "수면 위로 끌어올려지는 숙성 케이지",
  },
  ch04: {
    h2: "검증된 만큼, 다시 보정합니다.",
    lead: "검증의 결과는 다시 모델로 돌아갑니다. 지난 3년의 검증이 지금의 예측을 만들었고, 인양이 거듭될수록 예측은 더 정밀해집니다. 그 기록은 시스템 안에만 머물지 않고, 병 하나하나에 증서로 남습니다.",
    convAria: "열 번의 인양에서 예측과 실측의 차이가 좁아지고, 그 차이가 다시 보정계수로 되먹임되는 수렴 다이어그램",
    convStart: "1차 · 2023",
    convEnd: "10차 · 2026",
    convLegendPred: "예측",
    convLegendActual: "실측",
    convFeedback: "실측이 보정계수를 다시 쓴다",
    loopH3: "스스로 정밀해지는 설계",
    loopCopy: "바다로 나가기 전에 예측을 먼저 적어 둡니다. 인양하는 날, 그 예측을 실측과 나란히 놓습니다. 어긋난 만큼이 다음 예측을 고쳐 쓰고, 인양이 거듭될수록 둘은 점점 겹쳐집니다. 그래서 다음 병에 적는 예측은 해마다 더 정확해집니다.",
    nfcAlt: "따개비 붙은 병에 스마트폰을 가까이 대어 기록을 여는 손",
    certH3: "그 기록이 병마다 남습니다",
    certCopy: "시스템 안에서 검증된 이력이 병을 나와 증서가 됩니다. 병에 가까이 대면 입수 좌표와 수심, 수온까지, 그 병이 살아낸 시간이 열립니다. 같은 병은 하나도 없습니다.",
    certPhone: {
      aria: "병에 폰을 대면 열리는 이 병의 기록 화면",
      graphTitle: "이 병이 지나온 바다",
      graphMeta: "46 MONTHS AT SEA",
      seasons: ["2023 겨울", "여름", "겨울", "2026 겨울"],
      rows: [
        { label: "살아낸 시간", value: "46개월", accent: true },
        { label: "지나온 계절", value: "겨울 4 · 여름 3" },
        { label: "예측 검증", value: "대조 완료" },
      ],
    },
  },
  quote: {
    text: "예측을 적어 두고 바다로 나가는 날은 시험을 치르러 가는 기분입니다. 판정은 우리 몫이 아니라는 것, 그걸 아는 게 이 일의 전부입니다.",
    portraitAlt: "배 위에서 해양 관측 대시보드가 열린 태블릿을 든 손",
    attrName: "뮤즈드마레 기록팀",
    attrOrg: "NAMHAE STATION",
  },
  archive: {
    h2: "이 기록은 매년 발표됩니다.",
    lead: "입수한 데이터, 바다의 조건, 검증 결과까지 날짜와 함께 남깁니다.\n꾸미는 말이 아니라, 있었던 그대로의 기록입니다.",
    photoAlt: "수면 위로 올라온 따개비 붙은 병",
    rows: [
      { date: "2026 · 겨울", title: "다음 인양, 예측과 실측의 대조", status: "예정", accent: true },
      { date: "2025 ~ 2026", title: "남해 실측 해양 데이터, 월별 환경 모델", status: "기록 중", accent: false },
      { date: "2023 ~ 2026", title: "열 번이 넘는 입수와 인양, 예측과 확인의 반복", status: "누적", accent: false },
    ],
  },
  closing: {
    title: "우리는 예측을 마쳤습니다. 이제 바다가 답할 차례입니다.",
    sub: ["새 퀴베 출시를 가장 먼저 만나고, 심해에서 보낸 시간의 기록을 평생 열람하는 자리입니다.", "자리는 준비된 병의 수만큼만 열립니다."],
    cta: "초대 신청하기",
    secondary: "파인다이닝과 호텔 바를 위한 안내는 파트너 문의로.",
  },
};

const en: MethodCopy = {
  meta: {
    title: "The Method · How the Record Is Made | Muse de Marée",
    description:
      "How OCEAN CELLAR™, the AI that predicts undersea aging, works 30 m below the sea off Namhae. It measures, predicts, is verified, and recalibrates.",
  },
  hero: {
    title: "The sea keeps a record. We are learning to read it.",
    sub: ["How AI OCEAN CELLAR™, which predicts undersea aging,", "works 30 m below the sea off Namhae."],
  },
  ch01: {
    h2: "We record what the sea writes.",
    p1: "The waters off Namhae are measured directly by the Korea Hydrographic and Oceanographic Agency. Each month we take down the temperature, salinity, and currents the sea writes for itself. Not numbers we invented, but the sea's own record, becoming the ground our predictions stand on.",
    p2: "The bottles rest thirty metres down. The water there flows differently with each season, and for as long as a bottle stays in the sea, the measuring never stops.",
    photoAlt: "An immersion cage on the sandy seabed",
    obsLabel: "Observations · last 30 days",
    obsSource: "KHOA · OPEN-METEO · NAMHAE WATERS",
    obsNames: ["Temperature", "Salinity", "Tide level", "Tidal current", "Pressure", "Wave height", "Wave period", "Current speed"],
    liveLabel: "LIVE · MEASURING NOW",
    livePrefix: { temp: "Temp", current: "Current", wave: "Wave", pressure: "Pressure", salinity: "Salinity" },
  },
  ch02: {
    h2: "We predict the path time will take.",
    lead: "We recorded how flavour changes over aging time across 112,316 tastings. A model trained on that data reads flavour along six axes. The pace at which aromas open and the way bubbles persist are refined by the laws of physics and chemistry. From it we draw a single 36-month curve. Not a better path, but a different one from land.",
    tagPlan: { em: "PLAN", text: "12 mo" },
    tagRec: { em: "ADVISED", text: "12 mo · 84" },
    tagPeak: { em: "PEAK", text: "14 mo · 87" },
    tlAria: "36-month aging prediction curves for the Atomes Crochus batch. Advised at 12 months (84), peak at 14 months (87).",
    tlTick36: "36 mo",
    tlTop: "100",
    tlXAxis: "Months since immersion",
    tlYAxis: "Composite quality score",
    svgTagPlan: "Plan · 12 mo",
    svgTagRec: "Advised · 12 mo · 84",
    svgTagPeak: "Peak · 14 mo · 87",
    legend: ["Composite quality", "Texture", "Bubbles", "Aroma decay", "Reduction"],
    tlProduct: "Prediction for the Mignon Boulard Atomes Crochus batch",
    radarH3: "The same time, a different shape",
    radarHint: "Six axes · land → 12 months undersea, predicted",
    radarAria: "Flavour profile radar: land versus 12 months undersea (predicted)",
    radarAxes: ["Fruit", "Floral · Mineral", "Yeast · Maturity", "Acidity · Freshness", "Body · Texture", "Finish · Complexity"],
    radarAxesShort: ["Fruit", "Floral", "Yeast", "Acidity", "Body", "Finish"],
    radarLegendLand: "Land · before immersion",
    radarLegendSea: "Undersea · 12-month prediction",
    changeNote: "All six axes move together and settle into a new balance. Not better or worse — a different balance, made by the sea.",
  },
  ch03: {
    h2: "On retrieval day, we are put to the test.",
    p1: "We predict how the sea will age each bottle and write it down before retrieval. On the day, we set it beside an identical bottle kept on land and check prediction against reality through a comparative tasting.",
    p2: "Whether we were right is not ours to say. The sea does the grading, and the results are published as they are.",
    nextRetrieval: "Next retrieval · Winter 2026",
    cardNo: "N° 2026-014",
    cardTitle: "Prediction Record",
    cardTitleEn: "Sealed Prediction",
    cardSub: "Written first, opened on retrieval day.",
    cardSealedBadge: "SEALED · Opens at retrieval",
    cardBatchLabel: "BATCH — ATOMES CROCHUS",
    cardBatch: [
      ["Immersed", "JAN 2026 · WINTER"],
      ["Coordinates", "34°N · 126°E"],
      ["Depth", "30 m"],
      ["Retrieval", "DEC 2026 · WINTER"],
    ],
    cardAxesLabel: "FLAVOR PREDICTION — 6 AXES",
    cardAxes: ["Fruit", "Floral · Mineral", "Yeast · Maturity", "Acidity", "Body", "Finish"],
    sealed: "Sealed",
    retrievalAlt: "An aging cage being raised through the surface",
  },
  ch04: {
    h2: "What is verified recalibrates the model.",
    lead: "Every verification flows back into the model. Three years of checking built today's predictions, and each retrieval makes the next one sharper. The record does not stay inside the system — it stays with each bottle, as a certificate.",
    convAria: "Convergence diagram: the gap between prediction and measurement narrows across ten retrievals, and that gap feeds back into the correction coefficients",
    convStart: "Run 1 · 2023",
    convEnd: "Run 10 · 2026",
    convLegendPred: "Predicted",
    convLegendActual: "Measured",
    convFeedback: "The measurement rewrites the coefficients",
    loopH3: "A design that sharpens itself",
    loopCopy: "We write the prediction before heading out to sea. On the day of retrieval, we lay that prediction beside the measurement. The gap rewrites the next prediction, and with each retrieval the two draw closer. So the prediction we write on the next bottle grows more accurate every year.",
    nfcAlt: "A hand holding a phone to a barnacle-covered bottle to open its record",
    certH3: "That record settles into each bottle",
    certCopy: "The history verified inside the system leaves it to become a certificate in the bottle. Hold your phone close and the immersion coordinates, depth, and temperature open up, the time that bottle lived through. No two bottles are alike.",
    certPhone: {
      aria: "The bottle's record screen, opened by holding a phone to it",
      graphTitle: "The sea this bottle passed through",
      graphMeta: "46 MONTHS AT SEA",
      seasons: ["2023 Winter", "Summer", "Winter", "2026 Winter"],
      rows: [
        { label: "Time at sea", value: "46 months", accent: true },
        { label: "Seasons passed", value: "4 winters · 3 summers" },
        { label: "Prediction check", value: "Verified" },
      ],
    },
  },
  quote: {
    text: "“Writing down our prediction and heading out to sea feels like sitting an exam. The grading is not ours to do. Accepting that is the whole of this work.”",
    portraitAlt: "Hands holding a tablet showing an ocean observation dashboard, on deck",
    attrName: "Muse de Marée Records Team",
    attrOrg: "NAMHAE STATION",
  },
  archive: {
    h2: "This record is published every year.",
    lead: "Immersion data, the sea's conditions, the verification results — all kept with their dates. Not words meant to impress, but a record of what actually happened.",
    photoAlt: "A barnacle-covered bottle just raised from the sea",
    rows: [
      { date: "2026 · Winter", title: "Next retrieval — prediction meets measurement", status: "Upcoming", accent: true },
      { date: "2025 ~ 2026", title: "Measured ocean data off Namhae, monthly environmental model", status: "Recording", accent: false },
      { date: "2023 ~ 2026", title: "More than ten immersions and retrievals — prediction and confirmation, repeated", status: "Accumulated", accent: false },
    ],
  },
  closing: {
    title: "Our prediction is written. Now it is the sea's turn to answer.",
    sub: ["Be the first to hear of a new cuvée's release, and keep the record of its time in the deep for life.", "Seats open only as many as the bottles prepared."],
    cta: "Request an invitation",
    secondary: "For fine dining and hotel bars, see partnership enquiries.",
  },
};

const fr: MethodCopy = {
  meta: {
    title: "The Method · La fabrique du relevé | Muse de Marée",
    description:
      "Comment OCEAN CELLAR™, l'IA qui prédit le vieillissement sous-marin, travaille à 30 m de profondeur au large de Namhae. Mesurer, prédire, être vérifié, recalibrer.",
  },
  hero: {
    title: "La mer tient un relevé. Nous apprenons à le lire.",
    sub: ["Comment AI OCEAN CELLAR™, qui prédit le vieillissement sous-marin,", "travaille à 30 m de profondeur au large de Namhae."],
  },
  ch01: {
    h2: "Nous consignons ce que la mer écrit.",
    p1: "Les eaux au large de Namhae sont mesurées directement par l'agence hydrographique et océanographique de Corée (KHOA). Chaque mois, nous relevons les températures, salinités et courants que la mer écrit d'elle-même. Non pas des chiffres inventés, mais le relevé même de la mer qui devient le socle de nos prévisions.",
    p2: "Les bouteilles reposent à trente mètres de fond. L'eau y circule différemment à chaque saison, et tant qu'une bouteille demeure en mer, la mesure ne s'arrête jamais.",
    photoAlt: "Une cage d'immersion sur le fond sableux",
    obsLabel: "Observations · 30 derniers jours",
    obsSource: "KHOA · OPEN-METEO · EAUX DE NAMHAE",
    obsNames: ["Température", "Salinité", "Marée", "Courant de marée", "Pression", "Hauteur de vague", "Période de vague", "Courant"],
    liveLabel: "LIVE · MESURE EN CE MOMENT",
    livePrefix: { temp: "Temp.", current: "Courant", wave: "Vague", pressure: "Pression", salinity: "Salinité" },
  },
  ch02: {
    h2: "Nous prédisons le chemin que prendra le temps.",
    lead: "Nous avons enregistré l'évolution des arômes au fil du vieillissement sur 112 316 dégustations. Un modèle entraîné sur ces données lit le vin selon six axes. La vitesse d'ouverture des arômes et la tenue des bulles sont affinées par les lois de la physique et de la chimie. Nous en traçons une seule courbe sur 36 mois. Non pas une meilleure voie, mais une voie différente de celle de la terre.",
    tagPlan: { em: "PRÉVU", text: "12 mois" },
    tagRec: { em: "CONSEILLÉ", text: "12 mois · 84" },
    tagPeak: { em: "PIC", text: "14 mois · 87" },
    tlAria: "Courbes de prévision sur 36 mois pour le lot Atomes Crochus. Conseillé à 12 mois (84), pic à 14 mois (87).",
    tlTick36: "36 mois",
    tlTop: "100",
    tlXAxis: "Mois depuis l'immersion",
    tlYAxis: "Score de qualité globale",
    svgTagPlan: "Prévu · 12 mois",
    svgTagRec: "Conseillé · 12 mois · 84",
    svgTagPeak: "Pic · 14 mois · 87",
    legend: ["Qualité globale", "Texture", "Bulles", "Déclin aromatique", "Réduction"],
    tlProduct: "Prévision pour le lot Mignon Boulard Atomes Crochus",
    radarH3: "Le même temps, une autre forme",
    radarHint: "Six axes · terre → 12 mois sous la mer, prévision",
    radarAria: "Radar du profil aromatique : terre contre 12 mois sous la mer (prévision)",
    radarAxes: ["Fruité", "Floral · Minéral", "Levure · Évolution", "Acidité · Fraîcheur", "Corps · Texture", "Finale · Complexité"],
    radarAxesShort: ["Fruité", "Floral", "Levure", "Acidité", "Corps", "Finale"],
    radarLegendLand: "Terre · avant immersion",
    radarLegendSea: "Sous la mer · prévision 12 mois",
    changeNote: "Les six axes évoluent ensemble vers un nouvel équilibre. Ni meilleur ni moins bon — un équilibre différent, façonné par la mer.",
  },
  ch03: {
    h2: "Le jour de la remontée, nous passons l'épreuve.",
    p1: "Nous prédisons comment la mer fera vieillir chaque bouteille et l'écrivons avant la remontée. Le jour venu, nous la plaçons à côté d'une bouteille identique gardée à terre et confrontons la prévision au réel par une dégustation comparative.",
    p2: "Avoir eu raison ou tort, ce n'est pas à nous de le dire. La mer note, et les résultats sont publiés tels quels.",
    nextRetrieval: "Prochaine remontée · hiver 2026",
    cardNo: "N° 2026-014",
    cardTitle: "Registre de prévision",
    cardTitleEn: "Sealed Prediction",
    cardSub: "Écrit d'abord, ouvert le jour de la remontée.",
    cardSealedBadge: "SEALED · Ouvert à la remontée",
    cardBatchLabel: "BATCH — ATOMES CROCHUS",
    cardBatch: [
      ["Immersion", "JANV. 2026 · HIVER"],
      ["Coordonnées", "34°N · 126°E"],
      ["Profondeur", "30 m"],
      ["Remontée", "DÉC. 2026 · HIVER"],
    ],
    cardAxesLabel: "PRÉVISION AROMATIQUE — 6 AXES",
    cardAxes: ["Fruité", "Floral · Minéral", "Levure · Évolution", "Acidité", "Corps", "Finale"],
    sealed: "Scellé",
    retrievalAlt: "Une cage de vieillissement remontée à la surface",
  },
  ch04: {
    h2: "Ce qui est vérifié recalibre le modèle.",
    lead: "Chaque vérification retourne au modèle. Trois années d'épreuves ont construit les prévisions d'aujourd'hui, et chaque remontée affine la suivante. Ce relevé ne reste pas dans le système — il accompagne chaque bouteille, comme un certificat.",
    convAria: "Diagramme de convergence : l'écart entre prévision et mesure se resserre au fil de dix remontées, et cet écart se réinjecte dans les coefficients de correction",
    convStart: "1re · 2023",
    convEnd: "10e · 2026",
    convLegendPred: "Prévu",
    convLegendActual: "Mesuré",
    convFeedback: "La mesure réécrit les coefficients",
    loopH3: "Un système qui s'affine de lui-même",
    loopCopy: "Nous notons la prévision avant de prendre la mer. Le jour de la remontée, nous plaçons cette prévision à côté de la mesure. L'écart réécrit la prévision suivante, et à chaque remontée les deux se rapprochent. Ainsi la prévision inscrite sur la bouteille suivante gagne en justesse chaque année.",
    nfcAlt: "Une main approchant un téléphone d'une bouteille couverte de balanes pour ouvrir son relevé",
    certH3: "Ce relevé se dépose dans chaque bouteille",
    certCopy: "L'historique vérifié dans le système en sort pour devenir un certificat dans la bouteille. Approchez votre téléphone et les coordonnées d'immersion, la profondeur et la température s'ouvrent, le temps que cette bouteille a vécu. Aucune bouteille ne ressemble à une autre.",
    certPhone: {
      aria: "L'écran du relevé de la bouteille, ouvert en approchant un téléphone",
      graphTitle: "La mer traversée par cette bouteille",
      graphMeta: "46 MOIS EN MER",
      seasons: ["2023 Hiver", "Été", "Hiver", "2026 Hiver"],
      rows: [
        { label: "Temps en mer", value: "46 mois", accent: true },
        { label: "Saisons traversées", value: "4 hivers · 3 étés" },
        { label: "Vérification", value: "Confirmée" },
      ],
    },
  },
  quote: {
    text: "« Écrire notre prévision puis prendre la mer, c'est comme aller passer un examen. Ce n'est pas à nous de noter. Accepter cela, c'est tout le sens de ce travail. »",
    portraitAlt: "Des mains tenant une tablette affichant un tableau de bord d'observation marine, sur le pont",
    attrName: "Équipe des relevés Muse de Marée",
    attrOrg: "NAMHAE STATION",
  },
  archive: {
    h2: "Ce relevé est publié chaque année.",
    lead: "Les données d'immersion, les conditions de la mer, les résultats de vérification, tout est consigné avec sa date. Non pas des mots pour séduire, mais le relevé de ce qui a réellement eu lieu.",
    photoAlt: "Une bouteille couverte de balanes tout juste remontée de la mer",
    rows: [
      { date: "2026 · Hiver", title: "Prochaine remontée — la prévision rencontre la mesure", status: "À venir", accent: true },
      { date: "2025 ~ 2026", title: "Données marines mesurées au large de Namhae, modèle mensuel", status: "En cours", accent: false },
      { date: "2023 ~ 2026", title: "Plus de dix immersions et remontées — prévision et confirmation, répétées", status: "Cumulé", accent: false },
    ],
  },
  closing: {
    title: "Notre prévision est écrite. À la mer de répondre, désormais.",
    sub: ["Découvrez en avant-première la sortie d'une nouvelle cuvée et gardez à vie le relevé de son temps dans les profondeurs.", "Les places s'ouvrent à la mesure des bouteilles préparées."],
    cta: "Demander une invitation",
    secondary: "Restaurants gastronomiques et bars d'hôtel : voir l'espace partenaires.",
  },
};

const ja: MethodCopy = {
  meta: {
    title: "The Method · 記録の方法 | Muse de Marée",
    description:
      "海底熟成を予測するAI、OCEAN CELLAR™が南海 水深30mではたらく方法。記録し、予測し、検証を受け、補正します。",
  },
  hero: {
    title: "海は記録します。私たちは、その記録を読む方法を学んでいます。",
    sub: ["海底熟成を予測するAI OCEAN CELLAR™が", "南海 水深30mで行っていることです。"],
  },
  ch01: {
    h2: "海が書くものを記録します。",
    p1: "南海は、国立海洋調査院が直接実測している海です。海が書きつづける水温と塩分、潮流を毎月そのまま書き取ります。つくった数字ではなく実際の海の記録が、そのまま予測の土台になります。",
    p2: "瓶が沈められた場所は水深30m。ここの水は季節ごとに違う流れ方をし、瓶が海にとどまるあいだ、測定が止まることはありません。",
    photoAlt: "海底の砂地に置かれた浸漬ケージ",
    obsLabel: "直近30日の観測",
    obsSource: "KHOA · OPEN-METEO · 南海",
    obsNames: ["水温", "塩分", "潮位", "潮流の速さ", "水圧", "波高", "波周期", "海流の速さ"],
    liveLabel: "LIVE · 今この瞬間の測定",
    livePrefix: { temp: "水温", current: "海流", wave: "波高", pressure: "水圧", salinity: "塩分" },
  },
  ch02: {
    h2: "時間が通る道を予測します。",
    lead: "風味が熟成の時間とともにどう変わるのかを、112,316件のテイスティングで記録しました。このデータで学んだモデルが、六つの軸から風味を読みます。香りのひらく速さと気泡の残り方は、物理と化学の法則で整えます。そうして36ヶ月の変化をひとつの曲線に描きます。より良くなる道ではなく、地上とは異なる道です。",
    tagPlan: { em: "計画", text: "12ヶ月" },
    tagRec: { em: "推奨", text: "12ヶ月 · 84点" },
    tagPeak: { em: "PEAK", text: "14ヶ月 · 87点" },
    tlAria: "Atomes Crochus バッチの36ヶ月熟成予測曲線。推奨12ヶ月84点、ピーク14ヶ月87点。",
    tlTick36: "36ヶ月",
    tlTop: "100点",
    tlXAxis: "入水からの経過期間（ヶ月）",
    tlYAxis: "総合品質スコア（点）",
    svgTagPlan: "計画 12ヶ月",
    svgTagRec: "推奨 12ヶ月 · 84点",
    svgTagPeak: "PEAK 14ヶ月 · 87点",
    legend: ["総合品質", "質感", "気泡", "香りの減衰", "還元香"],
    tlProduct: "Mignon Boulard Atomes Crochus バッチの予測",
    radarH3: "同じ時間、異なるかたち",
    radarHint: "六つの軸の変化 · 地上 → 海底12ヶ月の予測",
    radarAria: "地上に対する海底12ヶ月の風味プロファイル・レーダー",
    radarAxes: ["果実香", "フローラル·ミネラル", "酵母·熟成香", "酸·爽やかさ", "ボディ·質感", "余韻·複雑さ"],
    radarAxesShort: ["果実香", "フローラル·ミネラル", "酵母·熟成香", "酸·爽やかさ", "ボディ·質感", "余韻·複雑さ"],
    radarLegendLand: "地上 · 入水前",
    radarLegendSea: "海底12ヶ月の予測",
    changeNote: "六つの軸がともに上下し、均衡があらためて定まります。良し悪しではなく、海がつくる別の均衡です。",
  },
  ch03: {
    h2: "引き揚げの日に、検証を受けます。",
    p1: "海がどう熟成させるかをあらかじめ予測し、引き揚げの前に書き留めておきます。引き揚げの日には地上で同じように保管した瓶と並べ、比較試飲で予測と実際を照らし合わせます。",
    p2: "当たっていたかどうかは、私たちが言いません。海が判定し、結果はそのまま公開します。",
    nextRetrieval: "次の引き揚げ · 2026年 冬",
    cardNo: "N° 2026-014",
    cardTitle: "予測記録書",
    cardTitleEn: "Sealed Prediction",
    cardSub: "先に記録し、引き揚げの日にひらきます。",
    cardSealedBadge: "SEALED · 引き揚げ時に公開",
    cardBatchLabel: "BATCH — ATOMES CROCHUS",
    cardBatch: [
      ["入水", "2026年01月 · 冬"],
      ["座標", "34°N · 126°E"],
      ["水深", "30 m"],
      ["引き揚げ予定", "2026年12月 · 冬"],
    ],
    cardAxesLabel: "風味予測 — 6 AXES",
    cardAxes: ["果実香", "フローラル·ミネラル", "酵母·熟成香", "酸", "ボディ", "余韻"],
    sealed: "未公開",
    retrievalAlt: "水面へ引き上げられる熟成ケージ",
  },
  ch04: {
    h2: "検証を受けたぶん、また補正します。",
    lead: "検証の結果は、ふたたびモデルへ戻ります。この3年の検証が今の予測をつくり、引き揚げを重ねるほど予測は精密になります。その記録はシステムの中だけにとどまらず、一本ごとに証書として残ります。",
    convAria: "十回の引き揚げで予測と実測の差が狭まり、その差がふたたび補正係数へ返る収束ダイアグラム",
    convStart: "1回目 · 2023",
    convEnd: "10回目 · 2026",
    convLegendPred: "予測",
    convLegendActual: "実測",
    convFeedback: "実測が補正係数を書き直す",
    loopH3: "みずから精密になる設計",
    loopCopy: "海へ出る前に、予測を先に書き留めます。引き揚げの日、その予測を実測と並べて置きます。ずれたぶんが次の予測を書き直し、引き揚げを重ねるほど二つはしだいに重なります。だから次の一本に書く予測は、年ごとに正確になります。",
    nfcAlt: "フジツボのついた瓶にスマートフォンをかざして記録をひらく手",
    certH3: "その記録が、一本ごとに残ります",
    certCopy: "システムの中で検証された履歴が瓶へ出て、証書になります。瓶にかざせば、入水の座標と水深、水温まで、過ごした時間がひらきます。同じものはひとつもありません。",
    certPhone: {
      aria: "瓶にスマートフォンをかざすとひらく記録の画面",
      graphTitle: "通ってきた海",
      graphMeta: "46 MONTHS AT SEA",
      seasons: ["2023 冬", "夏", "冬", "2026 冬"],
      rows: [
        { label: "過ごした時間", value: "46ヶ月", accent: true },
        { label: "通ってきた季節", value: "冬 4 · 夏 3" },
        { label: "予測の検証", value: "照合済み" },
      ],
    },
  },
  quote: {
    text: "予測を書き留めて海へ出る日は、試験を受けに行く気分です。判定は私たちの側にはないということ、それを知っているのがこの仕事のすべてです。",
    portraitAlt: "船上で海洋観測ダッシュボードを開いたタブレットを持つ手",
    attrName: "ミューズ・ド・マレ 記録チーム",
    attrOrg: "NAMHAE STATION",
  },
  archive: {
    h2: "この記録は、毎年発表されます。",
    lead: "入水したデータ、海の条件、検証の結果まで、日付とともに残します。\n飾る言葉ではなく、あったとおりの記録です。",
    photoAlt: "水面へ上がってきたフジツボのついた瓶",
    rows: [
      { date: "2026 · 冬", title: "次の引き揚げ、予測と実測の照合", status: "予定", accent: true },
      { date: "2025 ~ 2026", title: "南海の実測海洋データ、月別の環境モデル", status: "記録中", accent: false },
      { date: "2023 ~ 2026", title: "十回を超える入水と引き揚げ、予測と確認の反復", status: "累積", accent: false },
    ],
  },
  closing: {
    title: "私たちは予測を終えました。次は、海が答える番です。",
    sub: ["新しいキュヴェの発表をいちばん先に受け取り、海で過ごした時間の記録をいつでも読み返せる席です。", "席は、用意された本数の分だけひらきます。"],
    cta: "招待を申し込む",
    secondary: "ファインダイニングとホテルバーへのご案内は、パートナーのお問い合わせから。",
  },
};

export const METHOD_COPY: Record<Locale, MethodCopy> = { ko, en, fr, ja };
