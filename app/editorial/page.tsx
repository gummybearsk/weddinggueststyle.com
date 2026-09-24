import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial Guidelines & Affiliate Disclosure",
  description: "How Wedding Guest Style researches, writes, and selects wedding guest dresses — plus our affiliate disclosure and AI use policy.",
  alternates: { canonical: "https://weddinggueststyle.com/editorial" },
};

export default function EditorialPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-400 mb-5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blush-600 transition-colors">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-600">Editorial Guidelines</span>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900 mb-3">Editorial Guidelines &amp; Disclosure</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: September 24, 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-2 mb-3">Affiliate Disclosure</h2>
          <p>
            Wedding Guest Style is a participant in the Amazon Services LLC Associates Program, an affiliate
            advertising program designed to provide a means for sites to earn advertising fees by advertising
            and linking to Amazon.com. We may also participate in other affiliate programs from time to time.
          </p>
          <p>
            <strong>What this means for you:</strong> When you click an affiliate link on our site and make a
            purchase, we may earn a small commission at no additional cost to you. This is how the site is
            funded.
          </p>
          <p>
            <strong>What this does NOT mean:</strong> We do not get paid more to recommend any particular dress
            or brand. We have not accepted free products, sponsorships, or paid placements in exchange for
            coverage. Which products appear depends on the page&apos;s topic and on live Amazon price and stock data
            — not on commission rates.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">How We Choose Dresses</h2>
          <p>
            Every product on the site goes through the same steps.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">1. Matched to the page&apos;s topic</h3>
          <p>
            Each page&apos;s products come from searching Amazon for that page&apos;s subject — a colour, a
            dress code, a silhouette or a season. Since May 2026 those searches run through Amazon&apos;s
            official Product Advertising (Creators) API.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">2. Customer ratings</h3>
          <p>
            When the site&apos;s pages were first stocked, listings were filtered to those with at least
            4.0 stars from at least 15 customer ratings.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">3. Live price and stock, checked daily</h3>
          <p>
            Every day the site re-reads price and availability for every listed product from Amazon&apos;s API.
            Anything that is out of stock or has no current price is removed from the page automatically, and
            each product grid shows the date the prices were last checked.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">4. Price level</h3>
          <p>
            In the 23 September 2026 price check, 94% of the in-stock dresses on the site cost under $80 and
            almost 99% under $150; the median was $46.99.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">How We Research Content</h2>
          <p>
            Dress-code definitions on this site follow the Emily Post Institute&apos;s published attire guide,
            which is cited on the pages that rely on it. Product facts (price, availability, brand) come from
            Amazon&apos;s API. Every factual claim is checked against the source named on the page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Use of AI Tools</h2>
          <p>
            We use AI tools (including large language models) as research assistants and first-draft writing
            tools. AI helps us research topics, draft initial content structures, and identify the questions readers
            are searching for.
          </p>
          <p>
            <strong>However, every page on this site is reviewed and edited by a human editor before
            publication.</strong> We add editorial judgment and check every fact against the
            sources named on the page. We do not publish unedited AI output.
          </p>
          <p>
            This disclosure follows Google&apos;s guidance for AI-assisted content creators, which recommends
            disclosing when AI substantively contributed to content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Updates and Corrections</h2>
          <p>
            Wedding fashion changes seasonally. Dresses go out of stock, prices shift, and trends evolve. We
            review our pages at least quarterly and update them with current product availability, refreshed
            recommendations, and seasonally appropriate dresses.
          </p>
          <p>
            The &ldquo;Last updated&rdquo; date on each page reflects the most recent substantive review,
            not auto-generated build dates. If you spot an outdated link, broken product, or factual error,
            email <a href="mailto:sukielovesupport@gmail.com" className="text-blush-600 hover:underline">sukielovesupport@gmail.com</a>
            and we&apos;ll fix it within a week.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">What We Don&apos;t Do</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We don&apos;t accept paid sponsorships or branded content</li>
            <li>We don&apos;t accept free products in exchange for coverage</li>
            <li>We don&apos;t allow advertisers to influence our recommendations</li>
            <li>We don&apos;t republish or scrape content from other wedding sites</li>
            <li>We don&apos;t use AI-generated images or stock photos pretending to be original photography</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Contact</h2>
          <p>
            For editorial feedback, content corrections, or partnership inquiries, email{" "}
            <a href="mailto:sukielovesupport@gmail.com" className="text-blush-600 hover:underline">sukielovesupport@gmail.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
