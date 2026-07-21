import Link from "next/link";
import ProductCarousel from "./ProductCarousel";
import { Product } from "@/lib/types";
import { FeaturedNiche } from "@/lib/featured";

/**
 * Product-first block for the homepage and pillar hubs.
 *
 * Readers arrive from search wanting a dress. Previously they landed on a wall of editorial
 * with no product visible until a second click, so many left before ever seeing anything
 * buyable. Each niche here shows a live product row immediately, with the guide behind it
 * one link away — the content still signals expertise, it just stops blocking the path.
 */
export default function ShopTheEdit({
  featured,
  heading = "Shop by category",
  standfirst,
}: {
  featured: { niche: FeaturedNiche; products: Product[] }[];
  heading?: string;
  standfirst?: string;
}) {
  if (!featured.length) return null;

  return (
    <section className="bg-ivory py-14 sm:py-20 border-y border-ink-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="eyebrow text-blush-600 mb-3">The edit</p>
        <h2 className="display-serif text-3xl sm:text-4xl text-ink-900 mb-3">{heading}</h2>
        {standfirst && (
          <p className="text-base text-ink-700 font-light leading-relaxed max-w-3xl mb-12">
            {standfirst}
          </p>
        )}

        <div className="space-y-16">
          {featured.map(({ niche, products }) => (
            <div key={niche.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-2">
                <h3 className="display-serif text-xl sm:text-2xl text-ink-900">
                  <Link href={`/${niche.slug}`} className="hover:text-blush-600 transition-colors">
                    {niche.label}
                  </Link>
                </h3>
                <Link
                  href={`/${niche.slug}`}
                  className="text-[11px] tracking-[0.18em] uppercase text-blush-600 hover:text-blush-700 transition-colors border-b border-blush-300 hover:border-blush-500 pb-0.5"
                >
                  See all {niche.label.toLowerCase()} →
                </Link>
              </div>
              <p className="text-sm text-ink-600 font-light mb-6 max-w-2xl">{niche.blurb}</p>
              <ProductCarousel products={products} seeAllSlug={niche.slug} seeAllLabel={`See all ${niche.label.toLowerCase()}`} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
