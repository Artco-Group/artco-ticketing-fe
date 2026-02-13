import { useMemo } from 'react';
import {
  UserRoleDisplay,
  type CreateUserFormData,
  INTERNAL_ROLES,
} from '@artco-group/artco-ticketing-sync';
import { UserRole, type UserWithStats } from '@/types';
import { UserTable, UserForm } from '../components';
import {
  RetryableError,
  EmptyState,
  Modal,
  ConfirmationDialog,
  Button,
} from '@/shared/components/ui';
import { ListPageLayout } from '@/shared/components/layout/ListPageLayout';
import { useUserList } from '../hooks';

export default function UsersPage() {
  const {
    users,
    filteredUsers,
    data,
    editingUser,
    userToDelete,
    allProjects,
    isLoading,
    error,
    refetch,
    isSubmitting,
    roleFilter,
    sortBy,
    groupBy,
    showFormModal,
    setUserToDelete,
    onAddUser,
    onEditUser,
    onCloseFormModal,
    onFormSubmit,
    onConfirmDelete,
    onFilterChange,
    onGroupByChange,
  } = useUserList();

  const sortOptions = useMemo(() => ['Name', 'Email', 'Role', 'Joined'], []);

  const groupByOptions = useMemo(() => [{ label: 'Role', value: 'role' }], []);

  const filterBarFilters = useMemo(
    () => [
      {
        id: 'role',
        label: 'Role',
        icon: 'user' as const,
        options: INTERNAL_ROLES.map((role) => UserRoleDisplay[role]),
        value: roleFilter === 'All' ? null : roleFilter,
      },
    ],
    [roleFilter]
  );

  const handleFilterBarChange = (filterId: string, value: string | null) => {
    onFilterChange(filterId, value ?? 'All');
  };

  const handleSortChange = (value: string | null) => {
    onFilterChange('sortBy', value);
  };

  const editingUserProjectIds =
    editingUser && 'projects' in editingUser
      ? (editingUser as UserWithStats).projects.map((p) => p.id)
      : [];

  return (
    <>
      <ListPageLayout
        title="Members"
        count={users?.length}
        filters={filterBarFilters}
        onFilterChange={handleFilterBarChange}
        sortOptions={sortOptions}
        sortValue={sortBy}
        onSortChange={handleSortChange}
        groupByOptions={groupByOptions}
        groupByValue={groupBy}
        onGroupByChange={onGroupByChange}
        showFilter
        showAddButton
        onAddClick={onAddUser}
        addButtonLabel="Invite Member"
        loading={isLoading}
        loadingMessage="Loading members..."
      >
        {error ? (
          <RetryableError
            title="Failed to load members"
            message="Failed to load members. Please try again later."
            onRetry={refetch}
          />
        ) : !data || filteredUsers.length === 0 ? (
          <EmptyState
            variant="no-users"
            title="No members found"
            message="No members match your current filters."
          />
        ) : (
          <UserTable
            users={filteredUsers}
            onEdit={onEditUser}
            onDelete={setUserToDelete}
            groupByValue={groupBy}
          />
        )}
      </ListPageLayout>

      <Modal
        isOpen={showFormModal}
        onClose={onCloseFormModal}
        title={editingUser ? 'Edit Member' : 'Invite Member'}
        size="lg"
        actions={
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCloseFormModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" form="user-form" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : editingUser
                  ? 'Save Changes'
                  : 'Invite Member'}
            </Button>
          </div>
        }
      >
        <UserForm
          key={editingUser?.id || 'new'}
          formId="user-form"
          onSubmit={onFormSubmit}
          defaultValues={
            editingUser
              ? {
                  name: editingUser.name || '',
                  email: editingUser.email || '',
                  role:
                    (editingUser.role as CreateUserFormData['role']) ||
                    UserRole.DEVELOPER,
                }
              : undefined
          }
          isEditing={!!editingUser}
          isSubmitting={isSubmitting}
          projects={allProjects}
          currentUserProjectIds={editingUserProjectIds}
          userId={editingUser?.id}
          currentAvatar={(editingUser as { profilePic?: string })?.profilePic}
        />
      </Modal>

      <ConfirmationDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={onConfirmDelete}
        title="Delete Member"
        description={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isSubmitting}
        icon="trash"
      />
    </>
  );
}
