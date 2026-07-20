import { Product } from "@/lib/types";

/**
 * Affiliate product card.
 *
 * Design notes (ported from BuilderGelNails, which converts well on low traffic):
 *  - The WHOLE card is one stretched anchor. Three separate links (image/title/button)
 *    leave dead zones between them, and shoppers click the photo far more than the CTA.
 *  - rel includes `sponsored` — Google's documented signal for affiliate links since 2019.
 *    `nofollow` alone is stale.
 *  - Star ratings are deliberately absent. Amazon's Creators API does not serve
 *    customerReviews, so any rating on screen would be scraped. We differentiate with
 *    editorial `bestFor` badges instead — which is what actually drives the click.
 *  - Price always renders: live API price, never a stale baked-in string.
 */

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent";
}) {
  const styles =
    tone === "accent"
      ? "bg-blush-600 text-ivory"
      : "bg-ivory/95 text-ink-800 border border-ink-200";
  return (
    <span
      className={`${styles} text-[10px] tracking-[0.12em] uppercase font-medium px-2 py-1 backdrop-blur-sm`}
    >
      {children}
    </span>
  );
}

export default function ProductCard({
  product,
  rank,
}: {
  product: Product;
  rank?: number;
}) {
  return (
    <article className="product-card relative bg-ivory border border-ink-200 hover:border-blush-300 hover:shadow-lg transition-all duration-500 flex flex-col h-full group">
      {/* Stretched anchor — covers the entire card so no click is wasted. */}
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        className="absolute inset-0 z-20"
        aria-label={`Shop ${product.title} on Amazon`}
      />

      <div className="relative aspect-[3/4] bg-cream-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="product-card-img w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {rank ? (
          <span className="absolute top-2 left-2 z-10 display-serif text-sm bg-ink-900 text-ivory w-7 h-7 flex items-center justify-center">
            {rank}
          </span>
        ) : null}
        {product.savingsPercent && product.savingsPercent >= 5 ? (
          <span className="absolute top-2 right-2 z-10">
            <Badge tone="accent">{product.savingsPercent}% off</Badge>
          </span>
        ) : null}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {product.bestFor ? (
          <p className="text-[10px] tracking-[0.14em] uppercase text-champagne-600 mb-2">
            {product.bestFor}
          </p>
        ) : null}

        <p className="text-[13px] text-ink-800 line-clamp-2 group-hover:text-blush-600 transition-colors mb-3 leading-snug font-light">
          {product.title}
        </p>

        <div className="mt-auto space-y-3">
          <p className="display-serif text-2xl text-ink-900">{product.price}</p>

          {product.sizingNote && (
            <p className="text-xs text-champagne-600 italic">{product.sizingNote}</p>
          )}

          {/* Visual affordance only — the stretched anchor above is the real link, so this
              must not be a second tab stop or a duplicate screen-reader announcement. */}
          <span
            aria-hidden="true"
            className="cta-pulse block w-full text-center text-[11px] tracking-[0.2em] uppercase font-medium text-ivory bg-ink-900 group-hover:bg-blush-600 py-3.5 transition-colors mt-3"
          >
            Shop Now
          </span>
        </div>
      </div>
    </article>
  );
}
