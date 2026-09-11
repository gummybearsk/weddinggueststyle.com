/**
 * How many products a page renders into its HTML.
 *
 * Two competing pressures, resolved by page TYPE rather than one global number:
 *
 *  - Editorial/question pages ("can you wear black to a wedding") were shipping 74 products
 *    against ~2,400 words, so 86% of the markup was product grid. That is the thin-affiliate
 *    "intermediary" shape Google's March 2026 update demoted, and those pages need to read
 *    as articles to rank at all.
 *
 *  - Shopping-intent pages ("fall wedding guest dresses", deals pages) are where the visitor
 *    genuinely came to browse. Starving those of product is the wrong trade — the intent IS
 *    the grid, and a thin grid reads as a dead store.
 *
 * So: articles stay lean, shops stay full.
 */
export type PageKind = "question" | "shopping" | "catalog";

const QUESTION = /^(what|how|why|can|is|are|do|does|when|where|should|which)-/;
const DEALS = /(deals|sale|black-friday|under-\d+|budget|cheap)/;

export function pageKind(slug: string): PageKind {
  if (QUESTION.test(slug)) return "question";
  if (DEALS.test(slug)) return "shopping";
  return "catalog";
}

const CAP: Record<PageKind, number> = {
  question: 12, // enough to monetise, not enough to drown the argument
  shopping: 32, // browse intent — give them a real rail
  catalog: 24, // category pages: a proper grid, but not the old 74-product wall
};

export function productCapFor(slug: string, explicit?: number): number {
  return explicit ?? CAP[pageKind(slug)];
}
