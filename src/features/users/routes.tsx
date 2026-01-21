import { lazy } from 'react';
import { createPrivateRoute } from '@shared/utils/route-helpers';
import { PAGE_ROUTES } from '@artco-group/artco-ticketing-sync/constants';

const UsersPage = lazy(() => import('./pages/UsersPage'));

export const userRoutes = [
  createPrivateRoute(PAGE_ROUTES.USERS.LIST, UsersPage),
];
