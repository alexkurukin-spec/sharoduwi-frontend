"use client";

import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Product } from "@/lib/shop/types";
import { ProductCard } from "@/components/catalog/ProductCard";

const ROW_HEIGHT = 360; // карточка + подпись + gap
const GAP = 16;

function columnsFor(width: number): number {
  if (width >= 1024) return 4;
  if (width >= 640) return 3;
  return 2;
}

/**
 * Виртуализированный грид (спека §6, §7): только для больших наборов (поиск > 100).
 * Колонки — из ResizeObserver; overscan 6; ключи стабильные.
 */
export function VirtualizedGrid({ products }: { products: Product[] }) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setColumns(columnsFor(entry.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rowCount = Math.ceil(products.length / columns);
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT + GAP,
    overscan: 6,
  });

  return (
    <div ref={parentRef} className="h-[80vh] overflow-y-auto">
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((row) => {
          const start = row.index * columns;
          const items = products.slice(start, start + columns);
          return (
            <div
              key={row.key}
              className="absolute left-0 top-0 grid w-full gap-4"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                transform: `translateY(${row.start}px)`,
              }}
            >
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
