import { lazy } from 'react';
import { PAGE_ROUTES } from '@/shared/constants';
import { createPrivateRoute } from '@/shared/utils/route-helpers';

const ClientsPage = lazy(() => import('./pages/ClientsPage'));

export const clientRoutes = [
  createPrivateRoute('clients', PAGE_ROUTES.CLIENTS.ROOT, ClientsPage),
];
