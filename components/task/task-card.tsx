'use client';

import { Calendar, Clock, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/lib/api/service/task-service';

interface TaskCardProps {
  task: Task;
  onClick?: (taskId: string) => void;
  onDelete?: (task: Task) => void;
  isLoading?: boolean;
}

export function TaskCard({ task, onClick, onDelete, isLoading }: TaskCardProps) {
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
    <div
      className={`group flex items-center justify-between p-5 border border-border rounded-xl bg-card shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${isLoading ? 'animate-pulse bg-accent/5 pointer-events-none' : ''}`}
      onClick={() => onClick?.(task.id)}
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="mt-1 p-2 bg-accent/10 rounded-lg flex-shrink-0">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-accent animate-spin" />
          ) : (
            <Clock className="h-5 w-5 text-accent" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground line-clamp-1">{task.title}</h3>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
            {task.projectName && (
              <span className="font-medium text-accent/80">{task.projectName}</span>
            )}

            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No date'}
            </span>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
            
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                task.status === 'IN_PROGRESS'
                  ? 'bg-amber-100 text-amber-700 border-amber-200'
                  : task.status === 'TODO'
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : task.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Delete */}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9 flex-shrink-0 ml-4"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task);
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  );
}
