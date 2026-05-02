'use server';

import { serverApi } from '@/lib/api/server-api-client';

export interface DashboardStats {
  activeProjects: number;
  projectsDueThisMonth: number;
  totalDocuments: number;
  processingDocuments: number;
  monthlyRevenue: number;
  revenueChangePercent: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await serverApi.get<DashboardStats>('/dashboard/stats');
  return response.data;
}
