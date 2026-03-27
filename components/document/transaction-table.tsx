'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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

interface TransactionTableProps {
  transactions: Transaction[];
  onToggleSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Transaction>) => void;
}

/**
 * TransactionTable - Interactive transaction list with inline editing
 *
 * Features:
 * - Select/deselect transactions
 * - Edit category and project assignment
 * - View confidence score with visual indicator
 * - Responsive table layout
 *
 * TODO: Connect to actual data:
 * - GET /api/projects - For project dropdown
 * - GET /api/categories - For category dropdown
 * - PUT /api/documents/:id/transactions/:txId - Update transaction
 */
export function TransactionTable({
  transactions,
  onToggleSelect,
  onUpdate,
}: TransactionTableProps) {
  const categories = ['Salary', 'Freelance', 'Materials', 'Services', 'Utilities', 'Other'];
  const projects = [
    { value: null, label: 'No project' },
    { value: 'Kitchen Renovation', label: 'Kitchen Renovation' },
    { value: 'Garden Landscaping', label: 'Garden Landscaping' },
    { value: 'Home Office Setup', label: 'Home Office Setup' },
  ];

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {confidence}%
        </Badge>
      );
    } else if (confidence >= 75) {
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
          {confidence}%
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
          <AlertCircle className="h-3 w-3 mr-1" />
          {confidence}%
        </Badge>
      );
    }
  };

  if (transactions.length === 0) {
    return (
      <Card className="border border-border bg-card">
        <CardContent className="py-20 text-center">
          <p className="text-muted-foreground mb-1">No transactions match your filters</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filter settings</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="w-12 px-6 py-4">
                <Checkbox
                  checked={transactions.every((t) => t.selected)}
                  onCheckedChange={() => {
                    /* Handled by parent */
                  }}
                />
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-foreground">
                TYPE
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-foreground">
                DATE
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-foreground">
                DESCRIPTION / VENDOR
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-foreground">
                CATEGORY
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-foreground">
                PROJECT / TAG
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-foreground">
                AMOUNT
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                {/* Checkbox */}
                <td className="px-6 py-4">
                  <Checkbox
                    checked={transaction.selected}
                    onCheckedChange={() => onToggleSelect(transaction.id)}
                  />
                </td>

                {/* Type + Confidence */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${transaction.type === 'INCOME' ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                    <span className="text-xs font-medium text-foreground">
                      {transaction.type === 'INCOME' ? '+' : '-'}
                    </span>
                    {getConfidenceBadge(transaction.confidence)}
                  </div>
                </td>

                {/* Date */}
                <td className="px-4 py-4">
                  <span className="text-foreground font-medium">{transaction.date}</span>
                </td>

                {/* Description */}
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.vendor}</p>
                  </div>
                </td>

                {/* Category Dropdown */}
                <td className="px-4 py-4">
                  <Select
                    value={transaction.category}
                    onValueChange={(value) =>
                      onUpdate(transaction.id, { category: value })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>

                {/* Project Dropdown */}
                <td className="px-4 py-4">
                  <Select
                    value={transaction.projectTag || 'null'}
                    onValueChange={(value) =>
                      onUpdate(transaction.id, {
                        projectTag: value === 'null' ? null : value,
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((proj) => (
                        <SelectItem
                          key={proj.value || 'null'}
                          value={proj.value || 'null'}
                        >
                          {proj.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>

                {/* Amount */}
                <td className="px-4 py-4 text-right">
                  <span
                    className={`font-semibold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {transaction.type === 'INCOME' ? '+' : ''}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(transaction.amount)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
