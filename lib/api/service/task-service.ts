"use server"

import { PaginatedResponse } from '@/lib/api/server-api-client';

import {serverApi} from '@/lib/api/server-api-client';
import {revalidatePath} from 'next/cache';

export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string | string[]; // Allows one string or an array of strings
  status?: string;
  priority?: string;
  title?: string;
}

export interface Task {
  id: string
  title: string
  description?: string
  status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  dueDate?: string
  projectId?: string
  projectName?: string
  goalId?: string
  goalName?: string
  tags?: string[]
  actualHours?: number
  createdAt: string
  updatedAt: string
}

export interface TaskRequest {
  title: string
  description?: string
  status: "COMPLETED" | "CANCELLED" | "TODO" | "IN_PROGRESS"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  dueDate?: string
  projectId?: string
  goalId?: string
  tags?: string[]
}

export async function createTask(input: TaskRequest ): Promise<Task> {
  const response = await serverApi.post<Task>("/tasks", input);

  revalidatePath("/tasks");
  return response.data;
}

export async function getTasks(params?: PageRequest) :Promise<PaginatedResponse<Task>>{
  const queryParams = new URLSearchParams();

  if(params?.sort) {
    const sortArray = Array.isArray(params.sort) ? params.sort : [params.sort];
    sortArray.forEach(sortItem => queryParams.append("sort", sortItem));
  }else {
    //Default fallback
    queryParams.append("sort", "createdAt,desc");
  }

  if(params){
    Object.entries(params).forEach(([key, value]) => {
      if(key!== 'sort' && value !== undefined && value !== null){
        queryParams.set(key, value.toString());
      }
    })
  }

  const query = queryParams.toString();
  const endpoint = query ? `/tasks?${query}` : '/tasks';
  const response = await serverApi.get<PaginatedResponse<Task>>(endpoint);

  return response.data;
}

export async function updateTask(id: string, input: TaskRequest ): Promise<Task> {
  const response = await serverApi.put<Task>(`/tasks/${id}`, input);
  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);

  return response.data
}


export async function deleteTask(id: string) : Promise<void> {
  await serverApi.delete(`/tasks/${id}`);
  revalidatePath("/tasks");
}