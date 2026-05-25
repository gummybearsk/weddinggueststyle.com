#!/usr/bin/env node
/**
 * IndexNow ping — notifies Bing + Yandex of new/changed URLs.
 *
 * IndexNow is a single endpoint that broadcasts to all participating
 * search engines (Bing, Yandex, and any others that adopt the protocol).
 * One POST replaces separate Bing-API and Yandex-API submissions.
 *
 * Modes:
 *   node scripts/notify-indexnow.js                 — submits the full sitemap
 *   node scripts/notify-indexnow.js <slug> [<slug>] — submits specific slugs
 *
 * Run after publish, after content updates, and from CI on every deploy.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const HOST = "weddinggueststyle.com";
const KEY = "1d74c00d810c48213dc0f8a78746e41a";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

function getPublishedSlugs() {
  const dir = path.join(__dirname, "..", "content", "pages");
  const today = new Date().toISOString().split("T")[0];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      return { slug: data.slug, publishDate: data.publishDate };
    })
    .filter((p) => !p.publishDate || p.publishDate <= today)
    .map((p) => p.slug);
}

function buildUrlList(args) {
  const trustPages = ["", "about", "editorial", "privacy", "terms", "contact", "author/sukie-gao", "season", "dress-code", "color", "body-type", "style", "venue"];
  if (args.length === 0) {
    const slugs = getPublishedSlugs();
    return [
      ...trustPages.map((p) => (p ? `https://${HOST}/${p}` : `https://${HOST}`)),
      ...slugs.map((s) => `https://${HOST}/${s}`),
    ];
  }
  return args.map((s) => `https://${HOST}/${s.replace(/^\//, "")}`);
}

function submit(urls) {
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  });
  const req = https.request(
    ENDPOINT,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    (res) => {
      let chunks = "";
      res.on("data", (c) => (chunks += c));
      res.on("end", () => {
        console.log(`[IndexNow] ${res.statusCode} — submitted ${urls.length} URL(s)`);
        if (res.statusCode >= 400) console.error(chunks);
      });
    }
  );
  req.on("error", (e) => console.error("[IndexNow] error:", e.message));
  req.write(body);
  req.end();
}

const args = process.argv.slice(2);
const urls = buildUrlList(args);
console.log(`[IndexNow] pinging ${urls.length} URL(s) for ${HOST}`);
submit(urls);
