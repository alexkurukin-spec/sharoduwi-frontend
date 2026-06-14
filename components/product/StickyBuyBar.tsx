"use client";

import { AddToCart } from "@/components/product/AddToCart";

/** Sticky buy-bar на мобайле (спека §8). Делит состояние с BuyPanel. */
export function StickyBuyBar({
  title,
  price,
  kind,
  added,
  disabled,
  onAdd,
}: {
  title: string;
  price: number;
  kind: "single" | "bundle";
  added: boolean;
  disabled?: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <p className="line-clamp-1 flex-1 text-sm font-medium">{title}</p>
        <div className="w-44">
          <AddToCart
            price={price}
            kind={kind}
            added={added}
            {...(disabled !== undefined ? { disabled } : {})}
            onAdd={onAdd}
            size="default"
          />
        </div>
      </div>
    </div>
  );
}
