import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, listArticles } from "@/lib/repo";
import { Prose } from "@/components/prose";

export function generateStaticParams() {
  return listArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  return { title: article?.title ?? "Journal" };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <article>
      <header className="relative overflow-hidden bg-forest text-sand">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url('${article.coverImage}')` }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf">
            {new Date(article.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{article.title}</h1>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <Prose text={article.body} />
      </div>
    </article>
  );
}
