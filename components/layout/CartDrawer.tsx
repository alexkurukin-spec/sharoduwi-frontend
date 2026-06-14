"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartContents } from "@/components/layout/CartContents";
import { useHasHydrated } from "@/lib/hooks/useHasHydrated";
import { selectCartCount, useCartStore } from "@/lib/store/cart";

/**
 * Кнопка корзины с бейджем + дровер (спека §8).
 * Бейдж и содержимое рендерим только после регидрации — иначе hydration mismatch (спека §4).
 */
export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const hydrated = useHasHydrated();
  const count = useCartStore(selectCartCount);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        id="cart-icon"
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
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
        </SheetHeader>
        {hydrated ? (
          <CartContents onNavigate={() => setOpen(false)} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Загрузка…
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
