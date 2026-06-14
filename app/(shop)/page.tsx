import {
  getDeliveryZones,
  getMegaMenu,
  searchProducts,
} from "@/lib/shop/api";
import { resolveZone } from "@/lib/shop/zones";
import { formatPrice } from "@/lib/utils/format";

export const revalidate = 300; // ISR — спека §3

// Server Component (RSC по умолчанию — спека §2). Данные только через lib/shop/api.
export default async function HomePage() {
  const [categories, products, zones] = await Promise.all([
    getMegaMenu(),
    searchProducts(""),
    getDeliveryZones(),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">
        Sharoduwi
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Гелиевые шары и праздничный декор
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Слой данных (фаза 1): данные идут через адаптер AdvantShop с zod-валидацией.
        Доставка в день заказа по юго-востоку Московской области.
      </p>

      {/* Проверка адаптера и зон — критерии «принято» фазы 1. */}
      <section className="mt-12 grid gap-3 text-sm text-muted-foreground">
        <div>
          Категорий: <strong>{categories.length}</strong>
        </div>
        <div>
          Товаров: <strong>{products.length}</strong>
        </div>
        <div>
          Зон доставки: <strong>{zones.length}</strong>
        </div>
        <div>
          Пример цены:{" "}
          <strong>{formatPrice(products[0]?.basePrice ?? 0)}</strong>
        </div>
        <div>
          resolveZone(«Раменское») →{" "}
          <strong>{resolveZone("Раменское")?.kind ?? "—"}</strong>; resolveZone(«Химки») →{" "}
          <strong>{resolveZone("Химки")?.kind ?? "—"}</strong>
        </div>
      </section>
    </main>
  );
}
