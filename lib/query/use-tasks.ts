import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  type Task,
  type TaskRequest,
  type PageRequest
} from '@/lib/api/service/task-service';
import type { PaginatedResponse } from '@/lib/api/server-api-client';
import { toast } from 'sonner';


export function useTasks(params? : PageRequest, initialData?: PaginatedResponse<Task>){
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => getTasks(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000
  })
}

export function useCreateTask(){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TaskRequest) => createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success('Task created successfully.');
    },
    onError: (error: any) =>{
      toast.error(error.message || "Failed to create task.");
    }
  })
}

/**
 *
 * Features:
 * - Optimistic Updates: UI updates immediately [1, 2]
 * - Rollback on Error: Reverts UI if the Spring backend fails [1]
 * - Cache Invalidation: Ensures eventual consistency with the DB [3-5]
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TaskRequest }) =>
      updateTask(id, input),

    // 1. When the mutation is triggered:
    onMutate: async ({ id, input }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the current state of the tasks in the cache [2]
      const previousTasks = queryClient.getQueryData<PaginatedResponse<Task>>(["tasks"]);

      // Optimistically update the cache immediately
      queryClient.setQueryData(["tasks"], (old: PaginatedResponse<Task> | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: old.content.map((task) =>
            task.id === id ? { ...task, ...input } : task
          ),
        };
      });

      // Return the snapshot so we can use it to rollback if needed
      return { previousTasks };
    },

    // 2. If the mutation fails (e.g., 401, 500, or Validation Error from Spring):
    onError: (err: any, variables, context) => {
      // Rollback to the previous state [1, 6]
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
      toast.error(err.message || "Failed to update task");
    },

    // 3. Always refetch after error or success to ensure the client is in sync [3, 4]
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Also invalidate the specific task detail if you have a useTask(id) hook [7]
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.id] });
    },

    onSuccess: () => {
      toast.success("Task updated");
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    },
  });
}
