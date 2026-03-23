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
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Brand + Disclosure */}
        <div className="flex flex-col sm:flex-row gap-8 mb-10">
          <div className="sm:flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-3">
              Wedding Guest Style
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your guide to finding the perfect wedding guest dress. We curate
              the best dresses from Amazon so you can look stunning at every
              wedding celebration.
            </p>
          </div>
          <div className="sm:flex-1">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Disclosure
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Wedding Guest Style is a participant in the Amazon Services LLC
              Associates Program, an affiliate advertising program designed to
              provide a means for sites to earn advertising fees by advertising
              and linking to Amazon.com.
            </p>
          </div>
        </div>

        {/* All category links in 3 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2">
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Browse Dresses
            </h3>
            <ul className="space-y-2">
              {col1.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="text-sm text-gray-600 hover:text-rose-600 transition-colors"
                  >
                    {formatSlug(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
              More Styles
            </h3>
            <ul className="space-y-2">
              {col2.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="text-sm text-gray-600 hover:text-rose-600 transition-colors"
                  >
                    {formatSlug(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1 mt-4 sm:mt-0">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
              More Collections
            </h3>
            <ul className="space-y-2">
              {col3.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="text-sm text-gray-600 hover:text-rose-600 transition-colors"
                  >
                    {formatSlug(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Wedding Guest Style. All rights
            reserved.
          </p>
          <p className="text-xs text-gray-400">
            Prices and availability subject to change.
          </p>
        </div>
      </div>
    </footer>
  );
}
