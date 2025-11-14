import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  documentCompletion: () => [...dashboardKeys.all, 'documentCompletion'] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardApi.getStats(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useDocumentCompletion() {
  return useQuery({
    queryKey: dashboardKeys.documentCompletion(),
    queryFn: () => dashboardApi.getDocumentCompletion(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
