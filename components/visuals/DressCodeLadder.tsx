import Link from "next/link";
import Figure from "./Figure";
import { DRESS_CODES } from "@/lib/dressCodes";
import { getPublishedPageData } from "@/lib/getPages";

/**
 * The dress-code ladder: every code, most formal first, with what women and men wear.
 * Rung width tracks formality so the order reads at a glance. Highlighted rungs are the
 * ones the current page is about.
 */
export default function DressCodeLadder({
  highlight = [],
  title = "The wedding dress-code ladder, most formal first",
  caption,
}: {
  highlight?: string[];
  title?: string;
  caption: string;
}) {
  return (
    <Figure title={title} caption={caption}>
      <ol className="space-y-2">
        {DRESS_CODES.map((rung) => {
          const on = highlight.includes(rung.key);
          const links = rung.slugs.filter((s) => getPublishedPageData(s.slug) !== null);
          return (
            <li
              key={rung.key}
              className={`border ${on ? "border-blush-500 bg-blush-50" : "border-ink-200 bg-ivory"}`}
              style={{ marginRight: `${(6 - rung.formality) * 4}%` }}
            >
              <div className="grid gap-3 sm:grid-cols-[11rem_1fr_1fr] p-3 sm:p-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink-500">
                    Formality {rung.formality}/6
                  </p>
                  <p className={`display-serif text-base sm:text-lg ${on ? "text-blush-700" : "text-ink-900"}`}>
                    {rung.label}
                  </p>
                  {links.length > 0 && (
                    <p className="mt-1 text-xs">
                      {links.map((l, i) => (
                        <span key={l.slug}>
                          {i > 0 && " · "}
                          <Link href={`/${l.slug}`} className="text-blush-600 hover:underline">
                            {l.label} guide
                          </Link>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-1">Women</p>
                  <ul className="text-sm text-ink-700 font-light leading-snug space-y-0.5">
                    {rung.women.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-1">Men</p>
                  <ul className="text-sm text-ink-700 font-light leading-snug space-y-0.5">
                    {rung.men.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Figure>
  );
}
