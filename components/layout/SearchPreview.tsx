"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";

type Hit = { slug: string; title: string; basePrice: number; kind: string };

/**
 * Живой поиск с превью (wow-фича №3 аддона): debounce 300ms → GET /api/search,
 * dropdown с превью. Нативно, без библиотеки автокомплита.
 */
export function SearchPreview() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!q.trim()) {
      setHits([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data: { items: Hit[] } = await res.json();
        setHits(data.items);
        setOpen(true);
      } catch {
        setHits([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className="relative hidden md:block">
      <form onSubmit={submit}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => hits.length > 0 && setOpen(true)}
          placeholder="Поиск шаров и наборов…"
          aria-label="Поиск"
          className="h-10 w-56 rounded-full border border-border bg-muted/60 pl-9 pr-3 text-sm transition-all focus:w-72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </form>

      {open && hits.length > 0 ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
          <ul className="max-h-96 overflow-y-auto py-2">
            {hits.map((h) => (
              <li key={h.slug}>
                <Link
                  href={`/product/${h.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-muted"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src="/placeholder.svg" alt="" fill sizes="48px" className="object-cover" />
                  </div>
                  <span className="flex-1 text-sm leading-tight">{h.title}</span>
                  <span className="font-display text-sm font-bold text-sun">
                    {formatPrice(h.basePrice)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
