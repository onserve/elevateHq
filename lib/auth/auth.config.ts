// auth.config.ts
import Keycloak from 'next-auth/providers/keycloak';
import type { NextAuthConfig } from 'next-auth';

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
        // Extract roles from Keycloak
        const realmRoles = (profile as any).realm_access?.roles || [];
        const clientRoles = (profile as any).resource_access?.[process.env.KEYCLOAK_CLIENT_ID!]?.roles || [];
        const roles = [...new Set([...realmRoles, ...clientRoles])];

        console.log('Extracted roles:', roles);

        // Add tokens and user data to JWT
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.id = profile.sub;
        token.email = profile.email;
        token.name = profile.name;
        token.roles = roles;
      }

      // Token is now augmented with our custom fields
      return token;
    },

    /**
     * Session Callback - Runs when session is checked
     *
     * This transfers data from JWT to the session object
     * that's available in components via useSession() or auth()
     */
    async session({ session, token }) {
      // Add custom fields from JWT to session
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
