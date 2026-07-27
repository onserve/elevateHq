import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/server-api-client';
import { getErrorMessage } from '@/lib/hooks/use-api-error';
import {
  getVaultProfiles,
  createVaultProfile,
  linkSenderToVaultProfile,
  deleteVaultProfile,
  VaultProfile,
  CreateVaultProfileRequest,
  LinkSenderRequest,
} from '@/lib/api/service/vault-service';
import { toast } from 'sonner';

export function useVaultProfiles() {
  return useQuery({
    queryKey: ['vault-profiles'],
    queryFn: () => getVaultProfiles(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateVaultProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateVaultProfileRequest) => createVaultProfile(input),
    onSuccess: (newProfile) => {
      queryClient.invalidateQueries({ queryKey: ['vault-profiles'] });
      toast.success(`Vault key "${newProfile.profileName || 'Key'}" created.`);
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, 'Failed to create vault key.'));
    },
  });
}

export function useLinkSenderToVault() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ profileId, input }: { profileId: string; input: LinkSenderRequest }) =>
      linkSenderToVaultProfile(profileId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault-profiles'] });
      toast.success('Sender linked to vault profile successfully.');
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, 'Failed to link sender to vault key.'));
    },
  });
}

export function useDeleteVaultProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileId: string) => deleteVaultProfile(profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault-profiles'] });
      toast.success('Vault profile deleted.');
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, 'Failed to delete vault profile.'));
    },
  });
}
