import { useAuth } from '@/features/auth/context';
import EngLeadDashboard from '@/features/tickets/pages/EngLeadDashboard';
import DeveloperDashboard from '@/features/tickets/pages/DeveloperDashboard';
import UserDashboard from '@/features/tickets/pages/ClientDashboard';
import { UserRole } from '@/types';

export default function Dashboard() {
  const { user } = useAuth();

  // Render appropriate dashboard based on user role
  switch (user?.role) {
    case UserRole.EngLead:
      return <EngLeadDashboard />;
    case UserRole.Developer:
      return <DeveloperDashboard />;
    case UserRole.Client:
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
