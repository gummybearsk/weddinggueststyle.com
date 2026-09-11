import Image from "next/image";
import type { PageImage } from "@/lib/types";

/**
 * Credited editorial photograph.
 *
 * The credit line is not decoration — visible provenance is a trust signal for readers,
 * AdSense reviewers and Google's quality raters alike, and Unsplash's licence asks for it.
 * Renders nothing when a page has no image, so it is safe to leave unset.
 */
export default function HeroImage({ image }: { image?: PageImage }) {
  if (!image) return null;

  return (
    <figure className="mt-8">
      <div className="relative w-full overflow-hidden rounded-2xl bg-blush-50" style={{ aspectRatio: "16 / 9" }}>
        <Image
          src={`${image.url}?w=1600&q=80&auto=format&fit=crop`}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 1100px"
          className="object-cover"
          priority
        />
      </div>
      <figcaption className="mt-2 text-xs text-ink-500">
        Photo:{" "}
        <a href={image.profileUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-700">
          {image.photographer}
        </a>{" "}
        on{" "}
        <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-700">
          {image.source}
        </a>
      </figcaption>
    </figure>
  );
}
