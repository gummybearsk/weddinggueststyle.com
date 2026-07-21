import fs from "fs";
import path from "path";
import { Product } from "./types";

/**
 * Server-only overlay of live Amazon data onto page products.
 *
 * content/amazon-data.json is regenerated daily by scripts/refresh-amazon.js (GitHub
 * Action). We overlay price / image / URL / availability from it while keeping our own
 * editorial title, blurb, bestFor and sizing notes.
 *
 * Compliance: the Associates Operating Agreement requires displayed prices to come from
 * the API and carry a visible "as of" timestamp. Never render a price that did not come
 * through here — see `priceAsOfLabel()`.
 */

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
}

interface AmazonData {
  fetchedAt: string;
  count: number;
  items: Record<string, AmazonItem>;
}

const DATA_FILE = path.join(process.cwd(), "content", "amazon-data.json");

let cache: AmazonData | null = null;

function load(): AmazonData | null {
  if (cache) return cache;
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    cache = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as AmazonData;
    return cache;
  } catch {
    return null;
  }
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

  const out: Product[] = [];
  for (const p of products) {
    const asin = asinFromUrl(p.url);
    if (!asin) continue;
    const live = data.items[asin];
    if (!live || !live.inStock || !live.price) continue;

    out.push({
      ...p,
      // Live from the API.
      price: live.price,
      image: live.image || p.image,
      url: live.url,
      inStock: true,
      ...(live.savingsPercent ? { savingsPercent: live.savingsPercent } : {}),
      ...(live.seller ? { seller: live.seller } : {}),
      ...(live.condition ? { condition: live.condition } : {}),
      ...(live.availability ? { availability: live.availability } : {}),
      ...(live.priceValidUntil ? { priceValidUntil: live.priceValidUntil } : {}),
      // Scraped ratings are never carried through.
      rating: undefined,
      reviewCount: undefined,
    });
  }
  return out;
}

/** ISO timestamp of the last successful refresh, or null if the feed is absent. */
export function fetchedAt(): string | null {
  return load()?.fetchedAt ?? null;
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
