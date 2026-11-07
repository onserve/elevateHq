import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { endKeycloakSession } from "./keycloak-logout"


export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },

  events: {
    // Auth.js signOut() only clears our own cookie; also end the Keycloak
    // session so the next sign-in doesn't silently reuse it.
    async signOut(message) {
      if ('token' in message && message.token?.refreshToken) {
        await endKeycloakSession(message.token.refreshToken);
      }
    },
  },

  pages: {
    signIn: '/',     // Redirect unauthenticated users to home page where sign in button is
    signOut: '/',
    error: '/auth/error',
  },
  ...authConfig,
})