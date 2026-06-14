"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { useZoneStore } from "@/lib/store/zone";
import { useFavoritesStore } from "@/lib/store/favorites";

// Регидрация persist-сторов запускается один раз на клиенте.
let rehydrated: Promise<void> | null = null;
function rehydrateOnce(): Promise<void> {
  if (!rehydrated) {
    rehydrated = Promise.all([
      Promise.resolve(useCartStore.persist.rehydrate()),
      Promise.resolve(useZoneStore.persist.rehydrate()),
      Promise.resolve(useFavoritesStore.persist.rehydrate()),
    ]).then(() => undefined);
  }
  return rehydrated;
}

/**
 * Сообщает, завершилась ли ручная регидрация persist-сторов.
 * До регидрации UI, зависящий от localStorage (бейдж корзины, выбранная зона),
 * не показываем — иначе hydration mismatch (спека §4).
 */
export function useHasHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    void rehydrateOnce().then(() => {
      if (active) setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  return hydrated;
}
