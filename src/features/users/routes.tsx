import { lazy } from 'react';
import { PAGE_ROUTES } from '@/shared/constants';
import { createPrivateRoute } from '@/shared/utils/route-helpers';

// Lazy load user pages
const UsersPage = lazy(() => import('./pages/UsersPage'));

/**
 * User management routes
 * Admin functionality for managing system users
 */
export const userRoutes = [
  createPrivateRoute('users', PAGE_ROUTES.USERS.LIST, 'users', UsersPage),
];
