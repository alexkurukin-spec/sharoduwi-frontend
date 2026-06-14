import Link from "next/link";
import { POVODS } from "@/lib/shop/povods";

const EMOJI: Record<string, string> = {
  vypiska: "🍼",
  rozhdenie: "👶",
  "gender-party": "🎈",
  "den-rozhdeniya": "🎂",
  lyubov: "💖",
  svadba: "💍",
};

/**
 * «Что празднуем?» (wow-фича №4 аддона): вместо хлебных крошек — выбор повода.
 * Каждая кнопка подхватывает категорийный цвет через data-category.
 */
export function WhatToCelebrate() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6">
      <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
        Что <span className="text-accent">празднуем?</span>
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {POVODS.map((p) => (
          <Link
            key={p.slug}
            href={`/povod/${p.slug}`}
            data-category={p.slug}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-5 text-center transition-all hover:-translate-y-1.5 hover:shadow-lg"
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full text-3xl transition-transform group-hover:scale-110"
              style={{ backgroundColor: "color-mix(in oklab, var(--category) 18%, transparent)" }}
            >
              {EMOJI[p.slug] ?? "🎉"}
            </span>
            <span className="text-sm font-medium leading-tight">{p.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
