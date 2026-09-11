export interface Product {
  title: string;
  image: string;
  url: string;
  price: string;
  /**
   * @deprecated Amazon's Creators API does not serve customerReviews — these values can
   * only have come from scraping. Retained so existing content JSON still parses, but they
   * are never rendered and never emitted as AggregateRating schema.
   */
  rating?: number;
  /** @deprecated See `rating`. */
  reviewCount?: number;
  sizingNote?: string;

  // ── Editorial fields (ours, not Amazon's) ──────────────────────────────────
  /** Who this pick is for, e.g. "Petite frames" / "Best value under $50". Rendered as a badge. */
  bestFor?: string;
  /** 2-4 sentences of reasoning for a ranked pick. Present only on hero picks. */
  why?: string;

  // ── Populated at build/ISR from content/amazon-data.json (never hand-edited) ─
  inStock?: boolean;
  savingsPercent?: number;
  /** Actual Amazon seller (merchantInfo.name) — we are not the merchant. */
  seller?: string;
  condition?: string;
  availability?: string;
  /** ISO start/end of the current deal, when one is running. */
  priceValidUntil?: string;
  priceValidFrom?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ContentSection {
  heading: string;
  content: string;
}

export interface RelatedPage {
  title: string;
  slug: string;
}

export interface PageData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  products: Product[];
  contentSections: ContentSection[];
  faqs: FAQ[];
  relatedPages: RelatedPage[];
  publishDate?: string; // ISO date string (YYYY-MM-DD). Pages with future dates are hidden until that date.
  /**
   * Outbound authority citations (Rule 29 / Rule 44e). Every claim of convention or
   * etiquette on a page should be traceable to a named body that publishes it, with the
   * date it was read. A hedge is not a source — see SOURCES.md.
   */
  sources?: PageSource[];
  /** Editorial hero photograph, credited. */
  heroImage?: PageImage;
  /** Override the per-type product cap (lib/productCap.ts) for this page. */
  productCap?: number;
}

/**
 * An editorial photograph with its licence trail (Rule 29 / Rule 44e).
 *
 * NOTE: a licensed stock photo improves the page but does NOT satisfy Rule 22's
 * "Experience" signal — Google's quality-rater guidance explicitly discounts generic
 * stock. Only original photography by the author does that. See SOURCES.md.
 */
export interface PageImage {
  /** images.unsplash.com file URL, without query params. */
  url: string;
  alt: string;
  photographer: string;
  /** Photographer's profile page, for the visible credit link. */
  profileUrl: string;
  /** e.g. "Unsplash". */
  source: string;
  sourceUrl: string;
}

export interface PageSource {
  /** Publisher, e.g. "The Emily Post Institute". */
  publisher: string;
  /** Page or article title as published. */
  title: string;
  url: string;
  /** ISO date the source was last read, shown to the reader. */
  readOn: string;
  /** What this source supports on this page. */
  supports: string;
}

export interface HomepageSection {
  id: string;
  title: string;
  description: string;
  slug: string;
  products: Product[];
}
