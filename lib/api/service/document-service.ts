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
  name: string;
  uploadDate: string;
  status: 'PROCESSING' | 'PROCESSED' | 'FAILED';
  transactionCount: number;
  confidenceScore: number;
  transactions?: Transaction[];
  totalIncome?: number;
  totalExpense?: number;
  netFlow?: number;
}

export async function uploadDocument(formData: FormData): Promise<DocumentRecord> {
  const response = await serverApi.post<DocumentRecord>('/documents/upload', formData);
  revalidatePath('/documents');
  return response.data;
}

export async function getRecentDocuments(): Promise<PaginatedResponse<DocumentRecord>> {
  const response = await serverApi.get<PaginatedResponse<DocumentRecord>>('/documents');
  return response.data;
}

export async function getDocumentDetails(id: string): Promise<DocumentRecord> {
  const response = await serverApi.get<DocumentRecord>(`/documents/${id}`);
  return response.data;
}
