import { Search } from "lucide-react";
import { searchProducts } from "@/lib/shop/api";
import { SearchResults } from "@/components/catalog/SearchResults";

// Поиск (Server shell): серверная фильтрация по ?q, виртуализация при > 100 (спека §5, §6).
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const products = q.trim() ? await searchProducts(q) : [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Поиск</h1>

      <form action="/search" className="mb-8 flex max-w-xl items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Шары, наборы, повод…"
            className="h-11 w-full rounded-[var(--radius)] border border-border bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Поисковый запрос"
          />
        </div>
        <button
          type="submit"
          className="h-11 rounded-[var(--radius)] bg-accent px-5 text-sm font-medium text-accent-foreground"
        >
          Найти
        </button>
      </form>

      {q.trim() ? (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            По запросу «{q}» найдено: {products.length}
          </p>
          <SearchResults products={products} />
        </>
      ) : (
        <p className="text-muted-foreground">Введите запрос, чтобы найти товары.</p>
      )}
    </main>
  );
}
