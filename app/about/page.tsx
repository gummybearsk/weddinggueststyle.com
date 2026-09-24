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
      <p className="text-sm text-gray-500 mb-10">Last updated: September 24, 2026</p>

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
            Every dress page is organised around one question a guest actually has — a dress code, a colour,
            a season, a fit — and explains the answer before it shows a single product. Dress-code
            definitions follow the Emily Post Institute&apos;s attire guide and are cited on the page.
          </p>
          <p>
            The products themselves come from Amazon, matched to each page by searching for its topic.
            Prices and stock are re-checked against Amazon&apos;s API every day, and anything unavailable
            is removed automatically:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Customer ratings:</strong> pages were first stocked from listings with at least 4.0 stars from at least 15 customer ratings</li>
            <li><strong>Price level:</strong> in the 23 September 2026 check, 94% of in-stock dresses cost under $80; the median was $46.99</li>
            <li><strong>Dress code first:</strong> every page explains the dress code, colour or fit question before it shows a product</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Our Editorial Process</h2>
          <p>
            We update our recommendations regularly as new dresses launch and old ones go out of stock. Each
            inner page on the site covers one specific dress category (e.g., black tie, casual, blush pink) with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>A grid of in-stock dresses from Amazon (12 on question pages, up to 24 on category pages, up to 32 on deals pages)</li>
            <li>A dress code or color guide explaining when the category is appropriate</li>
            <li>Body type fit advice</li>
            <li>Fabric and styling considerations</li>
            <li>FAQs answering the questions readers search for</li>
          </ul>
          <p>
            For more detail on how we research and write content, see our
            <Link href="/editorial" className="text-blush-600 hover:underline"> Editorial Guidelines</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Who&apos;s Behind This Site</h2>
          <p>
            Wedding Guest Style is edited by{" "}
            <Link href="/author/sukie-gao" className="text-blush-600 hover:underline">Sukie Gao</Link>
            {" "}(
            <a href="https://www.instagram.com/sukiegao/" target="_blank" rel="noopener noreferrer me" className="text-blush-600 hover:underline">@sukiegao</a>
            ).
          </p>
          <p className="text-sm text-gray-500 italic">
            Articles on this site are researched with AI assistance and edited by Sukie before publication.
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
            We do not accept paid placements, sponsored reviews, or pay-to-feature deals. Commission
            rates play no part in which products appear.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Get in Touch</h2>
          <p>
            For questions, feedback, content corrections, or partnership inquiries, email{" "}
            <a href="mailto:sukielovesupport@gmail.com" className="text-blush-600 hover:underline">sukielovesupport@gmail.com</a>.
          </p>
          <p>
            Wedding Guest Style is based in the United States. All dress code conventions, sizing, retailer
            partnerships, and editorial perspectives on this site reflect a United States wedding context.
          </p>
        </section>
      </div>
    </main>
  );
}
