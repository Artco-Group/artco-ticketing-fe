import { lazy } from 'react';
import { PAGE_ROUTES, ROUTE_PATTERNS } from '@/shared/constants';
import { mapToPublicRoutes } from '@/shared/utils/route-helpers';

// Lazy load auth pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const PasswordResetPage = lazy(() => import('./pages/PasswordResetPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const CheckEmailPage = lazy(() => import('./pages/CheckEmailPage'));

/**
 * Public authentication routes
 * Routes accessible without authentication (login, password reset, etc.)
 */
export const authRoutes = mapToPublicRoutes([
  { key: 'login', path: PAGE_ROUTES.AUTH.LOGIN, component: LoginPage },
  {
    key: 'forgot-password',
    path: PAGE_ROUTES.AUTH.FORGOT_PASSWORD,
    component: ForgotPasswordPage,
  },
  {
    key: 'check-email',
    path: PAGE_ROUTES.AUTH.CHECK_EMAIL,
    component: CheckEmailPage,
  },
  {
    key: 'reset-password',
    path: ROUTE_PATTERNS.RESET_PASSWORD,
    component: PasswordResetPage,
  },
]);
