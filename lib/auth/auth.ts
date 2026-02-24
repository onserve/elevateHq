import NextAuth from "next-auth"
import authConfig from "./auth.config"


export const { auth, handlers, signIn, signOut } = NextAuth({
    session: { strategy: "jwt", maxAge: 15 * 24 * 60 * 60},
    ...authConfig,
})