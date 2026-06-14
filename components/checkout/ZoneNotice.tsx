"use client";

import { Info, TriangleAlert } from "lucide-react";
import type { DeliveryZone } from "@/lib/shop/types";
import { formatPrice } from "@/lib/utils/format";

/**
 * Сводка по зоне (спека §8): цена/минимум/слот, плюс предупреждения о
 * принудительном самовывозе (пиротехника или зона kind=pickup) и недоборе minOrder.
 */
export function ZoneNotice({
  zone,
  total,
  hasPickupOnly,
  pickupForced,
}: {
  zone: DeliveryZone;
  total: number;
  hasPickupOnly: boolean;
  pickupForced: boolean;
}) {
  const belowMin = !pickupForced && total < zone.minOrder;

  return (
    <div className="rounded-[var(--radius)] border border-border bg-muted/50 p-4 text-sm">
      <div className="flex items-center gap-2 font-medium">
        <Info className="h-4 w-4 text-accent" />
        Зона: {zone.title}
      </div>
      <ul className="mt-2 grid gap-1 text-muted-foreground">
        {zone.kind !== "pickup" ? (
          <li>Доставка: {formatPrice(zone.deliveryFee)}</li>
        ) : null}
        {zone.kind !== "pickup" ? (
          <li>Минимальный заказ: {formatPrice(zone.minOrder)}</li>
        ) : null}
        <li>
          {zone.sameDay
            ? `Доставка в день заказа, ближайший слот через ~${zone.earliestSlotHours} ч.`
            : "Доставка недоступна — только самовывоз."}
        </li>
      </ul>

      {hasPickupOnly ? (
        <p className="mt-3 flex items-start gap-2 text-accent">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          В корзине есть пиротехника — доступен только самовывоз.
        </p>
      ) : null}
      {zone.kind === "pickup" && !hasPickupOnly ? (
        <p className="mt-3 flex items-start gap-2 text-accent">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          В вашей зоне доставка недоступна — оформите самовывоз.
        </p>
      ) : null}
      {belowMin ? (
        <p className="mt-3 flex items-start gap-2 text-accent">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          Для доставки в эту зону минимум {formatPrice(zone.minOrder)}. Добавьте
          ещё на {formatPrice(zone.minOrder - total)}.
        </p>
      ) : null}
    </div>
  );
}
