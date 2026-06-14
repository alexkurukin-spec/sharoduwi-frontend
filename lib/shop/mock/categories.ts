import type { AdvantCategoryRaw } from "@/lib/validation/api";

/**
 * Мок-каталог в «сырой» форме AdvantShop (фаза 1): 3 категории верхнего уровня.
 * Источник переключается флагом USE_MOCKS на реальный REST; форму знает только адаптер.
 */
export const mockCategories = [
  {
    id: "cat-balloons",
    url: "gelievye-shary",
    name: "Гелиевые шары",
    parentId: null,
    imageUrl: "/mock/cat-balloons.jpg",
    childrenIds: [],
  },
  {
    id: "cat-bundles",
    url: "gotovye-nabory",
    name: "Готовые наборы",
    parentId: null,
    imageUrl: "/mock/cat-bundles.jpg",
    childrenIds: [],
  },
  {
    id: "cat-pyro",
    url: "pirotehnika",
    name: "Пиротехника",
    parentId: null,
    imageUrl: "/mock/cat-pyro.jpg",
    childrenIds: [],
  },
] as const satisfies readonly AdvantCategoryRaw[];
