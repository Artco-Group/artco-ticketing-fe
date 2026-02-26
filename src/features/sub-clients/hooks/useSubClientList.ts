import { useState, useMemo } from 'react';
import {
  type User,
  type CreateSubClientFormData,
  type UpdateSubClientFormData,
} from '@artco-group/artco-ticketing-sync';
import {
  useSubClients,
  useCreateSubClient,
  useUpdateSubClient,
  useDeleteSubClient,
} from '../api/sub-clients-api';
import { useProjects } from '@/features/projects/api/projects-api';
import { useAuth } from '@/features/auth/context';
import { useTranslatedToast } from '@/shared/hooks';
import { useToast } from '@/shared/components/ui';
import { getErrorMessage } from '@/shared';
import type { Project } from '@/types';

export function useSubClientList() {
  const { user: currentUser } = useAuth();
  const { data, isLoading, error, refetch } = useSubClients();
  const { data: projectsData } = useProjects();
  const createMutation = useCreateSubClient();
  const updateMutation = useUpdateSubClient();
  const deleteMutation = useDeleteSubClient();
  const translatedToast = useTranslatedToast();
  const toast = useToast();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSubClient, setEditingSubClient] = useState<User | null>(null);
  const [subClientToDelete, setSubClientToDelete] = useState<User | null>(null);

  const subClients = useMemo(() => data?.subClients || [], [data]);

  // Projects where current user is the client (parent's projects)
  const parentProjects = useMemo<Project[]>(() => {
    if (!projectsData?.projects || !currentUser) return [];
    return projectsData.projects.filter((p) => p.client?.id === currentUser.id);
  }, [projectsData, currentUser]);

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleAddSubClient = () => {
    setEditingSubClient(null);
    setShowFormModal(true);
  };

  const handleEditSubClient = (subClient: User) => {
    setEditingSubClient(subClient);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setEditingSubClient(null);
  };

  const handleFormSubmit = async (
    formData: CreateSubClientFormData | UpdateSubClientFormData
  ) => {
    try {
      if (editingSubClient) {
        await updateMutation.mutateAsync({
          id: editingSubClient.id,
          data: formData as UpdateSubClientFormData,
        });
        translatedToast.success('toast.success.updated', {
          item: 'Sub-client',
        });
        handleCloseFormModal();
        return;
      }

      await createMutation.mutateAsync(formData as CreateSubClientFormData);
      translatedToast.success('toast.success.created', { item: 'Sub-client' });
      handleCloseFormModal();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleConfirmDelete = async () => {
    if (!subClientToDelete) return;

    try {
      await deleteMutation.mutateAsync(subClientToDelete.id);
      translatedToast.success('toast.success.deleted', { item: 'Sub-client' });
      setSubClientToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return {
    subClients,
    parentProjects,
    editingSubClient,
    subClientToDelete,
    isLoading,
    error,
    refetch,
    isSubmitting,
    showFormModal,
    setSubClientToDelete,
    onAddSubClient: handleAddSubClient,
    onEditSubClient: handleEditSubClient,
    onCloseFormModal: handleCloseFormModal,
    onFormSubmit: handleFormSubmit,
    onConfirmDelete: handleConfirmDelete,
  };
}
