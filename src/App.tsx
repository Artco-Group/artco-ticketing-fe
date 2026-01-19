import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/features/auth/context';
import ProtectedRoute from '@/features/auth/components/RouteGuard';
import Dashboard from '@/features/dashboard/pages/DashboardRouter';
import LoginPage from '@/features/auth/pages/LoginPage';
import PasswordResetPage from '@/features/auth/pages/PasswordResetPage';
import { UsersPage } from '@/features/users';
import { queryClient } from '@/shared/lib';
import { ErrorBoundary } from '@/shared/components/ui';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/reset-password/:token"
                element={<PasswordResetPage />}
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Dashboard />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <UsersPage />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}

export default App;
