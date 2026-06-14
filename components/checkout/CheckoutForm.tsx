"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlotPicker } from "@/components/checkout/SlotPicker";
import { ZoneNotice } from "@/components/checkout/ZoneNotice";
import { checkoutSchema, type CheckoutValues } from "@/lib/validation/checkout";
import {
  selectCartTotal,
  selectHasPickupOnly,
  useCartStore,
} from "@/lib/store/cart";
import { useZoneStore, zoneFromId } from "@/lib/store/zone";
import { useHasHydrated } from "@/lib/hooks/useHasHydrated";
import { resolveZone } from "@/lib/shop/zones";
import { PICKUP_POINTS } from "@/lib/shop/pickup";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const inputClass =
  "h-10 w-full rounded-[var(--radius)] border border-border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

/** Чекаут в 3 шага (спека §8). Адрес → resolveZone → способы и слот. */
export function CheckoutForm() {
  const hydrated = useHasHydrated();
  const lines = useCartStore((s) => s.lines);
  const total = useCartStore(selectCartTotal);
  const hasPickupOnly = useCartStore(selectHasPickupOnly);
  const clear = useCartStore((s) => s.clear);
  const zoneId = useZoneStore((s) => s.zoneId);
  const savedAddress = useZoneStore((s) => s.address);

  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      method: "delivery",
      address: savedAddress,
      pickupPoint: "",
      date: "",
      slot: "",
      comment: "",
      consent: false,
    },
  });

  const method = watch("method");
  const address = watch("address");
  const date = watch("date");
  const slot = watch("slot");

  // Зона выводится из адреса (или из выбранной в шапке до ввода).
  const zone = useMemo(() => {
    const byAddress = address.trim() ? resolveZone(address) : null;
    return byAddress ?? zoneFromId(zoneId);
  }, [address, zoneId]);

  // Принудительный самовывоз: пиротехника в корзине или зона kind=pickup.
  const pickupForced = hasPickupOnly || zone.kind === "pickup";

  useEffect(() => {
    if (pickupForced && method !== "pickup") setValue("method", "pickup");
  }, [pickupForced, method, setValue]);

  const deliveryFee = method === "delivery" ? zone.deliveryFee : 0;
  const belowMin = method === "delivery" && total < zone.minOrder;
  const minDate = zone.sameDay
    ? new Date().toISOString().slice(0, 10)
    : new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const onSubmit = handleSubmit(async (values) => {
    if (belowMin) {
      setSubmitError("Сумма заказа ниже минимума для доставки в эту зону.");
      setStep(2);
      return;
    }
    setSubmitError(null);
    const payload = {
      contact: { name: values.name, phone: values.phone },
      method: values.method,
      zoneId: zone.id,
      address: values.address,
      pickupPoint: values.pickupPoint,
      date: values.date,
      slot: values.slot,
      comment: values.comment,
      lines: lines.map((l) => ({
        productId: l.productId,
        variantId: l.variantId,
        qty: l.qty,
        price: l.price,
      })),
      total: total + deliveryFee,
    };
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data: unknown = await res.json();
    if (res.ok && typeof data === "object" && data && "orderId" in data) {
      setOrderId(String((data as { orderId: string }).orderId));
      clear();
    } else {
      setSubmitError("Не удалось оформить заказ. Попробуйте ещё раз.");
    }
  });

  if (orderId) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <CheckCircle2 className="h-14 w-14 text-accent" />
        <h2 className="text-2xl font-semibold">Заказ оформлен</h2>
        <p className="text-muted-foreground">
          Номер заказа: <strong>{orderId}</strong>. Мы свяжемся для подтверждения.
        </p>
        <Link href="/">
          <Button variant="outline">На главную</Button>
        </Link>
      </div>
    );
  }

  if (!hydrated) {
    return <p className="py-16 text-center text-muted-foreground">Загрузка…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p>Корзина пуста — оформлять нечего.</p>
        <Link href="/c/gelievye-shary" className="mt-4 inline-block">
          <Button variant="outline">В каталог</Button>
        </Link>
      </div>
    );
  }

  const next = async () => {
    const ok =
      step === 1
        ? await trigger(["name", "phone"])
        : await trigger(["method", "address", "pickupPoint", "date", "slot"]);
    if (ok) setStep((s) => Math.min(3, s + 1));
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-6">
        {/* Индикатор шагов */}
        <ol className="flex items-center gap-2 text-sm">
          {["Контакты", "Доставка", "Подтверждение"].map((t, i) => (
            <li
              key={t}
              className={cn(
                "flex items-center gap-2",
                i + 1 === step ? "font-semibold" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  i + 1 <= step ? "bg-accent text-accent-foreground" : "bg-muted",
                )}
              >
                {i + 1}
              </span>
              {t}
              {i < 2 ? <span className="mx-1 text-border">—</span> : null}
            </li>
          ))}
        </ol>

        {step === 1 ? (
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm">
              Имя
              <input className={inputClass} {...register("name")} />
              {errors.name ? (
                <span className="text-xs text-accent">{errors.name.message}</span>
              ) : null}
            </label>
            <label className="grid gap-1 text-sm">
              Телефон
              <input className={inputClass} inputMode="tel" placeholder="+7 999 123-45-67" {...register("phone")} />
              {errors.phone ? (
                <span className="text-xs text-accent">{errors.phone.message}</span>
              ) : null}
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-5">
            <fieldset className="grid gap-2">
              <legend className="mb-1 text-sm font-semibold">Способ получения</legend>
              <div className="flex flex-wrap gap-2">
                <label
                  className={cn(
                    "cursor-pointer rounded-[var(--radius)] border px-4 py-2 text-sm",
                    method === "delivery" ? "border-accent bg-accent/10" : "border-border",
                    pickupForced && "pointer-events-none opacity-40",
                  )}
                >
                  <input type="radio" value="delivery" className="sr-only" disabled={pickupForced} {...register("method")} />
                  Доставка
                </label>
                <label
                  className={cn(
                    "cursor-pointer rounded-[var(--radius)] border px-4 py-2 text-sm",
                    method === "pickup" ? "border-accent bg-accent/10" : "border-border",
                  )}
                >
                  <input type="radio" value="pickup" className="sr-only" {...register("method")} />
                  Самовывоз
                </label>
              </div>
            </fieldset>

            {method === "delivery" ? (
              <label className="grid gap-1 text-sm">
                Адрес доставки
                <input className={inputClass} placeholder="Город, улица, дом" {...register("address")} />
                {errors.address ? (
                  <span className="text-xs text-accent">{errors.address.message}</span>
                ) : null}
              </label>
            ) : (
              <fieldset className="grid gap-2">
                <legend className="text-sm">Точка самовывоза</legend>
                {PICKUP_POINTS.map((p) => (
                  <label
                    key={p.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-[var(--radius)] border p-3 text-sm",
                      watch("pickupPoint") === p.title ? "border-accent bg-accent/10" : "border-border",
                    )}
                  >
                    <input type="radio" value={p.title} {...register("pickupPoint")} />
                    <span>
                      {p.title}
                      <br />
                      <span className="text-xs text-muted-foreground">{p.hours}</span>
                    </span>
                  </label>
                ))}
                {errors.pickupPoint ? (
                  <span className="text-xs text-accent">{errors.pickupPoint.message}</span>
                ) : null}
              </fieldset>
            )}

            <label className="grid gap-1 text-sm">
              Дата
              <input type="date" min={minDate} className={inputClass} {...register("date")} />
              {errors.date ? (
                <span className="text-xs text-accent">{errors.date.message}</span>
              ) : null}
            </label>

            <div className="grid gap-1 text-sm">
              <span>Время</span>
              <SlotPicker
                zone={zone}
                date={date}
                value={slot}
                onChange={(s) => setValue("slot", s, { shouldValidate: true })}
              />
              {errors.slot ? (
                <span className="text-xs text-accent">{errors.slot.message}</span>
              ) : null}
            </div>

            <ZoneNotice
              zone={zone}
              total={total}
              hasPickupOnly={hasPickupOnly}
              pickupForced={pickupForced}
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm">
              Комментарий (необязательно)
              <textarea className={cn(inputClass, "h-20 py-2")} {...register("comment")} />
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" {...register("consent")} />
              <span>
                Согласен на обработку персональных данных в соответствии с 152-ФЗ.
              </span>
            </label>
            {errors.consent ? (
              <span className="text-xs text-accent">{errors.consent.message}</span>
            ) : null}
            {submitError ? (
              <p className="text-sm text-accent">{submitError}</p>
            ) : null}
          </div>
        ) : null}

        <div className="flex gap-3">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
              Назад
            </Button>
          ) : null}
          {step < 3 ? (
            <Button type="button" onClick={next}>
              Далее
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting || belowMin}>
              {isSubmitting ? "Отправляем…" : "Оформить заказ"}
            </Button>
          )}
        </div>
      </div>

      {/* Сводка заказа */}
      <aside className="h-fit rounded-2xl border border-border p-5">
        <p className="text-sm font-semibold">Ваш заказ</p>
        <ul className="mt-3 grid gap-2 text-sm">
          {lines.map((l) => (
            <li key={l.key} className="flex justify-between gap-2">
              <span className="text-muted-foreground">
                {l.title} × {l.qty}
              </span>
              <span>{formatPrice(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-border pt-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Доставка</span>
            <span>{method === "delivery" ? formatPrice(deliveryFee) : "Самовывоз"}</span>
          </div>
          <div className="mt-2 flex justify-between text-base font-semibold">
            <span>Итого</span>
            <span>{formatPrice(total + deliveryFee)}</span>
          </div>
        </div>
      </aside>
    </form>
  );
}
