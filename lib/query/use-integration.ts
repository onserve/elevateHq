import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/server-api-client';
import { getErrorMessage } from '@/lib/hooks/use-api-error';
import {
  getDiscoveredSenders,
  getGoogleStatus,
  getGoogleAuthorizeUrl,
  syncSender,
} from '@/lib/api/service/integration-service';
import { toast } from 'sonner';

export function useGoogleStatus(enabled = true) {
  return useQuery({
    queryKey: ['google-integration-status'],
    queryFn: () => getGoogleStatus(),
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useDiscoveredSenders(integrationId?: string, enabled = true) {
  return useQuery({
    queryKey: ['integration', integrationId || 'google_primary', 'discovery'],
    queryFn: () => getDiscoveredSenders(integrationId),
    enabled: enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSyncSender(integrationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (senderEmail: string) => syncSender(integrationId, senderEmail),
    onSuccess: (_, senderEmail) => {
      queryClient.invalidateQueries({ queryKey: ['integration', integrationId] });
      toast.success(`Sync queued for ${senderEmail}`);
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, 'Failed to trigger sync for sender.'));
    },
  });
}

