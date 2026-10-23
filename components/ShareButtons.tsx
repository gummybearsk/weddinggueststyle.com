import CopyLinkButton from "./CopyLinkButton";

const SITE = "https://weddinggueststyle.com";

/**
 * Plain share-intent links (no third-party scripts, nothing loaded until clicked).
 * `path` is site-relative ("/black-tie-attire" or "/#code-cocktail"); `image` is the
 * page's own photo, which Pinterest needs for a pin.
 */
export default function ShareButtons({
  path,
  title,
  image,
  label = "Share",
  compact = false,
  collapsed = false,
}: {
  path: string;
  title: string;
  image?: string;
  label?: string;
  compact?: boolean;
  /** Show the four most-used networks and fold the rest behind "More" (keeps the answer above the fold). */
  collapsed?: boolean;
}) {
  const url = `${SITE}${path}`;
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const media = image ? encodeURIComponent(image.startsWith("http") ? image : `${SITE}${image}`) : "";
  const both = encodeURIComponent(`${title} ${url}`);
  const links = [
    { name: "Pinterest", href: `https://www.pinterest.com/pin/create/button/?url=${u}&description=${t}${media ? `&media=${media}` : ""}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "Reddit", href: `https://www.reddit.com/submit?url=${u}&title=${t}` },
    { name: "WhatsApp", href: `https://wa.me/?text=${both}` },
    { name: "X", href: `https://x.com/intent/post?url=${u}&text=${t}` },
    { name: "Threads", href: `https://www.threads.net/intent/post?text=${both}` },
    { name: "Bluesky", href: `https://bsky.app/intent/compose?text=${both}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: "Telegram", href: `https://t.me/share/url?url=${u}&text=${t}` },
    { name: "Email", href: `mailto:?subject=${t}&body=${u}` },
  ];
  const btn = `inline-flex items-center border border-ink-200 bg-white text-ink-700 hover:border-blush-400 hover:text-blush-700 transition-colors ${
    compact ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-[13px]"
  }`;
  const link = (l: { name: string; href: string }) => (
    <a
      key={l.name}
      href={l.href}
      target={l.name === "Email" ? undefined : "_blank"}
      rel="noopener noreferrer nofollow"
      className={btn}
      aria-label={`${label} on ${l.name}`}
    >
      {l.name}
    </a>
  );
  const head = collapsed ? links.slice(0, 4) : links;
  const rest = collapsed ? links.slice(4) : [];
  return (
    <div className="not-prose flex flex-wrap items-center gap-2">
      <span className="text-[11px] uppercase tracking-[0.18em] text-ink-500 mr-1">{label}</span>
      {head.map(link)}
      {collapsed ? (
        <details className="group open:basis-full">
          <summary className={`${btn} cursor-pointer list-none [&::-webkit-details-marker]:hidden group-open:hidden`}>More</summary>
          <div className="flex flex-wrap gap-2">
            {rest.map(link)}
            <CopyLinkButton url={url} title={title} className={btn} />
          </div>
        </details>
      ) : (
        <CopyLinkButton url={url} title={title} className={btn} />
      )}
    </div>
  );
}
