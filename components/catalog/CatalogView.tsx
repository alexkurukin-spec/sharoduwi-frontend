"use client";

import { useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Pagination } from "@/components/catalog/Pagination";
import { SortSelect } from "@/components/catalog/SortSelect";
import { useFilters } from "@/lib/hooks/useFilters";
import { applyFilters, getAvailableFacets } from "@/lib/shop/filters";
import type { Product } from "@/lib/shop/types";

const PER_PAGE = 48; // спека §6

/**
 * Каталог категории (спека §8): RSC отдаёт весь набор один раз,
 * фильтрация и пагинация — на клиенте через useMemo (shallow, без джанка).
 */
export function CatalogView({ products }: { products: Product[] }) {
  const [filters, setFilters] = useFilters();

  const facets = useMemo(() => getAvailableFacets(products), [products]);
  const filtered = useMemo(
    () => applyFilters(products, filters),
    [products, filters],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(filters.page, totalPages);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const goToPage = (p: number) => {
    void setFilters({ page: p });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      {/* Сайдбар фильтров (десктоп) */}
      <aside className="hidden lg:block">
        <FilterPanel
          facets={facets}
          filters={filters}
          update={(patch) => void setFilters(patch)}
          reset={() => void setFilters(null)}
        />
      </aside>

      <div>
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Найдено: {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            {/* Фильтры на мобайле — bottom-sheet */}
            <Sheet>
              <SheetTrigger className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-border px-3 py-2 text-sm lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                Фильтры
              </SheetTrigger>
              <SheetContent side="bottom" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Фильтры</SheetTitle>
                </SheetHeader>
                <FilterPanel
                  facets={facets}
                  filters={filters}
                  update={(patch) => void setFilters(patch)}
                  reset={() => void setFilters(null)}
                />
              </SheetContent>
            </Sheet>

            <SortSelect
              value={filters.sort}
              onChange={(sort) => void setFilters({ sort, page: 1 })}
            />
          </div>
        </div>

        <ProductGrid products={pageItems} />
        <Pagination page={page} totalPages={totalPages} onPage={goToPage} />
      </div>
    </div>
  );
}
