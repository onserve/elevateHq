/**
 * Ends the user's Keycloak SSO session from the server (back-channel logout).
 *
 * Auth.js signOut() only clears this app's own session cookie. Without this
 * call the Keycloak session keeps living in the browser, so the next "Sign in"
 * is approved silently and nobody can sign in as a different user.
 *
 * Keycloak's logout endpoint accepts the session's refresh token together with
 * the client credentials and terminates that session. No browser redirect, no
 * id_token_hint and no post-logout redirect URI are needed.
 *
 * A failure here must never block the local sign-out, so errors are logged
 * (without any token material) and swallowed.
 */
export async function endKeycloakSession(refreshToken: string): Promise<void> {
  const issuer = process.env.KEYCLOAK_ISSUER;
  const clientId = process.env.KEYCLOAK_CLIENT_ID;
  if (!issuer || !clientId) return;

  const body = new URLSearchParams({ client_id: clientId, refresh_token: refreshToken });
  if (process.env.KEYCLOAK_CLIENT_SECRET) {
    body.set('client_secret', process.env.KEYCLOAK_CLIENT_SECRET);
  }

  try {
    const res = await fetch(`${issuer}/protocol/openid-connect/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(5000),
    });

    // Keycloak answers 204 on success. 400 means the refresh token was already
    // expired or revoked, i.e. the session is effectively gone anyway.
    if (!res.ok) {
      console.warn(`[Auth] Keycloak session logout returned HTTP ${res.status}`);
    }
  } catch (error) {
    console.warn(
      '[Auth] Keycloak session logout failed:',
      error instanceof Error ? error.name : 'unknown error',
    );
  }
}
