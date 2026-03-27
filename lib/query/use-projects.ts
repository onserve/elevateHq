import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { PaginatedResponse} from '@/lib/api/server-api-client';
import {
  createProject,
  updateProject,
  getProjectsList,
  getProjectDetails,
  getProjectOptions,
  deleteProject,
  ProjectListview,
  ProjectRequest,
  PageRequest,
} from '@/lib/api/service/project-service';

import { toast} from 'sonner';

export function useProjects(params?: PageRequest, initialData?: PaginatedResponse<ProjectListview>){
  return useQuery({
    queryKey: ["projects", params],
    queryFn:() => getProjectsList(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60* 1000
  })
}

export function useProjectOptions(){
  return useQuery({
    queryKey: ["projects", "options"],
    queryFn: () => getProjectOptions(),
    staleTime: 5 * 60* 1000
  })
}

export function useProject(projectId: string){
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => getProjectDetails(projectId),
    enabled: !!projectId
  })
}

export function useCreateProject(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProjectRequest) => createProject(input),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["projects"]});
      toast.success('Project created successfully.');
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create project");
    },
  })
}

export function useUpdateProject(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({projectId, input} : {projectId: string, input: ProjectRequest}) => updateProject(projectId, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ["projects"]});

      if(data.id){
        queryClient.invalidateQueries({queryKey: ["projects", data.id.toString()]});
      }
      toast.success('Project updated successfully.');
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update project");
    }
  })
}

export function useDeleteProject(projectId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["projects"]});
      toast.success('Project deleted successfully.');
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete project");
    }
  })
}
