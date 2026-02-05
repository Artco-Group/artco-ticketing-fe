import { lazy } from 'react';
import { PAGE_ROUTES } from '@/shared/constants';
import { createPrivateRoute } from '@/shared/utils/route-helpers';

// Lazy load testing page
const TestingPage = lazy(() => import('@/shared/pages/TestingPage'));

/**
 * Shared/utility routes that don't belong to a specific feature
 */
export const sharedRoutes = [
  createPrivateRoute('testing', PAGE_ROUTES.TESTING.LIST, TestingPage),
];
