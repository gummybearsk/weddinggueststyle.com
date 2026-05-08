import ProductCarousel from "./ProductCarousel";
import { Product } from "@/lib/types";

interface SectionBlockProps {
  title: string;
  description: string;
  slug: string;
  products: Product[];
}

export default function SectionBlock({
  title,
  description,
  slug,
  products,
}: SectionBlockProps) {
  // Strip "Wedding Guest Dresses" suffix for editorial display
  const editorialTitle = title
    .replace(/ Wedding Guest Dresses$/, "")
    .replace(/ Wedding Guest Dress$/, "");

  return (
    <section className="py-8 sm:py-10">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="display-serif text-xl sm:text-2xl text-ink-900 mb-1.5">
            {editorialTitle}
          </h3>
          <p className="text-sm text-ink-600 max-w-2xl leading-relaxed font-light">
            {description}
          </p>
        </div>
      </div>
      <ProductCarousel
        products={products.slice(0, 8)}
        seeAllSlug={slug}
        seeAllLabel={`View the ${editorialTitle.toLowerCase()} edit`}
      />
    </section>
  );
}
