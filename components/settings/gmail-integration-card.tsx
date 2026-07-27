'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, RotateCw, Search, ArrowRight, Pause, X, Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiscoveredSender } from '@/lib/api/service/integration-service';

export interface HarvestSourceItem {
  id: string;
  senderName: string;
  senderEmail: string;
  avatarLetter: string;
  documentsCount: number;
  keyName?: string;
  status: 'active' | 'syncing' | 'paused';
}

interface GmailIntegrationCardProps {
  isConnected: boolean;
  email: string;
  integrationId: string;
  senders: DiscoveredSender[];
  harvestSources: HarvestSourceItem[];
  senderKeyMap: Record<string, string>; // senderEmail -> keyName
  senderStatusMap: Record<string, 'setup' | 'syncing' | 'active'>; // senderEmail -> status
  onConnect: () => void;
  onDisconnect: () => void;
  onDiscoverStatements: () => void;
  onSetupSender: (sender: DiscoveredSender) => void;
  onSyncNow: () => void;
  discovering: boolean;
}

export function GmailIntegrationCard({
  isConnected,
  email,
  integrationId,
  senders,
  harvestSources,
  senderKeyMap,
  senderStatusMap,
  onConnect,
  onDisconnect,
  onDiscoverStatements,
  onSetupSender,
  onSyncNow,
  discovering,
}: GmailIntegrationCardProps) {
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnectClick = async () => {
    setConnecting(true);
    try {
      await onConnect();
    } catch {
      setConnecting(false);
    }
  };

  const handleTriggerSyncNow = () => {
    setSyncingAll(true);
    onSyncNow();
    setTimeout(() => setSyncingAll(false), 2000);
  };

  const handleConfirmSwitch = () => {
    setIsSwitchModalOpen(false);
    onDisconnect();
    setTimeout(() => {
      handleConnectClick();
    }, 300);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5 text-rose-600 dark:text-rose-400">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground tracking-tight">Gmail Integration</h2>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isConnected
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                {isConnected ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Auto-harvest financial statements from your inbox
            </p>
          </div>
        </div>
      </div>

      {!isConnected ? (
        /* Disconnected State / Connect OAuth Card */
        <div className="rounded-xl border border-border bg-muted/20 p-8 text-center space-y-4">
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Connect your Gmail account to enable automatic discovery and extraction of bank statements and financial PDFs.
          </p>
          <Button
            onClick={handleConnectClick}
            disabled={connecting}
            className="rounded-xl bg-foreground text-background hover:bg-foreground/90 font-semibold px-6 py-2.5 inline-flex items-center gap-2 shadow-sm"
          >
            {connecting ? (
              <Loader2 className="h-4 w-4 animate-spin text-background" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            {connecting ? 'Redirecting to Google...' : 'Continue with Google'}
          </Button>
        </div>

      ) : (
        /* Connected State Details */
        <div className="space-y-6">
          {/* Connected Email Box */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-foreground">{email}</p>
                <p className="text-xs text-muted-foreground">
                  Last synced: May 30, 2026 at 3:45 PM — <span className="text-emerald-600 dark:text-emerald-400 font-medium">3 new documents</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
              <button
                onClick={() => setIsSwitchModalOpen(true)}
                className="hover:text-foreground transition-colors py-1 px-2 rounded-md hover:bg-muted"
              >
                ⇄ Switch
              </button>
              <span className="text-border">|</span>
              <button
                onClick={onDisconnect}
                className="hover:text-destructive transition-colors py-1 px-2 rounded-md hover:bg-muted"
              >
                Disconnect
              </button>
            </div>
          </div>

          {/* Auto Sync & Status Bar */}
          <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">
                Automatic sync: <span className="font-normal text-muted-foreground">Every hour</span>
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Found 3 new statements — 2 processed, 1 need a password.
              </p>
            </div>

            <Button
              onClick={handleTriggerSyncNow}
              disabled={syncingAll}
              variant="outline"
              className="rounded-xl text-xs font-medium px-3.5 py-1.5 h-auto flex items-center gap-1.5 bg-background shadow-2xs"
            >
              <RotateCw className={`h-3.5 w-3.5 ${syncingAll ? 'animate-spin' : ''}`} />
              Sync Now
            </Button>
          </div>

          {/* Statement Senders Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Statement Senders</h3>
              <button
                onClick={onDiscoverStatements}
                disabled={discovering}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                {discovering ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Search className="h-3.5 w-3.5" />
                )}
                Re-scan
              </button>
            </div>

            <div className="space-y-2.5">
              {senders.map((sender) => {
                const status = senderStatusMap[sender.senderEmail] || 'setup';
                const keyName = senderKeyMap[sender.senderEmail];
                const avatarLetter = sender.senderName.charAt(0);

                return (
                  <div
                    key={sender.senderEmail}
                    className="rounded-xl border border-border bg-background p-3.5 flex flex-wrap items-center justify-between gap-3 hover:border-border/80 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted border border-border/80 flex items-center justify-center font-bold text-foreground text-sm shrink-0">
                        {avatarLetter}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{sender.senderName}</span>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border/60">
                            {sender.pdfCount} PDFs
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{sender.senderEmail}</p>
                        <p className="text-xs text-muted-foreground/80 italic">{sender.latestSubject}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {status === 'syncing' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Syncing…
                        </span>
                      ) : status === 'active' ? (
                        <div className="text-right space-y-0.5">
                          <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Active
                          </div>
                          {keyName && (
                            <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
                              <KeyRound className="h-3 w-3" />
                              {keyName}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Button
                          onClick={() => onSetupSender(sender)}
                          variant="outline"
                          className="rounded-xl text-xs font-semibold px-3.5 py-1.5 h-auto flex items-center gap-1 bg-background"
                        >
                          Set up
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Harvest Sources Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">Harvest Sources</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border/60">
                {harvestSources.length} active
              </span>
            </div>

            <div className="space-y-2">
              {harvestSources.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No active harvest sources linked yet.</p>
              ) : (
                harvestSources.map((source) => (
                  <div
                    key={source.id}
                    className="rounded-xl border border-border bg-background p-3.5 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-foreground text-sm">
                        {source.avatarLetter}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{source.senderName}</p>
                        <p className="text-xs text-muted-foreground">
                          {source.status === 'syncing' ? (
                            <span className="text-amber-600 dark:text-amber-400 font-medium inline-flex items-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" /> Syncing documents...
                            </span>
                          ) : (
                            `${source.documentsCount} documents harvested`
                          )}
                        </p>
                        {source.keyName && (
                          <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                            <KeyRound className="h-3 w-3" />
                            {source.keyName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground">
                      <button className="p-1.5 hover:text-foreground rounded-lg hover:bg-muted transition-colors">
                        <Pause className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 hover:text-destructive rounded-lg hover:bg-muted transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Switch Google Account Confirmation Dialog (Screenshot 1) */}
      {isSwitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl border border-border space-y-4 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center border border-border">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground">Switch Google account?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This will disconnect <span className="font-semibold text-foreground">{email}</span> and open Google sign-in for a new account. Sender settings will reset.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsSwitchModalOpen(false)}
                className="rounded-xl text-xs font-semibold px-4"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSwitch}
                className="rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-semibold px-4 flex items-center gap-1.5"
              >
                ⇄ Switch Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
