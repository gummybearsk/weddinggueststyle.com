import { getAllSlugs, getPageData } from "./getPages";

/**
 * Derives each pillar's full page list from the content directory.
 *
 * The pillar hubs previously rendered a hand-maintained list in lib/homepageData.ts — 32
 * entries total against 131 published pages. /season showed 4 guides while 27 season pages
 * existed, so most of the site was unreachable from navigation and a reader landing on a
 * hub saw a fraction of what we actually cover.
 *
 * Pages can legitimately belong to more than one pillar (a modest winter dress with sleeves
 * is both season and style), and that is allowed — it makes navigation better, not worse.
 */

export interface TaxonomyEntry {
  slug: string;
  title: string;
}

export interface SubGroup {
  label: string;
  /** Matched against the slug. First matching subgroup within a pillar wins. */
  match: RegExp;
  entries?: TaxonomyEntry[];
}

export interface Pillar {
  key: string;
  label: string;
  groups: SubGroup[];
}

const PILLARS: Pillar[] = [
  {
    key: "season",
    label: "Season",
    groups: [
      { label: "Summer", match: /summer|flowy-summer/ },
      { label: "Autumn", match: /\bfall\b|fall-|autumn|october|november|thanksgiving/ },
      { label: "Winter", match: /winter|december|january|new-years/ },
      { label: "Spring", match: /spring/ },
    ],
  },
  {
    key: "dress-code",
    label: "Dress Code",
    groups: [
      { label: "Black tie & formal", match: /black-tie|formal(?!.*semi)|designer/ },
      { label: "Cocktail & semi-formal", match: /cocktail|semi-formal/ },
      { label: "Casual & dressy casual", match: /casual|what-to-wear/ },
    ],
  },
  {
    key: "color",
    label: "Colour",
    groups: [
      { label: "Black & neutrals", match: /black(?!-tie)|nude|champagne|silver|gold|jewel-tone/ },
      { label: "Brown & chocolate", match: /brown|chocolate|shades-of-brown/ },
      { label: "Pink & fuchsia", match: /pink|fuchsia|blush|rose/ },
      { label: "Blue & navy", match: /blue|navy/ },
      { label: "Green", match: /green|sage|olive|emerald/ },
      { label: "Red, burgundy & yellow", match: /red|burgundy|yellow|butter/ },
    ],
  },
  {
    key: "body-type",
    label: "Fit",
    groups: [
      { label: "Petite", match: /petite/ },
      { label: "Plus size & curvy", match: /plus-size|big-tummy|trendy-plus/ },
      { label: "Over 50 & over 60", match: /over-50|over-60|mother-of-the-bride/ },
      { label: "Maternity", match: /maternity/ },
      { label: "Modest & sleeves", match: /modest|with-sleeves|long-sleeve/ },
    ],
  },
  {
    key: "style",
    label: "Style",
    groups: [
      { label: "Length", match: /midi|maxi|tea-length|knee-length|long-wedding|short-/ },
      { label: "Silhouette", match: /a-line|mermaid|floral|elegant|designer/ },
      { label: "Fabric", match: /velvet|satin|chiffon|lace/ },
      { label: "Details", match: /pockets|with-sleeves|long-sleeve/ },
      { label: "Accessories", match: /accessor|shoes|clutch|cover-ups|bags|wraps/ },
    ],
  },
  {
    key: "venue",
    label: "Venue",
    groups: [
      { label: "Beach & destination", match: /beach|mermaid-beach/ },
      { label: "Garden & outdoor", match: /garden/ },
      { label: "Church & traditional", match: /church/ },
      { label: "Indian weddings", match: /indian/ },
    ],
  },
];

function titleFor(slug: string): string {
  const page = getPageData(slug);
  return page?.title || slug.replace(/-/g, " ");
}

/** All published pages grouped for one pillar, with empty groups dropped. */
export function getPillarGroups(pillarKey: string): SubGroup[] {
  const pillar = PILLARS.find((p) => p.key === pillarKey);
  if (!pillar) return [];

  const slugs = getAllSlugs();
  return pillar.groups
    .map((g) => {
      // First matching group within this pillar wins, so a page isn't listed twice
      // under the same hub.
      const taken = new Set<string>();
      const entries = slugs
        .filter((slug) => {
          if (taken.has(slug)) return false;
          const earlier = pillar.groups.slice(0, pillar.groups.indexOf(g));
          if (earlier.some((e) => e.match.test(slug))) return false;
          return g.match.test(slug);
        })
        .map((slug) => ({ slug, title: titleFor(slug) }))
        .sort((a, b) => a.title.localeCompare(b.title));
      return { ...g, entries };
    })
    .filter((g) => (g.entries?.length ?? 0) > 0);
}

/** Flat list of every slug in a pillar — used to pool products for the hub. */
export function getPillarSlugs(pillarKey: string): string[] {
  return getPillarGroups(pillarKey).flatMap((g) => (g.entries ?? []).map((e) => e.slug));
}

export function getPillarLabel(pillarKey: string): string {
  return PILLARS.find((p) => p.key === pillarKey)?.label ?? pillarKey;
}
