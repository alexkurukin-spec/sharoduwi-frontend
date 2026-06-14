import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getProductsByCategory, searchProducts } from "@/lib/shop/api";
import { POVODS } from "@/lib/shop/povods";
import { HeroBalloons } from "@/components/home/HeroBalloons";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { Reveal } from "@/components/motion/Reveal";

export const revalidate = 300; // ISR — спека §3

// Главная (Server): серверная оболочка + клиентские острова (hero R3F, embla, reveal).
export default async function HomePage() {
  const [bundles, balloons, all] = await Promise.all([
    getProductsByCategory("cat-bundles", 1, 12),
    getProductsByCategory("cat-balloons", 1, 12),
    searchProducts(""),
  ]);

  const priorityPovods = POVODS.filter((p) => p.priority);

  return (
    <main className="flex flex-col gap-20 pb-10">
      <HeroBalloons />

      {/* Приоритетные decisive-маршруты (выписка/рождение/гендер-пати). */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            Готовые наборы по поводу
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {priorityPovods.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link
                href={`/povod/${p.slug}`}
                className="group flex h-40 flex-col justify-end rounded-2xl border border-border bg-muted/60 p-5 transition-colors hover:bg-muted"
              >
                <Sparkles className="mb-auto h-5 w-5 text-accent" />
                <span className="text-lg font-semibold leading-tight">
                  {p.title}
                </span>
                <span className="text-sm text-muted-foreground">
                  Выбрать набор за 2–3 клика →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <CategoryShowcase
          title="Готовые наборы"
          href="/c/gotovye-nabory"
          products={bundles.items}
        />
      </Reveal>

      <Reveal>
        <CategoryShowcase
          title="Гелиевые шары"
          href="/c/gelievye-shary"
          products={balloons.items}
        />
      </Reveal>

      <section className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <div className="rounded-2xl bg-foreground px-8 py-12 text-background">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Доставим в день заказа
            </h2>
            <p className="mt-2 max-w-xl text-background/80">
              Юго-восток Московской области — Жуковский, Раменское, Люберцы,
              Малаховка. Всего товаров в каталоге: {all.length}.
            </p>
            <Link href="/c/gelievye-shary" className="mt-6 inline-block">
              <span className="rounded-[var(--radius)] bg-background px-5 py-2.5 text-sm font-medium text-foreground">
                В каталог
              </span>
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
