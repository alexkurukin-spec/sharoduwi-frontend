import type { DeliveryZone } from "@/lib/shop/types";

/**
 * Зональная логика живёт ТОЛЬКО здесь (правило §6).
 * Зона доставки — первичный параметр опыта: доступность, способ получения,
 * ближайший слот и цена выводятся отсюда, а не хардкодятся в компонентах.
 *
 * Минимум фазы 1: юго-восток МО (core), Москва (extended), дальняя МО (pickup).
 */
export const DELIVERY_ZONES: readonly DeliveryZone[] = [
  {
    id: "se-mo-core",
    title: "Юго-восток МО",
    kind: "core",
    sameDay: true,
    minOrder: 1500,
    deliveryFee: 300,
    earliestSlotHours: 3,
    areas: [
      "Жуковский",
      "Раменское",
      "Люберцы",
      "Малаховка",
      "Удельная",
      "Быково",
      "Кратово",
      "Ильинский",
      "Котельники",
      "Дзержинский",
      "Лыткарино",
    ],
  },
  {
    id: "moscow",
    title: "Москва",
    kind: "extended",
    sameDay: true,
    minOrder: 3000,
    deliveryFee: 600,
    earliestSlotHours: 5,
    areas: [
      "Москва",
      "Химки",
      "Балашиха",
      "Реутов",
      "Видное",
      "Одинцово",
      "Мытищи",
      "Королёв",
    ],
  },
  {
    id: "far-mo",
    title: "Дальняя МО",
    kind: "pickup",
    sameDay: false,
    minOrder: 0,
    deliveryFee: 0,
    earliestSlotHours: 24,
    areas: [
      "Коломна",
      "Воскресенск",
      "Егорьевск",
      "Серпухов",
      "Кашира",
      "Ступино",
    ],
  },
];

/**
 * Чистая синхронная утилита: матчит адрес/город на зону доставки.
 * Без сети. Возвращает первую зону, чей район входит в адрес (подстрока, регистронезависимо).
 */
export function resolveZone(address: string): DeliveryZone | null {
  const query = address.trim().toLowerCase();
  if (!query) return null;
  for (const zone of DELIVERY_ZONES) {
    if (zone.areas.some((area) => query.includes(area.toLowerCase()))) {
      return zone;
    }
  }
  return null;
}

/** Дефолтная зона до выбора пользователем (спека §8: Жуковский / юго-восток МО). */
export const DEFAULT_ZONE: DeliveryZone = DELIVERY_ZONES[0] ?? {
  id: "se-mo-core",
  title: "Юго-восток МО",
  kind: "core",
  sameDay: true,
  minOrder: 1500,
  deliveryFee: 300,
  earliestSlotHours: 3,
  areas: ["Жуковский"],
};
