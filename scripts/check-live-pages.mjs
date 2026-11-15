#!/usr/bin/env node
/**
 * Live render check for weddinggueststyle.com. Used by the two GitHub workflows:
 *   refresh-amazon.yml  after new prices are published   (--all --asof=<fetchedAt>)
 *   deploy-check.yml    after every code deploy           (--browser, key pages)
 *
 * A 200 proves nothing here: the site's error screen also returns 200. Each page must
 * have its <h1>, no error-screen text, and product links when its JSON lists >=5 products.
 * --asof=ISO  pages with products must show "Prices shown as of <that date>".
 * --browser   also open each page in headless Chromium (needs `playwright`), wait for the
 *             network to settle, and fail on a script error or the error screen. That is
 *             the only way to see what Google's renderer sees.
 * --all       every sitemap URL instead of the key pages.
 *
 * Exit 1 on any failure, so the workflow fails and GitHub emails the repo owner.
 */
import fs from "fs";
import path from "path";

const BASE = "https://weddinggueststyle.com";
const KEY = [
  "/",
  "/formal-wedding-guest-dresses",
  "/elegant-wedding-guest-dresses",
  "/a-line-wedding-guest-dresses",
  "/red-wedding-guest-dresses",
  "/pink-wedding-guest-dresses",
  "/summer-wedding-guest-dresses",
  "/green-wedding-guest-dresses",
  "/casual-wedding-guest-dresses",
];
const HUBS = new Set(["/", "/season", "/dress-code", "/color", "/body-type", "/style", "/venue"]);
const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}`));
const asofArg = arg("asof")?.split("=")[1];
const asofLabel = asofArg
  ? new Date(asofArg).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
  : null;

function expectsProducts(p) {
  if (HUBS.has(p)) return true; // home and every hub render product rows (lib/featured.ts)
  const f = path.join(process.cwd(), "content", "pages", `${p.slice(1)}.json`);
  try {
    return (JSON.parse(fs.readFileSync(f, "utf8")).products?.length ?? 0) >= 5;
  } catch {
    return false;
  }
}

function judge(p, status, html) {
  if (status !== 200) return `HTTP ${status}`;
  if (!/<h1[\s>]/.test(html)) return "no <h1>";
  if (/page did not load/i.test(html)) return "error screen";
  const hasProducts = /href="https:\/\/www\.amazon\.com\/dp\//.test(html);
  if (expectsProducts(p) && !hasProducts) return "no product links";
  if (asofLabel && hasProducts && !html.includes(`as of ${asofLabel}`)) return `price date is not ${asofLabel}`;
  return "";
}

async function fetchCheck(p) {
  let reason = "";
  // The first request after a revalidation can be the stale copy that triggers the rebuild.
  for (let i = 0; i < 4; i++) {
    const res = await fetch(BASE + p, { headers: { "cache-control": "no-cache" } });
    reason = judge(p, res.status, await res.text());
    if (!reason) return "";
    await new Promise((r) => setTimeout(r, 5000));
  }
  return reason;
}

async function urls() {
  if (!arg("all")) return KEY;
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(BASE, "") || "/");
}

const list = await urls();
const fails = [];
for (const p of list) {
  const r = await fetchCheck(p);
  if (r) fails.push(`${p}: ${r}`);
}

if (arg("browser")) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  for (const p of KEY) {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    try {
      await page.goto(BASE + p, { waitUntil: "networkidle", timeout: 60000 });
      const h1 = (await page.locator("h1").first().textContent({ timeout: 5000 }))?.trim();
      const body = await page.locator("body").innerText();
      const links = await page.locator('a[href^="https://www.amazon.com/dp/"]').count();
      if (!h1) fails.push(`${p} (browser): no h1 after render`);
      else if (/page did not load/i.test(body)) fails.push(`${p} (browser): error screen after render`);
      else if (expectsProducts(p) && links === 0) fails.push(`${p} (browser): no product links after render`);
      if (errors.length) fails.push(`${p} (browser): script error: ${errors[0].slice(0, 160)}`);
    } catch (e) {
      fails.push(`${p} (browser): ${e.message.slice(0, 160)}`);
    }
    await page.close();
  }
  await browser.close();
}

console.log(`${fails.length ? "FAIL" : "PASS"} — ${list.length} page(s)${arg("browser") ? ` + ${KEY.length} in a browser` : ""}${asofLabel ? `, prices as of ${asofLabel}` : ""}`);
for (const f of fails) console.log("  " + f);
process.exit(fails.length ? 1 : 0);
