import { lazy } from 'react';
import { PAGE_ROUTES } from '@/shared/constants';
import { createPrivateRoute } from '@/shared/utils/route-helpers';

// Lazy load dashboard page
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

/**
 * Dashboard feature routes
 * Main dashboard with role-based content
 */
export const dashboardRoutes = [
  createPrivateRoute(
    'dashboard',
    PAGE_ROUTES.DASHBOARD.ROOT,
    'dashboard',
    DashboardPage
  ),
];
