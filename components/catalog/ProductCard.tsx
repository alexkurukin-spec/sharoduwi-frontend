"use client";

import { memo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/shop/types";
import { formatPrice } from "@/lib/utils/format";
import { COLOR_HEX } from "@/components/catalog/ColorSwatch";
import { useCartStore } from "@/lib/store/cart";
import { useFavoritesStore } from "@/lib/store/favorites";
import { useHasHydrated } from "@/lib/hooks/useHasHydrated";
import { flyToCart } from "@/lib/ui/flyToCart";
import { cn } from "@/lib/utils/cn";

const BADGE_LABEL: Record<Product["badges"][number], string> = {
  hit: "Хит",
  new: "Новинка",
  sale: "Скидка",
};

function deliveryHint(fulfillment: Product["fulfillment"]): string {
  switch (fulfillment) {
    case "pickup_only":
      return "Только самовывоз";
    case "flat":
      return "Доставка по всем зонам";
    case "inflated":
    default:
      return "Доставка в день заказа";
  }
}

/**
 * Карточка товара (аддон): фото 3:4, избранное-сердечко, цена в «солнечном» жёлтом,
 * быстрый «В корзину» с fly-to-cart. Hover — только CSS (transform/opacity).
 */
function ProductCardBase({ product }: { product: Product }) {
  const hydrated = useHasHydrated();
  const mediaRef = useRef<HTMLDivElement | null>(null);

  const add = useCartStore((s) => s.add);
  const toggleFav = useFavoritesStore((s) => s.toggle);
  const isFav = useFavoritesStore((s) => s.ids.includes(product.id));

  const tint = COLOR_HEX[product.facets.color[0] ?? "Белый"] ?? "#f5f5f4";
  const isBundle = product.kind === "bundle";
  const hasVariants = product.options.length > 0;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants[0];
    add({
      productId: product.id,
      variantId: variant?.id ?? product.id,
      title: product.title,
      image: product.images[0] ?? "/placeholder.svg",
      price: variant?.price ?? product.basePrice,
      options: variant?.options ?? {},
      fulfillment: product.fulfillment,
    });
    flyToCart(mediaRef.current, "/placeholder.svg");
  };

  const onFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFav(product.id);
  };

  return (
    <article className="group relative flex flex-col">
      <div
        ref={mediaRef}
        className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted"
        style={{ viewTransitionName: `product-${product.slug}` }}
      >
        <div
          aria-hidden
          className="absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle at 50% 35%, ${tint}99, transparent 70%)` }}
        />
        <Image
          src="/placeholder.svg"
          alt={product.title}
          fill
          sizes="(max-width:640px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 will-change-transform group-hover:scale-[1.04]"
        />

        {product.badges.length > 0 ? (
          <div className="absolute left-2 top-2 z-20 flex flex-col gap-1">
            {product.badges.map((b) => (
              <span
                key={b}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  b === "sale" ? "bg-grass text-white" : b === "hit" ? "bg-sun text-foreground" : "bg-sky text-white",
                )}
              >
                {BADGE_LABEL[b]}
              </span>
            ))}
          </div>
        ) : null}

        {/* Избранное */}
        <button
          type="button"
          onClick={onFav}
          aria-label={isFav ? "Убрать из избранного" : "В избранное"}
          aria-pressed={hydrated && isFav}
          className="absolute right-2 top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur transition-transform hover:scale-110"
        >
          <Heart
            className={cn(
              "h-[18px] w-[18px] transition-colors",
              hydrated && isFav ? "fill-accent text-accent" : "text-foreground",
            )}
          />
        </button>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="text-xs text-muted-foreground">{deliveryHint(product.fulfillment)}</p>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug">{product.title}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-sun">
            {hasVariants ? "от " : ""}
            {formatPrice(product.basePrice)}
          </span>
          {product.oldPrice ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={quickAdd}
          className="z-20 mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-accent text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <ShoppingBag className="h-4 w-4" />
          {isBundle ? "Купить" : "В корзину"}
        </button>
      </div>

      {/* Ссылка на всю площадь, кроме интерактивных элементов поверх (z-20). */}
      <Link
        href={`/product/${product.slug}`}
        aria-label={product.title}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
    </article>
  );
}

export const ProductCard = memo(ProductCardBase);
