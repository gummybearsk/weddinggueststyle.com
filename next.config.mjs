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
        destination: "/fuchsia-wedding-guest-dresses",
        permanent: true,
      },
      {
        source: "/classy-winter-wedding-guest-dresses",
        destination: "/winter-wedding-guest-dresses",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
