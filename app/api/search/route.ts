import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/shop/api";

/** Лёгкий поиск для живого превью в шапке (wow-фича №3 аддона). */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ items: [] });

  const items = (await searchProducts(q)).slice(0, 6).map((p) => ({
    slug: p.slug,
    title: p.title,
    basePrice: p.basePrice,
    kind: p.kind,
  }));
  return NextResponse.json({ items });
}
