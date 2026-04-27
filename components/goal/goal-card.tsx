'use client';

import { Target, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Goal } from '@/lib/api/service/goal-service';

interface GoalCardProps {
  goal: Goal;
  onClick?: (goalId: string) => void;
  onDelete?: (goal: Goal) => void;
  isLoading?: boolean;
}

export function GoalCard({ goal, onClick, onDelete, isLoading }: GoalCardProps) {
  return (
    <div
      className={`group flex items-center justify-between p-5 border border-border rounded-xl bg-card shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${isLoading ? 'animate-pulse bg-accent/5 pointer-events-none' : ''}`}
      onClick={() => onClick?.(goal.id)}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="p-3 bg-accent/10 rounded-xl flex-shrink-0">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-accent animate-spin" />
          ) : (
            <Target className="h-5 w-5 text-accent" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground truncate">{goal.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {goal.projectName || 'General Goal'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6 flex-shrink-0 ml-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">
            {goal.currentValue} / {goal.targetValue}
          </p>
          <p className="text-xs text-muted-foreground">{goal.unit}</p>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(goal);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
}
