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
    <div className="space-y-8">
      {/* Search & Toolbar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks or projects..."
            className="pl-11 h-11 bg-muted/50 border-0 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button variant="outline" className="h-11">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>

        <Button onClick={openCreate} className="h-11 px-6 ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Task List */}
      <div className="grid gap-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center justify-between p-5 border border-border rounded-xl bg-card shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-200 cursor-pointer"
              onClick={() => openEdit(task)}
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="mt-1 p-2 bg-accent/10 rounded-lg flex-shrink-0">
                  <Clock className="h-5 w-5 text-accent" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground line-clamp-1">{task.title}</h3>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                    {task.projectName && (
                      <span className="font-medium text-accent/80">{task.projectName}</span>
                    )}

                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {task.dueDate || 'No date'}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${getPriorityColor(
                        task.priority,
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delete */}
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9 flex-shrink-0 ml-4"
                onClick={(e) => {
                  e.stopPropagation();
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
          <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/20">
            <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
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
