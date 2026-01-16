import { useAuth } from '@/features/auth/context';
import { UserRole } from '@/types';

const UserRoleDisplay: Record<UserRole, string> = {
  [UserRole.Client]: 'Client',
  [UserRole.Developer]: 'Developer',
  [UserRole.EngLead]: 'Engineering Lead',
  [UserRole.Admin]: 'Admin',
};

export function Header() {
  const { user, logout } = useAuth();

  return (
    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
      <div className="flex flex-1 justify-end px-4">
        <div className="ml-4 flex items-center md:ml-6">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">
                {user?.role && UserRoleDisplay[user.role]}
              </p>
            </div>
            <button
              onClick={logout}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
