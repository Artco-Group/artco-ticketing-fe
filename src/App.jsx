import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import EngLeadDashboard from './pages/EngLeadDashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';
import UserDashboard from './pages/UserDashboard';
import LoginPage from './pages/LoginPage';
import PasswordResetPage from './pages/PasswordResetPage';

const DashboardRouter = () => {
  const { user } = useAuth();

  // Abdul Aziz
  // Test PR

  switch (user?.role) {
    case 'client':
      return <Navigate to="/dashboard/client" replace />;
    case 'developer':
      return <Navigate to="/dashboard/developer" replace />;
    case 'eng_lead':
      return <Navigate to="/dashboard/lead" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password/:token" element={<PasswordResetPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/lead"
            element={
              <ProtectedRoute allowedRoles={['eng_lead']}>
                <EngLeadDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/developer"
            element={
              <ProtectedRoute allowedRoles={['developer']}>
                <DeveloperDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/client"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
