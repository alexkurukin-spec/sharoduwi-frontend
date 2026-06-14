import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Сопоставление названий цветов с отображаемым hex (цвет — свотчами, спека §5).
export const COLOR_HEX: Record<string, string> = {
  Белый: "#f5f5f4",
  Розовый: "#f7b6c2",
  Голубой: "#a9d3ec",
  Золотой: "#e3c27e",
  Красный: "#e0564f",
};

export function ColorSwatch({
  color,
  selected,
  onToggle,
}: {
  color: string;
  selected: boolean;
  onToggle: () => void;
}) {
  const hex = COLOR_HEX[color] ?? "#d6d3d1";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      title={color}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded-full border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        selected ? "border-foreground" : "border-border",
      )}
      style={{ backgroundColor: hex }}
    >
      {selected ? (
        <Check className="h-4 w-4 text-foreground/80" strokeWidth={3} />
      ) : null}
      <span className="sr-only">{color}</span>
    </button>
  );
}
