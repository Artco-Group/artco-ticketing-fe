import { useMemo, useCallback } from 'react';
import { UserList } from '../components';
import { QueryStateWrapper, Button } from '@/shared/components/ui';
import {
  usePageHeader,
  usePageHeaderTabs,
  type Tab,
} from '@/shared/components/patterns';
import { useUserList } from '../hooks';

const USER_TABS: Tab[] = [{ id: 'all', label: 'All', icon: 'all' }];

export default function UsersPage() {
  const {
    users,
    filteredUsers,
    data,
    editingUser,
    userToDelete,
    isLoading,
    error,
    refetch,
    isRefetching,
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

  usePageHeader({ count: users?.length });

  const tabBarActions = useMemo(
    () => (
      <>
        <Button variant="outline" leftIcon="download" rightIcon="chevron-down">
          Import / Export
        </Button>
        <Button
          onClick={onAddUser}
          leftIcon="plus"
          className="bg-greyscale-900 hover:bg-greyscale-800 text-white"
        >
          Add User
        </Button>
      </>
    ),
    [onAddUser]
  );

  const handleTabChange = useCallback(() => {}, []);

  usePageHeaderTabs({
    tabs: USER_TABS,
    activeTab: 'all',
    onTabChange: handleTabChange,
    actions: tabBarActions,
  });

  return (
    <QueryStateWrapper
      isLoading={isLoading}
      error={error}
      data={data}
      loadingMessage="Loading users..."
      errorTitle="Failed to load users"
      errorMessage="Failed to load users. Please try again later."
      onRetry={refetch}
      isRefetching={isRefetching}
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
