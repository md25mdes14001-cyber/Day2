"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction, type ActionState } from "@/app/actions";

const initialState: ActionState = { ok: false, message: "" };

const tiers = [
  { value: "newbie", label: "Newbie — just getting started" },
  { value: "beginner", label: "Beginner — know the basics" },
  { value: "intermediate", label: "Intermediate — composting regularly" },
  { value: "expert", label: "Expert — advanced methods" },
];

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, initialState);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">Create your account</h1>
      <p className="mt-2 text-forest/65">Join free — track guides, and share your own composting setup.</p>
      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-forest/80">Name</label>
          <input name="name" required className="mt-1 w-full rounded-lg border border-forest/15 px-3 py-2.5 text-sm outline-none focus:border-green" />
        </div>
        <div>
          <label className="text-sm font-medium text-forest/80">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-forest/15 px-3 py-2.5 text-sm outline-none focus:border-green" />
        </div>
        <div>
          <label className="text-sm font-medium text-forest/80">Password</label>
          <input name="password" type="password" required minLength={8} className="mt-1 w-full rounded-lg border border-forest/15 px-3 py-2.5 text-sm outline-none focus:border-green" />
          <p className="mt-1 text-xs text-forest/50">At least 8 characters.</p>
        </div>
        <div>
          <label className="text-sm font-medium text-forest/80">Where are you starting from?</label>
          <select name="tier" defaultValue="newbie" className="mt-1 w-full rounded-lg border border-forest/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-green">
            {tiers.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        {!state.ok && state.message && <p className="text-sm text-terracotta-dark">{state.message}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-sand transition hover:bg-green-dark disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-forest/65">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-green hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
