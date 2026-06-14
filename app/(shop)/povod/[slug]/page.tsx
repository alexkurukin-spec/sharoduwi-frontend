import { notFound } from "next/navigation";
import { POVODS } from "@/lib/shop/povods";

export const revalidate = 300;

// Плейсхолдер лендинга повода (фаза 2). Полные лендинги — фаза 6.
export default async function PovodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const povod = POVODS.find((p) => p.slug === slug);
  if (!povod) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{povod.title}</h1>
      <p className="mt-3 text-muted-foreground">
        Лендинг повода с готовыми наборами появится в фазе 6.
      </p>
    </main>
  );
}
