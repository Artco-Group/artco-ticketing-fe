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
