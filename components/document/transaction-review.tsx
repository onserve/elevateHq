'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransactionFilters } from './transaction-filters';
import { TransactionTable } from './transaction-table';
import { TransactionSummary } from './transaction-summary';
import { TransactionQuickSelect } from './transaction-quick-select';

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  description: string;
  vendor: string;
  confidence: number;
  category: string;
  projectTag: string | null;
  amount: number;
  selected: boolean;
}

interface Document {
  id: string;
  filename: string;
  account: string;
  period: { start: string; end: string };
  uploadedAt: string;
  confidence: number;
  summary: {
    income: number;
    expenses: number;
    netFlow: number;
  };
}

interface TransactionReviewProps {
  documentId: string;
  document: Document;
  transactions: Transaction[];
}

/**
 * TransactionReview - Transaction categorization and import interface
 *
 * Features:
 * - View extracted transactions
 * - Categorize transactions
 * - Assign to projects
 * - Filter and search transactions
 * - Bulk select operations
 * - Import selected transactions
 *
 * API Integration points:
 * - PUT /api/documents/:id/transactions - Update transaction assignments
 * - POST /api/documents/:id/import - Import selected transactions
 * - GET /api/projects - For project dropdown
 * - GET /api/categories - For category dropdown
 */
export function TransactionReview({
  documentId,
  document,
  transactions: initialTransactions,
}: TransactionReviewProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [filters, setFilters] = useState({
    type: 'ALL',
    category: 'ALL',
    confidence: 'ALL',
  });
  const [importing, setImporting] = useState(false);

  // Filter transactions based on active filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (filters.type !== 'ALL' && tx.type !== filters.type) return false;
      if (filters.category !== 'ALL' && tx.category !== filters.category) return false;
      if (filters.confidence !== 'ALL') {
        const confidenceLevel = parseInt(filters.confidence);
        if (tx.confidence < confidenceLevel) return false;
      }
      return true;
    });
  }, [transactions, filters]);

  // Count selected transactions
  const selectedCount = useMemo(
    () => transactions.filter((t) => t.selected).length,
    [transactions],
  );

  // Calculate totals from selected transactions
  const selectedSummary = useMemo(() => {
    const selected = transactions.filter((t) => t.selected);
    return {
      income: selected.filter((t) => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0),
      expenses: selected
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    };
  }, [transactions]);

  const handleSelectAll = () => {
    const allSelected = transactions.every((t) => t.selected);
    setTransactions(transactions.map((t) => ({ ...t, selected: !allSelected })));
  };

  const handleSelectType = (type: 'INCOME' | 'EXPENSE') => {
    setTransactions(transactions.map((t) => ({ ...t, selected: t.type === type })));
  };

  const handleSelectProjectRelated = () => {
    setTransactions(transactions.map((t) => ({ ...t, selected: t.projectTag !== null })));
  };

  const handleToggleTransaction = (id: string) => {
    setTransactions(transactions.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t)));
  };

  const handleUpdateTransaction = (
    id: string,
    updates: Partial<Transaction>,
  ) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      // TODO: Implement import
      // API Endpoint: POST /api/documents/:id/import
      // Body: { transactions: selectedTransactions }
      // Expected response: { success: true, imported: number }
      console.log('Importing transactions:', transactions.filter((t) => t.selected));
      // On success, show toast and redirect to finance or projects page
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <Link href="/documents" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Back to Documents
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Review & Categorize Transactions
          </h1>
          <p className="text-base text-muted-foreground">
            Select transactions to import and assign them to projects or categories
          </p>
        </div>
        <Button
          onClick={handleImport}
          disabled={selectedCount === 0 || importing}
          className="h-11 px-6 whitespace-nowrap"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {importing ? 'Importing...' : `Import ${selectedCount} Transactions`}
        </Button>
      </div>

      {/* Document Details & Summary */}
      <TransactionSummary document={document} selected={selectedCount} selectedSummary={selectedSummary} />

      {/* Quick Select & Filters */}
      <div className="space-y-4">
        <TransactionQuickSelect
          onSelectAll={handleSelectAll}
          onSelectIncome={() => handleSelectType('INCOME')}
          onSelectExpenses={() => handleSelectType('EXPENSE')}
          onSelectProjectRelated={handleSelectProjectRelated}
        />

        <TransactionFilters
          filters={filters}
          onChange={setFilters}
        />
      </div>

      {/* Transactions Table */}
      <TransactionTable
        transactions={filteredTransactions}
        onToggleSelect={handleToggleTransaction}
        onUpdate={handleUpdateTransaction}
      />
    </div>
  );
}
