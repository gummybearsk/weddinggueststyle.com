import fs from "fs";
import path from "path";
import { Product } from "./types";

/**
 * Server-only overlay of live Amazon data onto page products.
 *
 * Where the data lives (since 2026-11-15): the GitHub Action .github/workflows/refresh-amazon.yml
 * fetches prices from the Creators API twice a day and pushes amazon-data.json to the
 * `amazon-data` branch, which Vercel never builds (vercel.json git.deploymentEnabled). Pages
 * read that file through a tagged fetch, and the Action then calls /api/revalidate-prices so
 * the pages regenerate with the new prices. Before this, every refresh was a commit to main,
 * i.e. a full site deploy every day, and each deploy changed the script file names under
 * pages Google had fetched but not yet rendered (/casual-wedding-guest-dresses was dropped
 * from the index on 2026-11-12 that way).
 *
 * Fallback: content/amazon-data.json in the repo (a copy as of the last code change) is used
 * only if the branch file cannot be read. Prices older than MAX_AGE are never shown: the
 * product stays, the price is replaced by "See price on Amazon".
 *
 * We overlay price / image / URL / availability while keeping our own editorial title,
 * blurb, bestFor and sizing notes.
 *
 * Compliance: the Associates Operating Agreement requires displayed prices to come from
 * the API and carry a visible "as of" timestamp. Never render a price that did not come
 * through here — see `priceAsOfLabel()`.
 *
 * Usage: every page that renders products calls `await primeAmazonData()` first; the sync
 * helpers below then read the primed copy.
 */

export const AMAZON_DATA_URL =
  "https://raw.githubusercontent.com/gummybearsk/weddinggueststyle.com/amazon-data/amazon-data.json";
export const AMAZON_DATA_TAG = "amazon-data";
// 23 h + pages revalidating hourly = a price is never on screen more than 24 h after the API returned it.
const MAX_AGE_MS = 23 * 60 * 60 * 1000;

interface AmazonItem {
  asin: string;
  title: string;
  image: string;
  url: string;
  price: string;
  inStock: boolean;
  savingsPercent?: number;
  // Straight from the API. Absent when Amazon doesn't return them.
  seller?: string;
  condition?: string;
  availability?: string;
  priceValidUntil?: string;
  priceValidFrom?: string;
}

interface AmazonData {
  fetchedAt: string;
  count: number;
  items: Record<string, AmazonItem>;
}

const DATA_FILE = path.join(process.cwd(), "content", "amazon-data.json");

let primed: AmazonData | null = null;
let bundled: AmazonData | null | undefined;

function loadBundled(): AmazonData | null {
  if (bundled !== undefined) return bundled;
  try {
    bundled = fs.existsSync(DATA_FILE) ? (JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as AmazonData) : null;
  } catch {
    bundled = null;
  }
  return bundled;
}

function valid(d: unknown): d is AmazonData {
  const x = d as AmazonData | null;
  return !!x && typeof x.fetchedAt === "string" && !!x.items && Object.keys(x.items).length > 0;
}

/**
 * Load the newest price data into this server instance. Cached by Next's data cache under
 * AMAZON_DATA_TAG (cleared by /api/revalidate-prices), and refetched at most hourly anyway.
 * Never throws: on any failure it falls back to the repo copy and logs which one it used.
 */
export async function primeAmazonData(): Promise<void> {
  try {
    const res = await fetch(AMAZON_DATA_URL, { next: { tags: [AMAZON_DATA_TAG], revalidate: 3600 } });
    if (res.ok) {
      const d = await res.json();
      if (valid(d)) {
        const b = loadBundled();
        // Never step backwards in time (e.g. a CDN serving an older copy than the build had).
        primed = b && new Date(b.fetchedAt) > new Date(d.fetchedAt) ? b : d;
        return;
      }
    }
    console.error(`[amazon-data] branch file unusable (HTTP ${res.status}); using repo copy`);
  } catch (e) {
    console.error(`[amazon-data] branch file fetch failed (${(e as Error).message}); using repo copy`);
  }
  primed = primed ?? loadBundled();
}

function load(): AmazonData | null {
  return primed ?? loadBundled();
}

/** True when the data is recent enough to show prices (Associates: refreshed within 24 h). */
function pricesFresh(d: AmazonData): boolean {
  return Date.now() - new Date(d.fetchedAt).getTime() <= MAX_AGE_MS;
}

export function asinFromUrl(url: string): string | null {
  const m = (url || "").match(/\/dp\/([A-Z0-9]{10})/);
  return m ? m[1] : null;
}

/**
 * Overlay live data onto a product list.
 *
 * Products whose ASIN is missing from the feed, or which have no buyable offer, are
 * DROPPED rather than shown with a stale price — a dead link converts at zero and costs
 * trust. A spot check found ~32% of the catalogue out of stock or delisted.
 */
export function withLiveData(products: Product[]): Product[] {
  const data = load();
  if (!data) return [];
  const fresh = pricesFresh(data);
  if (!fresh) console.error(`[amazon-data] data from ${data.fetchedAt} is older than 24 h; hiding prices`);

  const out: Product[] = [];
  for (const p of products) {
    const asin = asinFromUrl(p.url);
    if (!asin) continue;
    const live = data.items[asin];
    if (!live || !live.inStock || !live.price) continue;

    out.push({
      ...p,
      // Live from the API. Stale data keeps the product but never shows its price.
      price: fresh ? live.price : "",
      image: live.image || p.image,
      url: live.url,
      inStock: true,
      ...(fresh && live.savingsPercent ? { savingsPercent: live.savingsPercent } : {}),
      ...(live.seller ? { seller: live.seller } : {}),
      ...(live.condition ? { condition: live.condition } : {}),
      ...(live.availability ? { availability: live.availability } : {}),
      ...(live.priceValidUntil ? { priceValidUntil: live.priceValidUntil } : {}),
      ...(live.priceValidFrom ? { priceValidFrom: live.priceValidFrom } : {}),
      // Scraped ratings are never carried through.
      rating: undefined,
      reviewCount: undefined,
    });
  }
  return out;
}

/** ISO timestamp of the last successful refresh, or null if the feed is absent. */
export function fetchedAt(): string | null {
  const d = load();
  return d && pricesFresh(d) ? d.fetchedAt : null;
}

/**
 * Human-readable disclosure required under every product block, e.g.
 * "Product prices and availability are accurate as of July 20, 2026 and are subject to change."
 */
export function priceAsOfLabel(): string | null {
  const ts = fetchedAt();
  if (!ts) return null;
  const d = new Date(ts).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return `Prices shown as of ${d}.`;
}
