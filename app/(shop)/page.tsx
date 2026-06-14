import Link from "next/link";
import { Clock, MapPin, Sparkles, Truck } from "lucide-react";
import { getProductsByCategory, searchProducts } from "@/lib/shop/api";
import { HeroBalloons } from "@/components/home/HeroBalloons";
import { WhatToCelebrate } from "@/components/home/WhatToCelebrate";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { Reveal } from "@/components/motion/Reveal";

export const revalidate = 300; // ISR — спека §3

const STEPS = [
  { icon: Sparkles, title: "Выберите набор", text: "Готовые композиции по поводу или соберите свой." },
  { icon: MapPin, title: "Укажите зону", text: "Зона доставки определяет слот и цену." },
  { icon: Truck, title: "Получите в день заказа", text: "Доставка или самовывоз из Жуковского." },
];

// Главная (Server): серверная оболочка + клиентские острова (hero R3F, embla, reveal).
export default async function HomePage() {
  const [bundles, balloons, all] = await Promise.all([
    getProductsByCategory("cat-bundles", 1, 12),
    getProductsByCategory("cat-balloons", 1, 12),
    searchProducts(""),
  ]);

  return (
    <main className="flex flex-col gap-24 pb-10">
      <HeroBalloons />

      <Reveal>
        <WhatToCelebrate />
      </Reveal>

      {/* Секция с розовой заливкой — ритм Full Palette */}
      <section style={{ backgroundColor: "var(--color-section-pink)" }} className="py-20">
        <Reveal>
          <CategoryShowcase
            title="Готовые наборы"
            href="/c/gotovye-nabory"
            products={bundles.items}
          />
        </Reveal>
      </section>

      <Reveal>
        <CategoryShowcase
          title="Гелиевые шары"
          href="/c/gelievye-shary"
          products={balloons.items}
        />
      </Reveal>

      {/* Как заказать — голубая заливка */}
      <section style={{ backgroundColor: "var(--color-section-blue)" }} className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="mb-10 text-3xl font-bold tracking-tight sm:text-4xl">
              Как заказать
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="flex flex-col items-start gap-3 rounded-2xl bg-background p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <p className="text-lg font-semibold">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Промо-блок с ярким градиентом Full Palette */}
      <section className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <div
            className="flex flex-col items-start gap-4 rounded-3xl px-8 py-14 text-white"
            style={{ background: "linear-gradient(135deg, #FF2D87 0%, #A855F7 100%)" }}
          >
            <Clock className="h-8 w-8" />
            <h2 className="text-3xl font-bold sm:text-4xl">Доставим в день заказа</h2>
            <p className="max-w-xl text-white/85">
              Юго-восток Московской области — Жуковский, Раменское, Люберцы,
              Малаховка. Всего товаров в каталоге: {all.length}.
            </p>
            <Link
              href="/c/gelievye-shary"
              className="mt-2 rounded-[var(--radius)] bg-white px-6 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-105"
            >
              В каталог
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
