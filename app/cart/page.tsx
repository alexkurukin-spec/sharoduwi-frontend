import type { Metadata } from "next";
import Link from "next/link";
import { CartPageView } from "@/components/layout/CartPageView";

export const metadata: Metadata = {
  title: "Корзина",
};

// Fallback корзины на всю ширину (спека §8): deep-link/SEO. Основной UX — дровер.
export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        Sharoduwi
      </Link>
      <h1 className="mb-8 mt-6 text-3xl font-semibold tracking-tight">Корзина</h1>
      <CartPageView />
    </div>
  );
}
