'use client';

import { useState } from 'react';
import { DocumentUploadArea } from './document-upload-area';
import { DocumentList } from './document-list';
import { DocumentStats } from './document-stats';

/**
 * DocumentListContainer - Main client component for document management
 *
 * This component manages:
 * - File uploads
 * - Document list display
 * - Statistics/summary view
 * - Navigation to transaction review
 *
 * Placeholder for API integration:
 * - POST /api/documents/upload - Upload document
 * - GET /api/documents - List documents
 * - GET /api/documents/:id/transactions - Get extracted transactions
 */
export function DocumentListContainer() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // TODO: Integrate with actual API
  // - Replace mock data with real API calls
  // - Add error handling and loading states
  // - Implement real-time document processing status updates

  const mockDocuments = [
    {
      id: '1',
      filename: 'Home_Depot_Invoice_March.pdf',
      uploadedAt: '2026-03-08',
      status: 'PROCESSED' as const,
      transactionsFound: 3,
      confidence: 98,
    },
    {
      id: '2',
      filename: 'Contractor_Invoice_001.pdf',
      uploadedAt: '2026-03-06',
      status: 'PROCESSED' as const,
      transactionsFound: 1,
      confidence: 95,
    },
    {
      id: '3',
      filename: 'Bank_Statement_February.pdf',
      uploadedAt: '2026-03-01',
      status: 'PROCESSING' as const,
      transactionsFound: 0,
      confidence: 0,
    },
  ];

  const handleUpload = async (files: FileList) => {
    // TODO: Implement file upload
    // API Endpoint: POST /api/documents/upload
    // Body: FormData with file(s)
    // Expected response: { id, filename, status: 'PROCESSING' }
    console.log('Uploading files:', files);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: Implement refresh
    // API Endpoint: GET /api/documents
    // Expected response: Array of documents with current status
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DocumentUploadArea onFilesSelected={handleUpload} />
        </div>

        {/* AI Agent Info - Right Column */}
        <div className="space-y-4">
          <DocumentStats />
        </div>
      </div>

      {/* Recent Documents Section */}
      <DocumentList
        documents={mockDocuments}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
