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
| S3 | **Emily Post Institute — *Attire Guide: Dress Codes from Casual to White Tie Formal*** — emilypost.com/advice/attire-guide-dress-codes-from-casual-to-white-tie | Established, named, accountable etiquette body that publishes the conventions itself (rule 29). Lists garments per code for women and men. Cited in `sources` on 11 pages and in Further Reading. | WebFetch works | 2026-09-24 (200) |
| S3b | **Emily Post Institute — *Wedding Guest Attire: What to Wear to a Wedding*** — emilypost.com/advice/wedding-guest-attire | Same authority; guest-specific guidance. Cited in `sources` on 6 pages and in Further Reading. | curl 200 | 2026-09-24 (200) |
| S3c | **Emily Post Institute — *Complete Guide to Wedding Etiquette*** — emilypost.com/advice/wedding-etiquette | Same authority; general wedding etiquette. Further Reading only. | curl 200 | 2026-09-24 (200) |
| S5 | **Wikipedia — *Black tie*** and ***Western dress codes*** — en.wikipedia.org/wiki/Black_tie, /wiki/Western_dress_codes | Community reference with edit history and citation markers (tier 3). Further Reading only — never the sole source for a claim in body copy. | curl 200 | 2026-09-24 (200) |
| S6 | **Pantone — Color of the Year** — pantone.com/color-of-the-year (redirects to the current year; 2026 = "Cloud Dancer", PANTONE 11-4201) | Primary party for its own colour announcement. Further Reading on colour pages only; no page may claim a colour is "the colour of the year" unless it matches this. | curl 200 | 2026-09-24 (200) |
| S7 | **NOAA NCEI — U.S. Climate Normals 1991–2020 (monthly)** — ncei.noaa.gov/products/land-based-station/us-climate-normals; data via `https://www.ncei.noaa.gov/access/services/data/v1?dataset=normals-monthly-1991-2020&stations=<ID>&dataTypes=MLY-TMAX-NORMAL,MLY-TMIN-NORMAL&format=csv` | Primary party (federal climate record). October highs/lows used on october-wedding-guest-dresses: Chicago O'Hare USW00094846 62.7/45.4, Minneapolis USW00014922 58.1/40.9, Detroit USW00094847 62.0/44.0, St. Louis USW00013994 69.2/49.1, Columbus USW00014821 65.5/44.8 (°F). | API CSV | 2026-09-25 |
| S8 | **Victoria and Albert Museum — *Women's tie-on pockets*** — vam.ac.uk/articles/womens-tie-pockets | National museum's own collection article. Supports: tied around the waist independently of clothing, reached through openings in dress and petticoats, in use c.1650 to end of 19th century. Used on wedding-guest-dresses-with-pockets. | WebFetch | 2026-09-25 |
| S9 | **American Cleaning Institute — *Laundry Basics*** — cleaninginstitute.org/cleaning-tips/clothes/laundry-basics | Trade body's own published guidance. Supports: follow fabric care labels; wash delicates on gentle cycle, separately. Used on chiffon-wedding-guest-dresses. | WebFetch | 2026-09-25 |
| S10 | **USCCB — *Wedding Ceremony*** — usccb.org/topics/marriage-and-family-life-ministries/wedding-ceremony | The US Catholic bishops' own page. Blocks fetchers (403); existence confirmed via search index 2026-09-25. Cited as a pointer only — no claim is attributed to its content. Used on church-wedding-guest-dresses. | search index | 2026-09-25 |
| S4 | **Author's own wear-testing and photography** | **Does not exist yet.** The owner confirmed (2026-09-24) that no personal stories, wear-tests or photos were ever supplied; every such passage was AI-written and was removed from all 130 pages that day. This row stays empty until Sukie supplies real material. | — | — |

## Citing rule (owner, 2026-09-25)

If a named, verifiable source states a fact, use the fact and attribute it to that source in the sentence ("NOAA's climate normals put…"). Never present a cited finding as the site's own experience, and never drop a sourced fact just because the source is not on the list above — verify it and add a row.

## Retired sources

- **Vogue** `vogue.com/article/what-to-wear-to-a-wedding` and **Harper's Bazaar** `harpersbazaar.com/wedding/bridal-fashion/g32873770/best-wedding-guest-dresses/` — both 404 on 2026-09-24; were in the Further Reading pool on live pages. Removed.
- **Brides** (`brides.com/wedding-guest-attire-4795937`), **The Knot** (`theknot.com/content/wedding-guest-attire-guide`), **Martha Stewart** (`marthastewart.com/7984299/…`) — 403 to every fetcher on 2026-09-24, so their content cannot be verified. Removed from Further Reading.

- **Debrett's** `debretts.com/guide/dress-codes/` — on 2026-09-23 this URL served a subscription page with no dress-code content, and `/etiquette/events-and-dress-codes/` returned 404. Removed from every page's citations the same day. Re-add only with a URL that shows the text being cited.
- Merriam-Webster, Cambridge Dictionary and The Knot return 403 to fetchers — unverifiable, so not cited.

## Product selection — what actually happens (for trust pages)

Recorded from the code, not memory: `scripts/extract-amazon-products.js` (Mar–May 2026) scraped Amazon search results for each slug and kept listings with ≥4.0 stars and ≥15 ratings (top 15). `scripts/fetch-page-products.js` (API era) runs keyword searches with no rating filter. `lib/amazonData.ts` drops any product without a live price at each daily refresh. Nothing is wear-tested. Price level (2026-09-23 data): median $46.99, 94% under $80, 98.8% under $150.

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
- **First-person experience of any kind** — "I tested", "in my experience", "the mistake I see most", reader emails, friends/coworkers, named or dated weddings, "our Closet Test", "hand-picked / vetted for fit". None of it happened (owner, 2026-09-24). Opinions phrased as advice ("what I would avoid is…") are allowed; claimed events are not.
- **Invented trend history and market claims** — "the it colour of 2026", "most-photographed look", runway/designer attributions, brand quality rankings, rental prices — unless fetched and recorded above.
- **Fabricated author credentials.** Sukie Gao is the site's real author; do not
  invent degrees, awards, or institutional affiliations.

## Price and availability rules

Prices come only from S1, refresh at least every 24h, and every product grid carries
the visible disclosure: *"Product prices and availability are accurate as of &lt;date&gt;
and are subject to change."* (global rule 37).
