import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context';
import { PAGE_ROUTES } from '@/shared/constants';
import { UserRole } from '@/types';
import { hasRole } from '@/shared/utils/role-helpers';
import { cn } from '@/lib/utils';
import { Button, Icon } from '@/shared/components/ui';
import { SearchBar } from '../composite';
import { useSidebar } from './useSidebar';
import { MenuItem } from '@/shared/components/composite/MenuItem';

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
    // badge: notificationCount, // Add notification count when available
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

export function Sidebar({
  hideActiveIndicator = false,
}: { hideActiveIndicator?: boolean } = {}) {
  const { user } = useAuth();
  const location = useLocation();
  const { collapsed, setCollapsed } = useSidebar();
  const [groupsExpanded, setGroupsExpanded] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const filteredNav = navigation.filter(
    (item) =>
      (!item.roles || hasRole(user, item.roles)) &&
      item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredGroups = groups.filter((item) =>
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const isActive = (href: string) => {
    // Don't show active indicator when shown from settings page
    if (hideActiveIndicator) return false;
    if (href === '#') return false;
    return (
      location.pathname === href || location.pathname.startsWith(href + '/')
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
                  <p
                    className="text-sidebar-foreground text-h6 truncate"
                    title="Workspace"
                  >
                    Workspace
                  </p>
                </div>
                <Icon
                  name="chevron-selector"
                  size="lg"
                  className="text-sidebar-foreground/70 shrink-0"
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
              setCollapsed(!collapsed);
            }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span
              className={cn(
                'inline-flex transition-transform duration-200',
                collapsed && '-scale-x-100'
              )}
              aria-hidden
            >
              <Icon name="sidebar" size="md" />
            </span>
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-4 pb-2">
            <SearchBar
              value={searchValue}
              placeholder="Search"
              onChange={setSearchValue}
            />
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
                <MenuItem
                  icon={item.icon}
                  label={item.name}
                  href={item.href}
                  active={isActive(item.href)}
                  collapsed={collapsed}
                  hideActiveIndicator={hideActiveIndicator}
                />
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
                {filteredGroups.map((item) => (
                  <li key={item.id}>
                    <MenuItem
                      icon={item.icon}
                      label={item.name}
                      href={item.href}
                      active={isActive(item.href)}
                      collapsed={collapsed}
                      hideActiveIndicator={hideActiveIndicator}
                    />
                  </li>
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
            <MenuItem
              icon="settings"
              label="Settings"
              href={PAGE_ROUTES.SETTINGS}
              active={isActive(PAGE_ROUTES.SETTINGS)}
              collapsed={collapsed}
              className="text-sidebar-foreground/70"
            />
            <MenuItem
              icon="info"
              label="Help and first step"
              collapsed={collapsed}
              className="text-sidebar-foreground/70"
            />
          </div>
        </footer>
      </div>
    </aside>
  );
}
