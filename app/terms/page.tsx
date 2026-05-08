import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Wedding Guest Style — the rules governing use of our website and content.",
  alternates: { canonical: "https://weddinggueststyle.com/terms" },
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-400 mb-5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blush-600 transition-colors">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-600">Terms of Service</span>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900 mb-3">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: April 15, 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using <Link href="/" className="text-blush-600 hover:underline">https://weddinggueststyle.com</Link>
            (&ldquo;the site,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;), you agree to be bound by these Terms of
            Service. If you do not agree to these terms, please do not use the site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">2. Description of Service</h2>
          <p>
            Wedding Guest Style is a content-and-affiliate website that curates and reviews wedding guest dresses
            available for purchase through Amazon and other retailers. We provide style guides, dress code
            explanations, and product recommendations to help readers find appropriate attire for weddings they
            attend as guests.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">3. Content Accuracy</h2>
          <p>
            We strive for accuracy across all content, but the wedding fashion industry changes rapidly. Prices,
            availability, sizing, fabric, and product details on Amazon and other retailer sites can change
            without notice. Always verify current price and availability on the retailer&apos;s site before purchase.
            We are not responsible for errors in third-party product listings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">4. Affiliate Relationships</h2>
          <p>
            We participate in affiliate programs including Amazon Associates. When you click an affiliate link and
            make a purchase, we may earn a commission at no additional cost to you. Our affiliate relationships
            do not influence our recommendations — we only recommend dresses we genuinely believe would benefit
            our readers based on real reviews, ratings, and product specifications.
          </p>
          <p>
            See our <Link href="/editorial" className="text-blush-600 hover:underline">Editorial Guidelines</Link>
            for our full review and recommendation process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">5. Intellectual Property</h2>
          <p>
            All original content on this site (text, page structure, curation, original photography) is owned by
            Wedding Guest Style and protected by copyright. You may share excerpts with attribution and a link
            back to the source page. You may not republish, redistribute, or commercially reuse our content
            without written permission.
          </p>
          <p>
            Product images and brand names are the property of their respective owners and are used under fair
            use for editorial and review purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">6. No Professional Advice</h2>
          <p>
            Content on this site is for general informational and entertainment purposes only. We do not provide
            legal, medical, financial, or professional advice. Wedding etiquette guidance is based on common social
            conventions and should be considered alongside cultural, religious, and personal preferences relevant
            to the specific wedding you are attending.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">7. Third-Party Links</h2>
          <p>
            Our site contains links to third-party websites including Amazon, Nordstrom, and other retailers. We
            are not responsible for the content, privacy practices, or terms of those sites. Use them at your
            own discretion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">8. Limitation of Liability</h2>
          <p>
            Wedding Guest Style is provided &ldquo;as is&rdquo; without warranties of any kind. To the fullest
            extent permitted by law, we are not liable for any direct, indirect, incidental, or consequential
            damages arising from your use of the site or any third-party products purchased through our links.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">9. Changes to Terms</h2>
          <p>
            We may modify these Terms of Service at any time. The &ldquo;Last updated&rdquo; date at the top of
            this page reflects the current version. Continued use of the site after changes constitutes acceptance
            of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">10. Governing Law</h2>
          <p>
            These terms are governed by the laws of the United States. Any disputes will be resolved in the
            courts of the United States.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">11. Contact</h2>
          <p>
            For questions about these Terms of Service, email <a href="mailto:hello@weddinggueststyle.com" className="text-blush-600 hover:underline">hello@weddinggueststyle.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
