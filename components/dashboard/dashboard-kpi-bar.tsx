'use client';

import { Briefcase, FileText, TrendingUp } from 'lucide-react';
import { KpiCard } from './kpi-card';
import { useDashboardStats } from '@/lib/query/use-dashboard';
import { formatCurrency, formatPercent } from './dashboard-utils';

export function DashboardKpiBar() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <KpiCard
        label="Active Projects"
        value={stats?.activeProjects ?? '—'}
        subtitle={
          stats ? `${stats.projectsDueThisMonth} due this month` : 'Loading...'
        }
        icon={Briefcase}
        isLoading={isLoading}
      />
      <KpiCard
        label="Documents"
        value={stats?.totalDocuments ?? '—'}
        subtitle={
          stats ? `${stats.processingDocuments} processing now` : 'Loading...'
        }
        icon={FileText}
        isLoading={isLoading}
      />
      <KpiCard
        label="Monthly Revenue"
        value={stats ? formatCurrency(stats.monthlyRevenue) : '—'}
        subtitle={
          stats
            ? `${formatPercent(stats.revenueChangePercent)} vs last month`
            : 'Loading...'
        }
        icon={TrendingUp}
        iconBg={
          stats && stats.revenueChangePercent >= 0
            ? 'bg-green-100 dark:bg-green-900/30'
            : 'bg-red-100 dark:bg-red-900/30'
        }
        iconColor={
          stats && stats.revenueChangePercent >= 0
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }
        isLoading={isLoading}
      />
    </div>
  );
}
