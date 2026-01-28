import { NavLink } from 'react-router-dom';
import { useAuth } from '@/features/auth/context';
import { PAGE_ROUTES } from '@/shared/constants';
import { UserRole } from '@/types';
import { hasRole } from '@/shared/utils/role-helpers';
import { cn } from '@/lib/utils';
import { Button, Icon } from '@/shared/components/ui';

const navigation = [
  {
    name: 'Dashboard',
    href: PAGE_ROUTES.DASHBOARD.ROOT,
    icon: 'dashboard' as const,
    roles: [
      UserRole.CLIENT,
      UserRole.DEVELOPER,
      UserRole.ENG_LEAD,
      UserRole.ADMIN,
    ],
  },
  {
    name: 'Tickets',
    href: PAGE_ROUTES.TICKETS.LIST,
    icon: 'tickets' as const,
    roles: [
      UserRole.CLIENT,
      UserRole.DEVELOPER,
      UserRole.ENG_LEAD,
      UserRole.ADMIN,
    ],
  },
  {
    name: 'Users',
    href: PAGE_ROUTES.USERS.LIST,
    icon: 'user' as const,
    roles: [UserRole.ENG_LEAD, UserRole.ADMIN],
  },
  {
    name: 'Testing',
    href: PAGE_ROUTES.TESTING.LIST,
    icon: 'tasks' as const,
    roles: [UserRole.ENG_LEAD, UserRole.ADMIN],
  },
];

export function Sidebar() {
  const { user } = useAuth();

  const filteredNav = navigation.filter(
    (item) => !item.roles || hasRole(user, item.roles)
  );

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="bg-card flex flex-grow flex-col overflow-y-auto border-r pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          <span className="text-foreground text-xl font-bold">Ticketing</span>
        </div>
        <nav className="mt-8 flex-1 space-y-1 px-3">
          {filteredNav.map((item) => (
            <NavLink key={item.name} to={item.href} className="block">
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3',
                    isActive && 'bg-accent'
                  )}
                >
                  <Icon name={item.icon} size="md" />
                  {item.name}
                </Button>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
