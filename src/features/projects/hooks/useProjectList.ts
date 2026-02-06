import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type Project,
  type CreateProjectFormData,
  type UpdateProjectFormData,
  ProjectPriority,
  ProjectPriorityDisplay,
} from '@artco-group/artco-ticketing-sync';
import { type User } from '@/types';
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

interface ProjectWithProgress extends Project {
  progress?: {
    totalTickets: number;
    completedTickets: number;
    percentage: number;
  };
}

type ProjectId = string;

function asProjectId(id: string | undefined): ProjectId {
  return id as ProjectId;
}

export function useProjectList() {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch, isRefetching } = useProjects();
  const { data: usersData } = useUsers();
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();
  const toast = useToast();

  // UI state
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [leadFilter, setLeadFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProject, setEditingProject] =
    useState<ProjectWithProgress | null>(null);
  const [projectToDelete, setProjectToDelete] =
    useState<ProjectWithProgress | null>(null);

  // Handle wrapped API response: { status, data: { projects } }
  const projects = useMemo<ProjectWithProgress[]>(
    () => data?.data?.projects || [],
    [data]
  );

  const users = useMemo<User[]>(
    () => usersData?.data?.users || [],
    [usersData]
  );

  const isSubmitting =
    createProjectMutation.isPending ||
    updateProjectMutation.isPending ||
    deleteProjectMutation.isPending;

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = projects.filter((project) => {
      const matchesPriority =
        !priorityFilter ||
        priorityFilter === 'All' ||
        ProjectPriorityDisplay[project.priority as ProjectPriority] ===
          priorityFilter;

      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'Active' && !project.isArchived) ||
        (statusFilter === 'Archived' && project.isArchived);

      const matchesLead =
        !leadFilter ||
        (project.leads as User[] | undefined)?.some(
          (lead) => (lead._id || lead.id) === leadFilter
        );

      return matchesPriority && matchesStatus && matchesLead;
    });

    if (sortBy) {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'Name':
            return (a.name || '').localeCompare(b.name || '');
          case 'Priority': {
            const priorityOrder: Record<string, number> = {
              [ProjectPriority.CRITICAL]: 4,
              [ProjectPriority.HIGH]: 3,
              [ProjectPriority.MEDIUM]: 2,
              [ProjectPriority.LOW]: 1,
            };
            return (
              (priorityOrder[b.priority as string] || 0) -
              (priorityOrder[a.priority as string] || 0)
            );
          }
          case 'Due Date': {
            const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
            const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
            return dateA - dateB;
          }
          case 'Progress': {
            return (
              (b.progress?.percentage || 0) - (a.progress?.percentage || 0)
            );
          }
          case 'Updated': {
            const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return dateB - dateA;
          }
          default:
            return 0;
        }
      });
    }

    return result;
  }, [projects, priorityFilter, statusFilter, leadFilter, sortBy]);

  // CRUD handlers
  const handleCreateProject = async (formData: CreateProjectFormData) => {
    try {
      await createProjectMutation.mutateAsync(formData);
      toast.success('Project created successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleUpdateProject = async (
    id: ProjectId,
    formData: UpdateProjectFormData
  ) => {
    try {
      await updateProjectMutation.mutateAsync({ id, data: formData });
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleDeleteProject = async (id: ProjectId) => {
    try {
      await deleteProjectMutation.mutateAsync(id);
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  // Navigation handlers
  const handleViewProject = (project: ProjectWithProgress) => {
    const projectId = project._id || project.id;
    if (projectId) {
      navigate(PAGE_ROUTES.PROJECTS.detail(projectId as string));
    }
  };

  // Modal handlers
  const handleAddProject = () => {
    setEditingProject(null);
    setShowFormModal(true);
  };

  const handleEditProject = (project: ProjectWithProgress) => {
    setEditingProject(project);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setEditingProject(null);
  };

  const handleFormSubmit = async (
    formData: CreateProjectFormData | UpdateProjectFormData
  ) => {
    if (editingProject) {
      const projectId = editingProject._id || editingProject.id;
      if (projectId) {
        await handleUpdateProject(
          asProjectId(projectId as string),
          formData as UpdateProjectFormData
        );
      }
    } else {
      await handleCreateProject(formData as CreateProjectFormData);
    }
    handleCloseFormModal();
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      const projectId = projectToDelete._id || projectToDelete.id;
      if (projectId) {
        await handleDeleteProject(asProjectId(projectId as string));
      }
      setProjectToDelete(null);
    }
  };

  // Generic filter change handler for FilterBar integration
  const handleFilterChange = (filterId: string, value: string | null) => {
    switch (filterId) {
      case 'priority':
        setPriorityFilter(!value || value === 'All' ? 'All' : value);
        break;
      case 'status':
        setStatusFilter(!value || value === 'All' ? null : value);
        break;
      case 'lead':
        setLeadFilter(!value || value === 'All' ? null : value);
        break;
      case 'sortBy':
        setSortBy(value);
        break;
    }
  };

  return {
    // Data
    projects,
    filteredProjects,
    users,
    data,
    editingProject,
    projectToDelete,

    // State
    isLoading,
    error,
    refetch,
    isRefetching,
    isSubmitting,
    priorityFilter,
    statusFilter,
    leadFilter,
    sortBy,
    showFormModal,

    // State setters
    setPriorityFilter,
    setProjectToDelete,

    // Handlers
    onAddProject: handleAddProject,
    onEditProject: handleEditProject,
    onViewProject: handleViewProject,
    onDeleteProject: setProjectToDelete,
    onCloseFormModal: handleCloseFormModal,
    onFormSubmit: handleFormSubmit,
    onConfirmDelete: handleConfirmDelete,
    onFilterChange: handleFilterChange,
  };
}
