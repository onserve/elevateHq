'use client';

import { Upload, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useDashboardStats } from '@/lib/query/use-dashboard';
import { NewProjectDialogTrigger } from './new-project-dialog-trigger';
import { formatCurrentDate, getTimeGreeting } from './dashboard-utils';

interface DashboardWelcomeHeaderProps {
  userName: string;
}

export function DashboardWelcomeHeader({ userName }: DashboardWelcomeHeaderProps) {
  const { data: stats, isLoading } = useDashboardStats();

  const subtitle = (() => {
    if (isLoading) return null;
    if (!stats) return 'Welcome back.';
    const parts: string[] = [];
    if (stats.projectsDueThisMonth > 0)
      parts.push(
        `${stats.projectsDueThisMonth} project${stats.projectsDueThisMonth > 1 ? 's' : ''} due this month`
      );
    if (stats.processingDocuments > 0)
      parts.push(
        `${stats.processingDocuments} document${stats.processingDocuments > 1 ? 's' : ''} waiting for review`
      );
    if (parts.length === 0) return "You're all caught up — great work!";
    return `You have ${parts.join(' and ')}.`;
  })();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Left — greeting */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1">{formatCurrentDate()}</p>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {getTimeGreeting()}, {userName.split(' ')[0]}.
        </h1>
        {isLoading ? (
          <div className="mt-2 h-4 w-64 bg-muted rounded animate-pulse" />
        ) : (
          <p className="mt-1.5 text-sm text-muted-foreground">
            {subtitle?.split(/([\d]+ projects?|[\d]+ documents?)/).map((part, i) =>
              /[\d]+ (projects?|documents?)/.test(part) ? (
                <strong key={i} className="font-semibold text-foreground">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        )}
      </div>

      {/* Right — action buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="default" asChild>
          <Link href="/documents">
            <Upload className="mr-2 h-4 w-4" />
            Upload Doc
          </Link>
        </Button>
        <NewProjectDialogTrigger>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </NewProjectDialogTrigger>
      </div>
    </div>
  );
}
