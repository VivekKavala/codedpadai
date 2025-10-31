import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

// Define the session max age
const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;
const SESSION_MAX_AGE = THIRTY_DAYS_IN_SECONDS;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'checkbox' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        const rememberMe = credentials.rememberMe === 'true';

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          return { ...user, rememberMe };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    // 4. Implement the JWT callback
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // On initial sign in (user object is present)
        token.id = user.id;
        // --- ADDED: Store name and email in token ---
        token.name = user.name;
        token.email = user.email;

        const userFromAuthorize = user as any;
        if (userFromAuthorize.rememberMe) {
          token.rememberMe = true;
        }
      }

      // --- THIS IS THE FIX ---
      // This block runs when the client calls `await update({ name: "..." })`
      if (trigger === 'update' && session?.name) {
        token.name = session.name;
      }
      // --- END FIX ---

      if (token.rememberMe) {
        token.exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
      }

      return token;
    },

    // 5. Update session callback to pass all user info
    async session({ token, session }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        // --- ADDED: Pass name and email from token to session ---
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/sign-in',
  },
});
