'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function SignInButton() {
  return (
    <Button
      size="lg"
      onClick={() => signIn('keycloak', { redirectTo: '/dashboard' })}
      className="text-lg px-8 py-3"
    >
      Sign In Securely
    </Button>
  );
}
