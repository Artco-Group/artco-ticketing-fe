import { Route } from 'react-router-dom';
import {
  Suspense,
  type LazyExoticComponent,
  type ComponentType,
  type JSX,
} from 'react';
import { LayoutWrapper } from '@/app/components/LayoutWrapper';
import { RouteGuard } from '@/features/auth/components/RouteGuard';
import { LoadingOverlay } from '@/shared/components/ui';

/**
 * Route helper utilities to eliminate repetition in route definitions
 * These functions provide consistent patterns for creating routes across features
 */

/**
 * Creates a private route with layout wrapper and suspense
 * Used for authenticated routes that need the main application layout
 */
export function createPrivateRoute(
  key: string,
  path: string,
  pageKey: string,
  Component: LazyExoticComponent<ComponentType<object>>
) {
  return (
    <Route
      key={key}
      path={path}
      element={
        <RouteGuard requiresAuth={true}>
          <Suspense fallback={<LoadingOverlay />}>
            <LayoutWrapper pageKey={pageKey}>
              <Component />
            </LayoutWrapper>
          </Suspense>
        </RouteGuard>
      }
    />
  );
}

/**
 * Creates a public route with suspense (no layout wrapper)
 * Used for public routes like login, register, password reset, etc.
 * Redirects authenticated users to dashboard
 */
export function createPublicRoute(
  key: string,
  path: string,
  Component: LazyExoticComponent<ComponentType<object>>
) {
  return (
    <Route
      key={key}
      path={path}
      element={
        <RouteGuard requiresAuth={false}>
          <Suspense fallback={<LoadingOverlay />}>
            <Component />
          </Suspense>
        </RouteGuard>
      }
    />
  );
}

/**
 * Creates a simple route with suspense only
 * Used for routes that don't need layout wrapper but still need lazy loading
 */
export function createSimpleRoute(
  key: string,
  path: string,
  Component: LazyExoticComponent<ComponentType<object>>
) {
  return (
    <Route
      key={key}
      path={path}
      element={
        <Suspense fallback={<LoadingOverlay />}>
          <Component />
        </Suspense>
      }
    />
  );
}

/**
 * Creates an auth-only route without layout wrapper
 * Used for routes that require authentication but should not show the main layout
 * Example: Force password change page (user must change password before accessing app)
 */
export function createAuthOnlyRoute(
  key: string,
  path: string,
  Component: LazyExoticComponent<ComponentType<object>>
) {
  return (
    <Route
      key={key}
      path={path}
      element={
        <RouteGuard requiresAuth={true}>
          <Suspense fallback={<LoadingOverlay />}>
            <Component />
          </Suspense>
        </RouteGuard>
      }
    />
  );
}

/**
 * Helper function to generate route key from route object key
 * Converts UPPER_CASE to kebab-case for route keys
 */
export function generateRouteKey(prefix: string, routeKey: string): string {
  const kebabKey = routeKey.toLowerCase().replace(/_/g, '-');
  return kebabKey === 'index' ? prefix : `${prefix}-${kebabKey}`;
}

/**
 * Maps route definitions to public routes
 * For manual route definitions that need custom keys
 */
export function mapToPublicRoutes(
  routeDefinitions: Array<{
    key: string;
    path: string;
    component: LazyExoticComponent<ComponentType<object>>;
  }>
): JSX.Element[] {
  return routeDefinitions.map(({ key, path, component }) =>
    createPublicRoute(key, path, component)
  );
}
