import { Metadata } from 'next';
import { Suspense } from 'react';
import { SettingsView } from '@/components/settings/settings-view';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Integrations & Vault Settings | ElevateHQ',
  description: 'Manage Gmail statement discovery, automated document harvesting, and encrypted vault passwords.',
};

export default function SettingsPage() {
  return (
    <div className="min-h-full p-6 md:p-8 max-w-screen-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          INTEGRATIONS
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Integrations & Document Vault</h1>
        <p className="text-sm text-muted-foreground">
          Connect your inbox to automatically discover and unlock password-protected financial statements.
        </p>
      </div>

      {/* Settings Interactive Container wrapped in Suspense for useSearchParams */}
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <SettingsView />
      </Suspense>
    </div>
  );
}
