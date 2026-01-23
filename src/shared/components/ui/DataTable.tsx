import type { ReactNode } from 'react';
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './shadcn-table';
import { cn } from '@/lib/utils';
import { ClipboardList } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  width?: string;
  className?: string;
  headerClassName?: string;
  render?: (row: T) => ReactNode;
}

interface TableRowData {
  id?: string;
  _id?: string;
  className?: string;
}

interface DataTableProps<T extends TableRowData> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
  className?: string;
}

function DataTable<T extends TableRowData>({
  columns,
  data,
  onRowClick,
  emptyState,
  className = '',
}: DataTableProps<T>) {
  const defaultEmptyState = (
    <div className="py-12 text-center">
      <ClipboardList className="text-muted-foreground mx-auto h-12 w-12" />
      <h3 className="text-foreground mt-2 text-sm font-medium">
        No data found
      </h3>
      <p className="text-muted-foreground mt-1 text-sm">
        No items match your current filters.
      </p>
    </div>
  );

  if (data.length === 0) {
    return (
      <div
        className={cn('bg-card overflow-hidden rounded-xl border', className)}
      >
        {emptyState || defaultEmptyState}
      </div>
    );
  }

  return (
    <div className={cn('bg-card overflow-hidden rounded-xl border', className)}>
      <ShadcnTable>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  'text-xs font-medium tracking-wider uppercase',
                  column.headerClassName,
                  column.width
                )}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={row.id || row._id || rowIndex}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(onRowClick && 'cursor-pointer', row.className)}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className={cn('py-4', column.className)}
                >
                  {column.render
                    ? column.render(row)
                    : ((row as Record<string, unknown>)[
                        column.key
                      ] as ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </ShadcnTable>
    </div>
  );
}

export { DataTable };
export default DataTable;
