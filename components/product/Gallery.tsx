"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils/cn";

/**
 * Галерея PDP (спека §8): embla + зум по клику. Главное фото несёт
 * viewTransitionName для морфа грид→PDP (спека §7).
 */
export function Gallery({
  images,
  alt,
  slug,
}: {
  images: string[];
  alt: string;
  slug: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  // До подключения CDN — единый SVG-плейсхолдер; число слайдов из images.
  const slides = images.length > 0 ? images : ["/placeholder.svg"];

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl bg-muted" ref={emblaRef}>
        <div className="flex">
          {slides.map((_, i) => (
            <div className="relative min-w-0 flex-[0_0_100%]" key={i}>
              <div
                className={cn(
                  "relative aspect-square cursor-zoom-in",
                  zoomed && "cursor-zoom-out",
                )}
                onClick={() => setZoomed((v) => !v)}
              >
                <Image
                  src="/placeholder.svg"
                  alt={alt}
                  fill
                  priority={i === 0}
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className={cn(
                    "object-cover transition-transform duration-300",
                    zoomed && "scale-150",
                  )}
                  style={
                    i === 0 ? { viewTransitionName: `product-${slug}` } : undefined
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Фото ${i + 1}`}
              aria-current={i === selected}
              className={cn(
                "relative aspect-square w-16 overflow-hidden rounded-lg border bg-muted",
                i === selected ? "border-accent" : "border-border",
              )}
            >
              <Image src="/placeholder.svg" alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
