import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/server-api-client';
import { getErrorMessage } from '@/lib/hooks/use-api-error';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getFinanceSummary,
  type Transaction,
  type TransactionRequest,
  type PageRequest,
} from '@/lib/api/service/finance-service';
import type { PaginatedResponse } from '@/lib/api/server-api-client';
import { toast } from 'sonner';

// ─── Query Keys ───────────────────────────────────────────────────────────────

const FINANCE_KEYS = {
  all: ['finance'] as const,
  transactions: (params?: PageRequest) => ['finance', 'transactions', params] as const,
  transaction: (id: string) => ['finance', 'transactions', id] as const,
  summary: () => ['finance', 'summary'] as const,
};

// ─── Read Hooks ───────────────────────────────────────────────────────────────

export function useTransactions(
  params?: PageRequest,
  initialData?: PaginatedResponse<Transaction>,
) {
  return useQuery({
    queryKey: FINANCE_KEYS.transactions(params),
    queryFn: () => getTransactions(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: FINANCE_KEYS.transaction(id),
    queryFn: () => getTransaction(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFinanceSummary() {
  return useQuery({
    queryKey: FINANCE_KEYS.summary(),
    queryFn: () => getFinanceSummary(),
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TransactionRequest) => createTransaction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
      toast.success('Transaction added successfully.');
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, 'Failed to add transaction.'));
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TransactionRequest }) =>
      updateTransaction(id, input),

    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: FINANCE_KEYS.all });

      const previousTransactions = queryClient.getQueryData<PaginatedResponse<Transaction>>(
        FINANCE_KEYS.transactions(),
      );

      queryClient.setQueryData(
        FINANCE_KEYS.transactions(),
        (old: PaginatedResponse<Transaction> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            content: old.content.map((tx) => (tx.id === id ? { ...tx, ...input } : tx)),
          };
        },
      );

      return { previousTransactions };
    },

    onError: (err: ApiError, _variables, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(FINANCE_KEYS.transactions(), context.previousTransactions);
      }
      toast.error(getErrorMessage(err, 'Failed to update transaction.'));
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.transaction(variables.id) });
    },

    onSuccess: () => {
      toast.success('Transaction updated.');
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
      toast.success('Transaction deleted.');
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, 'Failed to delete transaction.'));
    },
  });
}
