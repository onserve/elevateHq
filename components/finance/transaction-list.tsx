'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  SlidersHorizontal,
  Loader2,
} from 'lucide-react';

import { useTransactions, useDeleteTransaction, useTransaction } from '@/lib/query/use-finance';
import type { Transaction, TransactionType } from '@/lib/api/service/finance-service';
import type { PaginatedResponse } from '@/lib/api/server-api-client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { TransactionForm } from './transaction-form';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TransactionListProps {
  initialData: PaginatedResponse<Transaction>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TransactionList({ initialData }: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | TransactionType>('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const { data } = useTransactions({ page: 0, size: 50 }, initialData);
  const deleteTransaction = useDeleteTransaction();

  // Fetch full transaction details when an edit is requested
  const { data: transactionDetails, isLoading: isTransactionLoading } = useTransaction(editingTransactionId ?? '');

  // Deferred dialog: open only once data arrives
  useEffect(() => {
    if (editingTransactionId && transactionDetails && !isTransactionLoading) {
      setIsFormOpen(true);
    }
  }, [editingTransactionId, transactionDetails, isTransactionLoading]);

  const allTransactions = data?.content || initialData?.content || [];

  // Derived summary stats from local data
  const totalIncome = allTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = allTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netCashFlow = totalIncome - totalExpenses;

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return allTransactions.filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.account?.toLowerCase().includes(query);

      const matchesType = typeFilter === 'ALL' || t.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [allTransactions, searchQuery, typeFilter]);

  function openCreate() {
    setEditingTransactionId(null);
    setIsFormOpen(true);
  }

  function openEdit(transactionId: string) {
    setEditingTransactionId(transactionId);
    // Dialog will open via useEffect once data is fetched
  }

  function handleDialogClose(open: boolean) {
    if (!open) {
      setIsFormOpen(false);
      setEditingTransactionId(null);
    }
  }

  return (
    <div className="space-y-8">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Income */}
        <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card shadow-sm">
          <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Total Income
            </p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalIncome)}
            </p>
          </div>
        </div>

        {/* Expenses */}
        <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card shadow-sm">
          <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-500/10 flex-shrink-0">
            <TrendingDown className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Total Expenses
            </p>
            <p className="text-xl font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
        </div>

        {/* Net */}
        <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card shadow-sm">
          <div
            className={`p-3 rounded-lg flex-shrink-0 ${
              netCashFlow >= 0
                ? 'bg-blue-100 dark:bg-blue-500/10'
                : 'bg-amber-100 dark:bg-amber-500/10'
            }`}
          >
            {netCashFlow >= 0 ? (
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            ) : (
              <Wallet className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Net Cash Flow
            </p>
            <p
              className={`text-xl font-bold ${
                netCashFlow >= 0
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {formatCurrency(netCashFlow)}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions…"
            className="pl-11 h-11 bg-muted/50 border-0 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as 'ALL' | TransactionType)}
        >
          <SelectTrigger className="h-11 w-40">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={openCreate} className="h-11 px-6 sm:ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Transaction List */}
      <div className="grid gap-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => {
            const isLoadingThis = editingTransactionId === transaction.id && isTransactionLoading;

            return (
            <div
              key={transaction.id}
              className={`group flex items-center justify-between p-5 border border-border rounded-xl bg-card shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-200 cursor-pointer ${isLoadingThis ? 'animate-pulse bg-accent/5 pointer-events-none' : ''}`}
              onClick={() => openEdit(transaction.id)}
            >
              {/* Icon */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div
                  className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
                    transaction.type === 'INCOME'
                      ? 'bg-emerald-100 dark:bg-emerald-500/10'
                      : 'bg-rose-100 dark:bg-rose-500/10'
                  }`}
                >
                  {isLoadingThis ? (
                    <Loader2 className={`h-5 w-5 animate-spin ${transaction.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} />
                  ) : transaction.type === 'INCOME' ? (
                    <ArrowUpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground line-clamp-1">{transaction.description}</h3>

                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm">
                    <span className="text-muted-foreground text-xs">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {transaction.category}
                    </span>

                    {transaction.account && (
                      <span className="text-muted-foreground text-xs">
                        {transaction.account}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount + Delete */}
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <span
                  className={`text-base font-bold ${
                    transaction.type === 'INCOME'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-foreground'
                  }`}
                >
                  {transaction.type === 'INCOME' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingTransaction(transaction);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            );
          })
        ) : (
          <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/20">
            <DollarSign className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground">No transactions found.</p>
            <Button variant="outline" className="mt-4" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add your first transaction
            </Button>
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTransactionId ? 'Edit Transaction' : 'Add Transaction'}
            </DialogTitle>
          </DialogHeader>

          <TransactionForm
            key={editingTransactionId ?? 'create'}
            transactionData={editingTransactionId ? transactionDetails : undefined}
            onCancel={() => handleDialogClose(false)}
            onSuccess={() => handleDialogClose(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingTransaction} onOpenChange={(open) => !open && setDeletingTransaction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-foreground">
            Are you sure you want to delete <span className="font-semibold text-destructive">{deletingTransaction?.description}</span>? This action cannot be undone.
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setDeletingTransaction(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deletingTransaction) {
                  deleteTransaction.mutate(deletingTransaction.id);
                  setDeletingTransaction(null);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
