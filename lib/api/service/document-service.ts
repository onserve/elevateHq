'use server';

import { serverApi, PaginatedResponse } from '@/lib/api/server-api-client';
import { revalidatePath } from 'next/cache';

export interface ExtractedTransaction {
  id: string;
  txnDate: string;
  amount: number;
  direction: 'CREDIT' | 'DEBIT';
  description: string;
  selectedForFinance: string | null;
  parsingStatus: string;
  createdAt: string;
  category?: string | null;
  projectId?: string | null;
  goalId?: string | null;
}

export interface SelectedTransaction {
  extractedTransactionId: string;
  goalId: string | null;
  projectId: string | null;
  category: string | null;
}

export interface SelectTransactionsRequest {
  selectedTransactions: SelectedTransaction[];
}

export interface UnselectTransactionsRequest {
  extractedTransactionIds: string[];
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

export async function getRecentDocuments(params?: { page?: number; size?: number }): Promise<PaginatedResponse<DocumentRecord>> {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await serverApi.get<any>(`/documents${queryString}`);
  return response.data?.data || response.data;
}

export async function getDocumentDetails(id: string): Promise<DocumentRecord> {
  const response = await serverApi.get<any>(`/documents/${id}`);
  return response.data?.data || response.data;
}

export async function getExtractedTransactions(
  documentId: string,
  params?: { page?: number; size?: number; selected?: boolean }
): Promise<PaginatedResponse<ExtractedTransaction>> {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  if (params?.selected !== undefined) queryParams.append('selected', params.selected.toString());

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await serverApi.get<any>(`/documents/${documentId}/transactions${queryString}`);
  return response.data?.data || response.data;
}

export async function submitSelectedTransactions(documentId: string, request: SelectTransactionsRequest): Promise<void> {
  const response = await serverApi.post<any>('/documents/transactions/select', request);
  revalidatePath('/documents');
  revalidatePath(`/documents/${documentId}`);
  revalidatePath('/finance');
  return response.data?.data || response.data;
}

export async function unselectTransactions(documentId: string, request: UnselectTransactionsRequest): Promise<void> {
  const response = await serverApi.delete<any>('/documents/transactions/unselect', { data: request });
  revalidatePath('/documents');
  revalidatePath(`/documents/${documentId}`);
  revalidatePath('/finance');
  return response.data?.data || response.data;
}
