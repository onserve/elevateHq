import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/server-api-client';
import { getErrorMessage } from '@/lib/hooks/use-api-error';
import {
  getTask,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  type Task,
  type TaskRequest,
  type PageRequest,
} from '@/lib/api/service/task-service';
import type { PaginatedResponse } from '@/lib/api/server-api-client';
import { toast } from 'sonner';

export function useTasks(params?: PageRequest, initialData?: PaginatedResponse<Task>) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => getTasks(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTask(id?: string) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => getTask(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TaskRequest) => createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully.');
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, 'Failed to create task.'));
    },
  });
}

/**
 * Features:
 * - Optimistic Updates: UI updates immediately
 * - Rollback on Error: Reverts UI if the Spring backend fails
 * - Cache Invalidation: Ensures eventual consistency with the DB
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TaskRequest }) => updateTask(id, input),

    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<PaginatedResponse<Task>>(['tasks']);

      queryClient.setQueryData(['tasks'], (old: PaginatedResponse<Task> | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: old.content.map((task) => (task.id === id ? { ...task, ...input } : task)),
        };
      });

      return { previousTasks };
    },

    onError: (err: ApiError, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      toast.error(getErrorMessage(err, 'Failed to update task.'));
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
    },

    onSuccess: () => {
      toast.success('Task updated.');
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted.');
    },
    onError: (error: ApiError) => {
      // Previously missing — delete failures were completely silent
      toast.error(getErrorMessage(error, 'Failed to delete task.'));
    },
  });
}
