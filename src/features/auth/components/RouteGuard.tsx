import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context';
import { LoadingOverlay } from '@/shared/components/ui';
import { PAGE_ROUTES } from '@/shared/constants';
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

  // Still loading - show nothing (prevents flash)
  if (isLoading) {
    return <LoadingOverlay />;
  }

  // Protected route, user not authenticated
  if (requiresAuth && !isAuthenticated) {
    return (
      <Navigate
        to={PAGE_ROUTES.AUTH.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  if (
    isAuthenticated &&
    user?.mustChangePassword &&
    location.pathname !== PAGE_ROUTES.AUTH.CHANGE_PASSWORD
  ) {
    return <Navigate to={PAGE_ROUTES.AUTH.CHANGE_PASSWORD} replace />;
  }

  // Public route, user is authenticated - redirect to dashboard
  if (!requiresAuth && isAuthenticated) {
    return <Navigate to={PAGE_ROUTES.DASHBOARD.ROOT} replace />;
  }

  // Role check
  if (allowedRoles && user && !hasRole(user, allowedRoles)) {
    return <Navigate to={PAGE_ROUTES.DASHBOARD.ROOT} replace />;
  }

  return <>{children}</>;
}

export default RouteGuard;
