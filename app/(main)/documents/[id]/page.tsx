import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TransactionReview } from '@/components/document/transaction-review';

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Review & Categorize Transactions',
  description: 'Review extracted transactions and assign them to projects',
};

/**
 * Document Detail Page
 *
 * Server Component that:
 * 1. Fetches document and transactions data
 * 2. Passes to client component for interactive review
 *
 * TODO: Replace mock data with actual API:
 * - GET /api/documents/:id
 * - GET /api/documents/:id/transactions
 */
export default async function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const { id } = await params;

  // TODO: Fetch from API
  // const response = await fetch(`/api/documents/${id}`, { next: { revalidate: 0 } });
  // if (!response.ok) notFound();

  // Mock data - replace with actual API response
  const mockDocument = {
    id,
    filename: 'Bank_Statement_March_2026.pdf',
    account: '****4521',
    period: { start: 'March 1', end: 'March 31, 2026' },
    uploadedAt: '2026-03-08',
    confidence: 96,
    summary: {
      income: 8200.0,
      expenses: 11725.99,
      netFlow: -3525.99,
    },
  };

  const mockTransactions = [
    {
      id: '1',
      type: 'INCOME' as const,
      date: '2026-03-01',
      description: 'Payroll Deposit - ABC Company',
      vendor: 'ABC Company',
      confidence: 95,
      category: 'Salary',
      projectTag: null,
      amount: 5800.0,
      selected: true,
    },
    {
      id: '2',
      type: 'INCOME' as const,
      date: '2026-03-15',
      description: 'Freelance Payment - Client XYZ',
      vendor: 'Client XYZ',
      confidence: 92,
      category: 'Freelance',
      projectTag: null,
      amount: 2400.0,
      selected: true,
    },
    {
      id: '3',
      type: 'EXPENSE' as const,
      date: '2026-03-08',
      description: 'Home Depot Purchase - Kitchen Materials',
      vendor: 'Home Depot',
      confidence: 88,
      category: 'Materials',
      projectTag: 'Kitchen Renovation',
      amount: -5200.0,
      selected: true,
    },
  ];

  return (
    <div className="min-h-full p-8">
      <TransactionReview
        documentId={id}
        document={mockDocument}
        transactions={mockTransactions}
      />
    </div>
  );
}
