import { Button } from '@/components/ui/button';

interface TransactionQuickSelectProps {
  onSelectAll: () => void;
  onSelectIncome: () => void;
  onSelectExpenses: () => void;
  onSelectProjectRelated: () => void;
}

/**
 * TransactionQuickSelect - Bulk selection buttons for filtering
 *
 * Quick select options:
 * - Select All: Toggle all transactions
 * - All Income: Select only income transactions
 * - All Expenses: Select only expense transactions
 * - Project-Related: Select only transactions with project tags
 */
export function TransactionQuickSelect({
  onSelectAll,
  onSelectIncome,
  onSelectExpenses,
  onSelectProjectRelated,
}: TransactionQuickSelectProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">Quick Select:</span>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="h-9"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectIncome}
            className="h-9 border-green-200 text-green-700 hover:bg-green-50"
          >
            All Income
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectExpenses}
            className="h-9 border-red-200 text-red-700 hover:bg-red-50"
          >
            All Expenses
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectProjectRelated}
            className="h-9"
          >
            Project-Related Only
          </Button>
        </div>
      </div>
    </div>
  );
}
