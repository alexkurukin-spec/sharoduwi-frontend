"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Пагинация 48/стр (спека §6). page в URL — шарится и сохраняется. */
export function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-12 flex items-center justify-center gap-1" aria-label="Пагинация">
      <button
        type="button"
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-border disabled:opacity-40 hover:bg-muted"
        aria-label="Предыдущая страница"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPage(p)}
          aria-current={p === page}
          className={cn(
            "inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--radius)] border px-2 text-sm",
            p === page
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border hover:bg-muted",
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-border disabled:opacity-40 hover:bg-muted"
        aria-label="Следующая страница"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
