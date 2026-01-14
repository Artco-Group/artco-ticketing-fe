/**
 * Column helper functions for creating table column definitions
 */

/**
 * Creates a simple text column
 * @param {string} key - The data key to access
 * @param {string} label - Column header label
 * @param {object} options - Optional configuration
 * @param {string} options.className - Additional CSS classes for cells
 * @param {string} options.headerClassName - Additional CSS classes for header
 * @param {string} options.width - Column width (e.g., 'w-32', 'min-w-200')
 * @param {'left'|'center'|'right'} options.align - Text alignment
 * @returns {object} Column definition object
 */
export function textColumn(key, label, options = {}) {
  const {
    className = '',
    headerClassName = '',
    width = '',
    align = 'left',
  } = options;

  const alignClass =
    {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[align] || 'text-left';

  return {
    key,
    label,
    width,
    align,
    className: `${alignClass} ${className}`.trim(),
    headerClassName: `${alignClass} ${headerClassName}`.trim(),
    render: (row) => <div className={className || ''}>{row[key]}</div>,
  };
}

/**
 * Creates a badge/pill column with custom styling
 * @param {string} key - The data key to access
 * @param {string} label - Column header label
 * @param {function} getBadgeClass - Function that returns badge CSS classes: (value) => string
 * @param {object} options - Optional configuration
 * @returns {object} Column definition object
 */
export function badgeColumn(key, label, getBadgeClass, options = {}) {
  const {
    className = '',
    headerClassName = '',
    width = '',
    align = 'left',
  } = options;

  const alignClass =
    {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[align] || 'text-left';

  return {
    key,
    label,
    width,
    align,
    className: `${alignClass} ${className}`.trim(),
    headerClassName: `${alignClass} ${headerClassName}`.trim(),
    render: (row) => {
      const value = row[key];
      const badgeClass = getBadgeClass(value);
      // Check if badgeClass already includes border, if not add it
      const hasBorder = badgeClass.includes('border');
      const borderClass = hasBorder ? '' : 'border';
      return (
        <span
          className={`inline-flex items-center rounded-full ${borderClass} px-2.5 py-0.5 text-xs font-medium ${badgeClass}`.trim()}
        >
          {value}
        </span>
      );
    },
  };
}

/**
 * Creates a date column with formatting
 * @param {string} key - The data key to access
 * @param {string} label - Column header label
 * @param {function} formatFn - Function to format the date: (dateString) => string
 * @param {object} options - Optional configuration
 * @returns {object} Column definition object
 */
export function dateColumn(key, label, formatFn, options = {}) {
  const {
    className = '',
    headerClassName = '',
    width = '',
    align = 'left',
  } = options;

  const alignClass =
    {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[align] || 'text-left';

  return {
    key,
    label,
    width,
    align,
    className: `${alignClass} ${className}`.trim(),
    headerClassName: `${alignClass} ${headerClassName}`.trim(),
    render: (row) => (
      <div className={`text-sm ${className}`.trim()}>{formatFn(row[key])}</div>
    ),
  };
}

/**
 * Creates an actions column with action buttons
 * @param {string} key - Column key (usually 'actions')
 * @param {string} label - Column header label
 * @param {array} actions - Array of action objects: [{ icon, onClick, label, className? }]
 * @param {object} options - Optional configuration
 * @returns {object} Column definition object
 */
export function actionsColumn(key, label, actions, options = {}) {
  const {
    className = '',
    headerClassName = '',
    width = '',
    align = 'right',
  } = options;

  const alignClass =
    {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[align] || 'text-right';

  return {
    key,
    label,
    width,
    align,
    className: `${alignClass} ${className}`.trim(),
    headerClassName: `${alignClass} ${headerClassName}`.trim(),
    render: (row) => (
      <div className="flex items-center gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(row);
              }}
              className={
                action.className ||
                'p-1.5 text-gray-400 transition-colors hover:text-[#004179]'
              }
              title={action.label}
            >
              {typeof Icon === 'function' ? <Icon /> : Icon}
            </button>
          );
        })}
      </div>
    ),
  };
}

/**
 * Creates a custom column with a render function
 * @param {string} key - The data key to access
 * @param {string} label - Column header label
 * @param {function} renderFn - Custom render function: (row) => ReactNode
 * @param {object} options - Optional configuration
 * @returns {object} Column definition object
 */
export function customColumn(key, label, renderFn, options = {}) {
  const {
    className = '',
    headerClassName = '',
    width = '',
    align = 'left',
  } = options;

  const alignClass =
    {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[align] || 'text-left';

  return {
    key,
    label,
    width,
    align,
    className: `${alignClass} ${className}`.trim(),
    headerClassName: `${alignClass} ${headerClassName}`.trim(),
    render: renderFn,
  };
}
