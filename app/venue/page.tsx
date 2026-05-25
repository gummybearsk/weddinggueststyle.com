import type { Metadata } from "next";
import PillarHub from "@/components/PillarHub";
import { venueSections } from "@/lib/homepageData";

export const metadata: Metadata = {
  title: "Wedding Guest Dresses by Venue — Beach, Garden, Vineyard, Ballroom",
  description:
    "Wedding guest dresses for every venue: beach, garden, vineyard, Indian wedding, formal ballroom, and more. Picks that match the location and its hidden expectations.",
  alternates: { canonical: "https://weddinggueststyle.com/venue" },
};

const longForm = [
  "Venue is the dress code variable that most guests under-weight in their decision. Two weddings with the same printed dress code — say, both labeled \"cocktail attire\" — can require completely different practical choices if one is at a beach and the other in a downtown hotel. Venue determines fabric (will the hem touch sand or grass?), shoe choice (heels sink on grass, slip on marble, get ruined in sand), color palette (what photographs well against this background?), and modesty expectations (religious venues have rules that don't appear on the invitation).",
  "Beach wedding guest dressing is governed by sand, wind, and sun. Maxi length is risky — the hem drags in sand and lifts dramatically in wind. Mid-calf or just-above-the-knee midi works best. Fabric: lightweight, opaque, low-static (chiffon, silk-cotton blend, lined cotton). Color: the saturated tropical brights look great in person but often photograph oddly against the bright background — softer pastels (butter yellow, soft coral, dusty rose) and rich jewel tones (emerald, sapphire) photograph more reliably. Shoes: never stilettos. Block heels, wedges, embellished flats, or designed-for-sand espadrille wedges all work.",
  "Garden weddings and outdoor receptions on grass create one major constraint: heel sinking. Stiletto-style heels press into grass, sink, and require you to walk on tip-toes all evening; block heels, wedges, and platform sandals stay stable. For dresses, choose silhouettes that move well — a fluttering midi or a printed maxi in lightweight fabric photographs beautifully in natural light. Color: jewel tones and rich autumnal shades pop against greenery; pale neutrals can wash out. Bring a structured wrap or shawl — outdoor garden temperatures can drop 15-20°F after sunset.",
  "Vineyard wedding guest dressing is essentially garden-party dressing with a more sophisticated palette and a longer expected daytime-to-evening transition. Most vineyard weddings start with daytime ceremony, move through golden-hour cocktails, and end with evening reception. Choose dresses with enough fabric weight to handle the late-day temperature drop (chiffon over silk slip, light wool-blend, or crepe). Color palette: deeper jewel tones, rich earth shades (cognac, terracotta, mustard, deep rose), and warm metallics all photograph beautifully against vineyard backdrops. Avoid pure white (always), but also avoid pale sage or pale dusty blue which compete with vineyard's natural greens and slates.",
  "Indian wedding guest dressing varies dramatically by which event you're attending (sangeet, mehndi, haldi, ceremony, reception) and which region's traditions the couple follows. Non-Indian guests are increasingly invited to wear lehengas, anarkalis, or saris at the formal ceremony; Western formal works at the reception. Best universal advice: ask the couple specifically, embrace color (Indian wedding fashion celebrates jewel tones, golds, and brights that Western traditions discourage), and absolutely avoid red and white at the wedding ceremony — red is the bride's color, white is associated with mourning in many Hindu traditions.",
  "Formal ballroom and hotel weddings are the most predictable venue type. Indoor controlled environment, formal lighting, plated dinner service, structured pace. The dress code drives everything — a black tie ballroom calls for floor-length, a cocktail ballroom calls for fitted midi, a semi-formal ballroom accepts knee-length. Fabric matters more than color in ballroom venues: under banquet hall lighting, satin and beaded fabrics catch the light and photograph beautifully; matte fabrics like crepe and ponte read polished but flatter in photos. Bring layers — ballrooms are often kept aggressively cold for the food service.",
  "Religious-venue weddings (Catholic, Orthodox, Jewish, Hindu, Muslim, Buddhist) add modesty constraints that the printed dress code rarely mentions. Universal safe choices: covered shoulders or a wrap available for the ceremony, hem at or below the knee, modest neckline, conservative color. Many religious ceremonies move directly into a reception where Western formality applies — bring a stylish covering (a lace shawl, an open kimono, a structured blazer) that you can wear during the ceremony and remove for the reception. The respect signal of modest ceremony dressing carries weight even at couples who don't strictly enforce it.",
];

export default function VenuePillarPage() {
  return (
    <PillarHub
      pillarSlug="venue"
      pillarLabel="Venue"
      h1="Wedding Guest Dresses by Venue"
      intro="Beach, garden, vineyard, Indian wedding, ballroom, religious venue — each location has hidden constraints that don't appear on the invitation. This pillar guide breaks down dress choices by venue and links to our detailed picks."
      sections={venueSections}
      longFormParagraphs={longForm}
    />
  );
}
