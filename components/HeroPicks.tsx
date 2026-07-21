import { Product } from "@/lib/types";

/**
 * Ranked, argued picks — the conversion core of the page.
 *
 * A flat grid of 90+ dresses gives a shopper no way to choose, so they leave. This block
 * puts a small number of numbered picks up front, each with a stated reason, and demotes
 * the rest of the catalogue to a browsable grid below.
 *
 * The rationale under each pick is generated from data we hold (live price position on
 * this page, live discount, attributes in the listing title) — never from ratings, which
 * Amazon's API does not serve.
 */
export default function HeroPicks({
  products,
  category,
}: {
  products: (Product & { why?: string })[];
  category: string;
}) {
  if (products.length < 3) return null;

  return (
    <section className="mb-16">
      <h2 className="display-serif text-2xl sm:text-3xl text-ink-900 mb-2">
        Our picks for {category.toLowerCase()}
      </h2>
      <p className="text-sm text-ink-600 font-light mb-8 max-w-2xl leading-relaxed">
        Our favourites right now, in order.
      </p>

      <ol className="space-y-6">
        {products.map((p, i) => (
          <li
            key={p.url}
            className="relative group border border-ink-200 bg-ivory hover:border-blush-300 hover:shadow-lg transition-all duration-500"
          >
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="absolute inset-0 z-20"
              aria-label={`Shop ${p.title}`}
            />

            <div className="flex flex-col sm:flex-row gap-5 p-5">
              <div className="relative w-full sm:w-[168px] flex-shrink-0 aspect-[3/4] bg-cream-50 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.04]"
                  loading={i < 2 ? "eager" : "lazy"}
                />
                <span className="absolute top-2 left-2 display-serif text-sm bg-ink-900 text-ivory w-7 h-7 flex items-center justify-center">
                  {i + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0 flex flex-col">
                {p.bestFor && (
                  <p className="eyebrow text-blush-600 text-[10px] mb-2">{p.bestFor}</p>
                )}
                <p className="text-[15px] text-ink-900 leading-snug font-light group-hover:text-blush-600 transition-colors line-clamp-2">
                  {p.title}
                </p>

                {p.why && (
                  <p className="mt-3 text-sm text-ink-700 leading-relaxed font-light">
                    {p.why}
                  </p>
                )}

                <div className="mt-auto pt-4 flex items-center gap-4">
                  <span className="display-serif text-2xl text-ink-900">{p.price}</span>
                  {p.savingsPercent && p.savingsPercent >= 5 ? (
                    <span className="text-[10px] tracking-[0.12em] uppercase bg-blush-600 text-ivory px-2 py-1">
                      {p.savingsPercent}% off
                    </span>
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="ml-auto text-[11px] tracking-[0.2em] uppercase text-ivory bg-ink-900 group-hover:bg-blush-600 px-6 py-3 transition-colors"
                  >
                    Shop Now
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

    </section>
  );
}
