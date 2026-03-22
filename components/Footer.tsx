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

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Wedding Guest Style
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your guide to finding the perfect wedding guest dress. We curate
              the best dresses from Amazon so you can look stunning at every
              wedding celebration.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Browse Dresses
            </h3>
            <ul className="space-y-2">
              {slugs.slice(0, 8).map((slug) => (
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
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
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
        <div className="mt-10 pt-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Wedding Guest Style. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
