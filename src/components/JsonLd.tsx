export default function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Muse de Marée",
    url: "https://www.musedemaree.com",
    logo: "https://www.musedemaree.com/images/og.webp",
    description: "프랑스 샹파뉴에서 태어난 샴페인을 한국 남해 수심 50미터에서 숙성하는 럭셔리 샴페인 브랜드",
    foundingDate: "2026",
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Muse de Marée",
    url: "https://www.musedemaree.com",
    inLanguage: "ko",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
