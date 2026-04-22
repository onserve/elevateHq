// components/providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/hooks/use-api-error';

interface Props {
  children: ReactNode;
}

export function QueryProvider({ children }: Props) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1, // was 2 — reduces silent delay before isError becomes true
            staleTime: 30_000,
          },
          mutations: {
            // Global safety net: fires only when a specific mutation's onError is missing.
            // Individual hooks that already define onError take full precedence.
            onError: (error: unknown) => {
              toast.error(getErrorMessage(error, 'An unexpected error occurred. Please try again.'));
            },
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

