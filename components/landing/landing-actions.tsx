'use client';

import { signIn } from 'next-auth/react';

interface BtnProps {
  className?: string;
  label?: string;
}

export function GetStartedButton({ className = '', label = 'Get started free' }: BtnProps) {
  return (
    <button
      onClick={() => signIn('keycloak', { redirectTo: '/dashboard' })}
      className={`inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold px-6 h-12 rounded-xl transition-all text-sm shadow-sm hover:shadow-emerald-200 hover:shadow-md ${className}`}
    >
      {label}
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </button>
  );
}

export function SignInLink({ className = '' }: BtnProps) {
  return (
    <button
      onClick={() => signIn('keycloak', { redirectTo: '/dashboard' })}
      className={`text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors ${className}`}
    >
      Sign in
    </button>
  );
}
