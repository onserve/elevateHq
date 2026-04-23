import { Metadata } from 'next';
import { DocumentUploadZone } from '@/components/documents/document-upload-zone';
import { RecentDocumentsList } from '@/components/documents/recent-documents-list';

export const metadata: Metadata = {
  title: 'Smart Document Processor',
  description: 'Upload financial statements and invoices to extract transactions automatically',
};

export default function DocumentsPage() {
  return (
    <div className="min-h-full p-8">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Smart Document Processor</h1>
        <p className="text-base text-muted-foreground">
          Upload financial statements and invoices to extract transactions automatically
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DocumentUploadZone />
        </div>
        <div className="lg:col-span-1">
          <RecentDocumentsList />
        </div>
      </div>
    </div>
  );
}
