import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/shop/api";
import { CatalogView } from "@/components/catalog/CatalogView";

export const revalidate = 300; // ISR — спека §3

// RSC: отдаёт весь набор категории один раз; фильтрация/пагинация — на клиенте.
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const leaf = slug[slug.length - 1] ?? "";
  const category = await getCategoryBySlug(leaf);
  if (!category) notFound();

  const { items } = await getProductsByCategory(category.id, 1, 1000);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-4 text-sm text-muted-foreground" aria-label="Хлебные крошки">
        <Link href="/" className="hover:text-foreground">
          Главная
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-foreground">{category.title}</span>
      </nav>

      <h1 className="mb-8 text-3xl font-semibold tracking-tight">
        {category.title}
      </h1>

      <CatalogView products={items} />
    </main>
  );
}
