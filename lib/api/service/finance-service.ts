'use server';

import { PaginatedResponse, serverApi } from '@/lib/api/server-api-client';
import { UUID } from 'crypto';
import { revalidatePath } from 'next/cache';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TransactionType = 'INCOME' | 'EXPENSE';

export type TransactionCategory =
  | 'SALARY'
  | 'FREELANCE'
  | 'INVESTMENTS'
  | 'OTHER_INCOME'
  | 'HOUSING'
  | 'FOOD'
  | 'TRANSPORTATION'
  | 'UTILITIES'
  | 'ENTERTAINMENT'
  | 'HEALTH'
  | 'PROJECTS'
  | 'OTHER_EXPENSE';

export interface Transaction {
  id: UUID;
  title: string;
  description?: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: string;
  projectId?: string;
  projectName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionRequest {
  title: string;
  description?: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: string;
  projectId?: string;
  tags?: string[];
  recurring?: boolean;
  recurringPeriod?: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
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
  category?: TransactionCategory;
  title?: string;
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
    queryParams.append('sort', 'date,desc');
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
  const response = await serverApi.get<Transaction>(`/finance/${id}`);
  return response.data;
}

export async function createTransaction(input: TransactionRequest): Promise<Transaction> {
  const response = await serverApi.post<Transaction>('/finance', input);
  revalidatePath('/finance');
  return response.data;
}

export async function updateTransaction(
  id: string,
  input: TransactionRequest,
): Promise<Transaction> {
  const response = await serverApi.put<Transaction>(`/finance${id}`, input);
  revalidatePath('/finance');
  revalidatePath(`/finance/${id}`);
  return response.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await serverApi.delete(`/finance/${id}`);
  revalidatePath('/finance');
}

export async function getFinanceSummary(): Promise<FinanceSummary> {
  const response = await serverApi.get<FinanceSummary>('/finance/summary');
  return response.data;
}
