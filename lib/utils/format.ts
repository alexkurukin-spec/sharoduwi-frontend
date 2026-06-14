const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

/** Форматирует цену в рублях: 1290 → «1 290 ₽». */
export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
});

/** Форматирует дату доставки: «14 июня». */
export function formatDeliveryDate(date: Date): string {
  return dateFormatter.format(date);
}
