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
  return (
    <div id={id} className="scroll-mt-20">
      {/* Category header */}
      <div className="mt-14 sm:mt-16 mb-2">
        <div className="section-divider mb-8" />
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {title}
        </h2>
        <p className="text-gray-500 mt-2 max-w-3xl text-sm sm:text-base leading-relaxed">
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-rose-50 via-rose-50/50 to-white py-16 sm:py-24 overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-rose-100/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-amber-50/40 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-rose-500 mb-4">
            Curated Wedding Guest Fashion
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
            Wedding Guest Dresses
          </h1>
          <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find the perfect dress for every wedding. Browse curated collections
            by season, dress code, color, body type, and venue — with honest
            reviews and sizing advice to help you look your best.
          </p>

          {/* Quick category pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              { label: "By Season", href: "#by-season" },
              { label: "By Dress Code", href: "#by-dress-code" },
              { label: "By Color", href: "#by-color" },
              { label: "By Body Type", href: "#by-body-type" },
              { label: "By Style", href: "#by-style" },
              { label: "By Venue", href: "#by-venue" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Trust signal */}
          <p className="mt-8 text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            All dresses hand-picked from top-rated Amazon selections
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* SEO Content Block */}
        <section className="py-12 sm:py-16 max-w-3xl">
          <div className="section-divider mb-12" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Your Complete Guide to Wedding Guest Dresses
          </h2>
          <div className="space-y-5 text-sm sm:text-base leading-relaxed text-gray-600">
            <p>
              Finding the right wedding guest dress can feel overwhelming with so
              many options available. Whether you&apos;re attending a formal
              black-tie affair, a casual backyard celebration, or a destination
              beach wedding, the key is matching your outfit to the occasion
              while expressing your personal style.
            </p>
            <p>
              At Wedding Guest Style, we curate the best wedding guest dresses
              available on Amazon, organized by every category you might search
              for — season, dress code, color, body type, style, and venue. Each
              dress is selected based on customer reviews, quality ratings, and
              real feedback from thousands of shoppers who have worn these
              dresses to actual weddings.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">
              How to Choose the Right Wedding Guest Dress
            </h3>
            <p>
              Start by checking the wedding invitation for any dress code
              guidance. Consider the venue and time of day — an evening ballroom
              wedding calls for something different than a morning garden
              ceremony. Think about the season, as fabric weight and sleeve
              length matter for comfort. Finally, choose a color that you love
              and that suits the occasion. Most importantly, pick a dress you
              feel confident and comfortable wearing.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">
              Wedding Guest Dress Etiquette
            </h3>
            <p>
              The golden rule of wedding guest attire is simple: don&apos;t
              outshine the bride. Avoid wearing white, ivory, or cream. Steer
              clear of overly revealing outfits for religious ceremonies. When
              the invitation says &ldquo;cocktail attire,&rdquo; stick to
              knee-length or midi dresses rather than floor-length gowns. And
              always err on the side of being slightly overdressed rather than
              underdressed — it shows respect for the couple and their special
              day.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">
              Why Shop Wedding Guest Dresses on Amazon?
            </h3>
            <p>
              Amazon offers an unbeatable combination of selection, price, and
              convenience for wedding guest dresses. With thousands of options
              under $50, free Prime shipping, easy returns, and millions of
              verified customer reviews, you can find a stunning dress without
              the stress. Many Amazon dresses rival boutique quality at a
              fraction of the price, and the extensive review system helps you
              gauge fit, fabric quality, and true-to-size accuracy before you
              buy.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ faqs={homepageFaqs} />
      </div>
    </>
  );
}
