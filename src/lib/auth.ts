import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword, getUserById } from "@/lib/repo";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;
        const user = await verifyPassword(email, password);
        if (!user) return null;
        return { id: user.id, email: user.email, name: user.name, tier: user.experienceTier };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.tier = user.tier;
      } else if (token.id) {
        // Keep the tier fresh if it changed elsewhere in the same session
        const fresh = getUserById(token.id);
        if (fresh) token.tier = fresh.experienceTier;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id;
      session.user.tier = token.tier;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET ?? "dev-only-insecure-secret-change-me",
  trustHost: true,
});
