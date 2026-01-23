import { UserList } from '../components';
import { QueryStateWrapper } from '@/shared/components/ui';
import { useUserList } from '../hooks';

export default function UsersPage() {
  const {
    filteredUsers,
    data,
    editingUser,
    userToDelete,
    isLoading,
    error,
    isSubmitting,
    searchTerm,
    roleFilter,
    showFormModal,
    setSearchTerm,
    setRoleFilter,
    setUserToDelete,
    onAddUser,
    onEditUser,
    onCloseFormModal,
    onFormSubmit,
    onConfirmDelete,
  } = useUserList();

  return (
    <QueryStateWrapper
      isLoading={isLoading}
      error={error}
      data={data}
      loadingMessage="Loading users..."
      errorMessage="Failed to load users. Please try again later."
    >
      {() => (
        <UserList
          users={filteredUsers}
          editingUser={editingUser}
          userToDelete={userToDelete}
          isSubmitting={isSubmitting}
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          showFormModal={showFormModal}
          onSearchChange={setSearchTerm}
          onRoleFilterChange={setRoleFilter}
          onAddUser={onAddUser}
          onEditUser={onEditUser}
          onDeleteUser={setUserToDelete}
          onCloseFormModal={onCloseFormModal}
          onFormSubmit={onFormSubmit}
          onConfirmDelete={onConfirmDelete}
          onCancelDelete={() => setUserToDelete(null)}
        />
      )}
    </QueryStateWrapper>
  );
}
