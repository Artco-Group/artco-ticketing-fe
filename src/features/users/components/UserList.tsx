import {
  type CreateUserFormData,
  type UpdateUserFormData,
  UserRoleDisplay,
} from '@artco-group/artco-ticketing-sync';
import { UserRole, type User } from '@/types';
import {
  FilterBar,
  type FilterConfig,
  Modal,
  ConfirmModal,
  Button,
  Icon,
  FilterButton,
} from '@/shared';
import UserForm from './UserForm';
import UserTable from './UserTable';

const AVAILABLE_ROLES: UserRole[] = [
  UserRole.CLIENT,
  UserRole.DEVELOPER,
  UserRole.ENG_LEAD,
  UserRole.ADMIN,
];

interface UserListProps {
  users: User[];
  editingUser: User | null;
  userToDelete: User | null;
  isSubmitting: boolean;
  searchTerm: string;
  roleFilter: string;
  showFormModal: boolean;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onCloseFormModal: () => void;
  onFormSubmit: (
    data: CreateUserFormData | UpdateUserFormData
  ) => Promise<void>;
  onConfirmDelete: () => Promise<void>;
  onCancelDelete: () => void;
}

function UserList({
  users,
  editingUser,
  userToDelete,
  isSubmitting,
  searchTerm,
  roleFilter,
  showFormModal,
  onSearchChange,
  onRoleFilterChange,
  onEditUser,
  onDeleteUser,
  onCloseFormModal,
  onFormSubmit,
  onConfirmDelete,
  onCancelDelete,
}: UserListProps) {
  const filterConfig: FilterConfig[] = [
    {
      key: 'role',
      label: 'Role',
      type: 'select' as const,
      value: roleFilter,
      options: [
        { value: 'All', label: 'All Roles' },
        ...AVAILABLE_ROLES.map((role) => ({
          value: role,
          label: UserRoleDisplay[role],
        })),
      ],
    },
  ];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex-between mb-6">
        <h1 className="text-foreground text-2xl font-bold">
          Members {users.length}
        </h1>
        <Button onClick={onAddUser}>
          <Icon name="plus" size="sm" className="mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 flex items-center gap-2">
        <FilterButton label="Sort" />
        <FilterButton label="Status" />
        <FilterButton label="Role" />
        <div className="ml-auto flex items-center gap-2">
          <FilterButton
            label="Filter"
            icon={<Icon name="filter" size="sm" />}
          />
        </div>
      </div>

      {/* Search & Filters */}
      <FilterBar
        filters={filterConfig}
        searchConfig={{
          placeholder: 'Search by name or email',
          value: searchTerm,
          onChange: onSearchChange,
        }}
        onFilterChange={(key, value) => {
          if (key === 'role') {
            onRoleFilterChange(value);
          }
        }}
        className="mb-6"
      />

      {/* Users Table */}
      <UserTable users={users} onEdit={onEditUser} onDelete={onDeleteUser} />

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={onCloseFormModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
        maxWidth="lg"
      >
        <UserForm
          key={editingUser?._id || editingUser?.id || 'new'}
          onSubmit={onFormSubmit}
          onCancel={onCloseFormModal}
          defaultValues={
            editingUser
              ? {
                  name: editingUser.name || '',
                  email: editingUser.email || '',
                  role:
                    (editingUser.role as CreateUserFormData['role']) ||
                    UserRole.CLIENT,
                }
              : undefined
          }
          isEditing={!!editingUser}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!userToDelete}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
}

export default UserList;
