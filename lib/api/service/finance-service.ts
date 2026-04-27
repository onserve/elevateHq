'use server';

import { PaginatedResponse, serverApi } from '@/lib/api/server-api-client';
import { UUID } from 'crypto';
import { revalidatePath } from 'next/cache';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TransactionType = 'INCOME' | 'EXPENSE';


export interface Transaction {
  id: UUID;
  description: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  account?: string;
  projectId?: string;
  projectName?: string;
  goalId?: string;
  goalName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionRequest {
  description: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  account?: string | null;
  projectId?: string | null;
  goalId?: string | null;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  totalBalance: number;
  savingsRate: number;
  incomeChangePercent: number;
  expenseChangePercent: number;
}

export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string | string[];
  type?: TransactionType;
  category?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  projectId?: string;
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getTransactions(
  params?: PageRequest,
): Promise<PaginatedResponse<Transaction>> {
  const queryParams = new URLSearchParams();

  if (params?.sort) {
    const sortArray = Array.isArray(params.sort) ? params.sort : [params.sort];
    sortArray.forEach((sortItem) => queryParams.append('sort', sortItem));
  } else {
    queryParams.append('sort', 'createdAt,desc');
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'sort' && value !== undefined && value !== null) {
        queryParams.set(key, value.toString());
      }
    });
  }

  const query = queryParams.toString();
  const endpoint = query ? `/finance?${query}` : '/finance';
  const response = await serverApi.get<PaginatedResponse<Transaction>>(endpoint);

  return response.data;
}

export async function getTransaction(id: string): Promise<Transaction> {
  const response = await serverApi.get<any>(`/finance/${id}`);
  return response.data?.data || response.data;
}

export async function createTransaction(input: TransactionRequest): Promise<Transaction> {
  const response = await serverApi.post<any>('/finance', input);
  revalidatePath('/finance');
  return response.data?.data || response.data;
}

export async function updateTransaction(
  id: string,
  input: TransactionRequest,
): Promise<Transaction> {
  const response = await serverApi.put<any>(`/finance/${id}`, input);
  revalidatePath('/finance');
  revalidatePath(`/finance/${id}`);
  return response.data?.data || response.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await serverApi.delete(`/finance/${id}`);
  revalidatePath('/finance');
}

export async function getFinanceSummary(): Promise<FinanceSummary> {
  const response = await serverApi.get<any>('/finance/summary');
  return response.data?.data || response.data;
}
