import { useMemo } from 'react';
import {
  ProjectPriority,
  ProjectPrioritySortOrder,
  formatDateDisplay,
} from '@artco-group/artco-ticketing-sync';
import { type User } from '@/types';
import {
  DataTable,
  EmptyState,
  Icon,
  AvatarGroup,
  Progress,
  BulkActionsBar,
  ConfirmationDialog,
  type Column,
  type RowAction,
} from '@/shared/components/ui';
import { StatusHeader } from '@/shared/components/patterns/StatusHeader';
import { CompanyLogo } from '@/shared/components/composite/CompanyLogo/CompanyLogo';
import {
  getProjectPriorityIcon,
  getProjectPriorityLabel,
  type ProjectTab,
} from '../utils/project-helpers';
import { type ProjectWithProgress } from '@/types';
import { useProjectTableState } from '../hooks/useProjectTableState';
import { useGroupedData } from '@/shared/hooks/useGroupedData';
import { useAppTranslation } from '@/shared/hooks';

interface ProjectTableProps {
  projects: ProjectWithProgress[];
  activeTab?: ProjectTab;
  groupByValue?: string | null;
  onViewProject: (project: ProjectWithProgress) => void;
  onEditProject: (project: ProjectWithProgress) => void;
  onDeleteProject: (project: ProjectWithProgress) => void;
}

function ProjectTable({
  projects,
  activeTab = 'active',
  groupByValue,
  onViewProject,
  onEditProject,
  onDeleteProject,
}: ProjectTableProps) {
  const { translate, language } = useAppTranslation('projects');
  const {
    selectedRows,
    setSelectedRows,
    clearSelection,
    sortColumn,
    sortDirection,
    handleSort,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleBulkDelete,
    isDeleting,
    showArchiveConfirm,
    setShowArchiveConfirm,
    handleBulkArchive,
    handleRowArchive,
    isArchiving,
    isArchiveAction,
    bulkActions,
    groupConfigs,
  } = useProjectTableState({ activeTab });

  const groupedProjects = useGroupedData(
    projects,
    groupByValue ?? null,
    groupConfigs
  );

  const rowActions: RowAction<ProjectWithProgress>[] = useMemo(
    () => [
      {
        label: translate('table.rowActions.edit'),
        icon: <Icon name="edit" size="sm" />,
        onClick: (project) => onEditProject(project),
        hidden: (project: ProjectWithProgress) => !!project.isArchived,
      },
      {
        label: translate('table.rowActions.archive'),
        icon: <Icon name="inbox" size="sm" />,
        onClick: (project) => handleRowArchive(project, true),
        hidden: (project: ProjectWithProgress) => !!project.isArchived,
      },
      {
        label: translate('table.rowActions.unarchive'),
        icon: <Icon name="upload" size="sm" />,
        onClick: (project) => handleRowArchive(project, false),
        hidden: (project: ProjectWithProgress) => !project.isArchived,
      },
      {
        label: translate('table.rowActions.delete'),
        icon: <Icon name="trash" size="sm" />,
        onClick: (project) => onDeleteProject(project),
        variant: 'destructive',
        separator: true,
      },
    ],
    [onEditProject, onDeleteProject, handleRowArchive, translate]
  );

  const columns: Column<ProjectWithProgress>[] = useMemo(
    () => [
      {
        key: 'name',
        label: translate('table.columns.title'),
        width: 'w-full',
        sortable: true,
        render: (project) => {
          const client = project.client as User | undefined;
          return (
            <div className="flex items-center gap-3">
              <CompanyLogo
                src={client?.profilePic}
                alt={client?.name || project.name}
                fallback={client?.name || project.name}
                size="xs"
                variant="rounded"
                tooltip={client?.name}
              />
              <div>
                <span className="font-medium">{project.name}</span>
                {project.description && (
                  <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          );
        },
      },
      {
        key: 'priority',
        label: translate('table.columns.priority'),
        type: 'badge',
        width: 'w-[100px]',
        sortable: true,
        sortValue: (project) =>
          ProjectPrioritySortOrder[project.priority as ProjectPriority] ?? 0,
        getBadgeProps: (_value, project) => ({
          icon: getProjectPriorityIcon(project.priority as ProjectPriority),
          children: getProjectPriorityLabel(
            project.priority as ProjectPriority
          ),
        }),
      },
      {
        key: 'dueDate',
        label: translate('table.columns.dueDate'),
        type: 'date',
        width: 'w-[120px]',
        sortable: true,
        formatDate: (date) => formatDateDisplay(date, language, 'numeric'),
      },
      {
        key: 'leads',
        label: translate('table.columns.lead'),
        align: 'center',
        width: 'w-[80px]',
        render: (project) => {
          const leads = project.leads as User[] | undefined;
          if (!leads || leads.length === 0) {
            return <span className="text-muted-foreground">-</span>;
          }
          return (
            <div className="flex justify-center">
              <AvatarGroup
                size="sm"
                max={3}
                avatars={leads.map((lead) => ({
                  src: lead.profilePic,
                  fallback: lead.name || lead.email || '?',
                  tooltip: lead.name || lead.email,
                }))}
              />
            </div>
          );
        },
      },
      {
        key: 'developers',
        label: translate('table.columns.developers'),
        align: 'center',
        width: 'w-[100px]',
        render: (project) => {
          const members = project.members as User[] | undefined;
          if (!members || members.length === 0) {
            return <span className="text-muted-foreground">-</span>;
          }
          return (
            <div className="flex justify-center">
              <AvatarGroup
                size="sm"
                max={3}
                avatars={members.map((member) => ({
                  src: member.profilePic,
                  fallback: member.name || member.email || '?',
                  tooltip: member.name || member.email,
                }))}
              />
            </div>
          );
        },
      },
      {
        key: 'progress',
        label: translate('table.columns.status'),
        align: 'center',
        width: 'w-[80px]',
        sortable: true,
        sortValue: (project) => project.progress?.percentage ?? 0,
        render: (project) => (
          <div className="flex justify-center">
            <Progress value={project.progress?.percentage ?? 0} size="xs" />
          </div>
        ),
      },
      {
        key: 'updatedAt',
        label: translate('table.columns.updated'),
        type: 'date',
        width: 'w-[100px]',
        sortable: true,
        formatDate: (date) => {
          const d = date instanceof Date ? date : new Date(date);
          const now = new Date();
          const diff = now.getTime() - d.getTime();
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));

          if (days === 0) return translate('time.today');
          if (days === 1) return translate('time.yesterday');
          if (days < 7) return translate('time.daysAgo', { count: days });
          return formatDateDisplay(date, language, 'short');
        },
      },
    ],
    [translate, language]
  );

  const projectsWithStyling = projects.map((project) => ({
    ...project,
    className: project.isArchived ? 'opacity-50' : undefined,
  }));

  const emptyState = (
    <EmptyState
      variant="no-data"
      title={translate('list.empty')}
      message={translate('list.emptyFiltered')}
      className="min-h-0 py-12"
    />
  );

  const tableProps = {
    columns,
    onRowClick: onViewProject,
    emptyState,
    selectable: true,
    selectedRows,
    onSelect: setSelectedRows,
    sortColumn,
    sortDirection,
    onSort: handleSort,
    actions: rowActions,
    getRowId: (project: ProjectWithProgress) => project.slug ?? '',
  };

  const renderDialogs = () => (
    <>
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title={translate('table.deleteTitle')}
        description={translate('table.deleteConfirm', {
          count: selectedRows.length,
        })}
        confirmLabel={translate('table.deleteButton')}
        variant="destructive"
        isLoading={isDeleting}
        icon="trash"
      />
      <ConfirmationDialog
        isOpen={showArchiveConfirm}
        onClose={() => setShowArchiveConfirm(false)}
        onConfirm={handleBulkArchive}
        title={translate(
          isArchiveAction ? 'table.archiveTitle' : 'table.unarchiveTitle'
        )}
        description={translate(
          isArchiveAction ? 'table.archiveConfirm' : 'table.unarchiveConfirm',
          { count: selectedRows.length }
        )}
        confirmLabel={translate(
          isArchiveAction ? 'table.archiveButton' : 'table.unarchiveButton'
        )}
        isLoading={isArchiving}
        icon="inbox"
      />
    </>
  );

  if (groupByValue && groupedProjects.length > 0) {
    return (
      <>
        {groupedProjects.map((group) => (
          <div key={group.key}>
            <StatusHeader icon={group.icon} label={group.label} />
            <DataTable {...tableProps} data={group.items} />
          </div>
        ))}
        <BulkActionsBar
          selectedCount={selectedRows.length}
          actions={bulkActions}
          onClear={clearSelection}
        />
        {renderDialogs()}
      </>
    );
  }

  return (
    <>
      <DataTable {...tableProps} data={projectsWithStyling} />
      <BulkActionsBar
        selectedCount={selectedRows.length}
        actions={bulkActions}
        onClear={clearSelection}
      />
      {renderDialogs()}
    </>
  );
}

export default ProjectTable;
