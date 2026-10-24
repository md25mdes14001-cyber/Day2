import type { Tier } from "@/lib/repo";

declare module "next-auth" {
  interface User {
    id: string;
    tier: Tier;
  }
  interface Session {
    user: {
      id: string;
      tier: Tier;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    tier: Tier;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    tier: Tier;
  }
}
