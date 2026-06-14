"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

const FLAG = "sharoduwi-age-ok";

/**
 * Age-gate для пиротехники (спека §8): подтверждение возраста до входа/покупки.
 * Флаг — в sessionStorage. Конкретные правила (возраст/классы) задаёт владелец;
 * здесь только точка подтверждения, значения не хардкодим жёстко в бизнес-логику.
 */
export function AgeGate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(FLAG) !== "1") setOpen(true);
  }, []);

  const confirm = () => {
    sessionStorage.setItem(FLAG, "1");
    setOpen(false);
  };

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-md data-[state=open]:animate-overlay-in" />
        <Dialog.Content
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed left-1/2 top-1/2 z-50 w-[min(28rem,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-xl"
        >
          <Dialog.Title className="text-xl font-semibold">
            Подтверждение возраста
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">
            Раздел пиротехники доступен только совершеннолетним. Подтвердите,
            что вам есть 18 лет. Пиротехника отпускается только самовывозом.
          </Dialog.Description>
          <div className="mt-6 flex gap-3">
            <Button onClick={confirm} className="flex-1">
              Мне есть 18 лет
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex-1"
            >
              Мне нет 18
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
