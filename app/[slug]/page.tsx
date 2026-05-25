import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import FAQ from "@/components/FAQ";
import AuthorByline from "@/components/AuthorByline";
import { getAllSlugsIncludingScheduled, getPublishedPageData } from "@/lib/getPages";
import { getLayoutPlan, headingClass, eyebrowText } from "@/lib/layoutVariant";
import { getFurtherReading } from "@/lib/furtherReading";
import type { ContentSection } from "@/lib/types";

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
        brand: { "@type": "Brand", name: "Amazon Fashion" },
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
            shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
              transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "DAY" },
            },
            shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "USD" },
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://weddinggueststyle.com" },
      { "@type": "ListItem", position: 2, name: title, item: `https://weddinggueststyle.com/${slug}` },
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
      name: "Sukie Gao",
      url: "https://weddinggueststyle.com/author/sukie-gao",
      image: "https://weddinggueststyle.com/authors/sukie.jpg",
      jobTitle: "Editor",
      sameAs: ["https://www.instagram.com/sukiegao/"],
    },
    publisher: {
      "@type": "Organization",
      name: "Wedding Guest Style",
      url: "https://weddinggueststyle.com",
      logo: { "@type": "ImageObject", url: "https://weddinggueststyle.com/icon.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://weddinggueststyle.com/${slug}` },
    articleBody: intro,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Small reusable layout fragments ────────────────────────────────────────

function ContentSections({
  sections,
  hClass,
  divider,
}: {
  sections: ContentSection[];
  hClass: string;
  divider: boolean;
}) {
  if (!sections.length) return null;
  return (
    <>
      {divider && <div className="section-divider mb-8" />}
      {sections.map((section, i) => (
        <section key={i} className="mb-10">
          <h2 className={`${hClass} mb-4`}>{section.heading}</h2>
          <div className="text-base text-ink-700 leading-[1.8] whitespace-pre-line font-light">
            {section.content}
          </div>
        </section>
      ))}
    </>
  );
}

function ProductBlock({ products, title }: { products: { title: string; image: string; url: string; price: string; rating: number; reviewCount: number; sizingNote?: string }[]; title: string }) {
  if (!products.length) return null;
  return (
    <section className="mb-14">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <ProductGrid products={products} />
    </section>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-14 pl-6 sm:pl-10 border-l-2 border-blush-400">
      <p className="display-serif display-italic italic text-xl sm:text-2xl text-ink-800 leading-snug">
        &ldquo;{children}&rdquo;
      </p>
      <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-ink-500">— Sukie Gao, Editor</p>
    </aside>
  );
}

function FactsBox({
  products,
  category,
}: {
  products: { price: string; rating: number; reviewCount: number }[];
  category: string;
}) {
  if (!products.length) return null;
  const prices = products
    .map((p) => parseFloat(p.price.replace(/[^0-9.]/g, "")))
    .filter((n) => !isNaN(n) && n > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const avgRating = products.reduce((a, p) => a + p.rating, 0) / products.length;
  const totalReviews = products.reduce((a, p) => a + p.reviewCount, 0);
  return (
    <aside className="mb-12 bg-cream-50 border border-ink-200 px-6 py-5 sm:px-8 sm:py-6">
      <p className="eyebrow mb-4 text-blush-600">At a glance</p>
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 text-sm">
        <div>
          <dt className="text-ink-500 text-[11px] uppercase tracking-[0.15em]">Picks</dt>
          <dd className="text-ink-900 font-medium text-lg mt-1">{products.length}</dd>
        </div>
        <div>
          <dt className="text-ink-500 text-[11px] uppercase tracking-[0.15em]">Price range</dt>
          <dd className="text-ink-900 font-medium text-lg mt-1">${minPrice.toFixed(0)}–${maxPrice.toFixed(0)}</dd>
        </div>
        <div>
          <dt className="text-ink-500 text-[11px] uppercase tracking-[0.15em]">Avg rating</dt>
          <dd className="text-ink-900 font-medium text-lg mt-1">{avgRating.toFixed(1)} ★</dd>
        </div>
        <div>
          <dt className="text-ink-500 text-[11px] uppercase tracking-[0.15em]">Total reviews</dt>
          <dd className="text-ink-900 font-medium text-lg mt-1">{totalReviews.toLocaleString()}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-ink-500 italic font-light">
        Stats computed from the {products.length} {category.toLowerCase()} on this page.
      </p>
    </aside>
  );
}

function FurtherReading({ slug }: { slug: string }) {
  const links = getFurtherReading(slug, 3);
  if (!links.length) return null;
  return (
    <aside className="my-12 pt-8 border-t border-ink-200">
      <p className="eyebrow mb-3 text-blush-600">Further Reading</p>
      <p className="text-sm text-ink-600 mb-5 font-light leading-relaxed">
        Authoritative outside perspectives on wedding guest dressing — for the broader context behind our picks.
      </p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.url} className="text-sm">
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blush-600 hover:underline"
            >
              {l.label}
            </a>
            <span className="text-ink-400 text-xs ml-2">↗ {l.publisher}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function RelatedPages({ relatedPages }: { relatedPages: { title: string; slug: string }[] }) {
  if (!relatedPages.length) return null;
  return (
    <section className="py-12 sm:py-16">
      <div className="section-divider mb-12" />
      <p className="eyebrow mb-3">Continue Reading</p>
      <h2 className="display-serif text-2xl sm:text-3xl text-ink-900 mb-8">You may also like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        {relatedPages.map((related) => (
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
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────

export default function InnerPage({ params }: PageProps) {
  const page = getPublishedPageData(params.slug);
  if (!page) notFound();

  const plan = getLayoutPlan(page.slug, page.contentSections.length);
  const hClass = headingClass(plan.headingStyle);
  const eyebrow = eyebrowText(plan.eyebrowStyle, page.products.length || 0);

  const sectionsFirst = page.contentSections.slice(0, plan.splitContentAt);
  const sectionsRest = page.contentSections.slice(plan.splitContentAt);

  // Pull-quote text: take the first sentence of the first content section that's >40 chars.
  const quoteText = (() => {
    const candidate = page.contentSections.find((s) => s.content.length > 40);
    if (!candidate) return "";
    const firstSentence = candidate.content.split(/[.!?]\s/)[0];
    return firstSentence.length > 200 ? firstSentence.slice(0, 200) + "…" : firstSentence;
  })();

  return (
    <>
      <FAQSchema faqs={page.faqs} />
      <BreadcrumbSchema title={page.title} slug={page.slug} />
      <ArticleSchema title={page.metaTitle} description={page.metaDescription} slug={page.slug} intro={page.intro} publishDate={page.publishDate} />
      {page.products.length > 0 && <ItemListSchema products={page.products} title={`Top ${page.title}`} />}

      {/* Page header — consistent across all pages (H1, byline, intro for SEO consistency) */}
      <div className="bg-ivory border-b border-ink-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-16">
          <nav
            className="text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-8 flex items-center gap-2"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-blush-600 transition-colors">Home</Link>
            <span className="text-ink-300">/</span>
            <span className="text-ink-700">{page.title}</span>
          </nav>

          <p className="eyebrow mb-4">{eyebrow}</p>

          <h1 className="display-serif text-3xl sm:text-4xl lg:text-5xl text-ink-900">{page.h1}</h1>

          <div className="mt-6">
            <AuthorByline publishDate={page.publishDate} />
          </div>

          <p className="mt-6 text-base sm:text-lg text-ink-700 leading-[1.75] font-light">{page.intro}</p>
        </div>
      </div>

      {/* Body — layout varies by slug-derived plan */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {plan.showFactsBox && (
          <div className="pt-10">
            <FactsBox products={page.products} category={page.title} />
          </div>
        )}

        {plan.variant === "A" && (
          <>
            <ProductBlock products={page.products} title={`Top ${page.title}`} />
            <ContentSections sections={page.contentSections} hClass={hClass} divider={plan.showSectionDividers} />
            {page.faqs.length > 0 && <FAQ faqs={page.faqs} />}
            <FurtherReading slug={page.slug} />
            <RelatedPages relatedPages={page.relatedPages} />
          </>
        )}

        {plan.variant === "B" && (
          <>
            <ContentSections sections={sectionsFirst} hClass={hClass} divider={plan.showSectionDividers} />
            <ProductBlock products={page.products} title={`Top ${page.title}`} />
            <ContentSections sections={sectionsRest} hClass={hClass} divider={false} />
            <FurtherReading slug={page.slug} />
            {page.faqs.length > 0 && <FAQ faqs={page.faqs} />}
            <RelatedPages relatedPages={page.relatedPages} />
          </>
        )}

        {plan.variant === "C" && (
          <>
            <ProductBlock products={page.products} title={`Top ${page.title}`} />
            <ContentSections sections={sectionsFirst} hClass={hClass} divider={plan.showSectionDividers} />
            {plan.showPullQuote && quoteText && <PullQuote>{quoteText}</PullQuote>}
            <ContentSections sections={sectionsRest} hClass={hClass} divider={false} />
            <RelatedPages relatedPages={page.relatedPages} />
            <FurtherReading slug={page.slug} />
            {page.faqs.length > 0 && <FAQ faqs={page.faqs} />}
          </>
        )}

        {plan.variant === "D" && (
          <>
            <ProductBlock products={page.products} title={`Top ${page.title}`} />
            <FurtherReading slug={page.slug} />
            <ContentSections sections={page.contentSections} hClass={hClass} divider={plan.showSectionDividers} />
            {page.faqs.length > 0 && <FAQ faqs={page.faqs} />}
            <RelatedPages relatedPages={page.relatedPages} />
          </>
        )}

        {plan.variant === "E" && (
          <>
            <ContentSections sections={page.contentSections} hClass={hClass} divider={plan.showSectionDividers} />
            {plan.showPullQuote && quoteText && <PullQuote>{quoteText}</PullQuote>}
            <ProductBlock products={page.products} title={`Top ${page.title}`} />
            <FurtherReading slug={page.slug} />
            <RelatedPages relatedPages={page.relatedPages} />
            {page.faqs.length > 0 && <FAQ faqs={page.faqs} />}
          </>
        )}
      </div>
    </>
  );
}
