'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { GmailIntegrationCard, HarvestSourceItem } from './gmail-integration-card';
import { VaultCard } from './vault-card';
import { VaultLinkModal } from './vault-link-modal';
import { useDiscoveredSenders, useSyncSender, useGoogleStatus } from '@/lib/query/use-integration';
import { DiscoveredSender, getGoogleAuthorizeUrl } from '@/lib/api/service/integration-service';
import { toast } from 'sonner';

export function SettingsView() {
  const searchParams = useSearchParams();

  // Google Integration Status Query
  const { data: googleStatus, refetch: refetchStatus } = useGoogleStatus();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('connected@gmail.com');
  const [integrationId, setIntegrationId] = useState<string>('google_primary');

  useEffect(() => {
    if (googleStatus === 'ACTIVE') {
      setIsConnected(true);
    }
  }, [googleStatus]);

  // Query Hook for Discovered Senders
  const {
    data: discoveryData,
    isLoading: discovering,
    refetch: refetchDiscovery,
  } = useDiscoveredSenders(integrationId, isConnected);

  const syncSenderMutation = useSyncSender(integrationId);

  const senders: DiscoveredSender[] = discoveryData?.senders || [];

  // Sender Status Map & Linked Keys
  const [senderStatusMap, setSenderStatusMap] = useState<Record<string, 'setup' | 'syncing' | 'active'>>({
    'statements@equitybank.co.ke': 'active',
    'no-reply@kcbgroup.com': 'setup',
    'no-reply@safaricom.co.ke': 'active',
  });

  const [senderKeyMap, setSenderKeyMap] = useState<Record<string, string>>({
    'statements@equitybank.co.ke': 'DTB',
    'no-reply@safaricom.co.ke': 'Safaricom M-PESA Statements',
  });

  // Harvest Sources List
  const [harvestSources, setHarvestSources] = useState<HarvestSourceItem[]>([
    {
      id: 'hs_1',
      senderName: 'Equity Bank Customer Care',
      senderEmail: 'statements@equitybank.co.ke',
      avatarLetter: 'E',
      documentsCount: 3,
      keyName: 'DTB',
      status: 'active',
    },
    {
      id: 'hs_2',
      senderName: 'Safaricom M-PESA',
      senderEmail: 'no-reply@safaricom.co.ke',
      avatarLetter: 'S',
      documentsCount: 3,
      keyName: 'Safaricom M-PESA Statements',
      status: 'active',
    },
  ]);

  // Vault Link Modal State
  const [selectedSenderForSetup, setSelectedSenderForSetup] = useState<DiscoveredSender | null>(null);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState<boolean>(false);

  // Phase 1: Handle OAuth Callback URL query params (/settings?integration=gmail&status=success)
  useEffect(() => {
    const integrationParam = searchParams.get('integration');
    const statusParam = searchParams.get('status');
    const messageParam = searchParams.get('message');

    if (integrationParam === 'gmail') {
      if (statusParam === 'success') {
        toast.success('Successfully connected to Gmail!');
        setIsConnected(true);
        refetchStatus();
        refetchDiscovery();
      } else if (statusParam === 'error') {
        toast.error(messageParam || 'Failed to connect Gmail integration');
      }
    }
  }, [searchParams, refetchStatus, refetchDiscovery]);

  // Phase 1: Gmail Connect action via backend OAuth URL
  const handleGmailConnect = async () => {
    try {
      const authUrl = await getGoogleAuthorizeUrl();
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        toast.error('Could not generate Google authorization URL.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to initiate Google authorization.');
    }
  };

  const handleGmailDisconnect = () => {
    setIsConnected(false);
    setIntegrationId('');
  };

  // Phase 2: Fetch / Discover Statements
  const handleDiscoverStatements = () => {
    refetchDiscovery();
  };


  // Phase 3: Open Vault Modal
  const handleOpenSetupModal = (sender: DiscoveredSender) => {
    setSelectedSenderForSetup(sender);
    setIsVaultModalOpen(true);
  };

  // Phase 4: Immediate Sync Trigger & Background job simulation
  const handleSuccessSync = async (senderEmail: string, keyName?: string) => {
    // 1. Immediately trigger sync mutation
    try {
      await syncSenderMutation.mutateAsync(senderEmail);
    } catch (err) {
      console.error('Failed sending sync request:', err);
    }

    // 2. Put sender into "syncing" state inline
    setSenderStatusMap((prev) => ({ ...prev, [senderEmail]: 'syncing' }));
    if (keyName) {
      setSenderKeyMap((prev) => ({ ...prev, [senderEmail]: keyName }));
    }

    const senderObj = senders.find((s) => s.senderEmail === senderEmail);
    const senderName = senderObj?.senderName || senderEmail;
    const avatarLetter = senderName.charAt(0);

    // Update harvest sources list to show syncing item
    setHarvestSources((prev) => {
      const exists = prev.some((h) => h.senderEmail === senderEmail);
      if (exists) {
        return prev.map((h) => (h.senderEmail === senderEmail ? { ...h, status: 'syncing', keyName } : h));
      }
      return [
        ...prev,
        {
          id: `hs_${Date.now()}`,
          senderName,
          senderEmail,
          avatarLetter,
          documentsCount: 0,
          keyName,
          status: 'syncing',
        },
      ];
    });

    // 3. Simulate background job finishing after 3s
    setTimeout(() => {
      setSenderStatusMap((prev) => ({ ...prev, [senderEmail]: 'active' }));
      setHarvestSources((prev) =>
        prev.map((h) =>
          h.senderEmail === senderEmail
            ? { ...h, status: 'active', documentsCount: 3 }
            : h
        )
      );
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Grid matching screenshots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Gmail Integration */}
        <GmailIntegrationCard
          isConnected={isConnected}
          email={email}
          integrationId={integrationId}
          senders={senders}
          harvestSources={harvestSources}
          senderKeyMap={senderKeyMap}
          senderStatusMap={senderStatusMap}
          onConnect={handleGmailConnect}
          onDisconnect={handleGmailDisconnect}
          onDiscoverStatements={handleDiscoverStatements}
          onSetupSender={handleOpenSetupModal}
          onSyncNow={handleDiscoverStatements}
          discovering={discovering}
        />

        {/* Right Column: Document Unlock Vault */}
        <VaultCard />
      </div>

      {/* Phase 3 Vault Linking Modal */}
      <VaultLinkModal
        sender={selectedSenderForSetup}
        integrationId={integrationId}
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        onSuccessSync={handleSuccessSync}
      />
    </div>
  );
}
