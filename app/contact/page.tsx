import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — Wedding Guest Style",
  description:
    "Get in touch with Wedding Guest Style. Editorial feedback, corrections, partnership inquiries, and reader questions are welcome.",
  alternates: { canonical: "https://weddinggueststyle.com/contact" },
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-400 mb-5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blush-600 transition-colors">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-600">Contact</span>
      </nav>

      <h1 className="display-serif text-4xl sm:text-5xl text-ink-900 mb-3">Contact</h1>
      <p className="text-sm text-gray-500 mb-10">
        We read every message. Response time is typically 2–5 business days.
      </p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-2 mb-3">Email</h2>
          <p>
            The fastest way to reach us is by email:
          </p>
          <p className="text-lg">
            <a
              href="mailto:sukielovesupport@gmail.com"
              className="text-blush-600 hover:underline font-medium"
            >
              sukielovesupport@gmail.com
            </a>
          </p>
          <p className="text-sm text-gray-500 italic">
            Please include the relevant page URL and a clear subject line so we can route your message faster.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">What we welcome</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Reader questions</strong> about a specific dress code, venue, season, or category — we may
              answer in a future post and credit you (or keep you anonymous, your choice).
            </li>
            <li>
              <strong>Editorial corrections</strong> — broken Amazon links, sold-out products, sizing notes that
              no longer match recent customer feedback, factual errors in our content.
            </li>
            <li>
              <strong>Sizing and fit feedback</strong> from real wedding guests who&apos;ve worn pieces we
              recommended — these notes shape future recommendations.
            </li>
            <li>
              <strong>Partnership and editorial inquiries</strong> from brands and PR teams. Note: we do not
              accept paid placements, sponsored reviews, or pay-to-feature deals (
              <Link href="/editorial" className="text-blush-600 hover:underline">see Editorial Guidelines</Link>
              ).
            </li>
            <li>
              <strong>Press inquiries</strong> — interviews, quotes for wedding-industry pieces, or media
              partnerships.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Social</h2>
          <p>
            Sukie shares the visual references and outfit decisions behind the site on Instagram:
          </p>
          <p>
            <a
              href="https://www.instagram.com/sukiegao/"
              target="_blank"
              rel="noopener noreferrer me"
              className="text-blush-600 hover:underline font-medium"
            >
              @sukiegao on Instagram
            </a>
          </p>
          <p className="text-sm text-gray-500 italic">
            DMs are open for quick questions; for detailed feedback please email.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">About the editor</h2>
          <p>
            Wedding Guest Style is edited by{" "}
            <Link href="/author/sukie-gao" className="text-blush-600 hover:underline">
              Sukie Gao
            </Link>
            . Read more about our editorial process in our{" "}
            <Link href="/editorial" className="text-blush-600 hover:underline">
              Editorial Guidelines
            </Link>
            {" "}or how the site makes money on the{" "}
            <Link href="/about" className="text-blush-600 hover:underline">
              About
            </Link>
            {" "}page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Location</h2>
          <p>
            Wedding Guest Style is based in the United States. Dress code conventions, sizing, and retailer
            partnerships on the site reflect a United States wedding context.
          </p>
        </section>
      </div>
    </main>
  );
}
