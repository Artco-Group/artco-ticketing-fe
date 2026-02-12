import { useMemo, useState, useCallback } from 'react';
import { type SortDirection, type BulkAction } from '@/shared/components/ui';
import { Icon } from '@/shared/components/ui';
import { useBulkDeleteProjects } from '../api/projects-api';

export function useProjectTableState() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDeleteProjects();

  const clearSelection = useCallback(() => setSelectedRows([]), []);

  const handleBulkDelete = useCallback(() => {
    bulkDelete(
      { ids: selectedRows },
      {
        onSuccess: () => {
          clearSelection();
          setShowDeleteConfirm(false);
        },
      }
    );
  }, [bulkDelete, selectedRows, clearSelection]);

  const handleSort = useCallback((col: string | null, dir: SortDirection) => {
    setSortColumn(col);
    setSortDirection(dir);
  }, []);

  const bulkActions: BulkAction[] = useMemo(
    () => [
      {
        label: 'Delete',
        icon: <Icon name="trash" size="sm" />,
        onClick: () => setShowDeleteConfirm(true),
        variant: 'destructive' as const,
      },
    ],
    []
  );

  return {
    // Selection
    selectedRows,
    setSelectedRows,
    clearSelection,

    // Sorting
    sortColumn,
    sortDirection,
    handleSort,

    // Delete dialog
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleBulkDelete,
    isDeleting,

    // Actions
    bulkActions,
  };
}
