import { lazy } from 'react';
import { createPrivateRoute } from '@/shared/utils/route-helpers';
import { PAGE_ROUTES } from '@/shared/constants';

const ReportsPage = lazy(() => import('./pages'));

export const reportsRoutes = [
  createPrivateRoute(
    'reports',
    PAGE_ROUTES.REPORTS.ROOT,
    'reports',
    ReportsPage
  ),
];
