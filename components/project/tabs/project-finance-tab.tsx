'use client';

import { Project } from '@/lib/api/service/project-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ProjectFinanceTabProps {
  project: Project;
}

export function ProjectFinanceTab({ project }: ProjectFinanceTabProps) {
  const budget = project.budget || 0;
  const spent = 0; // Placeholder
  const remaining = budget - spent;
  const spentPercentage = budget > 0 ? Math.round((spent / budget) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Budget Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {/* Total Budget */}
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-5 lg:pt-6">
            <p className="text-xs lg:text-sm text-muted-foreground mb-2">Total Budget</p>
            <div className="flex items-start justify-between gap-2">
              <p className="text-2xl lg:text-3xl font-bold text-foreground line-clamp-2">
                ${budget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <TrendingUp className="h-5 lg:h-6 w-5 lg:w-6 text-muted-foreground flex-shrink-0 mt-0.5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Spent */}
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-5 lg:pt-6">
            <p className="text-xs lg:text-sm text-muted-foreground mb-2">Total Spent</p>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-2xl lg:text-3xl font-bold text-foreground line-clamp-1">
                  ${spent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{spentPercentage}% of budget</p>
              </div>
              <TrendingDown className="h-5 lg:h-6 w-5 lg:w-6 text-muted-foreground flex-shrink-0 mt-0.5" />
            </div>
          </CardContent>
        </Card>

        {/* Remaining */}
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-5 lg:pt-6">
            <p className="text-xs lg:text-sm text-muted-foreground mb-2">Remaining</p>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-2xl lg:text-3xl font-bold text-foreground line-clamp-1">
                  ${remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(((remaining / budget) * 100) || 0)}% available
                </p>
              </div>
              <TrendingUp className="h-5 lg:h-6 w-5 lg:w-6 text-accent flex-shrink-0 mt-0.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Chart Placeholder */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Spending Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
            <p className="text-muted-foreground">Chart visualization will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
