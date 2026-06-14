"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles } from "lucide-react";
import type { Category } from "@/lib/shop/types";
import { POVODS } from "@/lib/shop/povods";
import { cn } from "@/lib/utils/cn";

/**
 * Мега-меню (спека §2, §8): две оси навигации — тип товара и повод — с превью.
 * Открывается по hover/focus, доступно с клавиатуры. Лёгкое, без тяжёлой анимации.
 */
export function MegaMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-[var(--radius)] px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Каталог
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-40 w-[min(48rem,90vw)] pt-2">
          <div className="grid grid-cols-[1fr_1fr_1.1fr] gap-6 rounded-2xl border border-border bg-background p-6 shadow-xl">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Тип товара
              </p>
              <ul className="grid gap-1">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/c/${c.slug}`}
                      className="block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                    >
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                По поводу
              </p>
              <ul className="grid gap-1">
                {POVODS.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/povod/${p.slug}`}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                    >
                      {p.priority ? (
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                      ) : null}
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Превью — редакционный блок на decisive-маршрут (выписка). */}
            <Link
              href="/povod/vypiska"
              className="group relative flex flex-col justify-end overflow-hidden rounded-xl bg-muted p-4"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                Готовые наборы
              </span>
              <span className="mt-1 text-lg font-semibold leading-tight">
                На выписку — в 2 клика
              </span>
              <span className="mt-1 text-sm text-muted-foreground">
                Собрали композиции для мальчика и девочки.
              </span>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
