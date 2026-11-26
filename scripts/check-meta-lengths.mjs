#!/usr/bin/env node
// Rule 65 — titles and meta descriptions use the space Google shows, never more; one H1 per page.
//
//   node scripts/check-meta-lengths.mjs .            (postbuild; reads the rendered HTML of the build)
//   node check-meta-lengths.mjs . --json
//
// Limits (owner 2026-11-20, from GeFeiSites 首页怎么做): title 30–60 characters, description 70–160,
// a CJK character counts as 2. The owner wants the space used, so:
//   FAIL  title > 60, description > 160, no title, no description, H1 count ≠ 1
//   WARN  title < 50 or description < 140 (space left unused), title < 30 or description < 70 (too short)
// FAILs block the build only with package.json "seoGates": { "meta": "enforce" }; otherwise WARN-only,
// so an existing site never breaks when the installer adds this gate.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : ".");
const JSON_OUT = process.argv.includes("--json");
let enforce = false;
try { enforce = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).seoGates?.meta === "enforce"; } catch {}

const T_MIN = 30, T_GOOD = 50, T_MAX = 60, D_MIN = 70, D_GOOD = 140, D_MAX = 160;
const width = (s) => [...s].reduce((n, ch) => n + (/[⺀-鿿가-힯぀-ヿ＀-￯]/.test(ch) ? 2 : 1), 0);
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

const dirs = [".next/server/app", "out", "dist", "build"].map((d) => path.join(ROOT, d)).filter((d) => fs.existsSync(d));
if (!dirs.length) { console.log("check-meta-lengths: SKIP — no build output found (run after `next build`)."); process.exit(0); }
const files = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (e.name.endsWith(".html") && !/^(_not-found|404|500|_error|_global-error)/.test(e.name)) files.push(f); } };
dirs.forEach(walk);

const rows = [];
for (const f of files) {
  const html = fs.readFileSync(f, "utf8");
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) continue;      // not for Google, not our concern
  const route = "/" + path.relative(dirs.find((d) => f.startsWith(d)), f).replace(/(\/)?index\.html$|\.html$/, "").replace(/^index$/, "");
  const title = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1]);
  const desc = decode((html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i) || html.match(/<meta[^>]+content="([^"]*)"[^>]+name="description"/i) || [, ""])[1]);
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  const fail = [], warn = [];
  const tw = width(title), dw = width(desc);
  if (!title) fail.push("no <title>"); else if (tw > T_MAX) fail.push(`title ${tw} > ${T_MAX}`); else if (tw < T_MIN) warn.push(`title ${tw} < ${T_MIN} (too short)`); else if (tw < T_GOOD) warn.push(`title ${tw}: ${T_MAX - tw} characters unused`);
  if (!desc) fail.push("no meta description"); else if (dw > D_MAX) fail.push(`description ${dw} > ${D_MAX}`); else if (dw < D_MIN) warn.push(`description ${dw} < ${D_MIN} (too short)`); else if (dw < D_GOOD) warn.push(`description ${dw}: ${D_MAX - dw} characters unused`);
  if (h1 !== 1) fail.push(`${h1} H1 tags (need exactly 1)`);
  rows.push({ route, title, titleLen: tw, descLen: dw, h1, fail, warn });
}

const failing = rows.filter((r) => r.fail.length), warning = rows.filter((r) => !r.fail.length && r.warn.length);
if (JSON_OUT) { console.log(JSON.stringify({ enforce, pages: rows.length, failing: failing.length, warning: warning.length, rows }, null, 2)); }
else {
  const verdict = failing.length ? (enforce ? "FAIL" : "WARN") : "PASS";
  console.log(`check-meta-lengths: ${verdict} — ${rows.length} pages · ${failing.length} over the limit or missing · ${warning.length} with unused space (title ${T_GOOD}–${T_MAX}, description ${D_GOOD}–${D_MAX}; Rule 65)`);
  for (const r of failing) console.log(`  ✗ ${r.route}  ${r.fail.concat(r.warn).join(" · ")}`);
  for (const r of warning.slice(0, 40)) console.log(`  · ${r.route}  ${r.warn.join(" · ")}`);
  if (warning.length > 40) console.log(`  … ${warning.length - 40} more with unused space (--json for all)`);
  if (failing.length && !enforce) console.log('  (warn-only: set "seoGates": { "meta": "enforce" } in package.json to block the build)');
}
process.exit(failing.length && enforce ? 1 : 0);
