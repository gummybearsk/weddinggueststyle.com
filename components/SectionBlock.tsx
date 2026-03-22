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
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-5 max-w-3xl">
        {description}
      </p>
      <ProductCarousel
        products={products.slice(0, 8)}
        seeAllSlug={slug}
        seeAllLabel={`See all ${title.toLowerCase()}`}
      />
    </section>
  );
}
