import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shop/types";
import { formatPrice } from "@/lib/utils/format";
import { COLOR_HEX } from "@/components/catalog/ColorSwatch";
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
 * Карточка товара (спека §6): memo, стабильные пропсы, hover только CSS
 * (transform/opacity на GPU, без JS-стейтов). Второй слой — мягкая подсветка цвета.
 */
function ProductCardBase({ product }: { product: Product }) {
  const tint = COLOR_HEX[product.facets.color[0] ?? "Белый"] ?? "#f5f5f4";
  const isBundle = product.kind === "bundle";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col"
      style={{ viewTransitionName: `product-${product.slug}` }}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        {/* Подсветка-«второе фото» проявляется по hover (CSS opacity). */}
        <div
          aria-hidden
          className="absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 38%, ${tint}88, transparent 70%)`,
          }}
        />
        <Image
          src="/placeholder.svg"
          alt={product.title}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 will-change-transform group-hover:scale-105"
        />

        {product.badges.length > 0 ? (
          <div className="absolute left-2 top-2 z-20 flex flex-col gap-1">
            {product.badges.map((b) => (
              <span
                key={b}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  b === "sale"
                    ? "bg-accent text-accent-foreground"
                    : "bg-background/90 text-foreground",
                )}
              >
                {BADGE_LABEL[b]}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">
          {deliveryHint(product.fulfillment)}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug">
          {product.title}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-semibold">
            {isBundle ? `Купить за ${formatPrice(product.basePrice)}` : formatPrice(product.basePrice)}
          </span>
          {product.oldPrice ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export const ProductCard = memo(ProductCardBase);
