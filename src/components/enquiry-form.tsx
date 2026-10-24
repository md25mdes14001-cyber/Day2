"use client";

import { useActionState } from "react";
import { enquiryAction, type ActionState } from "@/app/actions";

const initialState: ActionState = { ok: false, message: "" };

export function EnquiryForm({ productId, productName }: { productId: string; productName: string }) {
  const [state, formAction, pending] = useActionState(enquiryAction, initialState);

  if (state.ok) {
    return <p className="rounded-xl bg-green/10 p-4 text-sm font-medium text-green-dark">{state.message}</p>;
  }

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-forest/10 bg-white p-5">
      <input type="hidden" name="productId" value={productId} />
      <p className="font-display text-base font-semibold text-forest">Enquire about {productName}</p>
      <input
        name="name"
        required
        placeholder="Your name"
        className="w-full rounded-lg border border-forest/15 px-3 py-2 text-sm outline-none focus:border-green"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Your email"
        className="w-full rounded-lg border border-forest/15 px-3 py-2 text-sm outline-none focus:border-green"
      />
      <textarea
        name="message"
        required
        rows={3}
        placeholder="Quantity, delivery city, or any questions"
        className="w-full rounded-lg border border-forest/15 px-3 py-2 text-sm outline-none focus:border-green"
      />
      {!state.ok && state.message && <p className="text-xs text-terracotta-dark">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-sand transition hover:bg-green-dark disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
