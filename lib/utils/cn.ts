import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Объединяет классы с разрешением конфликтов Tailwind (спека §1). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
