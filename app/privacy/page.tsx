import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Wedding Guest Style — how we collect, use, and protect your information.",
  alternates: { canonical: "https://weddinggueststyle.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-400 mb-5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-600">Privacy Policy</span>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: April 15, 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">1. Introduction</h2>
          <p>
            Wedding Guest Style (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) operates the website
            <Link href="/" className="text-rose-600 hover:underline"> https://weddinggueststyle.com</Link>.
            This Privacy Policy explains what information we collect, how we use it, and the choices you have. By using
            our site, you agree to the practices described here.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">2. Information We Collect</h2>
          <p>
            <strong>Information you provide:</strong> We do not require account creation, and we do not collect
            personal information directly from you on our pages. Any data you submit through third-party services
            (such as the comment systems on partner sites) is governed by their own privacy policies.
          </p>
          <p>
            <strong>Automatically collected information:</strong> Like most websites, we collect standard analytics
            data when you visit, including: IP address (anonymized), browser type, device type, pages visited, time
            on site, referring website, and approximate location (country/city level).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">3. Cookies and Tracking</h2>
          <p>We use the following third-party services that may set cookies on your device:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Google Analytics</strong> — to understand how visitors use our site and improve content.
              Google&apos;s privacy policy: <a href="https://policies.google.com/privacy" className="text-rose-600 hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>
            </li>
            <li>
              <strong>Microsoft Clarity</strong> — for session recordings and heatmaps to improve site usability.
              Clarity&apos;s privacy policy: <a href="https://privacy.microsoft.com/en-us/privacystatement" className="text-rose-600 hover:underline" target="_blank" rel="noopener noreferrer">privacy.microsoft.com</a>
            </li>
            <li>
              <strong>Amazon Associates</strong> — when you click an Amazon affiliate link, Amazon may set tracking
              cookies. See <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ" className="text-rose-600 hover:underline" target="_blank" rel="noopener noreferrer">Amazon&apos;s privacy notice</a>.
            </li>
          </ul>
          <p>You can disable cookies in your browser settings; the site will still function, but some features may not work as expected.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">4. How We Use Information</h2>
          <p>We use the information we collect only to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Understand which pages and content visitors find valuable</li>
            <li>Identify and fix technical issues</li>
            <li>Improve site usability and content quality</li>
            <li>Comply with applicable laws</li>
          </ul>
          <p>We do <strong>not</strong> sell, rent, or share personal information with third parties for marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">5. Affiliate Links and Disclosure</h2>
          <p>
            Wedding Guest Style is a participant in the Amazon Services LLC Associates Program, an affiliate
            advertising program designed to provide a means for sites to earn advertising fees by advertising and
            linking to Amazon.com. When you click an affiliate link and make a purchase, we may earn a small
            commission at no additional cost to you. This helps fund our work and allows us to keep the site free
            for readers. Affiliate relationships do not influence our recommendations.
          </p>
          <p>
            See our <Link href="/editorial" className="text-rose-600 hover:underline">Editorial Guidelines</Link> for
            more on how we choose products.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">6. Your Rights</h2>
          <p>
            Depending on where you live, you may have rights under data protection laws including GDPR (Europe) or
            CCPA (California). These rights generally include the right to access, correct, or delete personal
            information, and to opt out of certain data processing.
          </p>
          <p>
            To exercise any of these rights, email us at <a href="mailto:hello@weddinggueststyle.com" className="text-rose-600 hover:underline">hello@weddinggueststyle.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">7. Children&apos;s Privacy</h2>
          <p>
            Our site is not directed to children under 13. We do not knowingly collect personal information from
            children. If you believe we have inadvertently collected such information, please contact us and we
            will delete it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the top of
            this page reflects the most recent revision. Significant changes will be noted prominently on the site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">9. Contact</h2>
          <p>
            For questions about this Privacy Policy, email us at <a href="mailto:hello@weddinggueststyle.com" className="text-rose-600 hover:underline">hello@weddinggueststyle.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
