import { z } from "zod";

/** Схема формы чекаута (спека §8). Дата/время обязательны — шары сдуваются. */
export const checkoutSchema = z
  .object({
    name: z.string().min(2, "Укажите имя"),
    phone: z
      .string()
      .regex(/^\+?[0-9\s\-()]{10,18}$/, "Проверьте номер телефона"),
    method: z.enum(["delivery", "pickup"]),
    address: z.string(),
    pickupPoint: z.string(),
    date: z.string().min(1, "Выберите дату доставки"),
    slot: z.string().min(1, "Выберите время"),
    comment: z.string(),
    consent: z
      .boolean()
      .refine((v) => v === true, "Нужно согласие на обработку данных (152-ФЗ)"),
  })
  .superRefine((v, ctx) => {
    if (v.method === "delivery" && v.address.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Укажите адрес доставки",
      });
    }
    if (v.method === "pickup" && v.pickupPoint.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pickupPoint"],
        message: "Выберите точку самовывоза",
      });
    }
  });

export type CheckoutValues = z.infer<typeof checkoutSchema>;
