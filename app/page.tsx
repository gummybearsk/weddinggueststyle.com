// Revalidate every 12 hours so scheduled pages appear in nav/sitemap
export const revalidate = 43200;

import Link from "next/link";
import FAQ from "@/components/FAQ";
import ShopTheEdit from "@/components/ShopTheEdit";
import { getFeatured } from "@/lib/featured";
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

  return (
    <>
      <FAQSchema />
      <WebsiteSchema />

      {/* Hero Section — slim editorial */}
      <section className="relative bg-ivory pt-10 pb-6 sm:pt-14 sm:pb-8 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Editorial eyebrow */}
          <div className="flex items-center justify-center gap-4 mb-6 text-blush-600">
            <span className="hidden sm:block w-12 h-px bg-blush-300" />
            <span className="eyebrow text-blush-600">The Edit · 2026</span>
            <span className="hidden sm:block w-12 h-px bg-blush-300" />
          </div>

          <h1 className="display-serif text-5xl sm:text-7xl lg:text-8xl text-ink-900">
            Wedding Guest <span className="display-italic text-blush-600">Style</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-ink-600 max-w-xl mx-auto leading-relaxed font-light">
            A curated edit of wedding guest dresses for every season,
            dress code, and venue — chosen for the women who get dressed for
            the photograph.
          </p>
        </div>
      </section>

      {/* Short orienting block. Readers arrive from search wanting a dress — this establishes
          who we are in a few lines, then gets out of the way so the products can load above
          the fold rather than behind a wall of editorial. */}
      <section className="pt-4 pb-10 sm:pt-6 sm:pb-12 bg-ivory">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-5 text-base leading-[1.8] text-ink-700 font-light">
            <p>
              The invitation says &ldquo;cocktail attire&rdquo; and gives you nothing else to work
              with. We cover more than 100 wedding-guest scenarios — by season, dress code, colour,
              fit and venue — and for each one we keep a short list of dresses that are actually in
              stock, at today&rsquo;s price.
            </p>
            <p>
              Below is what readers are shopping for right now, pulled straight from what performs
              in search. Every guide behind it is written by our editor{" "}
              <Link href="/author/sukie-gao" className="text-blush-600 hover:underline">Sukie Gao</Link>,
            </p>
          </div>
        </div>
      </section>

      {/* Products first — the reason people came. */}
      <ShopTheEdit
        featured={featured}
        standfirst="The categories our readers reach for most often."
      />

      {/* Editorial intro content — moved up directly after hero for SEO + authority */}
      <section className="pt-4 pb-12 sm:pt-6 sm:pb-16 bg-ivory">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">The Guide</p>
          <h2 className="display-serif text-3xl sm:text-4xl text-ink-900 mb-10">
            On Dressing for Someone Else&apos;s Wedding
          </h2>

          <div className="space-y-6 text-base leading-[1.8] text-ink-700 font-light">
            <p>
              Wedding guest dressing in 2026 is harder than it should be. The dress code phrase on the invitation is ambiguous, the venue lives in three Instagram squares, and the quiet pressure to look photographed-ready without trying so hard that you remember trying never quite goes away. Wedding Guest Style exists for that exact moment — the few weeks between RSVP and ceremony when you need a real, useful answer to &ldquo;what do I wear.&rdquo;
            </p>
            <p>
              We cover more than 100 different wedding-guest scenarios — by season, dress code, colour, body type, silhouette and venue — with a short list of picks for each. Every dress is chosen for fabric quality, construction, and the kind of finish that photographs well in mixed wedding lighting, with an honest note whenever a listing&apos;s sizing runs away from what it claims.
            </p>

            <h3 className="display-serif text-2xl text-ink-900 pt-8">
              How to choose the right wedding guest dress
            </h3>
            <p>
              Start with the invitation. The dress code phrase — even a vague one — is the single most important constraint. &ldquo;Black tie&rdquo; means floor-length, no exceptions. &ldquo;Black tie optional&rdquo; permits formal cocktail-length in dressy fabric. &ldquo;Cocktail&rdquo; sits between midi and knee-length in evening-appropriate construction. &ldquo;Semi-formal&rdquo; opens the door to fluid midi silhouettes in chiffon or silk-blend. &ldquo;Dressy casual&rdquo; means defined-silhouette in dressier-than-everyday fabric with real shoes — not jeans, never sneakers. &ldquo;Casual&rdquo; at a wedding still excludes the things that read truly casual: jeans, t-shirts, flip-flops, athletic anything.
            </p>
            <p>
              After dress code, the next constraints in order: venue (outdoor grass or sand affects shoe choice; religious ceremonies usually require more modest coverage), time of day (afternoon ceremonies welcome lighter fabrics and softer colors; evening events shift toward formal fabrics and richer palettes), and season (lightweight cotton-voile or silk-cotton blend for summer; wool-blend crepe or velvet for winter). Most importantly: choose a dress you&apos;ll feel confident in for eight hours straight, ceremony through reception. The photograph lasts decades; the discomfort of a dress that looked good in the mirror but pinches by hour three doesn&apos;t.
            </p>

            <h3 className="display-serif text-2xl text-ink-900 pt-8">
              The 2026 wedding guest palette
            </h3>
            <p>
              The defining color story of 2026 is the move away from cool-toned pastels (sage, baby blue, dusty lavender — the 2024-2025 palette) toward warmer earth-and-spice tones. Butter yellow is the breakout color of the year — softer than pastel yellow, warmer than cream — and it photographs beautifully in nearly every venue from garden to beach to indoor reception. Chocolate brown has returned from the 2010s to become a sophisticated alternative to black at fall and winter formal events. Fuchsia, dusty rose, and saturated dark pink dominate the pink spectrum. Terracotta, rust, and cognac anchor the warm-earth palette. For modest and religious-ceremony contexts, deep jewel tones (emerald, sapphire, ruby, plum) remain the strongest choice.
            </p>
            <p>
              What to actively avoid: pure white at any wedding (always), neon brights at evening formal (clash with venue lighting), pale ivory in flowing simple silhouettes (drifts toward bridal-adjacent in photos), and pure black at outdoor afternoon ceremonies (reads slightly funereal in bright natural light). If you want a dark dress at a daytime outdoor wedding, choose deep navy, oxblood, chocolate brown, or deep forest green instead of black.
            </p>

            <h3 className="display-serif text-2xl text-ink-900 pt-8">
              Wedding guest etiquette, briefly
            </h3>
            <p>
              The unwritten rules: never wear white or anything close to it. Don&apos;t try to outshine the bride — you won&apos;t, but the attempt shows in photographs years later. Match the formality of your dress to the dress code more carefully than the formality of your hair or makeup. When in doubt, lean slightly more dressed-up rather than down. Bring a wrap or pashmina for outdoor weddings — temperatures drop 15-20°F once the sun sets, and you&apos;ll want it before the reception ends. Tip the photographers and the bartenders. RSVP on time. The photograph lasts longer than the discomfort, the conversation, or the cost of the dress.
            </p>

            <h3 className="display-serif text-2xl text-ink-900 pt-8">
              Our editorial standards
            </h3>
            <p>
              Wedding Guest Style does not accept paid placements, sponsored reviews, free-product partnerships, or pay-to-feature deals. Every dress on the site earned its place by review quality, fit consistency, and dress code appropriateness for the specific category page it appears on. When you click an Amazon affiliate link and complete a purchase, we earn a small commission — at no cost to you. That commission funds the editorial work behind the site. Editorial decisions stay our own. A dress doesn&apos;t get featured because of commission rate; it gets featured because we&apos;d genuinely recommend it to a friend attending the same wedding.
            </p>
            <p>
              You can read more about our review process in <Link href="/editorial" className="text-blush-600 hover:underline">Editorial Guidelines</Link>, our editor <Link href="/author/sukie-gao" className="text-blush-600 hover:underline">Sukie Gao</Link> (<a href="https://www.instagram.com/sukiegao/" target="_blank" rel="noopener noreferrer me" className="text-blush-600 hover:underline">@sukiegao</a>), or how we make money in our <Link href="/about" className="text-blush-600 hover:underline">About</Link> page. All affiliate disclosures and policies are in <Link href="/privacy" className="text-blush-600 hover:underline">Privacy</Link> and <Link href="/terms" className="text-blush-600 hover:underline">Terms</Link>.
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
              Find your wedding guest dress, organized
              <span className="display-italic text-blush-600"> the way you actually shop</span>
            </h2>
            <p className="mt-6 text-base sm:text-lg text-ink-600 max-w-2xl mx-auto leading-relaxed font-light">
              Six ways in. Pick the variable that matters most to you and we&apos;ll show you the dresses that work — across every season, dress code, color, body type, silhouette, and venue.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { href: "/season",     label: "By Season",     blurb: "Lightweight summer cottons, fall long-sleeves, cozy winter velvets, and the in-between season pieces that bridge them." },
              { href: "/dress-code", label: "By Dress Code", blurb: "Black-tie, black-tie optional, formal, semi-formal, cocktail, dressy casual, casual — decoded with what each actually allows." },
              { href: "/color",      label: "By Color",      blurb: "Butter yellow, fuchsia, dusty rose, chocolate brown, sage green — the 2026 palette with the shades that photograph best." },
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
          sections={seasonSections}
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
