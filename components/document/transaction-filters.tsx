import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TransactionFiltersProps {
  filters: {
    type: string;
    category: string;
    confidence: string;
  };
  onChange: (filters: { type: string; category: string; confidence: string }) => void;
}

/**
 * TransactionFilters - Dropdown filters for transaction table
 *
 * Available filters:
 * - Type: Income, Expenses, All
 * - Category: Based on extracted categories
 * - Confidence: Filter by AI confidence level
 *
 * TODO: Connect to actual data
 * - GET /api/categories - For category dropdown options
 * - GET /api/transactions/types - For type options (if dynamic)
 */
export function TransactionFilters({
  filters,
  onChange,
}: TransactionFiltersProps) {
  const categories = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'Salary', label: 'Salary' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Materials', label: 'Materials' },
    { value: 'Services', label: 'Services' },
  ];

  const handleFilterChange = (key: string, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Filter:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Type Filter */}
        <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
          <SelectTrigger className="w-32 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expenses</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Confidence Filter */}
        <Select value={filters.confidence} onValueChange={(value) => handleFilterChange('confidence', value)}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Confidence Levels</SelectItem>
            <SelectItem value="90">90% and above</SelectItem>
            <SelectItem value="80">80% and above</SelectItem>
            <SelectItem value="70">70% and above</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
