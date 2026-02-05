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
import type { Tab } from '../TabBar';
import { TabBar } from '../TabBar';
import { FilterBar } from '../FilterBar';
import type {
  FilterConfig,
  ViewMode,
  FilterGroup,
  FilterPanelValues,
} from '../FilterBar';

export interface PageHeaderProps {
  title: string;
  count?: number;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;

  /** Tab bar (Row 2) */
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  tabActions?: ReactNode;

  /** Filter bar (Row 3) */
  filters?: FilterConfig[];
  onFilterChange?: (filterId: string, value: string | null) => void;
  sortOptions?: string[];
  sortValue?: string | null;
  onSortChange?: (value: string | null) => void;
  filterGroups?: FilterGroup[];
  filterPanelValue?: FilterPanelValues;
  onFilterPanelChange?: (value: FilterPanelValues) => void;
  filterPanelSingleSelect?: boolean;
  viewMode?: ViewMode;
  onViewChange?: (mode: ViewMode) => void;
  showFilter?: boolean;
  showAddButton?: boolean;
  onAddClick?: () => void;
  addButtonLabel?: string;
}

export function PageHeader({
  title,
  count,
  breadcrumbs,
  actions,
  className,
  tabs,
  activeTab,
  onTabChange,
  tabActions,
  filters,
  onFilterChange,
  sortOptions,
  sortValue,
  onSortChange,
  filterGroups,
  filterPanelValue,
  onFilterPanelChange,
  filterPanelSingleSelect,
  viewMode,
  onViewChange,
  showFilter,
  showAddButton,
  onAddClick,
  addButtonLabel,
}: PageHeaderProps) {
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

  const hasTabBar = tabs && activeTab !== undefined && onTabChange;
  const hasFilterBar =
    filters || sortOptions || filterGroups || onViewChange || showAddButton;

  return (
    <header className={cn('bg-card sticky top-0 z-10 shrink-0', className)}>
      <div className="border-border-default flex h-16 flex-1 items-center justify-between border-b px-4">
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

      {hasTabBar && (
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          actions={tabActions}
          className="px-4 py-3"
        />
      )}

      {hasFilterBar && (
        <FilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          sortOptions={sortOptions}
          sortValue={sortValue}
          onSortChange={onSortChange}
          filterGroups={filterGroups}
          filterPanelValue={filterPanelValue}
          onFilterPanelChange={onFilterPanelChange}
          filterPanelSingleSelect={filterPanelSingleSelect}
          viewMode={viewMode}
          onViewChange={onViewChange}
          showFilter={showFilter}
          showAddButton={showAddButton}
          onAddClick={onAddClick}
          addButtonLabel={addButtonLabel}
        />
      )}
    </header>
  );
}
