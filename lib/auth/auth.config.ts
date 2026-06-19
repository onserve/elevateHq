// auth.config.ts
import Keycloak from 'next-auth/providers/keycloak';
import type { NextAuthConfig } from 'next-auth';
import { decodeJwt } from 'jose';

/**
 * NextAuth Configuration
 *
 * Now using globally augmented types from types/next-auth.d.ts
 * No need for local ExtendedSession/ExtendedJWT types!
 */

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

        console.log('Extracted roles:', roles);

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

      // Subsequent calls — check if the access token has expired
      const now = Math.floor(Date.now() / 1000);
      if (token.expiresAt && now >= token.expiresAt) {
        // Try to refresh the access token using the refresh token
        console.info('[Auth] Access token expired, attempting refresh');

        async function refreshAccessToken(oldToken: any) {
          console.log("🚀 ~ refreshAccessToken ~ oldToken:", oldToken)
          try {
              const claims = JSON.parse(atob(oldToken.accessToken.split('.')[1]));
              console.log('claims.azp (authorized party):', claims.azp);
              console.log(
                'claims.resource_access keys:',
                Object.keys(claims.resource_access || {}),
              );
            const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
            const params = new URLSearchParams();
            params.append('client_id', process.env.KEYCLOAK_CLIENT_ID!);
            params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET!);
            params.append('grant_type', 'refresh_token');
            params.append('refresh_token', oldToken.refreshToken);

            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: params,
            });

            if (!res.ok) throw new Error(`Refresh token request failed: ${res.status}`);

            const data = await res.json();
            const newAccessToken = data.access_token;
            const newRefreshToken = data.refresh_token ?? oldToken.refreshToken;
            const expiresIn = data.expires_in ?? 60 * 60; // fallback
            const newExpiresAt = Math.floor(Date.now() / 1000) + expiresIn;

            // Try to decode roles from the refreshed access token
            let roles: string[] = oldToken.roles ?? [];
            try {
              const decoded = decodeJwt(newAccessToken);
              const realmRoles = (decoded as any).realm_access?.roles || [];
              const clientRoles =
                (decoded as any).resource_access?.[process.env.KEYCLOAK_CLIENT_ID!]?.roles || [];
              roles = [...new Set([...(realmRoles || []), ...(clientRoles || [])])];
            } catch (e) {
              console.warn('[Auth] Failed to decode refreshed access token for roles', e);
            }

            return {
              ...oldToken,
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
              expiresAt: newExpiresAt,
              roles,
              error: undefined,
            };
          } catch (error) {
            console.error('[Auth] Error refreshing access token', error);
            return { ...oldToken, error: 'RefreshAccessTokenError' as const };
          }
        }

        const refreshed = await refreshAccessToken(token as any);
        return refreshed;
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
      // If the underlying access token has expired, propagate the error
      // and do NOT put the expired token on the session.
      // The authorized() callback and proxy.ts will redirect to sign-in.
      if (token.error === 'AccessTokenExpired') {
        session.error = 'AccessTokenExpired';
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

      // If the access token has expired, force re-authentication
      if (auth?.error === 'AccessTokenExpired') {
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