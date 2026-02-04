import { useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@/features/auth/context';
import { cn } from '@/lib/utils';
import {
  NotificationBell,
  Breadcrumbs,
  UserMenu,
} from '@/shared/components/composite';
import type { NotificationItem } from '@/shared/components/composite/NotificationBell/NotificationBell';
import type { BreadcrumbItem } from '@/shared/components/composite/Breadcrumbs/Breadcrumbs';
import { usePageHeaderContext } from './usePageHeaderContext';
import { TabBar } from '../TabBar';
import { FilterBar } from '../FilterBar';

export interface PageHeaderProps {
  title: string;
  count?: number;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  count: countProp,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  const contextValue = usePageHeaderContext();
  const count = countProp ?? contextValue?.count;
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const tabBarConfig = contextValue?.tabBarConfig;
  const filterBarConfig = contextValue?.filterBarConfig;

  return (
    <header
      className={cn(
        'bg-card sticky top-0 z-10 shrink-0 border-b shadow-sm',
        className
      )}
    >
      <div className="flex h-16 flex-1 items-center justify-between px-4">
        <div className="flex flex-col justify-center">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} className="mb-0.5" />
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-foreground text-xl font-semibold">{title}</h1>
            {count !== undefined && count > 0 && (
              <span className="bg-background-light-secondary text-text-tertiary rounded-lg px-3 py-1 text-base font-medium">
                {count}
              </span>
            )}
          </div>
        </div>

        <div className="ml-4 flex items-center gap-2 md:ml-6">
          {actions}
          <UserMenu
            user={{
              name: user?.name ?? '',
              email: user?.email,
            }}
            onLogout={logout}
          />
          <NotificationBell
            count={notifications.filter((n) => !n.isRead).length}
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
            onClearAll={handleClearAll}
          />
        </div>
      </div>

      {tabBarConfig && (
        <>
          <div className="border-border-default border-t" />
          <TabBar
            tabs={tabBarConfig.tabs}
            activeTab={tabBarConfig.activeTab}
            onTabChange={tabBarConfig.onTabChange}
            actions={tabBarConfig.actions}
            className="px-4 py-3"
          />
        </>
      )}

      {filterBarConfig && (
        <FilterBar
          filters={filterBarConfig.filters}
          onFilterChange={filterBarConfig.onFilterChange}
          sortOptions={filterBarConfig.sortOptions}
          sortValue={filterBarConfig.sortValue}
          onSortChange={filterBarConfig.onSortChange}
          filterGroups={filterBarConfig.filterGroups}
          filterPanelValue={filterBarConfig.filterPanelValue}
          onFilterPanelChange={filterBarConfig.onFilterPanelChange}
          filterPanelSingleSelect={filterBarConfig.filterPanelSingleSelect}
          viewMode={filterBarConfig.viewMode}
          onViewChange={filterBarConfig.onViewChange}
          showFilter={filterBarConfig.showFilter}
          showAddButton={filterBarConfig.showAddButton}
          onAddClick={filterBarConfig.onAddClick}
        />
      )}
    </header>
  );
}
