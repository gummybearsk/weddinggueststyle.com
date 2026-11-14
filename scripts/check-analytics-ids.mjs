#!/usr/bin/env node
/**
 * Fails the build when an element id equals an analytics snippet's global name.
 * Rule 64(e).
 *
 *   node scripts/check-analytics-ids.mjs [projectDir]
 *   node ~/.claude/skills/_shared/analytics-ids/check-analytics-ids.mjs --fleet "<projects folder>"
 *
 * WHY: browsers expose every element id as a window global. `<Script id="clarity">`
 * makes `window.clarity` the <script> element, so Clarity's stub
 * `c[a]=c[a]||function(){…}` keeps the element, and clarity.js then throws
 * "a[c] is not a function" — Clarity records nothing, silently. Found live on 11
 * of the owner's sites on 2026-11-14 (inherited from the trend-track starter).
 * The same `x = x || …` pattern breaks dataLayer (GTM/GA4), ym (Yandex), fbq,
 * uetq (Bing UET), hj (Hotjar), ttq, _paq and the rest below.
 *
 * Only distinctive global names are listed: a generic word like "analytics" is
 * a legitimate id far more often than it is a Segment conflict, and a false
 * positive in a build gate is worse than no gate (Rule 45).
 */
import fs from 'node:fs';
import path from 'node:path';

const GLOBALS = [
  'clarity', 'dataLayer', 'gtag', 'ga', 'google_tag_manager', 'ym', 'fbq', '_fbq',
  'uetq', 'hj', 'ttq', '_paq', 'plausible', 'umami', 'twq', 'pintrk', 'rdt', 'lintrk', 'snaptr', '_hsq',
];
// id="clarity"  id={'clarity'}  id={`clarity`}  — JSX/HTML attributes only (not object keys `id:`),
// so a config object such as { id: "analytics" } can never trip it.
const RE = new RegExp(`(?<![\\w-])id\\s*=\\s*\\{?\\s*(["'\`])(${GLOBALS.join('|')})\\1`, 'g');
const EXT = /\.(tsx|jsx|ts|js|mjs|html)$/;
const SKIP = new Set(['node_modules', '.next', '.vercel', '.git', 'out', 'dist', 'build', 'scripts', 'research', 'Backlink Research & Outreach']);

function walk(dir, out) {
  let ents = [];
  try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of ents) {
    if (SKIP.has(e.name) || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (EXT.test(e.name)) out.push(p);
  }
  return out;
}

function check(root) {
  const hits = [];
  for (const sub of ['app', 'components', 'lib', 'src', 'pages', 'public']) {
    for (const f of walk(path.join(root, sub), [])) {
      const txt = fs.readFileSync(f, 'utf8');
      for (const m of txt.matchAll(RE)) {
        const line = txt.slice(0, m.index).split('\n').length;
        hits.push({ file: path.relative(root, f), line, id: m[2] });
      }
    }
  }
  return hits;
}

const args = process.argv.slice(2);
const fi = args.indexOf('--fleet');
if (fi !== -1) {
  const base = path.resolve(args[fi + 1] ?? '.');
  let bad = 0, n = 0;
  for (const d of fs.readdirSync(base, { withFileTypes: true })) {
    const root = path.join(base, d.name);
    if (!d.isDirectory() || !fs.existsSync(path.join(root, 'package.json'))) continue;
    n++;
    const hits = check(root);
    if (hits.length) { bad++; for (const h of hits) console.log(`FAIL  ${d.name}/${h.file}:${h.line}  id="${h.id}"`); }
  }
  console.log(`${bad ? 'FAIL' : 'PASS'} — ${bad} of ${n} projects have an element id that shadows an analytics global`);
  process.exit(bad ? 1 : 0);
}

const root = path.resolve(args.find((a) => !a.startsWith('--')) ?? '.');
const hits = check(root);
if (!hits.length) {
  console.log('PASS  analytics-ids — no element id shadows an analytics global');
  process.exit(0);
}
for (const h of hits) {
  console.log(`FAIL  ${h.file}:${h.line}  id="${h.id}" makes window.${h.id} the element, so the ${h.id} snippet breaks silently`);
  console.log(`      fix: rename it to a hyphenated id such as "ms-${h.id}-init" (a hyphenated name is not a JS identifier, so scripts can never read it as window.${h.id})`);
}
console.log(`FAIL  analytics-ids — ${hits.length} element id(s) shadow an analytics global (Rule 64e)`);
process.exit(1);
