'use server';

import { signIn, signOut } from '@/lib/auth/auth';

/**
 * Server-side sign-in.
 *
 * Replaces `signIn()` from `next-auth/react`, which makes three sequential
 * round trips (/api/auth/providers, /api/auth/csrf, POST /api/auth/signin)
 * before the browser is redirected to Keycloak. Running it as a server action
 * does the same work in a single request.
 *
 * Takes no arguments on purpose: server actions are public POST endpoints, so
 * the redirect target is fixed here instead of being supplied by the caller.
 */
export async function signInAction() {
  await signIn('keycloak', { redirectTo: '/dashboard' });
}

/**
 * Server-side sign-out.
 *
 * Clears the app session cookie. The `events.signOut` hook in `auth.ts` also
 * ends the Keycloak session, so the next sign-in asks for credentials again.
 */
export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
