import { useState, useMemo } from 'react';
import {
  type User,
  type CreateUserFormData,
  type UpdateUserFormData,
} from '@artco-group/artco-ticketing-sync';
import { toast } from 'sonner';

import { getErrorMessage } from '@/shared';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../api';

/**
 * Custom hook for user list page logic.
 * Separates business logic from UI for better testability and maintainability.
 */
export function useUserList() {
  const { data, isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Handle wrapped API response: { status, data: { users } }
  const users = useMemo(() => data?.data?.users || [], [data]);

  const isSubmitting =
    createUserMutation.isPending ||
    updateUserMutation.isPending ||
    deleteUserMutation.isPending;

  // Filter users based on search and role
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

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

  const handleUpdateUser = async (id: string, formData: UpdateUserFormData) => {
    try {
      await updateUserMutation.mutateAsync({ id, data: formData });
      toast.success('User updated successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleDeleteUser = async (id: string) => {
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
        await handleUpdateUser(userId, formData as UpdateUserFormData);
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
        await handleDeleteUser(userId);
      }
      setUserToDelete(null);
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
    isSubmitting,
    searchTerm,
    roleFilter,
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
  };
}
