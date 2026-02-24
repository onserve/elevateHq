// types/next-auth.d.ts
import { DefaultSession } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

/**
 * Module augmentation for NextAuth
 *
 * This extends the built-in NextAuth types to include custom fields
 * like accessToken, roles, etc.
 *
 * Place this file in the root `types/` directory
 */

declare module 'next-auth' {
  /**
   * Extended Session interface
   * Adds accessToken and custom user fields
   */
  interface Session {
    accessToken?: string;
    expiresAt?: number;
    user: {
      id: string;
      roles?: string[];
    } & DefaultSession['user'];
  }

  /**
   * Extended User interface (optional)
   * Used when user object is returned from providers
   */
  interface User {
    id: string;
    roles?: string[];
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extended JWT interface
   * Adds tokens and custom fields to JWT payload
   */
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    id?: string | null | undefined;
    roles?: string[];
  }
}
