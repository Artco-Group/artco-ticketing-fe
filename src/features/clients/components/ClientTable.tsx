import { useMemo } from 'react';
import { formatDateDisplay } from '@artco-group/artco-ticketing-sync';
import {
  DataTable,
  EmptyState,
  Avatar,
  AvatarGroup,
  Badge,
  Icon,
  BulkActionsBar,
  ConfirmationDialog,
  type Column,
  type RowAction,
} from '@/shared/components/ui';
import { useAppTranslation } from '@/shared/hooks';
import type { UserWithProjects } from '@/types';
import { useClientTableState } from '../hooks/useClientTableState';

interface ClientTableProps {
  clients: UserWithProjects[];
  onEdit?: (client: UserWithProjects) => void;
  onDelete?: (client: UserWithProjects) => void;
  onManageContracts?: (client: UserWithProjects) => void;
}

export function ClientTable({
  clients,
  onEdit,
  onDelete,
  onManageContracts,
}: ClientTableProps) {
  const { translate, language } = useAppTranslation('clients');
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
              label: translate('table.rowActions.edit'),
              icon: <Icon name="edit" size="sm" />,
              onClick: (client: UserWithProjects) => onEdit(client),
            },
          ]
        : []),
      ...(onManageContracts
        ? [
            {
              label: translate('table.rowActions.manageContracts'),
              icon: <Icon name="file-text" size="sm" />,
              onClick: (client: UserWithProjects) => onManageContracts(client),
            },
          ]
        : []),
      ...(onDelete
        ? [
            {
              label: translate('table.rowActions.delete'),
              icon: <Icon name="trash" size="sm" />,
              onClick: (client: UserWithProjects) => onDelete(client),
              variant: 'destructive' as const,
              separator: true,
            },
          ]
        : []),
    ],
    [onEdit, onDelete, onManageContracts, translate]
  );

  const columns: Column<UserWithProjects>[] = useMemo(
    () => [
      {
        key: 'name',
        label: translate('table.columns.name'),
        sortable: true,
        render: (client) => (
          <div className="flex items-center gap-3">
            <Avatar
              src={client.profilePic}
              fallback={client.name || client.email || ''}
              size="md"
            />
            <span className="text-foreground font-medium">
              {client.name || translate('table.unnamedClient')}
            </span>
          </div>
        ),
      },
      {
        key: 'email',
        label: translate('table.columns.email'),
        sortable: true,
        render: (client) => (
          <span className="text-muted-foreground">{client.email}</span>
        ),
      },
      {
        key: 'contracts',
        label: translate('table.columns.contracts'),
        render: (client) => {
          const contracts = client.contracts || [];
          if (contracts.length === 0) {
            return <span className="text-muted-foreground">—</span>;
          }
          return (
            <div className="flex items-center gap-1">
              <Badge variant="outline" size="sm">
                {contracts.length}
              </Badge>
            </div>
          );
        },
      },
      {
        key: 'createdAt',
        label: translate('table.columns.joined'),
        type: 'date',
        sortable: true,
        formatDate: (date: Date | string) => formatDateDisplay(date, language),
      },
      {
        key: 'projects',
        label: translate('table.columns.projects'),
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
}
