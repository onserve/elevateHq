'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function TasksError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an external service if needed
    console.error('Task Page Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center border-2 border-dashed rounded-xl">
      <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
      <h2 className="text-xl font-semibold">Something went wrong!</h2>
      <p className="text-muted-foreground mt-2 mb-6">
        {error.message || "We couldn't load your tasks. Please try again."}
      </p>
      <Button onClick={() => reset()}>Try Again</Button>
    </div>
  );
}
