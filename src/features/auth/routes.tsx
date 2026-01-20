import { lazy } from 'react';
import { createPublicRoute } from '@shared/utils/route-helpers';
import {
  PAGE_ROUTES,
  ROUTE_PATTERNS,
} from '@artco-group/artco-ticketing-sync/constants';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const PasswordResetPage = lazy(() => import('./pages/PasswordResetPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));

export const authRoutes = [
  createPublicRoute(PAGE_ROUTES.AUTH.LOGIN, LoginPage),
  createPublicRoute(PAGE_ROUTES.AUTH.FORGOT_PASSWORD, ForgotPasswordPage),
  createPublicRoute(ROUTE_PATTERNS.RESET_PASSWORD, PasswordResetPage),
];
