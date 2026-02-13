import { useMemo, useState, useCallback } from 'react';
import type { UserWithProjects } from '@/types';
import {
  type SortDirection,
  type BulkAction,
  useToast,
  Icon,
} from '@/shared/components/ui';
import { useBulkDeleteUsers } from '@/features/users/api';

interface UseClientTableStateProps {
  clients: UserWithProjects[];
}

export function useClientTableState({
  clients: _clients,
}: UseClientTableStateProps) {
  const toast = useToast();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDeleteUsers();

  const clearSelection = useCallback(() => setSelectedRows([]), []);

  const handleBulkDelete = useCallback(() => {
    const emails = selectedRows.filter((email) => email.length > 0);

    if (emails.length === 0) {
      toast.error('No valid clients selected for deletion');
      return;
    }

    bulkDelete(
      { emails },
      {
        onSuccess: () => {
          clearSelection();
          setShowDeleteConfirm(false);
          toast.success(
            `Deleted ${emails.length} client${emails.length > 1 ? 's' : ''}`
          );
        },
        onError: (error) => {
          toast.error(error?.message || 'Failed to delete clients');
        },
      }
    );
  }, [bulkDelete, selectedRows, clearSelection, toast]);

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
    selectedRows,
    setSelectedRows,
    clearSelection,

    sortColumn,
    sortDirection,
    handleSort,

    showDeleteConfirm,
    setShowDeleteConfirm,
    handleBulkDelete,
    isDeleting,

    bulkActions,
  };
}
