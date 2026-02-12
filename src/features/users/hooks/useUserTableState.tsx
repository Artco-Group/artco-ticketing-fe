import { useMemo, useState, useCallback } from 'react';
import { UserRoleDisplay } from '@artco-group/artco-ticketing-sync';
import { UserRole, type UserWithStats } from '@/types';
import { type SortDirection, type BulkAction } from '@/shared/components/ui';
import { type GroupConfig } from '@/shared/hooks/useGroupedData';
import { Icon } from '@/shared/components/ui';
import { useBulkDeleteUsers } from '../api';

const ROLE_ORDER: Record<string, number> = {
  [UserRole.ADMIN]: 1,
  [UserRole.ENG_LEAD]: 2,
  [UserRole.DEVELOPER]: 3,
};

interface UseUserTableStateProps {
  users: UserWithStats[];
}

export function useUserTableState({ users }: UseUserTableStateProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [showAddToProjectModal, setShowAddToProjectModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDeleteUsers();

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

  const allSelectedAreDevelopers = useMemo(() => {
    if (selectedRows.length === 0) return false;
    return selectedRows.every((id) => {
      const user = users.find((u) => u.id === id);
      return (
        user?.role === UserRole.DEVELOPER || user?.role === UserRole.ENG_LEAD
      );
    });
  }, [selectedRows, users]);

  const bulkActions: BulkAction[] = useMemo(() => {
    const actions: BulkAction[] = [];

    if (allSelectedAreDevelopers) {
      actions.push({
        label: 'Add to project',
        icon: <Icon name="plus" size="sm" />,
        onClick: () => setShowAddToProjectModal(true),
      });
    }

    actions.push({
      label: 'Delete member',
      icon: <Icon name="trash" size="sm" />,
      onClick: () => setShowDeleteConfirm(true),
      variant: 'destructive' as const,
    });

    return actions;
  }, [allSelectedAreDevelopers]);

  const groupConfigs: GroupConfig<UserWithStats>[] = useMemo(
    () => [
      {
        key: 'role',
        getGroupKey: (user) => user.role || 'Unknown',
        getLabel: (key) => UserRoleDisplay[key as UserRole] || key,
        getIcon: () => (
          <Icon name="user" size="sm" className="text-muted-foreground" />
        ),
        sortOrder: ROLE_ORDER,
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

    showAddToProjectModal,
    setShowAddToProjectModal,

    bulkActions,
    groupConfigs,
    allSelectedAreDevelopers,
  };
}
