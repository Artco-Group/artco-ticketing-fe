import { useAuth } from '@/features/auth/context';
import EngLeadDashboard from '@/features/tickets/pages/EngLeadDashboard';
import DeveloperDashboard from '@/features/tickets/pages/DeveloperDashboard';
import ClientDashboard from '@/features/tickets/pages/ClientDashboard';
import { UserRole } from '@artco-group/artco-ticketing-sync/enums';
import { ErrorBoundary } from '@/shared/components/ui';

export default function DashboardRouter() {
  const { user } = useAuth();

  // Render appropriate dashboard based on user role
  switch (user?.role) {
    case UserRole.ENG_LEAD:
      return (
        <ErrorBoundary>
          <EngLeadDashboard />
        </ErrorBoundary>
      );
    case UserRole.DEVELOPER:
      return (
        <ErrorBoundary>
          <DeveloperDashboard />
        </ErrorBoundary>
      );
    case UserRole.CLIENT:
      return (
        <ErrorBoundary>
          <ClientDashboard />
        </ErrorBoundary>
      );
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
