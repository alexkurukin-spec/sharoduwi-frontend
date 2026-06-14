import { env } from "@/lib/env";
import { mockCategories } from "@/lib/shop/mock/categories";
import { mockProducts } from "@/lib/shop/mock/products";

/**
 * Транспорт и переключатель источника (спека §3).
 * Флаг USE_MOCKS выбирает: мок-данные ↔ реальный REST AdvantShop.
 * Возвращает СЫРЫЕ данные (unknown) — валидацию и маппинг делает api.ts через mappers.
 */

const REVALIDATE_SECONDS = 300; // ISR — спека §3

async function restFetch(path: string): Promise<unknown> {
  if (!env.ADVANTSHOP_API_BASE) {
    throw new Error(
      "USE_MOCKS=false, но ADVANTSHOP_API_BASE не задан — некуда ходить за данными.",
    );
  }
  const res = await fetch(`${env.ADVANTSHOP_API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`AdvantShop ${path}: HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchRawCategories(): Promise<unknown> {
  return env.USE_MOCKS ? mockCategories : restFetch("/categories");
}

export async function fetchRawProducts(): Promise<unknown> {
  return env.USE_MOCKS ? mockProducts : restFetch("/products");
}
