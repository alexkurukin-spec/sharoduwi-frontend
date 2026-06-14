import type { Product } from "@/lib/shop/types";
import { ProductCard } from "@/components/catalog/ProductCard";

/** Похожие товары (спека §8). Server — статичная сетка карточек. */
export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">
        С этим покупают
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
