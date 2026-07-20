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
      "/": ["./content/pages/**/*.json"],
      "/[slug]": ["./content/pages/**/*.json"],
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
    ];
  },
};

export default nextConfig;
