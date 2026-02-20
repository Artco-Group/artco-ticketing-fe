import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ProjectPriority,
  type CreateProjectFormData,
  type UpdateProjectFormData,
} from '@artco-group/artco-ticketing-sync';
import type { FilterPanelValues } from '@/shared/components/patterns';
import { type User, type ProjectWithProgress, asProjectId } from '@/types';
import { getErrorMessage } from '@/shared';
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '../api/projects-api';
import { useUsers } from '@/features/users/api';
import { useTranslatedToast, useAppTranslation } from '@/shared/hooks';
import { useToast } from '@/shared/components/ui';
import { PAGE_ROUTES } from '@/shared/constants';
import { useProjectFilters } from './useProjectFilters';
import { useProjectModal } from './useProjectModal';
import {
  filterProjectsByTab,
  PROJECT_TAB_CONFIG,
  PROJECT_SORT_CONFIG,
  PROJECT_GROUP_BY_CONFIG,
  getProjectPriorityOptions,
  type ProjectTab,
} from '../utils/project-helpers';
import { UserRole } from '@artco-group/artco-ticketing-sync';
import { Icon } from '@/shared/components/ui';
import type { FilterGroup, GroupByOption } from '@/shared/components/patterns';

export function useProjectList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { translate } = useAppTranslation('projects');
  const translatedToast = useTranslatedToast();
  const toast = useToast();

  const { data, isLoading, error, refetch, isRefetching } = useProjects();
  const { data: usersData } = useUsers();

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const activeTab = (searchParams.get('tab') || 'active') as ProjectTab;

  const projectTabs = PROJECT_TAB_CONFIG.map((tab) => ({
    ...tab,
    label: translate(tab.labelKey),
  }));

  const allProjects = data?.projects || [];
  const tabFilteredProjects = filterProjectsByTab(allProjects, activeTab);
  const users: User[] = usersData?.users || [];

  const filters = useProjectFilters<ProjectWithProgress>(tabFilteredProjects);
  const modal = useProjectModal<ProjectWithProgress>();

  // Filter/sort options
  const engLeads = users.filter((u) => u.role === UserRole.ENG_LEAD);

  const sortOptions = PROJECT_SORT_CONFIG.map((opt) => ({
    value: opt.value,
    label: translate(opt.labelKey),
  }));

  const priorityOptions = getProjectPriorityOptions(translate);

  const filterBarFilters = [
    {
      id: 'priority',
      label: translate('filters.priority'),
      icon: 'priority' as const,
      options: priorityOptions,
      value: filters.priorityFilter === 'All' ? null : filters.priorityFilter,
    },
  ];

  const filterGroups: FilterGroup[] = [
    {
      key: 'lead',
      label: translate('filters.lead'),
      icon: React.createElement(Icon, { name: 'user', size: 'sm' }),
      options: engLeads.map((lead) => ({
        value: lead.id as string,
        label: lead.name || lead.email || 'Unknown',
      })),
      searchable: true,
    },
  ];

  const filterPanelValue: FilterPanelValues = filters.leadFilter
    ? { lead: [filters.leadFilter] }
    : {};

  const groupByOptions: GroupByOption[] = PROJECT_GROUP_BY_CONFIG.map(
    ({ labelKey, ...rest }) => ({
      ...rest,
      label: translate(labelKey),
    })
  );

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const withErrorToast = async <T>(
    fn: () => Promise<T>,
    successKey: string
  ): Promise<T> => {
    try {
      const result = await fn();
      translatedToast.success(successKey, { item: translate('singular') });
      return result;
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleCreate = (formData: CreateProjectFormData) =>
    withErrorToast(
      () => createMutation.mutateAsync(formData),
      'toast.success.created'
    );

  const handleUpdate = (
    project: ProjectWithProgress,
    formData: UpdateProjectFormData
  ) => {
    if (!project.slug) return;
    return withErrorToast(
      () =>
        updateMutation.mutateAsync({
          slug: asProjectId(project.slug),
          data: formData,
        }),
      'toast.success.updated'
    );
  };

  const handleDelete = (project: ProjectWithProgress) => {
    if (!project.slug) return;
    return withErrorToast(
      () => deleteMutation.mutateAsync(asProjectId(project.slug)),
      'toast.success.deleted'
    );
  };

  const handleView = (project: ProjectWithProgress) => {
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

  const handleTabChange = (tabId: string) => {
    const params: Record<string, string> = {};
    if (tabId !== 'active') {
      params.tab = tabId;
    }
    setSearchParams(params);
  };

  const handleFilterPanelChange = (value: FilterPanelValues) => {
    const leadValues = value.lead;
    if (leadValues && leadValues.length > 0) {
      filters.onFilterChange('lead', leadValues[0]);
    } else {
      filters.onFilterChange('lead', null);
    }
  };

  const handleFilterBarChange = (filterId: string, value: string | null) => {
    filters.onFilterChange(filterId, value ?? 'All');
  };

  const handleSortChange = (value: string | null) => {
    filters.onFilterChange('sortBy', value);
  };

  const getEditDefaultValues = (): UpdateProjectFormData | undefined => {
    if (!modal.editingProject) return undefined;

    return {
      name: modal.editingProject.name || '',
      description: modal.editingProject.description || '',
      client: (modal.editingProject.client?.id || '') as string,
      leads:
        modal.editingProject.leads
          ?.map((u) => u.id as string)
          .filter(Boolean) || [],
      members:
        modal.editingProject.members
          ?.map((u) => u.id as string)
          .filter(Boolean) || [],
      startDate: modal.editingProject.startDate || '',
      dueDate: modal.editingProject.dueDate || '',
      priority:
        (modal.editingProject.priority as ProjectPriority) ||
        ProjectPriority.MEDIUM,
    };
  };

  return {
    projects: allProjects,
    filteredProjects: filters.filteredProjects,
    users,
    data,

    isLoading,
    error,
    refetch,
    isRefetching,
    isSubmitting,

    // Tab state
    activeTab,
    projectTabs,
    onTabChange: handleTabChange,

    // Filter options
    sortOptions,
    filterBarFilters,
    filterGroups,
    filterPanelValue,
    groupByOptions,

    // Filter state
    sortBy: filters.sortBy,
    onFilterPanelChange: handleFilterPanelChange,
    onFilterBarChange: handleFilterBarChange,
    onSortChange: handleSortChange,

    showFormModal: modal.showFormModal,
    editingProject: modal.editingProject,
    editDefaultValues: getEditDefaultValues(),
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
