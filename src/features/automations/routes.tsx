import { lazy } from 'react';
import { createPrivateRoute } from '@/shared/utils/route-helpers';
import { PAGE_ROUTES } from '@/shared/constants';

const AutomationsPage = lazy(() => import('./pages'));

export const automationsRoutes = [
  createPrivateRoute(
    'automations',
    PAGE_ROUTES.AUTOMATIONS.ROOT,
    'automations',
    AutomationsPage
  ),
];
