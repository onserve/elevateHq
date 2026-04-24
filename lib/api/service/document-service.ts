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

export async function getExtractedTransactions(documentId: string): Promise<ExtractedTransaction[]> {
  const response = await serverApi.get<any>(`/documents/${documentId}/transactions`);
  return response.data?.data || response.data;
}

export async function submitSelectedTransactions(documentId: string, request: SelectTransactionsRequest): Promise<void> {
  const response = await serverApi.post<any>(`/documents/${documentId}/transactions/select`, request);
  revalidatePath('/documents'); //Might be problem revalidating different path unless redirect to the page 
  return response.data?.data || response.data;
}
