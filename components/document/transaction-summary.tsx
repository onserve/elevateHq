import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface TransactionSummaryProps {
  document: {
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
  };
  selected: number;
  selectedSummary: {
    income: number;
    expenses: number;
  };
}

/**
 * TransactionSummary - Document overview and financial summary
 *
 * Displays:
 * - Document metadata
 * - AI confidence score
 * - Financial summary (income, expenses, net flow)
 * - Selected transactions count and amount
 */
export function TransactionSummary({
  document,
  selected,
  selectedSummary,
}: TransactionSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="space-y-4">
      {/* Document Info Card */}
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <span className="p-2 bg-accent/10 rounded-lg">
                  <Zap className="h-4 w-4 text-accent" />
                </span>
                {document.filename}
              </h3>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p>Account: {document.account}</p>
                <p>Period: {document.period.start} - {document.period.end}</p>
                <p>Uploaded: {document.uploadedAt}</p>
              </div>
            </div>
            <div className="flex items-start justify-end">
              <Badge className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/10 h-fit">
                AI Confidence: {document.confidence}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
        {/* Income */}
        <Card className="border border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs lg:text-sm text-green-700 font-medium mb-1">Income</p>
                <p className="text-2xl lg:text-3xl font-bold text-green-900">
                  {formatCurrency(document.summary.income)}
                </p>
              </div>
              <TrendingUp className="h-5 lg:h-6 w-5 lg:w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs lg:text-sm text-red-700 font-medium mb-1">Expenses</p>
                <p className="text-2xl lg:text-3xl font-bold text-red-900">
                  {formatCurrency(document.summary.expenses)}
                </p>
              </div>
              <TrendingDown className="h-5 lg:h-6 w-5 lg:w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        {/* Net Flow */}
        <Card className={`border ${document.summary.netFlow >= 0 ? 'border-amber-200 bg-amber-50' : 'border-yellow-200 bg-yellow-50'}`}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-xs lg:text-sm font-medium mb-1 ${document.summary.netFlow >= 0 ? 'text-amber-700' : 'text-yellow-700'}`}>
                  Net Flow
                </p>
                <p className={`text-2xl lg:text-3xl font-bold ${document.summary.netFlow >= 0 ? 'text-amber-900' : 'text-yellow-900'}`}>
                  {formatCurrency(document.summary.netFlow)}
                </p>
              </div>
              <Zap className={`h-5 lg:h-6 w-5 lg:w-6 ${document.summary.netFlow >= 0 ? 'text-amber-600' : 'text-yellow-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Summary */}
      {selected > 0 && (
        <Card className="border border-accent/30 bg-accent/5">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{selected} transactions selected for import</p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-green-700">Selected Income</p>
                    <p className="text-lg font-semibold text-green-900">
                      {formatCurrency(selectedSummary.income)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-red-700">Selected Expenses</p>
                    <p className="text-lg font-semibold text-red-900">
                      {formatCurrency(selectedSummary.expenses)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
