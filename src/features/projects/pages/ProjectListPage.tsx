import { useState } from 'react';
import { ProjectTable, ProjectForm } from '../components';
import {
  RetryableError,
  EmptyState,
  SideDialog,
  ConfirmationDialog,
  Icon,
  Button,
} from '@/shared/components/ui';
import { ListPageLayout } from '@/shared/components/layout/ListPageLayout';
import { StatusHeader } from '@/shared/components/patterns/StatusHeader';
import { useProjectList } from '../hooks';
import { useAuth } from '@/features/auth/context';
import { useRoleFlags } from '@/shared/hooks/useRoleFlags';
import { useAppTranslation } from '@/shared/hooks';

export default function ProjectListPage() {
  const { translate } = useAppTranslation('projects');
  const [groupByValue, setGroupByValue] = useState<string | null>(null);
  const { user } = useAuth();
  const { isEngLead } = useRoleFlags(user?.role);

  const {
    projects,
    filteredProjects,
    users,
    data,
    editingProject,
    editDefaultValues,
    projectToDelete,
    isLoading,
    error,
    refetch,
    isSubmitting,
    activeTab,
    projectTabs,
    onTabChange,
    sortBy,
    showFormModal,
    onCloseDeleteConfirm,
    onAddProject,
    onEditProject,
    onViewProject,
    onDeleteProject,
    onCloseFormModal,
    onFormSubmit,
    onConfirmDelete,
    onFilterPanelChange,
    onFilterBarChange,
    onSortChange,
    sortOptions,
    filterBarFilters,
    filterGroups,
    filterPanelValue,
    groupByOptions,
  } = useProjectList();

  const currentTab = projectTabs.find((tab) => tab.id === activeTab);

  return (
    <ListPageLayout
      title={translate('title')}
      count={filteredProjects.length}
      tabs={projectTabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      tabActions={
        isEngLead ? (
          <Button leftIcon="plus" onClick={onAddProject}>
            {translate('create')}
          </Button>
        ) : null
      }
      filters={filterBarFilters}
      onFilterChange={onFilterBarChange}
      sortOptions={sortOptions}
      sortValue={sortBy}
      onSortChange={onSortChange}
      groupByOptions={groupByOptions}
      groupByValue={groupByValue}
      onGroupByChange={setGroupByValue}
      filterGroups={filterGroups}
      filterPanelValue={filterPanelValue}
      onFilterPanelChange={onFilterPanelChange}
      filterPanelSingleSelect
      showFilter
      loading={isLoading}
      loadingMessage={translate('list.loading')}
    >
      {error ? (
        <RetryableError
          title={translate('list.failedToLoad')}
          message={translate('list.failedToLoadMessage')}
          onRetry={refetch}
        />
      ) : !data || filteredProjects.length === 0 ? (
        <EmptyState
          variant="no-data"
          title={translate('list.empty')}
          message={
            projects.length === 0
              ? translate('list.emptyDescription')
              : translate('list.emptyFiltered')
          }
        />
      ) : (
        <>
          {!groupByValue && currentTab && (
            <StatusHeader
              icon={
                currentTab.icon ? (
                  <Icon name={currentTab.icon} size="sm" />
                ) : null
              }
              label={currentTab.label}
            />
          )}
          <ProjectTable
            projects={filteredProjects}
            activeTab={activeTab}
            groupByValue={groupByValue}
            onViewProject={onViewProject}
            onEditProject={onEditProject}
            onDeleteProject={onDeleteProject}
          />
        </>
      )}

      <SideDialog
        isOpen={showFormModal}
        onClose={onCloseFormModal}
        title={
          editingProject
            ? translate('dialog.editTitle')
            : translate('dialog.createTitle')
        }
        description={
          editingProject
            ? translate('dialog.editDescription')
            : translate('dialog.createDescription')
        }
        width="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCloseFormModal}
              disabled={isSubmitting}
            >
              {translate('dialog.cancel')}
            </Button>
            <Button type="submit" form="project-form" disabled={isSubmitting}>
              {isSubmitting
                ? translate('dialog.saving')
                : editingProject
                  ? translate('dialog.save')
                  : translate('create')}
            </Button>
          </div>
        }
      >
        <ProjectForm
          key={editingProject?.id || 'new'}
          formId="project-form"
          onSubmit={onFormSubmit}
          defaultValues={editDefaultValues}
          isEditing={!!editingProject}
          users={users}
        />
      </SideDialog>

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        isOpen={!!projectToDelete}
        onClose={onCloseDeleteConfirm}
        onConfirm={onConfirmDelete}
        title={translate('dialog.deleteTitle')}
        description={translate('dialog.deleteConfirm', {
          name: projectToDelete?.name || '',
        })}
        confirmLabel={translate('dialog.deleteButton')}
        variant="destructive"
        isLoading={isSubmitting}
        icon="trash"
      />
    </ListPageLayout>
  );
}
