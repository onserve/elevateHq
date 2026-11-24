'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

interface Props {
  children: ReactNode;
  pendingLabel: string;
  className?: string;
}

/**
 * Submit button for the sign-in/sign-up server-action forms. The action does a
 * server round trip before redirecting to Keycloak, so the button disables
 * itself meanwhile to show progress and stop double submits.
 */
export function AuthSubmitButton({ children, pendingLabel, className = '' }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`disabled:opacity-60 disabled:cursor-wait ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
