# SOURCES.md — weddinggueststyle.com source register

Created 2026-09-11. Read this before drafting or editing any page (global rule 44).
A hedge is not a source. If you cannot name the row below a number came from, the
number does not go on the page — in text, in a table, or in an image.

## Topic

Wedding guest attire: dress codes, colours, silhouettes, seasons, venues, body types,
and the Amazon products the site merchandises against them.

## Authoritative sources

| # | Source | Why it qualifies | Fetch recipe | Last read |
|---|---|---|---|---|
| S1 | **Amazon Product Advertising / Creators API** | Primary party. The merchant is accountable for its own price, availability, brand, and image. Associates Operating Agreement *requires* displayed prices come from here. | `node scripts/refresh-amazon.js` → `content/amazon-data.json` (carries `fetchedAt`) | 2026-09-11 (see file stamp) |
| S2 | **The site's own Bing Webmaster + Google Search Console exports** | Primary party (the search engines' own measurement of this domain). Only valid source for any claim about what this site ranks for. | `GSC & Webmaster/<stem> GSC-Webmaster <date>/` — totals from `Totals.csv` only, per rule 43 | 2026-09-11 |
| S3 | **Etiquette authorities for dress-code definitions** — Emily Post Institute (emilypost.com), Debrett's (debretts.com) | Established, named, accountable bodies that publish the formal-wear conventions themselves; the recognised outbound authority for this niche (rule 29). | Direct page fetch; cite page title + read date | — |
| S4 | **Author's own wear-testing and photography** | Experience signal (rule 22) — the only class of claim AI cannot fabricate. Sukie Gao's own measurements, fit notes, dated anecdotes, original photos. | Author-supplied | — |

## Rejected as sources

SEO aggregators; AI summaries; other fashion blogs restating each other; Pinterest;
retailer marketing copy; **and any keyword-volume figure that is not traceable to a
named tool export held in this repo.**

## Does-not-exist list — vocabulary that must NOT appear as fact

These are borrowed from adjacent niches or from generic templates and have no
authoritative source for this site. Allowed only inside an explicit negation or a
clearly-attributed quote.

- **Search-volume claims in body copy** — "with 2,900 monthly searches", "X searches
  per month". The site holds no licensed volume dataset. Its only measured demand
  data is S2 (impressions), which is *this site's* impressions, not market volume.
  **Currently present on some published pages and must be removed — see audit.**
- **Star ratings and review counts from Amazon.** `customerReviews` returns undefined
  from the Creators API; Amazon no longer serves this. Any rating shown would be
  scraped, not sourced (global rule 37).
- **Invented trend statistics** — "68% of guests choose…", "the most popular colour of
  2026 is…" — unless traceable to S3 or a named published survey.
- **Self-contradicting product counts** — a page must not say "47 picks" in one
  sentence and "95 dresses" in the next. Count the `products` array.
- **Fabricated author credentials.** Sukie Gao is the site's real author; do not
  invent degrees, awards, or institutional affiliations.

## Price and availability rules

Prices come only from S1, refresh at least every 24h, and every product grid carries
the visible disclosure: *"Product prices and availability are accurate as of &lt;date&gt;
and are subject to change."* (global rule 37).
