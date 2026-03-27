'use client';

import { Calendar, DollarSign, TrendingDown } from 'lucide-react';
import { Project } from '@/lib/api/service/project-service';

interface ProjectDetailHeaderProps {
  project: Project;
}

export function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  const progressPercentage = Math.round(project.progress || 0);

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-foreground text-sm lg:text-base">Overall Progress</h3>
          <span className="text-base font-bold text-foreground whitespace-nowrap">{progressPercentage}% Complete</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Key Metrics Row - Responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
        {/* Timeline */}
        <div className="p-4 lg:p-5 border border-border rounded-lg lg:rounded-xl bg-card">
          <div className="flex items-start justify-between mb-2 lg:mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm text-muted-foreground mb-1">Timeline</p>
              <p className="font-semibold text-foreground text-sm lg:text-base line-clamp-2">
                {project.startDate && project.endDate
                  ? `${new Date(project.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })} - ${new Date(project.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}`
                  : 'No dates set'}
              </p>
            </div>
            <Calendar className="h-4 lg:h-5 w-4 lg:w-5 text-muted-foreground flex-shrink-0" />
          </div>
        </div>

        {/* Budget */}
        <div className="p-4 lg:p-5 border border-border rounded-lg lg:rounded-xl bg-card">
          <div className="flex items-start justify-between mb-2 lg:mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm text-muted-foreground mb-1">Budget</p>
              <p className="font-semibold text-foreground text-sm lg:text-base">
                ${project.budget ? project.budget.toLocaleString('en-US') : '0.00'}
              </p>
            </div>
            <DollarSign className="h-4 lg:h-5 w-4 lg:w-5 text-muted-foreground flex-shrink-0" />
          </div>
        </div>

        {/* Spent */}
        <div className="p-4 lg:p-5 border border-border rounded-lg lg:rounded-xl bg-card">
          <div className="flex items-start justify-between mb-2 lg:mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm text-muted-foreground mb-1">Spent</p>
              <p className="font-semibold text-foreground text-sm lg:text-base">
                $0.00 (0%)
              </p>
            </div>
            <TrendingDown className="h-4 lg:h-5 w-4 lg:w-5 text-muted-foreground flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
