// Revalidate every 12 hours so scheduled pages appear in nav/sitemap
export const revalidate = 43200;

import SectionBlock from "@/components/SectionBlock";
import FAQ from "@/components/FAQ";
import {
  seasonSections,
  dressCodeSections,
  colorSections,
  bodyTypeSections,
  styleSections,
  venueSections,
  homepageFaqs,
} from "@/lib/homepageData";

function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homepageFaqs.map((faq) => ({
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

function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Wedding Guest Style",
    url: "https://weddinggueststyle.com",
    description:
      "Find the perfect wedding guest dress for every season, dress code, and body type.",
    publisher: {
      "@type": "Organization",
      name: "Wedding Guest Style",
      url: "https://weddinggueststyle.com",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function CategoryGroup({
  id,
  title,
  description,
  sections,
}: {
  id: string;
  title: string;
  description: string;
  sections: {
    id: string;
    title: string;
    description: string;
    slug: string;
    products: {
      title: string;
      image: string;
      url: string;
      price: string;
      rating: number;
      reviewCount: number;
      sizingNote?: string;
    }[];
  }[];
}) {
  // Strip "Wedding Guest Dresses by " prefix for editorial display
  const editorialTitle = title.replace(/^Wedding Guest Dresses by /, '');
  return (
    <div id={id} className="scroll-mt-20">
      {/* Category header — editorial */}
      <div className="mt-16 sm:mt-20 mb-4">
        <div className="section-divider mb-10" />
        <p className="eyebrow mb-3">Volume · {id.replace('by-', '')}</p>
        <h2 className="display-serif text-3xl sm:text-5xl text-ink-900">
          By <span className="display-italic text-blush-600">{editorialTitle}</span>
        </h2>
        <p className="text-ink-600 mt-4 max-w-2xl text-base leading-relaxed font-light">
          {description}
        </p>
      </div>
      {sections.map((section) => (
        <SectionBlock
          key={section.id}
          title={section.title}
          description={section.description}
          slug={section.slug}
          products={section.products}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <FAQSchema />
      <WebsiteSchema />

      {/* Hero Section — editorial */}
      <section className="relative bg-ivory pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Editorial eyebrow */}
          <div className="flex items-center justify-center gap-4 mb-8 text-blush-600">
            <span className="hidden sm:block w-12 h-px bg-blush-300" />
            <span className="eyebrow text-blush-600">The Edit · 2026</span>
            <span className="hidden sm:block w-12 h-px bg-blush-300" />
          </div>

          <h1 className="display-serif text-5xl sm:text-7xl lg:text-8xl text-ink-900">
            Wedding Guest <span className="display-italic text-blush-600">Style</span>
          </h1>

          <p className="mt-8 text-base sm:text-lg text-ink-600 max-w-xl mx-auto leading-relaxed font-light">
            A curated edit of wedding guest dresses for every season,
            dress code, and venue — chosen for the women who get dressed for
            the photograph.
          </p>

          {/* Editorial nav links */}
          <nav className="mt-12 flex flex-wrap justify-center gap-x-6 sm:gap-x-10 gap-y-3 text-[11px] uppercase tracking-[0.18em] text-ink-700 font-medium">
            {[
              { label: "Season", href: "#by-season" },
              { label: "Dress Code", href: "#by-dress-code" },
              { label: "Color", href: "#by-color" },
              { label: "Body Type", href: "#by-body-type" },
              { label: "Style", href: "#by-style" },
              { label: "Venue", href: "#by-venue" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-blush-600 transition-colors border-b border-transparent hover:border-blush-400 pb-1"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Trust signal — refined */}
          <p className="mt-14 text-xs text-ink-500 font-light italic">
            Hand-picked. Honestly reviewed. Wearable for the women who buy them.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 sm:-mt-4">
        {/* By Season */}
        <CategoryGroup
          id="by-season"
          title="Wedding Guest Dresses by Season"
          description="Choose the right dress for the time of year. Lightweight fabrics for summer, cozy styles for winter, and everything in between."
          sections={seasonSections}
        />

        {/* By Dress Code */}
        <CategoryGroup
          id="by-dress-code"
          title="Wedding Guest Dresses by Dress Code"
          description="Match your outfit to the occasion. From black-tie galas to casual outdoor celebrations, we have you covered."
          sections={dressCodeSections}
        />

        {/* By Color */}
        <CategoryGroup
          id="by-color"
          title="Wedding Guest Dresses by Color"
          description="Whether you prefer classic neutrals or bold statement colors, find your perfect shade for the big day."
          sections={colorSections}
        />

        {/* By Body Type */}
        <CategoryGroup
          id="by-body-type"
          title="Wedding Guest Dresses by Body Type"
          description="Flattering fits for every figure. Find dresses designed with your body type in mind."
          sections={bodyTypeSections}
        />

        {/* By Style */}
        <CategoryGroup
          id="by-style"
          title="Wedding Guest Dresses by Style"
          description="From flowing maxis to chic midis, elegant florals to modest options — discover your ideal dress style."
          sections={styleSections}
        />

        {/* By Venue */}
        <CategoryGroup
          id="by-venue"
          title="Wedding Guest Dresses by Venue"
          description="Different venues call for different styles. Find the perfect dress for wherever the celebration takes you."
          sections={venueSections}
        />

        {/* Editorial Content Block */}
        <section className="py-16 sm:py-20 max-w-3xl mx-auto">
          <div className="section-divider mb-12" />
          <p className="eyebrow mb-4">The Guide</p>
          <h2 className="display-serif text-3xl sm:text-4xl text-ink-900 mb-10">
            On Dressing for Someone Else&apos;s Wedding
          </h2>
          <div className="space-y-6 text-base leading-[1.8] text-ink-700 font-light">
            <p>
              Finding the right wedding guest dress is rarely about the dress.
              It&apos;s about the dress code you can&apos;t quite decode, the
              venue you&apos;ve only seen in three Instagram squares, and the
              quiet pressure to look photographed-ready without trying so hard
              that you remember trying. Wedding Guest Style exists for that exact
              moment.
            </p>
            <p>
              Every dress on the site is hand-picked from top-rated listings,
              vetted for fabric quality, fit accuracy, and the kind of polished
              finish that photographs beautifully. We organize by every variable
              that actually matters — season, dress code, color, body type,
              style, and venue — so the search ends in minutes instead of hours.
            </p>

            <h3 className="display-serif text-2xl text-ink-900 pt-8">
              How to Choose the Right Dress
            </h3>
            <p>
              Start with the invitation. The dress code phrase — even a vague
              one — is the single most important constraint. After that:
              consider the venue, the time of day, and the season&apos;s fabric
              demands. An evening ballroom wedding asks for something different
              than a morning vineyard ceremony. Most importantly, choose a dress
              you&apos;ll feel confident in for eight hours straight, including
              the dancing.
            </p>

            <h3 className="display-serif text-2xl text-ink-900 pt-8">
              Wedding Guest Etiquette, Briefly
            </h3>
            <p>
              The unwritten rules: don&apos;t wear white or anything close to
              it. Don&apos;t outshine the bride (you won&apos;t — but the
              attempt shows). Match the formality of your dress to the dress
              code more carefully than the formality of your hair. When in
              doubt, lean slightly more dressed-up rather than down. The
              photograph lasts longer than the discomfort.
            </p>

            <h3 className="display-serif text-2xl text-ink-900 pt-8">
              Our Editorial Standards
            </h3>
            <p>
              We don&apos;t accept paid placements, sponsored reviews, or
              free-product partnerships. Every dress earned its place by review
              quality, fit consistency, and dress code appropriateness. When you
              click an affiliate link and purchase, we earn a commission — at no
              cost to you. That&apos;s how the work gets funded. The editorial
              decisions stay our own.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ faqs={homepageFaqs} />
      </div>
    </>
  );
}
