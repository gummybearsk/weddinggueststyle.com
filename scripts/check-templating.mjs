#!/usr/bin/env node
/**
 * Anti-templating gate (global Rules 21 / 35 / 63). Shared; installed by install-seo-gates.mjs.
 *
 * ONE run per build covers the WHOLE site, so templating cannot creep in batch by batch:
 *   - every page vs every other page (live + scheduled), never only the new batch;
 *   - site-wide variety: no single intro style / section count / FAQ count / heading pattern /
 *     format may dominate the site, even when no single pair is too close;
 *   - clusters: a page that resembles too many others is a template hub;
 *   - a ratchet: templating-baseline.json keeps the site's best variety; if the average
 *     similarity creeps up past it (each batch "fine", the sum templated), the build fails.
 *
 * Readers (no format is skipped):
 *   1. JSON page files anywhere under content/ or data/ (any schema: sections | contentSections |
 *      blocks …, body | content | html | text, faqs with question | q, intro, answer);
 *   2. Markdown / MDX with front matter under content/, posts/, src/content/;
 *   3. the rendered HTML of the build (.next/server/app/**.html, out/, dist/, build/) — reads what
 *      actually ships, including pages whose content lives in .tsx code. Page chrome (headings or
 *      paragraphs that repeat on most pages) is removed dynamically before comparing.
 * Source pages that are not rendered yet (scheduled) are merged with the rendered set by slug.
 *
 * Severity: FAIL (exit 1) under package.json "seoGates": { "templating": "enforce" }, else WARN.
 * Wire it as `postbuild` (one run, after the HTML exists). npm fails the build on a non-zero postbuild.
 *   node scripts/check-templating.mjs [projectDir] [--json] [--no-ratchet] [--update-baseline]
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const ROOT = path.resolve(argv.find((a) => !a.startsWith("--")) ?? ".");
const JSON_OUT = argv.includes("--json");
const NO_RATCHET = argv.includes("--no-ratchet");
const FORCE_BASELINE = argv.includes("--update-baseline");
const ON_CI = !!(process.env.VERCEL || process.env.CI);
let pkg = {};
try { pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")); } catch {}
// Owner-protected sites (owner-exempt.json next to the shared copy): report only, never fail, never
// ask for changes. Matched by the project folder name, case-insensitive.
let EXEMPT = false;
try {
  const ex = JSON.parse(fs.readFileSync(path.join(process.env.HOME ?? "", ".claude/skills/_shared/templating/owner-exempt.json"), "utf8"));
  EXEMPT = (ex.domains ?? []).some((d) => path.basename(ROOT).toLowerCase() === d.toLowerCase());
} catch {}
const ENFORCE = !EXEMPT && pkg.seoGates?.templating === "enforce";
const today = new Date().toISOString().slice(0, 10);

// ---------- text helpers ----------
const strip = (h) => String(h ?? "").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();
const words = (s) => (strip(s).match(/\S+/g) ?? []).length;
const mdToHtmlish = (md) =>
  String(md ?? "")
    .replace(/^\|.*\|\s*\n\|[\s:|-]+\|\s*$/gm, "<table>") // markdown table header + rule
    .replace(/^(\s*[-*+]\s+.+\n?)+/gm, "<ul></ul>")
    .replace(/^(\s*\d+[.)]\s+.+\n?)+/gm, "<ol></ol>");

function headingShape(h) {
  const t = strip(h);
  const first = (t.split(/\s+/)[0] ?? "").toLowerCase().replace(/[^a-z0-9$]/g, "");
  const kind = /\?$/.test(t) ? "Q" : /^\d/.test(t) ? "N" : /:/.test(t) ? "C" : "S";
  return `${kind}:${first}`;
}
function introStyle(intro, keyword) {
  const first = strip(intro).split(/(?<=[.?!])\s/)[0] ?? "";
  const kw = String(keyword ?? "").toLowerCase();
  if (!first) return null;
  if (/\?$/.test(first)) return "question";
  if (kw && first.toLowerCase().startsWith(kw)) return "keyword-first";
  if (/\$|\d/.test(first.slice(0, 60))) return "data-open";
  if (/^(if|when|you|your|imagine|picture)\b/i.test(first)) return "scene";
  if (/\b(is|are|means|refers to)\b/i.test(first.split(/\s+/).slice(0, 8).join(" "))) return "definition";
  return "statement";
}
function formatSig(body) {
  const t = (body.match(/<table/gi) ?? []).length;
  const l = (body.match(/<(ul|ol)\b/gi) ?? []).length;
  return `T${Math.min(t, 2)}L${l === 0 ? 0 : l <= 2 ? 1 : 2}`;
}

// A field may be a string, an array of paragraphs, or an object with text inside.
const textOf = (v) => (typeof v === "string" ? v : Array.isArray(v) ? v.map(textOf).join("\n\n") : v && typeof v === "object" ? textOf(v.text ?? v.body ?? v.html ?? v.content ?? Object.values(v).filter((x) => typeof x === "string").join(" ")) : "");

// Trust and utility pages are not articles; comparing "about" with "contact" is noise.
const NON_ARTICLE = /(^|\/)(about|contact|privacy|privacy-policy|terms|terms-of-service|terms-of-use|disclaimer|disclosure|affiliate-disclosure|editorial|editorial-policy|editorial-process|editorial-standards|about-editorial-standards|image-credits|photo-credits|sources|cookie-policy|accessibility|authors?(\/.*)?|sitemap|search|404)$/i;

// ---------- reader 1: JSON pages (any schema) ----------
const SECTION_KEYS = ["contentSections", "sections", "blocks", "body_sections", "content"];
const BODY_KEYS = ["body", "content", "html", "text", "markdown"];
function asPage(o, file) {
  if (!o || typeof o !== "object" || Array.isArray(o)) return null;
  const secKey = SECTION_KEYS.find((k) => Array.isArray(o[k]) && o[k].some((s) => s && typeof s === "object" && (s.heading || s.title)));
  if (!secKey) return null;
  const secs = o[secKey].filter((s) => s && typeof s === "object");
  const bodyOf = (s) => {
    // Section text may be a string or an array of paragraphs (thebootyard/pickleandspin schema, 2026-11-09).
    const k = BODY_KEYS.find((x) => typeof s[x] === "string" || (Array.isArray(s[x]) && s[x].every((y) => typeof y === "string")));
    let b = k ? (Array.isArray(s[k]) ? s[k].map((y) => `<p>${y}</p>`).join("") : s[k]) : "";
    if (Array.isArray(s.items)) b += s.items.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" ");
    if (s.table || s.rows) b += "<table>";
    if (Array.isArray(s.list) || Array.isArray(s.list?.items) || Array.isArray(s.bullets) || Array.isArray(s.steps)) b += "<ul>";
    return /<[a-z]/i.test(b) ? b : mdToHtmlish(b);
  };
  const faqs = (o.faqs ?? o.faq ?? o.questions ?? []).filter?.((f) => f && (f.question || f.q)) ?? [];
  const slug = o.slug ?? o.path ?? path.basename(file, ".json");
  return {
    id: String(slug).replace(/^\/+/, ""),
    source: path.relative(ROOT, file),
    publish: String(o.publishDate ?? o.date ?? o.publishedAt ?? ""),
    keyword: o.keyword ?? o.targetKeyword ?? o.h1 ?? o.title ?? "",
    intro: textOf(o.intro ?? o.lead ?? o.summary ?? o.excerpt ?? ""),
    answer: textOf(o.answer ?? o.quickAnswer ?? ""),
    headings: secs.map((s) => s.heading ?? s.title ?? ""),
    faqs: faqs.length,
    body: textOf(o.intro ?? "") + secs.map(bodyOf).join(" "),
  };
}
function readJsonPages() {
  const out = [];
  const roots = ["content", "data", "src/content"].map((d) => path.join(ROOT, d)).filter((d) => fs.existsSync(d));
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) { if (!/node_modules|\.next/.test(f)) walk(f); continue; }
      if (!e.name.endsWith(".json")) continue;
      let j;
      try { j = JSON.parse(fs.readFileSync(f, "utf8")); } catch { continue; }
      const cands = Array.isArray(j) ? j : [j, ...(typeof j === "object" ? Object.values(j).filter((v) => v && typeof v === "object" && !Array.isArray(v)) : [])];
      for (const c of cands) { const p = asPage(c, f); if (p) out.push(p); }
    }
  };
  roots.forEach(walk);
  return out;
}

// ---------- reader 2: Markdown / MDX ----------
function parseFrontMatter(src) {
  const m = src.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!m) return [{}, src];
  const fm = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  fm._faqCount = (m[1].match(/^\s*-\s*(question|q):/gim) ?? []).length;
  return [fm, src.slice(m[0].length)];
}
function readMarkdownPages() {
  const out = [];
  const roots = ["content", "posts", "src/content", "data"].map((d) => path.join(ROOT, d)).filter((d) => fs.existsSync(d));
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) { walk(f); continue; }
      if (!/\.(md|mdx)$/.test(e.name) || /^readme|^agent_spec|^changelog/i.test(e.name)) continue;
      const [fm, body] = parseFrontMatter(fs.readFileSync(f, "utf8"));
      const hs = [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
      if (hs.length < 2) continue; // not an article
      const faqIdx = hs.findIndex((h) => /faq|frequently asked/i.test(h));
      const faqs = fm._faqCount || (faqIdx >= 0 ? (body.split(/^##\s+.*(faq|frequently asked).*$/im)[2] ?? "").match(/^###\s+/gm)?.length ?? 0 : 0);
      const firstPara = (body.split(/\n\s*\n/).find((b) => !/^\s*(#|import |export |<|\||[-*] )/.test(b) && words(b) >= 12) ?? "");
      out.push({
        id: fm.slug ?? path.basename(f).replace(/\.(md|mdx)$/, ""),
        source: path.relative(ROOT, f),
        publish: String(fm.publishDate ?? fm.date ?? fm.publishedAt ?? ""),
        keyword: fm.keyword ?? fm.targetKeyword ?? fm.title ?? "",
        intro: firstPara,
        answer: fm.answer ?? "",
        headings: hs.filter((_, i) => i !== faqIdx),
        faqs,
        body: mdToHtmlish(body) + body,
      });
    }
  };
  roots.forEach(walk);
  return out;
}

// ---------- reader 3: rendered HTML of the build ----------
function readRenderedPages() {
  const dirs = [".next/server/app", "out", "dist", "build"].map((d) => path.join(ROOT, d)).filter((d) => fs.existsSync(d));
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) { if (!/(^|\/)(api|_next|static|chunks)(\/|$)/.test(f)) walk(f); continue; }
      if (e.name.endsWith(".html") && !/^(_not-found|404|500|_error)/.test(e.name)) files.push(f);
    }
  };
  dirs.forEach(walk);
  const pages = [];
  for (const f of files) {
    const html = fs.readFileSync(f, "utf8");
    if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) continue;
    const inMain = html.match(/<main[\s\S]*?<\/main>/i);
    let main = (inMain ?? html.match(/<article[\s\S]*?<\/article>/i) ?? [html])[0];
    // A <header> inside <main> is the article's own header (H1 + intro), not site chrome:
    // stripping it hid the intro of every page that uses one (energypips /pips-game, 2026-11-08).
    main = main.replace(inMain ? /<(nav|aside|footer|form|script|style)\b[\s\S]*?<\/\1>/gi : /<(nav|aside|footer|header|form|script|style)\b[\s\S]*?<\/\1>/gi, " ");
    const h1 = strip((main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ?? [])[1] ?? "");
    const hs = [...main.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => strip(m[1]));
    if (hs.length < 2) continue; // tools, trust pages and listings are not articles
    const afterH1 = main.split(/<\/h1>/i)[1] ?? main;
    const paras = [...afterH1.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => m[1]).filter((p) => words(p) >= 15);
    let faqs = 0;
    for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
      // Read nodes inside "@graph" too: a page whose FAQPage sits in a graph (forsakenhub tool pages,
      // 2026-11-09) has visible FAQs and valid schema, and was miscounted as 0 FAQs.
      try { const j = JSON.parse(m[1]); for (const x of [j].flat().flatMap((n) => [n, ...(Array.isArray(n?.["@graph"]) ? n["@graph"] : [])])) if (x?.["@type"] === "FAQPage") faqs = (x.mainEntity ?? []).length; } catch {}
    }
    const rel = path.relative(dirs.find((d) => f.startsWith(d)) ?? ROOT, f).replace(/(\/index)?\.html$/, "");
    pages.push({ id: rel || "home", source: path.relative(ROOT, f), publish: "", keyword: h1, intro: paras[0] ?? "", answer: "", headings: hs, faqs, body: main, rendered: true, paras });
  }
  // Dynamic chrome removal: a heading or paragraph on most pages is site furniture, not structure.
  if (pages.length >= 5) {
    const freq = new Map();
    const bump = (k) => freq.set(k, (freq.get(k) ?? 0) + 1);
    for (const p of pages) new Set([...p.headings, ...p.paras.map(strip)]).forEach(bump);
    const chrome = (k) => (freq.get(k) ?? 0) / pages.length > 0.5;
    for (const p of pages) {
      p.headings = p.headings.filter((h) => !chrome(h) && !/frequently asked|^faq/i.test(h));
      p.intro = p.paras.find((x) => !chrome(strip(x))) ?? "";
    }
  }
  return pages;
}

// ---------- assemble one set ----------
const source = [...readJsonPages(), ...readMarkdownPages()];
const rendered = readRenderedPages();
// Source files are the more exact reading (real intro/answer fields, and they include scheduled
// pages); the rendered HTML adds every shipped page that has no source file (content in .tsx, etc.).
const byId = new Map();
for (const p of source) byId.set(p.id.split("/").pop(), p);
for (const p of rendered) { const k = p.id.split("/").pop(); if (!byId.has(k)) byId.set(k, p); }
const pages = [...byId.values()].filter((p) => p.headings.length >= 2 && !NON_ARTICLE.test(p.id));

if (pages.length < 2) {
  const why = !source.length && !rendered.length ? "found no article pages in content/, data/, posts/ or the build output — run it after `next build` (postbuild)" : "fewer than 2 article pages";
  console.log(`${pages.length || source.length || rendered.length ? "PASS" : "WARN"}  templating: ${why}`);
  process.exit(0);
}

const bucket = (n, size) => Math.floor(n / size);
const sk = pages.map((p) => {
  const shapes = p.headings.map(headingShape);
  return {
    slug: p.id, from: p.rendered ? "html" : "source", scheduled: p.publish > today,
    sections: p.headings.length, faqs: p.faqs, shapes,
    shapeKinds: shapes.map((s) => s[0]).join(""),
    intro: introStyle(p.intro, p.keyword),
    format: formatSig(p.body),
    answerLen: p.answer ? bucket(words(p.answer), 10) : null,
    answerOpen: p.answer ? strip(p.answer).split(/\s+/).slice(0, 2).join(" ").toLowerCase() : "",
  };
});

// ---------- 1. every pair ----------
function sim(a, b) {
  let m = 0, n = 0;
  const f = (eq) => { n++; if (eq) m++; };
  f(a.sections === b.sections);
  f(a.faqs === b.faqs);
  const common = a.shapes.filter((s) => b.shapes.includes(s)).length;
  f(common / Math.max(a.shapes.length, b.shapes.length, 1) > 0.3 || a.shapeKinds === b.shapeKinds);
  if (a.intro !== null && b.intro !== null) f(a.intro === b.intro);
  f(a.format === b.format);
  if (a.answerLen !== null && b.answerLen !== null) f(a.answerLen === b.answerLen);
  return m / n;
}
const pairs = [];
let simSum = 0, simN = 0;
const neighbors = new Map(sk.map((s) => [s.slug, 0]));
for (let i = 0; i < sk.length; i++) for (let j = i + 1; j < sk.length; j++) {
  const s = sim(sk[i], sk[j]);
  simSum += s; simN++;
  if (s >= 0.66) { neighbors.set(sk[i].slug, neighbors.get(sk[i].slug) + 1); neighbors.set(sk[j].slug, neighbors.get(sk[j].slug) + 1); }
  if (s > 0.5) pairs.push([sk[i].slug, sk[j].slug, Math.round(s * 100)]);
}
const meanSim = simSum / simN;
// Owner rule (2026-11-13): a templating failure is fixed on pages NOT YET PUBLISHED only. Published pages
// are never rewritten to pass this gate, so a finding that only live pages cause is reported (WARN) and
// never blocks the build. "Fixable" = scheduled (publishDate in the future) or dated today and new since
// the baseline (written in this session, not yet crawled).
let baseIds = null;
try { const b0 = JSON.parse(fs.readFileSync(path.join(ROOT, "templating-baseline.json"), "utf8")); if (Array.isArray(b0?.ids)) baseIds = new Set(b0.ids); } catch {}
const pubOf = new Map(pages.map((p) => [p.id, p.publish || ""]));
const fixable = new Set(sk.filter((x) => x.scheduled || (pubOf.get(x.slug)?.slice(0, 10) === today && baseIds && !baseIds.has(x.slug))).map((x) => x.slug));
const findings = []; // { msg, fix: [slugs we may change] }
const F = (msg, fix) => findings.push({ msg, fix: [...new Set(fix)].filter((x) => fixable.has(x)) });
const hard = pairs.filter((p) => p[2] >= 83);
if (hard.length) F(`${hard.length} page pair(s) share >= 83% of their skeleton: ${hard.slice(0, 5).map((p) => `${p[0]} ~ ${p[1]}`).join("; ")}`, hard.flatMap((p) => [p[0], p[1]]));

// ---------- 2. site-wide variety (dynamic limits) ----------
const N = sk.length;
const dist = (k) => Object.entries(sk.reduce((o, x) => { const v = x[k]; if (v !== null && v !== "") o[v] = (o[v] ?? 0) + 1; return o; }, {})).sort((a, b) => b[1] - a[1]);
// limit = how dominant one value may be; looser for coarse features with few possible values
const LIMITS = { intro: 0.45, sections: 0.3, faqs: 0.3, shapeKinds: 0.3, format: 0.6, answerLen: 0.4, answerOpen: 0.15 };
if (N >= 8) for (const [k, lim] of Object.entries(LIMITS)) {
  const d = dist(k); const total = d.reduce((a, [, n]) => a + n, 0);
  if (!d.length || total < 8) continue;
  const share = d[0][1] / total;
  if (share > lim) F(`site-wide: ${Math.round(share * 100)}% of pages share ${k} = "${d[0][0]}" (limit ${Math.round(lim * 100)}%)`, sk.filter((x) => String(x[k]) === String(d[0][0])).map((x) => x.slug));
}

// ---------- 3. clusters ----------
const hubLimit = Math.max(5, Math.ceil(N * 0.15));
const hubs = [...neighbors.entries()].filter(([, c]) => c >= hubLimit).sort((a, b) => b[1] - a[1]);
if (hubs.length) F(`cluster: ${hubs.length} page(s) resemble >= ${hubLimit} others at >= 67% (e.g. ${hubs.slice(0, 3).map(([s, c]) => `${s} ~ ${c} pages`).join(", ")})`, hubs.map(([s]) => s));

// ---------- 3b. pages added since the baseline: do they converge? ----------
// The baseline only moves when site-wide variety improves, so this group accumulates batch A + B + C
// until then: batches that each pass on their own, but share one skeleton together, are caught here.
const BASE = path.join(ROOT, "templating-baseline.json");
let base = null;
try { base = JSON.parse(fs.readFileSync(BASE, "utf8")); } catch {}
let cohort = [];
let cohortLabel = "";
if (Array.isArray(base?.ids) && base.ids.length) {
  const known = new Set(base.ids);
  cohort = sk.filter((x) => !known.has(x.slug));
  cohortLabel = `${cohort.length} page(s) added since the baseline of ${base.updated}`;
} else {
  const dated = sk.map((x, i) => ({ x, d: pages[i].publish || "" })).filter((o) => /^\d{4}-\d{2}-\d{2}/.test(o.d) && o.d <= today).sort((a, b) => (a.d < b.d ? 1 : -1));
  const K = Math.max(8, Math.ceil(N * 0.15));
  if (dated.length >= K * 2) { cohort = dated.slice(0, K).map((o) => o.x); cohortLabel = `newest ${K} published pages (from ${dated[K - 1].d})`; }
}
let cohortMean = null;
if (cohort.length >= 5) {
  let cs = 0, cn = 0;
  for (let i = 0; i < cohort.length; i++) for (let j = i + 1; j < cohort.length; j++) { cs += sim(cohort[i], cohort[j]); cn++; }
  cohortMean = cs / cn;
  const ref = base?.meanSim ?? meanSim;
  if (cohortMean > ref + 0.15)
    F(`${cohortLabel} are ${(cohortMean * 100).toFixed(0)}% alike with each other vs ${(ref * 100).toFixed(0)}% for the site — together they share one skeleton: ${cohort.slice(0, 4).map((c) => c.slug).join(", ")}…`, cohort.map((c) => c.slug));
}

// ---------- 4. ratchet against drift ----------
const TOL = 0.04;
if (!NO_RATCHET && base?.meanSim != null && meanSim > base.meanSim + TOL)
  F(`drift: average page similarity is ${(meanSim * 100).toFixed(1)}%, up from the site's baseline ${(base.meanSim * 100).toFixed(1)}% (allowed +${TOL * 100} points) — recent pages are converging on one skeleton`, sk.map((x) => x.slug));
const improved = !base || meanSim < base.meanSim;
// New pages join the baseline only after they were judged as a group (>= 5) and came out clearly
// varied; a small batch waits and is judged together with the next one, so batches cannot slip in
// one at a time.
const cohortCleared = cohort.length === 0 || (cohortMean !== null && cohortMean <= (base?.meanSim ?? meanSim) + 0.1);
if (!ON_CI && !NO_RATCHET && !findings.length && cohortCleared && (improved || FORCE_BASELINE)) {
  fs.writeFileSync(BASE, JSON.stringify({ meanSim: +meanSim.toFixed(4), pages: N, updated: today, ids: sk.map((x) => x.slug).sort(), note: "Written by check-templating.mjs when site-wide variety improves. Commit it: CI builds compare against it and never write it." }, null, 1) + "\n");
}

// ---------- report ----------
if (JSON_OUT) { console.log(JSON.stringify({ pages: N, meanSim, findings, fixable: [...fixable], pairs, sk }, null, 1)); process.exit(0); }
const srcCount = sk.filter((s) => s.from === "source").length;
console.log(`templating: ${N} pages (${N - srcCount} rendered, ${srcCount} from source${sk.some((s) => s.scheduled) ? `, ${sk.filter((s) => s.scheduled).length} scheduled` : ""}); average similarity ${(meanSim * 100).toFixed(1)}%${base ? ` (baseline ${(base.meanSim * 100).toFixed(1)}%)` : ""}`);
for (const k of ["intro", "sections", "faqs", "format", "answerLen"]) console.log(`  ${k}: ${dist(k).slice(0, 6).map(([v, n]) => `${v}×${n}`).join("  ")}`);
if (!findings.length) { console.log("PASS  templating: no near-duplicate pairs, no dominant skeleton, no template cluster, no drift"); process.exit(0); }
if (EXEMPT) {
  for (const f of findings) console.log(`INFO  templating: ${f.msg}`);
  console.log("      owner-protected site (owner-exempt.json): report only, do not de-template");
  process.exit(0);
}
const blocking = findings.filter((f) => f.fix.length);
for (const f of findings.filter((f) => !f.fix.length))
  console.log(`WARN  templating: ${f.msg}\n      caused by published pages only: leave them as they are (owner 2026-11-13: never rewrite live pages for this gate); report it, it does not block the build`);
for (const f of blocking)
  console.log(`${ENFORCE ? "FAIL" : "WARN"}  templating: ${f.msg}\n      change ONLY these unpublished page(s): ${f.fix.slice(0, 12).join(", ")}${f.fix.length > 12 ? ` (+${f.fix.length - 12} more)` : ""}`);
if (blocking.length) console.log("      fix: vary intro style, answer length, question headings, section/FAQ counts or format on the unpublished pages listed (Rule 35). Never edit a published page to pass this gate.");
process.exit(ENFORCE && blocking.length ? 1 : 0);
