import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Icon } from '@/shared/components/ui';
import { SearchBar } from '@/shared/components/composite';
import { MenuItem } from '@/shared/components/composite/MenuItem';
import { SIDEBAR_WIDTH } from '@/shared/components/layout/sidebar.config';
import { useSettingsSidebar } from './useSettingsSidebar';
import type { IconName } from '@/shared/components/ui/Icon/Icon';

export interface SettingsSideBarItem {
  id: string;
  label: string;
  icon: IconName;
  href: string;
}

export interface SettingsSideBarGroup {
  title?: string;
  items: SettingsSideBarItem[];
}

interface SettingsSidebarProps {
  groups: SettingsSideBarGroup[];
  /** currently-active item id (optional). If provided, takes precedence over pathname-based active detection */
  activeItem?: string;
  /** optional navigation callback: receives `item.id` when an item is clicked. If omitted, items will render as links using `href` */
  onNavigate?: (id: string) => void;
  className?: string;
  onBackToTop?: () => void;
}

// `groups` are provided via props; default static nav groups removed to avoid unused constants.

export function SettingsSidebar({
  groups,
  onBackToTop,
  activeItem,
  onNavigate,
  className,
}: SettingsSidebarProps) {
  const location = useLocation();
  const { collapsed, setCollapsed } = useSettingsSidebar();
  const [searchValue, setSearchValue] = useState('');

  const isActive = (href: string) => {
    // If an explicit active id was provided, don't use href-based detection
    if (activeItem) return false;
    return (
      location.pathname === href || location.pathname.startsWith(href + '/')
    );
  };

  const filteredGroups = groups
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
        className
      )}
      style={{
        width: collapsed ? SIDEBAR_WIDTH.COLLAPSED : SIDEBAR_WIDTH.EXPANDED,
      }}
      aria-label="Settings sidebar"
    >
      <div className="flex flex-grow flex-col overflow-y-auto">
        {/* Search bar + Toggle */}
        <div
          className={cn(
            'flex items-center pt-3 pb-2',
            collapsed ? 'justify-center' : 'gap-2 pr-2 pl-3'
          )}
        >
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <SearchBar
                value={searchValue}
                placeholder="Search"
                onChange={setSearchValue}
                size="sm"
              />
            </div>
          )}
          <button
            type="button"
            className={cn(
              'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium',
              'focus-visible:ring-ring transition-colors focus-visible:ring-1 focus-visible:outline-none',
              'hover:bg-sidebar-accent text-sidebar-foreground/70'
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
              <Icon name="sidebar" size="sm" />
            </span>
          </button>
        </div>

        {/* Back to Top */}
        <div className={cn('py-2', collapsed ? 'px-2' : 'px-4')}>
          <button
            type="button"
            onClick={() => onBackToTop?.()}
            className={cn(
              'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
              'hover:bg-sidebar-accent text-sidebar-foreground/70',
              collapsed && 'justify-center px-0'
            )}
          >
            <Icon name="chevron-left" size="md" />
            {!collapsed && <span>Back to Top</span>}
          </button>
        </div>

        {/* Navigation Groups */}
        <nav
          className={cn('flex-1 space-y-4 pt-2', collapsed ? 'px-2' : 'px-2')}
        >
          {filteredGroups.map((group, idx) => (
            <div key={group.title || idx}>
              {!collapsed && group.title && (
                <p className="text-sidebar-foreground/50 mb-2 px-2 text-xs font-medium tracking-wide uppercase">
                  {group.title}
                </p>
              )}
              <ul
                className={cn(
                  'space-y-0.5',
                  !collapsed && 'px-2',
                  collapsed && 'space-y-1'
                )}
              >
                {group.items.map((item) => (
                  <li key={item.id} className="relative">
                    {onNavigate ? (
                      <MenuItem
                        icon={item.icon}
                        label={item.label}
                        onClick={() => onNavigate(item.id)}
                        active={activeItem ? activeItem === item.id : false}
                        collapsed={collapsed}
                      />
                    ) : (
                      <MenuItem
                        icon={item.icon}
                        label={item.label}
                        href={item.href}
                        active={isActive(item.href)}
                        collapsed={collapsed}
                      />
                    )}
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
