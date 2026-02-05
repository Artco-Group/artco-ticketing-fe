import {
  type CreateUserFormData,
  type UpdateUserFormData,
} from '@artco-group/artco-ticketing-sync';
import { UserRole, type User } from '@/types';
import { Modal, ConfirmModal } from '@/shared';
import UserForm from './UserForm';
import UserTable from './UserTable';

interface UserListProps {
  users: User[];
  editingUser: User | null;
  userToDelete: User | null;
  isSubmitting: boolean;
  showFormModal: boolean;
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
  showFormModal,
  onEditUser,
  onDeleteUser,
  onCloseFormModal,
  onFormSubmit,
  onConfirmDelete,
  onCancelDelete,
}: UserListProps) {
  return (
    <div>
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
