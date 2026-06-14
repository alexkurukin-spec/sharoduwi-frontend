"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useHasHydrated } from "@/lib/hooks/useHasHydrated";
import { useZoneStore, zoneFromId } from "@/lib/store/zone";
import { DELIVERY_ZONES } from "@/lib/shop/zones";
import { cn } from "@/lib/utils/cn";

// Быстрые подсказки городов для матчинга (по одному показательному из каждой зоны).
const QUICK_AREAS = ["Жуковский", "Раменское", "Люберцы", "Москва", "Химки", "Коломна"];

/**
 * Выбор зоны доставки в шапке (спека §8): город → resolveZone → localStorage.
 * Зона — первичный параметр опыта. До выбора — дефолт «юго-восток МО».
 */
export function ZoneSelector() {
  const hydrated = useHasHydrated();
  const zoneId = useZoneStore((s) => s.zoneId);
  const savedAddress = useZoneStore((s) => s.address);
  const setByAddress = useZoneStore((s) => s.setByAddress);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const zone = zoneFromId(zoneId);
  // До регидрации показываем дефолт, чтобы не ловить mismatch.
  const label = hydrated ? zone.title : "Юго-восток МО";

  function apply(address: string) {
    const resolved = setByAddress(address);
    if (!resolved) {
      setError("Не нашли такой город в зонах доставки. Попробуйте ближайший крупный.");
      return;
    }
    setError(null);
    setOpen(false);
    setInput("");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MapPin className="h-4 w-4 text-accent" />
          <span className="max-w-[8rem] truncate">{label}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Куда доставить?</SheetTitle>
          <SheetDescription>
            Зона определяет доступность, способ получения, ближайший слот и цену доставки.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply(input);
          }}
          className="flex flex-col gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Город или район, напр. «Раменское»"
            className="h-10 rounded-[var(--radius)] border border-border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Город или район доставки"
          />
          <div className="flex flex-wrap gap-2">
            {QUICK_AREAS.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => apply(area)}
                className="rounded-full border border-border px-3 py-1 text-xs transition-colors hover:bg-muted"
              >
                {area}
              </button>
            ))}
          </div>
          {error ? <p className="text-xs text-accent">{error}</p> : null}
          <Button type="submit">Сохранить зону</Button>
        </form>

        <div className="mt-2 rounded-[var(--radius)] bg-muted p-3 text-sm">
          <p className="font-medium">Текущая зона: {label}</p>
          {hydrated && savedAddress ? (
            <p className="text-muted-foreground">Адрес: {savedAddress}</p>
          ) : null}
          <p className="mt-1 text-muted-foreground">
            {zone.sameDay
              ? `Доставка в день заказа, ближайший слот через ~${zone.earliestSlotHours} ч.`
              : "В этой зоне — только самовывоз."}
          </p>
        </div>

        <ul className="mt-auto grid gap-1 text-xs text-muted-foreground">
          {DELIVERY_ZONES.map((z) => (
            <li
              key={z.id}
              className={cn(
                "flex items-center justify-between rounded px-2 py-1",
                hydrated && z.id === zone.id && "bg-muted font-medium text-foreground",
              )}
            >
              <span>{z.title}</span>
              <span>{z.kind === "pickup" ? "самовывоз" : `от ${z.minOrder} ₽`}</span>
            </li>
          ))}
        </ul>
        <SheetClose className="sr-only">Закрыть</SheetClose>
      </SheetContent>
    </Sheet>
  );
}
