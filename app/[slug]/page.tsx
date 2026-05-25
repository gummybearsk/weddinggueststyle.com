import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import FAQ from "@/components/FAQ";
import AuthorByline from "@/components/AuthorByline";
import { getAllSlugsIncludingScheduled, getPublishedPageData } from "@/lib/getPages";

// Revalidate every 12 hours so scheduled pages auto-publish on their date
export const revalidate = 43200;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllSlugsIncludingScheduled().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = getPublishedPageData(params.slug);
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

function ArticleSchema({ title, description, slug, intro, publishDate }: { title: string; description: string; slug: string; intro: string; publishDate?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: `https://weddinggueststyle.com/${slug}`,
    ...(publishDate && { datePublished: publishDate, dateModified: publishDate }),
    author: {
      "@type": "Person",
      name: "Sarah Mitchell",
      url: "https://weddinggueststyle.com/author/sarah-mitchell",
      jobTitle: "Wedding Style Editor",
    },
    publisher: {
      "@type": "Organization",
      name: "Wedding Guest Style",
      url: "https://weddinggueststyle.com",
      logo: {
        "@type": "ImageObject",
        url: "https://weddinggueststyle.com/icon.svg",
      },
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
  const page = getPublishedPageData(params.slug);
  if (!page) notFound();

  return (
    <>
      <FAQSchema faqs={page.faqs} />
      <BreadcrumbSchema title={page.title} slug={page.slug} />
      <ArticleSchema title={page.metaTitle} description={page.metaDescription} slug={page.slug} intro={page.intro} publishDate={page.publishDate} />
      {page.products.length > 0 && <ItemListSchema products={page.products} title={`Top ${page.title}`} />}

      {/* Page header — editorial */}
      <div className="bg-ivory border-b border-ink-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-16">
          {/* Breadcrumb */}
          <nav
            className="text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-8 flex items-center gap-2"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-blush-600 transition-colors"
            >
              Home
            </Link>
            <span className="text-ink-300">/</span>
            <span className="text-ink-700">{page.title}</span>
          </nav>

          {/* Eyebrow */}
          <p className="eyebrow mb-4">The Edit · {page.products?.length || 0} picks</p>

          {/* H1 — display serif */}
          <h1 className="display-serif text-3xl sm:text-4xl lg:text-5xl text-ink-900">
            {page.h1}
          </h1>

          {/* Author byline */}
          <div className="mt-6">
            <AuthorByline publishDate={page.publishDate} />
          </div>

          {/* Intro */}
          <p className="mt-6 text-base sm:text-lg text-ink-700 leading-[1.75] font-light">
            {page.intro}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
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
              <section key={i} className="mb-10">
                <h2 className="display-serif text-2xl sm:text-3xl text-ink-900 mb-4">
                  {section.heading}
                </h2>
                <div className="text-base text-ink-700 leading-[1.8] whitespace-pre-line font-light">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* FAQ */}
        {page.faqs.length > 0 && <FAQ faqs={page.faqs} />}

        {/* Related Pages — editorial */}
        {page.relatedPages.length > 0 && (
          <section className="py-12 sm:py-16">
            <div className="section-divider mb-12" />
            <p className="eyebrow mb-3">Continue Reading</p>
            <h2 className="display-serif text-2xl sm:text-3xl text-ink-900 mb-8">
              You may also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {page.relatedPages.map((related) => (
                <Link
                  key={related.slug}
                  href={`/${related.slug}`}
                  className="group/related block py-3 border-b border-ink-200 hover:border-blush-400 transition-colors"
                >
                  <span className="block text-base text-ink-800 group-hover/related:text-blush-600 transition-colors font-light leading-snug">
                    {related.title}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-ink-500 mt-1 inline-block">Read →</span>
                </Link>
              ))}
              <Link
                href="/"
                className="group/related block py-3 border-b border-ink-200 hover:border-blush-400 transition-colors"
              >
                <span className="block text-base text-ink-800 group-hover/related:text-blush-600 transition-colors font-light italic display-italic leading-snug">
                  Return to The Edit
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink-500 mt-1 inline-block">All wedding guest dresses →</span>
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
