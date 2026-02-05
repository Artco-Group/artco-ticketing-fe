import { lazy, Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { RouteGuard } from '@/features/auth/components/RouteGuard';
import { LoadingOverlay } from '@/shared/components/ui';

const SettingsPage = lazy(() => import('./pages'));

export const settingsRoutes = [
  // Redirect /settings to /settings/profile
  <Route
    key="settings-root"
    path="/settings"
    element={<Navigate to="/settings/profile" replace />}
  />,
  // Settings with section parameter
  <Route
    key="settings-section"
    path="/settings/:section"
    element={
      <RouteGuard requiresAuth={true}>
        <Suspense fallback={<LoadingOverlay />}>
          <SettingsPage />
        </Suspense>
      </RouteGuard>
    }
  />,
];
