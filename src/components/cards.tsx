import Link from "next/link";
import type { Guide, Product, Article } from "@/lib/repo";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-forest/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={guide.heroImage}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-olive">{guide.tierLevel}</span>
        <p className="mt-1 font-display text-lg font-semibold text-forest">{guide.title}</p>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-forest/65">{guide.summary}</p>
        <span className="mt-4 text-sm font-semibold text-green">Read the guide →</span>
      </div>
    </Link>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-square w-full overflow-hidden bg-forest/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-base font-semibold text-forest">{product.name}</p>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-forest/65">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold text-forest">₹{product.priceInr.toLocaleString("en-IN")}</span>
          <span className="text-sm font-semibold text-green">View →</span>
        </div>
      </div>
    </Link>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-sand/15 bg-forest/40 shadow-sm transition hover:-translate-y-0.5 hover:bg-forest/50"
    >
      <div className="aspect-[16/10] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.coverImage}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-base font-semibold text-sand">{article.title}</p>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-sand/70">{article.excerpt}</p>
        <span className="mt-4 text-sm font-semibold text-leaf">Read more →</span>
      </div>
    </Link>
  );
}
