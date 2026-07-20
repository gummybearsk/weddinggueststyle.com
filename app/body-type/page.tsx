import type { Metadata } from "next";
import PillarHub from "@/components/PillarHub";
import { picksForPillar } from "@/lib/featured";
import { priceAsOfLabel } from "@/lib/amazonData";
import { bodyTypeSections } from "@/lib/homepageData";

// Renders live Amazon prices — must revalidate, and therefore MUST be listed in
// next.config.mjs outputFileTracingIncludes (enforced by scripts/check-sitemap-pairing.mjs).
export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Wedding Guest Dresses by Body Type — Plus, Petite, Maternity, Over 50",
  description:
    "Wedding guest dresses cut for every figure. Plus size, petite, maternity, over-50, and silhouettes built to flatter — not hide. Hand-picked Amazon picks.",
  alternates: { canonical: "https://weddinggueststyle.com/body-type" },
};

const longForm = [
  "Body type is the most personal variable in wedding guest dressing, and the one where generic advice fails most spectacularly. The industry's body-type categories (\"hourglass,\" \"pear,\" \"apple,\" \"rectangle\") are useful as starting points but oversimplify what actually flatters real bodies. The bigger questions are: where do you carry weight, where do you want to draw the eye, and what silhouettes have made you feel confident in the past. This pillar guide groups our picks by the categories where readers tell us they want more help.",
  "Plus-size wedding guest dressing has improved dramatically in the last five years. The dominant 2026 advice: choose a defined waist, not a tent silhouette. A wrap dress, a defined-waist A-line, or a bodycon midi with built-in shaping all work better than the \"hide the body\" approach that ruled plus-size advice a decade ago. Fabric matters as much as cut: ponte knit, scuba crepe, and heavier silk-blend hold shape; lightweight chiffon and cheap polyester cling and bunch. For plus-size formal events, look for stretch in the bodice — the difference between a dress that fits and one that pulls is usually 2% spandex woven into the lining.",
  "Petite (5'4\" and under) wedding guest dressing is constrained by hem length more than anything else. A dress that's a perfect midi on a 5'8\" model will hit a petite woman at the calf, lengthening visually in unflattering ways. Solutions: shop petite-specific sizing where available (most Amazon-tier brands now offer petite); for non-petite-sized dresses, hem to be just below the knee or full floor-length, never mid-shin. Vertical lines, V-necklines, and high-waisted silhouettes all elongate the figure. Avoid horizontal details (wide belts, contrasting hems, big bows at the waist) that visually shorten.",
  "Maternity wedding guest dressing presents the most rapidly-changing constraint set — what fits at week 24 won't fit at week 36, and the dress code doesn't change with you. Best strategy: rent or buy from maternity-specific lines where the fabric is designed to stretch and recover. Bodycon ruched dresses (the style favored by professional maternity photographers) work across nearly all dress codes and all trimesters. For formal events, look for maternity dresses with built-in nursing access if you'll still be nursing post-event.",
  "Over-50 wedding guest dressing has changed more in 2026 than any other body category. The old advice — cover the upper arms, avoid bold colors, stick to longer hems — is largely outdated. Contemporary over-50 wedding guest style favors confident color, well-fitted silhouettes that show real figure, and dress codes appropriate to the event rather than apologetic dressing. Long sleeves and ¾ sleeves are still popular for formal evening events, but for venue and personal preference reasons rather than mandatory coverage. Color: rich jewel tones (emerald, ruby, plum) are universally flattering at every age and venue.",
  "For-big-tummy dressing (a category our readers ask about more than any other) benefits from three structural choices: empire waist (the seam sits just under the bust, skimming over the midsection), wrap silhouette (the diagonal line draws the eye across the body rather than horizontally), and A-line with structured bodice (definition at the bust, gentle skim at the waist, fluid skirt). Vertical details — a long V-neckline, a long necklace, a column of buttons — all draw the eye up and down rather than across.",
  "Two universal notes that apply across body types. First, fit beats brand every time. A $40 dress that fits well looks more expensive than a $400 dress that doesn't. Try on, tailor if needed, return if not right. Second, the photograph compresses depth. A dress that looks beautifully draped in person sometimes photographs as bunched or pulled; conversely, a dress that looks slightly fitted in person often photographs perfectly. If possible, take a quick photo of yourself in the dress before committing — what you see in the mirror and what the camera will see are not the same thing.",
];

export default function BodyTypePillarPage() {
  return (
    <PillarHub
      pillarSlug="body-type"
      pillarLabel="Body Type"
      h1="Wedding Guest Dresses by Body Type"
      intro="Plus-size, petite, maternity, over-50, for-big-tummy — silhouettes built to flatter, not hide. This pillar guide breaks down what works for different bodies and links to our detailed picks."
      sections={bodyTypeSections}
      longFormParagraphs={longForm}
      products={picksForPillar(bodyTypeSections.map((s) => s.slug), 12)}
      asOf={priceAsOfLabel()}
    />
  );
}
