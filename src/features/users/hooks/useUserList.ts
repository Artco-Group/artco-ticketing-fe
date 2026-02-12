import { useState, useMemo } from 'react';
import {
  type User,
  type Ticket,
  type Project,
  type CreateUserFormData,
  type UpdateUserFormData,
  UserRoleDisplay,
} from '@artco-group/artco-ticketing-sync';

import { getErrorMessage } from '@/shared';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useUploadAvatar,
} from '../api';
import { useTickets } from '@/features/tickets/api/tickets-api';
import {
  useProjects,
  useAddProjectMembers,
  useRemoveProjectMember,
} from '@/features/projects/api/projects-api';
import {
  UserRole,
  asUserId,
  asProjectId,
  type UserId,
  type UserWithStats,
} from '@/types';
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
  const { data: ticketsData } = useTickets();
  const { data: projectsData } = useProjects();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const uploadAvatarMutation = useUploadAvatar();
  const addProjectMembersMutation = useAddProjectMembers();
  const removeProjectMemberMutation = useRemoveProjectMember();
  const toast = useToast();

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Handle wrapped API response: { status, data: { users } }
  const rawUsers = useMemo(() => data?.users || [], [data]);

  // Get tickets array (handle both array and object response)
  const tickets = useMemo<Ticket[]>(() => {
    if (!ticketsData) return [];
    if (Array.isArray(ticketsData)) return ticketsData;
    if ('tickets' in ticketsData) return ticketsData.tickets;
    return [];
  }, [ticketsData]);

  // Get projects array
  const allProjects = useMemo<Project[]>(
    () => projectsData?.projects || [],
    [projectsData]
  );

  // Compute members with stats (exclude clients - they have their own page)
  const users = useMemo<UserWithStats[]>(() => {
    return rawUsers
      .filter((user) => user.role !== UserRole.CLIENT)
      .map((user) => {
        const id = user.id;

        // Count assigned tickets
        const assignedTicketsCount = tickets.filter(
          (ticket) => ticket.assignedTo?.id === id
        ).length;

        // Find projects where user is a member, lead, or client
        const userProjects = allProjects
          .filter((project) => {
            const isMember = project.members?.some((m) => m.id === id);
            const isLead = project.leads?.some((l) => l.id === id);
            const isClient = project.client?.id === id;
            return isMember || isLead || isClient;
          })
          .map((p) => ({ id: p.slug || p.id || '', name: p.name }));

        return {
          ...user,
          assignedTicketsCount,
          projects: userProjects,
        };
      });
  }, [rawUsers, tickets, allProjects]);

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
    formData: CreateUserFormData | UpdateUserFormData,
    projectIds?: string[],
    avatarFile?: File
  ) => {
    let userId: string | undefined;

    if (editingUser) {
      userId = editingUser.id;
      if (userId) {
        await handleUpdateUser(
          asUserId(userId),
          formData as UpdateUserFormData
        );
      }
    } else {
      const result = await createUserMutation.mutateAsync(
        formData as CreateUserFormData
      );
      userId = result?.user?.id;
      toast.success('Member created successfully');
    }

    // Upload avatar if provided (for create mode - edit mode uploads immediately)
    if (userId && avatarFile) {
      try {
        await uploadAvatarMutation.mutateAsync({
          userId: asUserId(userId),
          file: avatarFile,
        });
      } catch (_err) {
        toast.error('Failed to upload avatar');
      }
    }

    // Handle project assignments
    if (userId && projectIds) {
      // Get current project IDs (for edit mode)
      const currentProjectIds =
        editingUser && 'projects' in editingUser
          ? (editingUser as UserWithStats).projects.map((p) => p.id)
          : [];

      // Calculate projects to add (new selections)
      const projectsToAdd = projectIds.filter(
        (id) => !currentProjectIds.includes(id)
      );

      // Calculate projects to remove (deselected)
      const projectsToRemove = currentProjectIds.filter(
        (id) => !projectIds.includes(id)
      );

      // Add user to new projects
      if (projectsToAdd.length > 0) {
        try {
          await Promise.all(
            projectsToAdd.map((projectId) =>
              addProjectMembersMutation.mutateAsync({
                slug: asProjectId(projectId),
                data: { memberIds: [userId!] },
              })
            )
          );
        } catch (_err) {
          toast.error('Failed to assign to some projects');
        }
      }

      // Remove user from deselected projects
      if (projectsToRemove.length > 0) {
        try {
          await Promise.all(
            projectsToRemove.map((projectId) =>
              removeProjectMemberMutation.mutateAsync({
                projectId: asProjectId(projectId),
                memberId: userId!,
              })
            )
          );
        } catch (_err) {
          toast.error('Failed to remove from some projects');
        }
      }
    }

    handleCloseFormModal();
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      const userId = userToDelete.id;
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

  const handleGroupByChange = (value: string | null) => {
    setGroupBy(value);
  };

  return {
    // Data
    users,
    filteredUsers,
    data,
    editingUser,
    userToDelete,
    allProjects,

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
    groupBy,
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
    onGroupByChange: handleGroupByChange,
  };
}
