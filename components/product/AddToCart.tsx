"use client";

import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format";

/**
 * Кнопка добавления (спека §8). Для bundle подпись «Купить за N ₽» (decisive-маршрут).
 */
export function AddToCart({
  price,
  kind,
  added,
  disabled,
  onAdd,
  size = "lg",
}: {
  price: number;
  kind: "single" | "bundle";
  added: boolean;
  disabled?: boolean;
  onAdd: () => void;
  size?: "default" | "lg";
}) {
  return (
    <Button
      type="button"
      size={size}
      onClick={onAdd}
      disabled={disabled ?? false}
      className="w-full gap-2"
    >
      {added ? (
        <>
          <Check className="h-5 w-5" /> Добавлено
        </>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5" />
          {kind === "bundle"
            ? `Купить за ${formatPrice(price)}`
            : `В корзину · ${formatPrice(price)}`}
        </>
      )}
    </Button>
  );
}
