// components/dashboard/shell.tsx
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return <div className={cn('flex min-h-screen bg-background', className)}>{children}</div>;
}
