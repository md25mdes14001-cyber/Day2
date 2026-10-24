import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuide, listGuides } from "@/lib/repo";
import { Check, X } from "lucide-react";

export function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  return { title: guide?.title ?? "Guide" };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <article>
      <header className="relative overflow-hidden bg-forest text-sand">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url('${guide.heroImage}')` }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf">{guide.tierLevel} · {guide.method} composting</p>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{guide.title}</h1>
          <p className="mt-4 max-w-2xl text-sand/80">{guide.summary}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 px-4 py-14 sm:px-6 lg:px-8">
        <section>
          <h2 className="font-display text-2xl font-semibold text-forest">The process</h2>
          <ol className="mt-5 space-y-4">
            {guide.processSteps.map((step, i) => (
              <li key={i} className="flex gap-4 rounded-xl bg-white p-4 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green/10 text-sm font-semibold text-green-dark">
                  {i + 1}
                </span>
                <p className="text-sm text-forest/80">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-green/20 bg-green/5 p-5">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-green-dark">
              <Check className="h-5 w-5" /> Can go in
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-forest/75">
              {guide.canCompost.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-terracotta/20 bg-terracotta/5 p-5">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-terracotta-dark">
              <X className="h-5 w-5" /> Keep out
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-forest/75">
              {guide.cannotCompost.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-forest">8 reasons to start today</h2>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {guide.reasons.map((r) => (
              <li key={r} className="rounded-xl bg-olive/10 p-4 text-sm text-forest/80">
                {r}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-forest">Good to know</h2>
          <ul className="mt-4 space-y-2 text-sm text-forest/70">
            {guide.limitations.map((l) => (
              <li key={l}>• {l}</li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
