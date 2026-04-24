import { Metadata } from 'next';
import { TransactionReviewClient } from '@/components/documents/transaction-review-client';

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Review & Categorize Transactions',
  description: 'Review extracted transactions and assign them to projects',
};

export default async function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-full p-8">
      <TransactionReviewClient documentId={id} />
    </div>
  );
}
