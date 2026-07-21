import type { Metadata } from "next";
import PillarHub from "@/components/PillarHub";
import { picksForPillar } from "@/lib/featured";
import { getPillarGroups, getPillarSlugs } from "@/lib/taxonomy";
import { colorSections } from "@/lib/homepageData";

// Renders live Amazon prices — must revalidate, and therefore MUST be listed in
// next.config.mjs outputFileTracingIncludes (enforced by scripts/check-sitemap-pairing.mjs).
export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Wedding Guest Dresses by Color — 2026 Palette Guide",
  description:
    "Butter yellow, sage green, fuchsia, chocolate brown, dusty rose — the 2026 wedding guest color palette and which shades photograph best at every venue.",
  alternates: { canonical: "https://weddinggueststyle.com/color" },
};

const longForm = [
  "Color is the variable wedding guests think about most and analyze worst. Most decisions come down to instinct (\"this color looks good on me\"), but the real question is more layered: does this color work for this season, this venue's lighting, this dress code's expected palette, and the photographs that will exist of you in this dress forever. This pillar guide breaks down the 2026 wedding guest color palette and explains which shades work where.",
  "The defining color story of 2026 wedding guest dressing is the move away from cool-toned pastels (sage, baby blue, dusty lavender — the dominant 2024-2025 palette) toward warmer earth-and-spice tones. Butter yellow is the breakout color of the year — softer than pastel yellow, warmer than cream, with a peachy undertone that flatters most skin tones — and it photographs beautifully in nearly every venue from garden to beach to indoor reception. Chocolate brown has returned from the early 2010s to become a sophisticated alternative to black at fall and winter formal events.",
  "Within the pink spectrum, fuchsia and saturated dark pinks dominate evening events; dusty rose, blush, and pale peach work better at daytime and outdoor events. Avoid baby pink at formal evening weddings — it can read more bridesmaid than guest. Within greens, sage continues to be wedding-friendly but has lost its 2024 dominance to deeper emerald and forest green, especially for fall and winter. Hunter green and bottle green work well at formal evening events; kelly green and bright spring greens read more casual.",
  "For modest and religious-ceremony contexts (Catholic, Orthodox Jewish, Hindu, Muslim, Buddhist), deep jewel tones remain the strongest choice: emerald, sapphire, ruby, plum, deep navy, oxblood. These colors translate across cultures, photograph well in low-light religious venues, and rarely clash with the decor of churches, synagogues, mosques, or temples. Pair with covered shoulders, sleeves, and longer hemlines as appropriate.",
  "What to actively avoid: pure white at any wedding (always — even \"off-white\" or \"ivory\" creeps too close); neon brights at evening formal events (they clash with venue lighting and look chaotic in candle-lit photos); pale ivory in flowing simple silhouettes (drifts toward bridal-adjacent in photographs); pure black at outdoor daytime ceremonies (reads slightly funereal in bright natural light, though it's perfectly fine for evening). If you want a dark dress at a daytime outdoor wedding, choose deep navy, oxblood, chocolate brown, or deep forest green instead of black.",
  "Skin tone interaction with color is real but often misunderstood. The standard \"warm vs cool\" framework is a starting point, not a rule. Most people look good in a wider range of colors than they think, especially when the dress fits well and is the right formality. The bigger factor is the contrast between dress color and your skin and hair — high contrast (pale skin + saturated jewel tone, dark skin + light pastel) creates striking photographs; low contrast (light skin + light pastel, dark skin + deep jewel tone) creates softer, more harmonious photographs. Both work; pick based on the photo style you want.",
  "Coordinating with the wedding party — without competing — is a subtle skill. Most couples will share their color palette either in the invitation or via the wedding website. Avoid the exact same shade as the bridesmaids' dresses; pick a complementary color in the same family (if bridesmaids are in dusty blue, a deep navy or a complementary peach works; an identical dusty blue makes you look mis-pigeonholed in photos). For couples who don't share a palette, default to the season's broader trends rather than guessing — the photographer will thank you.",
];

export default function ColorPillarPage() {
  return (
    <PillarHub
      pillarSlug="color"
      pillarLabel="Color"
      h1="Wedding Guest Dresses by Color"
      intro="The 2026 wedding guest palette — butter yellow, sage, fuchsia, chocolate brown, jewel tones — and which colors work for which season, venue, and dress code. Links to our detailed color guides below."
      sections={colorSections}
      longFormParagraphs={longForm}
      products={picksForPillar(getPillarSlugs("color"), 12)}
      groups={getPillarGroups("color")}
    />
  );
}
