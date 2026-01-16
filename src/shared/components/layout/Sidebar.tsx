import { NavLink } from 'react-router-dom';
import { useAuth } from '@/features/auth/context';
import { ROUTES } from '@/app/routes/constants';
import { UserRole } from '@/types';
import { hasRole } from '@/shared/utils/role-helpers';

const navigation = [
  {
    name: 'Dashboard',
    href: ROUTES.DASHBOARD,
    roles: [UserRole.Client, UserRole.Developer, UserRole.EngLead],
  },
  { name: 'All Tickets', href: ROUTES.TICKETS.LIST, roles: [UserRole.EngLead] },
  { name: 'Users', href: ROUTES.USERS.LIST, roles: [UserRole.EngLead] },
];

export function Sidebar() {
  const { user } = useAuth();

  const filteredNav = navigation.filter(
    (item) => !item.roles || hasRole(user, item.roles)
  );

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          <span className="text-xl font-bold text-gray-900">Ticketing</span>
        </div>
        <nav className="mt-8 flex-1 space-y-1 px-2">
          {filteredNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

// Legacy Sidebar component for backward compatibility
type CurrentView = 'tickets' | 'detail' | 'users';

interface LegacySidebarProps {
  userEmail: string;
  currentView: CurrentView;
  onLogout: () => void;
  onNavigateToTickets: () => void;
  onNavigateToUsers: () => void;
}

function LegacySidebar({
  userEmail,
  currentView,
  onLogout,
  onNavigateToTickets,
  onNavigateToUsers,
}: LegacySidebarProps) {
  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Company Logo */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#004179]">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <span className="font-semibold text-gray-900">Artco Group</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={onNavigateToTickets}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                currentView === 'tickets' || currentView === 'detail'
                  ? 'bg-[#004179] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="9" y1="16" x2="13" y2="16" />
              </svg>
              All Tickets
            </button>
          </li>
          <li>
            <button
              onClick={onNavigateToUsers}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                currentView === 'users'
                  ? 'bg-[#004179] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              User Management
            </button>
          </li>
        </ul>
      </nav>

      {/* User Info */}
      <div className="border-t border-gray-200 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
            <span className="text-sm font-medium text-gray-600"></span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {userEmail}
            </p>
            <p className="text-xs text-gray-500">Network Lead</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full text-left text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

// Default export for backward compatibility
export default LegacySidebar;
