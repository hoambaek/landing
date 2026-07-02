import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.musedemaree.com";

  const languages = {
    ko: baseUrl,
    en: `${baseUrl}/en`,
    fr: `${baseUrl}/fr`,
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
  ];
}
