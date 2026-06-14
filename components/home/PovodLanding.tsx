import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/catalog/ProductCard";
import type { Product } from "@/lib/shop/types";
import type { District } from "@/lib/shop/districts";

/**
 * Лендинг повода (спека §8): короткий decisive-маршрут «выбрал набор → в корзину».
 * Готовые наборы — вперёд. С district — локализованные H1/текст под район.
 */
export function PovodLanding({
  title,
  products,
  district,
}: {
  title: string;
  products: Product[];
  district?: District;
}) {
  const bundles = products.filter((p) => p.kind === "bundle");
  const singles = products.filter((p) => p.kind !== "bundle");

  const heading = district ? `${title} — ${district.area}` : title;
  const zone = district?.zone;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <nav className="mb-4 text-sm text-muted-foreground" aria-label="Хлебные крошки">
        <Link href="/" className="hover:text-foreground">
          Главная
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-foreground">{heading}</span>
      </nav>

      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight">
        {heading}
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {district
          ? `Готовые композиции с доставкой в ${district.area}. ${
              zone?.sameDay
                ? "Доставим в день заказа."
                : "Доступен самовывоз из Жуковского."
            }`
          : "Выберите готовый набор — и оформите за 2–3 клика. Для тех, кому нужно быстро и красиво."}
      </p>

      {bundles.length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Готовые наборы
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {bundles.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      {singles.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Собрать самому
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {singles.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      {products.length === 0 ? (
        <div className="mt-12">
          <p className="text-muted-foreground">
            Пока готовим подборку для этого повода.
          </p>
          <Link href="/c/gotovye-nabory" className="mt-4 inline-block">
            <Button variant="outline">Все готовые наборы</Button>
          </Link>
        </div>
      ) : null}
    </main>
  );
}
