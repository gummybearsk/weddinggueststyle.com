import type { Metadata } from "next";
import PillarHub from "@/components/PillarHub";
import BarChart from "@/components/visuals/BarChart";
import CompareTable from "@/components/visuals/CompareTable";
import { picksForPillar } from "@/lib/featured";
import { getPillarGroups, getPillarSlugs } from "@/lib/taxonomy";
import { seasonSections } from "@/lib/homepageData";

// Renders live Amazon prices — must revalidate, and therefore MUST be listed in
// next.config.mjs outputFileTracingIncludes (enforced by scripts/check-sitemap-pairing.mjs).
export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Wedding Guest Dresses by Season — Summer, Fall, Winter, Spring (2026)",
  description:
    "Wedding guest dresses for every season. Summer cottons, fall long-sleeves, winter velvets, and spring florals — organized by what works when. 2026 edit.",
  alternates: { canonical: "https://weddinggueststyle.com/season" },
};

const STUDY_SOURCE =
  "Source: weddinggueststyle.com analysis of 10,700 r/Weddingattireapproval posts, 16 April – 21 October 2026 (Arctic Shift archive)";

// Posts per calendar month (UTC creation date). Counts from posts_all.json, read 2026-10-22.
const MONTHS = [
  { label: "April (from the 16th)", value: 967 },
  { label: "May", value: 2141, highlight: true },
  { label: "June", value: 1777 },
  { label: "July", value: 1752 },
  { label: "August", value: 1860 },
  { label: "September", value: 1445 },
  { label: "October (to the 21st)", value: 758 },
];

// NOAA NCEI U.S. Climate Normals 1991–2020, monthly mean max / min, °F (SOURCES.md S7, S7b).
const CLIMATE_ROWS = [
  { label: "Chicago O'Hare", cells: ["47.0° / 31.0°", "84.5° / 66.4°"] },
  { label: "New York (Central Park)", cells: ["49.9° / 35.8°", "84.9° / 70.1°"] },
  { label: "Philadelphia", cells: ["52.8° / 34.3°", "87.8° / 69.6°"] },
  { label: "Seattle-Tacoma", cells: ["54.2° / 39.9°", "77.4° / 56.8°"] },
  { label: "Charlotte", cells: ["64.2° / 41.2°", "90.3° / 69.9°"] },
  { label: "Atlanta", cells: ["65.9° / 45.3°", "90.1° / 71.8°"] },
  { label: "Los Angeles (LAX)", cells: ["66.1° / 52.2°", "75.1° / 64.0°"] },
  { label: "Dallas-Fort Worth", cells: ["68.6° / 47.8°", "95.6° / 75.8°"] },
  { label: "Phoenix", cells: ["78.1° / 54.5°", "106.5° / 84.5°"] },
  { label: "Miami", cells: ["80.6° / 65.6°", "90.6° / 77.5°"] },
];

const longForm = [
  "Season is a modifier, not a dress code. The words on the invitation decide how formal to be, and the month decides what that formality is made of. The Emily Post Institute's attire guide lists the same black tie options for a January ballroom and a July garden: a floor-length evening gown, a dressy cocktail dress or your dressiest little black dress for women, a black tuxedo for men. What changes with the season is the fabric weight, the sleeve, the layer you carry and the shoe you can walk in. So the order of decisions on this hub is always the same: read the code first (the black tie, cocktail and semi-formal guides set out each list), then let the weather on the day adjust it.",
  "The calendar name is a weak guide to that weather, which is why the climate table above matters more than the season label. NOAA's 1991–2020 climate normals put the average March high at 47.0°F at Chicago O'Hare and 80.6°F in Miami; a \"spring wedding\" in those two cities needs different clothes. July is less varied but more extreme at the top: an average high of 106.5°F in Phoenix and 95.6°F at Dallas-Fort Worth, against 77.4°F at Seattle-Tacoma and 75.1°F at Los Angeles airport. If the wedding is not where you live, look up the normals for the venue, not your own town.",
  "Read the low as carefully as the high. The normal daily low is the coolest part of an average day, and the gap between the two is the range an all-day wedding can cover. In Phoenix in March, NOAA's normals run from 78.1°F down to 54.5°F, a spread of more than twenty degrees; at Seattle-Tacoma in July it is 77.4°F down to 56.8°F. A ceremony in afternoon sun and a reception that ends after dark can sit at opposite ends of that range, so dress for the high and pack for the low.",
  "Our study of 10,700 posts on r/Weddingattireapproval shows when guests are actively planning outfits. Questions peaked in May, with 2,141 posts, and stayed above 1,700 a month from June through August before easing to 1,445 in September. Those are posting dates, not wedding dates, and the April and October figures cover only part of each month, but the shape is clear: guests ask most between May and August, ahead of the late-spring and summer weddings they are dressing for. The word \"summer\" appears in 1,144 posts, more than \"fall\" or \"autumn\" (555, a count that also catches the verb \"fall\"), \"spring\" (260) and \"winter\" (117) put together. As the year turns, fall shows up more: 2.2% of April posts mention fall or autumn, against 10.1% in September.",
  "The other number worth knowing from the same data is about layers. Shawls, wraps, jackets, coats, cardigans, boleros and pashminas come up in 695 posts, about one in fifteen. A seasonal outfit is usually a dress plus a layer, and the layer is often the harder part: it has to suit the code, survive six hours and still look intended when it comes off. That is the practical heart of seasonal dressing, and the cover-ups and wraps guide on this site matches layers to the code and the month.",
  "Summer. The summer wedding guest dresses guide opens with the NOAA July normals above and builds from them: light, loose, breathable fabrics such as cotton voile, linen blends, viscose or lined chiffon in a midi or maxi for daytime, and lightweight crepe or satin for an air-conditioned evening reception. The dress code still sets the length. Emily Post's casual list goes as far as shorts \"depending on occasion and climate\", but a wedding is a ceremony, so take the dressier end of whichever list your invitation points to. For men, summer is the one season with a formal variation written into the rules: Emily Post lists a white dinner jacket with black tuxedo trousers for black tie \"in summer, in the tropics, or on a cruise\".",
  "Summer is also when the white rule is tested most. White is the color mentioned most often in the study, in 2,075 posts, and the \"Is this too white?\" flair alone accounts for 944. Etiquette expert Elaine Swann told TODAY in January 2026 that \"any shades of white\" remain reserved for the bride unless the couple asks guests to wear it. Pale summer fabrics in cream, ivory or a white-ground print are where guests most often slip, and the color hub covers how to check a shade before you buy.",
  "Fall. NOAA's October normals for the Midwest show why fall dressing is mostly about the evening: an average high of 62.7°F and low of 45.4°F at Chicago O'Hare, 58.1°F and 40.9°F in Minneapolis, 62.0°F and 44.0°F in Detroit, 65.5°F and 44.8°F in Columbus, and 69.2°F and 49.1°F in St. Louis. The fall wedding guest dresses guide responds with mid-weight crepe, ponte, satin or velvet, sleeves or a real layer, and a midi that clears damp grass. Emily Post's advice to err toward formality when a semi-formal event starts after 6 p.m. applies more often in fall, simply because more of the day happens after dark.",
  "Two narrower fall guides sit beside it. Mother of the bride fall dresses covers deep, matte or low-sheen colors such as bronze, aubergine, forest, burgundy, navy and chocolate, in fabrics that recover after hours of sitting, with an elbow or three-quarter sleeve. Wedding guest shoes for fall makes the case for block heels, wedges, dressy ankle boots and pointed flats, because a wide heel base will not sink into damp grass or catch in gravel, and suggests closed toes for outdoor events after about 4 p.m. from October on.",
  "Winter. There are no winter climate numbers on this hub because none have been read into the site's source register yet, so the winter guidance rests on the dress code and on fabric. The winter wedding guest dresses guide points to velvet, heavy satin, heavy crepe and brocade in jewel tones such as emerald, sapphire, burgundy and plum, or in black and navy, with long sleeves or a real coat and a midi that clears wet ground. It also notes that Emily Post's black tie list allows a dressy cocktail dress or your dressiest little black dress, which is useful when a long gown under a long coat is too much to manage.",
  "December brings its own code. The winter wedding guest dresses guide covers Christmas, holiday and New Year's Eve weddings and explains \"festive attire\", which the Emily Post Institute defines as cocktail-party attire with a seasonal touch, usually for the holidays. Its list for women is a cocktail dress, a long dressy skirt and top, a dressy pants outfit or separates, or a little black dress, with the instruction to \"feature holiday colors\". That gives a winter guest more room than a plain cocktail code: a velvet skirt with a metallic top is as correct as a dress.",
  "Spring. The spring wedding guest dresses guide starts from the widest spread in the climate table: March highs from 47.0°F in Chicago to 80.6°F in Miami. That spread is why spring advice has to be conditional. In the colder cities a March wedding is a late-winter wedding with lighter colors, needing sleeves or a layer and closed shoes; in Phoenix, Los Angeles or Miami it is an early-summer one. Rain is the other spring variable. NOAA's March precipitation normals run from 4.68 inches in Atlanta and 4.29 inches in Central Park to 1.73 inches at Los Angeles airport and 0.83 inches in Phoenix, so in the wetter cities, plan for soft ground and a hem that clears it.",
  "Men get the same seasonal logic with fewer variables. Emily Post's wedding guest guide gives men a dark suit for formal daytime weddings and a tuxedo or dark suit for formal evenings, and for semiformal daytime events a dark suit or a blazer with gray flannels and a tie. Season changes the cloth and the color within those lists: a lighter-weight suit in summer, a heavier one in winter, and the summer white dinner jacket only where the code is black tie. The wedding dress code for men guide sets out the full list for every code.",
  "The mistakes this hub exists to prevent are consistent. The first is treating the season as the dress code: a summer wedding with a black tie invitation is still black tie, just in lighter fabric. The second is dressing for the ceremony and forgetting the reception, which is where the gap between NOAA's normal high and low catches people out. The third is choosing a pale seasonal shade without checking whether it reads as white. And the fourth is dressing for your own climate when the wedding is somewhere else.",
  "How to use the guides listed above: find your season's group, open the guide, and read it alongside the dress-code guide for your invitation. The summer, fall, winter and spring guides each match fabric and color to the code; the winter guide also covers festive and holiday attire, and the fall guide covers shoes for grass and gravel and what the mothers of the couple wear once the weather turns. If the wedding falls between seasons, read both guides and dress for the colder one, since a layer is easy to take off and impossible to conjure.",
];

export default function SeasonPillarPage() {
  return (
    <PillarHub
      pillarSlug="season"
      pillarLabel="Season"
      h1="Wedding Guest Dresses by Season"
      answer="Choose by the weather on the day, not the name of the season: the dress code sets length and formality, and the month changes fabric weight, sleeves, layers and shoes. NOAA's climate normals show why the label misleads, with average March highs of 47°F in Chicago and 81°F in Miami. Check the venue's normal high and low, dress the code for the high, and carry a layer for the low."
      intro="Every season changes the fabric, sleeves and layers a dress code calls for, but not the code itself. Use the climate table below to see how different the same month can be from city to city, then open the guide for your season: summer, fall, winter, spring and the December holiday codes, with the fall shoes and mother of the bride guides alongside."
      lead={
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          <CompareTable
            kind="compare"
            title="Average high / low by city: March vs July (°F)"
            columns={["March", "July"]}
            rows={CLIMATE_ROWS}
            caption="Source: NOAA National Centers for Environmental Information, U.S. Climate Normals 1991–2020 (monthly mean maximum and minimum temperature, °F), read 12 October 2026 (March) and 22 October 2026 (July). Normals are 30-year averages; a given day can be hotter or colder."
          />
          <BarChart
            kind="bars"
            title="When guests ask for outfit help: posts per month"
            data={MONTHS}
            caption={`Method: every post counted once by its UTC creation date. April and October are partial months (archive window 16 April – 21 October). Dates are when the question was posted, not when the wedding took place. ${STUDY_SOURCE}.`}
          />
        </div>
      }
      sections={seasonSections}
      longFormParagraphs={longForm}
      products={picksForPillar(getPillarSlugs("season"), 12)}
      groups={getPillarGroups("season")}
      sources={[
        {
          publisher: "NOAA National Centers for Environmental Information",
          title: "U.S. Climate Normals 1991–2020 (monthly)",
          url: "https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals",
          readOn: "22 October 2026",
          supports: "March and July average highs and lows for ten U.S. cities, March precipitation normals, and October highs and lows for Chicago, Minneapolis, Detroit, Columbus and St. Louis",
        },
        {
          publisher: "The Emily Post Institute",
          title: "Attire Guide: Dress Codes from Casual to White Tie",
          url: "https://emilypost.com/advice/attire-guide-dress-codes-from-casual-to-white-tie",
          readOn: "22 October 2026",
          supports: "the black tie lists for women and men, the white dinner jacket for summer black tie, shorts on the casual list, festive attire, and the after-6 p.m. formality advice",
        },
        {
          publisher: "The Emily Post Institute",
          title: "Wedding Guest Attire: What to Wear to a Wedding",
          url: "https://emilypost.com/advice/wedding-guest-attire",
          readOn: "22 October 2026",
          supports: "men's daytime and evening lists for formal and semiformal weddings",
        },
        {
          publisher: "TODAY (etiquette expert Elaine Swann)",
          title: "TikTok Says You Can't Wear Red to Weddings. Does an Etiquette Expert Agree? (27 January 2026)",
          url: "https://www.today.com/life/wearing-red-to-wedding-debate-rcna251668",
          readOn: "22 October 2026",
          supports: "\"any shades of white\" reserved for the bride unless the couple asks",
        },
        {
          publisher: "weddinggueststyle.com analysis of r/Weddingattireapproval",
          title: "10,700 posts, 16 April – 21 October 2026 (Arctic Shift archive; aggregate counts only)",
          url: "https://www.reddit.com/r/Weddingattireapproval/",
          readOn: "22 October 2026",
          supports: "posts per month; season words (summer 1,144, fall/autumn 555, spring 260, winter 117); layering words 695; white 2,075 and the 944 \"Is this too white?\" posts",
        },
      ]}
    />
  );
}
