import type { Metadata } from "next";
import PillarHub from "@/components/PillarHub";
import BarChart from "@/components/visuals/BarChart";
import { picksForPillar } from "@/lib/featured";
import { getPillarGroups, getPillarSlugs } from "@/lib/taxonomy";
import { colorSections } from "@/lib/homepageData";

// Renders live Amazon prices — must revalidate, and therefore MUST be listed in
// next.config.mjs outputFileTracingIncludes (enforced by scripts/check-sitemap-pairing.mjs).
export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Wedding Guest Dresses by Color — 2026 Palette Guide",
  // The previous description promised "the 2026 wedding guest color palette", an invented
  // trend claim (SOURCES.md does-not-exist list). Rewritten to what the page actually covers.
  description:
    "Wedding guest dresses by color: black, brown, pink, blue, green, red, yellow and metallics, which shades suit each dress code and season, and the colors that need care, starting with anything that reads as white.",
  alternates: { canonical: "https://weddinggueststyle.com/color" },
};

const STUDY_SOURCE =
  "Source: weddinggueststyle.com analysis of 10,700 r/Weddingattireapproval posts, 16 April – 21 October 2026 (Arctic Shift archive)";

// Posts mentioning each color word at least once (title + body, lowercased). "black tie" and
// "white tie" masked first so dress codes are not counted as colors. Regex per color:
// \b<color>s?\b (navy, burgundy, sage, champagne, ivory, beige, nude without the plural).
const COLOR_MENTIONS = [
  { label: "White", value: 2075, highlight: true },
  { label: "Black", value: 1048 },
  { label: "Blue", value: 800 },
  { label: "Green", value: 663 },
  { label: "Pink", value: 457 },
  { label: "Gold", value: 370 },
  { label: "Red", value: 358 },
  { label: "Brown", value: 327 },
  { label: "Yellow", value: 318 },
  { label: "Navy", value: 316 },
  { label: "Cream", value: 258 },
  { label: "Silver", value: 177 },
  { label: "Nude", value: 155 },
  { label: "Purple", value: 149 },
  { label: "Burgundy", value: 147 },
];

const longForm = [
  "Color is the part of a wedding outfit that etiquette rules say least about and guests worry about most. The Emily Post Institute's attire guide, the reference this site uses for every dress code, lists garments for each level of formality and does not assign colors to any of them; its wedding guest guide does not address white, black or red at all. The color rules guests actually follow come from the couple, from culture, and from named etiquette experts quoted in the press. This hub gathers those rules, then sends you to the guide for the color you are considering.",
  "The chart above shows where the worry sits. In our study of 10,700 posts on r/Weddingattireapproval, white was mentioned in 2,075, almost exactly twice as many as black (1,048), and nearly one post in five overall. Most of that is guests checking their own dress against the bride's: the subreddit's \"Is this too white?\" flair alone covers 944 posts, and those drew a median of 23 replies against 15.5 for the subreddit as a whole, the highest of any flair with at least 200 posts. After white and black come blue (800), green (663) and pink (457), then a cluster of gold, red, brown, yellow and navy between roughly 300 and 370 posts each. Those counts measure what guests talk about, not what they wear, and a post can mention several colors.",
  "The one firm rule: avoid white and anything that reads as white. Etiquette expert Elaine Swann told TODAY in January 2026, \"Any shades of white, that color is still reserved for the bride,\" adding that white is acceptable when the couple asks guests to wear it. Bridal stylist Anny Choi told Vogue the rule also covers cream, ivory and beige, and warned that a pale pink or butter yellow can be \"a tad too close to a cream hue\" in photographs. Stylist Micaela Erlanger gave Vogue the most usable test: \"As long as the main color doesn't read as white, you're in the clear.\" Vogue adds a print rule: a dress with a white base and a colored print is out, while a colorful dress with some white in the print is generally fine. Lace in white or cream, and sequins or beading in ivory, champagne or silver-white, read bridal.",
  "That rule shapes three of the guides on this hub. Champagne wedding guest dresses explains when the shade reads clearly gold or beige and when it drifts toward off-white, suggests holding the fabric against white paper, and covers nude tones (a shade two or three steps lighter or deeper than your skin, never level with it) and gold and silver metallics, which are not the same as white even in low evening light. Yellow wedding guest dresses singles out pale or butter yellow as the shade to check. For men, Vogue's guidance is to skip a white jacket or white trousers; a white dress shirt is expected, and Emily Post lists a white dinner jacket only for black tie in summer, in the tropics or on a cruise.",
  "Why white carries so much weight is partly history. Wikipedia's articles on the white wedding and the wedding dress trace the Western bride's white dress to Queen Victoria's 1840 wedding, which made it fashionable, and white has been the expected bridal color in Western weddings since. A guest in the same color competes with her in every photograph. Vogue notes that the rule holds when both partners are grooms, too: white is still a color held by the couple. The only reliable exception is an invitation that asks for it.",
  "It is worth knowing that the color industry's own pick does not help here. Pantone named Cloud Dancer, PANTONE 11-4201, its Color of the Year for 2026, and it is an off-white: the one family a wedding guest should leave alone. This site does not publish a trend palette for the year, because no source it relies on measures what guests are wearing; what it can measure is what they ask about, which is the chart above.",
  "Black is the color with the most outdated rule attached. Vogue's history of the question traces the old taboo to formal mourning dress, and its contributor Alexandra Macon calls black at a wedding \"perfectly acceptable, and chic\" as long as it is festive and not funereal. The Emily Post Institute's attire guide lists a little black dress under black tie, black tie optional, semi-formal and even festive attire. The guide to whether you can wear black to a wedding covers the exceptions in detail, including a disagreement worth knowing: Cosmopolitan UK writes that black is still closely associated with mourning at traditional Indian and Chinese weddings, while Wikipedia's article on color in Chinese culture says white is the traditional mourning color and black carries less of that association. When sources disagree on the couple's tradition, ask the couple. The black wedding guest dresses and black cocktail dresses guides then deal with the practical question, which is choosing a fabric with texture so black does not flatten in photographs.",
  "Red is the color most often mistaken for a universal rule. Elaine Swann told TODAY the no-red rule is \"another internet fable\" for American weddings, while Diane Gottsman, quoted by Who What Wear, draws the line at a loud, crowd-stopping red. The real exception is cultural. Vogue notes that red is a traditional bridal color in China and India, Swann told Who What Wear that red is \"highly inappropriate\" for guests at Chinese and Indian weddings, and Wikipedia's article on the wedding sari says wedding saris are usually red, a color associated with married women, though combinations vary by region, caste and religion. Wikipedia's article on traditional Vietnamese weddings says reds and pinks remain popular for brides there. The red wedding guest dresses guide covers which reds suit which codes when red is fine.",
  "The second check is the wedding party. In the study, 479 posts mention bridesmaids and 133 mention a color palette or scheme. Cosmopolitan UK points out that the invitation usually hints at the wedding's colors and suggests simply asking the couple which colors to avoid. If the bridesmaids' shade is known, choose a different color or a clearly different depth of the same family, so that nobody in the photographs mistakes you for a member of the party.",
  "Once those checks are done, color stops being a question of permission and becomes a question of formality, and here the dress code matters more than the hue. Shade and fabric carry formality between them. Navy wedding guest dresses covers navy from a floor-length satin, velvet or sequined gown at black tie down to a navy-ground floral at a casual wedding. Green wedding guest dresses puts sage and mint at spring and summer daytime weddings and emerald at cocktail through black tie. Blue and light blue wedding guest dresses keep the palest blues for daytime and suggest a clearer sky or dusty blue in satin or crepe for a formal evening. The champagne guide's metallics section favors antique or champagne gold in a matte fabric for daytime and saves full metallic for evening and black tie. The same depth-and-fabric logic applies to men, for whom Emily Post's guide notes that the darker the suit, the more formal.",
  "Men's color choices sit mostly in the shirt, the tie and the shade of the suit. A white shirt is the formal baseline in every Emily Post list from black tie optional upward, worn with a black bow tie at black tie and a white one at white tie. Color enters through the tie and pocket square, and the black wedding guest guide suggests a colored or patterned tie to keep a black suit festive rather than somber. Emily Post's creative black tie is the one code that invites more: a tuxedo combined with trendy or whimsical items, such as a black shirt or a matching colored or patterned bow tie and cummerbund. Below black tie, choosing between navy, charcoal, gray and lighter suits is choosing a level of formality as much as a color.",
  "Season does the rest. Shades of brown wedding guest dresses lays out the brown family in order: camel and tan for spring and summer daytime, mocha in any season from dressy casual to cocktail, cognac and caramel for fall and early winter, and chocolate and espresso for formal evenings, where in satin or velvet brown holds up at black tie. Pink wedding guest dresses keeps dusty rose and mid pinks for any season and hot pink and fuchsia for summer, evening and festive invitations. For December, Emily Post's festive attire tells guests to \"feature holiday colors\", which the holiday guide on the season hub interprets.",
  "One more limit, from Vogue's color guidance: Erlanger suggests avoiding colors that really stand out, neons included, unless the party clearly calls for them. That is the closest thing to a general color restriction any of this site's sources give beyond white and the couple's own traditions.",
  "The mistakes that come up again and again are few. Guests check a dress against pure white and forget cream, ivory, beige and white-ground prints. They apply an American rule, such as the red myth, at a wedding where a different tradition governs, or apply another tradition's rule at an American wedding. They match the bridesmaids by accident. And they choose a color before checking the dress code, then find the shade is right and the fabric is wrong. Read the color guide that matches your dress, then read the dress-code guide on your invitation; the combination of the two is the answer.",
];

export default function ColorPillarPage() {
  return (
    <PillarHub
      pillarSlug="color"
      pillarLabel="Color"
      h1="Wedding Guest Dresses by Color"
      answer="Almost any color works for a wedding guest. The colors that need care are anything that reads as white, including cream, ivory, beige and white-ground prints; red at Chinese, Indian and Vietnamese weddings, where it is often the bride's color; and the bridesmaids' shade. Once those are cleared, the dress code matters more than the color: a deep shade in an evening fabric can go to black tie."
      intro="Which colors are safe for a wedding guest, which need checking, and how to match a shade to the dress code and season. The chart below shows which colors guests ask about most; the guides under it cover each color family, from black and the metallics to brown, pink, blue, green, red and yellow."
      lead={
        <BarChart
          kind="bars"
          title="Colors guests ask about: posts mentioning each color"
          data={COLOR_MENTIONS}
          caption={`Method: a post counts once for each color word it contains (title and body, lowercased, matching \\b<color>s?\\b). "Black tie" and "white tie" are masked first so dress codes are not counted as colors. Counts overlap, and "white" includes posts asking whether a dress is too white and mentions of the bride's own dress. ${STUDY_SOURCE}.`}
        />
      }
      sections={colorSections}
      longFormParagraphs={longForm}
      products={picksForPillar(getPillarSlugs("color"), 12)}
      groups={getPillarGroups("color")}
      sources={[
        {
          publisher: "TODAY (Chrissy Callahan, quoting etiquette expert Elaine Swann)",
          title: "TikTok Says You Can't Wear Red to Weddings. Does an Etiquette Expert Agree? (27 January 2026)",
          url: "https://www.today.com/life/wearing-red-to-wedding-debate-rcna251668",
          readOn: "22 October 2026",
          supports: "\"any shades of white\" reserved for the bride unless the couple asks; the no-red rule as \"another internet fable\"",
        },
        {
          publisher: "Vogue (Maria Ward and Shelby Wax)",
          title: "Can You Wear White to a Wedding? The Wedding Guest Faux-Pas Explained (10 April 2025)",
          url: "https://www.vogue.com/article/can-you-wear-white-to-a-wedding",
          readOn: "22 October 2026",
          supports: "Anny Choi on cream, ivory, beige, pale pink and butter yellow; Micaela Erlanger's \"doesn't read as white\" test and neons; the white-base print rule; lace and men's white jackets; red as a bridal color in China and India",
        },
        {
          publisher: "Vogue (Shelby Wax)",
          title: "Can You Wear Black to a Wedding? (29 November 2025)",
          url: "https://www.vogue.com/article/can-you-wear-black-to-a-wedding",
          readOn: "22 October 2026",
          supports: "the mourning origin of the black taboo; Alexandra Macon: \"perfectly acceptable, and chic\" if festive, not funereal",
        },
        {
          publisher: "Who What Wear",
          title: "Can You Wear Red to a Wedding? This Is the Definitive Answer",
          url: "https://www.whowhatwear.com/can-you-wear-red-to-wedding",
          readOn: "22 October 2026",
          supports: "Diane Gottsman on loud red; Elaine Swann on red at Chinese and Indian weddings",
        },
        {
          publisher: "Cosmopolitan UK (Alexandria Dale)",
          title: "Can you wear black to a wedding?",
          url: "https://www.cosmopolitan.com/uk/fashion/style/a64285815/can-you-wear-black-to-a-wedding/",
          readOn: "22 October 2026",
          supports: "black and mourning at traditional Indian and Chinese weddings; the invitation hinting at colors; asking the couple",
        },
        {
          publisher: "The Emily Post Institute",
          title: "Attire Guide: Dress Codes from Casual to White Tie",
          url: "https://emilypost.com/advice/attire-guide-dress-codes-from-casual-to-white-tie",
          readOn: "22 October 2026",
          supports: "garment lists with no color rules; the little black dress under black tie, black tie optional, semi-formal and festive; \"feature holiday colors\"; the white dinner jacket; darker suits being more formal",
        },
        {
          publisher: "Wikipedia",
          title: "Wedding sari; Traditional Vietnamese wedding; Color in Chinese culture",
          url: "https://en.wikipedia.org/wiki/Wedding_sari",
          readOn: "22 October 2026",
          supports: "red wedding saris and regional variation; reds and pinks for Vietnamese brides; white as the traditional Chinese mourning color (support only)",
        },
        {
          publisher: "Pantone",
          title: "Color of the Year",
          url: "https://www.pantone.com/color-of-the-year",
          readOn: "22 October 2026",
          supports: "2026 Color of the Year: Cloud Dancer, PANTONE 11-4201",
        },
        {
          publisher: "weddinggueststyle.com analysis of r/Weddingattireapproval",
          title: "10,700 posts, 16 April – 21 October 2026 (Arctic Shift archive; aggregate counts only)",
          url: "https://www.reddit.com/r/Weddingattireapproval/",
          readOn: "22 October 2026",
          supports: "posts mentioning each color; 944 \"Is this too white?\" posts and their median of 23 replies; 479 bridesmaid and 133 palette mentions",
        },
      ]}
    />
  );
}
