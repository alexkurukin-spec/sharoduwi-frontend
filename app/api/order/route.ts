import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Mock приёма заказа (спека §8). Реальная отправка в AdvantShop — позже.
 * Заказ уходит с зоной и слотом доставки.
 */
const OrderSchema = z.object({
  contact: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
  }),
  method: z.enum(["delivery", "pickup"]),
  zoneId: z.string(),
  address: z.string().optional(),
  pickupPoint: z.string().optional(),
  date: z.string().min(1),
  slot: z.string().min(1),
  comment: z.string().optional(),
  lines: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        qty: z.number().int().positive(),
        price: z.number().nonnegative(),
      }),
    )
    .min(1),
  total: z.number().nonnegative(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Невалидный JSON" }, { status: 400 });
  }

  const parsed = OrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Проверьте поля заказа", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const orderId = `SH-${Date.now().toString(36).toUpperCase()}`;
  // Здесь будет передача заказа в AdvantShop. Сейчас — мок.
  return NextResponse.json({ ok: true, orderId });
}
