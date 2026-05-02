'use client';

import Link from 'next/link';
import { Briefcase, ArrowRight, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useProjects } from '@/lib/query/use-projects';
import { ProjectListview } from '@/lib/api/service/project-service';
import {
  getProjectStatusBadge,
  getProjectStatusLabel,
  getPriorityBadge,
  formatShortDate,
  formatCurrency,
} from './dashboard-utils';

const FEED_SIZE = 5;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProjectRowSkeleton() {
  return (
    <div className="py-4 px-1 space-y-2 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 w-40 bg-muted rounded" />
        <div className="h-4 w-20 bg-muted rounded-full" />
      </div>
      <div className="h-3 w-28 bg-muted rounded" />
    </div>
  );
}

// ─── Project Row ──────────────────────────────────────────────────────────────

function ProjectRow({ project }: { project: ProjectListview }) {
  // Cast to pick up optional `progress` if the backend ever returns it
  const p = project as ProjectListview & { progress?: number };

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block py-4 px-1 border-b border-border last:border-b-0 hover:bg-muted/30 -mx-1 px-2 rounded-lg transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-sm text-foreground truncate">
            {project.name}
          </span>
          <span
            className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getPriorityBadge(project.priority)}`}
          >
            {project.priority}
          </span>
        </div>
        <span
          className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${getProjectStatusBadge(project.status)}`}
        >
          {getProjectStatusLabel(project.status)}
        </span>
      </div>

      {/* Progress bar (shows only if API returns progress) */}
      {p.progress !== undefined && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span className="font-medium text-foreground">{p.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${p.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Meta row */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
        <span>{project.totalTasks} task{project.totalTasks !== 1 ? 's' : ''}</span>
        <div className="flex items-center gap-3">
          {project.budget && (
            <span>{formatCurrency(project.budget)}</span>
          )}
          {project.endDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatShortDate(project.endDate)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Feed ─────────────────────────────────────────────────────────────────────

export function DashboardProjectsFeed() {
  const { data, isLoading } = useProjects({ size: FEED_SIZE, sort: 'updatedAt,desc' });
  const projects = data?.content ?? [];

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="pb-0 pt-5 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-accent/10 rounded-lg">
              <Briefcase className="h-4 w-4 text-accent" />
            </div>
            <span className="font-semibold text-foreground">Active Projects</span>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors font-medium"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="pt-2 px-5 pb-5">
        {isLoading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProjectRowSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-center">
            <Briefcase className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground mb-1">No active projects</p>
            <p className="text-xs text-muted-foreground">
              Create your first project to get started
            </p>
          </div>
        ) : (
          <div>
            {projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
