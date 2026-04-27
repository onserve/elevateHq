'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, MoreVertical, Edit2, Plus } from 'lucide-react';
import { Project } from '@/lib/api/service/project-service';
import { Button } from '@/components/ui/button';
import { ProjectDetailHeader } from './project-detail-header';
import { ProjectDetailTabs } from './project-detail-tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectForm } from './project-form';
import { TaskForm } from '@/components/task/task-form';
import type { Task } from '@/lib/api/service/task-service';
interface ProjectDetailProps {
  project: Project;
  projectId: string;
}

export function ProjectDetail({ project, projectId }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'finance' | 'goals'>(
    'overview'
  );
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'MEDIUM':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'URGENT':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-full p-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground transition-colors">
          Projects
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{project.name}</span>
      </div>

      {/* Header Section */}
      <div className="space-y-6">
        {/* Title and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3 line-clamp-2">{project.name}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                  project.status === 'IN_PROGRESS'
                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                    : project.status === 'PLANNING'
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : project.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                {project.status}
              </span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getPriorityColor(project.priority)}`}>
                Priority: {project.priority}
              </span>
            </div>
          </div>

          {/* Action Buttons - Stack on mobile, flex on desktop */}
          <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap w-full lg:w-auto">
            <Button variant="outline" className="h-10 flex-1 lg:flex-none" onClick={() => setIsEditProjectOpen(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
            <Button className="h-10 flex-1 lg:flex-none bg-accent hover:bg-accent/90" onClick={() => setIsAddTaskOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Section */}
        <ProjectDetailHeader project={project} />
      </div>

      {/* Tabs */}
      <ProjectDetailTabs activeTab={activeTab} onTabChange={setActiveTab} project={project} />

      {/* Edit Project Dialog */}
      <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <ProjectForm 
            initial={project} 
            onSuccess={() => setIsEditProjectOpen(false)} 
            onCancel={() => setIsEditProjectOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Task to {project.name}</DialogTitle>
          </DialogHeader>
          <TaskForm 
            taskData={{ projectId: project.id } as unknown as Task} 
            onSuccess={() => setIsAddTaskOpen(false)} 
            onCancel={() => setIsAddTaskOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
