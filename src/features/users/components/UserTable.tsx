import { useMemo } from 'react';
import {
  formatDateDisplay,
  UserRole,
  UserRoleTranslationKeys,
} from '@artco-group/artco-ticketing-sync';
import { type UserWithStats } from '@/types';
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
import { useAppTranslation } from '@/shared/hooks';
import { AddToProjectModal } from './AddToProjectModal';
import { useUserTableState } from '../hooks/useUserTableState';

interface UserTableProps {
  users: UserWithStats[];
  onEdit: (user: UserWithStats) => void;
  onDelete: (user: UserWithStats) => void;
  groupByValue?: string | null;
}

function UserTable({ users, onEdit, onDelete, groupByValue }: UserTableProps) {
  const { translate, language } = useAppTranslation('users');
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
        label: translate('table.rowActions.edit'),
        icon: <Icon name="edit" size="sm" />,
        onClick: (user) => onEdit(user),
      },
      {
        label: translate('table.rowActions.delete'),
        icon: <Icon name="trash" size="sm" />,
        onClick: (user) => onDelete(user),
        variant: 'destructive',
        separator: true,
      },
    ],
    [onEdit, onDelete, translate]
  );

  const columns: Column<UserWithStats>[] = useMemo(
    () => [
      {
        key: 'name',
        label: translate('table.columns.name'),
        sortable: true,
        width: 'w-[35%]',
        render: (user) => (
          <div className="flex items-center gap-3">
            <Avatar
              src={user.profilePic}
              fallback={user.name || user.email || ''}
              size="md"
            />
            <div className="flex flex-col">
              <span className="text-foreground font-medium">
                {user.name || translate('table.unnamedUser')}
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
        label: translate('table.columns.role'),
        sortable: true,
        width: 'w-[20%]',
        render: (user) => (
          <span className="text-foreground">
            {UserRoleTranslationKeys[user.role as UserRole]
              ? translate(UserRoleTranslationKeys[user.role as UserRole])
              : user.role}
          </span>
        ),
      },
      {
        key: 'createdAt',
        label: translate('table.columns.joined'),
        type: 'date',
        width: 'w-[15%]',
        sortable: true,
        formatDate: (date: Date | string) => formatDateDisplay(date, language),
      },
      {
        key: 'projects',
        label: translate('table.columns.projects'),
        width: 'w-[14%]',
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
        label: translate('table.columns.issues'),
        width: 'w-[10%]',
        sortable: true,
        render: (user) => (
          <span className="text-foreground">
            {translate('table.issuesCount', {
              count: user.assignedTicketsCount,
            })}
          </span>
        ),
      },
    ],
    [translate, language]
  );

  const emptyState = (
    <EmptyState
      variant="no-users"
      title={translate('list.empty')}
      message={translate('list.emptyDescription')}
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
    getRowId: (user: UserWithStats) => user.email ?? '',
  };

  const renderDialogs = () => (
    <>
      <AddToProjectModal
        isOpen={showAddToProjectModal}
        onClose={() => setShowAddToProjectModal(false)}
        userEmails={selectedRows}
        onSuccess={clearSelection}
      />
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title={translate('table.deleteTitle')}
        description={translate('table.deleteConfirm', {
          count: selectedRows.length,
        })}
        confirmLabel={translate('table.deleteButton')}
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
