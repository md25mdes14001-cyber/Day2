import Link from "next/link";
import { Logo } from "@/components/logo";
import { SearchForm } from "@/components/search-form";
import { MobileNav } from "@/components/mobile-nav";

const links = [
  { href: "/guides", label: "Guides" },
  { href: "/products", label: "Shop" },
  { href: "/blog", label: "Journal" },
  { href: "/community", label: "Community" },
];

export function SiteNav({ user }: { user: { name: string } | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-sand/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Logo mark="dark" />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-forest/80 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-green">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-4 md:flex">
          <SearchForm compact />
          {user ? (
            <Link
              href="/api/auth/signout"
              className="rounded-full border border-forest/15 px-4 py-2 text-sm font-medium text-forest transition hover:border-green hover:text-green"
            >
              Sign out
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-forest/80 hover:text-green">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-green px-4 py-2 text-sm font-semibold text-sand transition hover:bg-green-dark"
              >
                Join free
              </Link>
            </>
          )}
        </div>
        <MobileNav links={links} loggedIn={!!user} />
      </div>
    </header>
  );
}
