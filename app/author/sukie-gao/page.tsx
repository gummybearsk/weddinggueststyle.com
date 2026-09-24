import type { Metadata } from "next";
import Link from "next/link";
import { getAllSlugs, getPageData } from "@/lib/getPages";

export const metadata: Metadata = {
  title: "Sukie Gao — Editor, Wedding Guest Style",
  description:
    "Sukie Gao is the editor of Wedding Guest Style, the wedding guest dress guide organised by dress code, colour, season, body type and venue.",
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
              Sukie Gao is the editor of Wedding Guest Style. She is on{" "}
              <a href="https://www.instagram.com/sukiegao/" target="_blank" rel="noopener noreferrer me" className="text-blush-600 hover:underline">Instagram</a>{" "}
              as @sukiegao.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Editorial Process</h2>
            <p>
              Pages are researched and drafted with AI assistance. Dress-code definitions follow the
              Emily Post Institute&apos;s attire guide and are cited on the page; claims without a source
              are left out. Products are matched to each page by searching Amazon for its topic, and their
              prices and stock are re-checked against Amazon&apos;s API every day. The dresses are not
              wear-tested. No paid placements, no sponsored reviews, no pay-to-feature deals. The full
              process is on the{" "}
              <Link href="/editorial" className="text-blush-600 hover:underline">editorial guidelines</Link> page.
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
