import { useMemo } from 'react';
import {
  ProjectPriority,
  ProjectPriorityDisplay,
  type CreateProjectFormData,
} from '@artco-group/artco-ticketing-sync';
import { type User } from '@/types';
import { ProjectTable, ProjectForm } from '../components';
import {
  RetryableError,
  EmptyState,
  SideDialog,
  ConfirmModal,
  Icon,
} from '@/shared/components/ui';
import { ListPageLayout } from '@/shared/components/layout/ListPageLayout';
import type {
  FilterGroup,
  FilterPanelValues,
} from '@/shared/components/patterns';
import { useProjectList } from '../hooks';
import { useAuth } from '@/features/auth/context';
import { useRoleFlags } from '@/shared/hooks/useRoleFlags';

const PRIORITY_OPTIONS = Object.values(ProjectPriority).map(
  (priority) => ProjectPriorityDisplay[priority]
);

export default function ProjectListPage() {
  const { user } = useAuth();
  const { isEngLead } = useRoleFlags(user?.role);

  const {
    projects,
    filteredProjects,
    users,
    data,
    editingProject,
    projectToDelete,
    isLoading,
    error,
    refetch,
    isSubmitting,
    priorityFilter,
    leadFilter,
    sortBy,
    showFormModal,
    setProjectToDelete,
    onAddProject,
    onEditProject,
    onViewProject,
    onDeleteProject,
    onCloseFormModal,
    onFormSubmit,
    onConfirmDelete,
    onFilterChange,
  } = useProjectList();

  // Get eng leads for filter
  const engLeads = useMemo(
    () => users.filter((u) => u.role === 'eng_lead' || u.role === 'admin'),
    [users]
  );

  const sortOptions = useMemo(
    () => ['Name', 'Priority', 'Due Date', 'Progress', 'Updated'],
    []
  );

  const filterBarFilters = useMemo(
    () => [
      {
        id: 'priority',
        label: 'Priority',
        icon: 'plus' as const,
        options: PRIORITY_OPTIONS,
        value: priorityFilter === 'All' ? null : priorityFilter,
      },
    ],
    [priorityFilter]
  );

  const filterGroups: FilterGroup[] = useMemo(
    () => [
      {
        key: 'lead',
        label: 'Lead',
        icon: <Icon name="user" size="sm" />,
        options: engLeads.map((lead) => ({
          value: (lead._id || lead.id) as string,
          label: lead.name || lead.email || 'Unknown',
        })),
        searchable: true,
      },
    ],
    [engLeads]
  );

  const filterPanelValue = useMemo<FilterPanelValues>(() => {
    const value: FilterPanelValues = {};
    if (leadFilter) {
      value.lead = [leadFilter];
    }
    return value;
  }, [leadFilter]);

  const handleFilterPanelChange = (value: FilterPanelValues) => {
    const leadValues = value.lead;
    if (leadValues && leadValues.length > 0) {
      onFilterChange('lead', leadValues[0]);
    } else {
      onFilterChange('lead', null);
    }
  };

  const handleFilterBarChange = (filterId: string, value: string | null) => {
    onFilterChange(filterId, value ?? 'All');
  };

  const handleSortChange = (value: string | null) => {
    onFilterChange('sortBy', value);
  };

  const getEditDefaultValues = ():
    | Partial<CreateProjectFormData>
    | undefined => {
    if (!editingProject) return undefined;

    const getIdFromUser = (user: User | string | undefined): string => {
      if (!user) return '';
      if (typeof user === 'string') return user;
      return (user._id || user.id || '') as string;
    };

    const getIdsFromUsers = (
      users: (User | string)[] | undefined
    ): string[] => {
      if (!users) return [];
      return users.map((u) => getIdFromUser(u)).filter(Boolean);
    };

    return {
      name: editingProject.name || '',
      description: editingProject.description || '',
      client: getIdFromUser(editingProject.client as User | string | undefined),
      leads: getIdsFromUsers(editingProject.leads as (User | string)[]),
      members: getIdsFromUsers(editingProject.members as (User | string)[]),
      startDate: editingProject.startDate || '',
      dueDate: editingProject.dueDate || '',
      priority:
        (editingProject.priority as ProjectPriority) || ProjectPriority.MEDIUM,
    };
  };

  return (
    <ListPageLayout
      title="Projects"
      count={filteredProjects.length}
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
      showAddButton={isEngLead}
      onAddClick={onAddProject}
      addButtonLabel="Create Project"
      loading={isLoading}
      loadingMessage="Loading projects..."
    >
      {error ? (
        <RetryableError
          title="Failed to load projects"
          message="Failed to load projects. Please try again later."
          onRetry={refetch}
        />
      ) : !data || filteredProjects.length === 0 ? (
        <EmptyState
          variant="no-data"
          title="No projects found"
          message={
            projects.length === 0
              ? 'Create your first project to get started.'
              : 'No projects match your current filters.'
          }
        />
      ) : (
        <ProjectTable
          projects={filteredProjects}
          onViewProject={onViewProject}
          onEditProject={onEditProject}
          onDeleteProject={onDeleteProject}
        />
      )}

      {/* Create/Edit Project Side Dialog */}
      <SideDialog
        isOpen={showFormModal}
        onClose={onCloseFormModal}
        title={editingProject ? 'Edit Project' : 'Create Project'}
        description={
          editingProject
            ? 'Update the project details below.'
            : 'Fill in the details to create a new project.'
        }
        width="lg"
      >
        <ProjectForm
          key={editingProject?._id?.toString() || editingProject?.id || 'new'}
          onSubmit={onFormSubmit}
          onCancel={onCloseFormModal}
          defaultValues={getEditDefaultValues()}
          isEditing={!!editingProject}
          isSubmitting={isSubmitting}
          users={users}
        />
      </SideDialog>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={onConfirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </ListPageLayout>
  );
}
