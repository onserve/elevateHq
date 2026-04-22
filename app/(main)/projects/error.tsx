'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
export default function ProjectsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('[Projects Error]', error); }, [error]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="p-4 bg-destructive/10 rounded-full mb-6"><AlertTriangle className="h-10 w-10 text-destructive" /></div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Failed to load projects</h2>
      <p className="text-muted-foreground max-w-md mb-8 text-sm">{error.message || "We couldn't load your projects. Please try again."}</p>
      <Button onClick={() => reset()} className="gap-2"><RefreshCw className="h-4 w-4" />Try Again</Button>
    </div>
  );
}
