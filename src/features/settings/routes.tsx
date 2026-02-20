import { lazy, Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { RouteGuard } from '@/features/auth/components/RouteGuard';
import { LoadingOverlay } from '@/shared/components/ui';
import { PAGE_ROUTES } from '@/shared/constants/routes.constants';

const SettingsPage = lazy(() => import('./pages'));

export const settingsRoutes = [
  // Redirect /settings to /settings/profile
  <Route
    key="settings-root"
    path={PAGE_ROUTES.SETTINGS.ROOT}
    element={<Navigate to={PAGE_ROUTES.SETTINGS.PROFILE} replace />}
  />,
  // Workflow editor - new
  <Route
    key="settings-workflows-new"
    path={PAGE_ROUTES.SETTINGS.WORKFLOWS_NEW}
    element={
      <RouteGuard requiresAuth={true}>
        <Suspense fallback={<LoadingOverlay />}>
          <SettingsPage />
        </Suspense>
      </RouteGuard>
    }
  />,
  // Workflow editor - edit
  <Route
    key="settings-workflows-edit"
    path={PAGE_ROUTES.SETTINGS.WORKFLOWS_EDIT}
    element={
      <RouteGuard requiresAuth={true}>
        <Suspense fallback={<LoadingOverlay />}>
          <SettingsPage />
        </Suspense>
      </RouteGuard>
    }
  />,
  // Settings with section parameter
  <Route
    key="settings-section"
    path={`${PAGE_ROUTES.SETTINGS.ROOT}/:section`}
    element={
      <RouteGuard requiresAuth={true}>
        <Suspense fallback={<LoadingOverlay />}>
          <SettingsPage />
        </Suspense>
      </RouteGuard>
    }
  />,
];
