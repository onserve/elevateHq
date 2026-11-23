import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { signInAction, signInWithGoogleAction } from '@/lib/auth/actions';
import { signInErrorMessage } from '@/lib/auth/sign-in-errors';
import { AuthSubmitButton } from '@/components/auth/auth-submit-button';
import { GoogleIcon } from '@/components/auth/google-icon';

export const metadata: Metadata = {
  title: 'Sign in — ElevateHQ',
};

/**
 * Sign-in page.
 *
 * Google is the primary option: it sends `kc_idp_hint=google`, so Keycloak skips
 * its own login page and goes straight to Google. Email and password uses
 * Keycloak's login page (no hint).
 *
 * Auth.js redirects here with `?error=<code>` when a sign-in fails or is
 * cancelled, so the reason is shown above the options.
 */
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const session = await auth();
  if (session && !session.error) redirect('/dashboard');

  const errorMessage = signInErrorMessage((await searchParams).error);

  return (
    <main className="min-h-screen bg-white text-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Sign in to ElevateHQ</h1>
          <p className="text-sm text-slate-600">Your statements, read for you.</p>
        </div>

        {errorMessage && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <form action={signInWithGoogleAction}>
          <AuthSubmitButton
            pendingLabel="Redirecting to Google…"
            className="w-full inline-flex items-center justify-center gap-3 h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </AuthSubmitButton>
        </form>

        <div className="flex items-center gap-3 text-xs text-slate-400" aria-hidden="true">
          <span className="h-px flex-1 bg-slate-200" />
          or
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form action={signInAction}>
          <AuthSubmitButton
            pendingLabel="Redirecting…"
            className="w-full h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
          >
            Sign in with email and password
          </AuthSubmitButton>
        </form>

        <p className="text-center text-sm text-slate-600">
          New to ElevateHQ?{' '}
          <Link href="/sign-up" className="font-medium text-emerald-700 hover:text-emerald-800">
            Create an account
          </Link>
        </p>

        <p className="text-center text-sm">
          <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
