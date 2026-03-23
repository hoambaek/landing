export default function JsonLd() {
  const baseUrl = "https://www.musedemaree.com";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Muse de Marée",
    url: baseUrl,
    logo: `${baseUrl}/images/og.webp`,
    description:
      "프랑스 샹파뉴에서 태어난 샴페인을 한국 남해 수심 50미터에서 해저 숙성하는 럭셔리 샴페인 브랜드",
    foundingDate: "2026",
    brand: {
      "@type": "Brand",
      name: "Muse de Marée",
      slogan: "바다의 시간을 담은 샴페인",
    },
    sameAs: ["https://blog.musedemaree.com"],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Muse de Marée",
    url: baseUrl,
    inLanguage: "ko",
    description:
      "프랑스 샹파뉴에서 태어난 샴페인을 한국 남해 수심 50미터에서 숙성합니다. 바다의 온도, 해류, 수압이 만드는 시간의 기록.",
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Muse de Marée Collection",
    description: "바다가 기록한 여섯 개의 시간 — 해저 숙성 샴페인 컬렉션",
    numberOfItems: 6,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "En Lieu Sûr",
        url: `${baseUrl}/#archive`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "En Lieu Sûr Magnum",
        url: `${baseUrl}/#archive`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Élément de Surprise",
        url: `${baseUrl}/#archive`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Édition Zéro",
        url: `${baseUrl}/#archive`,
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Atomes Crochus 1 Year Aged",
        url: `${baseUrl}/#archive`,
      },
      {
        "@type": "ListItem",
        position: 6,
        name: "Atomes Crochus 3 Years Aged",
        url: `${baseUrl}/#archive`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "해저 숙성 샴페인이란 무엇인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "해저 숙성 샴페인은 프랑스 샹파뉴에서 생산된 샴페인을 바다 수심 50미터에 침수시켜 숙성하는 기법입니다. 수심 50미터에서는 약 6기압의 수압이 병 내부 압력과 평형을 이루며, 연중 일정한 수온(약 12-15°C)과 완전한 차광, 해류의 미세 진동이 독특한 숙성 환경을 만듭니다. Veuve Clicquot, Leclerc Briant 등 유수의 샴페인 하우스가 이 기법을 연구하고 있습니다.",
        },
      },
      {
        "@type": "Question",
        name: "Muse de Marée는 어디에서 샴페인을 숙성하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Muse de Marée는 한국 남해 수심 50미터에서 샴페인을 해저 숙성합니다. 프랑스 샹파뉴 Vallée de la Marne 지역의 4세대 메종 Champagne Mignon Boulard(1911년 설립)에서 생산된 샴페인을 한국 바다에서 숙성하여, 두 개의 떼루아(terroir)가 만나는 독보적인 경험을 만듭니다.",
        },
      },
      {
        "@type": "Question",
        name: "해저 숙성은 샴페인에 어떤 영향을 주나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "해저 환경의 일정한 수온, 수압, 완전한 차광, 해류의 미세 진동은 지상 셀러에서는 불가능한 숙성 조건을 만듭니다. James Suckling의 연구에 따르면, 해저 숙성 와인은 더 섬세한 미네랄리티와 정제된 질감을 보여줍니다. 수압이 병 내부 탄산과 평형을 이루며 오토리시스(autolysis) 과정이 더 집중적으로 이루어집니다.",
        },
      },
      {
        "@type": "Question",
        name: "Muse de Marée의 컬렉션은 어떤 것이 있나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Muse de Marée는 6개의 큐베 라인업을 제공합니다: En Lieu Sûr(Brut, 기준 큐베), En Lieu Sûr Magnum(1500ml, 24병 한정), Élément de Surprise(Blanc de Blancs, Non-dosé), Édition Zéro(2025 첫 빈티지, 50병 한정, 완판), Atomes Crochus 1 Year Aged(Ultra-Brut, Petit Meslier 블렌드), Atomes Crochus 3 Years Aged(Ultra-Brut, 40병 한정).",
        },
      },
      {
        "@type": "Question",
        name: "Muse de Marée는 언제 런칭하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Muse de Marée는 2026년 7-8월 공식 런칭 예정입니다. 첫 빈티지인 Édition Zéro(50병 한정)는 이미 완판되었으며, Ocean Cellar Privé 멤버십을 통해 한정 예약 및 월간 숙성 노트를 받아보실 수 있습니다.",
        },
      },
    ],
  };

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "Muse de Marée Ocean Cellar",
    description:
      "한국 남해 수심 50미터 해저 숙성 셀러. 연중 12-15°C, 약 6기압의 자연 환경에서 샴페인을 숙성합니다.",
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.7,
      longitude: 128.0,
    },
    containedInPlace: {
      "@type": "Place",
      name: "South Sea, South Korea",
      alternateName: "한국 남해",
    },
  };

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Muse de Marée 공식 런칭",
    description:
      "프랑스 샹파뉴에서 태어나 한국 남해 수심 50미터에서 숙성한 럭셔리 샴페인 브랜드 Muse de Marée의 공식 런칭",
    startDate: "2026-07-01",
    endDate: "2026-08-31",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "한국 남해",
      address: {
        "@type": "PostalAddress",
        addressLocality: "남해",
        addressRegion: "경상남도",
        addressCountry: "KR",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Muse de Marée",
      url: baseUrl,
    },
    performer: {
      "@type": "Organization",
      name: "Muse de Marée",
      url: baseUrl,
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/#ocean-circle`,
      availability: "https://schema.org/PreOrder",
      priceCurrency: "KRW",
      price: "0",
      validFrom: "2026-01-01",
    },
    image: `${baseUrl}/images/og.webp`,
  };

  const schemas = [
    organizationSchema,
    websiteSchema,
    collectionSchema,
    faqSchema,
    placeSchema,
    eventSchema,
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
