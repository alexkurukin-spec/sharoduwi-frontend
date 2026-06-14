import type { Product } from "@/lib/shop/types";

export type SortKey = "pop" | "price_asc" | "price_desc";

export type Filters = {
  povod: string[];
  color: string[];
  size: string[];
  min: number | null;
  max: number | null;
  sort: SortKey;
};

/** Доступные значения фасетов и диапазон цен в наборе товаров (для FilterPanel). */
export function getAvailableFacets(products: Product[]): {
  povod: string[];
  color: string[];
  size: string[];
  priceMin: number;
  priceMax: number;
} {
  const povod = new Set<string>();
  const color = new Set<string>();
  const size = new Set<string>();
  let priceMin = Infinity;
  let priceMax = 0;

  for (const p of products) {
    p.facets.povod.forEach((v) => povod.add(v));
    p.facets.color.forEach((v) => color.add(v));
    p.facets.size.forEach((v) => size.add(v));
    priceMin = Math.min(priceMin, p.basePrice);
    priceMax = Math.max(priceMax, p.basePrice);
  }

  return {
    povod: [...povod],
    color: [...color],
    size: [...size],
    priceMin: Number.isFinite(priceMin) ? priceMin : 0,
    priceMax,
  };
}

function matchesFacet(values: string[], selected: string[]): boolean {
  return selected.length === 0 || selected.some((s) => values.includes(s));
}

/** Чистая фильтрация набора по выбранным фасетам и цене (вызывается в useMemo). */
export function applyFilters(products: Product[], f: Filters): Product[] {
  const filtered = products.filter(
    (p) =>
      matchesFacet(p.facets.povod, f.povod) &&
      matchesFacet(p.facets.color, f.color) &&
      matchesFacet(p.facets.size, f.size) &&
      (f.min === null || p.basePrice >= f.min) &&
      (f.max === null || p.basePrice <= f.max),
  );
  return sortProducts(filtered, f.sort);
}

/** Сортировка. «pop» — хиты вперёд, затем по исходному порядку. */
export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price_asc":
      return copy.sort((a, b) => a.basePrice - b.basePrice);
    case "price_desc":
      return copy.sort((a, b) => b.basePrice - a.basePrice);
    case "pop":
    default:
      return copy.sort(
        (a, b) =>
          Number(b.badges.includes("hit")) - Number(a.badges.includes("hit")),
      );
  }
}
