"use client";

import { Sparkles, X } from "lucide-react";
import { ColorSwatch } from "@/components/catalog/ColorSwatch";
import { POVODS } from "@/lib/shop/povods";
import { cn } from "@/lib/utils/cn";

type FacetValues = {
  povod: string[];
  color: string[];
  size: string[];
  priceMin: number;
  priceMax: number;
};

type FilterState = {
  povod: string[];
  color: string[];
  size: string[];
  min: number | null;
  max: number | null;
};

const povodTitle = (slug: string) =>
  POVODS.find((p) => p.slug === slug)?.title ?? slug;

/**
 * Панель фильтров (спека §3, §5). Источник правды — URL (nuqs), отдельного стора нет.
 * Любое изменение фасета сбрасывает страницу на 1.
 */
export function FilterPanel({
  facets,
  filters,
  update,
  reset,
}: {
  facets: FacetValues;
  filters: FilterState;
  update: (patch: Partial<FilterState & { page: number }>) => void;
  reset: () => void;
}) {
  const toggle = (kind: "povod" | "color" | "size", value: string) => {
    const current = filters[kind];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    update({ [kind]: next, page: 1 });
  };

  const hasActive =
    filters.povod.length > 0 ||
    filters.color.length > 0 ||
    filters.size.length > 0 ||
    filters.min !== null ||
    filters.max !== null;

  return (
    <div className="flex flex-col gap-6">
      {hasActive ? (
        <button
          type="button"
          onClick={reset}
          className="inline-flex w-fit items-center gap-1 text-sm text-accent hover:underline"
        >
          <X className="h-4 w-4" /> Сбросить фильтры
        </button>
      ) : null}

      {facets.povod.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Повод</legend>
          <div className="flex flex-wrap gap-2">
            {facets.povod.map((slug) => {
              const active = filters.povod.includes(slug);
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => toggle("povod", slug)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors",
                    active
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {POVODS.find((p) => p.slug === slug)?.priority ? (
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                  ) : null}
                  {povodTitle(slug)}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {facets.color.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Цвет</legend>
          <div className="flex flex-wrap gap-2">
            {facets.color.map((color) => (
              <ColorSwatch
                key={color}
                color={color}
                selected={filters.color.includes(color)}
                onToggle={() => toggle("color", color)}
              />
            ))}
          </div>
        </fieldset>
      ) : null}

      {facets.size.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Размер</legend>
          <div className="flex flex-wrap gap-2">
            {facets.size.map((size) => {
              const active = filters.size.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggle("size", size)}
                  aria-pressed={active}
                  className={cn(
                    "h-9 min-w-9 rounded-[var(--radius)] border px-3 text-sm transition-colors",
                    active
                      ? "border-accent bg-accent/10"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">
          Цена, ₽
        </legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={String(facets.priceMin)}
            value={filters.min ?? ""}
            onChange={(e) =>
              update({
                min: e.target.value === "" ? null : Number(e.target.value),
                page: 1,
              })
            }
            className="h-9 w-24 rounded-[var(--radius)] border border-border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Цена от"
          />
          <span className="text-muted-foreground">—</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={String(facets.priceMax)}
            value={filters.max ?? ""}
            onChange={(e) =>
              update({
                max: e.target.value === "" ? null : Number(e.target.value),
                page: 1,
              })
            }
            className="h-9 w-24 rounded-[var(--radius)] border border-border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Цена до"
          />
        </div>
      </fieldset>
    </div>
  );
}
