"use server";

import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createUser,
  getUserByEmail,
  setUserTier,
  subscribeNewsletter,
  createSubmission,
  createEnquiry,
  type Tier,
} from "@/lib/repo";
import { signIn, auth } from "@/lib/auth";
import { CredentialsSignin } from "next-auth";

export type ActionState = { ok: boolean; message: string };

const tierSchema = z.enum(["newbie", "beginner", "intermediate", "expert"]);

// ---------- Onboarding quiz ----------
export async function setExperienceTier(tier: string) {
  const parsed = tierSchema.safeParse(tier);
  if (!parsed.success) return { ok: false, message: "Invalid selection." };

  const session = await auth();
  if (session?.user?.id) {
    setUserTier(session.user.id, parsed.data);
  }
  const jar = await cookies();
  jar.set("ascend_tier", parsed.data, { maxAge: 60 * 60 * 24 * 365, path: "/" });
  return { ok: true, message: "Preference saved." };
}

export async function getStoredTier(): Promise<Tier> {
  const session = await auth();
  if (session?.user?.tier) return session.user.tier;
  const jar = await cookies();
  const cookieTier = jar.get("ascend_tier")?.value;
  return (tierSchema.safeParse(cookieTier).success ? (cookieTier as Tier) : "newbie");
}

// ---------- Auth ----------
const signupSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  tier: tierSchema.default("newbie"),
});

export async function signupAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    tier: formData.get("tier") || "newbie",
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check your details." };
  }
  if (getUserByEmail(parsed.data.email)) {
    return { ok: false, message: "An account with that email already exists. Try logging in instead." };
  }
  await createUser(parsed.data.email, parsed.data.name, parsed.data.password, parsed.data.tier);
  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: "/",
  });
  return { ok: true, message: "Account created." };
}

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check your details." };
  }
  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/",
    });
  } catch (err: unknown) {
    if (err instanceof CredentialsSignin) {
      return { ok: false, message: "That email and password don't match." };
    }
    throw err;
  }
  return { ok: true, message: "Welcome back." };
}

// ---------- Newsletter ----------
const emailSchema = z.string().email();

export async function newsletterAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { ok: false, message: "Enter a valid email address." };
  subscribeNewsletter(parsed.data);
  return { ok: true, message: "You're subscribed — welcome aboard." };
}

// ---------- Community submission ----------
const submissionSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email address"),
  method: z.string().min(2, "Tell us which method you use"),
  tips: z.string().min(10, "Share a little more detail (10+ characters)"),
});

// /public is read-only at runtime on Vercel, so uploaded photos go to /tmp
// there instead and are served back out through /api/uploads/[filename].
const UPLOAD_DIR = process.env.VERCEL ? "/tmp/ascend-uploads" : path.join(process.cwd(), "public", "uploads");

export async function submissionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = submissionSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    method: formData.get("method"),
    tips: formData.get("tips"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  let photoPath: string | undefined;
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) {
      return { ok: false, message: "Photo must be under 5MB." };
    }
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
    photoPath = process.env.VERCEL ? `/api/uploads/${filename}` : `/uploads/${filename}`;
  }

  createSubmission({ ...parsed.data, photoPath });
  return { ok: true, message: "Thank you — your setup is in for review and may be featured on the Community page." };
}

// ---------- Product enquiry ----------
const enquirySchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email address"),
  message: z.string().min(5, "Add a short note about what you need"),
});

export async function enquiryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = enquirySchema.safeParse({
    productId: formData.get("productId"),
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check your details." };
  }
  createEnquiry(parsed.data);
  return { ok: true, message: "Got it — we'll get back to you by email shortly." };
}

export async function logoutAndRedirect() {
  redirect("/api/auth/signout");
}
