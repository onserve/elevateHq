import { getTransactions } from '@/lib/api/service/finance-service';
import { TransactionList } from '@/components/finance/transaction-list';
import type { TransactionType, TransactionCategory } from '@/lib/api/service/finance-service';

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    size?: string;
    sort?: string;
    type?: TransactionType;
    category?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }>;
}) {
  // 1. Unwrap searchParams (Next.js 15 requirement)
  const params = await searchParams;

  // 2. Parse pagination params
  const page = params.page ? parseInt(params.page) : 0;
  const size = params.size ? parseInt(params.size) : 50;

  // 3. Fetch initial data server-side (secure — token never leaves server)
  const initialData = await getTransactions({
    page,
    size,
    sort: params.sort || 'txnDate,desc',
    type: params.type,
    category: params.category as TransactionCategory | undefined,
    startDate: params.startDate,
    endDate: params.endDate,
  });

  return (
    <div className="min-h-full p-8">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-2">Finance</h1>
        <p className="text-base text-muted-foreground">
          Track income, expenses, and monitor your cash flow
        </p>
      </div>

      {/* Hand off initial data to Client Component */}
      <TransactionList initialData={initialData} />
    </div>
  );
}
