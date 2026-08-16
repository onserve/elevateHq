'use client';

import { useState, useEffect } from 'react';
import { Lock, Plus, Eye, EyeOff, Shield, FileText, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVaultProfiles, useCreateVaultProfile, useLinkSenderToVault } from '@/lib/query/use-vault';
import { DiscoveredSender } from '@/lib/api/service/integration-service';

interface VaultLinkModalProps {
  sender: DiscoveredSender | null;
  integrationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccessSync: (senderEmail: string, keyName?: string) => Promise<void>;
}

export function VaultLinkModal({
  sender,
  integrationId,
  isOpen,
  onClose,
  onSuccessSync,
}: VaultLinkModalProps) {
  const { data: profiles = [], isLoading: loadingProfiles } = useVaultProfiles();
  const createVaultProfileMutation = useCreateVaultProfile();
  const linkSenderMutation = useLinkSenderToVault();

  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(true);
  const [keyOption, setKeyOption] = useState<'existing' | 'new'>('new');
  
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [newKeyName, setNewKeyName] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && sender) {
      if (profiles && profiles.length > 0) {
        setSelectedProfileId(profiles[0].id);
      }
      setNewKeyName(sender.senderName.replace(' Customer Care', ''));
    }
  }, [isOpen, sender, profiles]);

  if (!isOpen || !sender) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    let linkedKeyName: string | undefined = undefined;

    try {
      if (isPasswordProtected) {
        if (keyOption === 'existing') {
          const profile = profiles.find((p) => p.id === selectedProfileId);
          linkedKeyName = profile?.profileName ?? 'Linked Key';

          // Scenario A: link existing profile
          await linkSenderMutation.mutateAsync({
            profileId: selectedProfileId,
            input: { senderEmail: sender.senderEmail, integrationId },
          });
        } else {
          // Scenario B: create new profile & link
          linkedKeyName = newKeyName || 'New Vault Key';
          await createVaultProfileMutation.mutateAsync({
            profileName: linkedKeyName,
            password: newPassword,
            senders: [{ senderEmail: sender.senderEmail, integrationId }],
          });
        }
      }

      // Trigger immediate sync via callback
      await onSuccessSync(sender.senderEmail, linkedKeyName);
      onClose();
    } catch (err) {
      console.error('Failed linking vault or starting sync:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl border border-border space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Set up {sender.senderName}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {sender.pdfCount} PDFs found · {sender.senderEmail}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Latest statement preview banner */}
        <div className="rounded-xl border border-border bg-muted/40 p-4 flex items-center gap-3">
          <div className="rounded-lg bg-background p-2 border border-border text-muted-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Latest statement</p>
            <p className="text-sm font-semibold text-foreground">{sender.latestSubject}</p>
          </div>
        </div>

        {/* Question: Are these PDFs password-protected? */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">Are these PDFs password-protected?</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsPasswordProtected(true)}
              className={`flex items-center justify-center px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                isPasswordProtected
                  ? 'border-foreground bg-foreground/5 text-foreground shadow-sm'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted/50'
              }`}
            >
              Yes — link a vault key
            </button>
            <button
              type="button"
              onClick={() => setIsPasswordProtected(false)}
              className={`flex items-center justify-center px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                !isPasswordProtected
                  ? 'border-foreground bg-foreground/5 text-foreground shadow-sm'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted/50'
              }`}
            >
              No — open PDFs
            </button>
          </div>
        </div>

        {/* Password Protected Form Section */}
        {isPasswordProtected && (
          <div className="space-y-4">
            <Label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              VAULT KEY
            </Label>

            {/* Option A: Use existing key */}
            <div
              onClick={() => setKeyOption('existing')}
              className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                keyOption === 'existing'
                  ? 'border-foreground/40 bg-card shadow-sm ring-1 ring-foreground/20'
                  : 'border-border bg-muted/20 hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="keyOption"
                  checked={keyOption === 'existing'}
                  onChange={() => setKeyOption('existing')}
                  className="accent-foreground h-4 w-4"
                />
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Use an existing key</span>
              </div>

              {keyOption === 'existing' && (
                <div className="mt-3 ml-7">
                  {loadingProfiles ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading vault profiles...
                    </div>
                  ) : profiles.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No existing keys found. Please create a new key below.</p>
                  ) : (
                    <select
                      value={selectedProfileId}
                      onChange={(e) => setSelectedProfileId(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                    >
                      {profiles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.profileName} ({p.unlockedCount} docs unlocked)
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>

            {/* Option B: Create new key */}
            <div
              onClick={() => setKeyOption('new')}
              className={`rounded-xl border p-3.5 cursor-pointer transition-all space-y-3 ${
                keyOption === 'new'
                  ? 'border-foreground/40 bg-card shadow-sm ring-1 ring-foreground/20'
                  : 'border-border bg-muted/20 hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="keyOption"
                  checked={keyOption === 'new'}
                  onChange={() => setKeyOption('new')}
                  className="accent-foreground h-4 w-4"
                />
                <Plus className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Create a new key</span>
              </div>

              {keyOption === 'new' && (
                <div className="ml-7 space-y-3 pt-1" onClick={(e) => e.stopPropagation()}>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Key name
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g. DTB or Bank Profile"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="bg-background text-sm"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                      PDF password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-background text-sm pr-10"
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
                </div>
              )}
            </div>
          </div>
        )}

        {/* Query Info Box */}
        <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 flex items-start gap-2.5">
          <Shield className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            The backend queries Gmail as{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
              from:{sender.senderEmail} has:attachment filename:pdf
            </code>{' '}
            and downloads only the 3 most recent PDFs.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl text-sm font-medium px-4"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-foreground text-background hover:bg-foreground/90 text-sm font-medium px-5 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Linking...
              </>
            ) : (
              'Link Key & Sync'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
