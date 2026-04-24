'use client';

import { useState } from 'react';
import { useDocument, useExtractedTransactions, useSubmitTransactions, useUnselectTransactions } from '@/lib/query/use-documents';
import { TransactionReviewTable } from '@/components/documents/transaction-review-table';
import { SelectedTransaction } from '@/lib/api/service/document-service';
import { CheckCircle2, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface TransactionReviewClientProps {
  documentId: string;
}

export function TransactionReviewClient({ documentId }: TransactionReviewClientProps) {
  const [activeTab, setActiveTab] = useState<'unselected' | 'selected'>('unselected');
  const [page, setPage] = useState(0);

  const { data: document, isLoading: isLoadingDoc } = useDocument(documentId);
  const { data: txData, isLoading: isLoadingTxns } = useExtractedTransactions(
    documentId, 
    activeTab === 'selected', 
    page, 
    20
  );
  
  const transactions = txData?.content || [];
  const totalPages = txData?.totalPages || 1;

  const { mutate: submitTransactions, isPending } = useSubmitTransactions(documentId);
  const { mutate: unselectTransactions, isPending: isUnselecting } = useUnselectTransactions(documentId);

  const handleSubmit = (selectedData: SelectedTransaction[]) => {
    submitTransactions({ selectedTransactions: selectedData });
  };
  
  const handleUnselect = (ids: string[]) => {
    unselectTransactions({ extractedTransactionIds: ids });
  };
  
  const handleTabChange = (tab: 'unselected' | 'selected') => {
    setActiveTab(tab);
    setPage(0);
  };

  if (isLoadingDoc || isLoadingTxns) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-muted-foreground space-y-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p>Loading document data...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-muted-foreground">
        <p>Document not found.</p>
      </div>
    );
  }

  const formattedDate = new Date(document.uploadedDate).toLocaleDateString(undefined, { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Navigation */}
      <div>
        <Link href="/documents" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Documents
        </Link>
      </div>

      {/* Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 bg-card border border-border rounded-xl p-8 flex items-start gap-6 shadow-sm">
          <div className="p-4 bg-primary/10 rounded-xl shrink-0">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{document.filename}</h2>
              {document.status === 'COMPLETED' && (
                <span className="flex items-center text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Processed
                </span>
              )}
            </div>
            <div className="text-muted-foreground text-sm grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1">Source</p>
                <p className="font-medium text-foreground">{document.source}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1">Uploaded</p>
                <p className="font-medium text-foreground">{formattedDate}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1">Extracted</p>
                <p className="font-medium text-foreground">{document.extractedTransactions} transactions</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1">Selected</p>
                <p className="font-medium text-emerald-600 dark:text-emerald-400">{document.selectedTransactions} transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Review & Import</h3>
            <p className="text-sm text-muted-foreground">Select transactions and assign goals or projects before importing.</p>
          </div>
          
          <div className="flex p-1 bg-muted rounded-lg w-fit">
            <button
              onClick={() => handleTabChange('unselected')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'unselected' 
                  ? 'bg-background shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Pending Review
            </button>
            <button
              onClick={() => handleTabChange('selected')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'selected' 
                  ? 'bg-background shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Imported
            </button>
          </div>
        </div>
        
        <TransactionReviewTable 
          transactions={transactions} 
          onSubmit={handleSubmit}
          onUnselect={handleUnselect}
          isSubmitting={isPending || isUnselecting}
          isViewOnly={activeTab === 'selected'}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
