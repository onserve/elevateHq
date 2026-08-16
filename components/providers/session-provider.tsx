// components/providers/session-provider.tsx
'use client';

import { Session } from 'next-auth';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

interface Props {
  session: Session | null | undefined;
  children: ReactNode;
}

export function SessionProvider({ session, children }: Props) {
  return <NextAuthSessionProvider session={session}>{children}</NextAuthSessionProvider>;
}
