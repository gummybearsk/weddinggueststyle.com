/**
 * Refresh live Amazon data for every ASIN referenced in content/pages/*.json.
 *
 * Writes content/amazon-data.json:
 *   { fetchedAt: "2026-07-20T…Z", count: n, items: { ASIN: {price, image, url, title, inStock, savingsPercent} } }
 *
 * lib/amazonData.ts overlays this onto page products at build/ISR time, so editorial
 * titles and blurbs stay ours while price/image/availability come from the API.
 *
 * Why this exists: the Associates Operating Agreement requires displayed prices to come
 * from the API and be refreshed at least every 24h with a visible "as of" timestamp.
 * Prices baked into content JSON drift fast — a spot check found $55.99 on-site vs
 * $49.49 live (11.6% off, and missing a 10% discount badge).
 *
 * Usage:  node scripts/refresh-amazon.js [--limit N] [--resume]
 */

const fs = require("fs");
const path = require("path");
const { getItems } = require("./amazon-creators-api.js");

const ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "pages");
const OUT_FILE = path.join(ROOT, "content", "amazon-data.json");

const BATCH_SIZE = 10; // hard API limit per getItems call
const THROTTLE_MS = 1200; // stay under ~1 TPS

const args = process.argv.slice(2);
const limitArg = args.indexOf("--limit");
const LIMIT = limitArg !== -1 ? parseInt(args[limitArg + 1], 10) : Infinity;
const RESUME = args.includes("--resume");

function asinFromUrl(url) {
  const m = (url || "").match(/\/dp\/([A-Z0-9]{10})/);
  return m ? m[1] : null;
}

function collectAsins() {
  const seen = new Set();
  for (const file of fs.readdirSync(CONTENT_DIR)) {
    if (!file.endsWith(".json")) continue;
    const page = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"));
    for (const p of page.products || []) {
      const asin = asinFromUrl(p.url);
      if (asin) seen.add(asin);
    }
  }
  return [...seen];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const allAsins = collectAsins();
  console.log(`Found ${allAsins.length} distinct ASINs across content/pages/`);

  // Resume support: a full run is ~5-6 min, so a transient failure shouldn't restart it.
  let items = {};
  if (RESUME && fs.existsSync(OUT_FILE)) {
    items = JSON.parse(fs.readFileSync(OUT_FILE, "utf8")).items || {};
    console.log(`Resuming — ${Object.keys(items).length} already fetched`);
  }

  const todo = allAsins.filter((a) => !items[a]).slice(0, LIMIT);
  console.log(`Fetching ${todo.length} ASINs in ${Math.ceil(todo.length / BATCH_SIZE)} calls…\n`);

  let ok = 0;
  let missing = 0;
  for (let i = 0; i < todo.length; i += BATCH_SIZE) {
    const batch = todo.slice(i, i + BATCH_SIZE);
    try {
      const res = await getItems(batch);
      Object.assign(items, res);
      const got = Object.keys(res).length;
      ok += got;
      missing += batch.length - got;
      process.stdout.write(
        `\r  ${Math.min(i + BATCH_SIZE, todo.length)}/${todo.length}  (${ok} live, ${missing} unavailable)`
      );
    } catch (e) {
      console.warn(`\n  warn: batch at ${i} failed → ${e.message.slice(0, 120)}`);
    }
    // Checkpoint every 20 batches so a crash never loses more than ~4 min of work.
    if (i % (BATCH_SIZE * 20) === 0) writeOut(items);
    await sleep(THROTTLE_MS);
  }

  writeOut(items);
  console.log(
    `\n\n✓ Wrote ${path.relative(ROOT, OUT_FILE)} — ${Object.keys(items).length} ASINs, ` +
      `${Object.values(items).filter((i) => i.inStock).length} in stock`
  );
})().catch((e) => {
  console.error("refresh-amazon failed:", e.message);
  process.exit(1);
});

function writeOut(items) {
  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify(
      {
        fetchedAt: new Date().toISOString(),
        count: Object.keys(items).length,
        items,
      },
      null,
      2
    )
  );
}
