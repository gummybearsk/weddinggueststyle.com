"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/types";

const INITIAL_COUNT = 16;
const LOAD_MORE_COUNT = 16;

export default function ProductGrid({ products }: { products: Product[] }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const hasMore = visibleCount < products.length;
  const visibleProducts = products.slice(0, visibleCount);
  const remaining = products.length - visibleCount;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {visibleProducts.map((product, i) => (
          <ProductCard key={i} product={product} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
            className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-rose-600 bg-white border-2 border-rose-200 rounded-full hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Show More Dresses ({remaining} remaining)
          </button>
        </div>
      )}
    </>
  );
}
