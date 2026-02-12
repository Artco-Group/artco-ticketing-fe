import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FilterButton, Button } from '@/shared/components/ui';
import {
  FilterPanel,
  type FilterGroup,
  type FilterPanelValues,
} from '@/shared/components/ui/FilterPanel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Icon, type IconName } from '@/shared/components/ui/Icon/Icon';

export interface FilterConfig {
  id: string;
  label: string;
  icon?: IconName;
  options?: string[];
  value?: string | null;
}

export type ViewMode = 'grid' | 'list';

export interface GroupByOption {
  value: string;
  label: string;
  icon?: IconName;
}

export interface FilterBarProps {
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
  className?: string;
  children?: ReactNode;
  addButtonLabel?: string;
}

export function FilterBar({
  filters = [],
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
  viewMode = 'list',
  onViewChange,
  showFilter = true,
  showAddButton = false,
  onAddClick,
  className,
  children,
  addButtonLabel = 'Add',
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

        {/* Group by dropdown - styled like FilterButton */}
        {groupByOptions && groupByOptions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-[10px] border px-2.5 py-1 text-[13px] font-medium tracking-[-0.28px] transition-colors duration-150 focus:outline-none',
                  groupByValue
                    ? 'bg-greyscale-100 border-greyscale-300 text-greyscale-800 hover:bg-greyscale-100 active:bg-greyscale-200 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]'
                    : 'bg-greyscale-100 border-greyscale-200 text-greyscale-700 hover:bg-greyscale-100 active:bg-greyscale-200 border-dashed'
                )}
              >
                <Icon name="group-by" size="sm" />
                <span>Group by</span>
                {groupByValue && (
                  <>
                    <span className="bg-greyscale-200 h-3 w-px" />
                    <span>
                      {
                        groupByOptions.find((opt) => opt.value === groupByValue)
                          ?.label
                      }
                    </span>
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {groupByValue && (
                <DropdownMenuItem onClick={() => onGroupByChange?.(null)}>
                  <span className="text-greyscale-500">No grouping</span>
                </DropdownMenuItem>
              )}
              {groupByOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onGroupByChange?.(option.value)}
                  className={cn(
                    groupByValue === option.value && 'bg-greyscale-100'
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

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

        {onViewChange && (
          <div className="border-border-default flex items-center overflow-hidden rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewChange('grid')}
              className={cn(
                'h-8 w-8 rounded-none',
                viewMode === 'grid'
                  ? 'bg-greyscale-100 text-greyscale-700'
                  : 'text-greyscale-400 hover:text-greyscale-500 bg-white hover:bg-white'
              )}
            >
              <Icon name="grid" size="sm" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewChange('list')}
              className={cn(
                'h-8 w-8 rounded-none',
                viewMode === 'list'
                  ? 'bg-greyscale-100 text-greyscale-700'
                  : 'text-greyscale-400 hover:text-greyscale-500 bg-white hover:bg-white'
              )}
            >
              <Icon name="list" size="sm" />
            </Button>
          </div>
        )}

        {/* Add button */}
        {showAddButton && (
          <Button
            leftIcon="plus"
            onClick={onAddClick}
            className="bg-greyscale-900 hover:bg-greyscale-800 text-white"
            size="sm"
          >
            {addButtonLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
