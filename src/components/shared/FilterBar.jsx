/**
 * FilterBar Component
 * Renders a consistent filter/search UI for tables and lists
 *
 * @param {Array} filters - Array of filter configuration objects
 * @param {Object} searchConfig - Optional search input configuration
 * @param {Function} onFilterChange - Callback (filterKey, value) => void
 * @param {Function} onSearchChange - Optional callback (value) => void
 * @param {string} className - Additional CSS classes
 */
function FilterBar({
  filters = [],
  searchConfig,
  onFilterChange,
  onSearchChange,
  className = '',
}) {
  const handleFilterChange = (filterKey, value) => {
    if (onFilterChange) {
      onFilterChange(filterKey, value);
    }
  };

  const handleSearchChange = (value) => {
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
