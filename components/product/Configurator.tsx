"use client";

import type { VariantOption } from "@/lib/shop/types";
import { ColorSwatch } from "@/components/catalog/ColorSwatch";
import { cn } from "@/lib/utils/cn";

/**
 * Конфигуратор вариантов (спека §8): presentational, состояние — выше (useReducer).
 * Цвет — свотчами, остальное — кнопками-чипами.
 */
export function Configurator({
  options,
  selected,
  onSelect,
}: {
  options: VariantOption[];
  selected: Record<string, string>;
  onSelect: (name: string, value: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      {options.map((opt) => (
        <div key={opt.name}>
          <p className="mb-2 text-sm font-semibold">{opt.name}</p>
          {opt.name === "Цвет" ? (
            <div className="flex flex-wrap gap-2">
              {opt.values.map((value) => (
                <ColorSwatch
                  key={value}
                  color={value}
                  selected={selected[opt.name] === value}
                  onToggle={() => onSelect(opt.name, value)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {opt.values.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onSelect(opt.name, value)}
                  aria-pressed={selected[opt.name] === value}
                  className={cn(
                    "h-9 min-w-9 rounded-[var(--radius)] border px-3 text-sm transition-colors",
                    selected[opt.name] === value
                      ? "border-accent bg-accent/10"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
