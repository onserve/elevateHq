'use client';

import { useState } from 'react';
import { useRecentDocuments } from '@/lib/query/use-documents';
import type { DocumentRecord } from '@/lib/api/service/document-service';
import { FileText, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { ListPagination } from '@/components/shared/list-pagination';

const PAGE_SIZE = 10;

// ─── Sub-component ─────────────────────────────────────────────────────────────

function DocumentCard({ doc, formattedDate }: { doc: DocumentRecord; formattedDate: string }) {
  const isCompleted = doc.status === 'COMPLETED';

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
        isCompleted
          ? 'border-transparent hover:border-border hover:bg-muted/30'
          : 'border-border/50 bg-muted/10 opacity-90'
      }`}
    >
      <div className="p-3 bg-muted rounded-lg shrink-0">
        <FileText className="w-6 h-6 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h4 className="text-sm font-medium truncate">{doc.filename}</h4>

          {/* Status Badges */}
          {doc.status === 'COMPLETED' ? (
            <span className="flex items-center text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 px-2.5 py-0.5 rounded-full shrink-0">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Processed
            </span>
          ) : doc.status === 'PROCESSING' || doc.status === 'UPLOADED' ? (
            <span className="flex items-center text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 px-2.5 py-0.5 rounded-full shrink-0">
              <Clock className="w-3 h-3 mr-1" /> Processing
            </span>
          ) : doc.status === 'ARCHIVED' ? (
            <span className="flex items-center text-[10px] uppercase font-bold tracking-wider text-blue-700 bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 px-2.5 py-0.5 rounded-full shrink-0">
              Archived
            </span>
          ) : (
            <span className="flex items-center text-[10px] uppercase font-bold tracking-wider text-rose-700 bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 px-2.5 py-0.5 rounded-full shrink-0">
              Failed
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          {doc.source} • Uploaded {formattedDate}
        </p>

        {/* Progress Bar for Processing State */}
        {(doc.status === 'PROCESSING' || doc.status === 'UPLOADED') && (
          <div className="space-y-1.5 mt-2">
            <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
              <span>Analyzing document...</span>
              <span>{doc.processingProgress || 0}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${doc.processingProgress || 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats for Completed State */}
        {isCompleted && (
          <div className="flex justify-between items-center text-xs text-muted-foreground pt-1.5 border-t border-border/50">
            <span>
              {doc.extractedTransactions || 0} extracted • {doc.selectedTransactions || 0} selected
            </span>
            {doc.confidenceScore > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {doc.confidenceScore}% confidence
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export function RecentDocumentsList() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useRecentDocuments(page, PAGE_SIZE);

  if (isLoading) {
    return <div className="p-6 border rounded-xl animate-pulse bg-muted/20 h-[500px]" />;
  }

  const documents = data?.content || [];

  return (
    <div className="border border-border rounded-xl bg-card h-full flex flex-col min-h-[500px]">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold">Recent Statements</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 h-full">
            <FileText className="h-10 w-10 mb-3 opacity-20" />
            <p>No recent statements found.</p>
          </div>
        ) : (
          documents.map((doc) => {
            const isCompleted = doc.status === 'COMPLETED';
            const formattedDate = new Date(doc.uploadedDate).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return isCompleted ? (
              <Link key={doc.id} href={`/documents/${doc.id}`} className="block">
                <DocumentCard doc={doc} formattedDate={formattedDate} />
              </Link>
            ) : (
              <div key={doc.id}>
                <DocumentCard doc={doc} formattedDate={formattedDate} />
              </div>
            );
          })
        )}
      </div>

      {/* Pagination — only shown when more than one page exists */}
      {data && data.totalPages > 1 && (
        <div className="p-4 border-t border-border">
          <ListPagination data={data} onPageChange={setPage} siblingCount={0} />
        </div>
      )}
    </div>
  );
}
