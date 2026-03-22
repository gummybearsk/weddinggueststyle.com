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
    <div id={id} className="scroll-mt-16">
      <div className="border-b border-gray-200 pb-2 mb-4 mt-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {title}
        </h2>
        <p className="text-gray-600 mt-1 max-w-3xl">{description}</p>
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
      <section className="bg-gradient-to-b from-rose-50 to-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Wedding Guest Dresses
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find the perfect dress for every wedding. Browse curated collections
            by season, dress code, color, body type, and venue — with honest
            reviews and sizing advice to help you look your best.
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
        <section className="py-10 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Your Complete Guide to Wedding Guest Dresses
          </h2>
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-700">
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

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
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

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
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

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
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
