"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { SortSelect } from "@/components/catalog/SortSelect";
import { useFilters } from "@/lib/hooks/useFilters";
import { applyFilters, getAvailableFacets } from "@/lib/shop/filters";
import type { Product } from "@/lib/shop/types";

const PAGE = 48; // шаг подгрузки (спека §6)

/**
 * Каталог категории (аддон): RSC отдаёт весь набор один раз; фильтрация — useMemo,
 * подгрузка — infinite scroll через IntersectionObserver (не кнопка «ещё»).
 */
export function CatalogView({ products }: { products: Product[] }) {
  const [filters, setFilters] = useFilters();

  const facets = useMemo(() => getAvailableFacets(products), [products]);
  const filtered = useMemo(
    () => applyFilters(products, filters),
    [products, filters],
  );

  const [visible, setVisible] = useState(PAGE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Сброс при смене фильтров/сортировки.
  useEffect(() => {
    setVisible(PAGE);
  }, [filters.povod, filters.color, filters.size, filters.min, filters.max, filters.sort]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible((v) => Math.min(v + PAGE, filtered.length));
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  const pageItems = filtered.slice(0, visible);

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
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
          <p className="text-sm text-muted-foreground">Найдено: {filtered.length}</p>
          <div className="flex items-center gap-2">
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
              onChange={(sort) => void setFilters({ sort })}
            />
          </div>
        </div>

        <ProductGrid products={pageItems} />

        {visible < filtered.length ? (
          <div ref={sentinelRef} className="py-10 text-center text-sm text-muted-foreground">
            Загружаем ещё…
          </div>
        ) : null}
      </div>
    </div>
  );
}
