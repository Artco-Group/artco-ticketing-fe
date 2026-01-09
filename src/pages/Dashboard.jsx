import { useAuth } from '../context/AuthContext';
import EngLeadDashboard from './EngLeadDashboard';
import DeveloperDashboard from './DeveloperDashboard';
import UserDashboard from './UserDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case 'eng_lead':
      return <EngLeadDashboard />;
    case 'developer':
      return <DeveloperDashboard />;
    case 'client':
      return <UserDashboard />;
    default:
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Invalid Role</h1>
            <p className="mt-2 text-gray-600">
              Your account has an invalid role. Please contact support.
            </p>
          </div>
        </div>
      );
  }
}

