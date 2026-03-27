import{ auth } from '@/lib/auth/auth';
import { NextResponse} from 'next/server';

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const publicPaths = ['/'];

  if (publicPaths.includes(pathname)) return NextResponse.next();

  // With JWT strategy, auth() sets req.auth to null when token is expired
  if (!req.auth) {
    console.log('[Proxy] No valid session, redirecting');
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
})

export const config = {
    matcher: [
        '/((?!$|api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}