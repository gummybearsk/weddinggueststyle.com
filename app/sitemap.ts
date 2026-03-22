import { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/getPages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://weddinggueststyle.com";

  const slugs = getAllSlugs();

  const innerPages = slugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...innerPages,
  ];
}
