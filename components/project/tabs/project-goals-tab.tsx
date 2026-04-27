'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Target, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Project } from '@/lib/api/service/project-service';
import { GoalCard } from '@/components/goal/goal-card';

interface ProjectGoalsTabProps {
  project: Project;
}

export function ProjectGoalsTab({ project }: ProjectGoalsTabProps) {
  const goals = project.goals || [];
  
  const totalGoals = goals.length;
  const onTrack = goals.filter((g) => g.status === 'IN_PROGRESS').length;
  const atRisk = goals.filter((g) => g.status === 'NOT_STARTED').length; // Simplification
  const completed = goals.filter((g) => g.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Goals Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
        {/* Total Goals */}
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="pt-4 lg:pt-6">
            <p className="text-xs lg:text-sm text-muted-foreground mb-2">Total Goals</p>
            <p className="text-2xl lg:text-3xl font-bold text-foreground">{totalGoals}</p>
          </CardContent>
        </Card>

        {/* On Track */}
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="pt-4 lg:pt-6">
            <p className="text-xs lg:text-sm text-muted-foreground mb-2">In Progress</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl lg:text-3xl font-bold text-accent">{onTrack}</p>
              <CheckCircle2 className="h-4 lg:h-5 w-4 lg:w-5 text-accent flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Not Started / At Risk */}
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="pt-4 lg:pt-6">
            <p className="text-xs lg:text-sm text-muted-foreground mb-2">Not Started</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl lg:text-3xl font-bold text-amber-600">{atRisk}</p>
              <AlertCircle className="h-4 lg:h-5 w-4 lg:w-5 text-amber-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Completed */}
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="pt-4 lg:pt-6">
            <p className="text-xs lg:text-sm text-muted-foreground mb-2">Completed</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl lg:text-3xl font-bold text-blue-600">{completed}</p>
              <TrendingUp className="h-4 lg:h-5 w-4 lg:w-5 text-blue-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <Card className="border border-border bg-card">
          <CardContent className="pt-6">
            <div className="py-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
              <Target className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No goals added to this project yet</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}
