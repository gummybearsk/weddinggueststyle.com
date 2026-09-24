/**
 * Picks 3 outbound authority links per page from a pool of real wedding-industry sources.
 * Varied per slug so the same combination doesn't repeat across pages (anti-templating).
 *
 * All links must point to real, well-known publications. These pass Rule 29 (outbound
 * authority link) and contribute to the E-E-A-T trust signal AdSense looks for.
 */

interface Source {
  publisher: string;
  url: string;
  label: string;
  // Categories this source fits best — used to bias the pick to topical relevance.
  fits: ("etiquette" | "color" | "season" | "venue" | "dress-code" | "style" | "body-type" | "general")[];
}

// Every URL here was fetched and confirmed on 2026-09-24 (see SOURCES.md). Brides, The Knot and
// Martha Stewart were removed: they return 403 to every fetcher, so their content cannot be
// verified. Vogue and Harper's Bazaar were removed: their URLs had become 404s.
const SOURCES: Source[] = [
  {
    publisher: "Emily Post Institute",
    url: "https://emilypost.com/advice/wedding-etiquette",
    label: "Emily Post's complete guide to wedding etiquette",
    fits: ["etiquette", "general"],
  },
  {
    publisher: "Emily Post Institute",
    url: "https://emilypost.com/advice/attire-guide-dress-codes-from-casual-to-white-tie",
    label: "Attire guide: dress codes from casual to white tie — Emily Post Institute",
    fits: ["dress-code", "style", "venue"],
  },
  {
    publisher: "Emily Post Institute",
    url: "https://emilypost.com/advice/wedding-guest-attire",
    label: "Wedding guest attire — Emily Post Institute",
    fits: ["color", "season", "venue", "style", "general"],
  },
  {
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Black_tie",
    label: "Black tie — Wikipedia",
    fits: ["dress-code"],
  },
  {
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Western_dress_codes",
    label: "Western dress codes — Wikipedia",
    fits: ["dress-code", "general"],
  },
  {
    publisher: "Pantone",
    url: "https://www.pantone.com/color-of-the-year",
    label: "Color of the Year — Pantone",
    fits: ["color"],
  },
];

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function inferCategory(slug: string): Source["fits"][number] {
  if (/black-tie|formal|cocktail|semi-formal|casual|dress-code/.test(slug)) return "dress-code";
  if (/pink|blue|green|red|black|brown|color|navy|sage|fuchsia|yellow|rose/.test(slug)) return "color";
  if (/summer|fall|winter|spring|autumn|season/.test(slug)) return "season";
  if (/beach|garden|vineyard|church|courthouse|ballroom|venue|indian/.test(slug)) return "venue";
  if (/maxi|midi|long|short|sleeve|modest|maternity|petite|plus|over-50|big-tummy/.test(slug)) return "style";
  return "general";
}

export interface FurtherReadingLink {
  publisher: string;
  url: string;
  label: string;
}

export function getFurtherReading(slug: string, count: number = 3): FurtherReadingLink[] {
  const h = hashSlug(slug);
  const category = inferCategory(slug);
  const fit = (s: Source) => (s.fits.includes(category) ? 0 : s.fits.includes("general") ? 1 : 2);

  // Best topical fit first; within the same fit, rotate by slug hash so pages vary.
  return SOURCES.map((s, i) => ({ s, key: fit(s) * 100 + ((i + h) % SOURCES.length) }))
    .sort((a, b) => a.key - b.key)
    .slice(0, count)
    .map(({ s }) => ({ publisher: s.publisher, url: s.url, label: s.label }));
}
