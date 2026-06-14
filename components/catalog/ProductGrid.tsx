import type { Product } from "@/lib/shop/types";
import { ProductCard } from "@/components/catalog/ProductCard";

/**
 * Грид карточек (спека §6). CSS-grid без виртуализации на категориях (бережём SEO).
 * Без layout-анимаций (бюджет §7). Ключ — стабильный id.
 */
export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        Под выбранные фильтры ничего не нашлось. Попробуйте сбросить.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
