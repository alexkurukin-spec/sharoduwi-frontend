import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DEFAULT_ZONE,
  DELIVERY_ZONES,
  resolveZone,
} from "@/lib/shop/zones";
import type { DeliveryZone } from "@/lib/shop/types";

type ZoneStore = {
  zoneId: string | null; // null до выбора пользователем → используется DEFAULT_ZONE
  address: string; // введённый город/адрес
  setByAddress: (address: string) => DeliveryZone | null;
  setZoneId: (zoneId: string) => void;
};

export const useZoneStore = create<ZoneStore>()(
  persist(
    (set) => ({
      zoneId: null,
      address: "",
      setByAddress: (address) => {
        const zone = resolveZone(address);
        set({ address, zoneId: zone?.id ?? null });
        return zone;
      },
      setZoneId: (zoneId) => set({ zoneId }),
    }),
    {
      name: "sharoduwi-zone",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ zoneId: state.zoneId, address: state.address }),
      skipHydration: true, // регидрация вручную, как у корзины (спека §4)
    },
  ),
);

/** Возвращает выбранную зону или дефолтную (юго-восток МО) до выбора. */
export function zoneFromId(zoneId: string | null): DeliveryZone {
  return DELIVERY_ZONES.find((z) => z.id === zoneId) ?? DEFAULT_ZONE;
}
