import { Product } from "@/lib/types";

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(rating);
          const halfFilled =
            !filled && star === Math.floor(rating) + 1 && rating % 1 >= 0.3;
          return (
            <svg
              key={star}
              className={`w-4 h-4 ${
                filled
                  ? "text-amber-400"
                  : halfFilled
                  ? "text-amber-400"
                  : "text-gray-200"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              {halfFilled ? (
                <>
                  <defs>
                    <linearGradient id={`half-${star}`}>
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="#e5e7eb" />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#half-${star})`}
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </>
              ) : (
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              )}
            </svg>
          );
        })}
      </div>
      <span className="text-xs text-gray-500 font-medium">
        {rating.toFixed(1)}
      </span>
      <span className="text-xs text-gray-400">
        ({count.toLocaleString()})
      </span>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-rose-100/50 hover:border-rose-100 transition-all duration-300 flex flex-col h-full group">
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="block relative aspect-[3/4] bg-gradient-to-b from-gray-50 to-white overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.title}
          className="product-card-img w-full h-full object-contain p-2"
          loading="lazy"
        />
      </a>
      <div className="p-3.5 sm:p-4 flex flex-col flex-1">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-rose-600 transition-colors mb-2 leading-snug"
        >
          {product.title}
        </a>
        <div className="mt-auto space-y-2">
          <StarRating rating={product.rating} count={product.reviewCount} />
          <p className="text-lg font-bold text-gray-900 tracking-tight">
            {product.price}
          </p>
          {product.sizingNote && (
            <p className="text-xs text-amber-700 bg-amber-50/80 px-2.5 py-1 rounded-md border border-amber-100">
              {product.sizingNote}
            </p>
          )}
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="cta-pulse block w-full text-center text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg py-2.5 transition-colors mt-2.5 shadow-sm hover:shadow-md hover:shadow-rose-200/50"
          >
            Shop Now
          </a>
        </div>
      </div>
    </article>
  );
}
