import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/lib/api/service/dashboard-service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}
