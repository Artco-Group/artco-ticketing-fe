import { Navigate, type RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { authRoutes } from '@/features/auth/routes';
import { ticketRoutes } from '@/features/tickets/routes';
import { userRoutes } from '@/features/users/routes';
import { dashboardRoutes } from '@features/dashboard/routes';
import { createSimpleRoute } from '@shared/utils/route-helpers';
import { PAGE_ROUTES } from '@artco-group/artco-ticketing-sync/constants';

const NotFoundPage = lazy(() => import('@/shared/pages/NotFoundPage'));

export const allRoutes: RouteObject[] = [
  // Redirect root to dashboard
  {
    path: PAGE_ROUTES.HOME,
    element: <Navigate to={PAGE_ROUTES.DASHBOARD.ROOT} replace />,
  },

  // Feature routes
  ...authRoutes,
  ...dashboardRoutes,
  ...ticketRoutes,
  ...userRoutes,

  // 404 fallback
  createSimpleRoute('*', NotFoundPage),
];
