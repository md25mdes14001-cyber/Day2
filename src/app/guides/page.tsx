import type { Metadata } from "next";
import { listGuides, type Tier } from "@/lib/repo";
import { GuideCard } from "@/components/cards";

export const metadata: Metadata = { title: "Composting Guides" };

const tiers: { value: Tier | "all"; label: string }[] = [
  { value: "all", label: "All levels" },
  { value: "newbie", label: "Newbie" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string | string[] }>;
}) {
  const sp = await searchParams;
  const activeTier = (Array.isArray(sp?.tier) ? sp.tier[0] : sp?.tier) as string | undefined;
  const guides = listGuides().filter((g) => !activeTier || activeTier === "all" || g.tierLevel === activeTier);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-olive">Guides</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-forest sm:text-4xl">
          Every composting method, explained
        </h1>
        <p className="mt-3 text-forest/65">
          From a first kitchen-counter bin to fermenting meat scraps with Bokashi — pick the method that
          matches your space, your effort budget, and your experience.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {tiers.map((t) => {
          const isActive = (t.value === "all" && !activeTier) || t.value === activeTier;
          const href = t.value === "all" ? "/guides" : `/guides?tier=${t.value}`;
          return (
            <a
              key={t.value}
              href={href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive ? "bg-green text-sand" : "bg-white text-forest/70 hover:bg-forest/5"
              }`}
            >
              {t.label}
            </a>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <GuideCard key={g.id} guide={g} />
        ))}
        {guides.length === 0 && <p className="text-forest/60">No guides at this level yet — check back soon.</p>}
      </div>
    </div>
  );
}
