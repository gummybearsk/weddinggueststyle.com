import Link from "next/link";
import type { HomepageSection, Product } from "@/lib/types";
import ProductCarousel from "./ProductCarousel";

interface PillarHubProps {
  pillarSlug: string;       // "season", "color", etc — used for breadcrumb display only (not URL change)
  pillarLabel: string;      // "Season", "Color", etc
  h1: string;
  intro: string;
  sections: HomepageSection[];
  longFormParagraphs: string[]; // 4-6 paragraphs of pillar-level editorial content (1,800+ word target)
  /** Live, in-stock products pooled from this pillar's cluster pages. */
  products?: Product[];
  /** Associates price disclosure — required whenever live prices render. */
  asOf?: string | null;
}

function CollectionPageSchema({ pillarLabel, h1, sections }: { pillarLabel: string; h1: string; sections: HomepageSection[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: h1,
    description: `Wedding guest dresses organized by ${pillarLabel.toLowerCase()}. ${sections.length} curated categories.`,
    url: `https://weddinggueststyle.com/${pillarLabel.toLowerCase().replace(/\s+/g, "-")}`,
    hasPart: sections.map((s) => ({
      "@type": "WebPage",
      name: s.title,
      url: `https://weddinggueststyle.com/${s.slug}`,
      description: s.description,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BreadcrumbSchema({ pillarLabel, pillarSlug }: { pillarLabel: string; pillarSlug: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://weddinggueststyle.com" },
      { "@type": "ListItem", position: 2, name: pillarLabel, item: `https://weddinggueststyle.com/${pillarSlug}` },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function PillarHub({ pillarSlug, pillarLabel, h1, intro, sections, longFormParagraphs, products = [], asOf = null }: PillarHubProps) {
  return (
    <>
      <CollectionPageSchema pillarLabel={pillarLabel} h1={h1} sections={sections} />
      <BreadcrumbSchema pillarLabel={pillarLabel} pillarSlug={pillarSlug} />

      {/* Header */}
      <div className="bg-ivory border-b border-ink-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-16">
          <nav
            className="text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-8 flex items-center gap-2"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-blush-600 transition-colors">Home</Link>
            <span className="text-ink-300">/</span>
            <span className="text-ink-700">{pillarLabel}</span>
          </nav>

          <p className="eyebrow mb-4">Pillar Guide · {pillarLabel}</p>
          <h1 className="display-serif text-3xl sm:text-4xl lg:text-5xl text-ink-900">{h1}</h1>
          <p className="mt-6 text-base sm:text-lg text-ink-700 leading-[1.75] font-light max-w-3xl">{intro}</p>
        </div>
      </div>

      {products.length >= 4 && (
        <section className="bg-cream-50 border-b border-ink-200 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="eyebrow text-blush-600 mb-3">Shop this edit</p>
            <h2 className="display-serif text-2xl sm:text-3xl text-ink-900 mb-2">
              In stock now across {pillarLabel.toLowerCase()}
            </h2>
            <p className="text-sm text-ink-600 font-light mb-8 max-w-2xl leading-relaxed">
              Pulled from the guides below and re-checked against Amazon daily. Anything that
              sells out drops off rather than sitting here as a dead link.
            </p>
            <ProductCarousel products={products} />
            {asOf && (
              <p className="mt-8 text-xs text-ink-500 font-light leading-relaxed">{asOf}</p>
            )}
          </div>
        </section>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Cluster grid — links to all child pages */}
        <section className="mb-16">
          <p className="eyebrow mb-4 text-blush-600">All {pillarLabel} Categories</p>
          <h2 className="display-serif text-2xl sm:text-3xl text-ink-900 mb-8">
            {sections.length} guides under {pillarLabel.toLowerCase()}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`/${section.slug}`}
                className="group block bg-ivory border border-ink-200 hover:border-blush-400 transition-all duration-300 p-6 sm:p-8"
              >
                <h3 className="display-serif text-xl sm:text-2xl text-ink-900 group-hover:text-blush-600 transition-colors mb-3">
                  {section.title}
                </h3>
                <p className="text-sm text-ink-600 leading-relaxed font-light mb-4">
                  {section.description}
                </p>
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink-900 group-hover:text-blush-600 transition-colors border-b border-ink-900 group-hover:border-blush-600 pb-1">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Long-form editorial — pushes word count up + adds topical authority */}
        <section className="prose prose-gray max-w-none">
          <div className="section-divider mb-8" />
          <p className="eyebrow mb-3 text-blush-600">The Pillar</p>
          <h2 className="display-serif text-2xl sm:text-3xl text-ink-900 mb-8">
            Everything you need to know about choosing by {pillarLabel.toLowerCase()}
          </h2>
          <div className="space-y-6 text-base text-ink-700 leading-[1.8] font-light">
            {longFormParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* Back to home */}
        <div className="mt-16 pt-8 border-t border-ink-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-600 hover:text-blush-600 transition-colors"
          >
            <span>←</span>
            <span>Return to The Edit</span>
          </Link>
        </div>
      </div>
    </>
  );
}
