import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Строка корзины. key — ключ дедупликации (спека §4). */
export type CartLine = {
  key: string; // `${productId}:${variantId}:${hash(options)}`
  productId: string;
  variantId: string;
  title: string;
  image: string;
  price: number;
  qty: number;
  options: Record<string, string>;
};

type CartStore = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

/** Стабильный ключ дедупликации по варианту и набору опций. */
function lineKey(productId: string, variantId: string, options: Record<string, string>): string {
  const hash = Object.keys(options)
    .sort()
    .map((k) => `${k}=${options[k]}`)
    .join("|");
  return `${productId}:${variantId}:${hash}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      lines: [],
      add: (line, qty = 1) =>
        set((state) => {
          const key = lineKey(line.productId, line.variantId, line.options);
          const existing = state.lines.find((l) => l.key === key);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.key === key ? { ...l, qty: l.qty + qty } : l,
              ),
            };
          }
          return { lines: [...state.lines, { ...line, key, qty }] };
        }),
      setQty: (key, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((l) => l.key !== key)
              : state.lines.map((l) => (l.key === key ? { ...l, qty } : l)),
        })),
      remove: (key) =>
        set((state) => ({ lines: state.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "sharoduwi-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      // Серверный рендер пустой; клиент регидрирует вручную после монтирования (спека §4).
      skipHydration: true,
    },
  ),
);

/** Селектор: суммарное количество единиц в корзине (для бейджа). */
export const selectCartCount = (state: CartStore): number =>
  state.lines.reduce((sum, l) => sum + l.qty, 0);
