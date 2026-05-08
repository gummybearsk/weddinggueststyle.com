import type { Metadata } from "next";
import Link from "next/link";
import { getAllSlugs, getPageData } from "@/lib/getPages";

export const metadata: Metadata = {
  title: "Sarah Mitchell — Wedding Style Editor",
  description: "Sarah Mitchell is the wedding style editor at Wedding Guest Style. 10+ years covering wedding fashion, 200+ weddings attended.",
  alternates: { canonical: "https://weddinggueststyle.com/author/sarah-mitchell" },
};

export default function SarahMitchellPage() {
  const allSlugs = getAllSlugs();
  const articles = allSlugs
    .map((slug) => {
      const page = getPageData(slug);
      return page ? { slug, title: page.title, publishDate: page.publishDate } : null;
    })
    .filter((p): p is { slug: string; title: string; publishDate: string | undefined } => p !== null)
    .sort((a, b) => (b.publishDate || "").localeCompare(a.publishDate || ""));

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-400 mb-5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
        <span className="mx-2">→</span>
        <Link href="/about" className="hover:text-rose-600 transition-colors">About</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-600">Sarah Mitchell</span>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Sarah Mitchell</h1>
      <p className="text-lg text-rose-600 font-medium mb-8">Wedding Style Editor</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed mb-12">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-2 mb-3">About Sarah</h2>
          <p>
            Sarah Mitchell is the wedding style editor at Wedding Guest Style and has covered wedding
            fashion for over a decade. After attending more than 200 weddings as a guest across nearly
            every dress code (from Catholic ceremonies to Indian fusion celebrations to black-tie
            New York City galas), Sarah developed strong opinions about what actually works for wedding
            guests — and what falls flat in photos.
          </p>
          <p>
            She started Wedding Guest Style after a particularly chaotic month of three back-to-back
            weddings with three completely different dress codes. The internet had plenty of generic
            &ldquo;wedding guest dress&rdquo; lists, but nothing that actually helped you decode an
            invitation that said &ldquo;black tie optional with a garden ceremony aesthetic&rdquo; or
            &ldquo;dressy casual, beach friendly, but not too beach.&rdquo; This site is the resource
            she wishes had existed back then.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Background &amp; Experience</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>10+ years writing about wedding and event fashion</li>
            <li>200+ weddings attended as a guest across the US, Mexico, and the Caribbean</li>
            <li>Direct experience navigating Catholic, Jewish, Hindu, Muslim, Buddhist, secular, and fusion wedding dress codes</li>
            <li>Personal wardrobe built around weddings, formal events, and dress-code translation</li>
            <li>Background in editorial fashion writing and product curation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Editorial Philosophy</h2>
          <p>
            The best wedding guest dress is the one that fits your body, suits the dress code, photographs
            beautifully, and you forget you&apos;re wearing by hour three of the reception. Trendy details
            date quickly; great fabric, deliberate fit, and confident styling don&apos;t. Sarah&apos;s
            recommendations skew toward dresses that read elegant in photos and feel comfortable enough
            to dance in for an entire night.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Contact</h2>
          <p>
            For editorial feedback or partnership inquiries, email{" "}
            <a href="mailto:sarah@weddinggueststyle.com" className="text-rose-600 hover:underline">sarah@weddinggueststyle.com</a>.
          </p>
        </section>
      </div>

      <section className="border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All articles by Sarah</h2>
        <ul className="space-y-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/${article.slug}`}
                className="text-rose-600 hover:underline text-base"
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
  );
}
