// Revalidate every 12 hours so scheduled pages appear in nav/sitemap
export const revalidate = 43200;

import type { Metadata } from "next";
import Link from "next/link";
import DressCodeDecoderSection from "@/components/DressCodeDecoderSection";
import { getPillarGroups } from "@/lib/taxonomy";
import { getPublishedPageData } from "@/lib/getPages";
import FAQ from "@/components/FAQ";
import ShopTheEdit from "@/components/ShopTheEdit";
import StickyEditorPick from "@/components/StickyEditorPick";
import { getFeatured, getSeasonalEdit, getDeals } from "@/lib/featured";
import { seasonForMonth } from "@/lib/seasonOrder";
import DealsRow from "@/components/DealsRow";
import { priceAsOfLabel } from "@/lib/amazonData";
import {
  seasonSections,
  dressCodeSections,
  colorSections,
  bodyTypeSections,
  styleSections,
  venueSections,
  homepageFaqs,
} from "@/lib/homepageData";
import { orderSeasonSections } from "@/lib/seasonOrder";

export const metadata: Metadata = {
  title: { absolute: "Wedding Guest Attire for Women & Men: Every Dress Code Decoded" },
  description:
    "Wedding guest attire for women and men, decoded for every dress code: white tie, black tie, black tie optional, cocktail, semi-formal, dressy casual and casual. What to wear, what to avoid, with in-stock picks.",
  alternates: {
    canonical: "https://weddinggueststyle.com",
    languages: {
      "en-US": "https://weddinggueststyle.com",
      "x-default": "https://weddinggueststyle.com",
    },
  },
};

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
      "Wedding guest attire for women and men, decoded for every dress code.",
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
  pillarHref,
}: {
  id: string;
  title: string;
  description: string;
  sections: {
    id: string;
    title: string;
    description: string;
    slug: string;
  }[];
  pillarHref: string;
}) {
  // Strip "Wedding Guest Dresses by " prefix for editorial display
  const editorialTitle = title.replace(/^Wedding Guest Dresses by /, '');
  return (
    <div id={id} className="scroll-mt-20">
      {/* Category header — editorial */}
      <div className="mt-16 sm:mt-20 mb-8">
        <div className="section-divider mb-10" />
        <p className="eyebrow mb-3">Volume · {id.replace('by-', '')}</p>
        <h2 className="display-serif text-3xl sm:text-5xl text-ink-900">
          By <span className="display-italic text-blush-600">{editorialTitle}</span>
        </h2>
        <p className="text-ink-600 mt-4 max-w-2xl text-base leading-relaxed font-light">
          {description}
        </p>
        <Link
          href={pillarHref}
          className="inline-block mt-4 text-[11px] uppercase tracking-[0.18em] text-blush-600 border-b border-blush-600 hover:text-ink-900 hover:border-ink-900 transition-colors pb-1"
        >
          Read the full {editorialTitle} pillar guide →
        </Link>
      </div>
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
            <p className="text-sm text-ink-600 leading-relaxed font-light mb-4 line-clamp-3">
              {section.description}
            </p>
            <span className="text-[11px] uppercase tracking-[0.18em] text-ink-900 group-hover:text-blush-600 transition-colors border-b border-ink-900 group-hover:border-blush-600 pb-1">
              Explore →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const featured = getFeatured(6);
  const season = seasonForMonth(new Date().getMonth());
  const seasonalEdit = getSeasonalEdit(season, 4);
  const deals = getDeals(8, 15);
  const seasonLabel = season.charAt(0).toUpperCase() + season.slice(1);
  const asOf = priceAsOfLabel();
  const colorsGuideLive = getPublishedPageData("wedding-guest-dress-colors-to-avoid") !== null;
  const guideGroups = getPillarGroups("dress-code").filter((g) =>
    ["Dress code guides", "For men", "Etiquette: can I wear…?"].includes(g.label),
  );

  return (
    <>
      <FAQSchema />
      <WebsiteSchema />

      {/* Persistent CTA once the reader is past the fold. */}
      <StickyEditorPick product={featured[0]?.products[0] ?? null} />

      {/* Hero — the site's job in one line, then the decoder: the answer above the fold. */}
      <section className="relative bg-ivory pt-10 pb-8 sm:pt-14 sm:pb-10 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6 text-blush-600">
            <span className="hidden sm:block w-12 h-px bg-blush-300" />
            <span className="eyebrow text-blush-600">The dress-code reference · women &amp; men</span>
            <span className="hidden sm:block w-12 h-px bg-blush-300" />
          </div>
          <h1 className="display-serif text-4xl sm:text-6xl lg:text-7xl text-ink-900">
            Wedding Guest Attire, <span className="display-italic text-blush-600">Decoded</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-ink-600 max-w-2xl mx-auto leading-relaxed font-light">
            Wedding guest attire for every dress code on the invitation, for women and for men: what
            each code means, what to wear, what to skip, and the edge cases (time of day, venue,
            color) that decide most outfits.
          </p>
        </div>
      </section>

      <section className="bg-ivory pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <DressCodeDecoderSection />
        </div>
      </section>

      {/* Every guide, generated from the taxonomy so new guides appear here on their publish date. */}
      <section className="bg-white border-y border-ink-200 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-3">The guides</p>
          <h2 className="display-serif text-3xl sm:text-4xl text-ink-900 mb-10">Every dress code, every question</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {guideGroups.map((g) => (
              <div key={g.label}>
                <h3 className="text-[11px] uppercase tracking-[0.18em] text-ink-900 pb-3 mb-3 border-b border-ink-200">{g.label}</h3>
                <ul className="space-y-2.5">
                  {(g.entries ?? []).map((e) => (
                    <li key={e.slug}>
                      <Link href={`/${e.slug}`} className="text-sm text-ink-700 hover:text-blush-600 font-light">{e.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border border-ink-200 bg-cream-50 p-6 sm:p-8 grid gap-4 sm:grid-cols-[1fr_auto] items-center">
            <div>
              <p className="eyebrow mb-2">Original research</p>
              <p className="display-serif text-xl sm:text-2xl text-ink-900">What 10,700 wedding guests asked before they got dressed</p>
              <p className="mt-2 text-sm text-ink-600 font-light">Which dress codes confuse people most, the white worry, lengths, shoes and the wedding season, counted from real posts.</p>
            </div>
            <Link href="/wedding-dress-code-study" className="justify-self-start text-[11px] tracking-[0.18em] uppercase font-medium text-ivory bg-ink-900 hover:bg-blush-600 px-6 py-3 transition-colors">Read the study →</Link>
          </div>
        </div>
      </section>

      {/* Seasonal edit FIRST — a shopper landing in September wants fall, not an essay. */}
      {seasonalEdit.length > 0 && (
        <ShopTheEdit
          featured={seasonalEdit}
          heading={`The ${seasonLabel} Edit`}
          standfirst="What readers are shopping for this season, in stock at today's price."
        />
      )}

      {/* Genuine price drops from the live Amazon feed. Renders nothing if nothing is on sale. */}
      <DealsRow products={deals} asOf={asOf ?? undefined} />

      {/* Products first — the reason people came. */}
      <ShopTheEdit
        featured={featured}
        standfirst="The categories our readers reach for most often."
      />

      {/* Orienting editorial — every claim here traces to SOURCES.md (Emily Post S3/S3b) or
          to the site's own Reddit study. No trend claims: those had no source. */}
      <section className="pt-12 pb-12 sm:pt-16 sm:pb-16 bg-ivory">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">How to use this site</p>
          <h2 className="display-serif text-3xl sm:text-4xl text-ink-900 mb-8">Start with the invitation, then the clock and the venue</h2>
          <div className="space-y-6 text-base leading-[1.8] text-ink-700 font-light">
            <p>
              Wedding guest attire comes down to one line on the invitation. Find your code in the decoder above,
              then open its guide: every guide covers what women wear and what men wear, because couples are
              dressing for the same invitation. Where men&rsquo;s questions differ enough to need their own
              page, there is one, starting with the{" "}
              <Link href="/wedding-dress-code-for-men" className="text-blush-600 hover:underline">wedding dress code for men</Link>.
            </p>
            <p>
              Few guests ask what a dress code means. In our{" "}
              <Link href="/wedding-dress-code-study" className="text-blush-600 hover:underline">study of 10,700 posts</Link>{" "}
              from guests asking strangers whether an outfit works, only 25 asked that in so many words. What
              they ask, over and over, is whether one dress or suit fits the code at one venue and one time of day, and
              the guides are built around exactly those tie-breakers.
            </p>
            <p>
              The Emily Post Institute&rsquo;s wedding guide says the invitation and the time of the wedding are your
              best guide to its formality, and asks two venue questions before anything else: does the couple&rsquo;s
              religion or culture call for head coverings, and would bare shoulders, bare arms or open-toed shoes
              offend? Its attire guide adds a tie-breaker for semi-formal events: if it starts after 6 p.m., err
              toward formality. Our study points the same way: guests asked whether an outfit was too casual more
              often than whether it was too formal.
            </p>
            <p>
              Color is the other recurring worry. &ldquo;Is this too white?&rdquo; posts drew more replies than any other
              question in the study; cream, pale yellow and white-ground florals are the shades people were least
              sure about.
              {/* Linked only once live: an early link to a scheduled page pins a 404 (Rule 17). */}
              {colorsGuideLive && (
                <>
                  {" "}The{" "}
                  <Link href="/wedding-guest-dress-colors-to-avoid" className="text-blush-600 hover:underline">colors to avoid</Link>{" "}
                  guide goes through each one.
                </>
              )}
            </p>
            <h3 className="display-serif text-2xl text-ink-900 pt-6">Our editorial standards</h3>
            <p>
              Wedding Guest Style does not accept paid placements, sponsored reviews, free-product partnerships, or
              pay-to-feature deals. Products are matched to each page by searching Amazon for its topic, and their
              prices and stock are re-checked against Amazon&apos;s API every day. When you click an Amazon affiliate
              link and complete a purchase, we earn a small commission at no cost to you. Commission rates play no part
              in which products appear. The full process is on the{" "}
              <Link href="/editorial" className="text-blush-600 hover:underline">editorial guidelines</Link> page; our
              editor is <Link href="/author/sukie-gao" className="text-blush-600 hover:underline">Sukie Gao</Link>{" "}
              (<a href="https://www.instagram.com/sukiegao/" target="_blank" rel="noopener noreferrer me" className="text-blush-600 hover:underline">@sukiegao</a>).
            </p>
          </div>
        </div>
      </section>

      {/* Category Showcase Grid — visual entry points to each major category */}
      <section className="bg-cream-50 py-16 sm:py-24 border-y border-ink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <p className="eyebrow mb-3">Browse the Edit</p>
            <h2 className="display-serif text-3xl sm:text-5xl text-ink-900 max-w-3xl mx-auto">
              Shopping for the dress?
              <span className="display-italic text-blush-600"> Browse the edit</span>
            </h2>
            <p className="mt-6 text-base sm:text-lg text-ink-600 max-w-2xl mx-auto leading-relaxed font-light">
              Six ways in. Pick the variable that matters most to you and we&apos;ll show you the dresses that work — across every season, dress code, color, body type, silhouette, and venue.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { href: "/season",     label: "By Season",     blurb: "Lightweight summer cottons, fall long-sleeves, cozy winter velvets, and the in-between season pieces that bridge them." },
              { href: "/dress-code", label: "By Dress Code", blurb: "White tie to casual, for women and men — what each code allows, what it rules out, and the edge cases." },
              { href: "/color",      label: "By Color",      blurb: "Every color family, plus the shades guests most often ask about: white, ivory, cream, black and red." },
              { href: "/body-type",  label: "By Body Type",  blurb: "Plus size, petite, maternity, over 50, and for-big-tummy — silhouettes built to flatter, not to hide." },
              { href: "/style",      label: "By Style",      blurb: "Maxi, midi, knee-length, A-line, floral, modest, long sleeve — the cuts and details organized for fast browsing." },
              { href: "/venue",      label: "By Venue",      blurb: "Beach, garden party, vineyard, Indian wedding, formal ballroom — picks that match the location and its hidden expectations." },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group block bg-ivory border border-ink-200 hover:border-blush-400 transition-all duration-500 p-6 sm:p-8"
              >
                <p className="eyebrow mb-3 text-blush-600">{cat.label}</p>
                <p className="text-sm sm:text-base text-ink-700 leading-relaxed font-light mb-4">
                  {cat.blurb}
                </p>
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink-900 group-hover:text-blush-600 transition-colors border-b border-ink-900 group-hover:border-blush-600 pb-1">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* By Season */}
        <CategoryGroup
          id="by-season"
          title="Wedding Guest Dresses by Season"
          description="Choose the right dress for the time of year. Lightweight fabrics for summer, cozy styles for winter, and everything in between."
          sections={orderSeasonSections(seasonSections)}
          pillarHref="/season"
        />

        {/* By Dress Code */}
        <CategoryGroup
          id="by-dress-code"
          title="Wedding Guest Dresses by Dress Code"
          description="Match your outfit to the occasion. From black-tie galas to casual outdoor celebrations, we have you covered."
          sections={dressCodeSections}
          pillarHref="/dress-code"
        />

        {/* By Color */}
        <CategoryGroup
          id="by-color"
          title="Wedding Guest Dresses by Color"
          description="Whether you prefer classic neutrals or bold statement colors, find your perfect shade for the big day."
          sections={colorSections}
          pillarHref="/color"
        />

        {/* By Body Type */}
        <CategoryGroup
          id="by-body-type"
          title="Wedding Guest Dresses by Body Type"
          description="Flattering fits for every figure. Find dresses designed with your body type in mind."
          sections={bodyTypeSections}
          pillarHref="/body-type"
        />

        {/* By Style */}
        <CategoryGroup
          id="by-style"
          title="Wedding Guest Dresses by Style"
          description="From flowing maxis to chic midis, elegant florals to modest options — discover your ideal dress style."
          sections={styleSections}
          pillarHref="/style"
        />

        {/* By Venue */}
        <CategoryGroup
          id="by-venue"
          title="Wedding Guest Dresses by Venue"
          description="Different venues call for different styles. Find the perfect dress for wherever the celebration takes you."
          sections={venueSections}
          pillarHref="/venue"
        />

        {/* FAQ Section */}
        <FAQ faqs={homepageFaqs} />
      </div>
    </>
  );
}
