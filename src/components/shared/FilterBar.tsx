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
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 ${className}`.trim()}
    >
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        {searchConfig && (
          <div className="min-w-64 flex-1">
            <input
              type="text"
              placeholder={searchConfig.placeholder || 'Search...'}
              value={searchConfig.value || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
            />
          </div>
        )}

        {/* Filters */}
        {filters.map((filter) => {
          if (filter.type === 'select') {
            // Get options - either from static options array or dynamic getOptions function
            const options = filter.getOptions
              ? filter.getOptions(filter.data || [])
              : filter.options || [];

            return (
              <div key={filter.key} className="flex items-center gap-2">
                {filter.label && (
                  <label className="text-sm font-medium text-gray-700">
                    {filter.label}:
                  </label>
                )}
                <select
                  value={filter.value || 'All'}
                  onChange={(e) =>
                    handleFilterChange(filter.key, e.target.value)
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
                >
                  {options.map((option) => {
                    // Support both { value, label } objects and simple strings
                    if (typeof option === 'string') {
                      return (
                        <option key={option} value={option}>
                          {option === 'All'
                            ? `All ${filter.label || ''}`
                            : option}
                        </option>
                      );
                    }
                    return (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          }

          // Future: Add support for other filter types (date-range, multi-select, etc.)
          return null;
        })}
      </div>
    </div>
  );
}

export default FilterBar;
