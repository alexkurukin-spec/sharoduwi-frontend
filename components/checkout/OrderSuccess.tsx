"use client";

import Link from "next/link";
import { CheckCircle2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Благодарность за заказ + Web Share (аддон). */
export function OrderSuccess({ orderId }: { orderId: string }) {
  const share = async () => {
    const text = `Заказал шары в Sharoduwi! Заказ ${orderId}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Sharoduwi", text, url: window.location.origin });
      } catch {
        /* пользователь отменил — ничего не делаем */
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(`${text} — ${window.location.origin}`);
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-6 py-24 text-center">
      <CheckCircle2 className="h-16 w-16 text-grass" />
      <h1 className="text-3xl font-bold tracking-tight">Заказ оформлен!</h1>
      <p className="text-muted-foreground">
        {orderId ? (
          <>
            Номер заказа: <strong className="text-foreground">{orderId}</strong>.{" "}
          </>
        ) : null}
        Мы свяжемся с вами для подтверждения деталей и времени доставки.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={share} className="gap-2">
          <Share2 className="h-4 w-4" /> Поделиться
        </Button>
        <Link href="/">
          <Button variant="outline">На главную</Button>
        </Link>
      </div>
    </div>
  );
}
