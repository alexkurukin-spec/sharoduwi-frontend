import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelated } from "@/lib/shop/api";
import { Gallery } from "@/components/product/Gallery";
import { BuyPanel } from "@/components/product/BuyPanel";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { AgeGate } from "@/components/product/AgeGate";

export const revalidate = 300; // ISR — спека §3

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

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 pb-28 lg:pb-10">
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
