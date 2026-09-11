import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAllSlugsIncludingScheduled, getPageData } from "@/lib/getPages";

export const dynamic = "force-dynamic";

const BASE_URL = "https://weddinggueststyle.com";

// Hubs and trust routes that render listings of published pages. They must be
// revalidated alongside the pages themselves, or a newly-live page stays absent
// from every listing that links to it.
const LISTING_ROUTES = ["/", "/season", "/dress-code", "/color", "/body-type", "/style", "/venue"];

/**
 * Daily publish sweep — Rule 17(d).
 *
 * A date-scheduled page calls notFound() until its publishDate. Next writes that
 * 404 into the ISR store and, unlike a normal page, NEVER clears it on the route's
 * `revalidate` interval. So a single early request — a crawler, a link checker, or
 * our own verification curl — pins that URL as 404 until the next deployment, while
 * the sitemap happily lists it. revalidatePath() is the only thing that clears it.
 *
 * Announce-to-IndexNow happens only AFTER revalidation, never before: telling Bing
 * to crawl a still-pinned 404 is worse than staying silent.
 */
async function sweep() {
  const today = new Date().toISOString().split("T")[0];
  const revalidated: string[] = [];

  for (const slug of getAllSlugsIncludingScheduled()) {
    const page = getPageData(slug);
    if (!page) continue;
    // No publishDate means always-published; otherwise sweep everything already due.
    if (page.publishDate && page.publishDate > today) continue;
    revalidatePath(`/${slug}`);
    revalidated.push(slug);
  }

  for (const route of LISTING_ROUTES) revalidatePath(route);

  // Pages that went live in the last 2 days. A 2-day window rather than today-only
  // means one missed cron run does not silently skip a page forever.
  const windowStart = new Date(Date.now() - 2 * 86400_000).toISOString().split("T")[0];
  const newlyLive = getAllSlugsIncludingScheduled().filter((slug) => {
    const d = getPageData(slug)?.publishDate;
    return d && d <= today && d >= windowStart;
  });

  return { today, revalidated, newlyLive };
}

/**
 * Re-fetch our own sitemap and ASSERT the newly-live slugs are in it.
 * revalidatePath() only MARKS a path stale — regeneration lands on the following
 * request — so retry before declaring failure.
 */
async function assertSitemap(newlyLive: string[]) {
  let xml = "";
  let urlCount = 0;
  let missing: string[] = newlyLive;

  for (let attempt = 0; attempt < 3 && missing.length > 0; attempt++) {
    const res = await fetch(`${BASE_URL}/sitemap.xml`, { cache: "no-store" });
    xml = await res.text();
    urlCount = (xml.match(/<loc>/g) || []).length;
    missing = newlyLive.filter((slug) => !xml.includes(`${BASE_URL}/${slug}<`));
    if (missing.length > 0) await new Promise((r) => setTimeout(r, 2000));
  }

  return { urlCount, missing };
}

async function notifyIndexNow(slugs: string[]) {
  if (slugs.length === 0) return { submitted: 0 };
  const key = "1d74c00d810c48213dc0f8a78746e41a";
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: "weddinggueststyle.com",
      key,
      keyLocation: `${BASE_URL}/${key}.txt`,
      urlList: slugs.map((s) => `${BASE_URL}/${s}`),
    }),
  });
  return { submitted: slugs.length, status: res.status };
}

export async function GET() {
  const { today, revalidated, newlyLive } = await sweep();
  const sitemap = await assertSitemap(newlyLive);

  // Only announce once the sitemap actually shows the page.
  const safeToAnnounce = newlyLive.filter((s) => !sitemap.missing.includes(s));
  const indexnow = await notifyIndexNow(safeToAnnounce);

  const ok = sitemap.missing.length === 0;

  return NextResponse.json(
    {
      ok,
      today,
      revalidatedCount: revalidated.length,
      newlyLive,
      sitemapUrlCount: sitemap.urlCount,
      missingFromSitemap: sitemap.missing,
      indexnow,
    },
    { status: ok ? 200 : 500 }
  );
}
