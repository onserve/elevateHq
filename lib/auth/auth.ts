import NextAuth from "next-auth"
import authConfig from "./auth.config"


export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 59 * 60 },
  pages: {
    signIn: '/dashboard',   
    signOut: '/', 
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
    // newUser: '/auth/new-user'
  },
  ...authConfig,
})