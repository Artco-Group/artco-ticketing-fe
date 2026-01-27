import { useId, useMemo } from 'react';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  Label,
} from '@/shared/components/ui';
import { cn } from '@/lib/utils';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  type: 'select';
  label?: string;
  value?: string;
  options?: (string | FilterOption)[];
  getOptions?: (data: unknown[]) => (string | FilterOption)[];
  data?: unknown[];
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
}

function FilterBar({
  filters = [],
  searchConfig,
  onFilterChange,
  onSearchChange,
  className = '',
}: FilterBarProps) {
  // Generate IDs for all filters upfront to avoid calling hooks in callbacks
  const baseId = useId();
  const filterIds = useMemo(() => {
    return filters.map((_, index) => `${baseId}-filter-${index}`);
  }, [filters, baseId]);

  const handleFilterChange = (filterKey: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(filterKey, value);
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
          if (filter.type === 'select') {
            // Get options - either from static options array or dynamic getOptions function
            const options = filter.getOptions
              ? filter.getOptions(filter.data || [])
              : filter.options || [];

            // Use pre-generated ID for this filter
            const filterId = filterIds[index];

            return (
              <div key={filter.key} className="flex-start-gap-2">
                {filter.label && (
                  <Label htmlFor={filterId} className="text-sm font-medium">
                    {filter.label}:
                  </Label>
                )}
                <Select
                  value={filter.value || 'All'}
                  onValueChange={(value) =>
                    handleFilterChange(filter.key, value)
                  }
                >
                  <SelectTrigger id={filterId} className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => {
                      // Support both { value, label } objects and simple strings
                      if (typeof option === 'string') {
                        return (
                          <SelectItem key={option} value={option}>
                            {option === 'All'
                              ? `All ${filter.label || ''}`
                              : option}
                          </SelectItem>
                        );
                      }
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          // Future: Add support for other filter types (date-range, multi-select, etc.)
          return null;
        })}
      </div>
    </Card>
  );
}

export default FilterBar;
