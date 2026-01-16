// src/features/auth/routes.tsx
import { lazy } from 'react';
import { createPublicRoute } from '@shared/utils/route-helpers';
import { ROUTES, ROUTE_PATTERNS } from '@/app/routes/constants';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const PasswordResetPage = lazy(() => import('./pages/PasswordResetPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));

export const authRoutes = [
  createPublicRoute(ROUTES.AUTH.LOGIN, LoginPage),
  createPublicRoute(ROUTES.AUTH.FORGOT_PASSWORD, ForgotPasswordPage),
  createPublicRoute(ROUTE_PATTERNS.RESET_PASSWORD, PasswordResetPage),
];
