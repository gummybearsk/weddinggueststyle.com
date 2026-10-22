import type { Metadata } from "next";
import PillarHub from "@/components/PillarHub";
import BarChart from "@/components/visuals/BarChart";
import CompareTable from "@/components/visuals/CompareTable";
import { picksForPillar } from "@/lib/featured";
import { getPillarGroups, getPillarSlugs } from "@/lib/taxonomy";
import { styleSections } from "@/lib/homepageData";

// Renders live Amazon prices — must revalidate, and therefore MUST be listed in
// next.config.mjs outputFileTracingIncludes (enforced by scripts/check-sitemap-pairing.mjs).
export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Wedding Guest Dresses by Style — Maxi, Midi, Floral, Modest, Long Sleeve",
  description:
    "Wedding guest dresses organized by silhouette and style: maxi, midi, knee-length, A-line, floral, modest, long-sleeve, and more. Picks for every preference.",
  alternates: { canonical: "https://weddinggueststyle.com/style" },
};

const STUDY_SOURCE =
  "Source: weddinggueststyle.com analysis of 10,700 r/Weddingattireapproval posts, 16 April – 21 October 2026 (Arctic Shift archive)";

// Women's lists from the Emily Post attire guide (SOURCES.md S3, read 2026-10-22), sorted
// by length. "Not listed" means the source names no garment of that kind for the code.
const LENGTH_BY_CODE = [
  { label: "White tie", cells: ["Floor-length evening gown (the only option listed)", "Not listed", "Not listed"] },
  { label: "Black tie", cells: ["Floor-length evening gown", "Dressy cocktail dress; your dressiest little black dress", "Not listed"] },
  { label: "Black tie optional", cells: ["Floor-length evening gown", "Dressy cocktail dress; a little black dress", "Dressy separates"] },
  { label: "Semi-formal & cocktail", cells: ["Long dressy skirt and top", "Short afternoon or cocktail dress; a little black dress", "Dressy separates; a dressy pantsuit for evening (wedding guest guide)"] },
  { label: "Dressy casual", cells: ["A dress (no length given)", "A dress (no length given)", "Skirt and dressy top; dressy pants outfit; nice jeans with a dressy top"] },
  { label: "Casual", cells: ["Long skirt", "Sundress; short skirt", "Khakis or nice jeans; shorts depending on occasion and climate"] },
];

// Posts matching each length pattern at least once (title + body, lowercased, black/white tie masked).
const LENGTHS = [
  { label: "Maxi, floor-length or gown", value: 994, highlight: true },
  { label: "Midi", value: 456 },
  { label: "Jumpsuit, pants or pantsuit", value: 310 },
  { label: "Mini or \"short dress\"", value: 72 },
  { label: "Knee-length", value: 70 },
  { label: "Tea-length", value: 63 },
];

const longForm = [
  "Style is your choice inside the dress code, not a way around it. The invitation sets the level of formality; length, silhouette, fabric and detail are how you meet it in a way that suits you. That is why this hub is organized as it is: length first, because length carries formality more directly than anything else, then silhouette, then details and accessories. Each guide listed above explains where its style fits on the dress-code ladder, and the dress-code guides (white tie, black tie, black tie optional, cocktail and semi-formal, dressy casual and casual) explain the ladder itself.",
  "The table above shows how much length matters to the rules. In the Emily Post Institute's attire guide, white tie lists only a floor-length evening gown for women. Black tie still puts the gown first but allows a dressy cocktail dress or your dressiest little black dress. Black tie optional adds dressy separates. From semi-formal down, the long option becomes a long dressy skirt and top rather than a gown, short afternoon and cocktail dresses take over, and separates multiply until casual, which lists a sundress, skirts, khakis or nice jeans and even shorts \"depending on occasion and climate\". Read across a row and you have every length that is correct for that code; read down a column and you can see where a given length stops being enough.",
  "Guests talk about length in roughly that order of seriousness. In our study of 10,700 posts on r/Weddingattireapproval, maxi, floor-length or gown appears in 994 posts, more than twice as many as midi (456). Jumpsuits, pants and pantsuits come up in 310, while mini or \"short dress\" (72), knee-length (70) and tea-length (63) trail far behind. The gown count is inflated by the bride's own gown and by guests describing formal codes, but the gap is still telling: long dresses are where guests most want a second opinion, which makes sense, because a long dress can be right at every code from casual to white tie and only the fabric tells you which.",
  "That worry runs mostly in one direction. In the same study, 736 posts ask whether an outfit is too casual or dressy enough, against 477 asking whether it is too formal or overdressed. Underdressing is the more common fear, and the dress-code ladder is the cure for both: if your length appears in your code's row, the length is right, and the remaining question is fabric.",
  "Many style questions are really comparisons. The study counts 863 posts asking readers to choose between two or more outfits (\"which one\", \"option 1 or 2\", \"help me pick\"), more than the posts worried about being overdressed. When two candidates both appear in your code's row of the table, the tie-breakers are practical rather than rule-based: which one suits the venue's ground and the time of day, which one you can sit, eat and dance in for six hours, and which one needs fewer alterations to fit. The guides below are written to settle those comparisons for each length and silhouette.",
  "Length. The maxi wedding guest dresses guide is the clearest example of how fabric sets the level within one length: a maxi in satin, silk, crepe or sequins fits black tie and formal evenings, a chiffon or crepe maxi suits cocktail, semi-formal and garden weddings, and a cotton, linen or jersey maxi belongs at casual and beach weddings. The midi wedding guest dresses guide covers the most flexible length, correct at casual, garden, cocktail, semi-formal and black tie optional weddings and at formal ones in a dressy fabric; at strict black tie a floor-length gown is the safer choice, although Emily Post also accepts a dressy cocktail dress. The tea length wedding guest dresses guide covers the hem between the two, especially useful at outdoor ceremonies, churches and afternoon events where a full gown can feel heavy.",
  "Silhouette. The A-line wedding guest dresses guide makes the point that silhouette alone does not set formality: an A-line works at every code because the length and fabric decide the level, from a floor-length A-line gown in satin or crepe at black tie to a cotton or chiffon A-line at a casual wedding. The elegant wedding guest dresses guide argues that elegance comes from fabric, fit and restraint rather than price or label: a substantial fabric, a clean line that skims rather than clings, and one focal point in the styling. The floral wedding guest dresses guide sets out when a print can go formal, which is when it is large or on a dark ground and the fabric is crepe, satin or chiffon at midi or maxi length; at casual, garden, cocktail and semi-formal weddings, florals are straightforward. Pockets have a guide of their own, too: wedding guest dresses with pockets explains which skirts hide a side-seam pocket well and, citing the Victoria and Albert Museum, how women once wore tie-on pockets around the waist, separate from their clothes and reached through openings in the dress, from about 1650 to the end of the 19th century.",
  "Details. Two of the most-asked style questions are about how much skin is right. Posts asking whether a look is too revealing, too short, too low or too tight, or mentioning cleavage, a slit, a backless cut or sheer fabric, number 540 in the study, and slits alone come up in 144. The sexy wedding guest dresses guide handles this directly: one bold detail, such as a thigh slit, an open back, one shoulder or bias-cut satin, on an otherwise calm dress in a formal fabric and a deep color, with the length still matched to the code. The long sleeve wedding guest dresses guide covers the opposite end, and sleeves more generally, by season: sheer mesh, lace or chiffon sleeves for warm months, velvet, crepe and satin when it is cold. If the ceremony is in a house of worship, the Emily Post Institute's wedding guest guide suggests finding out whether bare shoulders or arms would offend before you choose.",
  "Accessories. The accessories guides finish the outfit rather than change its formality. How to accessorize a wedding guest dress works in a set order: let the dress color choose one metal (gold for warm colors, silver for cool), use it on every piece including bag and shoe hardware, and size earrings to the neckline, which often means skipping the necklace. Wedding guest cover-ups and wraps matches the layer to the code and the month, from a lace or chiffon bolero that covers shoulders for a summer church ceremony to a velvet or wool layer for winter. Wedding guest shoes for fall explains why a wide heel base, such as a block heel, wedge, dressy ankle boot or pointed flat, beats a stiletto on damp grass and gravel.",
  "Pants count as style too. The Emily Post attire guide lists dressy separates at black tie optional and semi-formal and a dressy pants outfit at dressy casual, and its wedding guest guide names a dressy pantsuit for semiformal evening weddings. A jumpsuit or tailored trouser in an evening fabric is therefore a correct choice from black tie optional down; at white tie and strict black tie, the lists do not include it. Fabric again sets the level: the same cut reads very differently in satin and in linen.",
  "Time of day shifts the answer within a single code. Emily Post's wedding guest guide gives women different lists for daytime and evening formal weddings: a cocktail or dressy afternoon dress for a formal daytime wedding, and a long evening dress or dressy cocktail dress for a formal evening one. Its attire guide adds that a semi-formal event starting after 6 p.m. calls for erring toward formality. In style terms, that means a knee-length or midi dress is more at home at a daytime formal wedding than at the same code after dark, when the floor-length options move to the front. Invitations that simply say \"formal\" sit in a gap: the formal wedding guest dresses guide notes that Emily Post has no separate formal code and reads it as just below black tie, which puts floor-length gowns and dressy midi or tea-length dresses in evening fabrics in range.",
  "Men's style follows the same principle with fewer variables. The attire guide's men's lists change the garment at each step, from a tailcoat at white tie and a tuxedo at black tie to a dark suit at semi-formal and a sport coat or blazer at dressy casual, and the guide's business-formal note says the darker the suit, the more formal. Within a code, men's style lives in the shade of the suit, the tie and the shoe. The wedding dress code for men guide covers each list.",
  "The mistakes worth avoiding come down to treating style as a substitute for formality. A beautiful midi in cotton is still a casual dress at a black tie wedding. A floor-length dress in jersey reads relaxed, not formal, because the fabric has the last word. A floral print on a white base runs into the white rule regardless of silhouette, so check the color hub first. And one bold detail looks deliberate where three look like a different event. Choose the length from your code's row in the table, choose a fabric that matches the code, then let the silhouette and detail be yours.",
];

export default function StylePillarPage() {
  return (
    <PillarHub
      pillarSlug="style"
      pillarLabel="Style"
      h1="Wedding Guest Dresses by Style"
      answer="Style is your choice within the dress code, not a substitute for it. Length carries formality first: Emily Post lists only a floor-length gown for white tie, allows a dressy cocktail dress at black tie, and opens up short dresses, long skirts and separates from semi-formal down. Fabric then sets the level within a length, so the same maxi reads formal in satin and casual in cotton."
      intro="Maxi, midi, tea-length, A-line, floral, sleeves, pockets and the details and accessories that finish an outfit. The table below shows which lengths each dress code allows; the guides under it explain where each style fits and which fabric makes it formal enough."
      lead={
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr] items-start">
          <CompareTable
            kind="compare"
            title="Which lengths each dress code lists for women"
            columns={["Long", "Short or knee", "Separates and pants"]}
            rows={LENGTH_BY_CODE}
            caption={"Source: The Emily Post Institute, \"Attire Guide: Dress Codes from Casual to White Tie\", women's lists, read 22 October 2026; the dressy pantsuit is from its \"Wedding Guest Attire\" guide. Emily Post files cocktail dresses under semi-formal, so the two share a row. \"Not listed\" means the guide names no garment of that kind for the code."}
          />
          <BarChart
            kind="bars"
            title="Lengths guests ask about: posts mentioning each"
            data={LENGTHS}
            caption={`Method: a post counts once per pattern (title and body, lowercased; "black tie" and "white tie" masked). Regexes: \\b(maxi|floor[- ]length|gown)\\b; \\bmidi\\b; \\b(jumpsuit|pants|trousers|pantsuit)\\b; \\b(mini|short dress)\\b; knee[- ]length; tea[- ]length. "Gown" also matches mentions of the bride's gown. ${STUDY_SOURCE}.`}
          />
        </div>
      }
      sections={styleSections}
      longFormParagraphs={longForm}
      products={picksForPillar(getPillarSlugs("style"), 12)}
      groups={getPillarGroups("style")}
      sources={[
        {
          publisher: "The Emily Post Institute",
          title: "Attire Guide: Dress Codes from Casual to White Tie",
          url: "https://emilypost.com/advice/attire-guide-dress-codes-from-casual-to-white-tie",
          readOn: "22 October 2026",
          supports: "women's garment lists for every code (the length table), men's lists, and the darker-suit-is-more-formal note",
        },
        {
          publisher: "The Emily Post Institute",
          title: "Wedding Guest Attire: What to Wear to a Wedding",
          url: "https://emilypost.com/advice/wedding-guest-attire",
          readOn: "22 October 2026",
          supports: "the dressy pantsuit for semiformal evening weddings; asking whether bare shoulders or arms would offend",
        },
        {
          publisher: "Victoria and Albert Museum",
          title: "Women's tie-on pockets",
          url: "https://www.vam.ac.uk/articles/womens-tie-pockets",
          readOn: "22 October 2026",
          supports: "tie-on pockets worn around the waist, reached through openings in the dress, c. 1650 to the end of the 19th century",
        },
        {
          publisher: "weddinggueststyle.com analysis of r/Weddingattireapproval",
          title: "10,700 posts, 16 April – 21 October 2026 (Arctic Shift archive; aggregate counts only)",
          url: "https://www.reddit.com/r/Weddingattireapproval/",
          readOn: "22 October 2026",
          supports: "length mentions (maxi/floor/gown 994, midi 456, pants 310, mini 72, knee 70, tea 63); too casual 736 vs too formal 477; too revealing 540; slit 144",
        },
      ]}
    />
  );
}
