'use client';

import { FileText, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  filename: string;
  uploadedAt: string;
  status: 'PROCESSING' | 'PROCESSED' | 'FAILED';
  transactionsFound: number;
  confidence: number;
}

interface DocumentListProps {
  documents: Document[];
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
}

/**
 * DocumentList - Display list of uploaded documents
 *
 * Features:
 * - Shows document status (PROCESSED, PROCESSING, FAILED)
 * - Displays extracted transaction count
 * - Shows AI confidence score
 * - Links to transaction review page
 *
 * API Integration:
 * - GET /api/documents - provides document list
 * - GET /api/documents/:id/transactions - fetches transactions for review
 * - DELETE /api/documents/:id - delete document (optional)
 */
export function DocumentList({
  documents,
  isRefreshing,
  onRefresh,
}: DocumentListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PROCESSED':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            PROCESSED
          </Badge>
        );
      case 'PROCESSING':
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
            <Clock className="h-3 w-3 mr-1" />
            PROCESSING
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
            FAILED
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Recent Documents</CardTitle>
          {/* TODO: Add refresh button connected to: GET /api/documents */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-9"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {documents.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-1">No documents uploaded yet</p>
            <p className="text-sm text-muted-foreground">Upload a document above to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((document) => (
              <Link
                key={document.id}
                href={`/documents/${document.id}`}
                className="group block"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-border rounded-lg hover:border-accent/30 hover:bg-muted/30 transition-all duration-200">
                  {/* Left Section - Document Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0 mb-4 md:mb-0">
                    <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0 mt-1">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {document.filename}
                      </h3>
                      <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                        Uploaded {document.uploadedAt}
                      </p>
                    </div>
                  </div>

                  {/* Middle Section - Stats */}
                  <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-0">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Transactions</p>
                      <p className="text-lg font-semibold text-foreground">
                        {document.transactionsFound}
                      </p>
                    </div>
                    {document.status === 'PROCESSED' && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="text-lg font-semibold text-accent">
                          {document.confidence}%
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Status & Action */}
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-3">
                    <div>{getStatusBadge(document.status)}</div>
                    {document.status === 'PROCESSED' && (
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
