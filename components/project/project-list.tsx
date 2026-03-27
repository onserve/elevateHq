'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Calendar, Layout, BarChart3, MoreVertical } from 'lucide-react';
import Link from 'next/link';
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
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-11 h-11 bg-muted/50 border-0 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setEditingProject(null);
            setIsFormOpen(true);
          }}
          className="h-11 px-6"
        >
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed rounded-2xl bg-muted/20">
          <Layout className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-1">No projects found</p>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? 'Try adjusting your search' : 'Create a new project to get started'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="group"
          >
          <div
            className="p-6 border border-border rounded-2xl bg-card shadow-sm hover:shadow-lg hover:border-accent/20 transition-all duration-200 cursor-pointer h-full"
          >
            <div className="flex justify-between items-start mb-5">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Layout className="h-6 w-6 text-accent" />
              </div>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>
            </div>

            <h3 className="font-bold text-xl mb-2 text-foreground line-clamp-2">{project.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4" /> {project.totalTasks} Tasks
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {project.endDate || 'No date'}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteProject.mutate(project.id.toString())}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          </Link>
          ))}
        </div>
      )}

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
