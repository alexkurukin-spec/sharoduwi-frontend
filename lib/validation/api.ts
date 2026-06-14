import { z } from "zod";

/**
 * Zod-схемы «сырых» ответов AdvantShop (спека §3).
 * Любой ответ REST проходит эти схемы ДО маппинга в доменные типы.
 * Сейчас валидируют мок-структуру; при подключении REST правим только имена полей здесь и в mappers.ts.
 */

export const AdvantOfferSchema = z.object({
  id: z.string(),
  price: z.number().nonnegative(),
  oldPrice: z.number().nonnegative().optional(),
  amount: z.number().int().nonnegative(), // остаток на складе
  selectedOptions: z.array(
    z.object({ name: z.string(), value: z.string() }),
  ),
});

export const AdvantProductSchema = z.object({
  id: z.string(),
  url: z.string(), // -> slug
  name: z.string(), // -> title
  description: z.string(),
  parentCategoryId: z.string(), // -> categoryId
  pictures: z.array(z.string()).min(1), // -> images
  price: z.number().nonnegative(), // -> basePrice
  oldPrice: z.number().nonnegative().optional(),
  offers: z.array(AdvantOfferSchema).min(1), // -> options + variants
  badges: z.array(z.enum(["hit", "new", "sale"])).default([]),
  productKind: z.enum(["single", "bundle"]), // -> kind
  fulfillment: z.enum(["inflated", "flat", "pickup_only"]),
  facets: z.object({
    povod: z.array(z.string()),
    color: z.array(z.string()),
    size: z.array(z.string()),
  }),
});

export type AdvantProductRaw = z.infer<typeof AdvantProductSchema>;

export const AdvantCategorySchema = z.object({
  id: z.string(),
  url: z.string(), // -> slug
  name: z.string(), // -> title
  parentId: z.string().nullable(),
  imageUrl: z.string().optional(), // -> image
  childrenIds: z.array(z.string()).default([]),
});

export type AdvantCategoryRaw = z.infer<typeof AdvantCategorySchema>;

/**
 * Парсит сырой ответ заданной схемой; при ошибке кидает ПОНЯТНУЮ ошибку
 * (спека: «невалидный ответ — кидаем понятную ошибку, не пускаем мусор в UI»).
 */
export function parseAdvant<S extends z.ZodTypeAny>(
  schema: S,
  raw: unknown,
  label: string,
): z.infer<S> {
  const result = schema.safeParse(raw);
  if (!result.success) {
    const details = result.error.issues
      .map((i) => `${i.path.join(".") || "<root>"}: ${i.message}`)
      .join("; ");
    throw new Error(`Невалидный ответ AdvantShop (${label}): ${details}`);
  }
  return result.data;
}
