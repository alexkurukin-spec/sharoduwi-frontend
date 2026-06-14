"use client";

import { CartContents } from "@/components/layout/CartContents";
import { useHasHydrated } from "@/lib/hooks/useHasHydrated";

/** Полноширинная корзина для /cart (deep-link/SEO) — гейт по регидрации. */
export function CartPageView() {
  const hydrated = useHasHydrated();
  if (!hydrated) {
    return <p className="py-16 text-center text-muted-foreground">Загрузка…</p>;
  }
  return (
    <div className="flex min-h-[50vh] flex-col">
      <CartContents />
    </div>
  );
}
