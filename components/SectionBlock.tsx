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
  return (
    <section className="py-8 sm:py-10">
      <div className="mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
          {title}
        </h2>
        <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
      <ProductCarousel
        products={products.slice(0, 8)}
        seeAllSlug={slug}
        seeAllLabel={`See all ${title.toLowerCase()}`}
      />
    </section>
  );
}
