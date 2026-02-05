import type { ReactNode } from 'react';
import { PageHeader } from '@/shared/components/patterns/PageHeader/PageHeader';
import type { Tab } from '@/shared/components/patterns/TabBar';
import type {
  FilterConfig,
  ViewMode,
  FilterGroup,
  FilterPanelValues,
} from '@/shared/components/patterns/FilterBar';
import type { BreadcrumbItem } from '@/shared/components/composite/Breadcrumbs/Breadcrumbs';
import { SpinnerContainer, EmptyState } from '@/shared/components/ui';

export interface ListPageLayoutProps {
  /** Page title displayed in the header */
  title: string;
  /** Optional count badge next to the title */
  count?: number;
  /** Breadcrumbs for nested page navigation */
  breadcrumbs?: BreadcrumbItem[];
  /** Extra actions rendered in the header row (right side, before UserMenu) */
  actions?: ReactNode;

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

  /** Shows a loading spinner instead of children */
  loading?: boolean;
  /** Shows emptyState instead of children */
  empty?: boolean;
  /** Custom empty state element (defaults to a generic EmptyState) */
  emptyState?: ReactNode;
  /** Optional message for the loading spinner */
  loadingMessage?: string;

  /** Page content */
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
  return (
    <>
      <PageHeader
        title={title}
        count={count}
        breadcrumbs={breadcrumbs}
        actions={actions}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        tabActions={tabActions}
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
      <main className="overflow-x-auto" style={{ width: '100%', minWidth: 0 }}>
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
