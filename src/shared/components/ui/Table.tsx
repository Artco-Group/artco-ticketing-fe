import type { ReactNode } from 'react';
import { EmptyState } from './EmptyState';

interface Column<T> {
  key: string;
  label: string;
  width?: string;
  className?: string;
  headerClassName?: string;
  render?: (row: T) => ReactNode;
}

interface TableRow {
  id?: string;
  _id?: string;
  className?: string;
}

interface TableProps<T extends TableRow> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
  className?: string;
}

function Table<T extends TableRow>({
  columns,
  data,
  onRowClick,
  emptyState,
  className = '',
}: TableProps<T>) {
  const defaultEmptyState = (
    <EmptyState
      variant="no-data"
      title="No data found"
      description="No items match your current filters."
    />
  );

  if (data.length === 0) {
    return (
      <div
        className={`overflow-hidden rounded-xl border border-gray-200 bg-white ${className}`}
      >
        {emptyState || defaultEmptyState}
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {columns.map((column) => {
                const headerClassName = column.headerClassName || 'text-left';
                const width = column.width || '';
                return (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase ${headerClassName} ${width}`.trim()}
                  >
                    {column.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || row._id || rowIndex}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
                } ${row.className || ''}`}
              >
                {columns.map((column) => {
                  const cellClassName = column.className || 'text-left';
                  return (
                    <td
                      key={column.key}
                      className={`px-6 py-4 ${cellClassName}`.trim()}
                    >
                      {column.render
                        ? column.render(row)
                        : ((row as Record<string, unknown>)[
                            column.key
                          ] as ReactNode)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
