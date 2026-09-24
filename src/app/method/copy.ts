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
  };
  closing: { title: string; sub: [string, string]; cta: string; secondary: string };
}

const ko: MethodCopy = {
  meta: {
    title: "The Method · 기록의 방법 | Muse de Marée",
    description:
      "바다의 시간을 예측하는 OCEAN CELLAR™가 남해 수심 30m에서 일하는 방식. 기록하고, 예측하고, 검증받고, 보정합니다.",
  },
  hero: {
    title: "바다는 기록합니다. 우리는 그 기록을 읽는 법을 배우고 있습니다.",
    sub: ["바다의 시간을 예측하는 OCEAN CELLAR™가", "남해 수심 30m에서 하는 일입니다."],
  },
  ch01: {
    h2: "바다가 쓰는 것을 기록합니다.",
    p1: "병이 잠긴 남해 수심 30m를 우리는 날마다 재고, 기록합니다. 수온과 염분, 조류와 파고까지. 바다가 써 내려가는 것을 하루도 거르지 않고 받아 적고, 그 기록 위에서 예측을 세웁니다.",
    p2: "이 자리의 물은 계절마다 다르게 흐릅니다. 병이 바다에 머무는 동안, 우리의 측정은 멈추지 않습니다.",
    photoAlt: "해저 모래 바닥 위 침지 케이지",
    obsLabel: "최근 30일, 우리가 기록한 바다",
    obsSource: "남해 · 수심 30m",
    obsNames: ["수온", "염분", "조위", "조류 유속", "수압", "파고", "파주기", "해류 속도"],
    liveLabel: "LIVE · 지금 우리가 재는 바다",
    livePrefix: { temp: "수온", current: "해류", wave: "파고", pressure: "수압", salinity: "염분" },
  },
  ch02: {
    h2: "시간이 지나갈 길을 예측합니다.",
    lead: "112,316건의 테이스팅 기록에서 샴페인이 숙성 시간을 따라 어떻게 변하는지 배웠습니다. 그 모델이 여섯 개의 축으로 변화를 읽고, 열리는 속도와 기포가 남는 정도는 물리와 화학의 법칙으로 다듬습니다. 그렇게 36개월을 하나의 곡선으로 그립니다. 더 나은 길을 약속하지 않습니다. 지상과 다른 길을 그릴 뿐입니다.",
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
    radarAria: "지상 대비 해저 12개월 변화 프로파일 레이더",
    radarAxes: ["과실향", "플로럴·미네랄", "효모·숙성향", "산도·상쾌함", "바디감·질감", "여운·복합미"],
    radarAxesShort: ["과실향", "플로럴·미네랄", "효모·숙성향", "산도·상쾌함", "바디감·질감", "여운·복합미"],
    radarLegendLand: "지상 · 입수 전",
    radarLegendSea: "해저 12개월 예측",
    changeNote: "여섯 축이 함께 오르내리며 균형이 다시 잡힙니다. 우열을 가리지 않습니다. 바다가 만드는 또 하나의 균형입니다.",
  },
  ch03: {
    h2: "인양하는 날, 검증을 받습니다.",
    p1: "바다가 어떻게 숙성시킬지 미리 예측해, 인양하기 전에 적어 둡니다. 인양하는 날에는 지상에 똑같이 보관한 병과 나란히 두고, 비교 시음으로 예측과 실제를 맞춰봅니다.",
    p2: "맞았는지는 우리가 말하지 않습니다. 판정은 바다의 몫입니다. 결과는 그대로 공개합니다.",
    nextRetrieval: "다음 인양 · 2026년 겨울",
    cardNo: "N° 2026-014",
    cardTitle: "예측 기록서",
    cardSub: "먼저 기록하고, 인양하는 날 공개합니다.",
    cardSealedBadge: "SEALED · 인양 시 공개",
    cardBatchLabel: "BATCH · ATOMES CROCHUS",
    cardBatch: [
      ["입수", "2026년 01월 · 겨울"],
      ["좌표", "34°N · 126°E"],
      ["수심", "30 m"],
      ["인양", "2026년 12월 · 겨울"],
    ],
    cardAxesLabel: "변화 예측 · 6 AXES",
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
    loopH3: "인양할 때마다 정밀해지는 예측",
    loopCopy: "바다로 나가기 전에 예측을 먼저 적어 둡니다. 인양하는 날, 그 예측을 실측과 나란히 놓습니다. 어긋난 만큼이 다음 예측을 고쳐 쓰고, 인양이 거듭될수록 둘은 점점 겹쳐집니다. 그래서 다음 병에 적는 예측은 해마다 더 정확해집니다.",
    nfcAlt: "따개비 붙은 병에 스마트폰을 가까이 대어 기록을 여는 손",
    certH3: "그 기록이 병마다 남습니다",
    certCopy: "검증을 마친 이력은 병마다 증서가 됩니다. 휴대폰을 가까이 대면 입수 좌표와 수심, 수온, 바다에서 살아낸 시간이 열립니다. 같은 기록은 하나도 없습니다.",
    certPhone: {
      aria: "휴대폰을 대면 열리는 병별 기록 화면",
      graphTitle: "당신의 병이 지나온 바다",
      graphMeta: "12 MONTHS AT SEA",
      seasons: ["2026 겨울", "봄", "가을", "겨울"],
      rows: [
        { label: "살아낸 시간", value: "12개월", accent: true },
        { label: "지나온 계절", value: "네 계절" },
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
    lead: "입수한 데이터, 바다의 조건, 검증 결과까지 날짜와 함께 적어 둡니다.\n꾸미지 않고, 있었던 그대로 남깁니다.",
    photoAlt: "수면 위로 올라온 따개비 붙은 병",
  },
  closing: {
    title: "우리는 예측을 마쳤습니다. 이제 바다가 답할 차례입니다.",
    sub: ["새 에디션을 가장 먼저 만나고, 바다에서 보낸 시간의 기록을 평생 열람하는 자리입니다.", "자리는 준비된 병의 수만큼만 열립니다."],
    cta: "초대 신청하기",
    secondary: "파인다이닝과 호텔 바를 위한 안내는 파트너 문의로.",
  },
};

const en: MethodCopy = {
  meta: {
    title: "The Method · How the Record Is Made | Muse de Marée",
    description:
      "How OCEAN CELLAR™, which predicts the sea's time, works 30 m below the sea off Namhae. It records, predicts, is verified, and recalibrates.",
  },
  hero: {
    title: "The sea keeps a record. We are learning to read it.",
    sub: ["How OCEAN CELLAR™, which predicts the sea's time,", "works 30 m below the sea off Namhae."],
  },
  ch01: {
    h2: "We record what the sea writes.",
    p1: "Every day we measure and record the water where the bottles rest, 30 m down off Namhae. Temperature, salinity, currents, waves. We take down what the sea writes without missing a day, and build our predictions on that record.",
    p2: "The water here moves differently with each season. For as long as a bottle stays in the sea, our measuring never stops.",
    photoAlt: "An immersion cage on the sandy seabed",
    obsLabel: "The last 30 days, as we recorded them",
    obsSource: "NAMHAE · 30 M DEEP",
    obsNames: ["Temperature", "Salinity", "Tide level", "Tidal current", "Pressure", "Wave height", "Wave period", "Current speed"],
    liveLabel: "LIVE · THE SEA WE ARE MEASURING",
    livePrefix: { temp: "Temp", current: "Current", wave: "Wave", pressure: "Pressure", salinity: "Salinity" },
  },
  ch02: {
    h2: "We predict the path time will take.",
    lead: "From 112,316 tasting records we learned how champagne changes over aging time. A model reads that change along six axes, and the pace at which it opens and the way bubbles persist are refined by the laws of physics and chemistry. From it we draw a single 36-month curve. We promise no better path. Only a different one from the land.",
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
    radarAria: "Profile radar: land versus 12 months undersea (predicted)",
    radarAxes: ["Fruit", "Floral · Mineral", "Yeast · Maturity", "Acidity · Freshness", "Body · Texture", "Finish · Complexity"],
    radarAxesShort: ["Fruit", "Floral", "Yeast", "Acidity", "Body", "Finish"],
    radarLegendLand: "Land · before immersion",
    radarLegendSea: "Undersea · 12-month prediction",
    changeNote: "All six axes move together and settle into a new balance. Neither better nor worse. Another balance, made by the sea.",
  },
  ch03: {
    h2: "On retrieval day, we are put to the test.",
    p1: "We predict how the sea will age each bottle and write it down before retrieval. On the day, we set it beside an identical bottle kept on land and check prediction against reality through a comparative tasting.",
    p2: "Whether we were right is not ours to say. The verdict belongs to the sea. The results are published as they are.",
    nextRetrieval: "Next retrieval · Winter 2026",
    cardNo: "N° 2026-014",
    cardTitle: "Prediction Record",
    cardSub: "Written first, opened on retrieval day.",
    cardSealedBadge: "SEALED · Opens at retrieval",
    cardBatchLabel: "BATCH · ATOMES CROCHUS",
    cardBatch: [
      ["Immersed", "JAN 2026 · WINTER"],
      ["Coordinates", "34°N · 126°E"],
      ["Depth", "30 m"],
      ["Retrieval", "DEC 2026 · WINTER"],
    ],
    cardAxesLabel: "CHANGE PREDICTION · 6 AXES",
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
    loopH3: "A prediction sharpened with every retrieval",
    loopCopy: "We write the prediction before heading out to sea. On the day of retrieval, we lay that prediction beside the measurement. The gap rewrites the next prediction, and with each retrieval the two draw closer. So the prediction we write on the next bottle grows more accurate every year.",
    nfcAlt: "A hand holding a phone to a barnacle-covered bottle to open its record",
    certH3: "That record settles into each bottle",
    certCopy: "Once verified, the history becomes a certificate for every bottle. Hold your phone close and the immersion coordinates, depth, temperature and time spent at sea open up. No two records are alike.",
    certPhone: {
      aria: "The bottle record screen that opens when you hold a phone to it",
      graphTitle: "The sea your bottle passed through",
      graphMeta: "12 MONTHS AT SEA",
      seasons: ["2026 Winter", "Spring", "Autumn", "Winter"],
      rows: [
        { label: "Time at sea", value: "12 months", accent: true },
        { label: "Seasons passed", value: "Four seasons" },
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
    lead: "Immersion data, the sea's conditions, verification results, all kept with their dates. Nothing embellished, only what happened.",
    photoAlt: "A barnacle-covered bottle just raised from the sea",
  },
  closing: {
    title: "Our prediction is written. Now it is the sea's turn to answer.",
    sub: ["Be the first to meet each new edition, and keep the record of its time at sea for life.", "Seats open only as many as the bottles prepared."],
    cta: "Request an invitation",
    secondary: "For fine dining and hotel bars, see partnership enquiries.",
  },
};

const fr: MethodCopy = {
  meta: {
    title: "The Method · La fabrique du relevé | Muse de Marée",
    description:
      "Comment OCEAN CELLAR™, qui prédit le temps de la mer, fonctionne à 30 m de profondeur au large de Namhae. Mesurer, prédire, être vérifié, recalibrer.",
  },
  hero: {
    title: "La mer tient un relevé. Nous apprenons à le lire.",
    sub: ["Comment OCEAN CELLAR™, qui prédit le temps de la mer,", "fonctionne à 30 m de profondeur au large de Namhae."],
  },
  ch01: {
    h2: "Nous consignons ce que la mer écrit.",
    p1: "Chaque jour, nous mesurons et consignons l’eau où reposent les bouteilles, à 30 m de profondeur au large de Namhae. Température, salinité, courants, houle. Nous relevons sans relâche ce que la mer écrit, et nos prévisions reposent sur ce relevé.",
    p2: "Ici, l’eau circule différemment à chaque saison. Tant qu’une bouteille demeure en mer, notre mesure ne s’arrête jamais.",
    photoAlt: "Une cage d’immersion sur le fond sableux",
    obsLabel: "Les 30 derniers jours, tels que nous les avons relevés",
    obsSource: "NAMHAE · 30 M DE PROFONDEUR",
    obsNames: ["Température", "Salinité", "Marée", "Courant de marée", "Pression", "Hauteur de vague", "Période de vague", "Courant"],
    liveLabel: "EN DIRECT · LA MER QUE NOUS MESURONS",
    livePrefix: { temp: "Temp.", current: "Courant", wave: "Vague", pressure: "Pression", salinity: "Salinité" },
  },
  ch02: {
    h2: "Nous prédisons le chemin que prendra le temps.",
    lead: "À partir de 112 316 relevés de dégustation, nous avons étudié comment le champagne évolue au fil du vieillissement. Un modèle lit cette évolution selon six axes, et la vitesse d’ouverture comme la tenue des bulles sont affinées grâce aux lois de la physique et de la chimie. Nous en traçons une seule courbe sur 36 mois. Nous ne promettons pas une meilleure voie, seulement une voie différente de celle du vieillissement à terre.",
    tagPlan: { em: "PRÉVU", text: "12 mois" },
    tagRec: { em: "CONSEILLÉ", text: "12 mois · 84" },
    tagPeak: { em: "PIC", text: "14 mois · 87" },
    tlAria: "Courbes de prévision sur 36 mois pour le lot Atomes Crochus. Conseillé à 12 mois (84), pic à 14 mois (87).",
    tlTick36: "36 mois",
    tlTop: "100",
    tlXAxis: "Mois depuis l’immersion",
    tlYAxis: "Score de qualité globale",
    svgTagPlan: "Prévu · 12 mois",
    svgTagRec: "Conseillé · 12 mois · 84",
    svgTagPeak: "Pic · 14 mois · 87",
    legend: ["Qualité globale", "Texture", "Bulles", "Déclin aromatique", "Réduction"],
    tlProduct: "Prévision pour le lot Mignon Boulard Atomes Crochus",
    radarH3: "Le même temps, une autre forme",
    radarHint: "Six axes · terre → 12 mois sous la mer, prévision",
    radarAria: "Radar du profil d’évolution : terre contre 12 mois sous la mer (prévision)",
    radarAxes: ["Fruité", "Floral · Minéral", "Levure · Évolution", "Acidité · Fraîcheur", "Corps · Texture", "Finale · Complexité"],
    radarAxesShort: ["Fruité", "Floral", "Levure", "Acidité", "Corps", "Finale"],
    radarLegendLand: "Terre · avant immersion",
    radarLegendSea: "Sous la mer · prévision à 12 mois",
    changeNote: "Les six axes évoluent ensemble vers un nouvel équilibre. Ni meilleur ni moins bon. Un autre équilibre, façonné par la mer.",
  },
  ch03: {
    h2: "Le jour de la remontée, nous sommes mis à l’épreuve.",
    p1: "Nous prédisons comment la mer fera vieillir chaque bouteille et consignons cette prévision avant la remontée. Le jour venu, nous la plaçons à côté d’une bouteille identique conservée à terre et confrontons la prévision au réel par une dégustation comparative.",
    p2: "Avoir eu raison ou tort, ce n’est pas à nous de le dire. Le verdict appartient à la mer. Les résultats sont publiés tels quels.",
    nextRetrieval: "Prochaine remontée · hiver 2026",
    cardNo: "N° 2026-014",
    cardTitle: "Registre de prévision",
    cardSub: "Écrit avant la remontée, ouvert le jour venu.",
    cardSealedBadge: "SCELLÉ · Ouvert à la remontée",
    cardBatchLabel: "LOT · ATOMES CROCHUS",
    cardBatch: [
      ["Immersion", "JANV. 2026 · HIVER"],
      ["Coordonnées", "34° N · 126° E"],
      ["Profondeur", "30 m"],
      ["Remontée", "DÉC. 2026 · HIVER"],
    ],
    cardAxesLabel: "PRÉVISION D’ÉVOLUTION · 6 AXES",
    cardAxes: ["Fruité", "Floral · Minéral", "Levure · Évolution", "Acidité", "Corps", "Finale"],
    sealed: "Scellé",
    retrievalAlt: "Une cage de vieillissement remontée à la surface",
  },
  ch04: {
    h2: "Ce qui est vérifié recalibre le modèle.",
    lead: "Chaque vérification retourne au modèle. Trois années de vérifications ont permis d’établir les prévisions d’aujourd’hui, et chaque remontée affine la suivante. Ce relevé ne reste pas dans le système — il accompagne chaque bouteille, comme un certificat.",
    convAria: "Diagramme de convergence : l’écart entre prévision et mesure se resserre au fil de dix remontées, et cet écart se réinjecte dans les coefficients de correction",
    convStart: "1re · 2023",
    convEnd: "10e · 2026",
    convLegendPred: "Prévu",
    convLegendActual: "Mesuré",
    convFeedback: "La mesure réécrit les coefficients",
    loopH3: "Une prévision qui s’affine à chaque remontée",
    loopCopy: "Nous consignons la prévision avant de prendre la mer. Le jour de la remontée, nous plaçons cette prévision à côté de la mesure. L’écart permet d’ajuster la prévision suivante, et à chaque remontée les deux se rapprochent. Ainsi la prévision inscrite sur la bouteille suivante gagne en précision chaque année.",
    nfcAlt: "Une main approchant un téléphone d’une bouteille couverte de balanes pour ouvrir son relevé",
    certH3: "Ce relevé accompagne chaque bouteille",
    certCopy: "Une fois vérifié, l’historique devient un certificat pour chaque bouteille. Approchez votre téléphone pour accéder aux coordonnées d’immersion, à la profondeur, à la température et au temps passé en mer. Aucun relevé ne ressemble à un autre.",
    certPhone: {
      aria: "L’écran du relevé, ouvert en approchant un téléphone de la bouteille",
      graphTitle: "La mer traversée par votre bouteille",
      graphMeta: "12 MOIS EN MER",
      seasons: ["Hiver 2026", "Printemps", "Automne", "Hiver"],
      rows: [
        { label: "Temps passé en mer", value: "12 mois", accent: true },
        { label: "Saisons traversées", value: "Quatre saisons" },
        { label: "Vérification", value: "Confirmée" },
      ],
    },
  },
  quote: {
    text: "« Écrire notre prévision puis prendre la mer, c’est comme aller passer un examen. Ce n’est pas à nous de noter. Accepter cela, c’est tout le sens de ce travail. »",
    portraitAlt: "Des mains tenant une tablette affichant un tableau de bord d’observation marine, sur le pont",
    attrName: "Équipe des relevés Muse de Marée",
    attrOrg: "NAMHAE STATION",
  },
  archive: {
    h2: "Ce relevé est publié chaque année.",
    lead: "Les données d’immersion, les conditions de la mer et les résultats des vérifications sont consignés avec leur date. Sans rien embellir, tel que cela s’est passé.",
    photoAlt: "Une bouteille couverte de balanes tout juste remontée de la mer",
  },
  closing: {
    title: "Notre prévision est écrite. À la mer de répondre, désormais.",
    sub: ["Découvrez en avant-première chaque nouvelle cuvée et conservez à vie le relevé de son temps passé en mer.", "Les places sont limitées au nombre de bouteilles préparées."],
    cta: "Demander une invitation",
    secondary: "Restaurants gastronomiques et bars d’hôtel : découvrez notre espace partenaires.",
  },
};

const ja: MethodCopy = {
  meta: {
    title: "The Method · 記録の方法 | Muse de Marée",
    description:
      "海の時間を予測するOCEAN CELLAR™が、韓国南岸・南海（ナムヘ）の水深30mで行っていること。記録し、予測し、検証し、補正する。",
  },
  hero: {
    title: "海は記録する。私たちは、その記録の読み方を学んでいる。",
    sub: ["海の時間を予測するOCEAN CELLAR™が", "韓国南岸・南海（ナムヘ）、水深30mで行っていることです。"],
  },
  ch01: {
    h2: "海が刻む変化を、記録する。",
    p1: "ボトルが沈む南海（ナムヘ）の水深30mを、私たちは毎日測り、記録しています。水温、塩分、潮流、波の高さまで。海が綴るものを一日も欠かさず書き留め、その記録の上に予測を立てます。",
    p2: "この海域の流れは季節ごとに変わります。ボトルが海中にあるあいだ、私たちの観測が止まることはありません。",
    photoAlt: "海底の砂地に置かれた熟成ケージ",
    obsLabel: "直近30日、私たちが記録した海",
    obsSource: "南海（ナムヘ）· 水深30m",
    obsNames: ["水温", "塩分", "潮位", "潮流速度", "水圧", "波高", "波周期", "海流速度"],
    liveLabel: "LIVE · いま私たちが測っている海",
    livePrefix: { temp: "水温", current: "海流", wave: "波高", pressure: "水圧", salinity: "塩分" },
  },
  ch02: {
    h2: "熟成がたどる道筋を、予測する。",
    lead: "熟成の時間とともにシャンパーニュがどう変わるのか。それを112,316件のテイスティング記録から学んできました。そのモデルが六つの軸で変化を読み取り、ひらき方や気泡の残り方は物理と化学の法則をもとに補正します。こうして、36ヶ月の変化を一本の曲線として描きます。より良い道を約束するものではありません。地上とは異なる道を描くだけです。",
    tagPlan: { em: "計画", text: "12ヶ月" },
    tagRec: { em: "推奨", text: "12ヶ月 · 84点" },
    tagPeak: { em: "PEAK", text: "14ヶ月 · 87点" },
    tlAria: "Atomes Crochus バッチの36ヶ月熟成予測曲線。推奨12ヶ月84点、ピーク14ヶ月87点。",
    tlTick36: "36ヶ月",
    tlTop: "100点",
    tlXAxis: "海中投入からの経過期間（ヶ月）",
    tlYAxis: "総合品質スコア（点）",
    svgTagPlan: "計画 12ヶ月",
    svgTagRec: "推奨 12ヶ月 · 84点",
    svgTagPeak: "PEAK 14ヶ月 · 87点",
    legend: ["総合品質", "質感", "気泡", "香りの減衰", "還元香"],
    tlProduct: "Mignon Boulard Atomes Crochus バッチの予測",
    radarH3: "同じ12ヶ月、異なるかたち",
    radarHint: "六つの軸の変化 · 投入前 → 海底12ヶ月の予測",
    radarAria: "投入前と海底熟成12ヶ月後（予測）を比較する変化プロファイルのレーダーチャート",
    radarAxes: ["果実香", "フローラル・ミネラル", "酵母・熟成香", "酸味・爽やかさ", "ボディ・質感", "余韻・複雑さ"],
    radarAxesShort: ["果実香", "フローラル・ミネラル", "酵母・熟成香", "酸味・爽やかさ", "ボディ・質感", "余韻・複雑さ"],
    radarLegendLand: "地上 · 投入前",
    radarLegendSea: "海底12ヶ月の予測",
    changeNote: "六つの軸がそれぞれに動き、新しいバランスが生まれます。優劣はつけません。海がもたらす、もうひとつの均衡です。",
  },
  ch03: {
    h2: "引き揚げの日に、予測を検証する。",
    p1: "海底でどう熟成が進むかを予測し、引き揚げの前に書き留めておきます。引き揚げの日には、地上で保管した同じロットの対照ボトルと並べ、比較試飲で予測と結果を照合します。",
    p2: "予測が正しかったかどうかを決めるのは、私たちではありません。判定は海に委ねます。結果はそのまま公開します。",
    nextRetrieval: "次の引き揚げ · 2026年冬",
    cardNo: "N° 2026-014",
    cardTitle: "予測記録",
    cardSub: "予測を事前に封印し、引き揚げの日に公開します。",
    cardSealedBadge: "SEALED · 引き揚げの日に公開",
    cardBatchLabel: "BATCH · ATOMES CROCHUS",
    cardBatch: [
      ["海中投入", "2026年01月 · 冬"],
      ["座標", "34°N · 126°E"],
      ["水深", "30 m"],
      ["引き揚げ", "2026年12月 · 冬"],
    ],
    cardAxesLabel: "変化予測 · 6 AXES",
    cardAxes: ["果実香", "フローラル・ミネラル", "酵母・熟成香", "酸味", "ボディ", "余韻"],
    sealed: "未公開",
    retrievalAlt: "水面へ引き揚げられる熟成ケージ",
  },
  ch04: {
    h2: "検証のたびに、モデルを補正する。",
    lead: "検証の結果は、モデルの再学習と補正に反映されます。2023年から積み重ねてきた検証が現在の予測をつくり、回を重ねるほど精度は高まります。その記録はシステムの中にとどまらず、一本ごとの証書として残ります。",
    convAria: "十回の引き揚げで予測値と評価値の差が縮まり、その差分が補正係数に反映される過程を示した図",
    convStart: "1回目 · 2023",
    convEnd: "10回目 · 2026",
    convLegendPred: "予測",
    convLegendActual: "評価",
    convFeedback: "評価値を補正係数に反映",
    loopH3: "引き揚げのたびに精度が高まる予測",
    loopCopy: "海へ出る前に、予測を書き留めておきます。引き揚げの日、その予測を官能評価の結果と照合します。生じた差は次の予測の補正に反映され、引き揚げを重ねるごとに、予測と実際の評価は近づいていきます。だから次のボトルに記す予測は、年々確かなものになります。",
    nfcAlt: "フジツボのついたボトルにスマートフォンをかざし、記録をひらく手",
    certH3: "一本ごとに残る、検証の記録",
    certCopy: "検証を終えた履歴は、一本ごとの証書になります。スマートフォンをかざせば、沈めた地点の座標、水深、水温、そして海で過ごした時間をたどれます。同じ記録は、ひとつとしてありません。",
    certPhone: {
      aria: "スマートフォンをかざすとひらく、ボトルごとの記録画面",
      graphTitle: "あなたのボトルが過ごした海",
      graphMeta: "12 MONTHS AT SEA",
      seasons: ["2026 冬", "春", "秋", "冬"],
      rows: [
        { label: "海で過ごした時間", value: "12ヶ月", accent: true },
        { label: "海で重ねた季節", value: "四つの季節" },
        { label: "予測の検証", value: "照合済み" },
      ],
    },
  },
  quote: {
    text: "予測を書き留めて海へ出る日は、試験に臨むような気持ちです。答えを決めるのは、私たちではない。それを知っていることが、この仕事のすべてです。",
    portraitAlt: "船上で海洋観測ダッシュボードを開いたタブレットを持つ手",
    attrName: "ミューズ・ド・マレ 記録チーム",
    attrOrg: "NAMHAE STATION",
  },
  archive: {
    h2: "記録を、毎年公開する。",
    lead: "観測データ、海の条件、検証の結果まで、日付とともに書き留めます。\n飾らずに、あったことをそのまま残します。",
    photoAlt: "水面へ上がってきたフジツボのついたボトル",
  },
  closing: {
    title: "私たちは予測を終えた。あとは、海が答える番。",
    sub: ["新しいキュヴェのご案内をいち早く受け取り、海で過ごした時間の記録を、いつまでもたどれます。", "ご招待は、ご用意できるボトルの数に限られます。"],
    cta: "招待を希望する",
    secondary: "ファインダイニング、ホテルバーでのお取り扱いは、パートナーシップに関するお問い合わせへ。",
  },
};

export const METHOD_COPY: Record<Locale, MethodCopy> = { ko, en, fr, ja };
