/** Точки самовывоза в Жуковском (спека §2, §8). */
export type PickupPoint = { id: string; title: string; hours: string };

export const PICKUP_POINTS: readonly PickupPoint[] = [
  { id: "gagarina", title: "Жуковский, ул. Гагарина, 1", hours: "Пн–Вс 9:00–21:00" },
  { id: "chkalova", title: "Жуковский, ул. Чкалова, 20", hours: "Пн–Вс 10:00–20:00" },
];
