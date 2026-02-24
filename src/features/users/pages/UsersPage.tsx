import { type CreateUserFormData } from '@artco-group/artco-ticketing-sync';
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
import { useUserList, useUserFilters } from '../hooks';
import { useAppTranslation } from '@/shared/hooks';

export default function UsersPage() {
  const { translate } = useAppTranslation('users');
  const { translate: translateCommon } = useAppTranslation('common');
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

  const {
    sortOptions,
    groupByOptions,
    filterBarFilters,
    handleFilterBarChange,
    handleSortChange,
  } = useUserFilters({ roleFilter, onFilterChange });

  const editingUserProjectIds =
    editingUser && 'projects' in editingUser
      ? (editingUser as UserWithStats).projects.map((p) => p.id)
      : [];

  return (
    <>
      <ListPageLayout
        title={translate('members')}
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
        addButtonLabel={translate('inviteMember')}
        loading={isLoading}
        loadingMessage={translate('list.loading')}
      >
        {error ? (
          <RetryableError
            title={translate('list.failedToLoad')}
            message={translate('list.failedToLoadMessage')}
            onRetry={refetch}
          />
        ) : !data || filteredUsers.length === 0 ? (
          <EmptyState
            variant="no-users"
            title={translate('list.noMembers')}
            message={translate('list.noMembersMatch')}
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
        title={
          editingUser ? translate('editMember') : translate('inviteMember')
        }
        size="lg"
        actions={
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCloseFormModal}
              disabled={isSubmitting}
            >
              {translateCommon('buttons.cancel')}
            </Button>
            <Button type="submit" form="user-form" disabled={isSubmitting}>
              {isSubmitting
                ? translate('form.saving')
                : editingUser
                  ? translate('form.saveChanges')
                  : translate('inviteMember')}
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
        title={translate('deleteMember')}
        description={translate('messages.confirmDeleteMember', {
          name: userToDelete?.name,
        })}
        confirmLabel={translateCommon('buttons.delete')}
        variant="destructive"
        isLoading={isSubmitting}
        icon="trash"
      />
    </>
  );
}
