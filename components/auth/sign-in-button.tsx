'use client';

import { signInAction } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';

export function SignInButton() {
  return (
    <form action={signInAction} className="contents">
      <Button type="submit" size="lg" className="text-lg px-8 py-3">
        Sign In Securely
      </Button>
    </form>
  );
}
