import { useMemo, useState, useCallback } from 'react';
import {
  ROLE_ORDER,
  UserRole,
  UserRoleTranslationKeys,
} from '@artco-group/artco-ticketing-sync';
import { type UserWithStats } from '@/types';
import {
  type SortDirection,
  type BulkAction,
  useToast,
} from '@/shared/components/ui';
import { type GroupConfig } from '@/shared/hooks/useGroupedData';
import { Icon } from '@/shared/components/ui';
import { useTranslatedToast, useAppTranslation } from '@/shared/hooks';
import { useBulkDeleteUsers } from '../api';

interface UseUserTableStateProps {
  users: UserWithStats[];
}

export function useUserTableState({ users }: UseUserTableStateProps) {
  const { translate } = useAppTranslation('users');
  const translatedToast = useTranslatedToast();
  const toast = useToast();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [showAddToProjectModal, setShowAddToProjectModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDeleteUsers();

  const clearSelection = useCallback(() => setSelectedRows([]), []);

  const handleBulkDelete = useCallback(() => {
    const emails = selectedRows.filter((email) => email.length > 0);

    if (emails.length === 0) {
      translatedToast.error('toast.error.noValidSelection', { items: 'users' });
      return;
    }

    bulkDelete(
      { emails },
      {
        onSuccess: () => {
          clearSelection();
          setShowDeleteConfirm(false);
          translatedToast.success('toast.success.deleted', {
            item: `${emails.length} user${emails.length > 1 ? 's' : ''}`,
          });
        },
        onError: (error) => {
          toast.error(error?.message || 'Failed to delete users');
        },
      }
    );
  }, [bulkDelete, selectedRows, clearSelection, translatedToast, toast]);

  const handleSort = useCallback((col: string | null, dir: SortDirection) => {
    setSortColumn(col);
    setSortDirection(dir);
  }, []);

  const allSelectedAreDevelopers = useMemo(() => {
    if (selectedRows.length === 0) return false;
    return selectedRows.every((email) => {
      const user = users.find((u) => u.email === email);
      return (
        user?.role === UserRole.DEVELOPER || user?.role === UserRole.ENG_LEAD
      );
    });
  }, [selectedRows, users]);

  const bulkActions: BulkAction[] = useMemo(() => {
    const actions: BulkAction[] = [];

    if (allSelectedAreDevelopers) {
      actions.push({
        label: translate('bulkActions.addToProject'),
        icon: <Icon name="plus" size="sm" />,
        onClick: () => setShowAddToProjectModal(true),
      });
    }

    actions.push({
      label: translate('bulkActions.deleteMember'),
      icon: <Icon name="trash" size="sm" />,
      onClick: () => setShowDeleteConfirm(true),
      variant: 'destructive' as const,
    });

    return actions;
  }, [allSelectedAreDevelopers, translate]);

  const groupConfigs: GroupConfig<UserWithStats>[] = useMemo(
    () => [
      {
        key: 'role',
        getGroupKey: (user) => user.role || 'Unknown',
        getLabel: (key) => {
          const translationKey = UserRoleTranslationKeys[key as UserRole];
          return translationKey ? translate(translationKey) : key;
        },
        getIcon: () => (
          <Icon name="user" size="sm" className="text-muted-foreground" />
        ),
        sortOrder: ROLE_ORDER,
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

    showAddToProjectModal,
    setShowAddToProjectModal,

    bulkActions,
    groupConfigs,
    allSelectedAreDevelopers,
  };
}
