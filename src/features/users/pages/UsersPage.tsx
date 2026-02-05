import { useMemo } from 'react';
import { UserRoleDisplay } from '@artco-group/artco-ticketing-sync';
import { UserRole } from '@/types';
import { UserList } from '../components';
import { RetryableError, EmptyState } from '@/shared/components/ui';
import { ListPageLayout } from '@/shared/components/layout/ListPageLayout';
import { Icon } from '@/shared/components/ui/Icon/Icon';
import type {
  FilterGroup,
  FilterPanelValues,
} from '@/shared/components/patterns';
import { useUserList } from '../hooks';

const AVAILABLE_ROLES = [
  UserRole.CLIENT,
  UserRole.DEVELOPER,
  UserRole.ENG_LEAD,
  UserRole.ADMIN,
];

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
    isSubmitting,
    roleFilter,
    statusFilter,
    sortBy,
    showFormModal,
    setUserToDelete,
    onAddUser,
    onEditUser,
    onCloseFormModal,
    onFormSubmit,
    onConfirmDelete,
    onFilterChange,
  } = useUserList();

  // --- FilterBar configuration ---

  const sortOptions = useMemo(() => ['Name', 'Email', 'Role', 'Joined'], []);

  const filterBarFilters = useMemo(
    () => [
      {
        id: 'role',
        label: 'Role',
        icon: 'user' as const,
        options: AVAILABLE_ROLES.map((role) => UserRoleDisplay[role]),
        value: roleFilter === 'All' ? null : roleFilter,
      },
      {
        id: 'status',
        label: 'Status',
        icon: 'user' as const,
        options: ['Admin', 'Client', 'Member'],
        value: statusFilter,
      },
    ],
    [roleFilter, statusFilter]
  );

  const roleOptions = useMemo(
    () =>
      AVAILABLE_ROLES.map((role) => ({
        value: UserRoleDisplay[role],
        label: UserRoleDisplay[role],
      })),
    []
  );

  const filterGroups: FilterGroup[] = useMemo(
    () => [
      {
        key: 'role',
        label: 'Role',
        icon: <Icon name="user" size="sm" />,
        options: roleOptions,
        searchable: true,
      },
    ],
    [roleOptions]
  );

  const filterPanelValue = useMemo<FilterPanelValues>(() => {
    const value: FilterPanelValues = {};
    if (roleFilter && roleFilter !== 'All') {
      value.role = [roleFilter];
    }
    return value;
  }, [roleFilter]);

  const handleFilterPanelChange = (value: FilterPanelValues) => {
    const roleValues = value.role;
    if (roleValues && roleValues.length > 0) {
      onFilterChange('role', roleValues[0]);
    } else {
      onFilterChange('role', 'All');
    }
  };

  const handleFilterBarChange = (filterId: string, value: string | null) => {
    onFilterChange(filterId, value ?? 'All');
  };

  const handleSortChange = (value: string | null) => {
    onFilterChange('sortBy', value);
  };

  return (
    <ListPageLayout
      title="Users"
      count={users?.length}
      filters={filterBarFilters}
      onFilterChange={handleFilterBarChange}
      sortOptions={sortOptions}
      sortValue={sortBy}
      onSortChange={handleSortChange}
      filterGroups={filterGroups}
      filterPanelValue={filterPanelValue}
      onFilterPanelChange={handleFilterPanelChange}
      filterPanelSingleSelect
      showFilter
      showAddButton
      onAddClick={onAddUser}
      addButtonLabel="Invite Member"
      loading={isLoading}
      loadingMessage="Loading users..."
    >
      {error ? (
        <RetryableError
          title="Failed to load users"
          message="Failed to load users. Please try again later."
          onRetry={refetch}
        />
      ) : !data || filteredUsers.length === 0 ? (
        <EmptyState
          variant="no-users"
          title="No users found"
          message="No users match your current filters."
        />
      ) : (
        <UserList
          users={filteredUsers}
          editingUser={editingUser}
          userToDelete={userToDelete}
          isSubmitting={isSubmitting}
          showFormModal={showFormModal}
          onEditUser={onEditUser}
          onDeleteUser={setUserToDelete}
          onCloseFormModal={onCloseFormModal}
          onFormSubmit={onFormSubmit}
          onConfirmDelete={onConfirmDelete}
          onCancelDelete={() => setUserToDelete(null)}
        />
      )}
    </ListPageLayout>
  );
}
