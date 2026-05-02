'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Archive,
  Upload,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRecentDocuments } from '@/lib/query/use-documents';
import { DocumentRecord } from '@/lib/api/service/document-service';
import {
  DocStatus,
  getDocumentStatusLabel,
  getDocumentStatusColor,
  getConfidenceColor,
  formatShortDate,
} from './dashboard-utils';

const FEED_SIZE = 5;

// ─── Status Icon ──────────────────────────────────────────────────────────────

function DocStatusIcon({ status }: { status: DocStatus }) {
  const cls = 'h-4 w-4 shrink-0';
  switch (status) {
    case 'COMPLETED':
      return <CheckCircle2 className={`${cls} text-green-500`} />;
    case 'PROCESSING':
    case 'UPLOADED':
      return <Clock className={`${cls} text-amber-500`} />;
    case 'FAILED':
      return <XCircle className={`${cls} text-red-500`} />;
    case 'ARCHIVED':
      return <Archive className={`${cls} text-muted-foreground`} />;
    default:
      return <AlertCircle className={`${cls} text-muted-foreground`} />;
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DocRowSkeleton() {
  return (
    <div className="py-3.5 flex gap-3 animate-pulse border-b border-border last:border-b-0">
      <div className="h-4 w-4 rounded-full bg-muted mt-0.5 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-4 w-48 bg-muted rounded" />
        <div className="h-3 w-32 bg-muted rounded" />
      </div>
    </div>
  );
}

// ─── Document Row ─────────────────────────────────────────────────────────────

function DocRow({ doc }: { doc: DocumentRecord }) {
  const status = doc.status as DocStatus;

  return (
    <Link
      href={`/documents/${doc.id}`}
      className="flex items-start gap-3 py-3.5 border-b border-border last:border-b-0 hover:bg-muted/30 -mx-1 px-2 rounded-lg transition-colors group"
    >
      <div className="mt-0.5">
        <DocStatusIcon status={status} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
          {doc.filename}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
          <span className="text-xs text-muted-foreground">
            {formatShortDate(doc.uploadedDate)}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className={`text-xs font-medium ${getDocumentStatusColor(status)}`}>
            {getDocumentStatusLabel(status)}
          </span>
          {doc.status === 'COMPLETED' && doc.extractedTransactions > 0 && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-xs text-muted-foreground">
                {doc.extractedTransactions} transactions extracted
              </span>
              <span
                className={`text-xs font-semibold ${getConfidenceColor(doc.confidenceScore)}`}
              >
                {Math.round(doc.confidenceScore * 100)}% confidence
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Feed ─────────────────────────────────────────────────────────────────────

export function DashboardDocumentsFeed() {
  const { data, isLoading } = useRecentDocuments(0, FEED_SIZE);
  const router = useRouter();
  const docs = data?.content ?? [];

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="pb-0 pt-5 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-accent/10 rounded-lg">
              <FileText className="h-4 w-4 text-accent" />
            </div>
            <span className="font-semibold text-foreground">Documents</span>
          </div>
          <Link
            href="/documents"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors font-medium"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="pt-2 px-5 pb-5">
        {isLoading ? (
          <div>
            {Array.from({ length: 4 }).map((_, i) => (
              <DocRowSkeleton key={i} />
            ))}
          </div>
        ) : docs.length === 0 ? (
          <div className="py-10 text-center">
            <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No documents yet</p>
          </div>
        ) : (
          <div>
            {docs.map((doc) => (
              <DocRow key={doc.id} doc={doc} />
            ))}
          </div>
        )}

        {/* Upload CTA */}
        <button
          onClick={() => router.push('/documents')}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-all duration-200"
        >
          <Upload className="h-4 w-4" />
          Upload a statement
        </button>
      </CardContent>
    </Card>
  );
}
