import { lazy } from 'react';
import { PAGE_ROUTES } from '@/shared/constants';
import { createPrivateRoute } from '@/shared/utils/route-helpers';

const SubClientsPage = lazy(() => import('./pages/SubClientsPage'));

export const subClientRoutes = [
  createPrivateRoute('team', PAGE_ROUTES.SUB_CLIENTS.ROOT, SubClientsPage),
];
