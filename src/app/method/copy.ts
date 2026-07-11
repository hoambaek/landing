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
    principlesLabel: string;
    principles: [string, string, string, string, string];
  };
  ch04: {
    h2: string;
    lead: string;
    convAria: string;
    convStart: string;
    convEnd: string;
    loopH3: string;
    loopCopy: string;
    nfcAlt: string;
    certH3: string;
    certCopy: string;
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
    sub: ["해저 숙성을 예측하는 AI OCEAN CELLAR™가", "남해 수심 30m에서 일하는 방식입니다."],
  },
  ch01: {
    h2: "바다가 쓰는 것을 기록합니다.",
    p1: "남해, 국립해양조사원의 관측이 닿는 바다입니다. 그 실측을 월별 수온과 염분, 조류로 옮겨 적습니다. 가정이 아니라 실제 바다가 모델에 들어갑니다.",
    p2: "수심 30m. 병이 잠긴 자리의 조건은 계절마다 다르게 흐르고, 병이 잠들어 있는 동안에도 측정은 멈추지 않습니다.",
    photoAlt: "해저 모래 바닥 위 침지 케이지",
    obsLabel: "최근 30일의 관측",
    obsSource: "KHOA · OPEN-METEO · 남해",
    obsNames: ["수온", "염분", "조위", "조류 유속", "수압", "파고", "파주기", "해류 속도"],
    liveLabel: "LIVE · 지금 이 순간의 측정",
    livePrefix: { temp: "수온", current: "해류", wave: "파고", pressure: "수압", salinity: "염분" },
  },
  ch02: {
    h2: "시간이 지나갈 길을 예측합니다.",
    lead: "숙성 시간을 따라 풍미가 어떻게 변해가는지 추적해 쌓은 테이스팅 기록 112,316건. 그 변화의 궤적으로 배운 모델이 여섯 개의 축으로 풍미를 읽습니다. 향이 열리는 속도와 기포가 남는 정도는 물리와 화학의 법칙으로 다듬습니다. 그렇게 36개월의 궤적 하나를 그립니다. 더 좋아지는 길이 아니라, 지상과는 다른 길입니다.",
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
    p1: "지난 4년, 열 번이 넘도록 담그고 끌어올리기를 반복했습니다. 예측은 인양 전에 미리 적어 두고, 인양하는 날 지상에서 보관한 병과 나란히 비교 시음으로 실측과 맞춰봅니다.",
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
    principlesLabel: "검증의 다섯 원칙",
    principles: ["대조군", "비교 시음", "복수의 시음가", "반복", "물성 측정"],
  },
  ch04: {
    h2: "검증된 만큼, 다시 보정합니다.",
    lead: "검증의 결과는 다시 모델로 돌아갑니다. 지난 4년의 검증이 지금의 예측을 만들었고, 인양이 거듭될수록 예측은 더 정밀해집니다. 그 기록은 시스템 안에만 머물지 않고, 병 하나하나에 증서로 남습니다.",
    convAria: "열 번의 인양에서 예측과 실측의 차이가 좁아지는 수렴 다이어그램",
    convStart: "1차 · 2022",
    convEnd: "10차 · 2026",
    loopH3: "스스로 정밀해지는 설계",
    loopCopy: "실측과 예측의 차이가 보정계수를 다시 씁니다. 데이터가 쌓이는 시간은 누구도 앞당길 수 없습니다. 그래서 이 기록은 해마다 단단해집니다.",
    nfcAlt: "따개비 붙은 병에 스마트폰을 가까이 대어 기록을 여는 손",
    certH3: "병마다 발행되는 기록",
    certCopy: "입수 좌표, 수심, 수온의 이력. 병에 가까이 대면 그 병이 살아낸 시간이 열립니다. 같은 병은 하나도 없습니다.",
  },
  quote: {
    text: "예측을 적어 두고 바다로 나가는 날은 시험을 치르러 가는 기분입니다. 판정은 우리 몫이 아니라는 것, 그걸 아는 게 이 일의 전부입니다.",
    portraitAlt: "배 위에서 해양 관측 대시보드가 열린 태블릿을 든 손",
    attrName: "뮤즈드마레 기록팀",
    attrOrg: "NAMHAE STATION",
  },
  archive: {
    h2: "이 기록은 매년 발표됩니다.",
    lead: "입수 데이터, 바다의 조건, 검증의 결과까지. 마케팅이 아니라 기록의 문법으로, 날짜와 함께 남깁니다.",
    photoAlt: "수면 위로 올라온 따개비 붙은 병",
    rows: [
      { date: "2026 · 겨울", title: "다음 인양, 예측과 실측의 대조", status: "예정", accent: true },
      { date: "2025 ~ 2026", title: "남해 실측 해양 데이터, 월별 환경 모델", status: "기록 중", accent: false },
      { date: "2022 ~ 2026", title: "열 번이 넘는 입수와 인양, 예측과 확인의 반복", status: "누적", accent: false },
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
    p1: "The waters off Namhae, within reach of the Korea Hydrographic and Oceanographic Agency's observations. We transcribe those measurements into monthly temperature, salinity, and currents. Not assumptions — the actual sea enters the model.",
    p2: "Thirty metres down. The conditions around the sleeping bottles shift with the seasons, and the measuring never stops.",
    photoAlt: "An immersion cage on the sandy seabed",
    obsLabel: "Observations · last 30 days",
    obsSource: "KHOA · OPEN-METEO · NAMHAE WATERS",
    obsNames: ["Temperature", "Salinity", "Tide level", "Tidal current", "Pressure", "Wave height", "Wave period", "Current speed"],
    liveLabel: "LIVE · MEASURING NOW",
    livePrefix: { temp: "Temp", current: "Current", wave: "Wave", pressure: "Pressure", salinity: "Salinity" },
  },
  ch02: {
    h2: "We predict the path time will take.",
    lead: "112,316 tasting records tracing how flavour changes across aging time. A model trained on those trajectories reads flavour along six axes. The pace at which aromas open and the way bubbles persist are refined by the laws of physics and chemistry. The result is a single 36-month trajectory. Not a better path — a different one from land.",
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
    p1: "Over the past four years, we have immersed and retrieved more than ten times. Predictions are written down before each retrieval; on the day itself, we taste the sea-aged bottles side by side with their land-kept counterparts and check the record against reality.",
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
    principlesLabel: "Five principles of verification",
    principles: ["Control group", "Comparative tasting", "Multiple tasters", "Repetition", "Physical measurement"],
  },
  ch04: {
    h2: "What is verified recalibrates the model.",
    lead: "Every verification flows back into the model. Four years of checking built today's predictions, and each retrieval makes the next one sharper. The record does not stay inside the system — it stays with each bottle, as a certificate.",
    convAria: "Convergence diagram: the gap between prediction and measurement narrows across ten retrievals",
    convStart: "Run 1 · 2022",
    convEnd: "Run 10 · 2026",
    loopH3: "A design that sharpens itself",
    loopCopy: "The gap between prediction and measurement rewrites the correction coefficients. The time it takes for data to accumulate cannot be hurried — which is why this record grows firmer every year.",
    nfcAlt: "A hand holding a phone to a barnacle-covered bottle to open its record",
    certH3: "A record issued for every bottle",
    certCopy: "Immersion coordinates, depth, the history of temperature. Hold your phone to the bottle and the time it lived through opens up. No two bottles are alike.",
  },
  quote: {
    text: "“The day we head out to sea with our predictions written down feels like sitting an exam. Knowing the grading is not ours to do — that is the whole of this work.”",
    portraitAlt: "Hands holding a tablet showing an ocean observation dashboard, on deck",
    attrName: "Muse de Marée Records Team",
    attrOrg: "NAMHAE STATION",
  },
  archive: {
    h2: "This record is published every year.",
    lead: "Immersion data, the sea's conditions, the verification results. Written in the grammar of records, not marketing — and dated.",
    photoAlt: "A barnacle-covered bottle just raised from the sea",
    rows: [
      { date: "2026 · Winter", title: "Next retrieval — prediction meets measurement", status: "Upcoming", accent: true },
      { date: "2025 ~ 2026", title: "Measured ocean data off Namhae, monthly environmental model", status: "Recording", accent: false },
      { date: "2022 ~ 2026", title: "More than ten immersions and retrievals — prediction and confirmation, repeated", status: "Accumulated", accent: false },
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
    p1: "Les eaux au large de Namhae, couvertes par les observations de l'agence hydrographique et océanographique de Corée (KHOA). Nous transcrivons ces mesures en températures, salinités et courants mensuels. Pas d'hypothèses — c'est la mer réelle qui entre dans le modèle.",
    p2: "Trente mètres de fond. Les conditions autour des bouteilles endormies changent au fil des saisons, et la mesure ne s'arrête jamais.",
    photoAlt: "Une cage d'immersion sur le fond sableux",
    obsLabel: "Observations · 30 derniers jours",
    obsSource: "KHOA · OPEN-METEO · EAUX DE NAMHAE",
    obsNames: ["Température", "Salinité", "Marée", "Courant de marée", "Pression", "Hauteur de vague", "Période de vague", "Courant"],
    liveLabel: "LIVE · MESURE EN CE MOMENT",
    livePrefix: { temp: "Temp.", current: "Courant", wave: "Vague", pressure: "Pression", salinity: "Salinité" },
  },
  ch02: {
    h2: "Nous prédisons le chemin que prendra le temps.",
    lead: "112 316 relevés de dégustation retraçant l'évolution des arômes au fil du vieillissement. Un modèle nourri de ces trajectoires lit le vin selon six axes. La vitesse d'ouverture des arômes et la tenue des bulles sont affinées par les lois de la physique et de la chimie. Il en résulte une trajectoire unique de 36 mois. Non pas meilleure — différente de la terre.",
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
    p1: "Depuis quatre ans, nous avons immergé et remonté plus de dix fois. Les prévisions sont écrites avant chaque remontée ; le jour même, nous dégustons les bouteilles vieillies en mer côte à côte avec leurs jumelles gardées à terre, et confrontons le relevé au réel.",
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
    principlesLabel: "Cinq principes de vérification",
    principles: ["Groupe témoin", "Dégustation comparative", "Plusieurs dégustateurs", "Répétition", "Mesures physiques"],
  },
  ch04: {
    h2: "Ce qui est vérifié recalibre le modèle.",
    lead: "Chaque vérification retourne au modèle. Quatre années d'épreuves ont construit les prévisions d'aujourd'hui, et chaque remontée affine la suivante. Ce relevé ne reste pas dans le système — il accompagne chaque bouteille, comme un certificat.",
    convAria: "Diagramme de convergence : l'écart entre prévision et mesure se resserre au fil de dix remontées",
    convStart: "1re · 2022",
    convEnd: "10e · 2026",
    loopH3: "Un système qui s'affine de lui-même",
    loopCopy: "L'écart entre prévision et mesure réécrit les coefficients de correction. Le temps d'accumuler les données ne peut être devancé — c'est pourquoi ce relevé se consolide année après année.",
    nfcAlt: "Une main approchant un téléphone d'une bouteille couverte de balanes pour ouvrir son relevé",
    certH3: "Un relevé délivré pour chaque bouteille",
    certCopy: "Coordonnées d'immersion, profondeur, historique des températures. Approchez votre téléphone de la bouteille : le temps qu'elle a vécu s'ouvre. Aucune bouteille ne ressemble à une autre.",
  },
  quote: {
    text: "« Le jour où nous prenons la mer, prévisions déjà écrites, c'est comme aller passer un examen. Savoir que la notation ne nous appartient pas — c'est tout le métier. »",
    portraitAlt: "Des mains tenant une tablette affichant un tableau de bord d'observation marine, sur le pont",
    attrName: "Équipe des relevés Muse de Marée",
    attrOrg: "NAMHAE STATION",
  },
  archive: {
    h2: "Ce relevé est publié chaque année.",
    lead: "Les données d'immersion, les conditions de la mer, les résultats de vérification. Dans la grammaire du relevé, non du marketing — et daté.",
    photoAlt: "Une bouteille couverte de balanes tout juste remontée de la mer",
    rows: [
      { date: "2026 · Hiver", title: "Prochaine remontée — la prévision rencontre la mesure", status: "À venir", accent: true },
      { date: "2025 ~ 2026", title: "Données marines mesurées au large de Namhae, modèle mensuel", status: "En cours", accent: false },
      { date: "2022 ~ 2026", title: "Plus de dix immersions et remontées — prévision et confirmation, répétées", status: "Cumulé", accent: false },
    ],
  },
  closing: {
    title: "Notre prévision est écrite. À la mer de répondre, désormais.",
    sub: ["Découvrez en avant-première la sortie d'une nouvelle cuvée et gardez à vie le relevé de son temps dans les profondeurs.", "Les places s'ouvrent à la mesure des bouteilles préparées."],
    cta: "Demander une invitation",
    secondary: "Restaurants gastronomiques et bars d'hôtel : voir l'espace partenaires.",
  },
};

export const METHOD_COPY: Record<Locale, MethodCopy> = { ko, en, fr };
