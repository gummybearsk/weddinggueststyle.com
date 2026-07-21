"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";

/**
 * Dismissible "Editor's Pick" that appears once the reader is past the intro.
 *
 * Why: pages run 2,000+ words with a single product block. A reader deep in the FAQs has
 * to scroll back up to buy. This keeps one high-intent CTA persistently reachable.
 *
 * Deliberate choices, ported from BuilderGelNails:
 *  - Reveals only after 800px of scroll, so it reads as contextual rather than as an
 *    entry popup (which Google treats as an intrusive interstitial on mobile).
 *  - User-dismissible, and the dismissal sticks for the session.
 *  - Desktop only — on mobile it would cover content and risk the interstitial penalty.
 */
export default function StickyEditorPick({ product }: { product: Product | null }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("wgs-pick-dismissed") === "1") {
      setDismissed(true);
      return;
    }
    const onScroll = () => setVisible(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!product || dismissed || !visible) return null;

  function dismiss() {
    sessionStorage.setItem("wgs-pick-dismissed", "1");
    setDismissed(true);
  }

  return (
    <aside
      className="hidden lg:block fixed bottom-6 right-6 z-40 w-[300px] bg-ivory border border-ink-200 shadow-xl animate-in"
      aria-label="Editor's pick"
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss editor's pick"
        className="absolute -top-3 -right-3 z-50 w-7 h-7 bg-ink-900 text-ivory text-sm leading-none hover:bg-blush-600 transition-colors"
      >
        ×
      </button>

      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        className="group flex gap-3 p-3"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-20 h-[104px] object-contain bg-cream-50 flex-shrink-0"
          loading="lazy"
        />
        <div className="min-w-0 flex flex-col">
          <p className="eyebrow text-blush-600 text-[10px] mb-1">Editor&rsquo;s pick</p>
          {product.bestFor && (
            <p className="text-[10px] uppercase tracking-[0.12em] text-champagne-600 mb-1">
              {product.bestFor}
            </p>
          )}
          <p className="text-[12px] text-ink-800 line-clamp-2 leading-snug font-light group-hover:text-blush-600 transition-colors">
            {product.title}
          </p>
          <p className="display-serif text-lg text-ink-900 mt-auto pt-1">{product.price}</p>
          <span className="text-[10px] tracking-[0.16em] uppercase text-blush-600 mt-1">
            View →
          </span>
        </div>
      </a>
    </aside>
  );
}
