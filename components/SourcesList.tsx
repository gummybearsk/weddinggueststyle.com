import type { PageSource } from "@/lib/types";

/**
 * Outbound authority citations (Rule 29).
 *
 * Readers, AdSense reviewers and Google's E-E-A-T raters all reward visible provenance,
 * and an unsourced convention is worse than no convention. Rendered only when a page
 * actually has sources — never as an empty shell, and never populated with a hedge.
 */
export default function SourcesList({ sources }: { sources?: PageSource[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <section className="mt-12 border-t border-ink-100 pt-8" aria-labelledby="sources-heading">
      <h2 id="sources-heading" className="text-sm font-semibold uppercase tracking-wide text-ink-700">
        Sources
      </h2>
      <ul className="mt-4 space-y-3">
        {sources.map((s) => (
          <li key={s.url} className="text-sm text-ink-600 leading-relaxed">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blush-600 underline underline-offset-2 hover:text-blush-700"
            >
              {s.publisher} — {s.title}
            </a>
            <span className="text-ink-500">
              {" "}· read {s.readOn} · {s.supports}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
