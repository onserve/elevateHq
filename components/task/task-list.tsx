'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Flag, Trash2, Clock, Plus } from 'lucide-react';

import { useTasks, useDeleteTask } from '@/lib/query/use-tasks';
import { PaginatedResponse } from '@/lib/api/server-api-client';
import { Task } from '@/lib/api/service/task-service';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { TaskForm } from './task-form';

interface TaskListProps {
  initialData: PaginatedResponse<Task>;
}

export function TaskList({ initialData }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data } = useTasks({ page: 0, size: 10 }, initialData);
  const deleteTask = useDeleteTask();

  const allTasks = data?.content || initialData?.content || [];

  const filteredTasks = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return allTasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.projectName?.toLowerCase().includes(query)
      );
    });
  }, [allTasks, searchQuery]);

  function openCreate() {
    setEditingTask(null);
    setIsFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setIsFormOpen(true);
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-700';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-700';
      case 'HIGH':
        return 'bg-amber-100 text-amber-700';
      case 'URGENT':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage tasks across all projects</p>
        </div>

        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search tasks or projects..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Task List */}
      <div className="grid gap-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center justify-between p-4 border rounded-xl bg-card transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start gap-4 cursor-pointer" onClick={() => openEdit(task)}>
                <div className="mt-1">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>

                <div>
                  <h3 className="font-medium text-foreground">{task.title}</h3>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {task.projectName && (
                      <span className="font-medium text-primary/80">{task.projectName}</span>
                    )}

                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {task.dueDate || 'No date'}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${getPriorityColor(
                        task.priority,
                      )}`}
                    >
                      <Flag className="inline h-3 w-3 mr-1" />
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delete */}
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  if (confirm('Delete this task?')) {
                    deleteTask.mutate(task.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">No tasks found matching your search.</p>
          </div>
        )}
      </div>

      {/* Dialog for Create/Edit Task */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
          </DialogHeader>

          <TaskForm
            initial={editingTask}
            onCancel={() => setIsFormOpen(false)}
            onSuccess={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
