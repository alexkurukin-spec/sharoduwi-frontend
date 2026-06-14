import type { Metadata } from "next";
import { OrderSuccess } from "@/components/checkout/OrderSuccess";

export const metadata: Metadata = {
  title: "Заказ оформлен",
  robots: { index: false },
};

// Страница благодарности (аддон): /order/success?id=XXX + Web Share.
export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id = "" } = await searchParams;
  return <OrderSuccess orderId={id} />;
}
