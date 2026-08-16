'use client';

import { useState } from 'react';
import { Lock, Plus, ShieldCheck, Edit2, Trash2, Loader2, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVaultProfiles, useCreateVaultProfile, useDeleteVaultProfile } from '@/lib/query/use-vault';

export function VaultCard() {
  const { data: profiles = [], isLoading } = useVaultProfiles();
  const createProfileMutation = useCreateVaultProfile();
  const deleteProfileMutation = useDeleteVaultProfile();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    try {
      await createProfileMutation.mutateAsync({
        profileName: newKeyName,
        password: newPassword,
      });
      setNewKeyName('');
      setNewPassword('');
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding key:', err);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border bg-muted/30 p-2.5 text-foreground">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">Document Unlock Vault</h2>
              <p className="text-xs text-muted-foreground">Store passwords for encrypted bank statements</p>
            </div>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-semibold px-3.5 py-2 flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Key
          </Button>
        </div>

        {/* Security guarantee notice banner */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="text-xs font-medium">
            Passwords are encrypted with <span className="font-bold">AES-256</span> and never stored in plaintext.
          </p>
        </div>

        {/* Vault Profile Keys List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-xs text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading vault keys...
            </div>
          ) : profiles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
              No vault keys added yet. Click "+ Add Key" to add passwords for encrypted PDFs.
            </div>
          ) : (
            profiles.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-background p-4 space-y-2 hover:border-border/80 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-foreground/80" />
                    <span className="text-sm font-bold text-foreground">{item.profileName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <button className="p-1 hover:text-foreground transition-colors rounded-md hover:bg-muted">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProfileMutation.mutate(item.id)}
                      className="p-1 hover:text-destructive transition-colors rounded-md hover:bg-muted"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Added {item.addedAt || 'Jul 25, 2026'} · Used to unlock {item.unlockedCount || 0} documents
                </p>

                {item.senders && item.senders.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.senders.map((sender, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border/60"
                      >
                        {sender.includes('equity') ? 'Equity Bank Customer Care' : sender.includes('safaricom') ? 'Safaricom M-PESA' : sender}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Key Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl border border-border space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Add Document Unlock Key</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Key Name / Bank Name
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Equity Bank Documents"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  required
                  className="text-sm bg-background"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  PDF Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="text-sm bg-background pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Encrypted with AES-256 — never stored in plaintext
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={createProfileMutation.isPending}
                  className="rounded-xl text-xs font-medium px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createProfileMutation.isPending}
                  className="rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-semibold px-4 flex items-center gap-2"
                >
                  {createProfileMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Save Vault Key'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
