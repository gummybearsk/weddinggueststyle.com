import { Product } from "./types";

/**
 * Original, page-specific data derived from our own daily Amazon API tracking.
 *
 * This is the site's Rule 22 "Experience" signal: not a stock photo or generic advice,
 * but measurements we take ourselves every 24h across the catalogue we curate. Every
 * number here is computed from content/amazon-data.json — nothing is estimated or
 * invented. If the data can't support a claim, the field comes back null and the
 * component omits that row.
 */

export interface PriceInsights {
  count: number;
  min: number;
  max: number;
  median: number;
  onSale: number;
  deepestDiscount: number | null;
  averageDiscount: number | null;
  underFifty: number;
  sleeved: number;
  plusSizeFriendly: number;
  petiteFriendly: number;
}

function priceOf(p: Product): number | null {
  const n = parseFloat((p.price || "").replace(/[^0-9.]/g, ""));
  return isNaN(n) || n <= 0 ? null : n;
}

const SLEEVE_RE = /\b(long sleeve|short sleeve|3\/4 sleeve|puff sleeve|cap sleeve|sleeves|sleeved|bishop sleeve)\b/i;
const PLUS_RE = /\b(plus size|plus-size|1x|2x|3x|4x|xxl|3xl)\b/i;
const PETITE_RE = /\b(petite|petites)\b/i;

export function computeInsights(products: Product[]): PriceInsights | null {
  const prices = products.map(priceOf).filter((n): n is number => n !== null);
  if (prices.length < 4) return null; // too thin to be worth publishing as data

  const sorted = [...prices].sort((a, b) => a - b);
  const discounts = products
    .map((p) => p.savingsPercent ?? 0)
    .filter((d) => d >= 5);

  return {
    count: prices.length,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    median: sorted[Math.floor(sorted.length / 2)],
    onSale: discounts.length,
    deepestDiscount: discounts.length ? Math.max(...discounts) : null,
    averageDiscount: discounts.length
      ? Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length)
      : null,
    underFifty: prices.filter((n) => n < 50).length,
    sleeved: products.filter((p) => SLEEVE_RE.test(p.title)).length,
    plusSizeFriendly: products.filter((p) => PLUS_RE.test(p.title)).length,
    petiteFriendly: products.filter((p) => PETITE_RE.test(p.title)).length,
  };
}

// ── Ranked-pick rationale ───────────────────────────────────────────────────

const FABRIC: [RegExp, string][] = [
  [/\bvelvet\b/i, "velvet, which reads warm on camera and holds its own shape instead of clinging"],
  [/\bsatin\b/i, "satin, so it catches venue lighting — worth checking what you wear under it"],
  [/\bcrepe\b/i, "crepe, which sits a fraction off the body rather than gripping the upper arm"],
  [/\bchiffon\b/i, "chiffon, light enough to layer without adding bulk"],
  [/\blace\b/i, "lace, which adds texture without adding visual weight"],
  [/\bsequin|sparkl|glitter\b/i, "sequins, best kept to evening receptions"],
  [/\bknit|sweater\b/i, "a knit, the warmest option here but the least formal"],
  [/\bjersey\b/i, "jersey — comfortable, though it clings more than crepe does"],
  [/\btulle\b/i, "tulle, which gives volume without weight"],
];

const CUT: [RegExp, string][] = [
  [/\btea.?length\b/i, "cut to tea length"],
  [/\bmaxi|floor.?length\b/i, "full length"],
  [/\bmidi\b/i, "a midi"],
  [/\bknee.?length\b/i, "knee length"],
  [/\bwrap\b/i, "a wrap silhouette"],
  [/\ba.?line\b/i, "an A-line"],
];

// Varied phrasing so six stacked picks don't all open the same way. Index is the pick's
// position, so the wording differs down the list rather than repeating verbatim.
const MID_PHRASES = [
  (price: string) => `Mid-range for this page at ${price}`,
  (price: string) => `Sits in the middle of the pack at ${price}`,
  (price: string) => `A typical price here, ${price}`,
  (price: string) => `${price}, close to the median for this page`,
];

/**
 * A short, factual reason this pick is on the page.
 *
 * Every clause is derived from data we actually hold: the live API price relative to the
 * other picks, the live discount, and attributes stated in the listing title. Craft notes
 * attached to a detected fabric are general garment knowledge, not claims about a specific
 * item we have handled. Nothing here is invented, and no rating is ever referenced.
 */
export function deriveRationale(p: Product, all: Product[], index = 0): string | undefined {
  const price = priceOf(p);
  if (price === null) return undefined;

  const prices = all.map(priceOf).filter((n): n is number => n !== null).sort((a, b) => a - b);
  if (prices.length < 3) return undefined;

  // Sentence 1 — where this sits on price, a fact about this page's own set.
  const cheapest = prices[0];
  const dearest = prices[prices.length - 1];
  const median = prices[Math.floor(prices.length / 2)];
  let opener: string;
  if (price === cheapest) opener = `The least expensive pick on this page at ${p.price}`;
  else if (price === dearest) opener = `The top of this page's range at ${p.price}`;
  else if (price < median * 0.8) opener = `Well under this page's $${median.toFixed(0)} median, at ${p.price}`;
  else if (price > median * 1.4) opener = `Above the typical price here at ${p.price}`;
  else opener = MID_PHRASES[index % MID_PHRASES.length](p.price);

  if ((p.savingsPercent ?? 0) >= 10) opener += `, and currently ${p.savingsPercent}% off`;

  // Sentence 2 — construction, from attributes stated in the listing title.
  const cut = CUT.find(([re]) => re.test(p.title))?.[1];
  const fabric = FABRIC.find(([re]) => re.test(p.title))?.[1];
  const sleeved = /\b(long sleeve|3\/4 sleeve|bishop sleeve)\b/i.test(p.title);

  // Build the clause that follows "It's …", keeping cut and fabric in the same phrase.
  let shape = "";
  if (cut && fabric) shape = `${cut} in ${fabric}`;
  else if (cut) shape = cut;
  else if (fabric) shape = fabric;

  const sleeveClause = "genuine sleeve coverage rather than a cap or cold-shoulder";

  let second = "";
  if (shape && sleeved) second = ` It's ${shape}, with ${sleeveClause}.`;
  else if (shape) second = ` It's ${shape}.`;
  else if (sleeved) second = ` It has ${sleeveClause}.`;

  return second ? `${opener}.${second}` : `${opener}.`;
}

/**
 * Editorial "best for" label, derived from the product's own attributes.
 *
 * Deliberately conservative: only claims what the listing title and live price actually
 * support. Returns undefined rather than guessing, so a card shows no badge instead of a
 * wrong one.
 */
export function deriveBestFor(p: Product): string | undefined {
  if (p.bestFor) return p.bestFor; // hand-written wins
  const price = priceOf(p);
  const t = p.title || "";

  if (PETITE_RE.test(t)) return "Petite frames";
  if (PLUS_RE.test(t)) return "Plus sizes";
  if (/\btea.?length\b/i.test(t)) return "Tea length";
  if (/\b(long sleeve|3\/4 sleeve|bishop sleeve)\b/i.test(t)) return "Sleeve coverage";
  if (/\b(velvet|satin)\b/i.test(t)) return "Cold-weather fabric";
  if ((p.savingsPercent ?? 0) >= 20) return `${p.savingsPercent}% off today`;
  if (price !== null && price < 40) return "Best value";
  if (price !== null && price >= 100) return "Investment piece";
  return undefined;
}
