import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { signInWithGoogleAction, signUpAction } from '@/lib/auth/actions';
import { AuthSubmitButton } from '@/components/auth/auth-submit-button';
import { GoogleIcon } from '@/components/auth/google-icon';

export const metadata: Metadata = {
  title: 'Create your account — ElevateHQ',
};

/**
 * Sign-up page.
 *
 * Google uses the same action as sign-in: Keycloak's first-broker-login flow
 * creates the account the first time a Google user arrives. Email sends
 * `prompt=create`, which opens Keycloak's registration form directly.
 *
 * Failed or cancelled sign-ups are sent to /sign-in?error=… by Auth.js (it has
 * a single sign-in page), where the error message is shown.
 */
export default async function SignUpPage() {
  const session = await auth();
  if (session && !session.error) redirect('/dashboard');

  return (
    <main className="min-h-screen bg-white text-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Create your ElevateHQ account</h1>
          <p className="text-sm text-slate-600">Free to start. Your statements, read for you.</p>
        </div>

        <form action={signInWithGoogleAction}>
          <AuthSubmitButton
            pendingLabel="Redirecting to Google…"
            className="w-full inline-flex items-center justify-center gap-3 h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold transition-colors"
          >
            <GoogleIcon />
            Sign up with Google
          </AuthSubmitButton>
        </form>

        <div className="flex items-center gap-3 text-xs text-slate-400" aria-hidden="true">
          <span className="h-px flex-1 bg-slate-200" />
          or
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form action={signUpAction}>
          <AuthSubmitButton
            pendingLabel="Redirecting…"
            className="w-full h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
          >
            Sign up with email
          </AuthSubmitButton>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-medium text-emerald-700 hover:text-emerald-800">
            Sign in
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
