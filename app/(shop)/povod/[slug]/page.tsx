import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { searchProducts } from "@/lib/shop/api";
import { POVODS } from "@/lib/shop/povods";
import { PovodLanding } from "@/components/home/PovodLanding";

export const revalidate = 300; // ISR — спека §3

// Статическая генерация лендингов поводов.
export function generateStaticParams() {
  return POVODS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const povod = POVODS.find((p) => p.slug === slug);
  if (!povod) return {};
  return {
    title: `${povod.title} — готовые наборы шаров`,
    description: `Готовые композиции и шары на повод «${povod.title}» с доставкой по юго-востоку МО.`,
  };
}

export default async function PovodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const povod = POVODS.find((p) => p.slug === slug);
  if (!povod) notFound();

  const all = await searchProducts("");
  const products = all.filter((p) => p.facets.povod.includes(slug));

  return <PovodLanding title={povod.title} products={products} />;
}
