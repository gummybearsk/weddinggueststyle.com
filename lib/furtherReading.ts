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

const SOURCES: Source[] = [
  {
    publisher: "Emily Post Institute",
    url: "https://emilypost.com/advice/wedding-etiquette",
    label: "Wedding etiquette — Emily Post Institute",
    fits: ["etiquette", "dress-code", "general"],
  },
  {
    publisher: "Brides",
    url: "https://www.brides.com/wedding-guest-attire-4795937",
    label: "Wedding guest dress code guide — Brides",
    fits: ["dress-code", "general"],
  },
  {
    publisher: "The Knot",
    url: "https://www.theknot.com/content/wedding-guest-attire-guide",
    label: "What to wear as a wedding guest — The Knot",
    fits: ["dress-code", "venue", "general"],
  },
  {
    publisher: "Vogue",
    url: "https://www.vogue.com/article/what-to-wear-to-a-wedding",
    label: "What to wear to a wedding — Vogue",
    fits: ["color", "style", "general"],
  },
  {
    publisher: "Harper's Bazaar",
    url: "https://www.harpersbazaar.com/wedding/bridal-fashion/g32873770/best-wedding-guest-dresses/",
    label: "Best wedding guest dresses — Harper's Bazaar",
    fits: ["color", "style", "season"],
  },
  {
    publisher: "Martha Stewart Weddings",
    url: "https://www.marthastewart.com/7984299/wedding-guest-attire-guide",
    label: "Wedding guest attire by dress code — Martha Stewart",
    fits: ["dress-code", "etiquette"],
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
    fits: ["dress-code"],
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

  // Prefer sources that fit the category; fall back to general.
  const ranked = SOURCES.slice().sort((a, b) => {
    const aFits = a.fits.includes(category) ? 0 : a.fits.includes("general") ? 1 : 2;
    const bFits = b.fits.includes(category) ? 0 : b.fits.includes("general") ? 1 : 2;
    return aFits - bFits;
  });

  // Pick `count` sources, rotated by the slug hash so different pages get different combos.
  const picks: FurtherReadingLink[] = [];
  const seenPublisher = new Set<string>();
  const offset = h % SOURCES.length;
  let attempts = 0;
  while (picks.length < count && attempts < SOURCES.length * 2) {
    const candidate = ranked[(offset + picks.length + attempts) % ranked.length];
    if (!seenPublisher.has(candidate.publisher)) {
      picks.push({ publisher: candidate.publisher, url: candidate.url, label: candidate.label });
      seenPublisher.add(candidate.publisher);
    }
    attempts++;
  }
  return picks;
}
