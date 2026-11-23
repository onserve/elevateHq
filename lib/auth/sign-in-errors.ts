/**
 * Messages for the `?error=` codes Auth.js appends when it sends the user back
 * to the sign-in page (errors of kind "signIn", e.g. the user cancelled at
 * Keycloak or Google, or the sign-in cookie expired mid-flow).
 *
 * The raw code from the URL is never rendered, only used as a lookup key, so a
 * crafted ?error= value can't inject text.
 */
const MESSAGES: Record<string, string> = {
  OAuthCallbackError: 'Sign-in was cancelled or did not finish. Please try again.',
  OAuthSignInError: 'We could not start sign-in. Please try again.',
  OAuthAccountNotLinked:
    'This email is already registered with a different sign-in method. Use the method you signed up with.',
  AccessDenied: 'Your account is not allowed to sign in. If you think this is a mistake, contact support.',
  MissingCSRF: 'Your sign-in session expired. Please try again.',
};

const FALLBACK = 'Something went wrong signing you in. Please try again.';

export function signInErrorMessage(error: string | string[] | undefined): string | null {
  if (!error) return null;
  const code = Array.isArray(error) ? error[0] : error;
  return Object.hasOwn(MESSAGES, code) ? MESSAGES[code] : FALLBACK;
}
