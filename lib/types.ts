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
  /** ISO end of the current deal, when one is running. */
  priceValidUntil?: string;
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
}

export interface HomepageSection {
  id: string;
  title: string;
  description: string;
  slug: string;
  products: Product[];
}
