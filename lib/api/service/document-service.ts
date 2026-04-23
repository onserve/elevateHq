'use server';

import { serverApi, PaginatedResponse } from '@/lib/api/server-api-client';
import { revalidatePath } from 'next/cache';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  vendor?: string;
  category?: string;
  projectId?: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  confidenceScore: number;
  confidenceLabel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface DocumentRecord {
  id: string;
  filename: string;
  uploadedDate: string;
  status: 'PROCESSING' | 'ARCHIVED' | 'FAILED' | 'UPLOADED' | 'COMPLETED';
  extractedTransactions: number;
  selectedTransactions: number;
  source: string;
  confidenceScore: number;
  processingProgress?: number;
}


export async function uploadDocument(formData: FormData): Promise<DocumentRecord> {
  const response = await serverApi.post<any>('/documents/upload', formData);
  revalidatePath('/documents');
  return response.data?.data || response.data;
}

export async function getRecentDocuments(): Promise<DocumentRecord[]> {
  const response = await serverApi.get<any>('/documents');
  return response.data?.data || response.data;
}

export async function getDocumentDetails(id: string): Promise<DocumentRecord> {
  const response = await serverApi.get<any>(`/documents/${id}`);
  return response.data?.data || response.data;
}
