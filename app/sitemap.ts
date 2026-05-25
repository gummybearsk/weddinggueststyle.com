import { MetadataRoute } from "next";
import { getAllSlugs, getPageData } from "@/lib/getPages";

// Revalidate every 24h so scheduled-publish pages appear in /sitemap.xml on their publish date
// without requiring a manual deploy. Required by Rule 17 for any site using publishDate gating.
export const revalidate = 86400;

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

  // Trust-page lastmod reflects when each page was last actually edited (Rule 17 — never `new Date()`)
  const trustPages = [
    { url: `${baseUrl}/about`,             priority: 0.5, lastMod: "2026-05-25" }, // edited today (author swap, AI disclosure)
    { url: `${baseUrl}/editorial`,         priority: 0.5, lastMod: "2026-04-15" },
    { url: `${baseUrl}/privacy`,           priority: 0.3, lastMod: "2026-04-15" },
    { url: `${baseUrl}/terms`,             priority: 0.3, lastMod: "2026-04-15" },
    { url: `${baseUrl}/contact`,           priority: 0.4, lastMod: "2026-05-25" }, // new page
    { url: `${baseUrl}/author/sukie-gao`,  priority: 0.5, lastMod: "2026-05-25" }, // new page
  ].map((p) => ({
    url: p.url,
    lastModified: new Date(p.lastMod),
    changeFrequency: "monthly" as const,
    priority: p.priority,
  }));

  return [
    {
      url: baseUrl,
      // Homepage was last edited today (hero refactor, pillar links). Never use `new Date()` here — wastes Google's crawl budget per Rule 17.
      lastModified: new Date("2026-05-25"),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    ...pillarPages,
    ...innerPages,
    ...trustPages,
  ];
}
