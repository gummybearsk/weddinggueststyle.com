/**
 * Prebuild gate: every route that reads content/pages/ at runtime must be listed in
 * next.config.mjs -> experimental.outputFileTracingIncludes.
 *
 * Why this exists: Vercel's output-file tracer does not follow `fs.readdirSync`. A route
 * with `export const revalidate` re-runs in a serverless function during ISR; if
 * content/pages/ was never traced into that function's bundle, getAllSlugs() returns []
 * and the route silently degrades. This is how /sitemap.xml shipped 13 URLs instead of
 * 116 -- every money page missing from Google's discovery path, with no build error.
 *
 * Fails the build rather than letting it ship quietly.
 */

import fs from "fs";
import path from "path";

const root = process.cwd();
const appDir = path.join(root, "app");

// Map a source file path under app/ to the route key Next uses for tracing.
function routeKeyFor(file) {
  const rel = path.relative(appDir, file).split(path.sep);
  const base = rel[rel.length - 1];
  const segments = rel.slice(0, -1);

  if (base === "sitemap.ts" || base === "sitemap.js") return "/sitemap.xml";
  if (base === "robots.ts" || base === "robots.js") return "/robots.txt";
  if (base.startsWith("page.")) return "/" + segments.join("/");
  return null;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const offenders = [];
for (const file of walk(appDir)) {
  const src = fs.readFileSync(file, "utf8");
  const readsContent = /from\s+["']@\/lib\/getPages["']/.test(src);
  const revalidates = /export\s+const\s+revalidate\s*=/.test(src);
  if (!readsContent || !revalidates) continue;

  const key = routeKeyFor(file);
  if (key) offenders.push({ key, file: path.relative(root, file) });
}

const config = fs.readFileSync(path.join(root, "next.config.mjs"), "utf8");
const missing = offenders.filter(({ key }) => !config.includes(`"${key}"`));

if (missing.length) {
  console.error(
    "\n[31m✕ Sitemap/ISR tracing check FAILED[0m\n\n" +
      "These routes read content/pages/ at runtime AND revalidate, but are not listed in\n" +
      "next.config.mjs -> experimental.outputFileTracingIncludes. They will ship with no\n" +
      "content files and silently return empty in production:\n"
  );
  for (const { key, file } of missing) console.error(`  ${key}   (${file})`);
  console.error(
    "\nAdd each key to outputFileTracingIncludes with [\"./content/pages/**/*.json\"].\n"
  );
  process.exit(1);
}

console.log(
  `✓ Sitemap/ISR tracing check passed (${offenders.length} runtime-content route${
    offenders.length === 1 ? "" : "s"
  } traced).`
);
