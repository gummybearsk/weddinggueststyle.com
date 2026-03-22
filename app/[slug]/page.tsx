import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import FAQ from "@/components/FAQ";
import { getPageData, getAllSlugs } from "@/lib/getPages";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = getPageData(params.slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://weddinggueststyle.com/${page.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `https://weddinggueststyle.com/${page.slug}`,
    },
  };
}

function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  if (!faqs.length) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BreadcrumbSchema({ title, slug }: { title: string; slug: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://weddinggueststyle.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: `https://weddinggueststyle.com/${slug}`,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function InnerPage({ params }: PageProps) {
  const page = getPageData(params.slug);
  if (!page) notFound();

  return (
    <>
      <FAQSchema faqs={page.faqs} />
      <BreadcrumbSchema title={page.title} slug={page.slug} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{page.title}</span>
        </nav>

        {/* H1 */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {page.h1}
        </h1>

        {/* Intro */}
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mb-8 leading-relaxed">
          {page.intro}
        </p>

        {/* Product Grid */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
            Top {page.title}
          </h2>
          <ProductGrid products={page.products} />
        </section>

        {/* Content Sections */}
        {page.contentSections.map((section, i) => (
          <section key={i} className="mb-8 max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              {section.heading}
            </h2>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {section.content}
            </div>
          </section>
        ))}

        {/* FAQ */}
        {page.faqs.length > 0 && <FAQ faqs={page.faqs} />}

        {/* Related Pages */}
        {page.relatedPages.length > 0 && (
          <section className="py-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Related Collections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {page.relatedPages.map((related) => (
                <Link
                  key={related.slug}
                  href={`/${related.slug}`}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-rose-50 transition-colors border border-gray-200 hover:border-rose-200"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {related.title}
                  </span>
                </Link>
              ))}
              <Link
                href="/"
                className="block p-4 bg-gray-50 rounded-lg hover:bg-rose-50 transition-colors border border-gray-200 hover:border-rose-200"
              >
                <span className="text-sm font-medium text-gray-900">
                  Browse All Wedding Guest Dresses
                </span>
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
