import { useState, useMemo } from 'react';
import {
  type Project,
  type User,
  type CreateUserFormData,
  type UpdateUserFormData,
} from '@artco-group/artco-ticketing-sync';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '@/features/users/api';
import { useProjects } from '@/features/projects/api/projects-api';
import { UserRole, asUserId, type UserWithProjects } from '@/types';
import { useTranslatedToast } from '@/shared/hooks';
import { useToast } from '@/shared/components/ui';
import { getErrorMessage } from '@/shared';

export function useClientList() {
  const { data, isLoading, error, refetch } = useUsers({
    role: UserRole.CLIENT,
  });
  const { data: projectsData } = useProjects();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const translatedToast = useTranslatedToast();
  const toast = useToast();

  const [sortBy, setSortBy] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingClient, setEditingClient] = useState<User | null>(null);
  const [clientToDelete, setClientToDelete] = useState<User | null>(null);

  const rawClients = useMemo(() => data?.users || [], [data]);

  const allProjects = useMemo<Project[]>(
    () => projectsData?.projects || [],
    [projectsData]
  );

  const clients = useMemo<UserWithProjects[]>(() => {
    return rawClients.map((client) => {
      const id = client.id;

      const clientProjects = allProjects
        .filter((project) => {
          return project.client?.id === id;
        })
        .map((p) => ({ id: p.id || '', name: p.name }));

      return {
        ...client,
        projects: clientProjects,
      };
    });
  }, [rawClients, allProjects]);

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const sortedClients = useMemo(() => {
    if (!sortBy) return clients;

    return [...clients].sort((a, b) => {
      switch (sortBy) {
        case 'Name':
          return (a.name || '').localeCompare(b.name || '');
        case 'Email':
          return (a.email || '').localeCompare(b.email || '');
        case 'Joined': {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        }
        default:
          return 0;
      }
    });
  }, [clients, sortBy]);

  const handleAddClient = () => {
    setEditingClient(null);
    setShowFormModal(true);
  };

  const handleEditClient = (client: User) => {
    setEditingClient(client);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setEditingClient(null);
  };

  const handleFormSubmit = async (
    formData: CreateUserFormData | UpdateUserFormData,
    _projectIds?: string[],
    _avatarFile?: File
  ) => {
    try {
      if (editingClient) {
        const { id: clientId } = editingClient;
        if (!clientId) {
          translatedToast.error('toast.error.invalidData', { item: 'client' });
          return;
        }

        await updateMutation.mutateAsync({
          id: asUserId(clientId),
          data: formData as UpdateUserFormData,
        });
        translatedToast.success('toast.success.updated', { item: 'Client' });
        handleCloseFormModal();
        return;
      }

      await createMutation.mutateAsync(formData as CreateUserFormData);
      translatedToast.success('toast.success.created', { item: 'Client' });
      handleCloseFormModal();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    const { id: clientId } = clientToDelete;
    if (!clientId) {
      translatedToast.error('toast.error.invalidData', { item: 'client' });
      return;
    }

    try {
      await deleteMutation.mutateAsync(asUserId(clientId));
      translatedToast.success('toast.success.deleted', { item: 'Client' });
      setClientToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return {
    // Data
    clients,
    sortedClients,
    editingClient,
    clientToDelete,

    // State
    isLoading,
    error,
    refetch,
    isSubmitting,
    sortBy,
    showFormModal,

    // State setters
    setSortBy,
    setClientToDelete,

    // Handlers
    onAddClient: handleAddClient,
    onEditClient: handleEditClient,
    onCloseFormModal: handleCloseFormModal,
    onFormSubmit: handleFormSubmit,
    onConfirmDelete: handleConfirmDelete,
  };
}
