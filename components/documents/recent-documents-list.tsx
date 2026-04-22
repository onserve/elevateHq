'use client';

import { useRecentDocuments } from '@/lib/query/use-documents';
import { FileText, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function RecentDocumentsList() {
  const { data, isLoading } = useRecentDocuments();

  if (isLoading) {
    return <div className="p-6 border rounded-xl animate-pulse bg-muted/20 h-[500px]" />;
  }

  const documents = data?.content || [];

  return (
    <div className="border border-border rounded-xl bg-card h-full flex flex-col min-h-[500px]">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold">Recent Documents</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 h-full">
            <FileText className="h-10 w-10 mb-3 opacity-20" />
            <p>No recent documents found.</p>
          </div>
        ) : (
          documents.map((doc) => (
            <Link key={doc.id} href={`/documents/${doc.id}`} className="block">
              <div className="flex items-start gap-4 p-4 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-colors">
                 <div className="p-3 bg-muted rounded-lg shrink-0">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start mb-1 gap-2">
                     <h4 className="text-sm font-medium truncate">{doc.name}</h4>
                     {doc.status === 'PROCESSED' ? (
                       <span className="flex items-center text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 px-2.5 py-0.5 rounded-full shrink-0">
                         <CheckCircle2 className="w-3 h-3 mr-1" /> Processed
                       </span>
                     ) : doc.status === 'PROCESSING' ? (
                       <span className="flex items-center text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 px-2.5 py-0.5 rounded-full shrink-0">
                         <Clock className="w-3 h-3 mr-1" /> Processing
                       </span>
                     ) : (
                       <span className="flex items-center text-[10px] uppercase font-bold tracking-wider text-rose-700 bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 px-2.5 py-0.5 rounded-full shrink-0">
                         Failed
                       </span>
                     )}
                   </div>
                   <p className="text-xs text-muted-foreground mb-3">Uploaded {doc.uploadDate}</p>
                   
                   {doc.status === 'PROCESSED' && (
                     <div className="flex justify-between items-center text-xs text-muted-foreground pt-1.5 border-t border-border/50">
                       <span>{doc.transactionCount || 0} transactions found</span>
                       <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                         {doc.confidenceScore || 0}% confidence
                       </span>
                     </div>
                   )}
                 </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
