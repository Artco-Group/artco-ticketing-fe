import { createContext } from 'react';
import type { ReactNode } from 'react';
import type { Tab } from '../TabBar';
import type {
  FilterConfig,
  ViewMode,
  FilterGroup,
  FilterPanelValues,
} from '../FilterBar';

export interface TabBarConfig {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  actions?: ReactNode;
}

export interface FilterBarConfig {
  filters?: FilterConfig[];
  onFilterChange?: (filterId: string, value: string | null) => void;
  /** Sort options for the Sort button */
  sortOptions?: string[];
  sortValue?: string | null;
  onSortChange?: (value: string | null) => void;
  /** Filter panel groups for the Filter dropdown */
  filterGroups?: FilterGroup[];
  filterPanelValue?: FilterPanelValues;
  onFilterPanelChange?: (value: FilterPanelValues) => void;
  /** When true, only one option can be selected per filter group */
  filterPanelSingleSelect?: boolean;
  viewMode?: ViewMode;
  onViewChange?: (mode: ViewMode) => void;
  showFilter?: boolean;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export interface PageHeaderContextValue {
  count: number | undefined;
  setCount: (count: number | undefined) => void;
  tabBarConfig: TabBarConfig | undefined;
  setTabBarConfig: (config: TabBarConfig | undefined) => void;
  filterBarConfig: FilterBarConfig | undefined;
  setFilterBarConfig: (config: FilterBarConfig | undefined) => void;
}

export const PageHeaderContext = createContext<
  PageHeaderContextValue | undefined
>(undefined);
