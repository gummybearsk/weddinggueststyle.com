import type { Metadata } from "next";
import PillarHub from "@/components/PillarHub";
import { picksForPillar } from "@/lib/featured";
import { priceAsOfLabel } from "@/lib/amazonData";
import { dressCodeSections } from "@/lib/homepageData";

// Renders live Amazon prices — must revalidate, and therefore MUST be listed in
// next.config.mjs outputFileTracingIncludes (enforced by scripts/check-sitemap-pairing.mjs).
export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Wedding Guest Dress Codes Explained — Black Tie to Casual (2026)",
  description:
    "Every wedding guest dress code decoded: black tie, black tie optional, formal, semi-formal, cocktail, dressy casual, and casual. What each one actually allows.",
  alternates: { canonical: "https://weddinggueststyle.com/dress-code" },
};

const longForm = [
  "The dress code phrase on a wedding invitation is the single most important constraint when choosing what to wear, and also the most frequently mis-read. Couples write dress codes with one set of assumptions; guests interpret them with a different set; and the resulting mismatch produces about half of all wedding-guest dressing anxiety. This pillar guide breaks down every common dress code phrase, what it actually allows, what it actually forbids, and the venues where each one shows up.",
  "Black tie is the most restrictive dress code in mainstream American weddings. For women guests, it means a floor-length gown in formal fabric — silk, satin, chiffon, velvet, or beaded mesh — in evening-appropriate colors (jewel tones, deep neutrals, metallics). Cocktail-length dresses, casual fabrics like cotton, and bright daytime colors are all wrong for true black tie. A black tie reception is almost always evening, often at a hotel ballroom, museum, or estate; the ceremony will be religious or otherwise formal; the meal will be served and plated rather than buffet. When in doubt at black tie, choose longer and more conservative rather than shorter and more revealing.",
  "Black tie optional sits between black tie and formal. Floor-length gowns are still preferred and correct, but a formal cocktail-length dress in a dressy fabric (think beaded sheath, satin midi, or velvet cocktail) is acceptable. The \"optional\" gives guests room to scale slightly down from full black tie without breaking the dress code. A useful rule of thumb: dress as if it were black tie unless the dress code, venue, or season makes that clearly impractical.",
  "Formal — without the \"black tie\" qualifier — is one step less strict. Floor-length is welcome but not required; sophisticated midi-length cocktail dresses in formal fabrics work; men aren't required to wear tuxedos but should wear dark suits with ties. The reception is typically evening and sit-down. Semi-formal is one level less than formal: cocktail dresses dominate, men can wear suits without ties, the meal is more relaxed (often buffet or family-style), and the venue tends toward restaurants, mid-tier hotels, garden venues with reception tents, and similar.",
  "Cocktail attire is the most common dress code on contemporary American wedding invitations. It calls for cocktail-length dresses (knee to mid-calf, or short maxi if very dressy), in fabrics one step up from everyday — chiffon, silk-blend, satin, lace, beaded, or polished crepe. Knee-length is the most common and safest choice. Avoid: anything resembling a daytime sundress; jeans, ever; sequined mini-dresses that read more nightclub than wedding. The cocktail dress code spans the widest range of venues — restaurants, garden ceremonies, mid-formal hotels, and many destination weddings.",
  "Dressy casual and casual are the two most-misinterpreted dress codes. \"Dressy casual\" means defined silhouette, dressier-than-everyday fabric, real shoes (not sneakers). It does NOT mean jeans, t-shirts, casual sundresses, or athletic wear. A sundress in nicer fabric, a midi skirt with a polished top, or a casual cocktail dress all work. \"Casual\" at a wedding is still excludes denim, athletic wear, flip-flops, and shorts. A sundress, a flowy printed midi dress, or a polished separates outfit are all acceptable. Beach and backyard weddings often fall into one of these two categories — but the standard is \"polished casual,\" not \"weekend casual.\"",
  "Two phrases that appear with increasing frequency and confuse most guests: \"festive attire\" and \"garden party attire.\" Festive attire is a contemporary dress code that means cocktail-or-better dress in lively colors, prints, or details — the couple wants the room to feel celebratory rather than uniformly formal. Floral prints, jewel tones, statement accessories, and metallic touches all work. Garden party attire is essentially cocktail with the expectation of outdoor venue: lighter fabrics, midi length preferred over floor-length (which drags on grass), block heels rather than stilettos (which sink), and color choices that read well against greenery (avoid kelly green or pure white which clash or compete).",
];

export default function DressCodePillarPage() {
  return (
    <PillarHub
      pillarSlug="dress-code"
      pillarLabel="Dress Code"
      h1="Wedding Guest Dresses by Dress Code"
      intro="Black tie, cocktail, semi-formal, dressy casual — each phrase has specific meaning, expected fabrics, and silhouettes. This pillar guide decodes every common wedding dress code and links to our detailed picks for each category."
      sections={dressCodeSections}
      longFormParagraphs={longForm}
      products={picksForPillar(dressCodeSections.map((s) => s.slug), 12)}
      asOf={priceAsOfLabel()}
    />
  );
}
