import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Оформление заказа",
};

// Чекаут без оплаты (спека §8): rhf + zod, 3 шага, зона → способы и слот.
export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        Sharoduwi
      </Link>
      <h1 className="mb-8 mt-6 text-3xl font-semibold tracking-tight">
        Оформление заказа
      </h1>
      <CheckoutForm />
    </div>
  );
}
