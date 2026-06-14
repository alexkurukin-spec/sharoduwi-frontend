import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { searchProducts } from "@/lib/shop/api";
import { POVODS } from "@/lib/shop/povods";
import { DISTRICTS, findDistrict } from "@/lib/shop/districts";
import { PovodLanding } from "@/components/home/PovodLanding";

export const revalidate = 300; // ISR — спека §3

/**
 * Программные лендинги повод × район (спека §6): перехват локального интента.
 * Генерируем пары приоритетных поводов × все районы зон доставки.
 */
export function generateStaticParams() {
  const priority = POVODS.filter((p) => p.priority);
  return priority.flatMap((p) =>
    DISTRICTS.map((d) => ({ slug: p.slug, district: d.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; district: string }>;
}): Promise<Metadata> {
  const { slug, district } = await params;
  const povod = POVODS.find((p) => p.slug === slug);
  const found = findDistrict(district);
  if (!povod || !found) return {};
  return {
    title: `${povod.title} в ${found.area} — шары с доставкой`,
    description: `Готовые наборы и шары на повод «${povod.title}» с доставкой в ${found.area}.`,
  };
}

export default async function PovodDistrictPage({
  params,
}: {
  params: Promise<{ slug: string; district: string }>;
}) {
  const { slug, district } = await params;
  const povod = POVODS.find((p) => p.slug === slug);
  const found = findDistrict(district);
  if (!povod || !found) notFound();

  const all = await searchProducts("");
  const products = all.filter((p) => p.facets.povod.includes(slug));

  return (
    <PovodLanding title={povod.title} products={products} district={found} />
  );
}
