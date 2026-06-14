import Link from "next/link";
import { MapPin } from "lucide-react";
import { POVODS } from "@/lib/shop/povods";
import { PICKUP_POINTS } from "@/lib/shop/pickup";

/** Подвал (Server). */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-semibold">Sharoduwi</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Гелиевые шары и праздничный декор. Доставка в день заказа по
            юго-востоку Московской области.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Точки выдачи</p>
          <ul className="mt-3 grid gap-3">
            {PICKUP_POINTS.map((p) => (
              <li key={p.id} className="flex gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  {p.title}
                  <br />
                  <span className="text-xs">{p.hours}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Поводы</p>
          <ul className="mt-3 grid gap-2">
            {POVODS.slice(0, 5).map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/povod/${p.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Каталог</p>
          <ul className="mt-3 grid gap-2">
            <li>
              <Link href="/c/gelievye-shary" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Гелиевые шары
              </Link>
            </li>
            <li>
              <Link href="/c/gotovye-nabory" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Готовые наборы
              </Link>
            </li>
            <li>
              <Link href="/c/pirotehnika" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Пиротехника
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sharoduwi. Все права защищены.
      </div>
    </footer>
  );
}
