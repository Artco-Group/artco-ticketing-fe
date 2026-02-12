import type { ReactNode } from 'react';
import { PageHeader } from '@/shared/components/patterns/PageHeader/PageHeader';
import type { Tab } from '@/shared/components/patterns/TabBar';
import { TabBar } from '@/shared/components/patterns/TabBar';
import { FilterBar } from '@/shared/components/patterns/FilterBar';
import type {
  FilterConfig,
  ViewMode,
  FilterGroup,
  FilterPanelValues,
  GroupByOption,
} from '@/shared/components/patterns/FilterBar';
import type { BreadcrumbItem } from '@/shared/components/composite/Breadcrumbs/Breadcrumbs';
import { SpinnerContainer, EmptyState } from '@/shared/components/ui';

export interface ListPageLayoutProps {
  title: string;
  count?: number;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;

  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  tabActions?: ReactNode;

  filters?: FilterConfig[];
  onFilterChange?: (filterId: string, value: string | null) => void;
  sortOptions?: string[];
  sortValue?: string | null;
  onSortChange?: (value: string | null) => void;
  groupByOptions?: GroupByOption[];
  groupByValue?: string | null;
  onGroupByChange?: (value: string | null) => void;
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

  loading?: boolean;
  empty?: boolean;
  emptyState?: ReactNode;
  loadingMessage?: string;

  children: ReactNode;
  className?: string;
}

export function ListPageLayout({
  title,
  count,
  breadcrumbs,
  actions,
  tabs,
  activeTab,
  onTabChange,
  tabActions,
  filters,
  onFilterChange,
  sortOptions,
  sortValue,
  onSortChange,
  groupByOptions,
  groupByValue,
  onGroupByChange,
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
  loading,
  empty,
  emptyState,
  loadingMessage,
  children,
}: ListPageLayoutProps) {
  const hasTabBar = tabs && activeTab !== undefined && onTabChange;
  const hasFilterBar =
    filters || sortOptions || filterGroups || onViewChange || showAddButton;

  return (
    <>
      <header className="bg-card sticky top-0 z-10 shrink-0">
        <PageHeader
          title={title}
          count={count}
          breadcrumbs={breadcrumbs}
          actions={actions}
        />

        {hasTabBar && (
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            actions={tabActions}
            className="px-4 py-2"
          />
        )}

        {hasFilterBar && (
          <FilterBar
            filters={filters}
            onFilterChange={onFilterChange}
            sortOptions={sortOptions}
            sortValue={sortValue}
            onSortChange={onSortChange}
            groupByOptions={groupByOptions}
            groupByValue={groupByValue}
            onGroupByChange={onGroupByChange}
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

      <main className="w-full min-w-0 overflow-x-auto">
        {loading ? (
          <SpinnerContainer message={loadingMessage} />
        ) : empty ? (
          (emptyState ?? (
            <EmptyState
              title="No data"
              message="There are no items to display."
              variant="no-data"
            />
          ))
        ) : (
          children
        )}
      </main>
    </>
  );
}
