export interface Product {
  title: string;
  image: string;
  url: string;
  price: string;
  rating: number;
  reviewCount: number;
  sizingNote?: string;
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
}

export interface HomepageSection {
  id: string;
  title: string;
  description: string;
  slug: string;
  products: Product[];
}
