import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PaginatedResponse, ApiError } from '@/lib/api/server-api-client';
import { getErrorMessage } from '@/lib/hooks/use-api-error';
import {
  uploadDocument,
  getRecentDocuments,
  getDocumentDetails,
  DocumentRecord,
  getExtractedTransactions,
  submitSelectedTransactions,
  SelectTransactionsRequest,
  unselectTransactions,
  UnselectTransactionsRequest,
} from '@/lib/api/service/document-service';
import { toast } from 'sonner';

export function useRecentDocuments(page = 0, size = 10) {
  return useQuery({
    queryKey: ['documents', 'recent', page, size],
    queryFn: () => getRecentDocuments({ page, size }),
    staleTime: 5 * 60 * 1000,
    refetchInterval: (query) => {
      const data = query.state.data as PaginatedResponse<DocumentRecord> | undefined;
      const hasProcessing = data?.content?.some(
        (doc) => doc.status === 'PROCESSING' || doc.status === 'UPLOADED'
      );
      return hasProcessing ? 20000 : false;
    },
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: ['documents', id],
    queryFn: () => getDocumentDetails(id),
    enabled: !!id,
    refetchInterval: (query) => {
      // Auto-refresh if the document is still processing
      const data = query.state.data as DocumentRecord | undefined;
      return data?.status === 'PROCESSING' ? 20000 : false;
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, source, password }: { file: File; source: string; password?: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('source', source);
      if (password) {
        formData.append('password', password);
      }
      return uploadDocument(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document uploaded successfully.');
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, 'Failed to upload document.'));
    },
  });
}

export function useExtractedTransactions(documentId: string, selected = false, page = 0, size = 20) {
  return useQuery({
    queryKey: ['documents', documentId, 'transactions', selected, page, size],
    queryFn: () => getExtractedTransactions(documentId, { selected, page, size }),
    enabled: !!documentId,
  });
}

export function useSubmitTransactions(documentId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: SelectTransactionsRequest) => submitSelectedTransactions(documentId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Transactions imported successfully.');
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, 'Failed to import transactions.'));
    },
  });
}

export function useUnselectTransactions(documentId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: UnselectTransactionsRequest) => unselectTransactions(documentId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Transactions unselected and reverted successfully.');
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, 'Failed to unselect transactions.'));
    },
  });
}
