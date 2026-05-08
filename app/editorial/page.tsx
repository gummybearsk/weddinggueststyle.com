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
      <p className="text-sm text-gray-500 mb-10">Last updated: April 15, 2026</p>

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
            coverage. Our recommendations are based on review quality, customer feedback, fit accuracy, and
            dress code appropriateness — not commission rates.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">How We Choose Dresses</h2>
          <p>Each dress that appears on the site has passed our editorial review for the following criteria:</p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">1. Customer Reviews</h3>
          <p>
            We require a minimum of 4.5 stars with at least 20 verified customer reviews. We read 4-star
            reviews more carefully than 5-star (4-star reviews tend to surface fit issues, fabric concerns,
            and other practical feedback that helps us decide whether to recommend a dress).
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">2. Fit Accuracy</h3>
          <p>
            We look for listings with consistent &ldquo;true to size&rdquo; or &ldquo;runs slightly small/large&rdquo;
            feedback. Listings with wildly inconsistent sizing reviews are excluded — even if the average rating
            is high.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">3. Photographic Accuracy</h3>
          <p>
            Customer photos must reasonably match the marketing photos. Listings where the customer photos
            consistently look different from the model photos are excluded.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">4. Dress Code Appropriateness</h3>
          <p>
            Each dress is categorized into specific dress code pages (black tie, semi-formal, cocktail, etc.)
            based on fabric, silhouette, and styling — not just the seller&apos;s product title.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">5. Reasonable Pricing</h3>
          <p>
            Most dresses on the site cost less than $80. Almost all cost under $150. We focus on accessible
            options because most wedding guests don&apos;t want to spend $300+ on a dress they may only wear
            once.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">How We Research Content</h2>
          <p>
            Our style guides, dress code explanations, and FAQs are written based on:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Standard wedding etiquette references including The Knot, WeddingWire, and Brides magazine</li>
            <li>Direct experience attending weddings across multiple dress codes</li>
            <li>Real customer reviews and feedback from product listings</li>
            <li>Cultural and religious wedding tradition references for relevant pages (e.g., Indian, Jewish, Catholic ceremonies)</li>
            <li>Seasonal fashion trend research from runway shows and editorial coverage</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Use of AI Tools</h2>
          <p>
            We use AI tools (including large language models) as research assistants and first-draft writing
            tools. AI helps us efficiently summarize customer review patterns, draft initial content
            structures, and identify keyword opportunities.
          </p>
          <p>
            <strong>However, every page on this site is reviewed and edited by a human editor before
            publication.</strong> We add our own dress code experience, real-life styling considerations,
            and editorial judgment to every page. We do not publish unedited AI output.
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
            email <a href="mailto:hello@weddinggueststyle.com" className="text-blush-600 hover:underline">hello@weddinggueststyle.com</a>
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
            <a href="mailto:hello@weddinggueststyle.com" className="text-blush-600 hover:underline">hello@weddinggueststyle.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
