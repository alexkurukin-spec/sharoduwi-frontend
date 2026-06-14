"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  selectCartTotal,
  useCartStore,
  type CartLine,
} from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils/format";

/**
 * Содержимое корзины (спека §5, §8): setQty, remove, итог.
 * Удаление строки — изолированная layout-анимация (разрешено бюджетом §7).
 * Используется и в дровере, и на /cart.
 */
export function CartContents({
  onNavigate = () => {},
}: {
  onNavigate?: () => void;
}) {
  const lines = useCartStore((s) => s.lines);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const total = useCartStore(selectCartTotal);

  if (lines.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center text-sm text-muted-foreground">
        <p>Корзина пуста.</p>
        <Link href="/c/gelievye-shary" onClick={onNavigate}>
          <Button variant="outline">В каталог</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <ul className="flex-1 divide-y divide-border overflow-y-auto">
        <AnimatePresence initial={false}>
          {lines.map((line: CartLine) => (
            <motion.li
              key={line.key}
              layout
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-3 py-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src="/placeholder.svg" alt={line.title} fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col">
                <p className="text-sm font-medium leading-snug">{line.title}</p>
                {Object.keys(line.options).length > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {Object.entries(line.options)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}
                  </p>
                ) : null}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setQty(line.key, line.qty - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-muted"
                      aria-label="Уменьшить"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">{line.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(line.key, line.qty + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-muted"
                      aria-label="Увеличить"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(line.price * line.qty)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(line.key)}
                className="self-start text-muted-foreground hover:text-accent"
                aria-label="Удалить"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Итого</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Link href="/checkout" onClick={onNavigate} className="mt-4 block">
          <Button className="w-full" size="lg">
            Оформить заказ
          </Button>
        </Link>
      </div>
    </div>
  );
}
