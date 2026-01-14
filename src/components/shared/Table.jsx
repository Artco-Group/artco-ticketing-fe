function Table({ columns, data, onRowClick, emptyState, className = '' }) {
  const defaultEmptyState = (
    <div className="py-12 text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No data found</h3>
      <p className="mt-1 text-sm text-gray-500">
        No items match your current filters.
      </p>
    </div>
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
                      {column.render ? column.render(row) : row[column.key]}
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
