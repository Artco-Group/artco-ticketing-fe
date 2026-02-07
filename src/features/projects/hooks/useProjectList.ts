import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type Project,
  type CreateProjectFormData,
  type UpdateProjectFormData,
} from '@artco-group/artco-ticketing-sync';
import { type User, asProjectId } from '@/types';
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

export interface ProjectWithProgress extends Project {
  progress?: {
    totalTickets: number;
    completedTickets: number;
    percentage: number;
  };
}

const getProjectId = (project: ProjectWithProgress) =>
  project._id || project.id;

export function useProjectList() {
  const navigate = useNavigate();
  const toast = useToast();

  const { data, isLoading, error, refetch, isRefetching } = useProjects();
  const { data: usersData } = useUsers();

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const projects = useMemo<ProjectWithProgress[]>(
    () => data?.data?.projects || [],
    [data]
  );

  const users = useMemo<User[]>(
    () => usersData?.data?.users || [],
    [usersData]
  );

  const filters = useProjectFilters(projects);
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
    const id = getProjectId(project);
    if (!id) return;

    try {
      await updateMutation.mutateAsync({ id: asProjectId(id), data: formData });
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleDelete = async (project: ProjectWithProgress) => {
    const id = getProjectId(project);
    if (!id) return;

    try {
      await deleteMutation.mutateAsync(asProjectId(id));
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleView = (project: ProjectWithProgress) => {
    const id = getProjectId(project);
    if (id) {
      navigate(PAGE_ROUTES.PROJECTS.detail(asProjectId(id)));
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

    onAddProject: modal.openCreateModal,
    onEditProject: modal.openEditModal,
    onViewProject: handleView,
    onDeleteProject: modal.openDeleteConfirm,
    onCloseFormModal: modal.closeFormModal,
    onFormSubmit: handleFormSubmit,
    onConfirmDelete: handleConfirmDelete,
  };
}
