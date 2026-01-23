import { Route, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import { authRoutes } from '@/features/auth/routes';
import { userRoutes } from '@/features/users/routes';
import { dashboardRoutes } from '@/features/dashboard/routes';
import { ticketRoutes } from '@/features/tickets/routes';
import { createSimpleRoute } from '@/shared/utils/route-helpers';
import { PAGE_ROUTES } from '@/shared/constants';

// Lazy load 404 page
const NotFoundPage = lazy(() => import('@/shared/pages/NotFoundPage'));

/**
 * All application routes combined from feature-based route definitions
 * Each feature owns and manages its own routes for better maintainability
 * The 404 route is placed last as a catch-all for unmatched paths
 */
export const allRoutes = [
  // Redirect root to dashboard
  <Route
    key="home"
    path={PAGE_ROUTES.HOME}
    element={<Navigate to={PAGE_ROUTES.DASHBOARD.ROOT} replace />}
  />,

  // Feature routes
  ...authRoutes,
  ...dashboardRoutes,
  ...ticketRoutes,
  ...userRoutes,

  // 404 catch-all route - must be last
  createSimpleRoute('not-found', '*', NotFoundPage),
];

// Re-export route configurations for easy access
export {
  routeConfigs,
  getRouteConfig,
  getRoutesByGroup,
  getProtectedRoutes,
  getPublicRoutes,
} from '../config/route-configs';
export type { RouteConfig } from '../config/route-configs';

// Re-export individual feature route arrays for selective use
export { authRoutes, dashboardRoutes, ticketRoutes, userRoutes };
