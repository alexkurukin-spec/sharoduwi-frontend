"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/shop/types";
import { ProductCard } from "@/components/catalog/ProductCard";

/** Слайдер подборки на главной (спека §8): embla, без тяжёлой анимации. */
export function CategoryShowcase({
  title,
  href,
  products,
}: {
  title: string;
  href: string;
  products: Product[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        <div className="flex items-center gap-2">
          <Link href={href} className="text-sm text-accent hover:underline">
            Смотреть все
          </Link>
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Назад"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Вперёд"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="min-w-0 flex-[0_0_70%] sm:flex-[0_0_40%] lg:flex-[0_0_23%]"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
