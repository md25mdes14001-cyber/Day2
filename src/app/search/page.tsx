import type { Metadata } from "next";
import Link from "next/link";
import { search } from "@/lib/repo";
import { SearchForm } from "@/components/search-form";

export const metadata: Metadata = { title: "Search" };

const typeLabel: Record<string, string> = { guide: "Guide", product: "Product", article: "Journal" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const sp = await searchParams;
  const q = (Array.isArray(sp?.q) ? sp.q[0] : sp?.q) ?? "";
  const results = q ? search(q) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-forest">Search</h1>
      <div className="mt-6">
        <SearchForm />
      </div>

      {q && (
        <p className="mt-6 text-sm text-forest/60">
          {results.length} result{results.length === 1 ? "" : "s"} for “{q}”
        </p>
      )}

      <ul className="mt-6 space-y-4">
        {results.map((r) => (
          <li key={r.slug}>
            <Link href={r.slug} className="block rounded-xl border border-forest/10 bg-white p-4 transition hover:border-green">
              <span className="text-xs font-semibold uppercase tracking-wide text-olive">{typeLabel[r.type]}</span>
              <p className="mt-1 font-display text-lg font-semibold text-forest">{r.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-forest/60">{r.snippet}</p>
            </Link>
          </li>
        ))}
      </ul>

      {q && results.length === 0 && (
        <p className="mt-8 text-forest/60">
          Nothing matched “{q}” yet. Try a broader term, or browse{" "}
          <Link href="/guides" className="font-semibold text-green hover:underline">
            all guides
          </Link>
          .
        </p>
      )}
    </div>
  );
}
