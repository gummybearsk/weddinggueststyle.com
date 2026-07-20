/**
 * Rule 35 gate — structural anti-templating audit.
 *
 * Google's scaled-content-abuse classifier reads the CONTENT skeleton, not the CSS. This
 * site shipped 55 of 103 pages on an identical "8 sections + 10 FAQs" shape; lib/layoutVariant.ts
 * varies presentation only, which does not help.
 *
 * A page's skeleton here is (sectionCount, faqCount, introLengthBucket). Reports the most
 * crowded skeletons and the share of the site sitting on them.
 *
 * Usage:
 *   node scripts/check-templating.mjs            # report
 *   node scripts/check-templating.mjs --strict   # exit 1 if any skeleton exceeds the cap
 */

import fs from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "content", "pages");
const CAP = 0.3; // no single skeleton may hold more than 30% of pages

const strict = process.argv.includes("--strict");

function introBucket(intro) {
  const w = String(intro || "").split(/\s+/).filter(Boolean).length;
  if (w < 60) return "short";
  if (w < 120) return "medium";
  if (w < 180) return "long";
  return "essay";
}

const pages = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => {
    const j = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
    return {
      slug: j.slug || f.replace(/\.json$/, ""),
      sections: (j.contentSections || []).length,
      faqs: (j.faqs || []).length,
      intro: introBucket(j.intro),
    };
  });

const groups = new Map();
for (const p of pages) {
  const key = `${p.sections}s / ${p.faqs}q / ${p.intro} intro`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(p.slug);
}

const sorted = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
const total = pages.length;

console.log(`\nStructural skeletons across ${total} pages — ${groups.size} distinct shapes\n`);
for (const [key, slugs] of sorted.slice(0, 12)) {
  const pct = (slugs.length / total) * 100;
  const flag = pct > CAP * 100 ? " ← OVER CAP" : "";
  console.log(`  ${String(slugs.length).padStart(3)}  (${pct.toFixed(1).padStart(5)}%)  ${key}${flag}`);
}

const worst = sorted[0];
const worstPct = worst[1].length / total;
console.log(
  `\nLargest cluster: ${worst[1].length}/${total} (${(worstPct * 100).toFixed(1)}%) on "${worst[0]}"`
);
console.log(`Cap: ${CAP * 100}%\n`);

if (worstPct > CAP) {
  console.log("Pages in the largest cluster (de-template some of these):");
  for (const s of worst[1].slice(0, 20)) console.log(`  ${s}`);
  if (worst[1].length > 20) console.log(`  … and ${worst[1].length - 20} more`);
  console.log();
  if (strict) {
    console.error(`✕ Rule 35 FAILED — ${(worstPct * 100).toFixed(1)}% of pages share one skeleton.`);
    process.exit(1);
  }
}

console.log(worstPct > CAP ? "⚠ Over cap (reporting only)." : "✓ Rule 35 passed.");
