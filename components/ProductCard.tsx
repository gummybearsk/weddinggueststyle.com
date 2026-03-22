import { Product } from "@/lib/types";

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.round(rating) ? "text-amber-400" : "text-gray-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-500">({count.toLocaleString()})</span>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="block relative aspect-[3/4] bg-gray-50 overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </a>
      <div className="p-3 flex flex-col flex-1">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-rose-600 transition-colors mb-1"
        >
          {product.title}
        </a>
        <div className="mt-auto space-y-1.5">
          <StarRating rating={product.rating} count={product.reviewCount} />
          <p className="text-base font-bold text-gray-900">{product.price}</p>
          {product.sizingNote && (
            <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
              {product.sizingNote}
            </p>
          )}
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block w-full text-center text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md py-2 transition-colors mt-2"
          >
            Shop on Amazon
          </a>
        </div>
      </div>
    </article>
  );
}
