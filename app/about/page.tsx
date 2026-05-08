import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Wedding Guest Style",
  description: "Wedding Guest Style is a curated guide to the best wedding guest dresses for every season, dress code, and venue. Our editorial mission and process.",
  alternates: { canonical: "https://weddinggueststyle.com/about" },
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-400 mb-5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blush-600 transition-colors">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-600">About</span>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900 mb-3">About Wedding Guest Style</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: April 15, 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-2 mb-3">Why We Built This Site</h2>
          <p>
            Every wedding guest faces the same problem: the invitation arrives, the dress code is some variation
            of &ldquo;cocktail attire&rdquo; or &ldquo;black tie optional,&rdquo; and you have a few weeks to find
            something that&apos;s appropriate, flattering, photographs well, and doesn&apos;t accidentally upstage
            the bride. Then you open a search tab and stare at thousands of dresses, most of them either too
            casual, too formal, too white, or simply not quite right.
          </p>
          <p>
            Wedding Guest Style exists to fix that. We curate wedding guest dresses by every variable that
            matters — season, dress code, body type, venue, color preference, and budget — so you can find
            something appropriate without spending hours scrolling.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">What Makes Us Different</h2>
          <p>
            Most wedding-fashion sites either link to brands they have direct partnerships with (limited
            selection) or scrape product data without curation (unreliable quality). We do neither.
          </p>
          <p>
            Every dress on the site has been hand-picked from Amazon listings with verified reviews. We
            prioritize:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Real reviews:</strong> Minimum 4.5 stars with at least 20 reviews — we read review photos and feedback before recommending</li>
            <li><strong>Fit accuracy:</strong> Brands and listings with consistent &ldquo;true to size&rdquo; feedback in customer reviews</li>
            <li><strong>Photographic accuracy:</strong> Listings where customer photos match the marketing images</li>
            <li><strong>Reasonable pricing:</strong> Most dresses under $80, almost all under $150</li>
            <li><strong>Dress code appropriateness:</strong> Each dress is matched to specific dress code categories, not generic &ldquo;wedding guest&rdquo;</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Our Editorial Process</h2>
          <p>
            We update our recommendations regularly as new dresses launch and old ones go out of stock. Each
            inner page on the site covers one specific dress category (e.g., black tie, casual, blush pink) with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>15-50 hand-picked dresses for that category</li>
            <li>A dress code or color guide explaining when the category is appropriate</li>
            <li>Body type fit advice</li>
            <li>Fabric and styling considerations</li>
            <li>Real-user FAQs answered in detail</li>
          </ul>
          <p>
            For more detail on how we research and write content, see our
            <Link href="/editorial" className="text-blush-600 hover:underline"> Editorial Guidelines</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Who&apos;s Behind This Site</h2>
          <p>
            Wedding Guest Style is run by a small editorial team led by{" "}
            <Link href="/author/sarah-mitchell" className="text-blush-600 hover:underline">Sarah Mitchell</Link>,
            our wedding style editor. Sarah has covered wedding fashion for over a decade, has personally
            attended 200+ weddings as a guest, and has worn more dress codes than most professional wedding
            planners.
          </p>
          <p>
            We&apos;re not industry insiders selling you on a brand or designer. We&apos;re wedding guests
            who got tired of the search and built the resource we wish had existed when we started.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">How We Make Money</h2>
          <p>
            Wedding Guest Style participates in the Amazon Services LLC Associates Program. When you click
            an affiliate link on our site and make a purchase, we earn a small commission — at no additional
            cost to you. This is what funds the work behind the site and lets us keep it free.
          </p>
          <p>
            We do not accept paid placements, sponsored reviews, or pay-to-feature deals. Affiliate
            relationships do not influence our editorial decisions. If a dress is not worth recommending,
            we don&apos;t include it — regardless of commission rate.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Get in Touch</h2>
          <p>
            For questions, feedback, content corrections, or partnership inquiries, email{" "}
            <a href="mailto:hello@weddinggueststyle.com" className="text-blush-600 hover:underline">hello@weddinggueststyle.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
