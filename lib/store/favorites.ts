import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FavoritesStore = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((x) => x !== id)
            : [...state.ids, id],
        })),
      has: (id) => get().ids.includes(id),
    }),
    {
      name: "sharoduwi-favorites",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ ids: state.ids }),
      skipHydration: true,
    },
  ),
);

/** Селектор-фабрика: подписка только на статус одного id (стабильные ререндеры). */
export const selectIsFavorite = (id: string) => (s: FavoritesStore) =>
  s.ids.includes(id);
