/**
 * Amazon Associates Creators API v3.1 client (gitignored credentials in .env.local).
 *
 * Replaces the deprecated PA-API v5. Uses LWA OAuth2 client_credentials grant
 * with scope=creatorsapi::default, then POSTs to https://creatorsapi.amazon/catalog/v1.
 *
 * Token TTL: 1 hour. We cache in-process for 55 minutes to avoid re-auth.
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// ── Credentials ──────────────────────────────────────────────────────────────
function loadEnv() {
  const envFile = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envFile)) {
    throw new Error("Missing .env.local at " + envFile);
  }
  return fs.readFileSync(envFile, "utf8").split("\n").reduce((acc, line) => {
    const m = line.match(/^([A-Z_]+)=(.+)$/);
    if (m) acc[m[1]] = m[2];
    return acc;
  }, {});
}

const env = loadEnv();
const CLIENT_ID = env.AMAZON_CREATORS_CLIENT_ID;
const CLIENT_SECRET = env.AMAZON_CREATORS_SECRET;
const PARTNER_TAG = env.AMAZON_AFFILIATE_TAG || "weddinggueststyle-20";

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error("Amazon credentials missing from .env.local");
}

// ── OAuth token (cached in-process) ──────────────────────────────────────────
let cachedToken = null;
let tokenExpiresAt = 0;

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  return new Promise((resolve, reject) => {
    const body =
      "grant_type=client_credentials" +
      "&client_id=" + encodeURIComponent(CLIENT_ID) +
      "&client_secret=" + encodeURIComponent(CLIENT_SECRET) +
      "&scope=" + encodeURIComponent("creatorsapi::default");
    const req = https.request(
      {
        hostname: "api.amazon.com",
        path: "/auth/o2/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          if (res.statusCode !== 200) return reject(new Error("Token " + res.statusCode + ": " + d));
          const parsed = JSON.parse(d);
          cachedToken = parsed.access_token;
          tokenExpiresAt = Date.now() + (parsed.expires_in - 300) * 1000; // 5min safety
          resolve(cachedToken);
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── API call wrapper ─────────────────────────────────────────────────────────
async function callApi(operation, body) {
  const token = await getToken();
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = https.request(
      {
        hostname: "creatorsapi.amazon",
        path: "/catalog/v1/" + operation,
        method: "POST",
        headers: {
          host: "creatorsapi.amazon",
          "x-marketplace": "www.amazon.com",
          "content-type": "application/json; charset=utf-8",
          Authorization: "Bearer " + token,
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(d);
            if (res.statusCode !== 200) {
              return reject(new Error(operation + " " + res.statusCode + ": " + (parsed.message || d.substring(0, 200))));
            }
            resolve(parsed);
          } catch (e) {
            reject(new Error(operation + " parse error: " + d.substring(0, 200)));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

// ── searchItems → normalized products ────────────────────────────────────────
const DEFAULT_RESOURCES = [
  "images.primary.large",
  "itemInfo.title",
  "offersV2.listings.price",
  "customerReviews.count",
  "customerReviews.starRating",
];

/**
 * Search Amazon for products by keyword.
 * Returns up to 10 product objects matching our Product schema.
 */
async function searchProducts(keywords, count = 10) {
  const result = await callApi("searchItems", {
    keywords,
    partnerTag: PARTNER_TAG,
    partnerType: "Associates",
    marketplace: "www.amazon.com",
    itemCount: Math.min(count, 10), // API limit per call is 10
    resources: DEFAULT_RESOURCES,
  });
  const items = (result.searchResult && result.searchResult.items) || [];
  return items.map(normalize).filter(Boolean);
}

function normalize(item) {
  const title = item.itemInfo && item.itemInfo.title && item.itemInfo.title.displayValue;
  const image = item.images && item.images.primary && item.images.primary.large && item.images.primary.large.url;
  // Affiliate URL — the API already builds one with our partner tag in detailPageURL
  const url = item.detailPageURL || `https://www.amazon.com/dp/${item.asin}?tag=${PARTNER_TAG}`;
  const priceInfo =
    item.offersV2 &&
    item.offersV2.listings &&
    item.offersV2.listings[0] &&
    item.offersV2.listings[0].price &&
    item.offersV2.listings[0].price.money;
  const price = priceInfo ? priceInfo.displayAmount : "";

  // Reviews — may or may not be returned
  const reviews = item.customerReviews || {};
  const rating = (reviews.starRating && reviews.starRating.value) || 4.5;
  const reviewCount = (reviews.count && reviews.count.value) || 0;

  if (!title || !image || !price) return null;
  return {
    title,
    image: image.replace(/_SL\d+_\./, "_AC_UL500_.").replace(/_SX\d+_\./, "_AC_UL500_."),
    url,
    price,
    rating: typeof rating === "number" ? rating : 4.5,
    reviewCount: typeof reviewCount === "number" ? reviewCount : 0,
  };
}

/**
 * Search across multiple keyword variants and dedupe by ASIN.
 * Useful for building inner pages where we want 25-40 products from related searches.
 */
async function searchManyKeywords(keywordList, totalCount = 40) {
  const seen = new Set();
  const all = [];
  for (const kw of keywordList) {
    if (all.length >= totalCount) break;
    try {
      const items = await searchProducts(kw, 10);
      for (const p of items) {
        const asin = (p.url.match(/\/dp\/([A-Z0-9]{10})/) || [])[1];
        if (asin && seen.has(asin)) continue;
        if (asin) seen.add(asin);
        all.push(p);
        if (all.length >= totalCount) break;
      }
      // Rate limit: Amazon Creators API limits default to ~1 TPS for new accounts.
      // Sleep 1.2s between calls to stay safe.
      await new Promise((r) => setTimeout(r, 1200));
    } catch (e) {
      console.warn(`  warn: "${kw}" failed → ${e.message.substring(0, 100)}`);
    }
  }
  return all;
}

module.exports = { searchProducts, searchManyKeywords, getToken };

// CLI usage: node amazon-creators-api.js "wedding guest dress" 5
if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2);
    const kw = args[0] || "wedding guest dresses";
    const n = parseInt(args[1] || "5", 10);
    const items = await searchProducts(kw, n);
    console.log(JSON.stringify(items, null, 2));
    console.log(`\n${items.length} products fetched for "${kw}"`);
  })();
}
