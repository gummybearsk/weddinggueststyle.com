#!/usr/bin/env node
/**
 * Structured-data URL audit — run against ANY Next.js content project.
 *
 *   node check-schema-urls.mjs [projectDir]                  # static (no network, prebuild-safe)
 *   node check-schema-urls.mjs [projectDir] --live domain.com  # fetch + verify every asserted URL
 *
 * Premise: JSON-LD is a set of CRAWLABLE PROMISES. Every url / target / item /
 * logo / image / sameAs you emit is a URL you are telling Google to go fetch.
 * Nothing in a normal build checks that any of them resolve, so a schema can
 * promise a route that has never existed and the only symptom is a 404 in GSC
 * weeks later.
 *
 * The bug that motivated this (tdeecalculatorhub.com, Sep 2026): a boilerplate
 * WebSite schema declared
 *     potentialAction: { "@type": "SearchAction",
 *                        target: `${SITE.url}/{search_term_string}` }
 * on a site with no search page. Google crawled the LITERAL template string and
 * reported `Not found (404) — /{search_term_string}`. Note the two forms differ:
 *   PATH form  `${url}/{search_term_string}`   -> real 404, Google crawls it
 *   QUERY form `${url}/?q={search_term_string}` -> no 404, resolves to homepage
 * Both are wrong on a site with no search route; only the first bleeds crawl budget.
 * Google retired the sitelinks searchbox in 2023, so a SearchAction has no upside.
 *
 * STATIC mode catches the landmines without a build or network, so it can run in
 * `prebuild`. LIVE mode parses the real rendered JSON-LD and HEAD-checks every URL.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const ROOT = path.resolve(args.find((a) => !a.startsWith('--')) ?? '.');
const liveIdx = args.indexOf('--live');
const LIVE_DOMAIN = liveIdx !== -1 ? args[liveIdx + 1] : null;

const results = [];
const add = (level, id, msg, fix) => results.push({ level, id, msg, fix });

// ---------------------------------------------------------------- helpers
const SRC_DIRS = ['app', 'src/app', 'lib', 'src/lib', 'components', 'src/components'];
function walk(dir, out = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(t|j)sx?$/.test(e.name)) out.push(p);
  }
  return out;
}
const sourceFiles = SRC_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
const rel = (p) => path.relative(ROOT, p);

// Does this project have anything that could serve a search query?
const hasSearchRoute =
  ['app/search', 'src/app/search'].some((d) => fs.existsSync(path.join(ROOT, d))) ||
  sourceFiles.some((f) => {
    const s = fs.readFileSync(f, 'utf8');
    return /searchParams\s*[.:\[]/.test(s) && /\bq\b|\bquery\b|\bsearch\b/i.test(s) && /page\.(t|j)sx?$/.test(f);
  });

// Remove every ${...} span, honouring NESTED braces — `${a ? `?t=${b}` : ''}` is one
// span, not two. A naive /\$\{[^}]*\}/ stops at the first `}` and leaves an unbalanced
// remainder, which reads as an unexpanded placeholder and fires a false positive.
// A false positive in a build gate is worse than no gate: it trains people to bypass it.
function stripInterpolation(str) {
  let out = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '$' && str[i + 1] === '{') {
      let depth = 1;
      i += 2;
      while (i < str.length && depth > 0) {
        if (str[i] === '{') depth++;
        else if (str[i] === '}') depth--;
        i++;
      }
      i--; // loop's i++ lands past the closing brace
      continue;
    }
    out += str[i];
  }
  return out;
}

// ------------------------------------------------- 1. SearchAction landmine
const searchActionHits = [];
// Strip comments before scanning: a gate that fires on the word "SearchAction"
// inside a comment explaining why the site deliberately has no SearchAction is a
// false positive, and a false positive trains people to bypass the gate.
const stripComments = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
for (const f of sourceFiles) {
  const raw = fs.readFileSync(f, 'utf8');
  const src = stripComments(raw);
  if (!/search_term_string|SearchAction/.test(src)) continue;
  const line = raw.split('\n').findIndex((l) => /search_term_string|SearchAction/.test(stripComments(l))) + 1;
  const isPathForm = /\/\{search_term_string\}/.test(src);
  searchActionHits.push({ file: rel(f), line, isPathForm });
}
if (searchActionHits.length === 0) {
  add('PASS', 'SD-1', 'No SearchAction declared.');
} else if (hasSearchRoute) {
  add('WARN', 'SD-1', `SearchAction declared and a search route exists — verify the target matches the real route. (${searchActionHits.map((h) => h.file).join(', ')})`,
    'Confirm the target URL pattern actually returns results.');
} else {
  for (const h of searchActionHits) {
    if (h.isPathForm) {
      add('FAIL', 'SD-1', `SearchAction uses the PATH form on a site with NO search route — Google will crawl the literal template and 404. ${h.file}:${h.line}`,
        'Delete the potentialAction/SearchAction block. Google retired the sitelinks searchbox in 2023.');
    } else {
      add('FAIL', 'SD-1', `SearchAction declared but this site has NO search route — the schema promises a feature that does not exist. ${h.file}:${h.line}`,
        'Delete the potentialAction/SearchAction block. Google retired the sitelinks searchbox in 2023.');
    }
  }
}

// -------------------------------------- 2. unexpanded template placeholders
// Any URL literal containing { } that is NOT a JS template interpolation (${...})
// ships to Google verbatim. This is the generalized form of the bug above.
const placeholderHits = [];
for (const f of sourceFiles) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/["'`]([^"'`\n]*https?:\/\/[^"'`\n]*)["'`]/g)) {
    const url = m[1];
    const stripped = stripInterpolation(url);
    if (/[{}]/.test(stripped)) {
      placeholderHits.push({ file: rel(f), url: url.slice(0, 90) });
    }
  }
}
const nonSearchPlaceholders = placeholderHits.filter((h) => !/search_term_string/.test(h.url));
if (nonSearchPlaceholders.length === 0) {
  add('PASS', 'SD-2', 'No unexpanded {placeholder} URLs in schema literals.');
} else {
  for (const h of nonSearchPlaceholders.slice(0, 8)) {
    add('FAIL', 'SD-2', `URL literal ships an unexpanded placeholder to Google: ${h.url}  (${h.file})`,
      'Interpolate the real value, or remove the property.');
  }
}

// ------------------------------------------------------ 3. http:// in schema
const insecure = [];
for (const f of sourceFiles) {
  const src = fs.readFileSync(f, 'utf8');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  for (const m of code.matchAll(/["'`](http:\/\/(?!localhost|127\.0\.0\.1)[^"'`\n]+)["'`]/g)) {
    insecure.push({ file: rel(f), url: m[1].slice(0, 80) });
  }
}
if (insecure.length === 0) add('PASS', 'SD-3', 'No http:// absolute URLs (Rule 12).');
else for (const h of insecure.slice(0, 6)) add('FAIL', 'SD-3', `http:// URL must be https:// (Rule 12): ${h.url}  (${h.file})`, 'Change to https://.');

// ------------------------------------------------------------- 3b. canonical ownership (SD-4)
// A site-wide `alternates.canonical` in the ROOT layout is inherited by every route that
// does not override it — including not-found.tsx, whose canonical then points at the
// homepage. On any soft-404 that tells Google "this URL duplicates the homepage".
// rivalsrandomizer.org, 2026-09-11: GSC reported 2 pages "Duplicate without user-selected
// canonical" with a foreign gambling domain as Google's chosen canonical; the 404 page was
// carrying canonical → homepage. Rule: no canonical in the root layout; every page.tsx
// under app/ declares its own.
{
  const appDir = path.join(ROOT, 'app');
  const rootLayout = ['layout.tsx', 'layout.jsx', 'layout.ts', 'layout.js'].map((n) => path.join(appDir, n)).find((p) => fs.existsSync(p));
  const layoutSrc = rootLayout ? fs.readFileSync(rootLayout, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '') : '';
  const layoutHasCanonical = /alternates\s*:\s*\{[^}]*canonical/.test(layoutSrc);
  const pages = walk(appDir).filter((p) => /[\\/]page\.(tsx|jsx|ts|js)$/.test(p) && !/[\\/]api[\\/]/.test(p));
  const noCanonical = pages.filter((p) => {
    const src = fs.readFileSync(p, 'utf8');
    // a page owns its canonical if it sets alternates.canonical in metadata/generateMetadata
    if (/canonical/.test(src)) return false;
    // ...or if its metadata export delegates to an imported helper whose module sets one
    // (e.g. `export const generateMetadata = () => pillarMetadata("x")`). Without this the gate
    // false-fails shared-helper sites (hintsheet.com, 2026-10-11) — and a gate that cries wolf
    // gets bypassed (Rule 45).
    const metaCall = src.match(/export\s+(?:const|async\s+function|function)\s+(?:generateMetadata|metadata)\b[\s\S]{0,200}?\b([A-Za-z_$][\w$]*)\s*\(/);
    if (!metaCall) return true;
    const helper = metaCall[1];
    for (const m of src.matchAll(/import\s+([^;]+?)\s+from\s+["']([^"']+)["']/g)) {
      if (!new RegExp(`\\b${helper}\\b`).test(m[1])) continue;
      const spec = m[2];
      const base = spec.startsWith('@/') ? path.join(ROOT, spec.slice(2)) : spec.startsWith('.') ? path.resolve(path.dirname(p), spec) : null;
      if (!base) continue;
      const file = ['', '.tsx', '.ts', '.jsx', '.js', '/index.tsx', '/index.ts'].map((x) => base + x).find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
      if (file && /canonical/.test(fs.readFileSync(file, 'utf8'))) return false;
    }
    return true;
  });
  if (layoutHasCanonical) add('FAIL', 'SD-4', `Root layout sets a site-wide alternates.canonical (${rel(rootLayout)}) — not-found.tsx and any route without its own canonical inherit it and declare themselves duplicates of the homepage.`,
    'Remove alternates.canonical from the root layout; set it on app/page.tsx and on every route.');
  if (noCanonical.length) for (const p of noCanonical.slice(0, 8)) add('FAIL', 'SD-4', `Route declares no canonical: ${rel(p)}`, 'Add alternates: { canonical: "/<route>" } to its metadata or generateMetadata.');
  if (!layoutHasCanonical && !noCanonical.length) add('PASS', 'SD-4', `Every page route owns its canonical (${pages.length} routes); root layout sets none.`);
}

// ------------------------------------------------------------- 4. LIVE mode
const URL_KEYS = new Set(['url', 'target', 'item', 'logo', 'image', 'sameAs', 'contentUrl', '@id', 'mainEntityOfPage', 'thumbnailUrl']);
function collectUrls(node, out = new Set()) {
  if (node == null) return out;
  if (typeof node === 'string') { if (/^https?:\/\//.test(node)) out.add(node); return out; }
  if (Array.isArray(node)) { node.forEach((n) => collectUrls(n, out)); return out; }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === '@context') continue;
      if (typeof v === 'string' && (URL_KEYS.has(k) || /^https?:\/\//.test(v))) { if (/^https?:\/\//.test(v)) out.add(v); }
      else collectUrls(v, out);
    }
  }
  return out;
}

async function live() {
  const base = LIVE_DOMAIN.startsWith('http') ? LIVE_DOMAIN : `https://${LIVE_DOMAIN}`;
  let html;
  try {
    const res = await fetch(base, { redirect: 'follow' });
    html = await res.text();
  } catch (e) {
    add('FAIL', 'SD-4', `Could not fetch ${base}: ${e.message}`, 'Check the domain is live.');
    return;
  }
  const blocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length === 0) { add('WARN', 'SD-4', 'No JSON-LD found on the homepage.', 'Confirm schema is server-rendered.'); return; }
  const urls = new Set();
  for (const b of blocks) {
    try { collectUrls(JSON.parse(b), urls); }
    catch { add('FAIL', 'SD-4', 'A JSON-LD block failed to parse — Google will discard it.', 'Fix the JSON syntax.'); }
  }
  const check = [...urls].filter((u) => !/schema\.org/.test(u));
  let bad = 0;
  for (const u of check) {
    if (/[{}]/.test(u)) { add('FAIL', 'SD-5', `Live schema asserts a template URL Google will crawl literally: ${u}`, 'Remove or interpolate it.'); bad++; continue; }
    try {
      // Large platforms (youtube.com, x.com, instagram.com, linkedin.com) block or
      // rate-limit bare HEAD requests from non-browser clients. A gate that reports a
      // live URL as dead is worse than no gate — it trains people to bypass it
      // (Rule 45). So escalate HEAD -> GET-with-browser-UA before declaring failure,
      // and only fail when the resource genuinely does not resolve.
      const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', 'Accept-Language': 'en-US,en;q=0.9' };
      let r = null, lastErr = null;
      for (const attempt of [
        () => fetch(u, { method: 'HEAD', redirect: 'follow' }),
        () => fetch(u, { method: 'GET', redirect: 'follow', headers: UA }),
      ]) {
        try { r = await attempt(); if (r.ok) break; } catch (e) { lastErr = e; r = null; }
      }
      // Last resort: curl. Node's fetch (undici) ignores HTTP_PROXY/HTTPS_PROXY, so on a
      // machine behind a local proxy every external domain looks like a Connect Timeout
      // while curl reaches it fine. Verified 2026-09-10: youtube.com was reported dead by
      // fetch and returned 200 via curl. Without this the gate fails on healthy URLs.
      if (!r || !r.ok) {
        try {
          const { execFileSync } = await import('node:child_process');
          const code = execFileSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}',
            '-L', '--max-time', '20', '-A', UA['User-Agent'], u], { encoding: 'utf8' }).trim();
          if (/^[23]\d\d$/.test(code)) { r = { ok: true, status: Number(code) }; }
          else if (/^\d{3}$/.test(code) && code !== '000') { r = { ok: false, status: Number(code) }; }
        } catch { /* curl unavailable or failed; fall through to the existing verdict */ }
      }
      if (r && !r.ok) { add('FAIL', 'SD-5', `Schema URL returns HTTP ${r.status}: ${u}`, 'Fix or remove the assertion.'); bad++; }
      else if (!r) { add('FAIL', 'SD-5', `Schema URL unreachable (${lastErr ? lastErr.message : 'no response'}): ${u}`, 'Fix or remove the assertion.'); bad++; }
    } catch (e) {
      add('FAIL', 'SD-5', `Schema URL unreachable (${e.message}): ${u}`, 'Fix or remove the assertion.'); bad++;
    }
  }
  if (bad === 0) add('PASS', 'SD-5', `All ${check.length} URLs asserted in live JSON-LD resolve.`);
}

// --------------------------------------------------------------- report out
const finish = () => {
  const order = { FAIL: 0, WARN: 1, PASS: 2 };
  results.sort((a, b) => order[a.level] - order[b.level] || a.id.localeCompare(b.id));
  console.log(`Structured-data URL audit — ${ROOT}`);
  console.log('-'.repeat(64));
  for (const r of results) {
    console.log(`${r.level.padEnd(5)} ${r.id}  ${r.msg}`);
    if (r.fix && r.level !== 'PASS') console.log(`${' '.repeat(11)}fix: ${r.fix}`);
  }
  console.log('-'.repeat(64));
  const fails = results.filter((r) => r.level === 'FAIL').length;
  if (fails) { console.log(`${fails} blocking issue(s) — schema is promising URLs that do not work.`); process.exit(1); }
  console.log('No blocking issues — every URL this schema promises is real.');
};

if (LIVE_DOMAIN) live().then(finish); else finish();
