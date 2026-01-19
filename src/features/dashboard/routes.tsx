// src/features/dashboard/routes.tsx
import { lazy } from 'react';
import { createPrivateRoute } from '@shared/utils/route-helpers';
import { ROUTES } from '@/app/routes/constants';

const DashboardRouter = lazy(() => import('./pages/DashboardRouter'));

export const dashboardRoutes = [
  createPrivateRoute(ROUTES.DASHBOARD, DashboardRouter),
];
