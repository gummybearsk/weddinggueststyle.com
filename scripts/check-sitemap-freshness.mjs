#!/usr/bin/env node
/**
 * Sitemap freshness audit — run against ANY Next.js content project.
 *
 *   node check-sitemap-freshness.mjs [projectDir] [--domain example.com]
 *
 * Answers the question a one-off post-deploy count cannot: "will this sitemap
 * still be correct next week, with nobody touching it?"
 *
 * ISR revalidation is LAZY. `export const revalidate = N` does not schedule
 * anything — it only marks the cached copy stale after N seconds. Regeneration
 * happens on the next REQUEST after that. On a low-traffic site nothing requests
 * /sitemap.xml, so it never regenerates and silently freezes at its last deploy.
 * A deploy hides this, because a deploy always rebuilds the sitemap.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const ROOT = path.resolve(args.find((a) => !a.startsWith('--')) ?? '.');
const domainArg = args.includes('--domain') ? args[args.indexOf('--domain') + 1] : null;

const read = (p) => { try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch { return null; } };
const findFirst = (...paths) => paths.map((p) => [p, read(p)]).find(([, c]) => c !== null) ?? [null, null];

const results = [];
const add = (level, id, msg, fix) => results.push({ level, id, msg, fix });

// --- 1. sitemap route exists and is not build-frozen ---------------------
const [smPath, smSrc] = findFirst('app/sitemap.ts', 'src/app/sitemap.ts', 'app/sitemap.js', 'src/app/sitemap.js');
if (!smSrc) {
  add('FAIL', 'SM-1', 'No app/sitemap.ts found.', 'Create one that reads content at runtime.');
} else {
  const rev = smSrc.match(/export\s+const\s+revalidate\s*=\s*(\d+)/);
  const forceDynamic = /export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]/.test(smSrc);
  if (!rev && !forceDynamic) {
    add('FAIL', 'SM-2', `${smPath} has no \`revalidate\` and is not force-dynamic — the sitemap is FROZEN at build time.`,
      'Add `export const revalidate = 3600`.');
  } else if (rev) {
    const n = Number(rev[1]);
    if (n === 0) add('PASS', 'SM-2', `${smPath} revalidate = 0 (always dynamic).`);
    else if (n > 21600) add('WARN', 'SM-2', `${smPath} revalidate = ${n}s (${(n / 3600).toFixed(0)}h) — longer than 6h races a fixed-time daily cron and can skip a day.`,
      'Lower to 3600. A daily cron then always finds it expired.');
    else add('PASS', 'SM-2', `${smPath} revalidate = ${n}s.`);
  }
  // Strip comments first — "never use new Date()" in a comment is not a violation.
  const smCode = smSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  if (/new Date\(\)/.test(smCode)) {
    add('WARN', 'SM-3', 'sitemap calls new Date() — lastmod must be the real publish/modify date, not build time (Rule 17).',
      'Use each page\'s stored publishDate/modifiedDate.');
  } else {
    add('PASS', 'SM-3', 'sitemap uses real dates, not new Date().');
  }
}

// --- 2. SOMETHING must request it. this is the one everyone misses --------
const vercel = read('vercel.json');
let crons = [];
try { crons = JSON.parse(vercel ?? '{}').crons ?? []; } catch { /* malformed */ }
// A cron counts as a sitemap trigger if it requests /sitemap.xml directly, OR if
// the route it hits fetches the sitemap itself (the stronger pattern — it can
// then assert the result instead of hoping).
function cronRouteFetchesSitemap(cronPath) {
  const rel = cronPath.replace(/^\//, '');
  for (const base of ['app', 'src/app']) {
    for (const ext of ['ts', 'js']) {
      const raw = read(path.join(base, rel, `route.${ext}`));
      if (!raw) continue;
      // Comments describing the intent are not the implementation.
      const src = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
      if (!/\bfetch\s*\(|\bfetch[A-Za-z]*\s*\(/.test(src)) continue;
      for (const m of src.matchAll(/sitemap\.xml/g)) {
        const ctx = src.slice(Math.max(0, m.index - 140), m.index + 60);
        // Handing the sitemap URL to google.com/ping or bing.com/ping regenerates
        // nothing (and those endpoints have been dead since 2023).
        if (/google\.com|bing\.com|yandex|indexnow/i.test(ctx)) continue;
        return true;
      }
    }
  }
  return false;
}
const pingsSitemap = crons.some((c) => /sitemap/i.test(c.path) || cronRouteFetchesSitemap(c.path));
if (!vercel) {
  add('FAIL', 'SM-4', 'No vercel.json — nothing ever requests /sitemap.xml, so ISR never regenerates it.',
    'Add {"crons":[{"path":"/sitemap.xml","schedule":"40 5 * * *"}]}');
} else if (!pingsSitemap) {
  add('FAIL', 'SM-4', `vercel.json has ${crons.length} cron(s) but none request /sitemap.xml — ISR is lazy, so it will freeze between deploys.`,
    'Add {"path":"/sitemap.xml","schedule":"40 5 * * *"} to crons.');
} else {
  const direct = crons.some((c) => /sitemap/i.test(c.path));
  add('PASS', 'SM-4', direct
    ? 'A cron requests /sitemap.xml, so regeneration is guaranteed.'
    : 'A cron route fetches /sitemap.xml itself, so regeneration is guaranteed.');
}

// --- 3. runtime content reads must be traced (global Rule 39) -------------
const [cfgPath, cfg] = findFirst('next.config.js', 'next.config.mjs', 'next.config.ts');
if (cfg && /outputFileTracingIncludes/.test(cfg)) {
  add(/['"]\/sitemap\.xml['"]/.test(cfg) ? 'PASS' : 'WARN', 'SM-5',
    /['"]\/sitemap\.xml['"]/.test(cfg)
      ? 'outputFileTracingIncludes covers /sitemap.xml.'
      : 'outputFileTracingIncludes present but /sitemap.xml is not listed.',
    'Add "/sitemap.xml": ["./content/**/*"].');
} else if (cfg) {
  add('WARN', 'SM-5', `${cfgPath} has no outputFileTracingIncludes — if the sitemap reads content at runtime it will regenerate EMPTY on Vercel.`,
    'Add experimental.outputFileTracingIncludes for every ISR route reading content.');
}

// --- 4. scheduled publishing: the pinned-404 trap -------------------------
const hasSchedule = /publishDate|publishedDate|scheduledFor/.test(
  [read('lib/getPages.ts'), read('src/lib/getPages.ts'), read('lib/posts.ts'), read('src/lib/posts.ts')].filter(Boolean).join('\n'),
);
if (hasSchedule) {
  // A cron NAMED "publish-check" proves nothing — the route must actually call
  // revalidatePath(), which is the only thing that clears a pinned 404.
  const sweepCron = crons.find((c) => /publish|revalidate|rebuild/i.test(c.path));
  const sweepRouteRevalidates = (cronPath) => {
    const relPath = cronPath.replace(/^\//, '');
    for (const base of ['app', 'src/app']) {
      for (const ext of ['ts', 'js']) {
        const raw = read(path.join(base, relPath, `route.${ext}`));
        if (!raw) continue;
        const src = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
        if (/revalidatePath\s*\(/.test(src)) return true;
      }
    }
    return false;
  };
  if (!sweepCron) {
    add('FAIL', 'SM-6', 'Site uses date-scheduled publishing but has no daily publish sweep. A request to a scheduled URL BEFORE its date pins a 404 in the ISR cache that revalidate never clears, so the page can stay 404 after its publish date.',
      'Add /api/cron/publish-check calling revalidatePath() for every page past its publishDate.');
  } else if (!sweepRouteRevalidates(sweepCron.path)) {
    add('FAIL', 'SM-6', `Cron ${sweepCron.path} looks like a publish sweep but its route never calls revalidatePath() — pinned 404s are NOT cleared. Worse, a route that submits URLs to IndexNow without revalidating actively tells Bing to crawl a 404.`,
      'Call revalidatePath(`/${slug}`) for every page past its publishDate, before any IndexNow submission.');
  } else {
    add('PASS', 'SM-6', 'A daily publish sweep cron exists and calls revalidatePath() — pinned 404s get cleared.');
  }
}

// --- 5. build scripts must be portable ------------------------------------
// A script path outside the repo resolves fine on the laptop and dies in CI:
// on Vercel `~` expands to /vercel/ and the home directory does not exist, so
// the deploy fails in ~4s with "Cannot find module". This check fires LOCALLY,
// where the path still resolves — i.e. before the push that would break the build.
{
  const pkgRaw = read('package.json');
  if (pkgRaw) {
    let scripts = {};
    try { scripts = JSON.parse(pkgRaw).scripts ?? {}; } catch { /* malformed */ }
    const bad = Object.entries(scripts).filter(([, v]) =>
      /(^|\s)~\//.test(String(v)) || String(v).includes('/Users/') || String(v).includes('.claude/'),
    );
    if (bad.length) {
      add('FAIL', 'SM-7',
        `npm script(s) reference a path outside the repo: ${bad.map(([k]) => k).join(', ')} — this builds locally and FAILS on Vercel.`,
        'Vendor the script into ./scripts/ and call it by relative path.');
    } else {
      add('PASS', 'SM-7', 'All npm scripts use repo-relative paths.');
    }
  }
}

// --- report ---------------------------------------------------------------
const order = { FAIL: 0, WARN: 1, PASS: 2 };
results.sort((a, b) => order[a.level] - order[b.level]);
console.log(`\nSitemap freshness audit — ${ROOT}\n${'-'.repeat(64)}`);
for (const r of results) {
  console.log(`${r.level.padEnd(5)} ${r.id}  ${r.msg}`);
  if (r.fix && r.level !== 'PASS') console.log(`${' '.repeat(11)}fix: ${r.fix}`);
}
const fails = results.filter((r) => r.level === 'FAIL').length;
console.log(`${'-'.repeat(64)}`);
console.log(fails ? `${fails} blocking issue(s) — this sitemap will stall.` : 'No blocking issues — this sitemap will keep itself current.');

if (domainArg) {
  const url = `https://${domainArg.replace(/^https?:\/\//, '')}/sitemap.xml`;
  fetch(url)
    .then((r) => r.text())
    .then((t) => console.log(`\nLive check: ${url} -> ${(t.match(/<loc>/g) ?? []).length} URLs`))
    .catch(() => console.log(`\nLive check: could not fetch ${url}`));
}
process.exitCode = fails ? 1 : 0;
