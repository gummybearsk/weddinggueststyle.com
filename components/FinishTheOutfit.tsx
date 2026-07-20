import Link from "next/link";

/**
 * Cross-sell strip routing dress readers to the accessory pages.
 *
 * Why this exists: Amazon Associates uses a 24-hour cookie — once a reader clicks through
 * to Amazon we earn on anything they buy that day, not just the item clicked. Accessories
 * are far lower-hesitation purchases than a dress (a £25 clutch converts on impulse; a £90
 * dress gets deliberated), so moving a reader onto an accessory page and earning that first
 * click early is worth more than it looks — the dress commission often lands on the same
 * cookie.
 *
 * It also does honest SEO work: these are new pages with no inbound links, and this gives
 * every one of them a site-wide internal link (Rule 18, no orphan pages).
 *
 * Only renders links to pages that are actually published — scheduled pages 404 until
 * their publishDate, and linking into a 404 would waste crawl budget and reader trust.
 */
export default function FinishTheOutfit({
  links,
  currentSlug,
}: {
  links: { title: string; slug: string; blurb: string }[];
  currentSlug: string;
}) {
  const visible = links.filter((l) => l.slug !== currentSlug);
  if (visible.length < 2) return null;

  return (
    <aside className="my-14 border-t border-ink-200 pt-8">
      <p className="eyebrow text-blush-600 mb-2">Finish the outfit</p>
      <p className="text-sm text-ink-600 font-light mb-6 max-w-2xl leading-relaxed">
        The dress is the decision everyone agonises over. These are the parts that actually
        get judged in the photographs.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visible.slice(0, 4).map((l) => (
          <Link
            key={l.slug}
            href={`/${l.slug}`}
            className="group block border border-ink-200 bg-ivory hover:border-blush-300 hover:shadow-md transition-all duration-500 p-5"
          >
            <p className="text-[13px] text-ink-900 leading-snug group-hover:text-blush-600 transition-colors">
              {l.title}
            </p>
            <p className="mt-2 text-xs text-ink-600 font-light leading-relaxed">{l.blurb}</p>
            <span className="mt-3 inline-block text-[10px] tracking-[0.18em] uppercase text-blush-600">
              Read →
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
