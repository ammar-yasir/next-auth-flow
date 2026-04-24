// Example: Advanced Auth Configuration
// This file shows how to extend the basic authentication setup

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import LinkedIn from "next-auth/providers/linkedin";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// EXAMPLE 1: Add Rate Limiting
// import { Ratelimit } from "@upstash/ratelimit";
// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(5, "15 m"),
// });

// EXAMPLE 2: Add Email Notifications
// import { sendWelcomeEmail } from "@/lib/email";

// EXAMPLE 3: Add Analytics/Logging
// import { analytics } from "@/lib/analytics";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // EXAMPLE: Add custom user data mapping
      // profile: async (profile) => {
      //   return {
      //     ...profile,
      //     firstName: profile.given_name,
      //     lastName: profile.family_name,
      //   };
      // },
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    // EXAMPLE: Validate user before sign in
    async signIn({ user, account, profile, email, credentials }) {
      // EXAMPLE: Reject test@example.com
      // if (user.email?.includes("test@")) return false;

      // EXAMPLE: Only allow specific domains
      // const allowedDomains = ["company.com"];
      // const domain = user.email?.split("@")[1];
      // return allowedDomains.includes(domain || "");

      return true;
    },

    // EXAMPLE: Redirect based on role
    async redirect({ url, baseUrl }) {
      // EXAMPLE: Redirect admins to /admin
      // if (url.startsWith("/admin")) return url;
      // return baseUrl + "/dashboard";

      return url.startsWith(baseUrl) ? url : baseUrl;
    },

    // EXAMPLE: Add custom claims to JWT
    async jwt({ token, user, account, profile, isNewUser }) {
      // Store user ID
      if (user) {
        token.id = user.id;
        token.email = user.email;

        // EXAMPLE: Fetch additional user data
        // const dbUser = await prisma.user.findUnique({
        //   where: { id: user.id },
        //   select: { role: true, subscription: true }
        // });
        // token.role = dbUser?.role;
        // token.subscription = dbUser?.subscription;
      }

      return token;
    },

    // EXAMPLE: Add custom data to session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;

        // EXAMPLE: Add role to session
        // session.user.role = token.role;
        // session.user.subscription = token.subscription;
      }

      // EXAMPLE: Analytics tracking
      // await analytics.track("session_created", {
      //   userId: token.id,
      //   email: token.email,
      // });

      return session;
    },
  },

  // EXAMPLE: Custom events
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("User sign in:", user.email);

      // EXAMPLE: Send welcome email for new users
      // if (isNewUser) {
      //   await sendWelcomeEmail(user.email!);
      // }

      // EXAMPLE: Analytics
      // await analytics.track("sign_in", {
      //   userId: user.id,
      //   provider: account?.provider,
      //   isNewUser,
      // });

      // EXAMPLE: Rate limiting
      // const ip = request.ip;
      // const identifier = `${ip}::signin`;
      // await ratelimit.limit(identifier);
    },

    async signOut({ token }) {
      console.log("User sign out:", token.email);

      // EXAMPLE: Cleanup operations
      // await prisma.session.deleteMany({
      //   where: { userId: token.id as string }
      // });

      // EXAMPLE: Analytics
      // await analytics.track("sign_out", {
      //   userId: token.id,
      // });
    },

    async update({ user }) {
      console.log("Session updated");
    },
  },

  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 1 day
  },

  // JWT configuration
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  trustHost: true,

  // EXAMPLE: Add debug logging in development
  ...(process.env.NODE_ENV === "development" && {
    debug: true,
  }),
});

// EXAMPLE: Helper function to get session on server
export async function getSessionUser() {
  const session = await auth();
  return session?.user;
}

// EXAMPLE: Helper function to require authentication
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

// EXAMPLE: Role-based access control
export async function requireRole(requiredRole: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  // if (session.user.role !== requiredRole) {
  //   throw new Error("Forbidden");
  // }
  return session;
}
