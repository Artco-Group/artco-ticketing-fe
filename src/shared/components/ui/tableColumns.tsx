import type { ReactNode, MouseEvent, ComponentType } from 'react';

type TextAlign = 'left' | 'center' | 'right';

interface ColumnOptions {
  className?: string;
  headerClassName?: string;
  width?: string;
  align?: TextAlign;
}

interface Column<T> {
  key: string;
  label: string;
  width: string;
  align: TextAlign;
  className: string;
  headerClassName: string;
  render: (row: T) => ReactNode;
}

interface ActionConfig<T> {
  icon: ComponentType | ReactNode;
  onClick: (row: T) => void;
  label: string;
  className?: string;
}

const alignClassMap: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * Creates a simple text column
 */
export function textColumn<T>(
  key: string,
  label: string,
  options: ColumnOptions = {}
): Column<T> {
  const {
    className = '',
    headerClassName = '',
    width = '',
    align = 'left',
  } = options;

  const alignClass = alignClassMap[align] || 'text-left';

  return {
    key,
    label,
    width,
    align,
    className: `${alignClass} ${className}`.trim(),
    headerClassName: `${alignClass} ${headerClassName}`.trim(),
    render: (row: T) => (
      <div className={className || ''}>
        {(row as Record<string, unknown>)[key] as ReactNode}
      </div>
    ),
  };
}

/**
 * Creates a badge/pill column with custom styling
 */
export function badgeColumn<T>(
  key: string,
  label: string,
  getBadgeClass: (value: string) => string,
  options: ColumnOptions = {}
): Column<T> {
  const {
    className = '',
    headerClassName = '',
    width = '',
    align = 'left',
  } = options;

  const alignClass = alignClassMap[align] || 'text-left';

  return {
    key,
    label,
    width,
    align,
    className: `${alignClass} ${className}`.trim(),
    headerClassName: `${alignClass} ${headerClassName}`.trim(),
    render: (row: T) => {
      const value = (row as Record<string, unknown>)[key] as string;
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
 */
export function dateColumn<T>(
  key: string,
  label: string,
  formatFn: (dateValue: string | Date) => string,
  options: ColumnOptions = {}
): Column<T> {
  const {
    className = '',
    headerClassName = '',
    width = '',
    align = 'left',
  } = options;

  const alignClass = alignClassMap[align] || 'text-left';

  return {
    key,
    label,
    width,
    align,
    className: `${alignClass} ${className}`.trim(),
    headerClassName: `${alignClass} ${headerClassName}`.trim(),
    render: (row: T) => {
      const value = (row as Record<string, unknown>)[key] as
        | string
        | Date
        | undefined;
      return (
        <div className={`text-sm ${className}`.trim()}>
          {value ? formatFn(value) : ''}
        </div>
      );
    },
  };
}

/**
 * Creates an actions column with action buttons
 */
export function actionsColumn<T>(
  key: string,
  label: string,
  actions: ActionConfig<T>[],
  options: ColumnOptions = {}
): Column<T> {
  const {
    className = '',
    headerClassName = '',
    width = '',
    align = 'right',
  } = options;

  const alignClass = alignClassMap[align] || 'text-right';

  return {
    key,
    label,
    width,
    align,
    className: `${alignClass} ${className}`.trim(),
    headerClassName: `${alignClass} ${headerClassName}`.trim(),
    render: (row: T) => (
      <div className="flex items-center gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                action.onClick(row);
              }}
              className={
                action.className ||
                'hover:text-brand-primary p-1.5 text-gray-400 transition-colors'
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
 */
export function customColumn<T>(
  key: string,
  label: string,
  renderFn: (row: T) => ReactNode,
  options: ColumnOptions = {}
): Column<T> {
  const {
    className = '',
    headerClassName = '',
    width = '',
    align = 'left',
  } = options;

  const alignClass = alignClassMap[align] || 'text-left';

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
