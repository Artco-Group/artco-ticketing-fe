import { useState, useMemo } from 'react';
import {
  type User,
  type CreateUserFormData,
  type UpdateUserFormData,
  UserRoleDisplay,
} from '@artco-group/artco-ticketing-sync';

import { getErrorMessage } from '@/shared';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../api';
import { UserRole, asUserId, type UserId } from '@/types';
import { useToast } from '@/shared/components/ui';

function getStatusFromRole(role: string): string {
  if (role === UserRole.ADMIN) return 'Admin';
  if (role === UserRole.CLIENT) return 'Client';
  return 'Member';
}

/**
 * Custom hook for user list page logic.
 * Separates business logic from UI for better testability and maintainability.
 */
export function useUserList() {
  const { data, isLoading, error, refetch, isRefetching } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const toast = useToast();

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Handle wrapped API response: { status, data: { users } }
  const users = useMemo(() => data?.data?.users || [], [data]);

  const isSubmitting =
    createUserMutation.isPending ||
    updateUserMutation.isPending ||
    deleteUserMutation.isPending;

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = users.filter((user) => {
      const matchesSearch =
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const matchesRole =
        !roleFilter ||
        roleFilter === 'All' ||
        UserRoleDisplay[user.role as UserRole] === roleFilter;

      const matchesStatus =
        !statusFilter ||
        getStatusFromRole(user.role as string) === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });

    if (sortBy) {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'Name':
            return (a.name || '').localeCompare(b.name || '');
          case 'Email':
            return (a.email || '').localeCompare(b.email || '');
          case 'Role':
            return (UserRoleDisplay[a.role as UserRole] || '').localeCompare(
              UserRoleDisplay[b.role as UserRole] || ''
            );
          case 'Joined': {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateA - dateB;
          }
          default:
            return 0;
        }
      });
    }

    return result;
  }, [users, searchTerm, roleFilter, statusFilter, sortBy]);

  // CRUD handlers
  const handleCreateUser = async (formData: CreateUserFormData) => {
    try {
      await createUserMutation.mutateAsync(formData);
      toast.success('User created successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleUpdateUser = async (id: UserId, formData: UpdateUserFormData) => {
    try {
      await updateUserMutation.mutateAsync({ id, data: formData });
      toast.success('User updated successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleDeleteUser = async (id: UserId) => {
    try {
      await deleteUserMutation.mutateAsync(id);
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  // Modal handlers
  const handleAddUser = () => {
    setEditingUser(null);
    setShowFormModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setEditingUser(null);
  };

  const handleFormSubmit = async (
    formData: CreateUserFormData | UpdateUserFormData
  ) => {
    if (editingUser) {
      const userId = editingUser._id || editingUser.id;
      if (userId) {
        await handleUpdateUser(
          asUserId(userId),
          formData as UpdateUserFormData
        );
      }
    } else {
      await handleCreateUser(formData as CreateUserFormData);
    }
    handleCloseFormModal();
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      const userId = userToDelete._id || userToDelete.id;
      if (userId) {
        await handleDeleteUser(asUserId(userId));
      }
      setUserToDelete(null);
    }
  };

  // Generic filter change handler for FilterBar integration
  const handleFilterChange = (filterId: string, value: string | null) => {
    switch (filterId) {
      case 'role':
        setRoleFilter(!value || value === 'All' ? 'All' : value);
        break;
      case 'status':
        setStatusFilter(!value || value === 'All' ? null : value);
        break;
      case 'sortBy':
        setSortBy(value);
        break;
    }
  };

  return {
    // Data
    users,
    filteredUsers,
    data,
    editingUser,
    userToDelete,

    // State
    isLoading,
    error,
    refetch,
    isRefetching,
    isSubmitting,
    searchTerm,
    roleFilter,
    statusFilter,
    sortBy,
    showFormModal,

    // State setters
    setSearchTerm,
    setRoleFilter,
    setUserToDelete,

    // Handlers
    onAddUser: handleAddUser,
    onEditUser: handleEditUser,
    onCloseFormModal: handleCloseFormModal,
    onFormSubmit: handleFormSubmit,
    onConfirmDelete: handleConfirmDelete,
    onFilterChange: handleFilterChange,
  };
}
