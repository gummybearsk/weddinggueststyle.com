"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/types";

interface ProductCarouselProps {
  products: Product[];
  seeAllSlug?: string;
  seeAllLabel?: string;
}

export default function ProductCarousel({
  products,
  seeAllSlug,
  seeAllLabel = "See all",
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/carousel">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className={`hidden md:flex absolute -left-4 top-[40%] -translate-y-1/2 z-10 w-11 h-11 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg transition-all duration-200 hover:bg-rose-50 hover:border-rose-200 hover:shadow-rose-100/50 ${
          canScrollLeft
            ? "opacity-0 group-hover/carousel:opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll left"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-1 px-1"
      >
        {products.map((product, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[175px] sm:w-[200px] md:w-[220px] lg:w-[230px] snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className={`hidden md:flex absolute -right-4 top-[40%] -translate-y-1/2 z-10 w-11 h-11 items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg transition-all duration-200 hover:bg-rose-50 hover:border-rose-200 hover:shadow-rose-100/50 ${
          canScrollRight
            ? "opacity-0 group-hover/carousel:opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll right"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Scroll indicators (mobile) + See all link */}
      <div className="mt-4 flex items-center justify-between">
        {/* Mobile scroll hint */}
        <div className="flex md:hidden items-center gap-1.5 text-xs text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          <span>Swipe to see more</span>
        </div>
        <div className="hidden md:block" />

        {seeAllSlug && (
          <Link
            href={`/${seeAllSlug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors group/link px-3 py-1.5 rounded-full hover:bg-rose-50"
          >
            {seeAllLabel}
            <svg
              className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
