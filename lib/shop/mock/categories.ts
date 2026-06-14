import type { Category } from "@/lib/shop/types";

/**
 * Мок-каталог (фаза 0): 3 категории верхнего уровня.
 * В фазе 1 источник переключается флагом USE_MOCKS на реальный REST.
 */
export const mockCategories = [
  {
    id: "cat-balloons",
    slug: "gelievye-shary",
    title: "Гелиевые шары",
    parentId: null,
    image: "/mock/cat-balloons.jpg",
    childrenIds: [],
  },
  {
    id: "cat-bundles",
    slug: "gotovye-nabory",
    title: "Готовые наборы",
    parentId: null,
    image: "/mock/cat-bundles.jpg",
    childrenIds: [],
  },
  {
    id: "cat-pyro",
    slug: "pirotehnika",
    title: "Пиротехника",
    parentId: null,
    image: "/mock/cat-pyro.jpg",
    childrenIds: [],
  },
] as const satisfies readonly Category[];
