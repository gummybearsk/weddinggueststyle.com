import { getPublishedPageData } from "./getPages";
import { withLiveData } from "./amazonData";
import { deriveBestFor } from "./priceInsights";
import { Product } from "./types";

/**
 * Shared source for "show the products people actually came for".
 *
 * Readers arrive from Google and Bing looking for a dress, not an essay. The homepage and
 * the six pillar hubs previously rendered ZERO products — only editorial and category
 * links — so a visitor had to click twice before seeing anything buyable. These helpers
 * let those pages lead with real, in-stock product rows.
 */

/** Live, in-stock products for a page, badged. Empty array if the page isn't published. */
export function picksFor(slug: string, count = 8): Product[] {
  const page = getPublishedPageData(slug);
  if (!page) return [];
  return withLiveData(page.products || [])
    .slice(0, count)
    .map((p) => ({ ...p, bestFor: deriveBestFor(p) }));
}

export interface FeaturedNiche {
  slug: string;
  label: string;
  blurb: string;
}

/**
 * Homepage feature order, ranked by REAL performance from Bing Webmaster + GSC exports
 * (see "GSC & Webmaster/", trailing 90 days as of 2026-07-20) — not by guesswork:
 *
 *   black-tie-optional      188 imp / 15 clicks  ← best converting page on the site
 *   summer-2026             153 / 14
 *   fuchsia                 115 / 13  (11.3% CTR)
 *   shades-of-brown         108 /  9
 *   fall                     79 /  7
 *   tea-length               46 /  6  (13.0% CTR)
 *   black-cocktail           24 /  5  (20.8% CTR — highest on the site)
 *   blue                    100 /  5
 *
 * Re-rank this list when new Webmaster exports land. Seasonal note: summer entries should
 * drop below fall/winter ones once the fall pages publish through August–November.
 */
export const FEATURED_NICHES: FeaturedNiche[] = [
  {
    slug: "black-tie-optional-wedding-guest-dresses",
    label: "Black Tie Optional",
    blurb: "The most misread dress code on any invitation — and our highest-converting guide.",
  },
  {
    slug: "fall-wedding-guest-dresses",
    label: "Fall Wedding Guest Dresses",
    blurb: "Sleeves, heavier fabrics, and hems that survive a damp lawn.",
  },
  {
    slug: "fuchsia-wedding-guest-dresses",
    label: "Fuchsia & Hot Pink",
    blurb: "The colour that photographs loudest, done without looking costume.",
  },
  {
    slug: "shades-of-brown-wedding-guest-dresses",
    label: "Shades of Brown",
    blurb: "Chocolate, mocha and cognac — the palette that took over 2026.",
  },
  {
    slug: "tea-length-wedding-guest-dresses",
    label: "Tea Length",
    blurb: "Between the knee and the ankle, where most dress codes are happiest.",
  },
  {
    slug: "black-cocktail-wedding-guest-dresses",
    label: "Black Cocktail",
    blurb: "Black is fine at a wedding. The cut is what decides it.",
  },
];

/** Featured niches that are published and currently have in-stock products. */
export function getFeatured(count = 6): { niche: FeaturedNiche; products: Product[] }[] {
  return FEATURED_NICHES.map((niche) => ({ niche, products: picksFor(niche.slug, 8) }))
    .filter((f) => f.products.length >= 4)
    .slice(0, count);
}

/**
 * Products for a pillar hub, pooled from its own cluster pages.
 * Round-robins across pages so one page can't dominate the row.
 */
export function picksForPillar(slugs: string[], count = 12): Product[] {
  const pools = slugs.map((s) => picksFor(s, 6)).filter((p) => p.length > 0);
  const out: Product[] = [];
  const seen = new Set<string>();
  for (let i = 0; out.length < count && i < 8; i++) {
    for (const pool of pools) {
      const p = pool[i];
      if (!p || seen.has(p.url)) continue;
      seen.add(p.url);
      out.push(p);
      if (out.length >= count) break;
    }
  }
  return out;
}

/**
 * Seasonal edit — the in-season categories, chosen by the calendar rather than hardcoded.
 *
 * A wedding-guest shopper in September wants fall and winter, not the summer edit the
 * homepage used to open with. Pairs with lib/seasonOrder.ts, which reorders the season
 * navigation on the same rule.
 */
const SEASON_EDIT: Record<string, { slug: string; label: string; blurb: string }[]> = {
  fall: [
    { slug: "fall-wedding-guest-dresses", label: "Fall", blurb: "Sleeves, heavier fabrics, hems that survive a damp lawn." },
    { slug: "october-wedding-guest-dresses", label: "October", blurb: "Peak wedding month — and peak unpredictable weather." },
    { slug: "thanksgiving-wedding-guest-dresses", label: "Thanksgiving", blurb: "Family-heavy, photographed all day, usually indoors." },
    { slug: "shades-of-brown-wedding-guest-dresses", label: "Chocolate & Cognac", blurb: "The palette that took over autumn." },
  ],
  winter: [
    { slug: "winter-wedding-guest-dresses", label: "Winter", blurb: "Velvet, long sleeves, and something you can actually wear a coat over." },
    { slug: "december-wedding-guest-dresses", label: "December", blurb: "Dark by four o'clock — dress for evening whatever the invitation says." },
    { slug: "new-years-eve-wedding-guest-dresses", label: "New Year's Eve", blurb: "The one wedding where full metallic is the correct answer." },
    { slug: "velvet-wedding-guest-dresses", label: "Velvet", blurb: "The definitive cold-weather fabric." },
  ],
  spring: [
    { slug: "spring-wedding-guest-dresses", label: "Spring", blurb: "Pastels, florals, and a layer for the evening." },
    { slug: "garden-party-wedding-guest-dresses", label: "Garden Party", blurb: "Block heels, because grass." },
    { slug: "floral-wedding-guest-dresses", label: "Florals", blurb: "Scale matters more than colour." },
  ],
  summer: [
    { slug: "summer-wedding-guest-dresses", label: "Summer", blurb: "Breathable fabric that still reads as occasion wear." },
    { slug: "beach-wedding-guest-dresses", label: "Beach", blurb: "Sand-proof hems and shoes you can carry." },
    { slug: "flowy-summer-wedding-guest-dresses", label: "Flowy", blurb: "Movement without losing the silhouette." },
  ],
};

/** In-season categories with live products, newest season first. Silently skips missing pages. */
export function getSeasonalEdit(season: string, count = 4): { niche: FeaturedNiche; products: Product[] }[] {
  const out: { niche: FeaturedNiche; products: Product[] }[] = [];
  for (const n of SEASON_EDIT[season] || []) {
    const products = picksFor(n.slug, 4);
    if (products.length) out.push({ niche: n, products });
    if (out.length >= count) break;
  }
  return out;
}

/**
 * Genuinely discounted, in-stock products across the whole catalogue.
 *
 * `savingsPercent` comes straight from the Amazon API (never computed by us), so this row
 * is a real price signal rather than invented urgency. ~32% of in-stock items carry one.
 */
export function getDeals(count = 8, minPercent = 15): Product[] {
  const seen = new Set<string>();
  const deals: Product[] = [];
  for (const n of FEATURED_NICHES) {
    for (const p of picksFor(n.slug, 40)) {
      const pct = p.savingsPercent ?? 0;
      if (pct < minPercent || seen.has(p.url)) continue;
      seen.add(p.url);
      deals.push(p);
    }
  }
  return deals.sort((a, b) => (b.savingsPercent ?? 0) - (a.savingsPercent ?? 0)).slice(0, count);
}
