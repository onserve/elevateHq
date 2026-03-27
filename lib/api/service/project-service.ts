'use server';

import { PaginatedResponse } from '@/lib/api/server-api-client';

import { serverApi } from '@/lib/api/server-api-client';
import { revalidatePath } from 'next/cache';


export async function createProject(input: ProjectRequest): Promise<Project> {
  const response = await serverApi.post<Project>('/projects', input);

  revalidatePath("/projects");
  return response.data;
}

export async function updateProject(projectId: string, input: ProjectRequest): Promise<Project> {
  const response = await serverApi.put<Project>(`/projects/${projectId}`, input);
  revalidatePath("/projects");
  return response.data;
}

export async function deleteProject(projectId: string): Promise<void> {
  await serverApi.delete(`/projects/${projectId}`);
  revalidatePath("/projects");
}

export async function getProjectsList(params?: PageRequest): Promise<PaginatedResponse<ProjectListview>> {
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
  const endpoint = query ? `/projects?${query}` : '/projects';
  const response = await serverApi.get<PaginatedResponse<ProjectListview>>(endpoint);

  return response.data;
}

export async function getProjectDetails(projectId: string): Promise<Project> {
  const response = await serverApi.get<Project>(`/projects/${projectId}`);
  return response.data
}

export async function getProjectOptions(): Promise<ProjectOptions[]> {

  const response = await serverApi.get<ProjectOptions[]>('/projects/options');

  return response.data;
}



export interface ProjectOptions{
  id: string;
  name: string;
}


export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string | string[]; // Allows one string or an array of strings
  status?: string;
  priority?: string;
  name?: string;

}

export interface Project {
  id: string | number;
  name: string;
  description?: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate?: string;
  endDate?: string;
  progress: number;
  budget?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRequest {
  name: string;
  description?: string;
  status?: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate?: string;
  endDate?: string;
  budget?: number;
  tags?: string[];
}

export interface ProjectListview {
  id: string | number;
  name: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  budget?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  totalTasks: number;
}