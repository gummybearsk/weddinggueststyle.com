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

/**
 * Does this module reach lib/getPages, directly or through other local modules?
 *
 * Transitive resolution matters: lib/accessoryLinks.ts imports getPages, so a route that
 * imports only accessoryLinks still reads the filesystem at runtime. A direct-import-only
 * check would silently pass such a route — reintroducing exactly the bug this gate exists
 * to prevent.
 */
function readsContent(file, seen = new Set()) {
  const resolved = path.resolve(file);
  if (seen.has(resolved)) return false; // cycle guard
  seen.add(resolved);

  // The loader itself is the base case. Without this the recursion walks INTO
  // lib/getPages.ts, finds no import of itself, and returns false — so a route reaching
  // the loader through an intermediate module (app/season → lib/featured → lib/getPages)
  // would pass the gate while still reading the filesystem at runtime.
  if (resolved === path.join(root, "lib", "getPages.ts")) return true;

  let src;
  try {
    src = fs.readFileSync(resolved, "utf8");
  } catch {
    return false;
  }
  if (/from\s+["']@\/lib\/getPages["']/.test(src)) return true;
  // Any module doing its own fs read of the content dir counts too.
  if (/require\(["']fs["']\)|from\s+["']fs["']/.test(src) && /content/.test(src)) return true;

  for (const m of src.matchAll(/from\s+["'](@\/[^"']+|\.\.?\/[^"']+)["']/g)) {
    const spec = m[1];
    const base = spec.startsWith("@/")
      ? path.join(root, spec.slice(2))
      : path.resolve(path.dirname(resolved), spec);
    for (const ext of [".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"]) {
      const candidate = base + ext;
      if (fs.existsSync(candidate) && readsContent(candidate, seen)) return true;
    }
  }
  return false;
}

const offenders = [];
for (const file of walk(appDir)) {
  const src = fs.readFileSync(file, "utf8");
  const revalidates = /export\s+const\s+revalidate\s*=/.test(src);
  if (!revalidates || !readsContent(file)) continue;

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
