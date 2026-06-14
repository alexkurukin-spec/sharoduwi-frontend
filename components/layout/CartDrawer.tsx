"use client";

import { ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useHasHydrated } from "@/lib/hooks/useHasHydrated";
import { selectCartCount, useCartStore } from "@/lib/store/cart";

/**
 * Кнопка корзины с бейджем + дровер (спека §8).
 * Бейдж рендерим только после регидрации — иначе hydration mismatch (спека §4).
 * В фазе 2 содержимое дровера пустое; наполнение — в фазе 5.
 */
export function CartDrawer() {
  const hydrated = useHasHydrated();
  const count = useCartStore(selectCartCount);

  return (
    <Sheet>
      <SheetTrigger
        aria-label="Открыть корзину"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius)] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ShoppingBag className="h-5 w-5" />
        {hydrated && count > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-foreground">
            {count}
          </span>
        ) : null}
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
          <SheetDescription>
            {hydrated && count > 0
              ? `Товаров: ${count}`
              : "Корзина пуста"}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
          <ShoppingBag className="h-10 w-10 opacity-30" />
          <p>Здесь появятся выбранные шары и наборы.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
