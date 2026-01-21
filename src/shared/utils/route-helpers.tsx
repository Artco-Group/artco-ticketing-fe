import { Suspense, type ComponentType } from 'react';
import { type RouteObject } from 'react-router-dom';
import { RouteGuard } from '@features/auth/components/RouteGuard';
import { MainLayout } from '@shared/components/layout/MainLayout';
import { LoadingOverlay } from '@shared/components/ui/LoadingOverlay';
import { UserRole } from '@artco-group/artco-ticketing-sync/enums';

interface RouteOptions {
  roles?: UserRole[];
}

export function createPrivateRoute(
  path: string,
  Component: ComponentType,
  options: RouteOptions = {}
): RouteObject {
  return {
    path,
    element: (
      <RouteGuard requiresAuth allowedRoles={options.roles}>
        <MainLayout>
          <Suspense fallback={<LoadingOverlay />}>
            <Component />
          </Suspense>
        </MainLayout>
      </RouteGuard>
    ),
  };
}

export function createPublicRoute(
  path: string,
  Component: ComponentType
): RouteObject {
  return {
    path,
    element: (
      <RouteGuard requiresAuth={false}>
        <Suspense fallback={<LoadingOverlay />}>
          <Component />
        </Suspense>
      </RouteGuard>
    ),
  };
}

export function createSimpleRoute(
  path: string,
  Component: ComponentType
): RouteObject {
  return {
    path,
    element: (
      <Suspense fallback={<LoadingOverlay />}>
        <Component />
      </Suspense>
    ),
  };
}
