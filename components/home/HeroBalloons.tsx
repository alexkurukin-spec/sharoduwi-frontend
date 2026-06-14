"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// R3F — только hero, ssr:false, Suspense-фолбэк = статичная заливка (спека §7).
const HeroScene = dynamic(() => import("@/components/home/HeroScene"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

function HeroFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(40% 50% at 30% 35%, #f7b6c2aa, transparent), radial-gradient(35% 45% at 70% 55%, #a9d3ecaa, transparent), radial-gradient(30% 40% at 55% 30%, #e3c27e88, transparent)",
      }}
    />
  );
}

/** Hero главной (спека §8). 3D отключается при prefers-reduced-motion. */
export function HeroBalloons() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-muted/40">
        {animate ? (
          <Suspense fallback={<HeroFallback />}>
            <HeroScene />
          </Suspense>
        ) : (
          <HeroFallback />
        )}
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-28 sm:py-36">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Sharoduwi
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Гелиевые шары и композиции с доставкой в день заказа
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Готовые наборы на выписку и рождение — в пару кликов. Юго-восток
          Московской области и дальше, зона за зоной.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/povod/vypiska">
            <Button size="lg">Наборы на выписку</Button>
          </Link>
          <Link href="/c/gelievye-shary">
            <Button size="lg" variant="outline">
              Весь каталог
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
