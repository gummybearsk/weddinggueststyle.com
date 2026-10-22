import type { Metadata } from "next";
import PillarHub from "@/components/PillarHub";
import BarChart from "@/components/visuals/BarChart";
import CompareTable from "@/components/visuals/CompareTable";
import { picksForPillar } from "@/lib/featured";
import { getPillarGroups, getPillarSlugs } from "@/lib/taxonomy";
import { bodyTypeSections } from "@/lib/homepageData";

// Renders live Amazon prices — must revalidate, and therefore MUST be listed in
// next.config.mjs outputFileTracingIncludes (enforced by scripts/check-sitemap-pairing.mjs).
export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Wedding Guest Dresses by Body Type — Plus, Petite, Maternity, Over 50",
  description:
    "Wedding guest dresses cut for every figure. Plus size, petite, maternity, over-50, and silhouettes built to flatter — not hide.",
  alternates: { canonical: "https://weddinggueststyle.com/body-type" },
};

const STUDY_SOURCE =
  "Source: weddinggueststyle.com analysis of 10,700 r/Weddingattireapproval posts, 16 April – 21 October 2026 (Arctic Shift archive)";

// Every cell restates a definition from SOURCES.md S18 (ASTM scope pages, Stitch Fix,
// Alex Evenings, Nordstrom), read 2026-10-22. Nothing here is the site's own sizing claim.
const SIZING_ROWS = [
  {
    label: "Regular (misses)",
    cells: [
      "00–20 (ASTM D5585)",
      "Adult female misses figure type. Stitch Fix: regular sizing is designed for women 5'4\" to 5'8\".",
      "The default size run on most labels.",
    ],
  },
  {
    label: "Petite",
    cells: [
      "00P–20P (ASTM D7878)",
      "Misses petite figure type. Stitch Fix: 5'4\" and under, with shorter sleeves, hems, inseams and rises, and adjusted knee and armhole placement.",
      "Alex Evenings: 2P–16P, plus SP–XLP on alpha sizes.",
    ],
  },
  {
    label: "Plus",
    cells: [
      "14W–40W (ASTM D6960)",
      "Plus women's figure type: a separate table, not misses sizes scaled up.",
      "Nordstrom's filter groups \"14W, 1X, 18, XXL\" as one step and \"28W+, 4X+\" at the top.",
    ],
  },
  {
    label: "Women 55+",
    cells: [
      "All figure types (ASTM D5586)",
      "The first body measurements ever taken of women aged 55 and older; ASTM states it is not a standard of current industry practice.",
      "No age-specific size run; buy by measurement.",
    ],
  },
];

// Posts matching each pattern at least once (title + body, lowercased, black/white tie masked).
const FIT_QUESTIONS = [
  { label: "Tailoring, alterations or a hem", value: 401, highlight: true },
  { label: "Sleeves", value: 211 },
  { label: "Pregnancy or maternity", value: 137 },
  { label: "Mother of the bride or groom (flair)", value: 107 },
  { label: "Petite", value: 74 },
];

const longForm = [
  "Fit is a different question from dress code, and keeping the two apart is the most useful thing this hub can do. Petite, plus-size, pregnant and over-50 guests follow the same lists as everyone else: the Emily Post Institute's attire guide gives a floor-length gown, a dressy cocktail dress or your dressiest little black dress for black tie, and a short afternoon or cocktail dress, a little black dress, a long dressy skirt and top or dressy separates for semi-formal, with no exceptions by size, age or shape. What fit changes is which size chart you shop from, which cut sits correctly on your frame, and what you check before you order. The dress-code guides tell you what to wear; the fit guides on this hub tell you how to buy it so it fits.",
  "Start with the size label, because it carries less information than it seems to. In the U.S., body-measurement tables from ASTM International define separate figure types: misses sizes 00 to 20 (ASTM D5585), misses petite 00P to 20P (ASTM D7878) and plus women's 14W to 40W (ASTM D6960). Manufacturers use tables like these as a baseline and then add their own ease, fabric behavior and styling, which is why two brands' size 6P, or two brands' 18, still fit differently. Retail filters blur the categories further: Nordstrom's plus-size wedding guest dress filter, for example, groups 14W, 1X, 18 and XXL as one step. The practical rule follows directly. Measure your bust, waist and hips, compare them with each brand's own chart, and buy for the measurement rather than the number you usually wear.",
  "Because a size label is a starting point, returns are part of buying a dress that fits, and the time to check them is before you order. The Federal Trade Commission's online-shopping advice is to find out whether an item can be returned for a full refund, who pays for return shipping, how many days you have and whether there is a restocking fee. If a dress will need alterations, order early enough to try it on, decide, and either send it back or get it to a tailor.",
  "Reading a listing well saves most of the returns. The petite guide suggests checking two things before anything else: whether the listing has its own petite size chart, and how tall the model is, since a dress photographed on a tall model will land lower on a shorter frame. Stitch Fix adds that a petite range can run from extra-small into plus sizes, so \"petite\" and \"plus\" are not opposites and a guest can need both. For any figure, look for the garment measurements a brand gives (bust, waist, hip and length from shoulder or waist to hem), compare them with a dress you already own that fits, and treat the size letter or number as a label rather than a promise.",
  "The data backs up that last point. In our study of 10,700 posts on r/Weddingattireapproval, tailoring, alterations or a hem come up in 401 posts, more than any single body-type word. Sleeves come up in 211, pregnancy or maternity in 137, and the mother of the bride or groom flair covers 107. Petite is named in 74. Those numbers describe what guests ask about in public, not how many guests of each kind exist, but they explain why this hub treats alterations and coverage as seriously as size.",
  "Petite. Stitch Fix, which styles and sells petite clothing, defines petite as sizing tailored for women 5'4\" and under and regular sizing as designed for women 5'4\" to 5'8\". Petite items, it explains, have shorter sleeves, hemlines, inseams and rises, with the knee and armhole placement adjusted, so petite is a different proportion, not only a shorter hem. The petite wedding guest dresses guide builds on that: the rule that matters most is that the waist seam sits at your natural waist, and length is then chosen by the dress code: at or just above the knee for cocktail, a midi that ends below the widest part of the calf, or a gown hemmed to brush the top of your shoe for black tie. Two further points from Stitch Fix are worth carrying into any purchase. A long torso or a full chest may suit regular sizes on top, and it is easier to remove fabric than to add it, so buy for the most prominent part of your body and tailor the rest.",
  "Plus size. ASTM's plus women's table exists because a fuller figure has its own proportions; a W pattern can be drafted for them instead of scaling a misses pattern up. The plus size wedding guest dresses guide starts from measurements for exactly that reason, since 18, 1X and 14W do not describe the same body from label to label. It then recommends a cut that marks the waist, such as an A-line, a true wrap, a fit-and-flare or an empire waist, in a mid-weight fabric that skims rather than clings. Choose those cuts because they fit and move well, not to hide anything; the dress code is the same as for every other guest.",
  "Over 50. ASTM's table for women aged 55 and older describes its data as the first body measurements ever taken of women in that age group and says plainly that it is not a standard of current industry practice the way the other tables are. In other words, sizing was not built around an older body, which is why a size that fitted for years can suddenly stop fitting. The wedding guest dresses over 50 guide treats that as a label problem, not a body problem, and recommends choosing a size by measurement, then looking for lined fabric with some weight, straps that cover a bra, sleeves or a jacket if you want coverage, and shoes you can stand in. Its dress-code advice is the same as anyone's: a midi or tea-length dress for cocktail and semi-formal, a floor-length gown or dressy cocktail dress for black tie. Emily Post's wedding guest guide also lists a suit, pantsuit or dressy pantsuit at semiformal weddings, which many guests prefer to a dress.",
  "Mother of the bride. The mother of the bride fall dresses guide covers a role as much as a figure: someone who will sit through the ceremony, stand in photographs and host for hours. It recommends deep, matte or low-sheen colors such as bronze, aubergine, forest, burgundy, navy or chocolate, in fabrics that recover after hours of sitting (stretch crepe, ponte, velvet, wool-blend crepe), with an elbow or three-quarter sleeve. The same logic of recovery and comfort applies in any season.",
  "Maternity. The maternity wedding guest dresses guide begins with timing: choose the dress for the shape you will be on the wedding day, not the day you order. Early on, wrap and A-line dresses work; from mid-pregnancy, empire waists and side-ruched stretch jersey; late on, a maternity-cut empire maxi. The NHS notes that swelling in the ankles, feet and fingers is common in pregnancy and often worse at the end of the day and later in pregnancy; its advice includes avoiding standing for long periods and wearing comfortable shoes without tight straps, and it says a sudden increase in swelling is a reason to contact a midwife or doctor immediately. The American College of Obstetricians and Gynecologists advises avoiding overheating, drinking plenty of water and wearing loose-fitting clothing, guidance written for exercise but relevant to a long summer reception. Plan the shoes and a place to sit before the dress.",
  "Modest dressing and sleeves. Coverage is a fit question as much as a style one, because sleeves, necklines and hems behave differently on different bodies. The modest wedding guest dresses guide defines modest in working terms: shoulders and upper arms covered, neckline above the cleavage, and a hem at or below the knee when you sit, which usually means a lined midi or maxi with elbow-length or longer sleeves. For a religious ceremony, Emily Post's wedding guest guide tells guests to ask whether bare shoulders or arms, or open-toed shoes, would offend and whether head coverings are expected. The long sleeve wedding guest dresses guide then covers the weight question: sheer mesh, lace or chiffon sleeves in warm months, velvet, crepe and satin in cold ones.",
  "The common mistakes are predictable once the sizing picture is clear. Buying by your usual label number rather than your measurements. Assuming that a fit category changes the dress code, in either direction. Choosing a dress for the body you have on the order date when the wedding is weeks or months later, which matters most in pregnancy. Leaving no time for alterations. And treating the shoes as an afterthought, when they decide how a long day feels.",
  "How to use this hub: find your group in the list above and read that guide first for sizing and cut, then read the dress-code guide on your invitation for what to wear. The sizing table at the top of the page shows the size range and definition behind each category, so you can tell at a glance whether a listing's sizes were drafted for your figure type or simply relabeled. Men's fit is not covered here; the wedding dress code for men guide sets out the men's list for every code.",
];

export default function BodyTypePillarPage() {
  return (
    <PillarHub
      pillarSlug="body-type"
      pillarLabel="Body Type"
      h1="Wedding Guest Dresses by Body Type"
      answer="Fit decides which size chart and cut you buy, not which dress code you follow: petite, plus-size, pregnant and over-50 guests dress to the same lists as everyone else. The most useful rule is to buy by your bust, waist and hip measurements against each brand's own chart, because regular (00–20), petite (00P–20P) and plus (14W–40W) are separate U.S. standard figure types and labels do not line up across brands."
      intro="Petite, plus-size, over-50, mother of the bride, maternity and modest: how each is sized, which cuts fit, and what to check before ordering. The table below sets the U.S. sizing standards side by side; the guides under it cover each fit in detail."
      lead={
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr] items-start">
          <CompareTable
            kind="compare"
            title="How each size category is defined"
            columns={["Standard size range", "Who it is drafted for", "What a retailer shows"]}
            rows={SIZING_ROWS}
            caption={"Sources: ASTM International standard pages for D5585-21, D7878/D7878M-23, D6960/D6960M-16 and D5586-95; Stitch Fix, \"What is Petite Size?\"; Alex Evenings petite collection; Nordstrom plus-size wedding guest dresses filter. All read 22 October 2026. Brands set their own charts on top of these baselines."}
          />
          <BarChart
            kind="bars"
            title="Fit questions guests raise: posts mentioning each"
            data={FIT_QUESTIONS}
            caption={`Method: a post counts once per pattern (title and body, lowercased). Regexes: \\b(tailor\\w*|alter(ed|ation|ations)?|hem(med|ming)?)\\b; \\bsleeves?\\b; pregnan|maternity|trimester; petite; the "Mother of Bride/Groom" link flair. Counts overlap. ${STUDY_SOURCE}.`}
          />
        </div>
      }
      sections={bodyTypeSections}
      longFormParagraphs={longForm}
      products={picksForPillar(getPillarSlugs("body-type"), 12)}
      groups={getPillarGroups("body-type")}
      sources={[
        {
          publisher: "ASTM International",
          title: "D5585-21 Standard Tables of Body Measurements for Adult Female Misses Figure Type, Size Range 00–20",
          url: "https://store.astm.org/d5585-21.html",
          readOn: "22 October 2026",
          supports: "misses (regular) sizes 00–20 as a separate figure type",
        },
        {
          publisher: "ASTM International",
          title: "D7878/D7878M-23 Standard Tables for Body Measurements for Adult Female Misses Petite Figure Type, Size Range 00P – 20P",
          url: "https://store.astm.org/d7878_d7878m-23.html",
          readOn: "22 October 2026",
          supports: "petite sizes 00P–20P; tables used by manufacturers as a baseline alongside fabric, ease, styling and fit",
        },
        {
          publisher: "ASTM International",
          title: "D6960/D6960M-16 Standard Tables for Body Measurements for Plus Women's Figure Type",
          url: "https://store.astm.org/d6960_d6960m-16.html",
          readOn: "22 October 2026",
          supports: "plus women's sizes 14W–40W as a separate figure type",
        },
        {
          publisher: "ASTM International",
          title: "D5586-95 Standard Tables of Body Measurements for Women Aged 55 and Older (All Figure Types)",
          url: "https://store.astm.org/d5586-95.html",
          readOn: "22 October 2026",
          supports: "the first body measurements of women aged 55 and older; not a standard of current industry practice",
        },
        {
          publisher: "Stitch Fix",
          title: "What is Petite Size?",
          url: "https://www.stitchfix.com/women/blog/style-guide/what-is-petite-size/",
          readOn: "22 October 2026",
          supports: "petite as 5'4\" and under, regular as 5'4\"–5'8\"; shorter sleeves, hems, inseams and rises; long torsos and full chests; easier to remove fabric than add it",
        },
        {
          publisher: "Alex Evenings",
          title: "Petite Wedding Guest Dresses (collection page)",
          url: "https://alexevenings.com/collections/petite-wedding-guest",
          readOn: "22 October 2026",
          supports: "a retailer's petite size run: 2P–16P and SP–XLP",
        },
        {
          publisher: "Nordstrom",
          title: "Plus-Size Wedding Guest Dresses (category page)",
          url: "https://www.nordstrom.com/browse/women/clothing/plus-size/dresses/wedding-guest",
          readOn: "22 October 2026",
          supports: "size filter grouping \"14W, 1X, 18, XXL\" and \"28W+, 4X+\"",
        },
        {
          publisher: "NHS",
          title: "Swollen ankles, feet and fingers in pregnancy",
          url: "https://www.nhs.uk/pregnancy/related-conditions/common-symptoms/swollen-ankles-feet-and-fingers/",
          readOn: "22 October 2026",
          supports: "swelling worse at the end of the day and later in pregnancy; avoid standing for long periods; comfortable shoes without tight straps; sudden swelling as a reason to call a midwife or doctor",
        },
        {
          publisher: "American College of Obstetricians and Gynecologists (ACOG)",
          title: "Exercise During Pregnancy (FAQ119)",
          url: "https://www.acog.org/womens-health/faqs/exercise-during-pregnancy",
          readOn: "22 October 2026",
          supports: "avoid overheating, drink plenty of water, wear loose-fitting clothing (stated for exercise)",
        },
        {
          publisher: "Federal Trade Commission",
          title: "Online Shopping",
          url: "https://consumer.ftc.gov/articles/online-shopping",
          readOn: "22 October 2026",
          supports: "return checks before ordering: full refund, return shipping, number of days, restocking fees",
        },
        {
          publisher: "The Emily Post Institute",
          title: "Attire Guide: Dress Codes from Casual to White Tie",
          url: "https://emilypost.com/advice/attire-guide-dress-codes-from-casual-to-white-tie",
          readOn: "22 October 2026",
          supports: "women's lists for black tie and semi-formal, which apply to every size and age",
        },
        {
          publisher: "The Emily Post Institute",
          title: "Wedding Guest Attire: What to Wear to a Wedding",
          url: "https://emilypost.com/advice/wedding-guest-attire",
          readOn: "22 October 2026",
          supports: "suit, pantsuit and dressy pantsuit at semiformal weddings; the venue questions on bare shoulders and arms, open-toed shoes and head coverings",
        },
        {
          publisher: "weddinggueststyle.com analysis of r/Weddingattireapproval",
          title: "10,700 posts, 16 April – 21 October 2026 (Arctic Shift archive; aggregate counts only)",
          url: "https://www.reddit.com/r/Weddingattireapproval/",
          readOn: "22 October 2026",
          supports: "posts mentioning tailoring or alterations (401), sleeves (211), pregnancy or maternity (137), petite (74), and the mother of the bride or groom flair (107)",
        },
      ]}
    />
  );
}
