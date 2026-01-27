import { lazy } from 'react';
import { PAGE_ROUTES } from '@/shared/constants';
import { createPrivateRoute } from '@/shared/utils/route-helpers';

// Lazy load testing page
const TestingPage = lazy(() => import('./pages/TestingPage'));

/**
 * Shared/utility routes
 * Routes for testing, debugging, and other non-feature pages
 */
export const sharedRoutes = [
  createPrivateRoute(
    'testing',
    PAGE_ROUTES.TESTING.LIST,
    'testing',
    TestingPage
  ),
];
