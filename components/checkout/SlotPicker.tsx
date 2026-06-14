"use client";

import type { DeliveryZone } from "@/lib/shop/types";
import { cn } from "@/lib/utils/cn";

const SLOTS = [
  "10:00–12:00",
  "12:00–14:00",
  "14:00–16:00",
  "16:00–18:00",
  "18:00–20:00",
] as const;

function slotStartHour(slot: string): number {
  return Number(slot.slice(0, 2));
}

/**
 * Выбор слота (спека §8): для sameDay-зоны ближайший слот не раньше
 * earliestSlotHours от текущего момента. Дата приходит из формы.
 */
export function SlotPicker({
  zone,
  date,
  value,
  onChange,
}: {
  zone: DeliveryZone;
  date: string;
  value: string;
  onChange: (slot: string) => void;
}) {
  const today = new Date();
  const isToday = date === today.toISOString().slice(0, 10);
  const earliestHour = today.getHours() + zone.earliestSlotHours;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {SLOTS.map((slot) => {
          const disabled = isToday && slotStartHour(slot) < earliestHour;
          return (
            <button
              key={slot}
              type="button"
              disabled={disabled}
              onClick={() => onChange(slot)}
              aria-pressed={value === slot}
              className={cn(
                "rounded-[var(--radius)] border px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                value === slot
                  ? "border-accent bg-accent/10"
                  : "border-border hover:bg-muted",
              )}
            >
              {slot}
            </button>
          );
        })}
      </div>
      {zone.sameDay && isToday ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Ближайший слот — не раньше чем через {zone.earliestSlotHours} ч.
        </p>
      ) : null}
    </div>
  );
}
