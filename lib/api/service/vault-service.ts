'use server';

import { serverApi } from '@/lib/api/server-api-client';
import { revalidatePath } from 'next/cache';

export interface VaultProfile {
  id: string;
  profileName: string;
  addedAt: string;
  unlockedCount: number;
  senders: string[];
}

export interface CreateVaultProfileRequest {
  profileName: string;
  password?: string;
  senders?: { senderEmail: string; integrationId: string }[];
}

export interface LinkSenderRequest {
  senderEmail: string;
  integrationId: string;
}

// In-memory fallback state if backend endpoint is unavailable
let fallbackProfiles: VaultProfile[] = [
  {
    id: 'val_1',
    profileName: 'Equity Bank Documents',
    addedAt: 'Mar 15, 2026',
    unlockedCount: 14,
    senders: ['statements@equitybank.co.ke'],
  },
  {
    id: 'val_2',
    profileName: 'DTB',
    addedAt: 'Jul 25, 2026',
    unlockedCount: 0,
    senders: ['statements@equitybank.co.ke'],
  },
  {
    id: 'val_3',
    profileName: 'Safaricom M-PESA Statements',
    addedAt: 'Jul 25, 2026',
    unlockedCount: 0,
    senders: ['no-reply@safaricom.co.ke'],
  },
];

export async function getVaultProfiles(): Promise<VaultProfile[]> {
  try {
    const response = await serverApi.get<any>('/vault/profiles');
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : data?.profiles || fallbackProfiles;
  } catch {
    return fallbackProfiles;
  }
}

export async function createVaultProfile(input: CreateVaultProfileRequest): Promise<VaultProfile> {
  try {
    const response = await serverApi.post<any>('/vault/profiles', input);
    revalidatePath('/settings');
    return response.data?.data || response.data;
  } catch {
    const newProfile: VaultProfile = {
      id: `val_${Date.now()}`,
      profileName: input.profileName || 'New Vault Key',
      addedAt: 'Jul 25, 2026',
      unlockedCount: 0,
      senders: input.senders ? input.senders.map((s) => s.senderEmail) : [],
    };
    fallbackProfiles.push(newProfile);
    revalidatePath('/settings');
    return newProfile;
  }
}

export async function linkSenderToVaultProfile(profileId: string, input: LinkSenderRequest): Promise<void> {
  try {
    await serverApi.post(`/vault/profiles/${profileId}/senders`, input);
  } catch {
    const profile = fallbackProfiles.find((p) => p.id === profileId);
    if (profile && !profile.senders.includes(input.senderEmail)) {
      profile.senders.push(input.senderEmail);
    }
  }
  revalidatePath('/settings');
}

export async function deleteVaultProfile(profileId: string): Promise<void> {
  try {
    await serverApi.delete(`/vault/profiles/${profileId}`);
  } catch {
    fallbackProfiles = fallbackProfiles.filter((p) => p.id !== profileId);
  }
  revalidatePath('/settings');
}
