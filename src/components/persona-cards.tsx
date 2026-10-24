import { setExperienceTier } from "@/app/actions";
import { redirect } from "next/navigation";

const personas = [
  {
    tier: "newbie",
    title: "New to composting?",
    body: "Start here — the simplest bin you can run from a kitchen counter.",
  },
  {
    tier: "beginner",
    title: "Ready to pick a composter?",
    body: "Compare drum, outdoor and pipe systems for your space.",
  },
  {
    tier: "intermediate",
    title: "Want to go further?",
    body: "Leaf composting, troubleshooting, and getting more from your pile.",
  },
  {
    tier: "expert",
    title: "Composting like a pro?",
    body: "Bokashi fermentation, and sharing what you've learned with others.",
  },
] as const;

async function choose(formData: FormData) {
  "use server";
  const tier = formData.get("tier") as string;
  await setExperienceTier(tier);
  redirect(`/guides?tier=${tier}`);
}

export function PersonaCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {personas.map((p) => (
        <form action={choose} key={p.tier}>
          <input type="hidden" name="tier" value={p.tier} />
          <button
            type="submit"
            className="group flex h-full w-full flex-col items-start rounded-2xl border border-forest/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-green hover:shadow-md"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green/10 text-sm font-semibold text-green-dark">
              {p.tier === "newbie" ? "1" : p.tier === "beginner" ? "2" : p.tier === "intermediate" ? "3" : "4"}
            </span>
            <p className="mt-4 font-display text-lg font-semibold text-forest">{p.title}</p>
            <p className="mt-1 text-sm text-forest/65">{p.body}</p>
            <span className="mt-4 text-sm font-semibold text-green group-hover:underline">Start here →</span>
          </button>
        </form>
      ))}
    </div>
  );
}
