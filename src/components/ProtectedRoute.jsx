import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check if user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to correct dashboard based on user role
    switch (user.role) {
      case 'client':
        return <Navigate to="/dashboard/client" replace />;
      case 'developer':
        return <Navigate to="/dashboard/developer" replace />;
      case 'eng_lead':
        return <Navigate to="/dashboard/lead" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
}
