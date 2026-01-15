import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/context';
import ProtectedRoute from '@/features/auth/components/RouteGuard';
import Dashboard from '@/features/dashboard/pages/DashboardRouter';
import LoginPage from '@/features/auth/pages/LoginPage';
import PasswordResetPage from '@/features/auth/pages/PasswordResetPage';
import { queryClient } from '@/shared/lib/query-client';

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
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
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
