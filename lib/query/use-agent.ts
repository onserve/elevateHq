import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/server-api-client';
import { getErrorMessage } from '@/lib/hooks/use-api-error';
import { sendAgentMessage, type ChatRequest, type ChatResponse } from '@/lib/api/service/agent-service';
import { toast } from 'sonner';

export function useAgentChat() {
  return useMutation<ChatResponse, ApiError, ChatRequest>({
    mutationFn: (request: ChatRequest) => sendAgentMessage(request),
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, 'Failed to communicate with AI Assistant.'));
    },
  });
}
