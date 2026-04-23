import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PaginatedResponse, ApiError } from '@/lib/api/server-api-client';
import { getErrorMessage } from '@/lib/hooks/use-api-error';
import {
  uploadDocument,
  getRecentDocuments,
  getDocumentDetails,
  DocumentRecord,
} from '@/lib/api/service/document-service';
import { toast } from 'sonner';

export function useRecentDocuments() {
  return useQuery({
    queryKey: ['documents', 'recent'],
    queryFn: () => getRecentDocuments(),
    staleTime: 5 * 60 * 1000,
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
      return data?.status === 'PROCESSING' ? 2000 : false;
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, source }: { file: File; source: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('source', source);
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
