import Link from "next/link";
import { listGuides, listProducts, listArticles } from "@/lib/repo";
import { PersonaCards } from "@/components/persona-cards";
import { GuideCard, ProductCard, ArticleCard } from "@/components/cards";

export default function HomePage() {
  const guides = listGuides().slice(0, 3);
  const products = listProducts().slice(0, 4);
  const articles = listArticles().slice(0, 3);

  const beliefs = [
    {
      title: "Small habits compound",
      body: "A single household composting consistently keeps a meaningful amount of waste out of landfill, every single year.",
    },
    {
      title: "Waste is a design problem",
      body: "Within the Gaia hypothesis lies the idea that our living systems are deeply interconnected — waste is simply a resource in the wrong place.",
    },
    {
      title: "Access beats willpower",
      body: "People don't compost less because they don't care — it's because the right bin, guide or habit was never within reach.",
    },
    {
      title: "Community makes it stick",
      body: "Seeing a neighbour do it, successfully, is more convincing than any amount of reading.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest text-sand">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/images/brand/hero.svg')" }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf">Ascend Sustainability</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            How can you help the planet — and yourself — by managing biodegradable waste at home?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-sand/80 sm:text-lg">
            Practical composting guides, DIY kits, and a community of people turning kitchen scraps into
            something useful, one household at a time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/guides"
              className="rounded-full bg-sand px-6 py-3 text-sm font-semibold text-forest transition hover:bg-white"
            >
              Learn how
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-sand/40 px-6 py-3 text-sm font-semibold text-sand transition hover:border-sand hover:bg-sand/10"
            >
              Shop composters
            </Link>
          </div>
        </div>
      </section>

      {/* Persona entry points */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold text-forest sm:text-3xl">Start your sustainable journey</h2>
          <p className="mt-2 text-forest/65">
            Tell us where you&rsquo;re starting from — we&rsquo;ll point you to guides built for your level.
          </p>
        </div>
        <div className="mt-10">
          <PersonaCards />
        </div>
      </section>

      {/* Products teaser */}
      <section className="bg-sand-dark/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-forest sm:text-3xl">Composters, kits & accessories</h2>
              <p className="mt-2 max-w-xl text-forest/65">
                The composting process relies on the right container for your waste and space — browse what fits yours.
              </p>
            </div>
            <Link href="/products" className="whitespace-nowrap text-sm font-semibold text-green hover:underline">
              Shop all products →
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Guides teaser */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-forest sm:text-3xl">Featured composting methods</h2>
            <p className="mt-2 max-w-xl text-forest/65">From a kitchen-counter bin to outdoor piles — find the method that fits your home.</p>
          </div>
          <Link href="/guides" className="whitespace-nowrap text-sm font-semibold text-green hover:underline">
            Browse all guides →
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <GuideCard key={g.id} guide={g} />
          ))}
        </div>
      </section>

      {/* Why it matters / goals */}
      <section className="bg-forest py-16 text-sand">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Why this project exists</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Awareness", v: "Promote awareness and education on wet-waste management." },
              { k: "Practical tools", v: "Give households user-friendly waste-segregation and composting solutions." },
              { k: "Community", v: "Foster engagement through an online platform people actually return to." },
              { k: "Impact", v: "Reduce the environmental cost of how India's households handle biodegradable waste." },
            ].map((item) => (
              <div key={item.k} className="rounded-2xl border border-sand/15 bg-sand/5 p-5">
                <p className="font-display text-lg font-semibold text-leaf">{item.k}</p>
                <p className="mt-2 text-sm text-sand/75">{item.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* We believe */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-2xl font-semibold text-forest sm:text-3xl">We believe…</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {beliefs.map((b) => (
            <div key={b.title} className="rounded-2xl bg-olive/10 p-5">
              <p className="font-display text-base font-semibold text-forest">{b.title}</p>
              <p className="mt-2 text-sm text-forest/70">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog teaser */}
      <section className="bg-forest py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold text-sand sm:text-3xl">From the Journal</h2>
            <Link href="/blog" className="whitespace-nowrap text-sm font-semibold text-leaf hover:underline">
              Read all articles →
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
