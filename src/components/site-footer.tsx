import Link from "next/link";
import { Logo } from "@/components/logo";

const columns = [
  {
    heading: "Explore",
    links: [
      { href: "/guides", label: "Composting guides" },
      { href: "/products", label: "Shop kits & composters" },
      { href: "/blog", label: "Journal" },
    ],
  },
  {
    heading: "Community",
    links: [
      { href: "/community", label: "About the project" },
      { href: "/community#submit", label: "Share your setup" },
      { href: "/search", label: "Search" },
    ],
  },
  {
    heading: "Account",
    links: [
      { href: "/signup", label: "Create an account" },
      { href: "/login", label: "Log in" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-forest pt-16 pb-10 text-sand">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-0 right-0 h-10 bg-sand"
        style={{ borderBottomLeftRadius: "100% 100%", borderBottomRightRadius: "100% 100%" }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-sand/70">
              A design project turned practical platform — helping households across India start
              managing wet waste at home, one bin at a time.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-leaf">{col.heading}</h3>
              <ul className="mt-4 space-y-2 text-sm text-sand/80">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-sand">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-sand/10 pt-6 text-xs text-sand/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Ascend Sustainability. A UP Institute of Design project.</p>
          <p>Developed with Deendayal Research Institute, and industry partners across waste management.</p>
        </div>
      </div>
    </footer>
  );
}
