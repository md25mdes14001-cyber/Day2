import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, listProducts } from "@/lib/repo";
import { EnquiryForm } from "@/components/enquiry-form";

export function generateStaticParams() {
  return listProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-forest/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt="" className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-olive">{product.category.replace("-", " ")}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-forest">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-forest">₹{product.priceInr.toLocaleString("en-IN")}</p>
          <p className="mt-4 text-forest/75">{product.description}</p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-base font-semibold text-forest">Features</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-forest/70">
                {product.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-forest">Benefits</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-forest/70">
                {product.benefits.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <EnquiryForm productId={product.id} productName={product.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
