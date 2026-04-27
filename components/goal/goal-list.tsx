'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Target, Trash2, Calendar, TrendingUp, Loader2 } from 'lucide-react';
import { useGetGoals, useDeleteGoal, useGoalDetails } from '@/lib/query/use-goals';
import { PaginatedResponse } from '@/lib/api/server-api-client';
import { Goal } from '@/lib/api/service/goal-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ListPagination } from '@/components/shared/list-pagination';
import { GoalForm } from './goal-form';

const PAGE_SIZE = 10;

export function GoalList({ initialData }: { initialData: PaginatedResponse<Goal> }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);

  const { data } = useGetGoals({ page, size: PAGE_SIZE }, initialData);
  const deleteGoal = useDeleteGoal();

  const { data: goalDetails, isLoading: isGoalLoading } = useGoalDetails(editingGoalId ?? undefined);

  useEffect(() => {
    if (editingGoalId && goalDetails && !isGoalLoading) {
      setIsFormOpen(true);
    }
  }, [editingGoalId, goalDetails, isGoalLoading]);

  // Reset to page 0 whenever search changes
  useEffect(() => { setPage(0); }, [searchQuery]);

  const allGoals = data?.content || initialData?.content || [];

  const filteredGoals = useMemo(() => {
    return allGoals.filter(
      (g) =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.projectName?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [allGoals, searchQuery]);

  const openCreate = () => {
    setEditingGoalId(null);
    setIsFormOpen(true);
  };
  const openEdit = (goalId: string) => {
    setEditingGoalId(goalId);
  };

  function handleDialogClose(open: boolean) {
    if (!open) {
      setIsFormOpen(false);
      setEditingGoalId(null);
    }
  }

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
          {filteredGoals.map((goal) => {
            const isLoadingThis = editingGoalId === goal.id && isGoalLoading;

            return (
          <div
            key={goal.id}
            className={`group flex items-center justify-between p-5 border border-border rounded-xl bg-card shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-200 cursor-pointer ${
                  isLoadingThis ? 'animate-pulse bg-accent/5 pointer-events-none' : ''
                }`}
                onClick={() => openEdit(goal.id)}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="p-3 bg-accent/10 rounded-xl flex-shrink-0">
                {isLoadingThis ? (
                      <Loader2 className="h-5 w-5 text-accent animate-spin" />
                    ) : (
                <Target className="h-5 w-5 text-accent" />
                    )}
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  className="font-semibold text-foreground truncate"
                >
                  {goal.title}
                </h3>
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
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletingGoal(goal);
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {data && (
        <ListPagination
          data={data}
          onPageChange={setPage}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingGoalId ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
          </DialogHeader>
          <GoalForm
            key={editingGoalId ?? 'create'}
            goalData={editingGoalId ? goalDetails : undefined}
            onSuccess={() => handleDialogClose(false)}
            onCancel={() => handleDialogClose(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog for Delete Confirmation */}
      <Dialog open={!!deletingGoal} onOpenChange={(open) => !open && setDeletingGoal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-foreground">
            Are you sure you want to delete the goal <span className="font-semibold text-destructive">{deletingGoal?.title}</span>? This action cannot be undone.
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setDeletingGoal(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deletingGoal) {
                  deleteGoal.mutate(deletingGoal.id);
                  setDeletingGoal(null);
                }
              }}
            >
              Delete Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}
