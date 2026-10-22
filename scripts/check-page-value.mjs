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
 * Mode: package.json "seoGates": { "value": "enforce" } fails the build (exit 1).
 * Anything else prints a loud WARN and passes, so installing on an old project
 * does not break its deploys. /new-site and /quick-site set "enforce".
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] ?? '.');
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

  const hasImage = /\.(png|webp|jpe?g|svg|avif)\b/i.test(raw);
  const hasTool = p.tool != null;
  if (hasTool) toolPages.push(id);
  const hasTable = /"table"\s*:\s*\{/.test(raw) || /"table"\s*:\s*\[/.test(raw);
  // Produced diagrams declared as data (weddinggueststyle.com "guide" pages, 2026-10-22):
  // heroVisual / section visual with a chart or table kind, rendered in code from sourced values.
  const visuals = [p.heroVisual, ...(p.contentSections ?? []).map((s) => s?.visual)].filter(Boolean);
  const hasVisual = visuals.some((v) => ['ladder', 'wearAvoid', 'compare', 'bars', 'verdict', 'chart', 'diagram'].includes(v?.kind) && String(v?.caption ?? '').length > 20);
  if (!hasImage && !hasTool && !hasTable && !hasVisual) fails.push(`PV-4 ${id}: ships no asset (no image, tool or data table) — text alone does not beat the SERP`);
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
if (!fails.length) console.log('PASS  every page answers an evidenced user job, beats its SERP brief (independently reviewed), ships an asset, holds one intent and has fresh facts.');
console.log('-'.repeat(64));
if (fails.length && ENFORCE) { console.log(`${fails.length} failure(s). fix: see Rule 54 in ~/.claude/CLAUDE.md`); process.exit(1); }
if (fails.length) console.log(`${fails.length} finding(s) not enforced on this project.`);
