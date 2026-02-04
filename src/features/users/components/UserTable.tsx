import { useState } from 'react';
import {
  formatDateLocalized,
  UserRoleDisplay,
} from '@artco-group/artco-ticketing-sync';
import { UserRole, type User } from '@/types';
import {
  DataTable,
  EmptyState,
  Icon,
  Avatar,
  type Column,
  type SortDirection,
  type RowAction,
  BulkActionsBar,
  type BulkAction,
} from '@/shared/components/ui';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

// Map role to status (Admin/Member/Guest)
function getStatusFromRole(role: UserRole): string {
  if (role === UserRole.ADMIN) return 'Admin';
  if (role === UserRole.CLIENT) return 'Client';
  return 'Member';
}

function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const rowActions: RowAction<User>[] = [
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
  ];

  const bulkActions: BulkAction[] = [
    {
      label: 'Add to project',
      icon: <Icon name="plus" size="sm" />,
      onClick: () => {
        // TODO: Implement bulk add to project
        console.log('Add to project:', selectedRows);
      },
    },
    {
      label: 'Move Project',
      icon: <Icon name="arrow-right" size="sm" />,
      onClick: () => {
        // TODO: Implement bulk move project
        console.log('Move project:', selectedRows);
      },
    },
    {
      label: 'Delete member',
      icon: <Icon name="trash" size="sm" />,
      onClick: () => {
        // TODO: Implement bulk delete
        selectedRows.forEach((id) => {
          const user = users.find((u) => u._id === id || u.id === id);
          if (user) onDelete(user);
        });
        setSelectedRows([]);
      },
      variant: 'destructive',
    },
  ];

  const columns: Column<User>[] = [
    {
      key: 'name',
      label: 'Name',
      width: 'w-full',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar fallback={user.name || user.email || ''} size="md" />
          <div className="flex flex-col">
            <span className="text-foreground font-medium">
              {user.name || 'Unnamed User'}
            </span>
            <span className="text-muted-foreground text-sm">{user.email}</span>
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
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (user) => {
        const status = getStatusFromRole(user.role as UserRole);
        return (
          <div className="flex items-center gap-1.5">
            <Icon name="user" size="sm" className="text-greyscale-400" />
            <span className="text-foreground">{status}</span>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Joined',
      type: 'date',
      sortable: true,
      formatDate: formatDateLocalized,
    },
  ];

  const emptyState = (
    <EmptyState
      variant="no-users"
      title="No users found"
      message="No users match your current search and filters."
      className="min-h-0 py-12"
    />
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={users}
        emptyState={emptyState}
        selectable
        selectedRows={selectedRows}
        onSelect={setSelectedRows}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={(col, dir) => {
          setSortColumn(col);
          setSortDirection(dir);
        }}
        actions={rowActions}
      />
      <BulkActionsBar
        selectedCount={selectedRows.length}
        actions={bulkActions}
        onClear={() => setSelectedRows([])}
      />
    </>
  );
}

export default UserTable;
