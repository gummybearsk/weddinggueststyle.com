/**
 * The dress-code ladder, most formal first.
 *
 * Every garment below is taken from the Emily Post Institute's attire guide (SOURCES.md
 * S3, re-read 2026-10-22), which lists women's and men's attire per code. Emily Post files
 * cocktail dresses under semi-formal, so the two share a rung here. Shortened, never
 * extended: if a garment is not in the source list it does not belong on a rung.
 *
 * Rendered by components/visuals/DressCodeLadder.tsx and the homepage decoder.
 */

export interface DressCodeRung {
  key: string;
  label: string;
  /** Guide pages that explain this rung. First entry is the main guide. */
  slugs: { slug: string; label: string }[];
  /** 1 = least formal, 6 = most formal. Drives the ladder width. */
  formality: number;
  women: string[];
  men: string[];
  /** One sourced note per rung, shown in the decoder. */
  note?: string;
}

export const DRESS_CODE_SOURCE = {
  publisher: "The Emily Post Institute",
  title: "Attire Guide: Dress Codes from Casual to White Tie",
  url: "https://emilypost.com/advice/attire-guide-dress-codes-from-casual-to-white-tie",
  readOn: "22 October 2026",
};

export const DRESS_CODES: DressCodeRung[] = [
  {
    key: "white-tie",
    label: "White tie",
    slugs: [{ slug: "white-tie-attire", label: "White tie attire" }],
    formality: 6,
    women: ["Floor-length evening gown", "Long gloves (optional)"],
    men: ["Black tailcoat and matching trousers", "White piqué wing-collar shirt", "White vest and white bow tie", "White or gray gloves"],
    note: "The most formal code there is.",
  },
  {
    key: "black-tie",
    label: "Black tie",
    slugs: [{ slug: "black-tie-attire", label: "Black tie attire" }],
    formality: 5,
    women: ["Floor-length evening gown", "Dressy cocktail dress", "Your dressiest little black dress"],
    men: ["Black tuxedo", "Formal white shirt with studs and cufflinks", "Black bow tie", "Black patent shoes"],
    note: "In summer or the tropics a white dinner jacket replaces the black one.",
  },
  {
    key: "black-tie-optional",
    label: "Black tie optional",
    slugs: [{ slug: "what-does-black-tie-optional-mean", label: "Black tie optional" }],
    formality: 4,
    women: ["Floor-length evening gown", "Dressy cocktail dress", "A little black dress", "Dressy separates"],
    men: ["Tuxedo", "Or a dark suit, white dress shirt and conservative tie"],
    note: "A tuxedo is welcome, a dark suit is fine.",
  },
  {
    key: "semi-formal",
    label: "Semi-formal & cocktail",
    slugs: [
      { slug: "what-is-semi-formal-attire", label: "Semi-formal attire" },
      { slug: "what-is-cocktail-attire", label: "Cocktail attire" },
    ],
    formality: 3,
    women: ["Short afternoon or cocktail dress", "A little black dress", "Long dressy skirt and top", "Dressy separates"],
    men: ["Dark business suit", "Dress shirt and tie", "Leather dress shoes"],
    note: "If it starts after 6 p.m., err toward the formal end.",
  },
  {
    key: "dressy-casual",
    label: "Dressy casual",
    slugs: [{ slug: "what-is-dressy-casual-for-a-wedding", label: "Dressy casual" }],
    formality: 2,
    women: ["Dress", "Skirt and dressy top", "Dressy pants outfit"],
    men: ["Sport coat or blazer with slacks", "Dress or open-collar shirt", "Tie optional"],
  },
  {
    key: "casual",
    label: "Casual",
    slugs: [{ slug: "what-to-wear-to-a-casual-wedding", label: "Casual" }],
    formality: 1,
    women: ["Sundress", "Long or short skirt", "Khakis or nice jeans"],
    men: ["Khakis or good jeans", "Button-down shirt or polo", "Loafers"],
    note: "Emily Post's casual list is for any event; at a wedding, pick its dressier end.",
  },
];
