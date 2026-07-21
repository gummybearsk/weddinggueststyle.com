import Link from "next/link";
import { getAllSlugs } from "@/lib/getPages";

function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Footer() {
  const slugs = getAllSlugs();

  // Group slugs into three columns for full coverage
  const third = Math.ceil(slugs.length / 3);
  const col1 = slugs.slice(0, third);
  const col2 = slugs.slice(third, third * 2);
  const col3 = slugs.slice(third * 2);

  return (
    <footer className="bg-cream-50 border-t border-ink-200 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Masthead */}
        <div className="text-center mb-14 pb-10 border-b border-ink-200">
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-900">
            Wedding Guest <span className="font-serif-italic italic text-blush-600">Style</span>
          </h2>
          <p className="eyebrow mt-3 text-ink-500">An editorial guide · Est. 2026</p>
        </div>

        {/* Brand + Disclosure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
          <div>
            <p className="eyebrow mb-3">Editor&apos;s Note</p>
            <p className="text-base text-ink-700 leading-[1.75] font-light mb-4">
              A curated edit of wedding guest dresses, hand-picked for the women
              who get dressed for the photograph. Organized by every variable
              that matters — season, dress code, color, body type, venue.
            </p>
            <p className="text-sm text-ink-600 italic font-light">
              Edited by{" "}
              <Link href="/author/sukie-gao" className="text-blush-600 hover:underline">
                Sukie Gao
              </Link>
              {" "}(
              <a href="https://www.instagram.com/sukiegao/" target="_blank" rel="noopener noreferrer me" className="text-blush-600 hover:underline not-italic">
                @sukiegao
              </a>
              ). Articles are researched with AI assistance and edited by Sukie before publication.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-3">Disclosure</p>
            <p className="text-sm text-ink-600 leading-[1.7] font-light">
              Wedding Guest Style is a participant in the Amazon Services LLC
              Associates Program. When you click an affiliate link and make a
              purchase, we may earn a commission at no cost to you. See our{" "}
              <Link href="/editorial" className="text-blush-600 hover:underline">
                Editorial Guidelines
              </Link>
              {" "}for our full review process. Prices and availability shown are accurate as
              of the date displayed and are subject to change; the price shown at checkout
              applies.
            </p>
          </div>
        </div>

        {/* All category links in 3 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2 mb-12">
          <div>
            <p className="eyebrow mb-4">The Edit</p>
            <ul className="space-y-2.5">
              {col1.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="text-sm text-ink-600 hover:text-blush-600 transition-colors font-light"
                  >
                    {formatSlug(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">More Styles</p>
            <ul className="space-y-2.5">
              {col2.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="text-sm text-ink-600 hover:text-blush-600 transition-colors font-light"
                  >
                    {formatSlug(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1 mt-4 sm:mt-0">
            <p className="eyebrow mb-4">Collections</p>
            <ul className="space-y-2.5">
              {col3.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="text-sm text-ink-600 hover:text-blush-600 transition-colors font-light"
                  >
                    {formatSlug(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust pages */}
        <div className="pt-8 border-t border-ink-200">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.18em]">
            <li><Link href="/about" className="text-ink-600 hover:text-blush-600 transition-colors">About</Link></li>
            <li><Link href="/editorial" className="text-ink-600 hover:text-blush-600 transition-colors">Editorial</Link></li>
            <li><Link href="/author/sukie-gao" className="text-ink-600 hover:text-blush-600 transition-colors">Editor</Link></li>
            <li><Link href="/contact" className="text-ink-600 hover:text-blush-600 transition-colors">Contact</Link></li>
            <li><Link href="/privacy" className="text-ink-600 hover:text-blush-600 transition-colors">Privacy</Link></li>
            <li><Link href="/terms" className="text-ink-600 hover:text-blush-600 transition-colors">Terms</Link></li>
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-ink-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
            &copy; {new Date().getFullYear()} Wedding Guest Style
          </p>
          <p className="text-[11px] italic text-ink-500 font-light">
            Prices and availability subject to change
          </p>
        </div>
      </div>
    </footer>
  );
}
