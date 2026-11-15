import Link from "next/link";
import { getPublishedPageData } from "@/lib/getPages";

/**
 * Renders section text with in-body links written as [anchor text](/slug).
 *
 * Only internal, published pages become links: a slug that is not live yet (or a typo)
 * renders as its plain anchor text, so body copy can never link to a scheduled page and let
 * Googlebot pin it as a 404 (global rule 17). Anything else in the text stays plain text.
 */
const LINK = /\[([^\]\n]+)\]\(\/([a-z0-9-]*)\)/g;
const HUBS = new Set(["", "season", "dress-code", "color", "body-type", "style", "venue"]);

export default function InlineLinks({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of Array.from(text.matchAll(LINK))) {
    const [full, anchor, slug] = m;
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    if (HUBS.has(slug) || getPublishedPageData(slug) !== null) {
      out.push(
        <Link key={at} href={`/${slug}`} className="text-blush-700 underline underline-offset-2 hover:text-blush-600">
          {anchor}
        </Link>,
      );
    } else {
      out.push(anchor);
    }
    last = at + full.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
