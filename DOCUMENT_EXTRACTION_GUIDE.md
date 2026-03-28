# Document Extraction Workflow - Implementation Guide

## Overview

The Document Extraction feature enables users to upload financial statements and invoices, automatically extract transactions using AI, and categorize/import them into the system.

## Architecture

### Pages & Components Structure

```
app/(main)/documents/
├── page.tsx                          # Main documents list page (Server)
└── [id]/
    └── page.tsx                      # Transaction review page (Server)

components/document/
├── document-list-container.tsx       # Main container (Client)
├── document-upload-area.tsx          # File upload component (Client)
├── document-list.tsx                 # Document list display (Client)
├── document-stats.tsx                # AI Agent info card (Server)
├── transaction-review.tsx            # Transaction review container (Client)
├── transaction-summary.tsx           # Document & summary info (Server)
├── transaction-filters.tsx           # Filter controls (Client)
├── transaction-quick-select.tsx      # Quick select buttons (Server)
└── transaction-table.tsx             # Interactive table (Client)
```

## Server/Client Component Pattern

### Why This Pattern?
- **Server Components**: Fetch data efficiently, reduce client JS
- **Client Components**: Handle interactivity (uploads, selections, filters)
- **Data Flow**: Server → Server Components → Client Components

### Current Implementation

**Server Components (no interactivity):**
- `page.tsx` files - Fetch document/transaction data
- `document-stats.tsx` - Static AI agent info display
- `transaction-summary.tsx` - Static financial summaries
- `transaction-quick-select.tsx` - Simple button display

**Client Components (interactive):**
- `document-list-container.tsx` - Main state management
- `document-upload-area.tsx` - File upload handling
- `document-list.tsx` - Document navigation
- `transaction-review.tsx` - Transaction selection & management
- `transaction-filters.tsx` - Filter state changes
- `transaction-table.tsx` - Inline editing, selections

## API Integration Placeholders

### Current Mock Data Locations

| Component | Mock Data | API Endpoint |
|-----------|-----------|--------------|
| DocumentListContainer | mockDocuments | GET /api/documents |
| DocumentDetailPage | mockDocument, mockTransactions | GET /api/documents/:id, GET /api/documents/:id/transactions |

### API Endpoints to Implement

#### Document Management

```typescript
// Upload new document
POST /api/documents/upload
Body: FormData { file: File }
Response: { id: string; filename: string; status: 'PROCESSING' }

// List documents
GET /api/documents
Response: Document[]

// Get document details
GET /api/documents/:id
Response: Document

// Get extracted transactions
GET /api/documents/:id/transactions
Response: Transaction[]

// Delete document
DELETE /api/documents/:id
Response: { success: boolean }
```

#### Transaction Management

```typescript
// Update transaction details (category, project)
PUT /api/documents/:id/transactions/:txId
Body: { category?: string; projectTag?: string | null }
Response: Transaction

// Import selected transactions
POST /api/documents/:id/import
Body: { transactions: Transaction[] }
Response: { success: boolean; imported: number }
```

#### Supporting Data

```typescript
// Get available categories
GET /api/categories
Response: { id: string; name: string }[]

// Get available projects
GET /api/projects
Response: { id: string; name: string }[]

// Get AI agent status
GET /api/ai/status
Response: { online: boolean; version: string; capabilities: string[] }
```

## User Flow

### 1. Document Upload Page (`/documents`)

**Layout:**
- Left: Upload area + AI agent info
- Right: Recent documents list

**User Actions:**
1. Drag & drop or click to select files
2. System validates (PDF, PNG, JPG; max 10MB)
3. Upload initiated (POST /api/documents/upload)
4. Document appears in list with PROCESSING status
5. Periodically check status (GET /api/documents)
6. When PROCESSED, show transaction count and confidence

**Key Features:**
- File type validation (PDF, PNG, JPG)
- File size validation (10MB max)
- Error messages for validation failures
- Real-time status updates via refresh button
- AI Agent Ready status display

### 2. Transaction Review Page (`/documents/[id]`)

**Layout:**
- Header: Back button, title, Import button
- Document summary: Filename, account, period, confidence
- Financial summary: Income, Expenses, Net Flow (with selected amounts)
- Quick select: 4 bulk-select options
- Filters: Type, Category, Confidence Level dropdowns
- Transactions table: Interactive rows with inline editing

**User Actions:**
1. View document metadata and extracted data
2. Use quick select to bulk-select transactions by type
3. Use filters to refine view
4. Edit category/project for individual transactions
5. Select transactions to import
6. Click Import to save transactions

**Key Features:**
- Responsive table (scrollable on mobile)
- Inline category/project editing
- Confidence indicators with color coding
- Transaction type indicators (income/expense)
- Selected transaction summary
- Bulk operations (Select All, Income, Expenses, Project-Related)

## Data Models

### Document
```typescript
interface Document {
  id: string;
  filename: string;
  uploadedAt: string;
  status: 'PROCESSING' | 'PROCESSED' | 'FAILED';
  transactionsFound: number;
  confidence: number; // 0-100
  account?: string;
  period?: { start: string; end: string };
  summary?: {
    income: number;
    expenses: number;
    netFlow: number;
  };
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  description: string;
  vendor: string;
  confidence: number; // 0-100
  category: string;
  projectTag: string | null;
  amount: number;
  selected: boolean;
}
```

## Styling & Visual Hierarchy

### Color Coding
- **Income**: Green (#22c55e)
- **Expenses**: Red (#ef4444)
- **Net Flow**: Amber/Yellow
- **Status Badges**: 
  - PROCESSED: Green
  - PROCESSING: Amber
  - FAILED: Red

### Confidence Visual Indicators
- **90%+**: Green badge with checkmark
- **75-89%**: Amber badge
- **<75%**: Red badge with alert icon

### Responsive Design
- **Mobile**: Single column, collapsible sections
- **Tablet**: 2-column layouts where appropriate
- **Desktop**: Full 3-column layouts with expanded tables

## Integration Checklist

- [ ] Implement POST /api/documents/upload
- [ ] Implement GET /api/documents
- [ ] Implement GET /api/documents/:id
- [ ] Implement GET /api/documents/:id/transactions
- [ ] Implement PUT /api/documents/:id/transactions/:txId
- [ ] Implement POST /api/documents/:id/import
- [ ] Connect document list to real data
- [ ] Add real-time processing status updates
- [ ] Implement file upload progress indication
- [ ] Add error handling and retry logic
- [ ] Add toast notifications for success/error states
- [ ] Implement pagination for large document lists
- [ ] Add download functionality for processed documents
- [ ] Implement document search/filtering on main page
- [ ] Add analytics tracking for extraction success rates

## Future Enhancements

1. **Batch Processing**: Upload multiple files at once
2. **Manual Adjustment**: Allow users to manually correct extracted data
3. **Transaction Rules**: Create rules for automatic categorization
4. **Bulk Actions**: Categorize multiple transactions at once
5. **Export**: Export transactions in various formats (CSV, JSON)
6. **History**: View transaction import history
7. **Reconciliation**: Compare extracted vs. expected amounts
8. **AI Training**: Improve extraction accuracy over time
9. **OCR Settings**: Configure OCR sensitivity/accuracy
10. **Webhook Integration**: Real-time processing notifications
