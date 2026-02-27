import { useMemo, useState, useCallback } from 'react';
import type { UserWithProjects } from '@/types';
import {
  type SortDirection,
  type BulkAction,
  useToast,
  Icon,
} from '@/shared/components/ui';
import { useTranslatedToast, useAppTranslation } from '@/shared/hooks';
import { useBulkDeleteUsers } from '@/features/users/api';

interface UseClientTableStateProps {
  clients: UserWithProjects[];
}

export function useClientTableState({
  clients: _clients,
}: UseClientTableStateProps) {
  const { translate } = useAppTranslation('clients');
  const translatedToast = useTranslatedToast();
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
      translatedToast.error('toast.error.noValidSelection', {
        items: 'clients',
      });
      return;
    }

    bulkDelete(
      { emails },
      {
        onSuccess: (data) => {
          setShowDeleteConfirm(false);

          if (data.deletedCount === 0 && data.failedEmails.length > 0) {
            const reasons = Object.values(data.errors);
            toast.error(reasons[0] || translate('messages.failedToDelete'));
            return;
          }

          if (data.failedEmails.length > 0) {
            const reasons = Object.values(data.errors);
            toast.warning(
              `${data.deletedCount} deleted, ${data.failedEmails.length} failed: ${reasons[0] || translate('messages.failedToDelete')}`
            );
          } else {
            translatedToast.success('toast.success.deleted', {
              item: `${data.deletedCount} client${data.deletedCount > 1 ? 's' : ''}`,
            });
          }

          clearSelection();
        },
        onError: (error) => {
          toast.error(error?.message || translate('messages.failedToDelete'));
        },
      }
    );
  }, [
    bulkDelete,
    selectedRows,
    clearSelection,
    translatedToast,
    toast,
    translate,
  ]);

  const handleSort = useCallback((col: string | null, dir: SortDirection) => {
    setSortColumn(col);
    setSortDirection(dir);
  }, []);

  const bulkActions: BulkAction[] = useMemo(
    () => [
      {
        label: translate('table.bulkDelete'),
        icon: <Icon name="trash" size="sm" />,
        onClick: () => setShowDeleteConfirm(true),
        variant: 'destructive' as const,
      },
    ],
    [translate]
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
