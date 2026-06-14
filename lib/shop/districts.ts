import { DELIVERY_ZONES } from "@/lib/shop/zones";
import type { DeliveryZone } from "@/lib/shop/types";

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya", " ": "-", "-": "-",
};

/** Кириллица → slug для программных URL (например, «Раменское» → «ramenskoe»). */
export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export type District = { slug: string; area: string; zone: DeliveryZone };

/** Плоский список районов из зон доставки — основа программных лендингов повод × район. */
export const DISTRICTS: readonly District[] = DELIVERY_ZONES.flatMap((zone) =>
  zone.areas.map((area) => ({ slug: toSlug(area), area, zone })),
);

export function findDistrict(slug: string): District | undefined {
  return DISTRICTS.find((d) => d.slug === slug);
}
