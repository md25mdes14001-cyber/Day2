import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { NewsletterModal } from "@/components/newsletter-modal";
import { auth } from "@/lib/auth";

// Deliberately not using next/font/google here: it requires reaching
// fonts.googleapis.com at build time, which isn't available in every build
// environment (including this project's sandbox). The font stack below is
// defined in globals.css and falls back to clean system fonts everywhere.
// To use real Manrope/Fraunces, see README.md "Swapping in Google Fonts".

export const metadata: Metadata = {
  title: {
    default: "Ascend Sustainability — Home Composting & Wet Waste Management",
    template: "%s · Ascend Sustainability",
  },
  description:
    "Practical guides, DIY kits and a community for managing biodegradable waste at home — from your first bin to advanced composting methods.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-sand text-forest">
        <SiteNav user={session?.user ? { name: session.user.name ?? "Account" } : null} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <NewsletterModal />
      </body>
    </html>
  );
}
