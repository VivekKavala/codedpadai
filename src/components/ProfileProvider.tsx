'use client';

// This is a new client component specifically for the profile page.
// Its only job is to provide the NextAuth session context.

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { Session } from 'next-auth';

interface ProfileProviderProps {
  children: React.ReactNode;
  session: Session | null; // We'll pass the session from the server layout
}

export default function ProfileProvider({
  children,
  session,
}: ProfileProviderProps) {
  // We pass the session we fetched on the server to initialize
  // the provider. This avoids a client-side fetch.
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
