'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Calendar, Layout, BarChart3, MoreVertical } from 'lucide-react';
import { useProjects, useDeleteProject } from '@/lib/query/use-projects';
import { PaginatedResponse } from '@/lib/api/server-api-client';
import { ProjectListview, Project } from '@/lib/api/service/project-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectForm } from './project-form';

interface ProjectListProps {
  initialData: PaginatedResponse<ProjectListview>;
}

export function ProjectList({ initialData }: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Client-side syncing with initial data hand-off [6, 7]
  const { data } = useProjects({ page: 0, size: 10 }, initialData);
  const deleteProject = useDeleteProject();

  const allProjects = data?.content || initialData?.content || [];

  // Instant filtering without extra network hops [8, 9]
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allProjects, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'ON_HOLD':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setEditingProject(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group p-5 border rounded-xl bg-card hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Layout className="h-5 w-5 text-primary" />
              </div>
              <span
                className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>
            </div>

            <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <BarChart3 className="h-3.5 w-3.5" /> {project.totalTasks} Tasks
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {project.endDate || 'No end date'}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteProject.mutate(project.id.toString())}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Create Project'}</DialogTitle>
          </DialogHeader>
          <ProjectForm
            initial={editingProject}
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
