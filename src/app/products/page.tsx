import type { Metadata } from "next";
import { listProducts, type Product } from "@/lib/repo";
import { ProductCard } from "@/components/cards";

export const metadata: Metadata = { title: "Shop" };

const categories: { value: Product["category"] | "all"; label: string }[] = [
  { value: "all", label: "All products" },
  { value: "composters", label: "Composters" },
  { value: "accessories", label: "Accessories" },
  { value: "diy-kits", label: "DIY waste kits" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const sp = await searchParams;
  const activeRaw = (Array.isArray(sp?.category) ? sp.category[0] : sp?.category) ?? "";
  const validCategories: Product["category"][] = ["composters", "accessories", "diy-kits"];
  const active = validCategories.find((c) => c === activeRaw);
  const products = listProducts(active);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-olive">Shop</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-forest sm:text-4xl">Composters, kits & accessories</h1>
        <p className="mt-3 text-forest/65">
          Browse the catalogue and send an enquiry on anything you&rsquo;d like — we&rsquo;ll get back to you with
          availability and delivery details by email.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => {
          const isActive = (c.value === "all" && !active) || c.value === active;
          const href = c.value === "all" ? "/products" : `/products?category=${c.value}`;
          return (
            <a
              key={c.value}
              href={href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive ? "bg-green text-sand" : "bg-white text-forest/70 hover:bg-forest/5"
              }`}
            >
              {c.label}
            </a>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
