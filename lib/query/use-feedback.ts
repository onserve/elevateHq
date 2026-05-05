import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, PaginatedResponse } from '@/lib/api/server-api-client';
import { toast } from 'sonner';
import {
  FeedbackItem,
  ReleaseNote,
  FeedbackSubmitRequest,
  submitFeedback,
  getFeedbacks,
  toggleVote,
  getReleaseNotes,
} from '@/lib/api/service/feedback-service';

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export function useFeedbacks(page: number = 0, size: number = 50) {
  return useQuery({
    queryKey: ['feedbacks', page, size],
    queryFn: () => getFeedbacks(page, size),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useReleaseNotes(page: number = 0, size: number = 20) {
  return useQuery({
    queryKey: ['releaseNotes', page, size],
    queryFn: () => getReleaseNotes(page, size),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: FeedbackSubmitRequest) => submitFeedback(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      toast.success('Feedback submitted successfully!');
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, 'Failed to submit feedback.'));
    },
  });
}

export function useToggleVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleVote(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['feedbacks'] });

      // Get all current paginated feedback queries
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.findAll({ queryKey: ['feedbacks'] });
      
      const previousDataMap = new Map();

      // Optimistically update all cached pages
      queries.forEach((query) => {
        const queryKey = query.queryKey;
        const previousData = queryClient.getQueryData<PaginatedResponse<FeedbackItem>>(queryKey);
        if (previousData) {
          previousDataMap.set(queryKey, previousData);
          queryClient.setQueryData(queryKey, (old: PaginatedResponse<FeedbackItem> | undefined) => {
            if (!old) return old;
            return {
              ...old,
              content: old.content.map((item) => {
                if (item.id === id) {
                  return {
                    ...item,
                    hasVoted: !item.hasVoted,
                    voteCount: item.hasVoted ? Math.max(0, item.voteCount - 1) : item.voteCount + 1,
                  };
                }
                return item;
              }),
            };
          });
        }
      });

      return { previousDataMap };
    },
    onError: (err: ApiError, _id, context) => {
      if (context?.previousDataMap) {
        context.previousDataMap.forEach((previousData, queryKey) => {
          queryClient.setQueryData(queryKey, previousData);
        });
      }
      toast.error(getErrorMessage(err, 'Failed to update vote.'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    },
  });
}
