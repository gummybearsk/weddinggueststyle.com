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
      languages: {
        "en-US": `https://weddinggueststyle.com/${page.slug}`,
        "x-default": `https://weddinggueststyle.com/${page.slug}`,
      },
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

function ItemListSchema({ products, title }: { products: { title: string; url: string; image: string; price: string; rating: number; reviewCount: number }[]; title: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    numberOfItems: products.length,
    itemListElement: products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.title,
        description: product.title,
        image: product.image,
        url: product.url,
        brand: {
          "@type": "Brand",
          name: "Amazon Fashion",
        },
        offers: {
          "@type": "Offer",
          price: product.price.replace("$", ""),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: product.url,
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "US",
            returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: 30,
            returnMethod: "https://schema.org/ReturnByMail",
            returnFees: "https://schema.org/FreeReturn",
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: "US",
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 0,
                maxValue: 1,
                unitCode: "DAY",
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 2,
                maxValue: 5,
                unitCode: "DAY",
              },
            },
            shippingRate: {
              "@type": "MonetaryAmount",
              value: 0,
              currency: "USD",
            },
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        },
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

function ArticleSchema({ title, description, slug, intro }: { title: string; description: string; slug: string; intro: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: `https://weddinggueststyle.com/${slug}`,
    author: {
      "@type": "Organization",
      name: "Wedding Guest Style",
      url: "https://weddinggueststyle.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Wedding Guest Style",
      url: "https://weddinggueststyle.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://weddinggueststyle.com/${slug}`,
    },
    articleBody: intro,
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
      <ArticleSchema title={page.metaTitle} description={page.metaDescription} slug={page.slug} intro={page.intro} />
      {page.products.length > 0 && <ItemListSchema products={page.products} title={`Top ${page.title}`} />}

      {/* Page header with subtle background */}
      <div className="bg-gradient-to-b from-rose-50/60 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 sm:pt-8 sm:pb-12">
          {/* Breadcrumb */}
          <nav
            className="text-sm text-gray-400 mb-5 flex items-center gap-2"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"
                />
              </svg>
              Home
            </Link>
            <svg
              className="w-3.5 h-3.5 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-gray-600 font-medium">{page.title}</span>
          </nav>

          {/* H1 */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            {page.h1}
          </h1>

          {/* Intro */}
          <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-3xl leading-relaxed">
            {page.intro}
          </p>

          {/* Product count badge */}
          {page.products.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {page.products.length} hand-picked dresses
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Product Grid */}
        {page.products.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Top {page.title}
            </h2>
            <ProductGrid products={page.products} />
          </section>
        )}

        {/* Content Sections */}
        {page.contentSections.length > 0 && (
          <div className="mb-8">
            <div className="section-divider mb-8" />
            {page.contentSections.map((section, i) => (
              <section key={i} className="mb-6 max-w-3xl">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {section.heading}
                </h2>
                <div className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* FAQ */}
        {page.faqs.length > 0 && <FAQ faqs={page.faqs} />}

        {/* Related Pages */}
        {page.relatedPages.length > 0 && (
          <section className="py-8 sm:py-10">
            <div className="section-divider mb-8" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Related Collections
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Explore more wedding guest dress styles you might love.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {page.relatedPages.map((related) => (
                <Link
                  key={related.slug}
                  href={`/${related.slug}`}
                  className="group/related flex items-center gap-3 p-4 bg-white rounded-xl hover:bg-rose-50/50 transition-all border border-gray-100 hover:border-rose-200 hover:shadow-sm"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center group-hover/related:bg-rose-100 group-hover/related:text-rose-600 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-gray-800 group-hover/related:text-rose-700 transition-colors">
                    {related.title}
                  </span>
                </Link>
              ))}
              <Link
                href="/"
                className="group/related flex items-center gap-3 p-4 bg-white rounded-xl hover:bg-rose-50/50 transition-all border border-gray-100 hover:border-rose-200 hover:shadow-sm"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center group-hover/related:bg-rose-100 group-hover/related:text-rose-600 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"
                    />
                  </svg>
                </span>
                <span className="text-sm font-medium text-gray-800 group-hover/related:text-rose-700 transition-colors">
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
