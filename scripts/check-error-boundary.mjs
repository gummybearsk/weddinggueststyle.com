#!/usr/bin/env node
/**
 * Rule 62. Fails the build when a Next.js app-router site lacks its own error pages, because a crash
 * then renders Next's generic "Application error" shell, identical on every site, with no canonical.
 *   node scripts/check-error-boundary.mjs [projectDir]
 *   node check-error-boundary.mjs --fleet <folder>     every Next.js project in a folder
 *
 * Also WARNS (never fails, so existing sites keep building) when an error page carries a robots
 * noindex: Google's renderer can land on that page after a transient failure, such as script files
 * replaced by a deploy between fetch and render, and the noindex then drops a healthy page from the
 * index (weddinggueststyle.com /casual-wedding-guest-dresses, 2026-11-12). Fix: remove the meta and
 * reload once on ChunkLoadError (lib/chunkReload.ts in the trend-track starter).
 */
import fs from "node:fs"; import path from "node:path";
const EXT = ["tsx", "jsx", "ts", "js"];
function check(root) {
  let pkg; try { pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")); } catch { return null; }
  if (!pkg.dependencies?.next && !pkg.devDependencies?.next) return null;
  const app = ["app", "src/app"].map((a) => path.join(root, a)).find((a) => fs.existsSync(a));
  if (!app) return null;
  const faults = [], warns = [];
  for (const [base, must] of [["error", /use client/], ["global-error", /<html/i]]) {
    const f = EXT.map((e) => path.join(app, `${base}.${e}`)).find((p) => fs.existsSync(p));
    if (!f) faults.push(`missing ${path.relative(root, app)}/${base}.tsx`);
    else {
      const t = fs.readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
      if (!must.test(t) || !/export default/.test(t)) faults.push(`${path.relative(root, f)} is not a working boundary`);
      if (/Application error: a (client|server)-side exception/i.test(t)) faults.push(`${path.relative(root, f)} repeats the generic error text`);
      if (/<meta[^>]*name=["']robots["'][^>]*noindex/i.test(t)) warns.push(`${path.relative(root, f)} has a robots noindex (a transient render failure can de-index a good page)`);
    }
  }
  faults.warns = warns;
  return faults;
}
const args = process.argv.slice(2);
if (args[0] === "--fleet") {
  let bad = 0, n = 0, warned = 0;
  for (const d of fs.readdirSync(args[1], { withFileTypes: true }).filter((d) => d.isDirectory())) {
    const r = check(path.join(args[1], d.name)); if (r === null) continue; n++;
    if (r.length) { bad++; console.log(`FAIL ${d.name}: ${r.join("; ")}`); }
    if (r.warns.length) { warned++; console.log(`WARN ${d.name}: ${r.warns.join("; ")}`); }
  }
  console.log(`${bad ? "FAIL" : "PASS"} — ${n - bad}/${n} Next.js projects have error boundaries; ${warned} with a noindex on an error page`);
  process.exit(bad ? 1 : 0);
}
const r = check(path.resolve(args[0] || "."));
if (r?.length) { for (const f of r) console.error(`FAIL error-boundary: ${f}`); console.error("fix: add site-specific app/error.tsx and app/global-error.tsx (Rule 62; template in the quick-site starter)."); process.exit(1); }
for (const w of r?.warns ?? []) console.error(`WARN error-boundary: ${w}`);
console.log("PASS error-boundary");
