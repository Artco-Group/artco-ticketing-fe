import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FilterButton, Button } from '@/shared/components/ui';
import {
  FilterPanel,
  type FilterGroup,
  type FilterPanelValues,
} from '@/shared/components/ui/FilterPanel';
import { Icon, type IconName } from '@/shared/components/ui/Icon/Icon';

export interface FilterConfig {
  id: string;
  label: string;
  icon?: IconName;
  options?: string[];
  value?: string | null;
}

export type ViewMode = 'grid' | 'list';

export interface FilterBarProps {
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
  className?: string;
  children?: ReactNode;
}

export function FilterBar({
  filters = [],
  onFilterChange,
  sortOptions,
  sortValue,
  onSortChange,
  filterGroups,
  filterPanelValue,
  onFilterPanelChange,
  filterPanelSingleSelect,
  viewMode = 'list',
  onViewChange,
  showFilter = true,
  showAddButton = false,
  onAddClick,
  className,
  children,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'border-border-default flex items-center justify-between border-b px-4 py-2',
        className
      )}
    >
      <div className="flex items-center gap-1">
        {/* Sort button with cycling options */}
        {sortOptions && sortOptions.length > 0 && (
          <FilterButton
            label="Sort"
            icon={<Icon name="sort" size="sm" />}
            options={sortOptions}
            value={sortValue}
            onChange={onSortChange}
          />
        )}

        {/* Other filter buttons */}
        {filters.map((filter) => (
          <FilterButton
            key={filter.id}
            label={filter.label}
            icon={
              filter.icon ? <Icon name={filter.icon} size="sm" /> : undefined
            }
            options={filter.options}
            value={filter.value}
            onChange={(value) => onFilterChange?.(filter.id, value)}
          />
        ))}
        {children}
      </div>

      <div className="flex items-center gap-1">
        {/* Filter panel dropdown */}
        {showFilter && filterGroups && filterGroups.length > 0 && (
          <FilterPanel
            label="Filter"
            groups={filterGroups}
            value={filterPanelValue}
            onChange={onFilterPanelChange}
            singleSelect={filterPanelSingleSelect}
          />
        )}

        {/* Grid/List view toggle */}
        {onViewChange && (
          <div className="border-border-default flex items-center overflow-hidden rounded-md border">
            <button
              type="button"
              onClick={() => onViewChange('grid')}
              className={cn(
                'p-1.5 transition-colors',
                viewMode === 'grid'
                  ? 'bg-greyscale-100 text-greyscale-700'
                  : 'text-greyscale-400 hover:text-greyscale-500 bg-white'
              )}
            >
              <Icon name="grid" size="sm" />
            </button>
            <button
              type="button"
              onClick={() => onViewChange('list')}
              className={cn(
                'p-1.5 transition-colors',
                viewMode === 'list'
                  ? 'bg-greyscale-100 text-greyscale-700'
                  : 'text-greyscale-400 hover:text-greyscale-500 bg-white'
              )}
            >
              <Icon name="list" size="sm" />
            </button>
          </div>
        )}

        {/* Add button */}
        {showAddButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddClick}
            className="text-text-secondary hover:text-text-primary"
          >
            <Icon name="plus" size="sm" />
          </Button>
        )}
      </div>
    </div>
  );
}
