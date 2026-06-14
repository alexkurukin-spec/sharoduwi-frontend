import { z } from "zod";
import { fetchRawCategories, fetchRawProducts } from "@/lib/shop/client";
import { mapAdvantCategory, mapAdvantProduct } from "@/lib/shop/mappers";
import { DELIVERY_ZONES } from "@/lib/shop/zones";
import type { Category, DeliveryZone, Product } from "@/lib/shop/types";

/**
 * Серверные fetch-функции, вызываются из RSC (спека §3).
 * Читают сырьё через client.ts, валидируют zod + маппят в доменные типы.
 * UI зависит только от возвращаемых доменных типов, не от формы AdvantShop.
 */

const RawList = z.array(z.unknown());

async function loadCategories(): Promise<Category[]> {
  const raw = RawList.parse(await fetchRawCategories());
  return raw.map(mapAdvantCategory);
}

async function loadProducts(): Promise<Product[]> {
  const raw = RawList.parse(await fetchRawProducts());
  return raw.map(mapAdvantProduct);
}

export async function getMegaMenu(): Promise<Category[]> {
  return loadCategories();
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await loadCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getProductsByCategory(
  categoryId: string,
  page: number,
  perPage: number,
): Promise<{ items: Product[]; total: number }> {
  const all = (await loadProducts()).filter(
    (p) => p.categoryId === categoryId,
  );
  const start = Math.max(0, (page - 1) * perPage);
  return { items: all.slice(start, start + perPage), total: all.length };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await loadProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getRelated(productId: string): Promise<Product[]> {
  const products = await loadProducts();
  const current = products.find((p) => p.id === productId);
  if (!current) return [];
  return products
    .filter((p) => p.categoryId === current.categoryId && p.id !== productId)
    .slice(0, 8);
}

export async function searchProducts(q: string): Promise<Product[]> {
  const products = await loadProducts();
  const query = q.trim().toLowerCase();
  if (!query) return products;
  return products.filter((p) => p.title.toLowerCase().includes(query));
}

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  return [...DELIVERY_ZONES];
}
