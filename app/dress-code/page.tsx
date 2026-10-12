import type { Metadata } from "next";
import PillarHub from "@/components/PillarHub";
import { picksForPillar } from "@/lib/featured";
import { getPillarGroups, getPillarSlugs } from "@/lib/taxonomy";
import { dressCodeSections } from "@/lib/homepageData";

// Renders live Amazon prices — must revalidate, and therefore MUST be listed in
// next.config.mjs outputFileTracingIncludes (enforced by scripts/check-sitemap-pairing.mjs).
export const revalidate = 43200;

export const metadata: Metadata = {
  title: { absolute: "Wedding Dress Codes Explained: Black Tie to Casual (2026)" },
  description:
    "Wedding dress codes explained: the different types of wedding dress codes in order, most formal first — black tie, black tie optional, formal, cocktail, semi-formal, dressy casual and casual — and what each means for guests.",
  alternates: { canonical: "https://weddinggueststyle.com/dress-code" },
};

const longForm = [
  "Wedding dress codes are the single most important constraint when choosing what to wear to a wedding, and also the most frequently mis-read. Couples write dress codes with one set of assumptions and guests read them with another, which is where most wedding-guest dressing worries start. This pillar guide breaks down every common dress code phrase, what it actually allows, what it actually forbids, and the venues where each one shows up.",
  "Black tie is the most formal dress code most wedding guests will meet (white tie is rarer still). The Emily Post Institute's attire guide lists three options for women: a \"formal (floor length) evening gown\", a \"dressy cocktail dress\", or \"your dressiest 'little black dress'\". The floor-length gown in a formal fabric — silk, satin, chiffon, velvet or beaded mesh — is the choice that is never questioned; a cocktail dress works only when it is genuinely dressy in fabric and finish. A black tie reception is almost always in the evening, often at a hotel ballroom, museum or estate. When in doubt at black tie, choose longer and more conservative rather than shorter and more revealing.",
  "Black tie optional sits between black tie and formal. Floor-length gowns are still preferred and correct, but a formal cocktail-length dress in a dressy fabric (think beaded sheath, satin midi, or velvet cocktail) is acceptable. The \"optional\" gives guests room to scale slightly down from full black tie without breaking the dress code. A useful rule of thumb: dress as if it were black tie unless the dress code, venue, or season makes that clearly impractical.",
  "Formal — without the \"black tie\" qualifier — is one step less strict. Floor-length is welcome but not required; sophisticated midi-length cocktail dresses in formal fabrics work; men aren't required to wear tuxedos but should wear dark suits with ties. The reception is typically evening and sit-down. Semi-formal is one level less than formal: cocktail dresses dominate, men can wear suits without ties, the meal is more relaxed (often buffet or family-style), and the venue tends toward restaurants, mid-tier hotels, garden venues with reception tents, and similar.",
  "Cocktail attire calls for cocktail-length dresses (knee to mid-calf, or short maxi if very dressy), in fabrics one step up from everyday — chiffon, silk-blend, satin, lace, beaded, or polished crepe. Emily Post's guide files cocktail dresses under semi-formal, listing a \"short afternoon or cocktail dress\", a \"little black dress\" and dressy separates, and notes that \"if the event is later than 6 in the evening, you'll want to err on the side of formality.\" Knee-length is the safest choice. Avoid anything resembling a daytime sundress, and sequined mini-dresses that read more nightclub than wedding. The cocktail dress code spans a wide range of venues — restaurants, garden ceremonies, hotels, and many destination weddings.",
  "Dressy casual and casual are the two codes guests most often second-guess. Emily Post's attire guide lists, for dressy casual, a dress, a skirt and dressy top, a dressy pants outfit, or nice jeans with a dressy top; for casual, a sundress, a long or short skirt, khakis or nice jeans, and even shorts depending on the occasion and climate. Those are general event lists, and a wedding is still a ceremony, so the safer reading for a wedding is the dressier end of each list: a dress, a polished skirt and top, or a tailored pants outfit, with real shoes rather than sneakers. Beach and backyard weddings often fall into one of these two categories — the standard is \"polished casual,\" not \"weekend casual.\"",
  "Two phrases that often confuse guests: \"festive attire\" and \"garden party attire.\" Festive attire is a contemporary dress code that means cocktail-or-better dress in lively colors, prints, or details — the couple wants the room to feel celebratory rather than uniformly formal. Floral prints, jewel tones, statement accessories, and metallic touches all work. Garden party attire is essentially cocktail with the expectation of outdoor venue: lighter fabrics, midi length preferred over floor-length (which drags on grass), block heels rather than stilettos (which sink), and color choices that read well against greenery (avoid kelly green or pure white which clash or compete).",
];

export default function DressCodePillarPage() {
  return (
    <PillarHub
      pillarSlug="dress-code"
      pillarLabel="Dress Code"
      h1="Wedding Dress Codes: The Types, and What Each One Actually Means"
      intro="Wedding dress codes are the single most important line on an invitation and the one guests most often mis-read. Black tie, black tie optional, formal, semi-formal, cocktail, dressy casual, casual — each phrase carries a specific meaning, expected fabrics and silhouettes. This guide decodes every common wedding dress code, explains what each actually allows and forbids, and links to detailed picks for each category."
      sections={dressCodeSections}
      longFormParagraphs={longForm}
      products={picksForPillar(getPillarSlugs("dress-code"), 12)}
      groups={getPillarGroups("dress-code")}
      sources={[
        {
          publisher: "The Emily Post Institute",
          title: "Attire Guide: Dress Codes from Casual to White Tie Formal",
          url: "https://emilypost.com/advice/attire-guide-dress-codes-from-casual-to-white-tie",
          readOn: "12 October 2026",
          supports: "the women's attire listed under black tie, semi-formal (including cocktail dresses), dressy casual and casual on this page, and the after-6pm formality note",
        },
      ]}
    />
  );
}
