import { getPublishedPageData } from "./getPages";

/**
 * Accessory / styling pages surfaced across the site by <FinishTheOutfit />.
 *
 * These are drip-scheduled, so each is filtered against getPublishedPageData() — a
 * scheduled page 404s until its publishDate and must not be linked before then.
 */
const CANDIDATES: { title: string; slug: string; blurb: string }[] = [
  {
    title: "How to Accessorize a Wedding Guest Dress",
    slug: "how-to-accessorize-a-wedding-guest-dress",
    blurb: "Metal, earring scale, and what to leave off.",
  },
  {
    title: "Wedding Guest Shoes for Fall",
    slug: "wedding-guest-shoes-for-fall",
    blurb: "Grass, gravel, and nine hours standing.",
  },
  {
    title: "Cover-Ups and Wraps",
    slug: "wedding-guest-cover-ups-and-wraps",
    blurb: "Sleeves your dress doesn't have.",
  },
  {
    title: "Clutches and Bags",
    slug: "wedding-guest-clutches-and-bags",
    blurb: "What fits, and where it goes at dinner.",
  },
];

export function getAccessoryLinks() {
  return CANDIDATES.filter((c) => getPublishedPageData(c.slug) !== null);
}
