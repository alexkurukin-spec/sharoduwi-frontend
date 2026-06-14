import { getCategoryBySlug } from "@/lib/shop/api";

export const revalidate = 300;

// Плейсхолдер категории (фаза 2). Полный каталог — фаза 3.
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const leaf = slug[slug.length - 1] ?? "";
  const category = await getCategoryBySlug(leaf);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        {category?.title ?? "Категория"}
      </h1>
      <p className="mt-3 text-muted-foreground">
        Каталог появится в фазе 3. Путь: /{slug.join("/")}
      </p>
    </main>
  );
}
