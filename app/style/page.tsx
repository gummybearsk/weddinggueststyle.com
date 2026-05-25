import type { Metadata } from "next";
import PillarHub from "@/components/PillarHub";
import { styleSections } from "@/lib/homepageData";

export const metadata: Metadata = {
  title: "Wedding Guest Dresses by Style — Maxi, Midi, Floral, Modest, Long Sleeve",
  description:
    "Wedding guest dresses organized by silhouette and style: maxi, midi, knee-length, A-line, floral, modest, long-sleeve, and more. Picks for every preference.",
  alternates: { canonical: "https://weddinggueststyle.com/style" },
};

const longForm = [
  "Style is the variable where personal preference meets dress code. The same dress code (cocktail, semi-formal, formal) can be honored with very different silhouettes — and the right silhouette for you depends as much on what makes you feel confident as on what the invitation technically allows. This pillar guide groups our picks by silhouette and style preference, so you can start from \"I want a long-sleeve modest dress\" and find the appropriate dress code and venue picks within that.",
  "Maxi dresses dominate 2026 wedding guest dressing. They work for nearly every dress code from cocktail (a flowy chiffon maxi in a saturated color) to black tie (a structured satin or velvet floor-length gown). The maxi works particularly well at outdoor and destination weddings where the hem floats rather than drags. Fabric choice differentiates dress code: silk, satin, and chiffon for formal; cotton, linen-blend, and printed crepe for daytime and casual. Avoid: maxi dresses with thigh-high slits at religious or conservative venues; sheer overlay maxis without proper lining.",
  "Midi length (calf to ankle) is the most versatile wedding guest length and the most flattering for the widest range of body types. A midi works at every dress code except true black tie, photographs well in nearly every venue, and removes the floor-dragging risk of true maxi. The midi shape can be A-line, fit-and-flare, bodycon, wrap, or column — each silhouette fits different bodies. For formal events, a fitted midi in evening-fabric (satin, velvet, beaded chiffon) reads as polished as a true gown; for daytime, a flowy printed midi in cotton-silk blend reads garden-perfect.",
  "Knee-length (just above to just below the knee) is the workhorse silhouette of cocktail attire and the safest length when you're uncertain about dress code. A well-cut knee-length dress in a refined fabric (crepe, lined chiffon, satin-back crepe, or beaded mesh) is appropriate at virtually every wedding short of explicit black tie. The 2026 knee-length favorite: a defined-waist sheath in saturated color with three-quarter sleeves, finished with statement jewelry. Avoid: very short hems (above mid-thigh) at any wedding regardless of dress code.",
  "Floral prints are having a major moment in 2026 wedding guest dressing, but the prints that work and the prints that don't are very specific. Working: small-to-mid-scale botanical prints (think Liberty of London florals, watercolor blooms, vintage-inspired prints in muted colors); abstract floral prints in saturated jewel tones. Not working: bright tropical prints (read more vacation than wedding); large-scale single-bloom prints (compete with the wedding's actual flowers); kitchen-towel small ditsy prints in cheap fabric.",
  "Modest wedding guest dressing — defined as covered shoulders, sleeves at least to the elbow, hem at or below the knee, and modest neckline — is required at most religious ceremonies and increasingly chosen for personal preference at secular ones. Best silhouettes: long-sleeve midi or maxi A-line; high-neck wrap with full-length sleeves; collared shirtdress in elevated fabric. Color and fabric still drive formality: a long-sleeve floor-length dress in beaded mesh reads black-tie; the same silhouette in cotton-poplin reads casual. Modest does not mean shapeless or apologetic — defined waist, considered draping, and statement accessories all elevate.",
  "Long-sleeve dresses have shifted from a winter-only category to a year-round option. The 2026 long-sleeve picks include lightweight chiffon long-sleeves for summer (cooler than they sound, since they shield arms from sun), satin and silk-blend long-sleeves for formal evening events, and the workhorse cotton-blend long-sleeve midi for outdoor fall and spring weddings. The cut of the sleeve matters: a fitted long sleeve (especially in a structured fabric) elongates; a billowy bishop sleeve adds volume; a bell sleeve adds movement; a flutter sleeve adds softness. Pick the sleeve shape that complements your other proportions.",
];

export default function StylePillarPage() {
  return (
    <PillarHub
      pillarSlug="style"
      pillarLabel="Style"
      h1="Wedding Guest Dresses by Style"
      intro="Maxi, midi, knee-length, A-line, floral, modest, long-sleeve — wedding guest dresses organized by the silhouette and details you want. This pillar guide breaks down what works where, and links to our detailed picks."
      sections={styleSections}
      longFormParagraphs={longForm}
    />
  );
}
