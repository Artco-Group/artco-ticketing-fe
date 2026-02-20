import { useApiQuery } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
  CACHE,
  type Activity,
  type DashboardStatsResponse,
} from '@artco-group/artco-ticketing-sync';

export function useActivities(limit?: number) {
  return useApiQuery<{ activities: Activity[] }>(
    QueryKeys.activities.recent(limit),
    {
      url: API_ROUTES.ACTIVITIES.BASE,
      params: limit ? { limit } : undefined,
      staleTime: CACHE.SHORT_STALE_TIME,
      refetchOnMount: 'always',
    }
  );
}

export function useDashboardStats() {
  return useApiQuery<DashboardStatsResponse>(QueryKeys.dashboard.stats(), {
    url: API_ROUTES.DASHBOARD.STATS,
    staleTime: CACHE.SHORT_STALE_TIME,
    refetchOnMount: 'always',
  });
}
