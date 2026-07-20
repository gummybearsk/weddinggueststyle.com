/**
 * Fetch real Amazon products for a new content page via the Creators API.
 *
 * Usage:
 *   node scripts/fetch-page-products.js <out.json> "keyword one" "keyword two" ...
 *
 * Writes a JSON array of {title, image, url, price} ready to drop into a page's
 * `products` field. Never invent products — every page must be backed by live API data,
 * and lib/amazonData.ts will drop anything that later goes out of stock.
 */

const fs = require("fs");
const { searchManyKeywords } = require("./amazon-creators-api.js");

const [out, ...keywords] = process.argv.slice(2);
if (!out || !keywords.length) {
  console.error('Usage: node scripts/fetch-page-products.js <out.json> "kw1" "kw2" …');
  process.exit(1);
}

(async () => {
  const products = await searchManyKeywords(keywords, 30);
  // Strip the scraped-rating fields the API never really populates — the site no longer
  // renders or publishes them (see lib/amazonData.ts).
  const clean = products.map(({ title, image, url, price }) => ({ title, image, url, price }));
  fs.writeFileSync(out, JSON.stringify(clean, null, 2));
  console.log(`✓ ${clean.length} products → ${out}`);
})().catch((e) => {
  console.error("fetch failed:", e.message);
  process.exit(1);
});
