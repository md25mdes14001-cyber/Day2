"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileNav({ links, loggedIn }: { links: { href: string; label: string }[]; loggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ml-auto md:hidden">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="rounded-full p-2 text-forest hover:bg-forest/5"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-forest/10 bg-sand px-4 py-4 shadow-sm">
          <nav className="flex flex-col gap-3 text-sm font-medium text-forest/80">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="hover:text-green">
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-3 border-t border-forest/10 pt-3">
              {loggedIn ? (
                <Link href="/api/auth/signout" className="hover:text-green">
                  Sign out
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="hover:text-green">
                    Log in
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="font-semibold text-green">
                    Join free
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
