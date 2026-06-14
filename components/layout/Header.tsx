import Link from "next/link";
import { getMegaMenu } from "@/lib/shop/api";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { ZoneSelector } from "@/components/layout/ZoneSelector";

/** Шапка (Server). Композирует клиентские острова: MegaMenu, ZoneSelector, CartDrawer. */
export async function Header() {
  const categories = await getMegaMenu();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight"
          aria-label="Sharoduwi — на главную"
        >
          Sharoduwi
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <MegaMenu categories={categories} />
          <Link
            href="/c/gotovye-nabory"
            className="rounded-[var(--radius)] px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Готовые наборы
          </Link>
          <Link
            href="/search"
            className="rounded-[var(--radius)] px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Поиск
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ZoneSelector />
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
