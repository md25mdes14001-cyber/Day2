import type { Metadata } from "next";
import { listArticles } from "@/lib/repo";
import { ArticleCard } from "@/components/cards";

export const metadata: Metadata = { title: "Journal" };

export default function BlogPage() {
  const articles = listArticles();
  return (
    <div className="bg-forest py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf">Journal</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-sand sm:text-4xl">Notes on waste, composting, and doing it anyway</h1>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
