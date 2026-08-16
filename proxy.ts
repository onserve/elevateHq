import{ auth } from '@/lib/auth/auth';
import { NextResponse} from 'next/server';

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const publicPaths = ['/'];

  if (publicPaths.includes(pathname)) return NextResponse.next();

  // With JWT strategy, auth() sets req.auth to null when there is no session.
  // When the access token has expired our jwt()/session() callbacks set an error
  // field instead of returning null — check both conditions.
  if (!req.auth || req.auth.error === 'RefreshAccessTokenError') {
    console.log('[Proxy] No valid session or expired token, redirecting to /');
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
})

export const config = {
    matcher: [
        '/((?!$|api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}