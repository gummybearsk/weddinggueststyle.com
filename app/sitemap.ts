import { MetadataRoute } from "next";
import { getAllSlugs, getPageData } from "@/lib/getPages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://weddinggueststyle.com";

  const slugs = getAllSlugs();

  const innerPages = slugs.map((slug) => {
    const page = getPageData(slug);
    const lastMod = page?.publishDate ? new Date(page.publishDate) : new Date("2026-03-15");
    return {
      url: `${baseUrl}/${slug}`,
      lastModified: lastMod,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

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
