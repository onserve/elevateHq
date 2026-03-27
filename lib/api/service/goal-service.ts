"use server"

import { PaginatedResponse } from '@/lib/api/server-api-client';
import { serverApi } from '@/lib/api/server-api-client';
import { revalidatePath} from 'next/cache';

export async function getGoals(params?: PageRequest) : Promise<PaginatedResponse<Goal>>{
  const queryParams = new URLSearchParams();

  if (params?.sort) {
    const sortArray = Array.isArray(params.sort) ? params.sort : [params.sort];
    sortArray.forEach((sortItem) => queryParams.append('sort', sortItem));
  } else {
    //Default fallback
    queryParams.append('sort', 'createdAt,desc');
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'sort' && value !== undefined && value !== null) {
        queryParams.set(key, value.toString());
      }
    });
  }

  const query = queryParams.toString();
  const endpoint = query ? `/goals?${query}` : '/goals';
  const response = await serverApi.get<PaginatedResponse<Goal>>(endpoint);

  return response.data;
}

export async function createGoal(input: GoalRequest ): Promise<Goal> {
  const response = await serverApi.post<Goal>("/goals", input);
  revalidatePath("/goals");
  return response.data
}

export async function updateGoal(goalId: string, input: GoalRequest ): Promise<Goal> {
  const response = await serverApi.put<Goal>(`/goals/${goalId}`, input);
  revalidatePath("/goals");
  return response.data
}

export async function deleteGoal(goalId: string ): Promise<void> {
  await serverApi.delete<Goal>(`/goals/${goalId}`);
  revalidatePath("/goals");
}

export async function getGoalDetails(goalId: string ): Promise<Goal> {
  const response = await serverApi.get<Goal>(`/goals/${goalId}`);
  return response.data;
}

export async function getGoalOptions(): Promise<GoalOptions[]>{
  const response = await serverApi.get<GoalOptions[]>('/goals/options');
  return response.data
}

export interface GoalOptions {
  id: string;
  name: string;
}

export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string | string[]; // Allows one string or an array of strings
  status?: string;
  category?: string;
  title?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: 'FINANCIAL' | 'PERSONAL' | 'BUSINESS' | 'HEALTH' | 'OTHER';
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  deadline?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
  projectId?: string;
  projectName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalRequest {
  title: string;
  description?: string;
  category: 'FINANCIAL' | 'PERSONAL' | 'BUSINESS' | 'HEALTH' | 'OTHER';
  targetValue?: number;
  unit?: string;
  deadline?: string;
  projectId?: string;
}
