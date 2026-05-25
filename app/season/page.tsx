import type { Metadata } from "next";
import PillarHub from "@/components/PillarHub";
import { seasonSections } from "@/lib/homepageData";

export const metadata: Metadata = {
  title: "Wedding Guest Dresses by Season — Summer, Fall, Winter, Spring (2026)",
  description:
    "Wedding guest dresses for every season. Summer cottons, fall long-sleeves, winter velvets, and spring florals — organized by what works when. 2026 edit.",
  alternates: { canonical: "https://weddinggueststyle.com/season" },
};

const longForm = [
  "Season is the most underrated variable in wedding guest dressing. The same dress code phrase — say, \"cocktail attire\" — calls for completely different fabrics and silhouettes in July versus December. A July cocktail dress in lightweight chiffon reads polished and comfortable; the same piece in a December reception reads under-dressed and freezing. Working the other direction, a heavier crepe or velvet cocktail dress that feels elegant indoors in winter feels stifling and sweaty at an outdoor August reception. Picking by season first sidesteps this entire category of mistake.",
  "Summer wedding guest dressing is governed by two constraints: heat regulation and the photograph in direct sunlight. Lightweight natural fabrics — cotton voile, silk-cotton blend, linen blend, soft chiffon — breathe in 85°F+ weather. Polyester-heavy fabrics that look identical in photos cling and trap heat under bright sun. For color, the summer palette skews softer: butter yellow, sage, dusty rose, soft coral, sky blue. Saturated jewel tones can read heavy in bright noon light, though they photograph beautifully at evening events as the sun drops. Silhouettes: midi or maxi length protects shins from outdoor receptions on grass; A-line and slip-style dresses dominate; spaghetti straps and short sleeves are the norm.",
  "Fall is the most forgiving season for wedding guest dressing because the temperature range — typically 55°F to 75°F at most US wedding venues — accommodates the widest variety of fabrics. Lightweight wool, ponte knit, crepe, satin, and velvet all work. The fall color palette is the most photogenic of the year: deep burgundy, oxblood, rust, cognac, deep emerald, chocolate brown, navy, and the saturated jewel tones come into their own. Long sleeves return to dominance in October-November, partly for temperature and partly because the autumn light is gentler — long-sleeve formal dresses photograph particularly well in the warm low-angle light of fall afternoons.",
  "Winter wedding guest dressing is the most challenging because the contrast between heated indoor receptions (often 72°F+) and brutal outdoor transit (often <30°F in January-February) demands layering that doesn't ruin the silhouette of the dress. Solutions: velvet midi dresses with long sleeves do the work without requiring outerwear over them; a structured tailored coat in cashmere or wool that complements (not hides) the dress; opaque tights in deep nude or black for any dress shorter than midi. Color palette skews rich: deep emerald, oxblood, ruby, plum, midnight navy, and the entire jewel-tone family. Pure black is more acceptable in winter than in summer — the funereal association weakens against winter formal lighting.",
  "Spring wedding guest dressing splits between early-spring (which behaves more like late winter — March-early April in much of the country) and late-spring (which behaves like early summer — May into June). Early-spring favors transitional pieces: lighter wool, midweight crepe, ¾ sleeves; the safer color choices are dusty pastels and soft jewel tones that work in both warm and cool light. Late-spring opens up the full summer palette and silhouettes. The key spring constraint is weather volatility — bring a wrap, a light coat, or a structured cardigan that complements the dress, since outdoor ceremony temperatures can swing 20°F across a single afternoon.",
  "Two practical notes that apply across every season. First, always check the venue's expected temperature range, not just the seasonal average — desert weddings can be cold at night even in July; tropical destination weddings can require summer dressing in February. Second, pay attention to fabric memory in your photographs. Wrinkle-prone fabrics (linen, certain silks) photograph beautifully when freshly steamed and badly after eight hours of dancing; if you're attending a long-form celebration, choose fabrics that recover their shape — crepe, ponte, polyester blends designed to look like silk. Comfort and longevity matter as much as the initial visual.",
];

export default function SeasonPillarPage() {
  return (
    <PillarHub
      pillarSlug="season"
      pillarLabel="Season"
      h1="Wedding Guest Dresses by Season"
      intro="Every season has its own dress-code adjustments, fabric expectations, and color palette. This pillar guide breaks down what to wear from summer beach ceremonies to deep-winter ballrooms — and links to our detailed guides for each season."
      sections={seasonSections}
      longFormParagraphs={longForm}
    />
  );
}
