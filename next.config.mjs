/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel's output-file tracer does not follow runtime `fs.readdirSync`, so any route
  // that reads content/pages/ during ISR revalidation ships without those files and
  // silently returns empty. This collapsed /sitemap.xml from 116 URLs to 13 (every
  // inner page missing) once `revalidate` was added to app/sitemap.ts.
  // Every route below reads content/pages/ at runtime and MUST stay listed here.
  experimental: {
    outputFileTracingIncludes: {
      "/sitemap.xml": ["./content/pages/**/*.json"],
      // Daily publish sweep reads every page's publishDate at runtime (Rule 39a).
      "/api/cron/publish-check": ["./content/pages/**/*.json"],
      "/": ["./content/pages/**/*.json"],
      "/[slug]": ["./content/pages/**/*.json"],
      // Pillar hubs render live product rows pooled from their cluster pages.
      "/season": ["./content/pages/**/*.json"],
      "/dress-code": ["./content/pages/**/*.json"],
      "/color": ["./content/pages/**/*.json"],
      "/body-type": ["./content/pages/**/*.json"],
      "/style": ["./content/pages/**/*.json"],
      "/venue": ["./content/pages/**/*.json"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
      {
        // Editorial photography (Unsplash Licence — commercial use permitted).
        // Credited in-page to the photographer per Unsplash's attribution guidance.
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.weddinggueststyle.com" }],
        destination: "https://weddinggueststyle.com/:path*",
        permanent: true,
      },
      {
        source: "/author/sarah-mitchell",
        destination: "/author/sukie-gao",
        permanent: true,
      },
      // Consolidation: two pages targeted the same "dressy casual" intent and split the
      // signal between them — 3 impressions / 0 clicks each. One page, one intent.
      {
        source: "/what-does-dressy-casual-mean-for-a-wedding-guest",
        destination: "/what-is-dressy-casual-for-a-wedding",
        permanent: true,
      },
      // Duplicate-intent consolidation (2026-09-23). Sage: the -2026 twin split the
      // sage cluster (81 Bing impressions, 0 clicks across both). Fall long-sleeve: the
      // winner ranks Google #9 and converts 19% on Bing; the twin had 3 impressions.
      {
        source: "/sage-green-wedding-guest-dresses-2026",
        destination: "/green-wedding-guest-dresses",
        permanent: true,
      },
      {
        source: "/fall-wedding-guest-dresses-long-sleeve",
        destination: "/fall-wedding-guest-dresses",
        permanent: true,
      },
      // Duplicate-intent consolidation (2026-09-11). Five pages competed for "black
      // wedding guest dresses" and split 33 Bing impressions between them; same pattern for
      // formal, fuchsia and winter. Each cluster now has one page, and the losers 301 into
      // it so any accumulated equity follows.
      {
        source: "/elegant-black-wedding-guest-dresses",
        destination: "/black-wedding-guest-dresses",
        permanent: true,
      },
      {
        source: "/best-black-wedding-guest-dresses",
        destination: "/black-wedding-guest-dresses",
        permanent: true,
      },
      {
        source: "/best-black-dress-for-wedding-guest",
        destination: "/black-wedding-guest-dresses",
        permanent: true,
      },
      {
        source: "/elegant-black-dresses-for-wedding-guests",
        destination: "/black-wedding-guest-dresses",
        permanent: true,
      },
      {
        source: "/best-formal-wedding-guest-dresses",
        destination: "/formal-wedding-guest-dresses",
        permanent: true,
      },
      {
        source: "/short-fuchsia-wedding-guest-dresses",
        destination: "/pink-wedding-guest-dresses",
        permanent: true,
      },
      {
        source: "/classy-winter-wedding-guest-dresses",
        destination: "/winter-wedding-guest-dresses",
        permanent: true,
      },
      // Dress-code pivot consolidation (2026-10-22): one page per search intent. Each
      // loser 301s to the page that owns its intent; queued pages that never went live
      // redirect too, in case a crawler requested them early.
      { source: "/black-cocktail-dress-for-wedding", destination: "/black-cocktail-wedding-guest-dresses", permanent: true },
      { source: "/black-cocktail-dresses-for-weddings", destination: "/black-cocktail-wedding-guest-dresses", permanent: true },
      { source: "/elegant-black-wedding-guest-dresses-with-sleeves", destination: "/black-wedding-guest-dresses", permanent: true },
      { source: "/wedding-cocktail-dresses-for-guests", destination: "/cocktail-wedding-guest-dresses", permanent: true },
      { source: "/black-tie-optional-dresses-for-women-2026", destination: "/black-tie-optional-wedding-guest-dresses", permanent: true },
      { source: "/black-tie-optional-fall-wedding-guest-dresses", destination: "/black-tie-optional-wedding-guest-dresses", permanent: true },
      { source: "/winter-black-tie-wedding-guest-dresses", destination: "/black-tie-wedding-guest-dresses", permanent: true },
      { source: "/semi-formal-wedding-guest-dresses-with-sleeves", destination: "/semi-formal-wedding-guest-dresses", permanent: true },
      { source: "/summer-semi-formal-wedding-guest-dresses", destination: "/semi-formal-wedding-guest-dresses", permanent: true },
      { source: "/formal-dresses-for-wedding-guest", destination: "/formal-wedding-guest-dresses", permanent: true },
      { source: "/casual-wedding-outfits-for-women", destination: "/casual-wedding-guest-dresses", permanent: true },
      { source: "/casual-wedding-attire-for-women", destination: "/casual-wedding-guest-dresses", permanent: true },
      { source: "/casual-wedding-attire-for-guests", destination: "/what-to-wear-to-a-casual-wedding", permanent: true },
      { source: "/dressy-casual-wedding-attire", destination: "/what-is-dressy-casual-for-a-wedding", permanent: true },
      { source: "/business-casual-wedding-attire-women", destination: "/business-casual-wedding-guest-dresses", permanent: true },
      { source: "/what-does-black-tie-mean", destination: "/black-tie-attire", permanent: true },
      { source: "/chocolate-brown-wedding-guest-dresses", destination: "/brown-wedding-guest-dresses", permanent: true },
      { source: "/chocolate-brown-velvet-wedding-guest-dress", destination: "/brown-wedding-guest-dresses", permanent: true },
      { source: "/pink-wedding-guest-dresses-2026", destination: "/pink-wedding-guest-dresses", permanent: true },
      { source: "/soft-pink-wedding-guest-dresses", destination: "/pink-wedding-guest-dresses", permanent: true },
      { source: "/light-pink-wedding-guest-dresses", destination: "/pink-wedding-guest-dresses", permanent: true },
      { source: "/rose-pink-wedding-guest-dresses", destination: "/pink-wedding-guest-dresses", permanent: true },
      { source: "/bright-pink-wedding-guest-dresses", destination: "/pink-wedding-guest-dresses", permanent: true },
      { source: "/dark-pink-wedding-guest-dresses", destination: "/pink-wedding-guest-dresses", permanent: true },
      { source: "/bright-yellow-wedding-guest-dresses", destination: "/yellow-wedding-guest-dresses", permanent: true },
      { source: "/butter-yellow-garden-wedding-guest-dresses", destination: "/yellow-wedding-guest-dresses", permanent: true },
      { source: "/summer-butter-yellow-wedding-guest-dresses", destination: "/yellow-wedding-guest-dresses", permanent: true },
      { source: "/navy-blue-wedding-guest-gown", destination: "/navy-wedding-guest-dresses", permanent: true },
      { source: "/wedding-guest-dresses-summer-2026", destination: "/summer-wedding-guest-dresses", permanent: true },
      { source: "/flowy-summer-wedding-guest-dresses", destination: "/summer-wedding-guest-dresses", permanent: true },
      { source: "/best-fall-wedding-guest-dresses-2026-long-sleeve", destination: "/fall-wedding-guest-dresses", permanent: true },
      { source: "/october-wedding-guest-dresses", destination: "/fall-wedding-guest-dresses", permanent: true },
      { source: "/november-wedding-guest-dresses", destination: "/fall-wedding-guest-dresses", permanent: true },
      { source: "/thanksgiving-wedding-guest-dresses", destination: "/fall-wedding-guest-dresses", permanent: true },
      { source: "/december-wedding-guest-dresses", destination: "/winter-wedding-guest-dresses", permanent: true },
      { source: "/january-wedding-guest-dresses", destination: "/winter-wedding-guest-dresses", permanent: true },
      { source: "/new-years-eve-wedding-guest-dresses", destination: "/winter-wedding-guest-dresses", permanent: true },
      { source: "/march-wedding-guest-dresses", destination: "/spring-wedding-guest-dresses", permanent: true },
      { source: "/wedding-guest-maxi-dress-2026", destination: "/maxi-wedding-guest-dresses", permanent: true },
      { source: "/long-wedding-guest-dresses", destination: "/maxi-wedding-guest-dresses", permanent: true },
      { source: "/petite-wedding-guest-dresses-fall-2026", destination: "/petite-wedding-guest-dresses", permanent: true },
      { source: "/petite-wedding-guest-dresses-over-60", destination: "/petite-wedding-guest-dresses", permanent: true },
      { source: "/trendy-plus-size-wedding-guest-dresses", destination: "/plus-size-wedding-guest-dresses", permanent: true },
      { source: "/plus-size-summer-wedding-guest-dresses", destination: "/plus-size-wedding-guest-dresses", permanent: true },
      { source: "/plus-size-fall-wedding-guest-dresses", destination: "/plus-size-wedding-guest-dresses", permanent: true },
      { source: "/plus-size-cocktail-wedding-guest-dresses", destination: "/plus-size-wedding-guest-dresses", permanent: true },
      { source: "/modest-wedding-guest-dresses-with-sleeves-2026", destination: "/modest-wedding-guest-dresses", permanent: true },
      { source: "/modest-winter-wedding-guest-dresses-with-sleeves", destination: "/modest-wedding-guest-dresses", permanent: true },
      { source: "/wedding-guest-dresses-with-sleeves", destination: "/long-sleeve-wedding-guest-dresses", permanent: true },
      { source: "/wedding-guest-dresses-for-women-over-50-fall", destination: "/wedding-guest-dresses-over-50", permanent: true },
      { source: "/beach-wedding-guest-dresses-over-50", destination: "/wedding-guest-dresses-over-50", permanent: true },
      { source: "/beach-wedding-guest-dresses-with-sleeves", destination: "/beach-wedding-guest-dresses", permanent: true },
      { source: "/mermaid-beach-wedding-guest-dresses", destination: "/beach-wedding-guest-dresses", permanent: true },
      { source: "/stylish-indian-wedding-guest-outfits", destination: "/indian-wedding-guest-dresses", permanent: true },
      { source: "/traditional-indian-wedding-guest-dresses", destination: "/indian-wedding-guest-dresses", permanent: true },
      { source: "/western-indian-wedding-guest-attire", destination: "/indian-wedding-guest-dresses", permanent: true },
      { source: "/floral-maxi-wedding-guest-dresses", destination: "/floral-wedding-guest-dresses", permanent: true },
      { source: "/black-friday-wedding-guest-dress-deals", destination: "/best-wedding-guest-dresses", permanent: true },
      { source: "/chiffon-wedding-guest-dresses", destination: "/formal-wedding-guest-dresses", permanent: true },
      { source: "/wedding-guest-clutches-and-bags", destination: "/how-to-accessorize-a-wedding-guest-dress", permanent: true },
      // Second consolidation pass (2026-10-22): shade, fabric and length pages with no traffic
      // after 8+ weeks fold into their family page; the green trio also shared ~37% of its text.
      { source: "/blush-wedding-guest-dresses", destination: "/pink-wedding-guest-dresses", permanent: true },
      { source: "/burgundy-wedding-guest-dresses", destination: "/red-wedding-guest-dresses", permanent: true },
      { source: "/butter-yellow-wedding-guest-dresses", destination: "/yellow-wedding-guest-dresses", permanent: true },
      { source: "/casual-fall-wedding-guest-dresses", destination: "/fall-wedding-guest-dresses", permanent: true },
      { source: "/designer-wedding-guest-dresses", destination: "/elegant-wedding-guest-dresses", permanent: true },
      { source: "/emerald-green-wedding-guest-dresses", destination: "/green-wedding-guest-dresses", permanent: true },
      { source: "/dark-green-wedding-guest-dresses", destination: "/green-wedding-guest-dresses", permanent: true },
      { source: "/olive-green-wedding-guest-dresses", destination: "/green-wedding-guest-dresses", permanent: true },
      { source: "/sage-green-wedding-guest-dresses", destination: "/green-wedding-guest-dresses", permanent: true },
      { source: "/fuchsia-wedding-guest-dresses", destination: "/pink-wedding-guest-dresses", permanent: true },
      { source: "/hot-pink-wedding-guest-dresses", destination: "/pink-wedding-guest-dresses", permanent: true },
      { source: "/jewel-tone-wedding-guest-dresses", destination: "/winter-wedding-guest-dresses", permanent: true },
      { source: "/knee-length-wedding-guest-dresses", destination: "/cocktail-wedding-guest-dresses", permanent: true },
      { source: "/satin-wedding-guest-dresses", destination: "/formal-wedding-guest-dresses", permanent: true },
      { source: "/velvet-wedding-guest-dresses", destination: "/winter-wedding-guest-dresses", permanent: true },
      { source: "/wedding-guest-dresses-for-big-tummy", destination: "/plus-size-wedding-guest-dresses", permanent: true },
    ];
  },
};

export default nextConfig;
