import { useState } from 'react';
import { formatDateLocalized } from '@artco-group/artco-ticketing-sync';
import {
  DataTable,
  EmptyState,
  Avatar,
  AvatarGroup,
  Icon,
  type Column,
  type RowAction,
  type SortDirection,
} from '@/shared/components/ui';
import type { UserWithProjects } from '@/types';

interface ClientTableProps {
  clients: UserWithProjects[];
  onEdit?: (client: UserWithProjects) => void;
  onDelete?: (client: UserWithProjects) => void;
}

export function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const rowActions: RowAction<UserWithProjects>[] = [
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
  ];

  const columns: Column<UserWithProjects>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (client) => (
        <div className="flex items-center gap-3">
          <Avatar fallback={client.name || client.email || ''} size="md" />
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
  ];

  const emptyState = (
    <EmptyState
      variant="no-users"
      title="No clients found"
      message="No clients have been added yet."
      className="min-h-0 py-12"
    />
  );

  return (
    <DataTable
      columns={columns}
      data={clients}
      emptyState={emptyState}
      actions={rowActions.length > 0 ? rowActions : undefined}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={(col, dir) => {
        setSortColumn(col);
        setSortDirection(dir);
      }}
    />
  );
}
