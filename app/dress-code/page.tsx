import type { Metadata } from "next";
import PillarHub from "@/components/PillarHub";
import DressCodeDecoderSection from "@/components/DressCodeDecoderSection";
import DressCodeLadder from "@/components/visuals/DressCodeLadder";
import { picksForPillar } from "@/lib/featured";
import { getPillarGroups, getPillarSlugs } from "@/lib/taxonomy";
import { dressCodeSections } from "@/lib/homepageData";
import { DRESS_CODE_SOURCE } from "@/lib/dressCodes";

// Renders live Amazon prices — must revalidate, and therefore MUST be listed in
// next.config.mjs outputFileTracingIncludes (enforced by scripts/check-sitemap-pairing.mjs).
export const revalidate = 43200;

export const metadata: Metadata = {
  title: { absolute: "Wedding Dress Codes Explained: Black Tie to Casual (2026)" },
  description:
    "Wedding dress codes explained for women and men: the types of wedding dress codes in order, most formal first — white tie, black tie, black tie optional, cocktail, semi-formal, dressy casual and casual — and what each one means for guests.",
  alternates: { canonical: "https://weddinggueststyle.com/dress-code" },
};

const LADDER_CAPTION = `Garment lists: ${DRESS_CODE_SOURCE.publisher}, "${DRESS_CODE_SOURCE.title}", read ${DRESS_CODE_SOURCE.readOn}. Emily Post files cocktail dresses under semi-formal, so they share a rung.`;

const longForm = [
  "Wedding dress codes are the one line on an invitation that guests most often mis-read, and the reason is rarely the definition. In our analysis of 10,700 posts on r/Weddingattireapproval between April and October 2026, only 25 asked in so many words what a dress code means. What they ask, over and over, is whether one particular dress or suit, at one particular venue and time of day, sits inside it. So this guide works as a ladder plus a set of tie-breakers.",
  "Start with the ladder. From most to least formal, the codes you will meet on a wedding invitation are white tie, black tie, black tie optional, semi-formal (which, in the Emily Post Institute's attire guide, includes the cocktail dress), dressy casual and casual. Each step down loosens length first, then fabric, then the man's jacket and tie. At white tie, the guide lists only a floor-length evening gown for women and a black tailcoat with a white piqué wing-collared shirt, white vest and white bow tie for men. At black tie, women may also wear a dressy cocktail dress or their dressiest little black dress, and men wear a black tuxedo with a black bow tie. Black tie optional keeps the gown and the tuxedo as the ideal but lets men wear a dark suit with a white shirt and conservative tie.",
  "In the middle of the ladder, the semi-formal list is where most weddings sit: a short afternoon or cocktail dress, a little black dress, a long dressy skirt and top or dressy separates for women; a dark business suit, dress shirt, tie and leather dress shoes for men. Many invitations say \"cocktail attire\" for the same thing, and the two words are used interchangeably more often than not. Our semi-formal vs cocktail guide sets out the small differences people do draw between them.",
  "Below that, dressy casual asks women for a dress, a skirt and dressy top or a dressy pants outfit, and men for a sport coat or blazer with slacks, tie optional. Casual is the loosest code: a sundress, a skirt or nice khakis for women, khakis or good jeans with a button-down or polo for men. Emily Post's casual list is written for any event, and even includes shorts, but a wedding is still a ceremony; at a casual wedding, choose the dressier end of each list and real shoes.",
  "Then the tie-breakers, in the order they usually decide the outfit. First, the clock: the Emily Post guide advises erring toward formality when a semi-formal event starts after 6 p.m., and its wedding-guest guide gives men different lists for daytime and evening. Second, the venue: before anything else, Emily Post's wedding guide asks whether the couple's religion or culture calls for head coverings and whether bare shoulders, bare arms or open-toed shoes would offend. Third, the ground: outdoor settings came up in one post in five in our study, and grass and sand rule out stilettos and long trains. Fourth, the color: avoid anything that reads as white in photographs, and check cultural color rules for the couple's tradition.",
  "When the invitation gives no dress code at all, read the invitation itself. Emily Post's wedding guide puts it plainly: the invitation and the time of the wedding will be your best guide to its formality. An engraved card for a 7 p.m. hotel reception is telling you something different from an emailed invitation to a 1 p.m. backyard lunch. Cocktail-level dress, the middle of the ladder, is the safest default, and in our study the \"cocktail or no dress code\" label was the single most common reason guests asked for help.",
  "Men get one guide per code alongside women on every page here, plus dedicated men's guides where the questions are different enough to need one: cocktail attire for men, semi-formal attire for men, beach wedding attire for men and a full wedding dress code for men walk-through. If you are dressing a couple, the decoder above shows both lists side by side for every code.",
];

export default function DressCodePillarPage() {
  return (
    <PillarHub
      pillarSlug="dress-code"
      pillarLabel="Dress Code"
      h1="Wedding Dress Codes Explained: Every Type, for Women and Men"
      answer="Wedding dress codes run, most formal first: white tie, black tie, black tie optional, semi-formal and cocktail, dressy casual, then casual. The higher the code, the longer the dress and the darker and more formal the suit, up to a tuxedo at black tie and a tailcoat at white tie."
      intro="Wedding dress codes tell guests how formal to be, and each phrase on an invitation maps to specific clothes for women and for men. Pick the code from your invitation in the decoder below to see both lists, use the ladder to see where it sits, and open the full guide for the edge cases: time of day, venue, season, colour and what to do when the invitation says nothing at all."
      lead={
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          <DressCodeDecoderSection basePath="/dress-code" />
          <DressCodeLadder caption={LADDER_CAPTION} />
        </div>
      }
      sections={dressCodeSections}
      longFormParagraphs={longForm}
      products={picksForPillar(getPillarSlugs("dress-code"), 12)}
      groups={getPillarGroups("dress-code")}
      sources={[
        {
          publisher: "The Emily Post Institute",
          title: "Attire Guide: Dress Codes from Casual to White Tie",
          url: "https://emilypost.com/advice/attire-guide-dress-codes-from-casual-to-white-tie",
          readOn: "22 October 2026",
          supports: "the women's and men's garments listed for every code on this page, and the after-6 p.m. formality advice",
        },
        {
          publisher: "The Emily Post Institute",
          title: "Wedding Guest Attire: What to Wear to a Wedding",
          url: "https://emilypost.com/advice/wedding-guest-attire",
          readOn: "22 October 2026",
          supports: "the venue questions (head coverings, bare shoulders) and the invitation-and-time rule when no code is given",
        },
      ]}
    />
  );
}
