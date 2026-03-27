import { Metadata } from 'next';
import { DocumentListContainer } from '@/components/document/document-list-container';

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

      {/* Hand off to client component */}
      <DocumentListContainer />
    </div>
  );
}
