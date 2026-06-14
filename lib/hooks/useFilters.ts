"use client";

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

/**
 * Фильтры в URL — единственный источник правды (спека §5). Отдельного стора нет.
 * shallow: смена фасета не дёргает сервер; history: push — шарятся ссылкой.
 */
export function useFilters() {
  return useQueryStates(
    {
      povod: parseAsArrayOf(parseAsString).withDefault([]),
      color: parseAsArrayOf(parseAsString).withDefault([]),
      size: parseAsArrayOf(parseAsString).withDefault([]),
      min: parseAsInteger,
      max: parseAsInteger,
      sort: parseAsStringEnum(["pop", "price_asc", "price_desc"]).withDefault(
        "pop",
      ),
      page: parseAsInteger.withDefault(1),
    },
    { shallow: true, history: "push" },
  );
}
