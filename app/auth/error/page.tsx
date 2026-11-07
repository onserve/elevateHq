import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign-in problem — ElevateHQ',
};

// Messages are keyed by Auth.js error codes. The raw code from the URL is never
// rendered, only used as a lookup key, so a crafted ?error= value can't inject text.
const MESSAGES: Record<string, { title: string; body: string }> = {
  AccessDenied: {
    title: 'Access denied',
    body: 'Your account is not allowed to sign in. If you think this is a mistake, please contact support.',
  },
  Configuration: {
    title: 'Sign-in is temporarily unavailable',
    body: 'We could not reach the sign-in service. Please try again in a few minutes.',
  },
  Verification: {
    title: 'That link has expired',
    body: 'Please start the sign-in again.',
  },
};

const FALLBACK = {
  title: 'Something went wrong signing you in',
  body: 'Please try again. If it keeps happening, contact support.',
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error && Object.hasOwn(MESSAGES, error) ? MESSAGES[error] : FALLBACK;

  return (
    <main className="min-h-screen bg-white text-slate-900 flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold">{message.title}</h1>
        <p className="text-slate-600">{message.body}</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 h-12 rounded-xl transition-all text-sm"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
