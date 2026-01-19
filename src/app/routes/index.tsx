// src/app/routes/index.tsx
import { Navigate, type RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { authRoutes } from '@/features/auth/routes';
import { ticketRoutes } from '@/features/tickets/routes';
import { userRoutes } from '@/features/users/routes';
import { dashboardRoutes } from '@features/dashboard/routes';
import { createSimpleRoute } from '@shared/utils/route-helpers';
import { ROUTES } from './constants';

const NotFoundPage = lazy(() => import('@/shared/pages/NotFoundPage'));

export const allRoutes: RouteObject[] = [
  // Redirect root to dashboard
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },

  // Feature routes
  ...authRoutes,
  ...dashboardRoutes,
  ...ticketRoutes,
  ...userRoutes,

  // 404 fallback
  createSimpleRoute('*', NotFoundPage),
];
