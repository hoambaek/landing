import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.musedemaree.com";

  const languages = {
    ko: baseUrl,
    en: `${baseUrl}/en`,
    fr: `${baseUrl}/fr`,
    ja: `${baseUrl}/ja`,
  };

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: languages.en,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages },
    },
    {
      url: languages.fr,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages },
    },
    {
      url: languages.ja,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages },
    },
    ...(["/method", "/en/method", "/fr/method", "/ja/method"] as const).map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          ko: `${baseUrl}/method`,
          en: `${baseUrl}/en/method`,
          fr: `${baseUrl}/fr/method`,
          ja: `${baseUrl}/ja/method`,
        },
      },
    })),
    ...["terms", "privacy", "cookies"].map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
