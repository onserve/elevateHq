'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Target, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { useGetGoals, useDeleteGoal } from '@/lib/query/use-goals';
import { PaginatedResponse } from '@/lib/api/server-api-client';
import { Goal } from '@/lib/api/service/goal-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GoalForm } from './goal-form';

export function GoalList({ initialData }: { initialData: PaginatedResponse<Goal> }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const { data } = useGetGoals({ page: 0, size: 10 }, initialData);
  // [8];
  const deleteGoal = useDeleteGoal();
  // [6];

  const allGoals = data?.content || initialData?.content || [];
  // [7];

  const filteredGoals = useMemo(() => {
    return allGoals.filter(
      (g) =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.projectName?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [allGoals, searchQuery]);

  const openCreate = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };
  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search goals..."
            className="pl-11 h-11 bg-muted/50 border-0 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={openCreate} className="h-11 px-6">
          <Plus className="mr-2 h-4 w-4" /> New Goal
        </Button>
      </div>

      {filteredGoals.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed rounded-2xl bg-muted/20">
          <Target className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-1">No goals found</p>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? 'Try adjusting your search' : 'Create a new goal to start tracking'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredGoals.map((goal) => (
          <div
            key={goal.id}
            className="group flex items-center justify-between p-5 border border-border rounded-xl bg-card shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-200"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="p-3 bg-accent/10 rounded-xl flex-shrink-0">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  className="font-semibold text-foreground cursor-pointer hover:text-accent transition-colors truncate"
                  onClick={() => openEdit(goal)}
                >
                  {goal.title}
                </h3>
                <p className="text-sm text-muted-foreground">
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
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9"
                onClick={() => deleteGoal.mutate(goal.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
          </DialogHeader>
          <GoalForm
            initial={editingGoal}
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
