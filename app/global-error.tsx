'use client';

/**
 * Global root error boundary.
 *
 * This catches errors that occur in app/layout.tsx itself (e.g., a provider
 * crashing). It MUST include <html> and <body> tags because it replaces the
 * entire root layout — no sidebar or header can be shown here (Next.js constraint).
 *
 * This should be a last resort. Route-level error.tsx files handle all other cases.
 */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-8 max-w-md text-sm">
          A critical error occurred. Please reload the page.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium"
        >
          Reload
        </button>
      </body>
    </html>
  );
}
