import type { NextAuthConfig } from "next-auth";

// Edge-safe (middleware) yapılandırma — Prisma/bcrypt içermez.
export const authConfig = {
  pages: {
    signIn: "/giris",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/yonetim");
      if (isOnAdmin) return isLoggedIn;
      return true;
    },
  },
} satisfies NextAuthConfig;
