import { useMemo, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type RowSelectionState,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../shadcn-table';
import { cn } from '@/lib/utils';
import { EmptyState } from '../EmptyState';
import { Checkbox } from '../checkbox';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { Badge } from '../badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { getRowId } from './utils';
import type {
  TableRowData,
  DataTableProps,
  RowAction,
  ColumnAlign,
  Column,
} from './types';

const alignClasses: Record<ColumnAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

function DataTable<T extends TableRowData>({
  columns,
  data,
  onRowClick,
  emptyState,
  className = '',
  selectable = false,
  selectedRows = [],
  onSelect,
  sortColumn = null,
  sortDirection = null,
  onSort,
  actions,
}: DataTableProps<T>) {
  const sorting: SortingState = useMemo(() => {
    if (!sortColumn || !sortDirection) return [];
    return [{ id: sortColumn, desc: sortDirection === 'desc' }];
  }, [sortColumn, sortDirection]);

  const rowSelection: RowSelectionState = useMemo(() => {
    const selection: RowSelectionState = {};
    selectedRows.forEach((id) => {
      selection[id] = true;
    });
    return selection;
  }, [selectedRows]);

  const renderActionMenu = useCallback(
    (row: T, rowActions: RowAction<T>[]) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="hover:bg-muted text-greyscale-500 flex h-8 w-8 items-center justify-center rounded transition-colors"
            aria-label="Row actions"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="more-vertical" size="sm" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {rowActions.map((action, actionIndex) => (
            <div key={actionIndex}>
              {action.separator && actionIndex > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={() => action.onClick(row)}
                className={cn(
                  action.variant === 'destructive' &&
                    'text-red-600 focus:text-red-600'
                )}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    []
  );

  const renderCellContent = useCallback((col: Column<T>, row: T): ReactNode => {
    const rowData = row as Record<string, unknown>;
    const value = rowData[col.key];

    if ('render' in col && col.render) {
      return col.render(row);
    }

    const cellType = 'type' in col ? col.type : undefined;

    switch (cellType) {
      case 'avatar': {
        const srcKey = 'avatarSrcKey' in col ? col.avatarSrcKey : undefined;
        const nameKey =
          ('avatarNameKey' in col ? col.avatarNameKey : undefined) ?? col.key;
        const showName = 'showName' in col ? col.showName : true;
        const size = 'avatarSize' in col ? col.avatarSize : 'sm';

        const src = srcKey
          ? (rowData[srcKey] as string | undefined)
          : undefined;
        const name = (rowData[nameKey] as string) || '';

        return (
          <div className="flex items-center gap-2">
            <Avatar src={src} fallback={name} size={size} />
            {showName && <span className="text-sm">{name}</span>}
          </div>
        );
      }

      case 'badge': {
        const stringValue = String(value ?? '');
        const getBadgeProps =
          'getBadgeProps' in col ? col.getBadgeProps : undefined;
        const badgeProps = getBadgeProps ? getBadgeProps(stringValue, row) : {};
        const badgeContent = badgeProps.children ?? stringValue;

        return (
          <span className="whitespace-nowrap">
            <Badge {...badgeProps}>{badgeContent}</Badge>
          </span>
        );
      }

      case 'date': {
        if (!value) return null;
        const formatDate = 'formatDate' in col ? col.formatDate : undefined;
        const dateValue =
          value instanceof Date ? value : new Date(value as string);
        const formattedDate = formatDate
          ? formatDate(dateValue)
          : dateValue.toLocaleDateString();

        return (
          <div className="text-muted-foreground flex items-center gap-2 whitespace-nowrap">
            <Icon name="clock" size="sm" className="text-greyscale-400" />
            <span>{formattedDate}</span>
          </div>
        );
      }

      case 'text':
      default:
        return value as ReactNode;
    }
  }, []);

  const tanstackColumns: ColumnDef<T>[] = useMemo(() => {
    const cols: ColumnDef<T>[] = [];

    if (selectable) {
      cols.push({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(!!checked)
            }
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(!!checked)}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select row ${row.index + 1}`}
          />
        ),
        enableSorting: false,
        size: 48,
      });
    }

    // Convert user-defined columns
    columns.forEach((col) => {
      cols.push({
        id: col.key,
        accessorKey: col.key,
        header: () => col.label,
        cell: ({ row }) => renderCellContent(col, row.original),
        enableSorting: col.sortable ?? false,
        sortingFn: col.sortValue
          ? (rowA, rowB) => {
              const aVal = col.sortValue!(rowA.original);
              const bVal = col.sortValue!(rowB.original);
              if (aVal == null && bVal == null) return 0;
              if (aVal == null) return 1;
              if (bVal == null) return -1;
              if (aVal < bVal) return -1;
              if (aVal > bVal) return 1;
              return 0;
            }
          : 'auto',
        meta: {
          className: col.className,
          headerClassName: col.headerClassName,
          width: col.width,
          align: col.align,
        },
      });
    });

    if (actions && actions.length > 0) {
      cols.push({
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => renderActionMenu(row.original, actions),
        enableSorting: false,
        size: 48,
      });
    }

    return cols;
  }, [columns, selectable, actions, renderCellContent, renderActionMenu]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: tanstackColumns,
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: selectable,
    onSortingChange: (updater) => {
      if (!onSort) return;
      const newSorting =
        typeof updater === 'function' ? updater(sorting) : updater;
      if (newSorting.length === 0) {
        onSort(sortColumn || '', null);
      } else {
        const { id, desc } = newSorting[0];
        onSort(id, desc ? 'desc' : 'asc');
      }
    },
    onRowSelectionChange: (updater) => {
      if (!onSelect) return;
      const newSelection =
        typeof updater === 'function' ? updater(rowSelection) : updater;
      onSelect(Object.keys(newSelection).filter((key) => newSelection[key]));
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => getRowId(row) || String(data.indexOf(row)),
  });

  useEffect(() => {
    const currentSelection = table.getState().rowSelection;
    const newSelection: RowSelectionState = {};
    selectedRows.forEach((id) => {
      newSelection[id] = true;
    });

    const currentKeys = Object.keys(currentSelection).sort().join(',');
    const newKeys = Object.keys(newSelection).sort().join(',');

    if (currentKeys !== newKeys) {
      table.setRowSelection(newSelection);
    }
  }, [selectedRows, table]);

  const renderSortIcon = (columnId: string, canSort: boolean) => {
    if (!canSort) return null;

    const column = table.getColumn(columnId);
    const sortDir = column?.getIsSorted();

    if (!sortDir) {
      return (
        <Icon
          name="chevron-selector"
          size="sm"
          className="text-greyscale-400"
        />
      );
    }
    if (sortDir === 'asc') {
      return (
        <Icon name="chevron-up" size="sm" className="text-greyscale-700" />
      );
    }
    return (
      <Icon name="chevron-down" size="sm" className="text-greyscale-700" />
    );
  };

  const renderHeader = () => (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className="border-b-0 bg-white hover:bg-white"
        >
          {headerGroup.headers.map((header) => {
            const meta = header.column.columnDef.meta as
              | {
                  headerClassName?: string;
                  width?: string;
                  align?: ColumnAlign;
                }
              | undefined;

            const alignClass = meta?.align
              ? alignClasses[meta.align]
              : 'text-left';

            return (
              <TableHead
                key={header.id}
                className={cn(
                  'px-6 py-3 text-xs font-medium tracking-wider whitespace-nowrap uppercase',
                  alignClass,
                  header.column.getCanSort() && 'cursor-pointer select-none',
                  header.id === 'select' && 'w-[48px]',
                  header.id === 'actions' && 'w-[48px] text-right',
                  meta?.headerClassName,
                  meta?.width
                )}
                onClick={
                  header.column.getCanSort()
                    ? header.column.getToggleSortingHandler()
                    : undefined
                }
              >
                <span className="inline-flex items-center gap-1">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {renderSortIcon(header.column.id, header.column.getCanSort())}
                </span>
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );

  const renderRows = () => (
    <TableBody>
      {table.getRowModel().rows.map((row) => {
        const originalRow = row.original;

        return (
          <TableRow
            key={row.id}
            onClick={onRowClick ? () => onRowClick(originalRow) : undefined}
            className={cn(
              'border-greyscale-100 border-b last:border-b-0',
              onRowClick && 'cursor-pointer',
              row.getIsSelected() && 'bg-muted/30',
              originalRow.className
            )}
            data-state={row.getIsSelected() ? 'selected' : undefined}
          >
            {row.getVisibleCells().map((cell) => {
              const meta = cell.column.columnDef.meta as
                | {
                    className?: string;
                    width?: string;
                    align?: ColumnAlign;
                  }
                | undefined;

              const alignClass = meta?.align
                ? alignClasses[meta.align]
                : 'text-left';

              return (
                <TableCell
                  key={cell.id}
                  className={cn(
                    'px-6 py-3',
                    alignClass,
                    cell.column.id === 'select' && 'w-12',
                    cell.column.id === 'actions' && 'w-12 text-right',
                    meta?.className,
                    meta?.width
                  )}
                  onClick={
                    cell.column.id === 'select' || cell.column.id === 'actions'
                      ? (e) => e.stopPropagation()
                      : undefined
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );

  if (data.length === 0) {
    return (
      <div className={cn('overflow-hidden bg-white', className)}>
        {emptyState || (
          <EmptyState
            variant="no-data"
            title="No data found"
            message="No items match your current filters."
            className="min-h-0 py-8"
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden bg-white', className)}>
      <ShadcnTable>
        {renderHeader()}
        {renderRows()}
      </ShadcnTable>
    </div>
  );
}

export { DataTable };
export default DataTable;
