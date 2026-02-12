import type { ReactNode } from 'react';
import type {
  ColumnDef,
  SortingState,
  RowSelectionState,
} from '@tanstack/react-table';
import type { AvatarProps } from '../Avatar';
import type { BadgeProps } from '../badge';

export type SortDirection = 'asc' | 'desc' | null;

export interface RowAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive';
  separator?: boolean;
}

export type ColumnAlign = 'left' | 'center' | 'right';

export type CellType = 'text' | 'avatar' | 'badge' | 'date';

interface BaseColumn<T> {
  key: string;
  label: string;
  width?: string;
  align?: ColumnAlign;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number | Date | null;
}

interface TextColumn<T> extends BaseColumn<T> {
  type?: 'text';
  render?: (row: T) => ReactNode;
}

interface AvatarColumn<T> extends BaseColumn<T> {
  type: 'avatar';
  /** Key for the image URL in the row data */
  avatarSrcKey?: string;
  /** Key for the name/fallback in the row data */
  avatarNameKey?: string;
  /** Show name text next to avatar */
  showName?: boolean;
  /** Avatar size */
  avatarSize?: AvatarProps['size'];
  render?: never;
}

interface BadgeColumn<T> extends BaseColumn<T> {
  type: 'badge';
  /** Function to get badge variant/className based on cell value */
  getBadgeProps?: (value: string, row: T) => Partial<BadgeProps>;
  render?: never;
}

interface DateColumn<T> extends BaseColumn<T> {
  type: 'date';
  /** Date format function */
  formatDate?: (date: Date | string) => string;
  render?: never;
}

interface CustomColumn<T> extends BaseColumn<T> {
  type?: never;
  render: (row: T) => ReactNode;
}

export type Column<T> =
  | TextColumn<T>
  | AvatarColumn<T>
  | BadgeColumn<T>
  | DateColumn<T>
  | CustomColumn<T>;

export interface TableRowData {
  id: string;
  className?: string;
}

export interface DataTableProps<T extends TableRowData> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
  className?: string;
  selectable?: boolean;
  selectedRows?: string[];
  onSelect?: (selectedIds: string[]) => void;
  sortColumn?: string | null;
  sortDirection?: SortDirection;
  onSort?: (column: string, direction: SortDirection) => void;
  actions?: RowAction<T>[];
  hideHeader?: boolean;
}

// TanStack Table re-exports for advanced usage
export type { ColumnDef, SortingState, RowSelectionState };
