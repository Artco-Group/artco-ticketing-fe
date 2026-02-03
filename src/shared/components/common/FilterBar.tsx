import { useId, useMemo, type ReactNode } from 'react';
import {
  Input,
  Select,
  Card,
  Label,
  FilterButton,
} from '@/shared/components/ui';
import { cn } from '@/lib/utils';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  type?: 'select' | 'filterButton';
  label?: string;
  value?: string | null;
  options?: (string | FilterOption)[];
  getOptions?: (data: unknown[]) => (string | FilterOption)[];
  data?: unknown[];
  icon?: ReactNode;
}

interface SearchConfig {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

interface FilterBarProps {
  filters?: FilterConfig[];
  searchConfig?: SearchConfig;
  onFilterChange?: (filterKey: string, value: string) => void;
  onSearchChange?: (value: string) => void;
  className?: string;
  children?: ReactNode;
}

function FilterBar({
  filters = [],
  searchConfig,
  onFilterChange,
  onSearchChange,
  className = '',
  children,
}: FilterBarProps) {
  // Generate IDs for all filters upfront to avoid calling hooks in callbacks
  const baseId = useId();
  const filterIds = useMemo(() => {
    return filters.map((_, index) => `${baseId}-filter-${index}`);
  }, [filters, baseId]);

  const handleFilterChange = (filterKey: string, value: string | null) => {
    if (onFilterChange) {
      // Convert null to 'All' for backward compatibility
      onFilterChange(filterKey, value ?? 'All');
    }
  };

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else if (searchConfig?.onChange) {
      searchConfig.onChange(value);
    }
  };

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        {searchConfig && (
          <div className="min-w-64 flex-1">
            <Input
              type="text"
              placeholder={searchConfig.placeholder || 'Search...'}
              value={searchConfig.value || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        )}

        {/* Filters */}
        {filters.map((filter, index) => {
          // Get options - either from static options array or dynamic getOptions function
          const options = filter.getOptions
            ? filter.getOptions(filter.data || [])
            : filter.options || [];

          // Use pre-generated ID for this filter
          const filterId = filterIds[index];

          // Determine filter type (default to filterButton if not specified)
          const filterType = filter.type || 'filterButton';

          // Handle Select type
          if (filterType === 'select') {
            return (
              <div key={filter.key} className="flex items-start gap-2">
                {filter.label && (
                  <Label htmlFor={filterId} className="text-sm font-medium">
                    {filter.label}:
                  </Label>
                )}
                <Select
                  options={options.map((option) => {
                    // Support both { value, label } objects and simple strings
                    if (typeof option === 'string') {
                      return {
                        label:
                          option === 'All'
                            ? `All ${filter.label || ''}`
                            : option,
                        value: option,
                      };
                    }
                    return {
                      label: option.label,
                      value: option.value,
                    };
                  })}
                  value={filter.value || 'All'}
                  onChange={(value) => handleFilterChange(filter.key, value)}
                  className="w-[180px]"
                />
              </div>
            );
          }

          // Handle FilterButton type (default)
          // Convert options to string array
          const stringOptions = options
            .map((option) => {
              if (typeof option === 'string') {
                return option === 'All' ? null : option; // Filter out 'All' as FilterButton uses null
              }
              return option.value === 'All' ? null : option.value;
            })
            .filter((opt): opt is string => opt !== null);

          // Convert value: 'All' → null
          const filterValue = filter.value === 'All' ? null : filter.value;

          return (
            <div key={filter.key} className="flex items-center gap-2">
              <FilterButton
                label={filter.label || filter.key}
                icon={filter.icon}
                options={stringOptions}
                value={filterValue ?? null}
                onChange={(value) => handleFilterChange(filter.key, value)}
              />
            </div>
          );
        })}

        {children && <div className="ml-auto">{children}</div>}
      </div>
    </Card>
  );
}

export default FilterBar;
