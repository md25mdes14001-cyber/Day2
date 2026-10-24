"use client";

import { useActionState, useEffect, useState } from "react";
import { X } from "lucide-react";
import { newsletterAction, type ActionState } from "@/app/actions";

const initialState: ActionState = { ok: false, message: "" };
const DISMISS_KEY = "ascend_newsletter_dismissed";

export function NewsletterModal() {
  const [visible, setVisible] = useState(false);
  const [state, formAction, pending] = useActionState(newsletterAction, initialState);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
    const timer = setTimeout(() => setVisible(true), 7000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (state.ok) {
      const timer = setTimeout(() => close(), 1800);
      return () => clearTimeout(timer);
    }
  }, [state.ok]);

  function close() {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-md rounded-2xl bg-sand p-7 shadow-xl animate-in fade-in zoom-in-95">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-forest/50 hover:bg-forest/5 hover:text-forest"
        >
          <X className="h-5 w-5" />
        </button>
        <p className="font-display text-xl font-semibold text-forest">Join the compost community</p>
        <p className="mt-2 text-sm text-forest/70">
          One email a month: new guides, seasonal composting tips, and a few honest lessons from people
          who&rsquo;ve been doing this longer than us.
        </p>
        {state.ok ? (
          <p className="mt-5 rounded-lg bg-green/10 px-4 py-3 text-sm font-medium text-green-dark">{state.message}</p>
        ) : (
          <form action={formAction} className="mt-5 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-full border border-forest/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-green"
            />
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-sand transition hover:bg-terracotta-dark disabled:opacity-60"
            >
              {pending ? "Joining…" : "Subscribe"}
            </button>
          </form>
        )}
        {!state.ok && state.message && <p className="mt-2 text-xs text-terracotta-dark">{state.message}</p>}
      </div>
    </div>
  );
}
