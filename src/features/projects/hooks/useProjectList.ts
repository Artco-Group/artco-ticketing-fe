import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type CreateProjectFormData,
  type UpdateProjectFormData,
} from '@artco-group/artco-ticketing-sync';
import { type User, type ProjectWithProgress, asProjectId } from '@/types';
import { getErrorMessage } from '@/shared';
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '../api/projects-api';
import { useUsers } from '@/features/users/api';
import { useToast } from '@/shared/components/ui';
import { PAGE_ROUTES } from '@/shared/constants';
import { useProjectFilters } from './useProjectFilters';
import { useProjectModal } from './useProjectModal';

export function useProjectList() {
  const navigate = useNavigate();
  const toast = useToast();

  const { data, isLoading, error, refetch, isRefetching } = useProjects();
  const { data: usersData } = useUsers();

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const projects = useMemo<ProjectWithProgress[]>(
    () => data?.projects || [],
    [data]
  );

  const users = useMemo<User[]>(() => usersData?.users || [], [usersData]);

  const filters = useProjectFilters<ProjectWithProgress>(projects);
  const modal = useProjectModal<ProjectWithProgress>();

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleCreate = async (formData: CreateProjectFormData) => {
    try {
      await createMutation.mutateAsync(formData);
      toast.success('Project created successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleUpdate = async (
    project: ProjectWithProgress,
    formData: UpdateProjectFormData
  ) => {
    if (!project.slug) return;

    try {
      await updateMutation.mutateAsync({
        slug: asProjectId(project.slug),
        data: formData,
      });
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleDelete = async (project: ProjectWithProgress) => {
    if (!project.slug) return;

    try {
      await deleteMutation.mutateAsync(asProjectId(project.slug));
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleView = (project: ProjectWithProgress) => {
    // Use human-readable slug for URL (e.g., artco-website)
    if (project.slug) {
      navigate(PAGE_ROUTES.PROJECTS.detail(asProjectId(project.slug)));
    }
  };

  const handleFormSubmit = async (
    formData: CreateProjectFormData | UpdateProjectFormData
  ) => {
    if (modal.editingProject) {
      await handleUpdate(
        modal.editingProject,
        formData as UpdateProjectFormData
      );
    } else {
      await handleCreate(formData as CreateProjectFormData);
    }
    modal.closeFormModal();
  };

  const handleConfirmDelete = async () => {
    if (modal.projectToDelete) {
      await handleDelete(modal.projectToDelete);
      modal.closeDeleteConfirm();
    }
  };

  return {
    projects,
    filteredProjects: filters.filteredProjects,
    users,
    data,

    isLoading,
    error,
    refetch,
    isRefetching,
    isSubmitting,

    priorityFilter: filters.priorityFilter,
    statusFilter: filters.statusFilter,
    leadFilter: filters.leadFilter,
    sortBy: filters.sortBy,
    setPriorityFilter: filters.setPriorityFilter,
    onFilterChange: filters.onFilterChange,

    showFormModal: modal.showFormModal,
    editingProject: modal.editingProject,
    projectToDelete: modal.projectToDelete,
    onCloseDeleteConfirm: modal.closeDeleteConfirm,

    onAddProject: modal.openCreateModal,
    onEditProject: modal.openEditModal,
    onViewProject: handleView,
    onDeleteProject: modal.openDeleteConfirm,
    onCloseFormModal: modal.closeFormModal,
    onFormSubmit: handleFormSubmit,
    onConfirmDelete: handleConfirmDelete,
  };
}
