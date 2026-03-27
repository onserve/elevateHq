import NextAuth from "next-auth"
import authConfig from "./auth.config"


export const { auth, handlers, signIn, signOut } = NextAuth({
    session: { strategy: "jwt", maxAge: 29 * 60},
  pages: {
    signIn: '/',
    signOut: '/dashboard'
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
    // newUser: '/auth/new-user'
  },
    ...authConfig,
})