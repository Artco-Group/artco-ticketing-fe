import { lazy } from 'react';
import { createPrivateRoute } from '@shared/utils/route-helpers';
import { PAGE_ROUTES } from '@artco-group/artco-ticketing-sync/constants';

const DashboardRouter = lazy(() => import('./pages/DashboardRouter'));

export const dashboardRoutes = [
  createPrivateRoute(PAGE_ROUTES.DASHBOARD.ROOT, DashboardRouter),
];
