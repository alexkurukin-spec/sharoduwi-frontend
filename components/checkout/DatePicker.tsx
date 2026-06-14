"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ru } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";
import "react-day-picker/style.css";

/** Календарь даты доставки (аддон): react-day-picker, локаль ru, дни в прошлом недоступны. */
export function DatePicker({
  value,
  min,
  onChange,
}: {
  value: string;
  min: Date;
  onChange: (iso: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseISO(value) : undefined;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-full items-center gap-2 rounded-[var(--radius)] border border-border bg-background px-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <CalendarDays className="h-4 w-4 text-accent" />
        {selected ? format(selected, "d MMMM yyyy", { locale: ru }) : "Выберите дату"}
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 rounded-2xl border border-border bg-background p-3 shadow-xl">
          <DayPicker
            mode="single"
            locale={ru}
            selected={selected}
            disabled={{ before: min }}
            defaultMonth={selected ?? min}
            onSelect={(d) => {
              if (d) {
                onChange(format(d, "yyyy-MM-dd"));
                setOpen(false);
              }
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
