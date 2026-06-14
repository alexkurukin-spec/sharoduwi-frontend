import { mockCategories } from "@/lib/shop/mock/categories";
import { mockProducts } from "@/lib/shop/mock/products";
import { formatPrice } from "@/lib/utils/format";

// Server Component (RSC по умолчанию — спека §2).
export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">
        Sharoduwi
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Гелиевые шары и праздничный декор
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Каркас проекта (фаза 0). Доставка в день заказа по юго-востоку
        Московской области.
      </p>

      {/* Проверка типизированного чтения моков (критерий «принято» фазы 0). */}
      <section className="mt-12 grid gap-3 text-sm text-muted-foreground">
        <div>
          Категорий в моке: <strong>{mockCategories.length}</strong>
        </div>
        <div>
          Товаров в моке: <strong>{mockProducts.length}</strong>
        </div>
        <div>
          Пример цены:{" "}
          <strong>{formatPrice(mockProducts[0]?.basePrice ?? 0)}</strong>
        </div>
      </section>
    </main>
  );
}
