import {
  type User,
  UserRole,
  formatDateLocalized,
  getRoleBadgeClasses,
} from '@artco-group/artco-ticketing-sync';
import { Pencil, Trash2 } from 'lucide-react';
import {
  DataTable,
  textColumn,
  badgeColumn,
  dateColumn,
  actionsColumn,
  EmptyState,
} from '@/shared/components/ui';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const columns = [
    textColumn<User>('name', 'Name', {
      className: 'font-medium text-foreground',
    }),
    textColumn<User>('email', 'Email', {
      className: 'text-sm text-foreground',
    }),
    badgeColumn<User>('role', 'Role', (role) =>
      getRoleBadgeClasses(role as UserRole)
    ),
    dateColumn<User>('createdAt', 'Created', formatDateLocalized, {
      className: 'text-muted-foreground',
    }),
    actionsColumn<User>('actions', 'Actions', [
      {
        icon: () => <Pencil className="h-4 w-4" />,
        onClick: onEdit,
        label: 'Edit user',
        className:
          'p-1.5 text-muted-foreground transition-colors hover:text-primary',
      },
      {
        icon: () => <Trash2 className="h-4 w-4" />,
        onClick: onDelete,
        label: 'Delete user',
        className:
          'p-1.5 text-muted-foreground transition-colors hover:text-destructive',
      },
    ]),
  ];

  const emptyState = (
    <EmptyState
      variant="no-users"
      title="No users found"
      message="No users match your current search and filters."
      className="min-h-0 py-12"
    />
  );

  return <DataTable columns={columns} data={users} emptyState={emptyState} />;
}

export default UserTable;
