import { PaginatedResponse } from '@/lib/api/server-api-client';
import {
  createGoal,
  deleteGoal,
  getGoalDetails,
  getGoalOptions,
  getGoals,
  Goal,
  GoalRequest,
  PageRequest, updateGoal,
} from '@/lib/api/service/goal-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useGetGoals(params?: PageRequest, initialData? : PaginatedResponse<Goal>){
  return useQuery({
    queryKey: ["goals", params],
    queryFn: () => getGoals(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000
  })
}

export function useGoalDetails(goalId: string){
  return useQuery({
    queryKey: ["goals", goalId ],
    queryFn: () => getGoalDetails(goalId),
    staleTime: 5 * 60 * 1000
  })
}

export function useGoalOptions(){
  return useQuery({
    queryKey: ["goals", "options"],
    queryFn: () => getGoalOptions(),
    staleTime: 5 * 60 * 1000
  })
}

export function useCreateGoal(){
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: GoalRequest) => createGoal(input),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : ["goals"]});
      toast.success('Goal created successfully.');
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create Goal");
    }
  })
}

export function useUpdateGoal(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({goalId, input}: {goalId: string , input: GoalRequest}) =>
      updateGoal(goalId, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey : ["goals"]});

      if(data.id){
        queryClient.invalidateQueries({queryKey : ["goals", data.id.toString()]});

      }

      toast.success('Goal updated successfully.');
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update Goal");
    }
  })
}

export function useDeleteGoal(){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => deleteGoal(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : ["goals"]});
      toast.success('Goal deleted successfully.');
    }
  })
}