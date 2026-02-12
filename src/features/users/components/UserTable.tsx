import { useMemo } from 'react';
import {
  formatDateLocalized,
  UserRoleDisplay,
} from '@artco-group/artco-ticketing-sync';
import { UserRole, asUserId, type UserWithStats } from '@/types';
import { getAvatarUrl } from '../api';
import {
  DataTable,
  EmptyState,
  Icon,
  Avatar,
  AvatarGroup,
  type Column,
  type RowAction,
  BulkActionsBar,
  ConfirmationDialog,
} from '@/shared/components/ui';
import { StatusHeader } from '@/shared/components/patterns/StatusHeader';
import { useGroupedData } from '@/shared/hooks/useGroupedData';
import { AddToProjectModal } from './AddToProjectModal';
import { useUserTableState } from '../hooks/useUserTableState';

interface UserTableProps {
  users: UserWithStats[];
  onEdit: (user: UserWithStats) => void;
  onDelete: (user: UserWithStats) => void;
  groupByValue?: string | null;
}

function UserTable({ users, onEdit, onDelete, groupByValue }: UserTableProps) {
  const {
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
  } = useUserTableState({ users });

  const groupedUsers = useGroupedData(
    users,
    groupByValue ?? null,
    groupConfigs
  );

  const rowActions: RowAction<UserWithStats>[] = useMemo(
    () => [
      {
        label: 'Edit',
        icon: <Icon name="edit" size="sm" />,
        onClick: (user) => onEdit(user),
      },
      {
        label: 'Delete',
        icon: <Icon name="trash" size="sm" />,
        onClick: (user) => onDelete(user),
        variant: 'destructive',
        separator: true,
      },
    ],
    [onEdit, onDelete]
  );

  const columns: Column<UserWithStats>[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        render: (user) => (
          <div className="flex items-center gap-3">
            <Avatar
              src={
                user.profilePic ? getAvatarUrl(asUserId(user.id)) : undefined
              }
              fallback={user.name || user.email || ''}
              size="md"
            />
            <div className="flex flex-col">
              <span className="text-foreground font-medium">
                {user.name || 'Unnamed User'}
              </span>
              <span className="text-muted-foreground text-sm">
                {user.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'role',
        label: 'Role',
        sortable: true,
        render: (user) => (
          <span className="text-foreground">
            {UserRoleDisplay[user.role as UserRole] || user.role}
          </span>
        ),
      },
      {
        key: 'createdAt',
        label: 'Joined',
        type: 'date',
        sortable: true,
        formatDate: formatDateLocalized,
      },
      {
        key: 'projects',
        label: 'Projects',
        render: (user) =>
          user.projects.length === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            <AvatarGroup
              size="sm"
              max={3}
              avatars={user.projects.map((project) => ({
                fallback: project.name,
                tooltip: project.name,
              }))}
            />
          ),
      },
      {
        key: 'assignedTicketsCount',
        label: 'Issues',
        sortable: true,
        render: (user) => (
          <span className="text-foreground">
            {user.assignedTicketsCount} issues
          </span>
        ),
      },
    ],
    []
  );

  const emptyState = (
    <EmptyState
      variant="no-users"
      title="No members found"
      message="No members match your current search and filters."
      className="min-h-0 py-12"
    />
  );

  const tableProps = {
    columns,
    emptyState,
    selectable: true,
    selectedRows,
    onSelect: setSelectedRows,
    sortColumn,
    sortDirection,
    onSort: handleSort,
    actions: rowActions,
  };

  const renderDialogs = () => (
    <>
      <AddToProjectModal
        isOpen={showAddToProjectModal}
        onClose={() => setShowAddToProjectModal(false)}
        userIds={selectedRows}
        onSuccess={clearSelection}
      />
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete members"
        description={`Are you sure you want to delete ${selectedRows.length} member${selectedRows.length > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        icon="trash"
      />
    </>
  );

  if (groupByValue && groupedUsers.length > 0) {
    return (
      <>
        {groupedUsers.map((group) => (
          <div key={group.key}>
            <StatusHeader icon={group.icon} label={group.label} />
            <DataTable {...tableProps} data={group.items} />
          </div>
        ))}
        <BulkActionsBar
          selectedCount={selectedRows.length}
          actions={bulkActions}
          onClear={clearSelection}
        />
        {renderDialogs()}
      </>
    );
  }

  return (
    <>
      <DataTable {...tableProps} data={users} />
      <BulkActionsBar
        selectedCount={selectedRows.length}
        actions={bulkActions}
        onClear={clearSelection}
      />
      {renderDialogs()}
    </>
  );
}

export default UserTable;
