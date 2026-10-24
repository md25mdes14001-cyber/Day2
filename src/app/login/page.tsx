"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionState } from "@/app/actions";

const initialState: ActionState = { ok: false, message: "" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">Welcome back</h1>
      <p className="mt-2 text-forest/65">Log in to pick up where you left off.</p>
      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-forest/80">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-forest/15 px-3 py-2.5 text-sm outline-none focus:border-green" />
        </div>
        <div>
          <label className="text-sm font-medium text-forest/80">Password</label>
          <input name="password" type="password" required className="mt-1 w-full rounded-lg border border-forest/15 px-3 py-2.5 text-sm outline-none focus:border-green" />
        </div>
        {!state.ok && state.message && <p className="text-sm text-terracotta-dark">{state.message}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-sand transition hover:bg-green-dark disabled:opacity-60"
        >
          {pending ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-sm text-forest/65">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-green hover:underline">
          Create a free account
        </Link>
      </p>
    </div>
  );
}
