import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

/**
 * Real discounts only.
 *
 * Every percentage here comes from Amazon's API `savingsPercent`, never computed by us and
 * never invented. No countdown timers, no "only 2 left" — manufactured urgency is both a
 * trust problem and an AdSense/affiliate-policy problem. If nothing is genuinely on sale,
 * this renders nothing.
 */
export default function DealsRow({ products, asOf }: { products: Product[]; asOf?: string }) {
  if (!products.length) return null;

  return (
    <section className="bg-cream-50 border-y border-ink-200 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-8">
          <div>
            <p className="eyebrow text-blush-600 mb-2">Price Drops</p>
            <h2 className="display-serif text-3xl sm:text-4xl text-ink-900">On Sale Right Now</h2>
          </div>
          <p className="text-xs text-ink-500 max-w-sm">
            Discounts straight from Amazon&rsquo;s live pricing{asOf ? `, as of ${asOf}` : ""}. Prices
            and availability change — check before you buy.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {products.map((p) => (
            <ProductCard key={p.url} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
