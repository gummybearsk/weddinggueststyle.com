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

  const pillarPages = [
    { url: `${baseUrl}/season`, priority: 0.9 },
    { url: `${baseUrl}/dress-code`, priority: 0.9 },
    { url: `${baseUrl}/color`, priority: 0.9 },
    { url: `${baseUrl}/body-type`, priority: 0.9 },
    { url: `${baseUrl}/style`, priority: 0.9 },
    { url: `${baseUrl}/venue`, priority: 0.9 },
  ].map((p) => ({
    url: p.url,
    lastModified: new Date("2026-05-25"),
    changeFrequency: "weekly" as const,
    priority: p.priority,
  }));

  const trustPages = [
    { url: `${baseUrl}/about`, priority: 0.5 },
    { url: `${baseUrl}/editorial`, priority: 0.5 },
    { url: `${baseUrl}/privacy`, priority: 0.3 },
    { url: `${baseUrl}/terms`, priority: 0.3 },
    { url: `${baseUrl}/contact`, priority: 0.4 },
    { url: `${baseUrl}/author/sukie-gao`, priority: 0.5 },
  ].map((p) => ({
    url: p.url,
    lastModified: new Date("2026-04-15"),
    changeFrequency: "monthly" as const,
    priority: p.priority,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    ...pillarPages,
    ...innerPages,
    ...trustPages,
  ];
}
