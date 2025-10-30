// src/hooks/use-session.ts
'use client';

import { useEffect, useState } from 'react';

type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type Session = {
  user: User;
  expires: string;
} | null;

export function useSession() {
  const [session, setSession] = useState<Session>(null);
  const [status, setStatus] = useState<
    'loading' | 'authenticated' | 'unauthenticated'
  >('loading');

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          if (data && data.user) {
            setSession(data);
            setStatus('authenticated');
          } else {
            setSession(null);
            setStatus('unauthenticated');
          }
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setSession(null);
        setStatus('unauthenticated');
      }
    }

    fetchSession();
  }, []);

  return { session, status };
}

export function useUser() {
  const { session, status } = useSession();
  return {
    user: session?.user || null,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}
