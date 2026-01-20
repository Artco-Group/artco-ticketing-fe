import { lazy } from 'react';
import { createPrivateRoute } from '@shared/utils/route-helpers';
import { ROUTES } from '@/app/routes/constants';

const UsersPage = lazy(() => import('./pages/UsersPage'));

export const userRoutes = [createPrivateRoute(ROUTES.USERS.LIST, UsersPage)];
