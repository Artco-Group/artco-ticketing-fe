// src/features/auth/components/RouteGuard.tsx
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context';
import { LoadingOverlay } from '@/shared/components/ui';
import { ROUTES } from '@/app/routes/constants';
import { UserRole } from '@/types';
import { hasRole } from '@/shared/utils/role-helpers';

interface RouteGuardProps {
  children: ReactNode;
  requiresAuth?: boolean;
  allowedRoles?: UserRole[];
}

export function RouteGuard({
  children,
  requiresAuth = true,
  allowedRoles,
}: RouteGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Protected route, user not authenticated
  if (requiresAuth && !isAuthenticated) {
    return (
      <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />
    );
  }

  // Public route, user is authenticated - redirect to dashboard
  if (!requiresAuth && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Still loading - show nothing (prevents flash)
  if (isLoading) {
    return <LoadingOverlay />;
  }

  // Role check
  if (allowedRoles && user && !hasRole(user, allowedRoles)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}

export default RouteGuard;
