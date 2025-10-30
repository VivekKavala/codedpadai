import React from 'react';
import { auth } from '@/lib/auth';
import ProfileProvider from '@/components/ProfileProvider';

// This is a new Server Component layout that will wrap
// src/app/profile/page.tsx.

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch the session on the server
  const session = await auth();

  // 2. Wrap the children (your profile page) in the new
  // ProfileProvider and pass the session to it.
  return <ProfileProvider session={session}>{children}</ProfileProvider>;
}
