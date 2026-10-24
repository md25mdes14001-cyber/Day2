"use client";

import { useActionState } from "react";
import { submissionAction, type ActionState } from "@/app/actions";

const initialState: ActionState = { ok: false, message: "" };

export function SubmissionForm() {
  const [state, formAction, pending] = useActionState(submissionAction, initialState);

  if (state.ok) {
    return (
      <div className="rounded-2xl bg-green/10 p-6 text-green-dark">
        <p className="font-display text-lg font-semibold">Thank you!</p>
        <p className="mt-1 text-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-forest/10 bg-white p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-forest/80">Your name</label>
          <input name="name" required className="mt-1 w-full rounded-lg border border-forest/15 px-3 py-2 text-sm outline-none focus:border-green" />
        </div>
        <div>
          <label className="text-sm font-medium text-forest/80">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-forest/15 px-3 py-2 text-sm outline-none focus:border-green" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-forest/80">Which method do you use?</label>
        <input
          name="method"
          required
          placeholder="e.g. Home composting, Bokashi, Outdoor pile…"
          className="mt-1 w-full rounded-lg border border-forest/15 px-3 py-2 text-sm outline-none focus:border-green"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-forest/80">Your tips, for someone just starting out</label>
        <textarea
          name="tips"
          required
          rows={4}
          className="mt-1 w-full rounded-lg border border-forest/15 px-3 py-2 text-sm outline-none focus:border-green"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-forest/80">A photo of your setup (optional, under 5MB)</label>
        <input name="photo" type="file" accept="image/*" className="mt-1 w-full text-sm" />
      </div>
      {!state.ok && state.message && <p className="text-sm text-terracotta-dark">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-sand transition hover:bg-terracotta-dark disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Share your setup"}
      </button>
    </form>
  );
}
