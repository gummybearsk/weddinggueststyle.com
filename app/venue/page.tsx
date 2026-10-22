import type { Metadata } from "next";
import PillarHub from "@/components/PillarHub";
import VerdictTable from "@/components/visuals/VerdictTable";
import BarChart from "@/components/visuals/BarChart";
import { picksForPillar } from "@/lib/featured";
import { getPillarGroups, getPillarSlugs } from "@/lib/taxonomy";
import { venueSections } from "@/lib/homepageData";

// Renders live Amazon prices — must revalidate, and therefore MUST be listed in
// next.config.mjs outputFileTracingIncludes (enforced by scripts/check-sitemap-pairing.mjs).
export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Wedding Guest Dresses by Venue — Beach, Garden, Vineyard, Ballroom",
  description:
    "Wedding guest dresses for every venue: beach, garden, vineyard, Indian wedding, formal ballroom, and more. Picks that match the location and its hidden expectations.",
  alternates: { canonical: "https://weddinggueststyle.com/venue" },
};

const STUDY_SOURCE =
  "Source: weddinggueststyle.com analysis of 10,700 r/Weddingattireapproval posts, 16 April – 21 October 2026 (Arctic Shift archive)";

// Each verdict restates a named source (SOURCES.md S3, S3b, S14, S15) or this site's own
// venue guide, as the note says. No verdict is an invented rule.
const VENUE_VERDICTS = [
  {
    context: "Stiletto heels on grass, sand or gravel",
    verdict: "no" as const,
    note: "This site's beach, garden and fall-shoe guides all point to block heels, wedges or flats, whose wider base will not sink or catch.",
  },
  {
    context: "Bare shoulders at a ceremony in a house of worship",
    verdict: "caution" as const,
    note: "Emily Post's wedding guest guide: ask whether bare shoulders or arms would offend. Carry a wrap or jacket you can keep on for the service.",
  },
  {
    context: "Open-toed shoes at a religious ceremony",
    verdict: "caution" as const,
    note: "Emily Post lists open-toed shoes among the things to check at the venue.",
  },
  {
    context: "Head covering at a religious ceremony",
    verdict: "caution" as const,
    note: "Emily Post: ask whether the couple's religion or culture calls for one; otherwise hats or head coverings are optional.",
  },
  {
    context: "Red at an Indian or Chinese wedding",
    verdict: "no" as const,
    note: "Vogue: red is a traditional bridal color in China and India. Elaine Swann (Who What Wear): \"highly inappropriate\" for guests.",
  },
  {
    context: "Saturated color, embroidery and gold at an Indian wedding",
    verdict: "yes" as const,
    note: "The Indian wedding guide's advice: bright, festive and dressy. Avoid red, and ask the family before wearing all black or white.",
  },
  {
    context: "Shorts at a beach wedding",
    verdict: "caution" as const,
    note: "Emily Post's casual list allows shorts \"depending on occasion and climate\"; a wedding calls for the dressier end of any list.",
  },
  {
    context: "White dinner jacket for men at a summer or tropical black tie",
    verdict: "yes" as const,
    note: "Emily Post lists it for black tie \"in summer, in the tropics, or on a cruise\", with black tuxedo trousers.",
  },
  {
    context: "A floor-length gown at a beach black tie",
    verdict: "yes" as const,
    note: "Emily Post's black tie list still applies; the beach guide suggests chiffon or lightweight crepe cut to clear the sand.",
  },
  {
    context: "A little black dress at an evening hotel or ballroom wedding",
    verdict: "yes" as const,
    note: "Emily Post lists the little black dress at black tie, black tie optional and semi-formal.",
  },
  {
    context: "Anything that reads as white, at any venue",
    verdict: "no" as const,
    note: "Elaine Swann (TODAY, January 2026): \"any shades of white\" belong to the bride unless the couple asks.",
  },
];

// Posts mentioning each venue word at least once (title + body, lowercased, black/white tie masked).
const VENUE_MENTIONS = [
  { label: "Garden", value: 860, highlight: true },
  { label: "Church", value: 397 },
  { label: "Beach", value: 309 },
  { label: "Hotel or ballroom", value: 230 },
  { label: "Barn", value: 193 },
  { label: "Vineyard or winery", value: 171 },
  { label: "Grass or lawn", value: 114 },
];

const longForm = [
  "Venue changes the practical layer of an outfit, not its formality. The dress code on the invitation still decides how dressed-up to be; the place decides what the ground will do to your shoes, whether your shoulders should be covered for part of the day, how much weather you will be standing in, and sometimes which colors belong to the couple's tradition. The Emily Post Institute's wedding guest guide frames it the same way. It reminds guests that a wedding is a serious ceremony that often takes place in a house of worship, says the invitation and the time of the wedding are the best guide to formality, and then asks venue questions: is the service secular or religious, does the couple's religion or culture call for head coverings, and would bare shoulders, bare arms or open-toed shoes offend? It also notes that some parts of the country are more conservative than others.",
  "Outdoor settings are the most common venue question by far. In our study of 10,700 posts on r/Weddingattireapproval, 2,203 posts, about one in five, mention an outdoor setting, a garden, a barn, a vineyard, a beach, a lawn or grass. Garden alone appears in 860, church in 397, beach in 309, hotel or ballroom in 230, barn in 193 and vineyard or winery in 171. Heels come up in 815 posts. The subreddit even has a dedicated \"Barn/Beach/Garden Theme\" flair, used on 681 posts. Those figures say where guests are uncertain, and outdoor ground is plainly where the uncertainty lives.",
  "Beach and destination weddings. The beach wedding guest dresses guide starts from the ground and the wind: a light, lined dress short enough to clear the sand, which means a midi or a maxi cut about an inch off the ground, in chiffon, georgette, voile or lightweight crepe, with wedges, block heels or flat sandals rather than stilettos. It then reads the dress code, because \"beach\" is a setting, not a formality level. At a casual beach wedding, Emily Post's casual list (a sundress, a long or short skirt, even shorts \"depending on occasion and climate\") is the starting point, taken at its dressier end. At a beach black tie, Emily Post's black tie list still applies, so a gown in chiffon or lightweight crepe in a strong color is the safest reading. For men, the attire guide's one climate exception matters here: a white dinner jacket with black tuxedo trousers for black tie \"in summer, in the tropics, or on a cruise\". At a destination, dress for the climate of the venue rather than home; the season hub has NOAA's normals for ten U.S. cities.",
  "Garden and outdoor weddings. The garden party wedding guest dresses guide recommends midi or ankle-length dresses in light, breathable fabrics such as chiffon, cotton voile or linen blends, in a floral print or a soft color, with block heels, wedges or dressy flats that will not sink into grass. It sets the garden against Emily Post's full ladder: a sundress, skirts and khakis for casual events; a dress, a skirt and dressy top or a dressy pants outfit for dressy casual; a short afternoon or cocktail dress, a long dressy skirt and top or dressy separates for semi-formal; a floor-length gown, a dressy cocktail dress or your dressiest little black dress for black tie. A garden can host any of those codes, so the code still governs and the garden adjusts the fabric and the shoes. Outdoor evenings also cool off: NOAA's July normals at Seattle-Tacoma run from a 77.4°F high to a 56.8°F low, and October at Chicago O'Hare from 62.7°F to 45.4°F, so a reception after sunset can need a layer the ceremony did not.",
  "Barns and vineyards have no dedicated guide on this site, because they combine two problems the existing guides already solve. The ground is usually grass, gravel or old boards, which is the garden guide's shoe advice; and the calendar often runs into the cooler months, which is the fall guide's fabric advice. The wedding guest shoes for fall guide is the most directly useful one for either, since it explains why a wide heel base will not sink into damp grass or catch in gravel and suggests closed toes for outdoor events after about 4 p.m. from October on. The invitation's code then decides how formal to be, exactly as it would in a garden.",
  "Church and traditional ceremonies. The church wedding guest dresses guide puts coverage first: a dress that covers your shoulders, or a jacket or wrap for the service, with a hem that still covers your knees when you sit, which makes midi and tea-length dresses the easiest choice. It also suggests a lined fabric, skipping high slits and very sheer or shiny fabrics, and asking the venue whether it expects anything more, such as covered hair. Those are the practical answers to Emily Post's venue questions, and the guide cites the U.S. Conference of Catholic Bishops' overview of the wedding ceremony for readers who want to understand the service itself. The modest wedding guest dresses guide on the fit hub goes further for guests who prefer more coverage throughout, and the cover-ups and wraps guide on the style hub covers the layer that lets one dress work for both a ceremony and a reception.",
  "That layer deserves a minute of planning at any venue with a ceremony and a separate reception. The wedding guest cover-ups and wraps guide matches it to the code and the month: a lace or chiffon bolero or kimono to cover shoulders for a summer church ceremony, a pashmina or lined blazer for a cool fall evening, faux fur, velvet or a wool cape for winter and formal events, and a real coat as well from November. It also makes a practical point that decides a lot of venue outfits: anything with sleeves stays on by itself, while a plain wrap needs a pin to stay put through a service.",
  "Indian weddings. The Indian wedding guest dresses guide is the clearest case of a venue and a tradition that change the color rules. It recommends bright, festive and dressy clothing, such as jewel tones, pinks, oranges and gold with embroidery or embellishment, and says a sari, lehenga or salwar kameez is welcome, as is a formal Western gown or a dressy midi. On color, the sources agree on red: Vogue notes that red is a traditional bridal color in India, and etiquette expert Elaine Swann told Who What Wear that red is \"highly inappropriate\" for guests at Indian weddings. Wikipedia's article on the wedding sari says wedding saris are usually red, a color associated with married women, though combinations vary by region, caste and religion. Cosmopolitan UK adds that black is still closely associated with mourning at traditional Indian weddings, so the guide suggests asking the family before wearing all black or white. Because many Indian weddings run over several events, it also recommends planning a separate outfit for each. The guide also notes that an Indian ceremony usually sits at black tie level or above in color and embellishment even when the card names no code, and Emily Post's head-covering question applies at many religious ceremonies.",
  "Other traditions follow the same pattern: the couple's culture can make a color right or wrong regardless of the venue. Wikipedia's article on Chinese marriage says modern Chinese brides generally pick red, following tradition, or white, and its article on color in Chinese culture says white is the traditional mourning color. Its article on traditional Vietnamese weddings says reds and pinks remain popular for brides and that guests wear their own áo dài or formal Western clothes. The color hub sets out these rules in one place, and the guide to whether you can wear black to a wedding covers the cases where black needs care.",
  "Hotels and ballrooms are the venue where the dress code does almost all the work, because there is no ground, wind or weather to adjust for. An evening reception in a hotel ballroom is the setting Emily Post's after-6 p.m. advice is written for: at a semi-formal event that starts after six, err toward the formal end. A little black dress is listed at black tie, black tie optional and semi-formal in the attire guide, which makes it one of the few garments that works in a ballroom at nearly every evening code. The black tie, black tie optional and cocktail guides are the right next step here, rather than any venue guide.",
  "The mistakes this hub is meant to prevent are consistent. Reading the venue as the dress code, so that \"beach\" becomes casual even when the invitation says black tie. Choosing the shoes last, when the ground decides them first. Arriving at a house of worship with bare shoulders and no layer. Applying an American color rule, or the red myth, at a wedding where the couple's tradition sets a different one. And dressing for the ceremony's weather but not the reception's, which is where a wrap or jacket earns its place.",
  "How to use the guides listed above: start with the dress code on your invitation, then open the venue guide that matches the place, and check the table at the top of this page for the specific item you are unsure about. If your venue is not listed, pick the guide with the same ground (sand, grass, gravel or indoor floors) and the same kind of ceremony (secular or religious); between them, those two choices answer most venue questions.",
];

export default function VenuePillarPage() {
  return (
    <PillarHub
      pillarSlug="venue"
      pillarLabel="Venue"
      h1="Wedding Guest Dresses by Venue"
      answer="Venue changes the practical layer of an outfit, not its formality: the invitation's dress code still sets length and how dressed-up to be. The ground decides your shoes, with block heels, wedges or flats on grass and sand, and a house of worship may decide coverage. Emily Post's wedding guest guide tells guests to ask whether bare shoulders, bare arms or open-toed shoes would offend and whether head coverings are expected."
      intro="Beach, garden, church, Indian weddings, and the barns, vineyards and ballrooms that borrow their rules: what each setting changes about shoes, coverage, layers and color. The table below answers the most common can-I-wear questions by venue; the guides under it go deeper."
      lead={
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr] items-start">
          <VerdictTable
            kind="verdict"
            title="Can I wear it here? Common items by venue"
            rows={VENUE_VERDICTS}
            caption={"Sources: The Emily Post Institute, \"Wedding Guest Attire\" (venue questions) and \"Attire Guide: Dress Codes from Casual to White Tie\" (garment lists, white dinner jacket); Vogue, \"Can You Wear White to a Wedding?\" (10 April 2025); Who What Wear, \"Can You Wear Red to a Wedding?\"; TODAY (Elaine Swann, 27 January 2026). All read 22 October 2026. Shoe and fabric verdicts restate this site's venue guides."}
          />
          <BarChart
            kind="bars"
            title="Venues guests mention: posts naming each"
            data={VENUE_MENTIONS}
            caption={`Method: a post counts once per pattern (title and body, lowercased; "black tie" and "white tie" masked). Regexes: \\bgarden\\b; \\bchurch\\b; \\bbeach\\b; \\b(hotel|ballroom)\\b; \\bbarn\\b; \\b(vineyard|winery)\\b; \\b(grass|lawn)\\b. Counts overlap, and "garden" includes garden-party themes. ${STUDY_SOURCE}.`}
          />
        </div>
      }
      sections={venueSections}
      longFormParagraphs={longForm}
      products={picksForPillar(getPillarSlugs("venue"), 12)}
      groups={getPillarGroups("venue")}
      sources={[
        {
          publisher: "The Emily Post Institute",
          title: "Wedding Guest Attire: What to Wear to a Wedding",
          url: "https://emilypost.com/advice/wedding-guest-attire",
          readOn: "22 October 2026",
          supports: "the venue questions (secular or religious, head coverings, bare shoulders and arms, open-toed shoes), local custom, and the invitation-and-time rule",
        },
        {
          publisher: "The Emily Post Institute",
          title: "Attire Guide: Dress Codes from Casual to White Tie",
          url: "https://emilypost.com/advice/attire-guide-dress-codes-from-casual-to-white-tie",
          readOn: "22 October 2026",
          supports: "garment lists for every code, shorts on the casual list, the white dinner jacket for summer and tropical black tie, and the after-6 p.m. advice",
        },
        {
          publisher: "Vogue (Maria Ward and Shelby Wax)",
          title: "Can You Wear White to a Wedding? The Wedding Guest Faux-Pas Explained (10 April 2025)",
          url: "https://www.vogue.com/article/can-you-wear-white-to-a-wedding",
          readOn: "22 October 2026",
          supports: "red as a traditional bridal color in China and India",
        },
        {
          publisher: "Who What Wear",
          title: "Can You Wear Red to a Wedding? This Is the Definitive Answer",
          url: "https://www.whowhatwear.com/can-you-wear-red-to-wedding",
          readOn: "22 October 2026",
          supports: "Elaine Swann: red \"highly inappropriate\" for guests at Chinese and Indian weddings",
        },
        {
          publisher: "TODAY (Chrissy Callahan, quoting etiquette expert Elaine Swann)",
          title: "TikTok Says You Can't Wear Red to Weddings. Does an Etiquette Expert Agree? (27 January 2026)",
          url: "https://www.today.com/life/wearing-red-to-wedding-debate-rcna251668",
          readOn: "22 October 2026",
          supports: "\"any shades of white\" reserved for the bride",
        },
        {
          publisher: "Cosmopolitan UK (Alexandria Dale)",
          title: "Can you wear black to a wedding?",
          url: "https://www.cosmopolitan.com/uk/fashion/style/a64285815/can-you-wear-black-to-a-wedding/",
          readOn: "22 October 2026",
          supports: "black and mourning at traditional Indian weddings",
        },
        {
          publisher: "Wikipedia",
          title: "Wedding sari; Chinese marriage; Color in Chinese culture; Traditional Vietnamese wedding",
          url: "https://en.wikipedia.org/wiki/Wedding_sari",
          readOn: "22 October 2026",
          supports: "red wedding saris and regional variation; Chinese brides' red or white; white as the Chinese mourning color; Vietnamese bridal and guest dress (support only)",
        },
        {
          publisher: "NOAA National Centers for Environmental Information",
          title: "U.S. Climate Normals 1991–2020 (monthly)",
          url: "https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals",
          readOn: "22 October 2026",
          supports: "July high and low at Seattle-Tacoma; October high and low at Chicago O'Hare",
        },
        {
          publisher: "weddinggueststyle.com analysis of r/Weddingattireapproval",
          title: "10,700 posts, 16 April – 21 October 2026 (Arctic Shift archive; aggregate counts only)",
          url: "https://www.reddit.com/r/Weddingattireapproval/",
          readOn: "22 October 2026",
          supports: "2,203 outdoor-setting posts; venue mentions (garden 860, church 397, beach 309, hotel or ballroom 230, barn 193, vineyard or winery 171, grass or lawn 114); heels 815; 681 Barn/Beach/Garden Theme posts",
        },
      ]}
    />
  );
}
