import type { Metadata } from "next";
import { SubmissionForm } from "@/components/submission-form";

export const metadata: Metadata = { title: "Community" };

export default function CommunityPage() {
  return (
    <div>
      <section className="bg-forest py-20 text-sand">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf">About the project</p>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Ascend Sustainability</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sand/80">
            This project started as a wet-waste-management design study at UP Institute of Design,
            developed with the Deendayal Research Institute (DRI) and industry partners across
            composting infrastructure and waste management, including Envac, Keystone Green Tech,
            Garbage Clinic &amp; Infratech, and L&amp;T India. Those partnerships shaped the practical,
            technological and operational grounding behind every guide and kit on this site.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-forest/10 bg-white p-6">
            <h2 className="font-display text-xl font-semibold text-forest">What we set out to do</h2>
            <ul className="mt-4 space-y-3 text-sm text-forest/70">
              <li>Promote awareness and education on wet-waste management</li>
              <li>Give households practical, user-friendly segregation and composting solutions</li>
              <li>Foster community engagement through an online platform and local initiatives</li>
              <li>Improve the overall sustainability of household waste practices</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-forest/10 bg-white p-6">
            <h2 className="font-display text-xl font-semibold text-forest">What usually gets in the way</h2>
            <p className="mt-3 text-sm text-forest/70">
              Our research kept surfacing the same barriers: people assume the only benefit is
              financial, they&rsquo;ve rarely seen a neighbour do it, there&rsquo;s no social expectation around
              it, and the fear of doing it &ldquo;wrong&rdquo; — smell, mess, pests — stops people before they
              start. Every guide on this site is written to directly answer one of those concerns.
            </p>
          </div>
        </div>
      </section>

      <section id="submit" className="bg-sand-dark/60 py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-2xl font-semibold text-forest">Share your setup</h2>
          <p className="mt-2 text-center text-forest/65">
            Already composting? Tell us what you&rsquo;re doing and what you&rsquo;d tell someone just starting
            out — approved setups get featured here for others to learn from.
          </p>
          <div className="mt-8">
            <SubmissionForm />
          </div>
        </div>
      </section>
    </div>
  );
}
