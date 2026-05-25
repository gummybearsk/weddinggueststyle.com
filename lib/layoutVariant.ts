/**
 * Deterministic layout variant picker.
 * Same slug always gets the same variant — no per-render randomness, no hydration mismatch.
 *
 * Purpose: defeat Google's "Scaled Content Abuse" / templated-content classifier (March 2024 spam policy)
 * by making sure no two inner pages share more than ~30% structural skeleton.
 */

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export type LayoutVariant = "A" | "B" | "C" | "D" | "E";
export type HeadingStyle = "serif" | "bold-sans" | "serif-italic";
export type EyebrowStyle = "edit-count" | "volume" | "hand-picked";

export interface LayoutPlan {
  variant: LayoutVariant;            // overall section ordering
  headingStyle: HeadingStyle;        // h2 typography
  eyebrowStyle: EyebrowStyle;        // header eyebrow phrasing
  showSectionDividers: boolean;      // decorative dividers
  showPullQuote: boolean;            // pull-quote callout between sections
  showFactsBox: boolean;             // "quick facts" stat box near top
  splitContentAt: number;            // which content-section index splits the article (for B/C/E)
  faqVisibleByDefault: number;       // how many FAQs render expanded vs collapsed; affects perceived length
}

const VARIANTS: LayoutVariant[] = ["A", "B", "C", "D", "E"];
const HEADING: HeadingStyle[] = ["serif", "bold-sans", "serif-italic"];
const EYEBROW: EyebrowStyle[] = ["edit-count", "volume", "hand-picked"];

export function getLayoutPlan(slug: string, sectionCount: number): LayoutPlan {
  const h = hashSlug(slug);
  const variant = VARIANTS[h % VARIANTS.length];
  const headingStyle = HEADING[(h >> 3) % HEADING.length];
  const eyebrowStyle = EYEBROW[(h >> 6) % EYEBROW.length];
  const showSectionDividers = ((h >> 9) & 1) === 0;
  const showPullQuote = ((h >> 11) & 1) === 0 && sectionCount >= 3;
  const showFactsBox = ((h >> 13) & 1) === 0;

  // Split somewhere in the middle so the two halves are balanced for B/C/E layouts.
  const splitContentAt =
    sectionCount > 2 ? Math.max(1, Math.min(sectionCount - 1, Math.floor(sectionCount / 2) + ((h >> 15) % 2))) : 0;

  const faqVisibleByDefault = 1 + ((h >> 17) % 3); // 1-3
  return {
    variant,
    headingStyle,
    eyebrowStyle,
    showSectionDividers,
    showPullQuote,
    showFactsBox,
    splitContentAt,
    faqVisibleByDefault,
  };
}

export function headingClass(style: HeadingStyle): string {
  switch (style) {
    case "bold-sans":
      return "text-2xl sm:text-3xl font-bold text-ink-900";
    case "serif-italic":
      return "display-serif display-italic italic text-2xl sm:text-3xl text-ink-900";
    case "serif":
    default:
      return "display-serif text-2xl sm:text-3xl text-ink-900";
  }
}

export function eyebrowText(style: EyebrowStyle, count: number): string {
  switch (style) {
    case "volume":
      return `Volume · ${count} picks`;
    case "hand-picked":
      return `${count} hand-picked`;
    case "edit-count":
    default:
      return `The Edit · ${count} picks`;
  }
}
