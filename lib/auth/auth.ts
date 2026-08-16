import NextAuth from "next-auth"
import authConfig from "./auth.config"


export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },

  pages: {
    signIn: '/',     // Redirect unauthenticated users to home page where sign in button is
    signOut: '/',
    error: '/auth/error',
  },
  ...authConfig,
})