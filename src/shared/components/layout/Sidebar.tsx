import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/shared/components/ui';
import type { IconName } from '@/shared/components/ui/Icon/Icon';
import { MenuItem } from '@/shared/components/composite/MenuItem';
import { SIDEBAR_WIDTH } from './sidebar.config';

export interface SidebarItem {
  id: string;
  label: string;
  icon: IconName;
  badge?: number;
}

export interface SidebarGroup {
  id: string;
  title: string;
  items: SidebarItem[];
  defaultExpanded?: boolean;
}

export interface SidebarFooterSection {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarWorkspace {
  name: string;
  logo?: ReactNode;
}

export interface SidebarPromoCard {
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick?: () => void;
}

export interface SidebarProps {
  items: SidebarItem[];
  groups?: SidebarGroup[];
  activeItem?: string;
  collapsed: boolean;
  onToggle: () => void;
  onNavigate: (id: string) => void;

  footerSections?: SidebarFooterSection[];
  promoCard?: SidebarPromoCard;

  className?: string;
}

export function Sidebar({
  items,
  groups = [],
  activeItem,
  collapsed,
  onToggle,
  onNavigate,
  footerSections = [],
  className,
}: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(groups.map((g) => [g.id, g.defaultExpanded ?? true]))
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

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
      aria-label="Application sidebar"
    >
      <div className="flex flex-grow flex-col overflow-y-auto">
        {/* Logo + Toggle */}
        <div
          className={cn(
            'flex items-center pt-3 pb-2',
            collapsed ? 'justify-center' : 'justify-between pr-2 pl-3'
          )}
        >
          {!collapsed && (
            <img
              src="/artco-group-logo-dark.svg"
              alt="Artco"
              className="h-6 w-auto"
            />
          )}
          <button
            type="button"
            className={cn(
              'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium',
              'focus-visible:ring-ring transition-colors focus-visible:ring-1 focus-visible:outline-none',
              'hover:bg-sidebar-accent text-sidebar-foreground/70'
            )}
            onClick={onToggle}
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

        {/* Navigation */}
        <nav
          className={cn('flex-1 space-y-4', collapsed ? 'px-2 pt-2' : 'pt-1')}
        >
          {/* Primary items */}
          <ul className={cn('space-y-0.5', !collapsed && 'px-0')}>
            {items.map((item) => (
              <li key={item.id} className="relative">
                <MenuItem
                  icon={item.icon}
                  label={item.label}
                  active={activeItem === item.id}
                  badge={item.badge}
                  onClick={() => onNavigate(item.id)}
                  collapsed={collapsed}
                />
              </li>
            ))}
          </ul>

          {/* Groups */}
          {groups.map((group) => {
            const isExpanded = expandedGroups[group.id] ?? true;

            return (
              <div key={group.id} className={cn(!collapsed && 'px-0')}>
                <button
                  type="button"
                  className={cn(
                    'text-sidebar-foreground/70 flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs font-medium tracking-wide',
                    'hover:bg-sidebar-accent'
                  )}
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isExpanded}
                >
                  {!collapsed && (
                    <Icon
                      name={isExpanded ? 'chevron-down' : 'chevron-right'}
                      size="md"
                    />
                  )}
                  <span className={cn('truncate', collapsed && 'sr-only')}>
                    {group.title}
                  </span>
                </button>

                {isExpanded && (
                  <ul className={cn('mt-1 space-y-1', !collapsed && 'pl-2')}>
                    {group.items.map((item) => (
                      <li key={item.id}>
                        <MenuItem
                          icon={item.icon}
                          label={item.label}
                          active={activeItem === item.id}
                          badge={item.badge}
                          onClick={() => onNavigate(item.id)}
                          collapsed={collapsed}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {footerSections.length > 0 && (
          <footer
            className={cn(
              'border-sidebar-border border-t px-0 py-3',
              collapsed && 'px-0'
            )}
          >
            {footerSections.map((section, idx) => (
              <div
                key={section.title ?? `footer-${idx}`}
                className={cn(
                  idx > 0 && 'mt-2',
                  collapsed && idx > 0 && 'mt-3'
                )}
              >
                {!collapsed && section.title && (
                  <p className="text-sidebar-foreground/70 px-2 pb-2 text-xs font-medium">
                    {section.title}
                  </p>
                )}
                <div
                  className={cn('flex flex-col gap-0.5', collapsed && 'gap-3')}
                >
                  {section.items.map((item) => (
                    <MenuItem
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      active={activeItem === item.id}
                      badge={item.badge}
                      onClick={() => onNavigate(item.id)}
                      collapsed={collapsed}
                      className="text-sidebar-foreground/70"
                    />
                  ))}
                </div>
              </div>
            ))}
          </footer>
        )}
      </div>
    </aside>
  );
}
