import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context';
import { PAGE_ROUTES } from '@/shared/constants';
import { UserRole } from '@/types';
import { hasRole } from '@/shared/utils/role-helpers';
import { cn } from '@/lib/utils';
import { Button, Icon, Input } from '@/shared/components/ui';

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
    name: 'Inbox',
    href: PAGE_ROUTES.INBOX.ROOT,
    icon: 'inbox' as const,
    roles: [
      UserRole.CLIENT,
      UserRole.DEVELOPER,
      UserRole.ENG_LEAD,
      UserRole.ADMIN,
    ],
  },
  {
    name: 'Tasks',
    href: PAGE_ROUTES.TICKETS.LIST,
    icon: 'tasks' as const,
    roles: [
      UserRole.CLIENT,
      UserRole.DEVELOPER,
      UserRole.ENG_LEAD,
      UserRole.ADMIN,
    ],
  },
  {
    name: 'Zaposleni',
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
  {
    name: 'Notes',
    href: PAGE_ROUTES.NOTES.ROOT,
    icon: 'notes' as const,
    roles: [
      UserRole.CLIENT,
      UserRole.DEVELOPER,
      UserRole.ENG_LEAD,
      UserRole.ADMIN,
    ],
  },
  {
    name: 'Reports',
    href: PAGE_ROUTES.REPORTS.ROOT,
    icon: 'reports' as const,
    roles: [
      UserRole.CLIENT,
      UserRole.DEVELOPER,
      UserRole.ENG_LEAD,
      UserRole.ADMIN,
    ],
  },
  {
    name: 'Automations',
    href: PAGE_ROUTES.AUTOMATIONS.ROOT,
    icon: 'automations' as const,
    roles: [
      UserRole.CLIENT,
      UserRole.DEVELOPER,
      UserRole.ENG_LEAD,
      UserRole.ADMIN,
    ],
  },
];

const groups = [
  {
    id: 'sales',
    name: 'Sales',
    href: '#',
    icon: 'pin' as const,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    href: '#',
    icon: 'pin' as const,
  },
  {
    id: 'invoice',
    name: 'Invoice',
    href: '#',
    icon: 'pin' as const,
  },
  {
    id: 'people',
    name: 'People',
    href: '#',
    icon: 'pin' as const,
  },
];

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [groupsExpanded, setGroupsExpanded] = useState(true);

  // Keep sidebar collapsed on smaller screens so content doesn't clip
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredNav = navigation.filter(
    (item) => !item.roles || hasRole(user, item.roles)
  );

  const isActive = (href: string) => {
    if (href === '#') return false;
    return (
      location.pathname === href || location.pathname.startsWith(href + '/')
    );
  };

  const renderNavItem = (item: (typeof navigation)[0]) => {
    const active = isActive(item.href);

    return (
      <NavLink
        key={item.name}
        to={item.href}
        className={cn(
          'flex items-center rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          collapsed && 'justify-center px-0'
        )}
      >
        <Icon
          name={item.icon}
          size={collapsed ? 'lg' : 'xl'}
          className={cn(!collapsed && 'mr-3')}
        />
        {!collapsed && <span className="truncate">{item.name}</span>}
        {active && !collapsed && (
          <div className="bg-sidebar-primary absolute top-0 left-0 h-full w-1 rounded-r" />
        )}
      </NavLink>
    );
  };

  const renderGroupItem = (item: (typeof groups)[0]) => {
    return (
      <NavLink
        key={item.id}
        to={item.href}
        className={cn(
          'flex items-center rounded-md px-3 py-2 text-sm transition-colors',
          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          collapsed && 'justify-center px-0'
        )}
      >
        <Icon
          name={item.icon}
          size={collapsed ? 'md' : 'lg'}
          className={cn(!collapsed && 'mr-2')}
        />
        {!collapsed && <span className="truncate">{item.name}</span>}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        'fixed inset-y-0 flex flex-col',
        'border-sidebar-border bg-sidebar text-sidebar-foreground border-r',
        'transition-[width] duration-300',
        collapsed ? 'w-20' : 'w-72'
      )}
      aria-label="Application sidebar"
    >
      <div className="flex flex-grow flex-col overflow-y-auto">
        {/* Header / Workspace selector */}
        <div
          className={cn(
            'flex pt-4 pb-3',
            collapsed
              ? 'flex-col items-center gap-2 px-0'
              : 'items-center justify-between px-4'
          )}
        >
          <button
            type="button"
            className={cn(
              'flex items-center gap-2 rounded-md px-2 py-1 text-left transition-colors',
              'hover:bg-sidebar-accent',
              collapsed && 'justify-center px-0'
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-600 text-[11px] font-semibold text-white uppercase">
              ws
            </div>
            {!collapsed && (
              <>
                <div className="min-w-0">
                  <p className="text-sidebar-foreground text-h6 truncate">
                    Workspace
                  </p>
                </div>
                <Icon
                  name="chevron-selector"
                  size="lg"
                  className="text-sidebar-foreground/70 ml-1 shrink-0"
                  aria-label="Switch workspace"
                />
              </>
            )}
          </button>

          <button
            type="button"
            className={cn(
              'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-medium',
              'focus-visible:ring-ring transition-colors focus-visible:ring-1 focus-visible:outline-none',
              'hover:bg-accent hover:text-accent-foreground',
              collapsed ? 'mx-auto' : 'ml-2'
            )}
            onClick={() => {
              if (window.innerWidth < 1024) return;
              setCollapsed((prev) => !prev);
            }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon
              name="sidebar"
              size="lg"
              className={cn(
                'transition-transform',
                collapsed && '-scale-x-100'
              )}
            />
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-4 pb-3">
            <div className="relative">
              <div className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center">
                <Icon
                  name="search"
                  size="md"
                  className="text-sidebar-foreground/60"
                  aria-label="Search"
                />
              </div>
              <Input
                type="search"
                placeholder="Search"
                className="border-sidebar-border bg-sidebar h-9 w-full rounded-lg border pl-10 text-sm"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav
          className={cn(
            'flex-1 space-y-4',
            collapsed ? 'px-2 pt-2' : 'px-2 pt-1'
          )}
        >
          {/* Primary items */}
          <ul className={cn('space-y-0.5', !collapsed && 'px-2')}>
            {filteredNav.map((item) => (
              <li key={item.name} className="relative">
                {renderNavItem(item)}
              </li>
            ))}
          </ul>

          {/* Groups */}
          <div className={cn(!collapsed && 'px-2')}>
            <button
              type="button"
              className={cn(
                'text-sidebar-foreground/70 flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs font-medium tracking-wide uppercase',
                'hover:bg-sidebar-accent'
              )}
              onClick={() => setGroupsExpanded((prev) => !prev)}
              aria-expanded={groupsExpanded}
            >
              {!collapsed && (
                <Icon
                  name={groupsExpanded ? 'chevron-up' : 'chevron-down'}
                  size="lg"
                />
              )}
              <span className={cn('truncate', collapsed && 'sr-only')}>
                Grupe
              </span>
            </button>

            {groupsExpanded && (
              <ul className={cn('mt-1 space-y-1', !collapsed && 'pl-2')}>
                {groups.map((item) => (
                  <li key={item.id}>{renderGroupItem(item)}</li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        {/* Promo card */}
        {!collapsed && (
          <div className="px-4 pt-2 pb-3">
            <div className="bg-sidebar-accent rounded-2xl p-4 text-center">
              <div className="bg-greyscale-900 mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl text-white">
                <span className="text-lg font-semibold">★</span>
              </div>
              <p className="text-sidebar-foreground mb-1 text-sm font-semibold">
                Get Asset save up to 25%
              </p>
              <p className="text-sidebar-foreground/80 mb-3 text-xs">
                Become a member and get your first download for free.
              </p>
              <Button
                type="button"
                size="sm"
                className="bg-greyscale-900 hover:bg-greyscale-800 h-8 w-full rounded-lg text-xs font-medium text-white"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer
          className={cn(
            'border-sidebar-border border-t px-3 py-3',
            collapsed && 'px-0'
          )}
        >
          <div className={cn('flex flex-col gap-2', collapsed && 'gap-3')}>
            <button
              type="button"
              className={cn(
                'text-sidebar-foreground/70 flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-0'
              )}
            >
              <Icon name="settings" size="lg" />
              {!collapsed && <span>Settings</span>}
            </button>

            <button
              type="button"
              className={cn(
                'text-sidebar-foreground/70 flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-0'
              )}
            >
              <Icon name="info" size="lg" />
              {!collapsed && <span>Help and first step</span>}
            </button>
          </div>
        </footer>
      </div>
    </aside>
  );
}
