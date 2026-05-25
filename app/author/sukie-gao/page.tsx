import type { Metadata } from "next";
import Link from "next/link";
import { getAllSlugs, getPageData } from "@/lib/getPages";

export const metadata: Metadata = {
  title: "Sukie Gao — Editor, Wedding Guest Style",
  description:
    "Sukie Gao is the editor of Wedding Guest Style. She writes about wedding guest dressing from a guest's perspective — what actually works in photos, what holds up for eight hours, and what the dress code actually means.",
  alternates: { canonical: "https://weddinggueststyle.com/author/sukie-gao" },
};

function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sukie Gao",
    url: "https://weddinggueststyle.com/author/sukie-gao",
    image: "https://weddinggueststyle.com/authors/sukie.jpg",
    jobTitle: "Editor",
    worksFor: {
      "@type": "Organization",
      name: "Wedding Guest Style",
      url: "https://weddinggueststyle.com",
    },
    sameAs: [
      "https://www.instagram.com/sukiegao/",
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function SukieGaoPage() {
  const allSlugs = getAllSlugs();
  const articles = allSlugs
    .map((slug) => {
      const page = getPageData(slug);
      return page ? { slug, title: page.title, publishDate: page.publishDate } : null;
    })
    .filter((p): p is { slug: string; title: string; publishDate: string | undefined } => p !== null)
    .sort((a, b) => (b.publishDate || "").localeCompare(a.publishDate || ""));

  return (
    <>
      <PersonSchema />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-sm text-gray-400 mb-5" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blush-600 transition-colors">Home</Link>
          <span className="mx-2">→</span>
          <Link href="/about" className="hover:text-blush-600 transition-colors">About</Link>
          <span className="mx-2">→</span>
          <span className="text-gray-600">Sukie Gao</span>
        </nav>

        {/* Hero with photo */}
        <div className="flex flex-col sm:flex-row items-start gap-8 mb-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/authors/sukie.jpg"
            alt="Sukie Gao"
            width={160}
            height={160}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border border-ink-200 bg-blush-50"
          />
          <div>
            <h1 className="display-serif text-4xl sm:text-5xl text-ink-900 mb-2">Sukie Gao</h1>
            <p className="text-lg text-blush-600 font-medium mb-3">Editor, Wedding Guest Style</p>
            <p className="text-sm text-ink-600">
              <a
                href="https://www.instagram.com/sukiegao/"
                target="_blank"
                rel="noopener noreferrer me"
                className="text-blush-600 hover:underline"
              >
                @sukiegao on Instagram
              </a>
            </p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed mb-12">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-2 mb-3">About Sukie</h2>
            <p>
              Sukie Gao is the editor of Wedding Guest Style. She writes about wedding guest dressing
              from a guest&apos;s perspective — not a stylist&apos;s, not a bridal expert&apos;s, but
              the perspective of a person who&apos;s been the one in the photo, sat through the ceremony,
              and danced through the reception.
            </p>
            <p>
              Her editorial focus: dresses that hold up for the full eight-hour event, that photograph
              well in mixed lighting, and that match the actual meaning of dress code phrases as guests
              encounter them in real invitations. She shares the visual references and outfit decisions
              that inform her recommendations on <a href="https://www.instagram.com/sukiegao/" target="_blank" rel="noopener noreferrer me" className="text-blush-600 hover:underline">Instagram</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Editorial Philosophy</h2>
            <p>
              The best wedding guest dress is the one that fits your body, suits the dress code,
              photographs beautifully, and you forget you&apos;re wearing by hour three. Trendy details
              date quickly; great fabric, deliberate fit, and confident styling don&apos;t. Recommendations
              on this site skew toward dresses that read elegant in photos and feel comfortable enough
              to dance in for an entire night — and toward honest commentary about which Amazon listings
              actually deliver what the photos promise.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Editorial Process</h2>
            <p>
              Every page on this site is researched with AI assistance and edited by Sukie before
              publication. Product picks come from Amazon listings hand-selected for review quality,
              fit consistency, and dress code appropriateness. No paid placements, no sponsored reviews,
              no pay-to-feature deals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Contact</h2>
            <p>
              For editorial feedback, corrections, or partnership inquiries, reach Sukie via{" "}
              <a href="https://www.instagram.com/sukiegao/" target="_blank" rel="noopener noreferrer me" className="text-blush-600 hover:underline">
                Instagram DM
              </a>
              {" "}or email{" "}
              <a href="mailto:sukielovesupport@gmail.com" className="text-blush-600 hover:underline">sukielovesupport@gmail.com</a>.
            </p>
          </section>
        </div>

        <section className="border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All articles by Sukie</h2>
          <ul className="space-y-3">
            {articles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/${article.slug}`}
                  className="text-blush-600 hover:underline text-base"
                >
                  {article.title}
                </Link>
                {article.publishDate && (
                  <span className="text-sm text-gray-400 ml-3">
                    {new Date(article.publishDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
