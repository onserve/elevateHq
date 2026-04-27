'use client';

import { ArrowUpCircle, ArrowDownCircle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/lib/api/service/finance-service';

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: (transactionId: string) => void;
  onDelete?: (transaction: Transaction) => void;
  isLoading?: boolean;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function TransactionCard({ transaction, onClick, onDelete, isLoading }: TransactionCardProps) {
  return (
    <div
      className={`group flex items-center justify-between p-5 border border-border rounded-xl bg-card shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${isLoading ? 'animate-pulse bg-accent/5 pointer-events-none' : ''}`}
      onClick={() => onClick?.(transaction.id)}
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
          {isLoading ? (
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

        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(transaction);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
}
