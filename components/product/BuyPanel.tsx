"use client";

import { useMemo, useReducer, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/shop/types";
import { Configurator } from "@/components/product/Configurator";
import { AddToCart } from "@/components/product/AddToCart";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils/format";

type State = Record<string, string>;
type Action = { name: string; value: string };

function reducer(state: State, action: Action): State {
  return { ...state, [action.name]: action.value };
}

function initSelected(product: Product): State {
  const init: State = {};
  for (const opt of product.options) {
    const first = opt.values[0];
    if (first !== undefined) init[opt.name] = first;
  }
  return init;
}

/**
 * Островок покупки PDP (спека §8): состояние конфигуратора в useReducer,
 * цена — производное; добавление в корзину с дедупом по варианту (Zustand).
 * Для bundle конфигуратор свёрнут — одна кнопка «Купить за N ₽».
 */
export function BuyPanel({ product }: { product: Product }) {
  const [selected, dispatch] = useReducer(reducer, product, initSelected);
  const add = useCartStore((s) => s.add);
  const [added, setAdded] = useState(false);

  // Производная: вариант, точно совпадающий с выбором.
  const variant = useMemo(() => {
    const names = product.options.map((o) => o.name);
    return (
      product.variants.find((v) =>
        names.every((n) => v.options[n] === selected[n]),
      ) ?? product.variants[0]
    );
  }, [product, selected]);

  const price = variant?.price ?? product.basePrice;
  const inStock = variant?.inStock ?? true;

  const handleAdd = () => {
    add(
      {
        productId: product.id,
        variantId: variant?.id ?? product.id,
        title: product.title,
        image: product.images[0] ?? "/placeholder.svg",
        price,
        options: selected,
        fulfillment: product.fulfillment,
      },
      1,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline gap-3">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={price}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="text-3xl font-semibold"
          >
            {formatPrice(price)}
          </motion.span>
        </AnimatePresence>
        {product.oldPrice ? (
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(product.oldPrice)}
          </span>
        ) : null}
      </div>

      <Configurator
        options={product.options}
        selected={selected}
        onSelect={(name, value) => dispatch({ name, value })}
      />

      {!inStock ? (
        <p className="text-sm text-accent">Этого варианта сейчас нет в наличии.</p>
      ) : null}

      <div className="max-w-sm">
        <AddToCart
          price={price}
          kind={product.kind}
          added={added}
          disabled={!inStock}
          onAdd={handleAdd}
        />
      </div>

      <StickyBuyBar
        title={product.title}
        price={price}
        kind={product.kind}
        added={added}
        disabled={!inStock}
        onAdd={handleAdd}
      />
    </div>
  );
}
