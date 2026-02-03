import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Icon } from '@/shared/components/ui';
import { SearchBar } from '@/shared/components/composite';
import { MenuItem } from '@/shared/components/composite/MenuItem';
import { PAGE_ROUTES } from '@/shared/constants';
import { useSettingsSidebar } from './useSettingsSidebar';
import type { IconName } from '@/shared/components/ui/Icon/Icon';

interface SettingsNavItem {
  id: string;
  label: string;
  icon: IconName;
  href: string;
}

interface SettingsNavGroup {
  title: string;
  items: SettingsNavItem[];
}

const settingsNavGroups: SettingsNavGroup[] = [
  {
    title: 'Account',
    items: [
      {
        id: 'profile',
        label: 'Profile',
        icon: 'profile',
        href: '/settings/profile',
      },
      {
        id: 'notification',
        label: 'Notification',
        icon: 'notification',
        href: '/settings/notification',
      },
      {
        id: 'security',
        label: 'Security & Access',
        icon: 'security',
        href: '/settings/security',
      },
      {
        id: 'connected-account',
        label: 'Connected Account',
        icon: 'connected-account',
        href: '/settings/connected-account',
      },
      {
        id: 'integrations',
        label: 'Integrations',
        icon: 'integrations',
        href: '/settings/integrations',
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        id: 'preference',
        label: 'Preference',
        icon: 'preference',
        href: '/settings/preference',
      },
      {
        id: 'billing',
        label: 'Billing',
        icon: 'billing',
        href: '/settings/billing',
      },
      {
        id: 'application',
        label: 'Application',
        icon: 'application',
        href: '/settings/application',
      },
      {
        id: 'import-export',
        label: 'Import / Export',
        icon: 'import-export',
        href: '/settings/import-export',
      },
      { id: 'api', label: 'API', icon: 'api', href: '/settings/api' },
    ],
  },
];

export function SettingsSidebar() {
  const location = useLocation();
  const { collapsed, setCollapsed } = useSettingsSidebar();
  const [searchValue, setSearchValue] = useState('');

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + '/')
    );
  };

  const filteredGroups = settingsNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(searchValue.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside
      className={cn(
        'fixed inset-y-0 flex flex-col',
        'border-sidebar-border bg-sidebar text-sidebar-foreground border-r',
        'transition-[width] duration-300',
        collapsed ? 'w-20' : 'w-72'
      )}
      aria-label="Settings sidebar"
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

        {/* Back to Top */}
        <div className={cn('py-2', collapsed ? 'px-2' : 'px-4')}>
          <NavLink
            to={PAGE_ROUTES.DASHBOARD.ROOT}
            className={cn(
              'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
              'hover:bg-sidebar-accent text-sidebar-foreground/70',
              collapsed && 'justify-center px-0'
            )}
          >
            <Icon name="chevron-left" size="md" />
            {!collapsed && <span>Back to Top</span>}
          </NavLink>
        </div>

        {/* Navigation Groups */}
        <nav
          className={cn('flex-1 space-y-4 pt-2', collapsed ? 'px-2' : 'px-2')}
        >
          {filteredGroups.map((group) => (
            <div key={group.title} className={cn(!collapsed && 'px-2')}>
              {!collapsed && (
                <p className="text-sidebar-foreground/50 mb-2 px-2 text-xs font-medium tracking-wide uppercase">
                  {group.title}
                </p>
              )}
              <ul className={cn('space-y-0.5', collapsed && 'space-y-1')}>
                {group.items.map((item) => (
                  <li key={item.id} className="relative">
                    <MenuItem
                      icon={item.icon}
                      label={item.label}
                      href={item.href}
                      active={isActive(item.href)}
                      collapsed={collapsed}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <footer
          className={cn(
            'border-sidebar-border border-t px-3 py-3',
            collapsed && 'px-0'
          )}
        >
          <div className={cn('flex flex-col gap-2', collapsed && 'gap-3')}>
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
