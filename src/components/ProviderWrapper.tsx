'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// This is a new client component wrapper.
// We wrap our entire app in this to provide the NextAuth session
// context to all client components (like profile-client.tsx).

export default function Providers({ children }: { children: React.ReactNode }) {
  // SessionProvider is required for useSession() and update() to work.
  return <SessionProvider>{children}</SessionProvider>;
}
