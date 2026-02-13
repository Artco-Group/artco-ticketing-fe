import { useMemo } from 'react';
import { formatDateLocalized } from '@artco-group/artco-ticketing-sync';
import {
  DataTable,
  EmptyState,
  Avatar,
  AvatarGroup,
  Icon,
  BulkActionsBar,
  ConfirmationDialog,
  type Column,
  type RowAction,
} from '@/shared/components/ui';
import type { UserWithProjects } from '@/types';
import { useClientTableState } from '../hooks/useClientTableState';

interface ClientTableProps {
  clients: UserWithProjects[];
  onEdit?: (client: UserWithProjects) => void;
  onDelete?: (client: UserWithProjects) => void;
}

export function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
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
    bulkActions,
  } = useClientTableState({ clients });

  const rowActions: RowAction<UserWithProjects>[] = useMemo(
    () => [
      ...(onEdit
        ? [
            {
              label: 'Edit',
              icon: <Icon name="edit" size="sm" />,
              onClick: (client: UserWithProjects) => onEdit(client),
            },
          ]
        : []),
      ...(onDelete
        ? [
            {
              label: 'Delete',
              icon: <Icon name="trash" size="sm" />,
              onClick: (client: UserWithProjects) => onDelete(client),
              variant: 'destructive' as const,
              separator: true,
            },
          ]
        : []),
    ],
    [onEdit, onDelete]
  );

  const columns: Column<UserWithProjects>[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        render: (client) => (
          <div className="flex items-center gap-3">
            <Avatar
              src={client.profilePic}
              fallback={client.name || client.email || ''}
              size="md"
            />
            <span className="text-foreground font-medium">
              {client.name || 'Unnamed Client'}
            </span>
          </div>
        ),
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true,
        render: (client) => (
          <span className="text-muted-foreground">{client.email}</span>
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
        render: (client) =>
          client.projects.length === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            <AvatarGroup
              size="sm"
              max={3}
              avatars={client.projects.map((project) => ({
                fallback: project.name,
                tooltip: project.name,
              }))}
            />
          ),
      },
    ],
    []
  );

  const emptyState = (
    <EmptyState
      variant="no-users"
      title="No clients found"
      message="No clients have been added yet."
      className="min-h-0 py-12"
    />
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={clients}
        emptyState={emptyState}
        selectable
        selectedRows={selectedRows}
        onSelect={setSelectedRows}
        actions={rowActions.length > 0 ? rowActions : undefined}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        getRowId={(client) => client.email ?? ''}
      />
      <BulkActionsBar
        selectedCount={selectedRows.length}
        actions={bulkActions}
        onClear={clearSelection}
      />
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete clients"
        description={`Are you sure you want to delete ${selectedRows.length} client${selectedRows.length > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        icon="trash"
      />
    </>
  );
}
