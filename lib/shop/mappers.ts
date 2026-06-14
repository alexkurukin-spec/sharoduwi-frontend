import {
  AdvantCategorySchema,
  AdvantProductSchema,
  parseAdvant,
} from "@/lib/validation/api";
import type { Category, Product, Variant, VariantOption } from "@/lib/shop/types";

/**
 * ЕДИНСТВЕННОЕ место, знающее реальные поля AdvantShop (спека §3).
 * Сейчас маппит мок-структуру -> доменные типы. При подключении REST правим только здесь.
 */

export function mapAdvantProduct(raw: unknown): Product {
  const p = parseAdvant(AdvantProductSchema, raw, "product");

  // Опции выводим из офферов, сохраняя порядок появления и уникальность значений.
  const optionMap = new Map<string, string[]>();
  for (const offer of p.offers) {
    for (const opt of offer.selectedOptions) {
      const values = optionMap.get(opt.name) ?? [];
      if (!values.includes(opt.value)) values.push(opt.value);
      optionMap.set(opt.name, values);
    }
  }
  const options: VariantOption[] = [...optionMap].map(([name, values]) => ({
    name,
    values,
  }));

  const variants: Variant[] = p.offers.map((offer) => ({
    id: offer.id,
    options: Object.fromEntries(
      offer.selectedOptions.map((o) => [o.name, o.value]),
    ),
    price: offer.price,
    ...(offer.oldPrice !== undefined ? { oldPrice: offer.oldPrice } : {}),
    inStock: offer.amount > 0,
  }));

  return {
    id: p.id,
    slug: p.url,
    title: p.name,
    description: p.description,
    categoryId: p.parentCategoryId,
    images: p.pictures,
    basePrice: p.price,
    ...(p.oldPrice !== undefined ? { oldPrice: p.oldPrice } : {}),
    options,
    variants,
    badges: p.badges,
    kind: p.productKind,
    fulfillment: p.fulfillment,
    facets: p.facets,
  };
}

export function mapAdvantCategory(raw: unknown): Category {
  const c = parseAdvant(AdvantCategorySchema, raw, "category");
  return {
    id: c.id,
    slug: c.url,
    title: c.name,
    parentId: c.parentId,
    ...(c.imageUrl !== undefined ? { image: c.imageUrl } : {}),
    childrenIds: c.childrenIds,
  };
}
