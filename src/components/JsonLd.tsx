export default function JsonLd() {
  const baseUrl = "https://www.musedemaree.com";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Muse de Marée",
    url: baseUrl,
    logo: `${baseUrl}/images/og.webp`,
    description:
      "샴페인 하우스가 아니라, 바다의 시간을 기록하는 브랜드. 프랑스 샹파뉴에서 태어난 샴페인을 한국 남해 수심 30m에서 숙성하며, 모든 병에 그 시간의 기록을 동봉합니다.",
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
      "프랑스 샹파뉴에서 태어난 샴페인을 한국 남해 수심 30m에서 숙성합니다. 입수부터 인양까지 바다의 시간을 측정하고, 그 기록과 함께 병을 건넵니다.",
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Muse de Marée Collection",
    description: "바다가 기록한 여섯 개의 시간 · 해저 숙성 샴페인 컬렉션",
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
        name: "Atomes Crochus 2 Years Aged",
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
          text: "프랑스 샹파뉴에서 태어난 샴페인을 한국 남해 수심 30m의 바다에서 숙성하는 방식입니다. 입수부터 인양까지 전 기간의 수온·해류를 측정해, 병마다 기록으로 동봉합니다. 헤리티지를 주장하는 대신 기록으로 증명합니다.",
        },
      },
      {
        "@type": "Question",
        name: "Muse de Marée는 어디에서 샴페인을 숙성하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "한국 남해 수심 30m에서 숙성합니다. 와인은 프랑스 샹파뉴 Vallée de la Marne 지역의 4세대 메종 Champagne Mignon Boulard(1911년 설립)에서 옵니다.",
        },
      },
      {
        "@type": "Question",
        name: "Muse de Marée는 무엇이 다른가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "병 단위로 숙성 전 기간이 측정·기록·공개되는 샴페인입니다. 입수일·좌표·수심·인양일과 그 병이 바다에서 보낸 전 기간의 수온·해류 기록이 함께 옵니다. 병은 음료가 아니라, 바다가 쓴 시간의 기록 매체입니다.",
        },
      },
      {
        "@type": "Question",
        name: "Muse de Marée의 컬렉션은 어떤 것이 있나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "여섯 개의 퀴베가 있습니다: En Lieu Sûr(Brut, 모든 퀴베의 기준), En Lieu Sûr Magnum(1500ml), Élément de Surprise(Blanc de Blancs, Non-dosé), Édition Zéro(서막 · 최초 인양분), Atomes Crochus 1 Year(Ultra-Brut, Petit Meslier 블렌드), Atomes Crochus 2 Years(Ultra-Brut, Petit Meslier 블렌드). 숙성 기간은 6개월·1년·2년의 세 단계로, 브랜드의 기준 시간은 1년입니다.",
        },
      },
      {
        "@type": "Question",
        name: "Muse de Marée는 언제 런칭하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "2026년 7-8월 공식 런칭 예정입니다. Ocean Cellar Privé 멤버십을 통해 아직 바다 아래에 있는 병의 주인이 되는 경험과 월간 숙성 기록을 받아보실 수 있습니다.",
        },
      },
    ],
  };

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "Muse de Marée Ocean Cellar",
    description:
      "한국 남해 수심 30m의 해저 숙성 장소. 완전한 차광과 해류 속에서, 입수부터 인양까지 샴페인의 시간을 측정하고 기록합니다.",
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
      "프랑스 샹파뉴에서 태어나 한국 남해 수심 30m에서 숙성한 샴페인, 그 시간의 기록과 함께 건네는 Muse de Marée의 공식 런칭",
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
