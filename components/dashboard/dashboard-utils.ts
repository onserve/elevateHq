// Shared formatting and status utilities for dashboard components
// Kept in one place to avoid duplication across feed/KPI/header components.

// ─── Greeting ────────────────────────────────────────────────────────────────

export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function formatCurrentDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Currency / Numbers ───────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(0)}%`;
}

// ─── Date ─────────────────────────────────────────────────────────────────────

export function formatShortDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Project Status ───────────────────────────────────────────────────────────

export function getProjectStatusBadge(status: string): string {
  switch (status) {
    case 'PLANNING':
      return 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    case 'IN_PROGRESS':
      return 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
    case 'ON_HOLD':
      return 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    default:
      return 'bg-gray-100 text-gray-600 border border-gray-200';
  }
}

export function getProjectStatusLabel(status: string): string {
  switch (status) {
    case 'IN_PROGRESS': return 'IN PROGRESS';
    case 'ON_HOLD':     return 'ON HOLD';
    default:            return status;
  }
}

export function getPriorityBadge(priority: string): string {
  switch (priority) {
    case 'URGENT': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'HIGH':   return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    case 'MEDIUM': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'LOW':    return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    default:       return 'bg-gray-100 text-gray-600';
  }
}

// ─── Document Status ──────────────────────────────────────────────────────────

export type DocStatus = 'PROCESSING' | 'ARCHIVED' | 'FAILED' | 'UPLOADED' | 'COMPLETED';

export function getDocumentStatusLabel(status: DocStatus): string {
  switch (status) {
    case 'COMPLETED':  return 'Processed';
    case 'PROCESSING': return 'Processing...';
    case 'UPLOADED':   return 'Uploaded';
    case 'FAILED':     return 'Failed';
    case 'ARCHIVED':   return 'Archived';
    default:           return status;
  }
}

export function getDocumentStatusColor(status: DocStatus): string {
  switch (status) {
    case 'COMPLETED':  return 'text-green-600 dark:text-green-400';
    case 'PROCESSING': return 'text-amber-600 dark:text-amber-400';
    case 'UPLOADED':   return 'text-blue-600 dark:text-blue-400';
    case 'FAILED':     return 'text-red-600 dark:text-red-400';
    case 'ARCHIVED':   return 'text-muted-foreground';
    default:           return 'text-muted-foreground';
  }
}

export function getConfidenceColor(score: number): string {
  if (score >= 0.9) return 'text-green-600 dark:text-green-400';
  if (score >= 0.7) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}
