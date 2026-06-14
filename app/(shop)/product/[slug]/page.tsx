import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelated } from "@/lib/shop/api";
import { Gallery } from "@/components/product/Gallery";
import { BuyPanel } from "@/components/product/BuyPanel";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { AgeGate } from "@/components/product/AgeGate";
import {
  JsonLd,
  breadcrumbJsonLd,
  productJsonLd,
} from "@/components/seo/JsonLd";
import { env } from "@/lib/env";

export const revalidate = 300; // ISR — спека §3

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.description,
      type: "website",
    },
  };
}

// PDP (Server): фетчит продукт + похожие; клиентские острова — Gallery, BuyPanel.
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelated(product.id);
  const isPyro = product.fulfillment === "pickup_only";
  const url = `${env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 pb-28 lg:pb-10">
      <JsonLd data={productJsonLd(product, url)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Главная", url: env.NEXT_PUBLIC_SITE_URL },
          { name: product.title, url },
        ])}
      />
      {isPyro ? <AgeGate /> : null}

      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Хлебные крошки">
        <Link href="/" className="hover:text-foreground">
          Главная
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <Gallery images={product.images} alt={product.title} slug={product.slug} />

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {product.title}
          </h1>
          <p className="mt-3 text-muted-foreground">{product.description}</p>
          <div className="mt-8">
            <BuyPanel product={product} />
          </div>
        </div>
      </div>

      <RelatedProducts products={related} />
    </main>
  );
}
