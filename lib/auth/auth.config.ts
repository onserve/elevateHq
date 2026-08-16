// auth.config.ts
import Keycloak from 'next-auth/providers/keycloak';
import type { NextAuthConfig } from 'next-auth';

/**
 * NextAuth Configuration
 *
 * Now using globally augmented types from types/next-auth.d.ts
 * No need for local ExtendedSession/ExtendedJWT types!
 */

/**
 * Decode a JWT payload without verifying the signature.
 * Uses native atob — no external dependency required.
 */
function decodeJwtPayload(token: string): Record<string, any> {
  const base64Payload = token.split('.')[1];
  const json = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(json);
}

const globalForAuth = globalThis as unknown as {
  refreshInFlight?: Map<string, Promise<any>>;
  recentRefreshes?: Map<string, { result: any; timestamp: number }>;
};

const refreshInFlight =
  globalForAuth.refreshInFlight ?? new Map<string, Promise<any>>();
const recentRefreshes =
  globalForAuth.recentRefreshes ?? new Map<string, { result: any; timestamp: number }>();

if (process.env.NODE_ENV !== 'production') {
  globalForAuth.refreshInFlight = refreshInFlight;
  globalForAuth.recentRefreshes = recentRefreshes;
}

function cleanupRecentRefreshes() {
  const now = Date.now();
  for (const [key, val] of recentRefreshes.entries()) {
    if (now - val.timestamp > 30000) {
      recentRefreshes.delete(key);
    }
  }
}

/**
 * Internal: performs the actual Keycloak token exchange.
 */
async function _doRefreshAccessToken(oldToken: any) {
  const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
  const params = new URLSearchParams();
  params.append('client_id', process.env.KEYCLOAK_CLIENT_ID!);
  if (process.env.KEYCLOAK_CLIENT_SECRET) {
    params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET);
  }
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', oldToken.refreshToken);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!res.ok) {
    // Read the error body for detailed diagnostics
    const errBody = await res.text().catch(() => '<unreadable>');
    throw new Error(`Refresh token request failed: ${res.status} — ${errBody}`);
  }

  const data = await res.json();
  const newAccessToken = data.access_token;
  const newRefreshToken = data.refresh_token ?? oldToken.refreshToken;
  // Fallback matches session maxAge (24 h) so the token never expires before the session.
  const expiresIn = data.expires_in ?? 24 * 60 * 60;
  const newExpiresAt = Math.floor(Date.now() / 1000) + expiresIn;

  // Re-derive roles from the refreshed access token so Keycloak role
  // changes propagate to the session without requiring a full re-login.
  let roles: string[] = oldToken.roles ?? [];
  try {
    const decoded = decodeJwtPayload(newAccessToken);
    const realmRoles = decoded.realm_access?.roles || [];
    const clientRoles =
      decoded.resource_access?.[process.env.KEYCLOAK_CLIENT_ID!]?.roles || [];
    roles = [...new Set([...realmRoles, ...clientRoles])];
  } catch (e) {
    console.warn('[Auth] Failed to decode refreshed access token for roles', e);
  }

  const refreshedTokenResult = {
    ...oldToken,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresAt: newExpiresAt,
    roles,
    error: undefined,
  };

  // Cache the result for this old refresh token so any concurrent client HTTP requests
  // carrying the old JWT cookie get the refreshed result instead of hitting Keycloak again.
  recentRefreshes.set(oldToken.refreshToken, {
    result: refreshedTokenResult,
    timestamp: Date.now(),
  });
  cleanupRecentRefreshes();

  return refreshedTokenResult;
}

/**
 * Refresh the Keycloak access token, deduplicating concurrent calls and serving
 * recent refreshes from cache.
 * Called automatically by the jwt() callback when the access token has expired.
 */
async function refreshAccessToken(oldToken: any) {
  const refreshToken = oldToken.refreshToken as string;

  if (!refreshToken) {
    console.warn('[Auth] No refresh token present, forcing re-auth');
    return { ...oldToken, error: 'RefreshAccessTokenError' as const };
  }

  // Check if this refresh token was already refreshed recently (within 30s)
  const recent = recentRefreshes.get(refreshToken);
  if (recent && Date.now() - recent.timestamp < 30000) {
    console.info('[Auth] Serving recently refreshed token from grace-period cache');
    return recent.result;
  }

  // If another concurrent request on the server is currently refreshing this token,
  // share the same promise — do NOT fire a second request to Keycloak.
  const existing = refreshInFlight.get(refreshToken);
  if (existing) {
    console.info('[Auth] Refresh already in-flight, awaiting shared promise');
    return existing;
  }

  const promise = _doRefreshAccessToken(oldToken)
    .catch((error) => {
      console.error('[Auth] Error refreshing access token', error);
      return { ...oldToken, error: 'RefreshAccessTokenError' as const };
    })
    .finally(() => {
      refreshInFlight.delete(refreshToken);
    });

  refreshInFlight.set(refreshToken, promise);
  return promise;
}

/**
 * Seconds before token expiry to proactively refresh.
 * Prevents a narrow window where an already-expired token is forwarded to APIs.
 */
const CLOCK_SKEW_BUFFER = 60;

export default {
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
      authorization: {
        params: {
          scope: 'openid email profile roles',
        },
      },
    }),
  ],
  callbacks: {
    /**
     * JWT Callback - Runs when JWT is created or updated
     *
     * This is where we:
     * 1. Extract tokens from Keycloak (access_token, refresh_token)
     * 2. Extract roles from Keycloak profile
     * 3. Add everything to the JWT
     */
    async jwt({ token, account, profile }) {
      // Initial sign in - account and profile are available
      if (account && profile) {
        const realmRoles = (profile as any).realm_access?.roles || [];
        const clientRoles =
          (profile as any).resource_access?.[process.env.KEYCLOAK_CLIENT_ID!]?.roles || [];
        const roles = [...new Set([...realmRoles, ...clientRoles])];

        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.id = profile.sub;
        token.email = profile.email;
        token.name = profile.name;
        token.roles = roles;
        token.error = undefined; // clear any previous error on fresh login
        return token;
      }

      // If token refresh already failed previously, do not attempt to refresh again
      if (token.error === 'RefreshAccessTokenError') {
        return token;
      }

      // Subsequent calls — check if the access token is about to expire or has expired
      const now = Math.floor(Date.now() / 1000);
      if (token.expiresAt && now >= token.expiresAt - CLOCK_SKEW_BUFFER) {
        console.info('[Auth] Access token expiring soon, attempting refresh');
        return refreshAccessToken(token as any);
      }

      return token;
    },

    /**
     * Session Callback - Runs when session is checked
     *
     * This transfers data from JWT to the session object
     * that's available in components via useSession() or auth()
     */
    async session({ session, token }) {
      // If the token refresh failed, propagate the error to the session
      // so the client can react (e.g. redirect to sign-in).
      if (token.error === 'RefreshAccessTokenError') {
        session.error = 'RefreshAccessTokenError';
        return session;
      }

      session.accessToken = token.accessToken;
      session.expiresAt = token.expiresAt;
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.roles = token.roles;

      return session;
    },

    /**
     * Authorized Callback - Runs on every request via middleware
     *
     * This handles:
     * 1. Public route access
     * 2. Authentication checks
     * 3. Role-based access control (RBAC)
     */
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      // Public routes - anyone can access
      const publicRoutes = ['/', '/about', '/auth/error', '/auth/signup'];
      if (publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
        return true;
      }

      // If the token refresh failed, force re-authentication
      if (auth?.error === 'RefreshAccessTokenError') {
        return false;
      }

      // Require authentication for all other routes
      if (!auth?.user) {
        return false; // Redirect to signin
      }

      // Role-based access control
      const protectedRoutes: Record<string, string[]> = {
        '/admin/settings': ['super-admin'],
        '/admin/users': ['admin', 'super-admin'],
        '/admin': ['admin', 'super-admin'],
        '/dashboard': ['user', 'admin', 'super-admin'],
      };

      // Sort routes by specificity (longest path first)
      const sortedRoutes = Object.entries(protectedRoutes).sort(([a], [b]) => b.length - a.length);

      // Check if user has required role for this route
      for (const [route, allowedRoles] of sortedRoutes) {
        if (pathname.startsWith(route)) {
          const userRoles = auth.user.roles ?? [];
          const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

          if (!hasAccess) {
            console.warn(
              `[Access Denied] User: ${auth.user.email}, ` +
              `Path: ${pathname}, ` +
              `User Roles: [${userRoles.join(', ')}], ` +
              `Required: [${allowedRoles.join(', ')}]`,
            );
          }

          return hasAccess;
        }
      }

      // Allow by default if authenticated
      return true;
    },
  },
} satisfies NextAuthConfig;