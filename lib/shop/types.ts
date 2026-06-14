/**
 * Доменные типы (наши, НЕ AdvantShop). Спека §3.
 * UI зависит ТОЛЬКО от этих типов. Поля AdvantShop живут только в mappers.ts.
 */

export type Category = {
  id: string;
  slug: string;
  title: string;
  parentId: string | null;
  image?: string;
  childrenIds: string[];
};

export type VariantOption = {
  name: string; // "Цвет", "Размер", "Наполнение"
  values: string[];
};

export type Variant = {
  id: string;
  options: Record<string, string>; // { "Цвет": "Синий", "Размер": "M" }
  price: number;
  oldPrice?: number;
  inStock: boolean;
};

export type DeliveryZoneKind = "core" | "extended" | "pickup";

export type DeliveryZone = {
  id: string; // "se-mo-core" | "moscow" | "far-mo"
  title: string; // "Юго-восток МО" | "Москва" | "Дальняя МО"
  kind: DeliveryZoneKind;
  sameDay: boolean; // возможна ли доставка в тот же день
  minOrder: number; // минимальная сумма заказа для доставки в зону
  deliveryFee: number;
  earliestSlotHours: number; // через сколько часов ближайший доступный слот
  areas: string[]; // районы/города для матчинга адреса
};

export type ProductBadge = "hit" | "new" | "sale";

export type ProductKind = "single" | "bundle"; // bundle = готовый набор

/**
 * inflated   — гелий: локальная доставка по зонам с sameDay + самовывоз
 * flat       — сдутое/аксессуары: доставка во все зоны + самовывоз
 * pickup_only — пиротехника: только самовывоз
 */
export type Fulfillment = "inflated" | "flat" | "pickup_only";

export type ProductFacets = {
  povod: string[];
  color: string[];
  size: string[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  categoryId: string;
  images: string[];
  basePrice: number;
  oldPrice?: number;
  options: VariantOption[];
  variants: Variant[];
  badges: ProductBadge[];
  kind: ProductKind;
  fulfillment: Fulfillment;
  facets: ProductFacets;
};
