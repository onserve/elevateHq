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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search goals..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Goal
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredGoals.map((goal) => (
          <div
            key={goal.id}
            className="group flex items-center justify-between p-4 border rounded-xl bg-card hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3
                  className="font-medium cursor-pointer hover:underline"
                  onClick={() => openEdit(goal)}
                >
                  {goal.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {goal.projectName || 'General Goal'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <p className="text-sm font-semibold">
                  {goal.currentValue} / {goal.targetValue} {goal.unit}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 text-destructive"
                onClick={() => deleteGoal.mutate(goal.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

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
