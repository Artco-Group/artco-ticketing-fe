import { useMemo } from 'react';
import { formatDateDisplay } from '@artco-group/artco-ticketing-sync';
import type { User } from '@/types';
import {
  DataTable,
  EmptyState,
  Avatar,
  AvatarGroup,
  Icon,
  type Column,
  type RowAction,
} from '@/shared/components/ui';
import { useAppTranslation } from '@/shared/hooks';

interface SubClientTableProps {
  subClients: User[];
  onEdit?: (subClient: User) => void;
  onDelete?: (subClient: User) => void;
}

export function SubClientTable({
  subClients,
  onEdit,
  onDelete,
}: SubClientTableProps) {
  const { translate, language } = useAppTranslation('subClients');

  const rowActions: RowAction<User>[] = useMemo(
    () => [
      ...(onEdit
        ? [
            {
              label: translate('table.rowActions.edit'),
              icon: <Icon name="edit" size="sm" />,
              onClick: (subClient: User) => onEdit(subClient),
            },
          ]
        : []),
      ...(onDelete
        ? [
            {
              label: translate('table.rowActions.delete'),
              icon: <Icon name="trash" size="sm" />,
              onClick: (subClient: User) => onDelete(subClient),
              variant: 'destructive' as const,
              separator: true,
            },
          ]
        : []),
    ],
    [onEdit, onDelete, translate]
  );

  const columns: Column<User>[] = useMemo(
    () => [
      {
        key: 'name',
        label: translate('table.columns.name'),
        sortable: true,
        render: (subClient) => (
          <div className="flex items-center gap-3">
            <Avatar
              src={subClient.profilePic}
              fallback={subClient.name || subClient.email || ''}
              size="md"
            />
            <span className="text-foreground font-medium">
              {subClient.name || subClient.email}
            </span>
          </div>
        ),
      },
      {
        key: 'email',
        label: translate('table.columns.email'),
        sortable: true,
        render: (subClient) => (
          <span className="text-muted-foreground">{subClient.email}</span>
        ),
      },
      {
        key: 'assignedProjects',
        label: translate('table.columns.projects'),
        render: (subClient) => {
          const assigned = subClient.assignedProjects || [];
          if (assigned.length === 0) {
            return <span className="text-muted-foreground">—</span>;
          }
          const projectAvatars = assigned
            .map((project) =>
              project.name
                ? { fallback: project.name, tooltip: project.name }
                : null
            )
            .filter(Boolean) as { fallback: string; tooltip: string }[];
          return projectAvatars.length > 0 ? (
            <AvatarGroup size="sm" max={3} avatars={projectAvatars} />
          ) : (
            <span className="text-muted-foreground">—</span>
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
    <DataTable
      columns={columns}
      data={subClients}
      emptyState={emptyState}
      actions={rowActions.length > 0 ? rowActions : undefined}
      getRowId={(subClient) => subClient.id ?? ''}
    />
  );
}
