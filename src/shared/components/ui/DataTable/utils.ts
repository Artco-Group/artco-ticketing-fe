import type { TableRowData } from './types';

/**
 * Extract row ID from row data
 */
export function getRowId<T extends TableRowData>(row: T): string {
  return row.id || row._id || '';
}
