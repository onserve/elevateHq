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
  // No hint: Keycloak shows its own login page (email and password).
  await signIn('keycloak', { redirectTo: '/dashboard' });
}

/**
 * Google sign-in. `kc_idp_hint` names the Google identity provider alias in
 * Keycloak, so Keycloak skips its login page and redirects straight to Google.
 * If the alias doesn't exist in the realm, Keycloak ignores the hint and shows
 * its normal login page.
 */
export async function signInWithGoogleAction() {
  await signIn('keycloak', { redirectTo: '/dashboard' }, { kc_idp_hint: 'google' });
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
