import { Search } from "lucide-react";

export function SearchForm({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/search" method="GET" className={compact ? "w-56" : "w-full max-w-xl"}>
      <label className="sr-only" htmlFor="q">
        Search guides, products and articles
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/40" />
        <input
          id="q"
          name="q"
          type="search"
          placeholder="Search guides, products, articles…"
          className="w-full rounded-full border border-forest/15 bg-white/70 py-2 pl-9 pr-3 text-sm text-forest placeholder:text-forest/40 outline-none focus:border-green"
        />
      </div>
    </form>
  );
}
