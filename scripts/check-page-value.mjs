#!/usr/bin/env node
/**
 * Page-value gate — Rule 54. Does each page deserve to outrank what already ranks?
 *
 *   node scripts/check-page-value.mjs <projectDir>
 *
 * WHY THIS EXISTS: every older gate checks that a page is *compliant* (sitemap,
 * schema, word count, keyword slots, skeleton variety). howtomodminecraft.com
 * passed all of them and was demoted site-wide by the Sept 2026 spam update:
 * 25 text-only 2,000-word pages on day one, four pages on one intent, Java facts
 * a release out of date, zero images, zero tools. Nothing ever asked "what does
 * the current top 3 offer, and what do we add?". This gate makes the page carry
 * that answer, and fails the build when it can't.
 *
 * Reads content/pages/*.json. Each page must carry:
 *   "answer": "15–90 words that answer the query outright, shown above the fold",
 *   "brief": {
 *     "intentGroup": "remove-mods",          // one page per intent — no cannibalising
 *     "serpTop3": [{ "url": "...", "format": "tool|video|docs|forum|guide|wiki|download" }, ×3],
 *     "winningFormat": "tool",               // what format the top 3 share
 *     "infoGain": "what this page has that none of the top 3 do (≥80 chars)",
 *     "asset": "tool|diagram|image|data|video",
 *     "verified": "YYYY-MM-DD"               // date every fact was last checked against SOURCES.md
 *   }
 * and must actually ship its asset: an image path (.png/.webp/.jpg/.svg/.avif),
 * a "tool" key, or a "table" built from data. If winningFormat is "tool", the
 * page must have a "tool" key — an article does not beat a tool.
 *
 * Site level (Rule 54h–i, owner 2026-10-21: "keep 20–30 pages for AdSense, but no trash"):
 * value-plan.json at the project root says who the site is for, what it offers, and the
 * user jobs found in real evidence. Every page must answer one of those jobs (PV-9/10), the
 * site must name its core offer (PV-11), and an independent reviewer — never the author —
 * must have compared each page with the live top 3 and passed it (PV-12). Format and
 * procedure: ~/.claude/skills/_shared/value-gates/VALUE-PLAN.md.
 *
 * Competitor level (PV-16/17, owner 2026-10-28: "full and thorough competitor analysis before
 * building"): research/competitor-analysis-*.md must exist with the seven sections of
 * ~/.claude/skills/_shared/value-gates/COMPETITOR-ANALYSIS.md, name ≥5 competitor domains, and be
 * cited by value-plan.json ("competitorAnalysis" + a "serpCheck" on every offer) (PV-16); and
 * content/home.json, when present, must carry "answer" + a "brief" with 3 serpTop3 and an infoGain
 * like a page, and the independent review must have passed it (review.home.passed) (PV-17). fancytextstyles.com launched 2026-10-27 with no homepage brief: its SERP
 * capture returned 0 results and this gate never looked past content/pages/.
 *
 * Mode: package.json "seoGates": { "value": "enforce" } fails the build (exit 1).
 * Anything else prints a loud WARN and passes, so installing on an old project
 * does not break its deploys. /new-site and /quick-site set "enforce".
 *
 * PV-16/17 have their own severity, so re-installing this gate does not break projects that were
 * already "enforce" before the competitor rule existed:
 *   seoGates.competitor === "enforce"  → FAIL (exit 1), whatever seoGates.value says
 *   seoGates.competitor === "warn"     → WARN
 *   otherwise                          → FAIL only when seoGates.value === "enforce" AND the
 *     project is new: value-plan.json "created" (else "researched") is on/after 2026-10-28
 *     (COMPETITOR_RULE_DATE); older or undated projects WARN until retrofitted. New projects
 *     should set seoGates.competitor = "enforce" explicitly.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] ?? '.');
// Image registries: lib/images.(ts|js) with `id: "..."` entries that carry a credit/license.
const IMAGE_REGISTRY = new Set();
for (const rel of ['lib/images.ts', 'lib/images.js', 'src/lib/images.ts']) {
  try {
    const txt = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    if (!/credit|licen[cs]e/i.test(txt)) continue;
    for (const mm of txt.matchAll(/\bid:\s*["']([^"']+)["']/g)) IMAGE_REGISTRY.add(mm[1]);
  } catch {}
}
const pkg = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')); } catch { return {}; } })();
const ENFORCE = pkg.seoGates?.value === 'enforce';
const dir = path.join(ROOT, 'content', 'pages');
const MAX_AGE_DAYS = 120;
const MAX_NEW_PER_WEEK = 6;

if (!fs.existsSync(dir)) {
  console.log(`Page-value gate — no content/pages/ in ${ROOT}; nothing to check.`);
  process.exit(0);
}

const today = new Date(new Date().toISOString().slice(0, 10));
const fails = [];
const warns = [];
const intents = new Map();
const dates = [];
const toolPages = []; // PV-8: game / tool / app sites must ship something interactive (owner, 2026-10-21)
const pageIntents = []; // [id, intentGroup, publishDate] for the site-level checks
const MIN_LAUNCH = 20, MAX_LAUNCH = 30; // the AdSense floor the owner keeps (2026-10-21), and its ceiling

const words = (s) => String(s ?? '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
  let p;
  try { p = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { fails.push(`${f}: invalid JSON (${e.message})`); continue; }
  const id = p.slug ?? f.replace(/\.json$/, '');
  const raw = JSON.stringify(p);
  const b = p.brief;
  if (p.publishDate) dates.push(p.publishDate);

  const aw = words(Array.isArray(p.answer) ? p.answer.join(' ') : p.answer);
  if (aw < 15 || aw > 90) fails.push(`PV-1 ${id}: "answer" is ${aw} words — need a 15–90 word direct answer above the fold`);

  if (!b || typeof b !== 'object') { fails.push(`PV-2 ${id}: no "brief" — research the top 3 before writing the page`); continue; }

  const top = Array.isArray(b.serpTop3) ? b.serpTop3.filter((r) => r?.url && r?.format) : [];
  if (top.length < 3) fails.push(`PV-2 ${id}: brief.serpTop3 lists ${top.length}/3 ranking pages with url+format`);
  if (String(b.infoGain ?? '').trim().length < 80) fails.push(`PV-3 ${id}: brief.infoGain is missing or under 80 chars — what do we add that the top 3 do not?`);

  const registryIdsEarly = (p.images ?? []).map((i) => (i && typeof i === 'object' ? i.id : null)).filter(Boolean);
  const hasImage = /\.(png|webp|jpe?g|svg|avif)\b/i.test(raw) || registryIdsEarly.some((rid) => IMAGE_REGISTRY.has(rid));
  // A tool is a "tool" key, or a boolean flag that embeds one (showDiyCheck, showEstimator, showCalculator…).
  const hasTool = p.tool != null || Object.entries(p).some(([k, v]) => v === true && /^show\w*(Check|Checker|Estimator|Calculator|Tool|Quiz)$/.test(k));
  if (hasTool) toolPages.push(id);
  // Tables declared as data, or real HTML tables inside section bodies (blackmoldremovalhub.com
  // keeps sourced tables as <table> in contentSections; the gate missed them until 2026-11-08).
  const hasTable = /"table"\s*:\s*\{/.test(raw) || /"table"\s*:\s*\[/.test(raw) || /<table[\s>]/i.test(raw);
  // Produced diagrams declared as data (weddinggueststyle.com "guide" pages, 2026-10-22):
  // heroVisual / section visual with a chart or table kind, rendered in code from sourced values.
  const visuals = [p.heroVisual, ...(p.contentSections ?? []).map((s) => s?.visual)].filter(Boolean);
  const hasVisual = visuals.some((v) => ['ladder', 'wearAvoid', 'compare', 'bars', 'verdict', 'chart', 'diagram'].includes(v?.kind) && String(v?.caption ?? '').length > 20);
  if (!hasImage && !hasTool && !hasTable && !hasVisual) fails.push(`PV-4 ${id}: ships no asset (no image, tool or data table) — text alone does not beat the SERP`);
  // PV-14 / PV-15 (Rule 58, owner 2026-10-22): a real, credited photo and a produced diagram on every
  // page, unless the brief records why not. Product-grid thumbnails do not count as the photo: it must be
  // an image object carrying its provenance (license / credit / photographer / source).
  const isCreditedImage = (o) => o && typeof o === 'object' && !Array.isArray(o)
    && /^(https?:\/\/|\/)/i.test(String(o.url ?? o.src ?? ''))
    && ['license', 'licence', 'credit', 'photographer', 'author', 'sourceUrl'].some((k) => o[k]);
  const findCredited = (o, depth = 0) => {
    if (!o || typeof o !== 'object' || depth > 6) return false;
    if (isCreditedImage(o)) return true;
    return Object.entries(o).some(([k, v]) => k !== 'products' && findCredited(v, depth + 1));
  };
  // Photos referenced by id into a project image registry (e.g. lib/images.ts entries with a
  // credit block): count them when the id exists in a registry that carries credits.
  const registryIds = (p.images ?? []).map((i) => (i && typeof i === 'object' ? i.id : null)).filter(Boolean);
  const hasPhoto = findCredited(p) || registryIds.some((rid) => IMAGE_REGISTRY.has(rid));
  const hasDiagram = hasVisual || hasTable || hasTool || /"(chart|diagram)"\s*:/.test(raw);
  if (!hasPhoto && String(b.noPhoto ?? '').trim().length < 20) fails.push(`PV-14 ${id}: no real, credited photo (heroImage/image with license or credit) and no brief.noPhoto reason — Rule 58`);
  if (!hasDiagram && String(b.noDiagram ?? '').trim().length < 20) fails.push(`PV-15 ${id}: no produced diagram/data visual and no brief.noDiagram reason — Rule 58`);
  if (b.winningFormat === 'tool' && !hasTool) fails.push(`PV-4 ${id}: top 3 are tools but this page has no "tool" — build the tool or drop the page`);

  if (!b.intentGroup) fails.push(`PV-5 ${id}: brief.intentGroup missing`);
  else {
    pageIntents.push([id, b.intentGroup, p.publishDate]);
    if (intents.has(b.intentGroup)) fails.push(`PV-5 ${id}: same intent "${b.intentGroup}" as ${intents.get(b.intentGroup)} — merge them, one page per intent`);
    else intents.set(b.intentGroup, id);
  }

  const v = b.verified ? new Date(b.verified) : null;
  if (!v || Number.isNaN(+v)) fails.push(`PV-6 ${id}: brief.verified date missing`);
  else {
    const age = Math.round((today - v) / 864e5);
    if (age > MAX_AGE_DAYS) fails.push(`PV-6 ${id}: facts last verified ${age} days ago (limit ${MAX_AGE_DAYS}) — re-check against SOURCES.md`);
  }
}

// PV-8 Interactive first (owner, 2026-10-21): on the owner's sites the interactive page wins — rivalsrandomizer.org
// (a wheel tool) took #1 and 2,304 Google clicks in 28 days while text-guide game sites took 0–17. A project that
// declares package.json "seoGates": { "siteKind": "game" | "tool" | "app" } must ship at least one page with a
// working "tool", and its homepage must carry one.
const KIND = pkg.seoGates?.siteKind;
// A homepage kept in content/home.json (outside content/pages/) declares its tool there (howtomodminecraft.com, 2026-10-29).
try { if (JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'home.json'), 'utf8')).tool != null) toolPages.unshift('home'); } catch {}
if (['game', 'tool', 'app'].includes(KIND)) {
  if (!toolPages.length) fails.push(`PV-8 siteKind "${KIND}": no page ships a "tool" — every game/tool project needs at least one interactive tool (randomizer, calculator, solver, tracker, playable widget)`);
  else if (!toolPages.some((id) => ['', '/', 'home', 'index', '__', 'homepage'].includes(String(id)))) warns.push(`PV-8 siteKind "${KIND}": tools on ${toolPages.slice(0, 3).join(', ')} but none on the homepage — put the main tool above the fold on /`);
} else if (KIND == null) warns.push('PV-8 set package.json seoGates.siteKind ("game" | "tool" | "app" | "content") — game/tool/app sites must ship an interactive tool');

// ---- Site level: value-plan.json (Rule 54h–i) ----------------------------------------------
// A page is worth building only if it answers a job real users were seen asking, with its own
// search demand, and an independent reviewer judged it beats the live top 3. Pages that cannot
// be traced to the plan are the "trash" the owner wants kept off the site.
const planPath = path.join(ROOT, 'value-plan.json');
const isUrl = (u) => /^https?:\/\/[^\s/]+\.[^\s/]+/.test(String(u ?? ''));
if (!fs.existsSync(planPath)) {
  fails.push('PV-9 no value-plan.json — before any page list, research who the site serves and what they need (VALUE-PLAN.md), then derive the pages from it');
} else {
  let plan = null;
  try { plan = JSON.parse(fs.readFileSync(planPath, 'utf8')); } catch (e) { fails.push(`PV-9 value-plan.json: invalid JSON (${e.message})`); }
  if (plan) {
    if (String(plan.audience ?? '').trim().length < 80) fails.push('PV-9 value-plan.json "audience" is missing or under 80 chars — who searches, and what are they trying to get done?');
    const r = plan.researched ? new Date(plan.researched) : null;
    if (!r || Number.isNaN(+r)) fails.push('PV-9 value-plan.json "researched" date missing');
    else if ((today - r) / 864e5 > 365) warns.push(`PV-9 user research is ${Math.round((today - r) / 864e5)} days old — redo it once a year; needs move`);
    const jobs = new Map((Array.isArray(plan.jobs) ? plan.jobs : []).map((j) => [j.id, j]));
    // PV-10: every page answers an evidenced job with its own demand.
    for (const [id, intent] of pageIntents) {
      const j = jobs.get(intent);
      if (!j) { fails.push(`PV-10 ${id}: intent "${intent}" is not a job in value-plan.json — add the user need with its evidence first, or drop the page`); continue; }
      const ev = (j.evidence || []).filter(isUrl);
      const hosts = new Set(ev.map((u) => new URL(u).hostname.replace(/^www\./, '')));
      if (ev.length < 2) fails.push(`PV-10 ${id}: job "${intent}" has ${ev.length}/2 evidence URLs — link real people asking it (threads, PAA, support forum, GSC export)`);
      else if (hosts.size < 2) warns.push(`PV-10 ${id}: job "${intent}" evidence comes from one site only (${[...hosts][0]}) — one community is not demand`);
      if (!j.demand?.keyword || !j.demand?.source) fails.push(`PV-10 ${id}: job "${intent}" has no demand {keyword, source} — a need nobody searches for earns no traffic`);
      if (!['page', 'tool'].includes(j.answer)) fails.push(`PV-10 ${id}: job "${intent}" is planned as "${j.answer}" — only "page" or "tool" jobs get their own URL`);
    }
    // PV-11: the site names what it offers that the SERP lacks.
    const offer = Array.isArray(plan.offer) ? plan.offer.filter((o) => o?.name && o?.why) : [];
    if (!offer.length) fails.push('PV-11 value-plan.json "offer" is empty — name the 1–3 things this site gives users that the current results do not (with why)');
    else if (['game', 'tool', 'app'].includes(pkg.seoGates?.siteKind) && !offer.some((o) => o.type === 'tool')) fails.push('PV-11 the offer has no tool — a game/tool/app site leads with something interactive (Rule 56)');
    // PV-12: an independent reviewer passed each page against the live top 3.
    const rv = plan.review;
    const indep = rv && /independent/i.test(String(rv.reviewer ?? '')) && rv.date;
    const passed = new Set(Array.isArray(rv?.passed) ? rv.passed : []);
    if (!indep) fails.push('PV-12 value-plan.json has no independent review {date, reviewer: "independent value-review agent (not the author)", passed[], cut[]} — a second agent must judge every page against the live top 3');
    else for (const [id] of pageIntents) if (!passed.has(id)) fails.push(`PV-12 ${id}: not in review.passed — the independent reviewer has not judged it better than the top 3 (or cut it)`);
    // PV-13: the AdSense floor is a demand test, never a quota.
    const pageJobs = [...jobs.values()].filter((j) => ['page', 'tool'].includes(j.answer)).length;
    if (pageJobs < MIN_LAUNCH) warns.push(`PV-13 the plan has ${pageJobs} evidenced page/tool jobs (AdSense floor ${MIN_LAUNCH}) — widen the research or side-step (Rule 57); never pad to reach it`);
  }
}

// ---- Competitor level: PV-16 / PV-17 (owner, 2026-10-28) --------------------------------------
// Severity is separate from ENFORCE: see the header. cfails collect here; they FAIL only when COMP_ENFORCE.
const COMPETITOR_RULE_DATE = '2026-10-28';
const cfails = [];
const COMP_SECTIONS_BASE = ['Competitors', 'Feature matrix', 'Strengths and weaknesses', 'Table stakes', 'Differentiators', 'Retention', 'Outrank plan'];
// Owner 2026-11-08: every page-1 competitor (not a top-N subset), new entrants get special attention,
// and the file says what we take from them. Applies to analysis files dated on/after this day.
const COMP_FULL_PAGE1_DATE = '2026-11-08';
const COMP_SECTIONS_NEW = ['New entrants', 'What we can take'];
const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
const vplan = readJson(planPath);
const COMP_MODE = (() => {
  const c = pkg.seoGates?.competitor;
  if (c === 'enforce') return 'enforce';
  if (c === 'warn') return 'warn';
  const born = String(vplan?.created ?? vplan?.researched ?? '').slice(0, 10);
  return ENFORCE && /^\d{4}-\d{2}-\d{2}$/.test(born) && born >= COMPETITOR_RULE_DATE ? 'enforce' : 'warn';
})();
const COMP_ENFORCE = COMP_MODE === 'enforce';
{
  const rdir = path.join(ROOT, 'research');
  const files = fs.existsSync(rdir) ? fs.readdirSync(rdir).filter((f) => /^competitor-analysis-.+\.md$/i.test(f)) : [];
  // Newest first: by the YYYY-MM-DD in the name, else by mtime.
  const stamp = (f) => (f.match(/(\d{4}-\d{2}-\d{2})\.md$/i)?.[1]) ?? new Date(fs.statSync(path.join(rdir, f)).mtimeMs).toISOString().slice(0, 10);
  files.sort((a, b) => stamp(b).localeCompare(stamp(a)));
  if (!files.length) cfails.push('PV-16 no research/competitor-analysis-<keyword>-<date>.md — analyse the top 10 (offer, strengths, weaknesses, table stakes, differentiators, retention, outrank plan) before building: ~/.claude/skills/_shared/value-gates/COMPETITOR-ANALYSIS.md');
  else {
    const f = files[0];
    const fullPage1 = stamp(f) >= COMP_FULL_PAGE1_DATE;
    const COMP_SECTIONS = fullPage1 ? [...COMP_SECTIONS_BASE, ...COMP_SECTIONS_NEW] : COMP_SECTIONS_BASE;
    const md = fs.readFileSync(path.join(rdir, f), 'utf8').replace(/<!--[\s\S]*?-->/g, ''); // template comments are not content
    // Split on level-2 headings; a section matches when its heading starts with the required name.
    const secs = new Map();
    let cur = null;
    for (const line of md.split('\n')) {
      const h = line.match(/^##\s+(.+?)\s*$/);
      if (h) { cur = h[1].toLowerCase(); secs.set(cur, ''); continue; }
      if (cur != null) secs.set(cur, secs.get(cur) + line + '\n');
    }
    const body = (name) => { for (const [k, v] of secs) if (k.startsWith(name.toLowerCase())) return v; return null; };
    const missing = COMP_SECTIONS.filter((n) => body(n) == null);
    if (missing.length) cfails.push(`PV-16 ${f}: missing section(s) ${missing.map((m) => `"## ${m}"`).join(', ')} — template: value-gates/COMPETITOR-ANALYSIS.md`);
    const empty = COMP_SECTIONS.filter((n) => body(n) != null && body(n).replace(/[\s|:\-#*_>]/g, '').length < 40);
    if (empty.length) cfails.push(`PV-16 ${f}: section(s) ${empty.map((m) => `"## ${m}"`).join(', ')} are empty or placeholder (<40 chars)`);
    const comp = body('Competitors');
    if (comp != null) {
    const domains = new Set((comp.match(/\b(?:[a-z0-9-]+\.)+(?:com|org|net|io|co|app|gg|ai|dev|me|info|xyz|uk|de|fr|jp|cn|ru|us|ca|au|tv|site|tools?|so|to|cc|ly|pro|wiki|fandom)\b/gi) ?? []).map((d) => d.toLowerCase().replace(/^www\./, '')));
    if (fullPage1 && domains.size < 8) cfails.push(`PV-16 ${f}: "## Competitors" names ${domains.size} domain(s) — list EVERY page-1 organic result for the primary keyword and each secondary (owner 2026-11-08: never a top-N subset)`);
    else if (domains.size < 5) cfails.push(`PV-16 ${f}: "## Competitors" names ${domains.size} domain(s) — list the top ~10 (≥5) for the primary keyword; a 0-result SERP capture is a failed capture, not an empty SERP`);
    }
    const age = Math.round((today - new Date(stamp(f))) / 864e5);
    if (age > 180) warns.push(`PV-16 ${f} is ${age} days old — re-run it before major feature work and at each GSC review`);
    // The value plan must cite the analysis, and every claimed offer must have been checked against the top 10.
    if (vplan) {
      const cited = String(vplan.competitorAnalysis ?? '');
      if (!cited) cfails.push('PV-16 value-plan.json has no "competitorAnalysis" path — the offer must cite the competitor analysis');
      else if (!fs.existsSync(path.join(ROOT, cited))) cfails.push(`PV-16 value-plan.json "competitorAnalysis" points to ${cited}, which does not exist`);
      const offers = Array.isArray(vplan.offer) ? vplan.offer : [];
      for (const o of offers) if (String(o?.serpCheck ?? '').trim().length < 40) cfails.push(`PV-16 offer "${o?.name ?? '?'}": no "serpCheck" (≥40 chars) — state how it was checked absent from the top 10, or which table stake it matches`);
    }
  }
}
{
  const hp = path.join(ROOT, 'content', 'home.json');
  if (fs.existsSync(hp)) {
    const h = readJson(hp);
    if (!h) cfails.push('PV-17 content/home.json: invalid JSON');
    else {
      const aw = words(Array.isArray(h.answer) ? h.answer.join(' ') : h.answer);
      if (aw < 15 || aw > 90) cfails.push(`PV-17 homepage: "answer" is ${aw} words — need a 15–90 word direct answer to the primary keyword above the fold`);
      const hb = h.brief;
      const top = Array.isArray(hb?.serpTop3) ? hb.serpTop3.filter((r) => isUrl(r?.url) && r?.format) : [];
      if (!hb || typeof hb !== 'object') cfails.push('PV-17 homepage: no "brief" — the primary keyword needs a SERP brief like every page (serpTop3, winningFormat, infoGain)');
      else {
        if (top.length < 3) cfails.push(`PV-17 homepage: brief.serpTop3 lists ${top.length}/3 ranking pages with url+format — if the SERP capture returned 0 results, re-capture it`);
        if (!hb.winningFormat) cfails.push('PV-17 homepage: brief.winningFormat missing');
        if (String(hb.infoGain ?? '').trim().length < 80) cfails.push('PV-17 homepage: brief.infoGain missing or under 80 chars — what does our homepage/tool give that the top 3 do not?');
      }
      // The independent reviewer judges the homepage/tool against the top competitors' products too (VALUE-PLAN.md step 6).
      if (vplan?.review && vplan.review.home?.passed !== true) cfails.push(`PV-17 homepage: value-plan.json review.home is ${vplan.review.home ? 'not passed (' + String(vplan.review.home.why ?? '').slice(0, 80) + ')' : 'missing'} — the independent reviewer must judge the homepage/tool against the top 5 products (table stakes, differentiators, retention)`);
    }
  }
}

// Launch velocity. The launch batch may hold the AdSense floor (20–30 pages) when every page
// passed PV-1…12; that is what the gates above are for. After launch, a burst of new pages in a
// week is the scaled-content footprint: warn, and justify it in HANDOVER.md.
dates.sort();
const launch = dates[0];
const atLaunch = dates.filter((d) => (new Date(d) - new Date(launch)) / 864e5 < 7).length;
if (launch && atLaunch > MAX_LAUNCH) warns.push(`PV-7 ${atLaunch} pages in the launch week from ${launch} (ceiling ${MAX_LAUNCH}) — launch the strongest ${MAX_LAUNCH}, drip the rest`);
for (let i = 0; i < dates.length; i++) {
  const start = new Date(dates[i]);
  if ((start - new Date(launch)) / 864e5 < 7) continue; // the launch batch is judged above
  const n = dates.filter((d) => { const x = new Date(d); return x >= start && (x - start) / 864e5 < 7; }).length;
  if (n > MAX_NEW_PER_WEEK) { warns.push(`PV-7 ${n} pages publish in the 7 days from ${dates[i]} (guide after launch: ≤${MAX_NEW_PER_WEEK}) — justify in HANDOVER.md or spread them`); break; }
}

console.log(`\nPage-value gate (Rule 54) — ${ROOT}  [${ENFORCE ? 'ENFORCE' : 'WARN-ONLY: set package.json seoGates.value = "enforce"'}]`);
console.log('-'.repeat(64));
for (const w of warns) console.log(`WARN  ${w}`);
for (const f of fails) console.log(`${ENFORCE ? 'FAIL' : 'WARN'}  ${f}`);
for (const f of cfails) console.log(`${COMP_ENFORCE ? 'FAIL' : 'WARN'}  ${f}`);
if (!fails.length) console.log('PASS  every page answers an evidenced user job, beats its SERP brief (independently reviewed), ships an asset, holds one intent and has fresh facts.');
if (!cfails.length) console.log('PASS  competitor analysis present and cited; homepage carries its SERP brief.');
else if (!COMP_ENFORCE) console.log(`      PV-16/17 warn-only here (competitor gate: ${COMP_MODE}) — set seoGates.competitor = "enforce" once retrofitted`);
console.log('-'.repeat(64));
const nFail = (ENFORCE ? fails.length : 0) + (COMP_ENFORCE ? cfails.length : 0);
if (nFail) { console.log(`${nFail} failure(s). fix: see Rule 54 in ~/.claude/CLAUDE.md and value-gates/COMPETITOR-ANALYSIS.md`); process.exit(1); }
const nWarn = (ENFORCE ? 0 : fails.length) + (COMP_ENFORCE ? 0 : cfails.length);
if (nWarn) console.log(`${nWarn} finding(s) not enforced on this project.`);
