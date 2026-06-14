"use client";

import type { Product } from "@/lib/shop/types";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { VirtualizedGrid } from "@/components/catalog/VirtualizedGrid";

const VIRTUALIZE_THRESHOLD = 100; // спека §6

/** Результаты поиска: виртуализация только при наборе > 100 (иначе обычный грид). */
export function SearchResults({ products }: { products: Product[] }) {
  if (products.length > VIRTUALIZE_THRESHOLD) {
    return <VirtualizedGrid products={products} />;
  }
  return <ProductGrid products={products} />;
}
