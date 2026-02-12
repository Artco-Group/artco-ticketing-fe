import { useMemo } from 'react';
import { ProjectPriority } from '@artco-group/artco-ticketing-sync';
import { type User } from '@/types';
import {
  DataTable,
  EmptyState,
  Icon,
  Avatar,
  AvatarGroup,
  Progress,
  BulkActionsBar,
  ConfirmationDialog,
  type Column,
  type RowAction,
} from '@/shared/components/ui';
import { CompanyLogo } from '@/shared/components/composite/CompanyLogo/CompanyLogo';
import {
  PROJECT_PRIORITY_ORDER,
  getProjectPriorityIcon,
  getProjectPriorityLabel,
} from '../utils/project-helpers';
import { type ProjectWithProgress } from '@/types';
import { useProjectTableState } from '../hooks/useProjectTableState';

interface ProjectTableProps {
  projects: ProjectWithProgress[];
  onViewProject: (project: ProjectWithProgress) => void;
  onEditProject: (project: ProjectWithProgress) => void;
  onDeleteProject: (project: ProjectWithProgress) => void;
}

function ProjectTable({
  projects,
  onViewProject,
  onEditProject,
  onDeleteProject,
}: ProjectTableProps) {
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
    bulkActions,
  } = useProjectTableState();

  const rowActions: RowAction<ProjectWithProgress>[] = useMemo(
    () => [
      {
        label: 'Edit',
        icon: <Icon name="edit" size="sm" />,
        onClick: (project) => onEditProject(project),
      },
      {
        label: 'Delete',
        icon: <Icon name="trash" size="sm" />,
        onClick: (project) => onDeleteProject(project),
        variant: 'destructive',
        separator: true,
      },
    ],
    [onEditProject, onDeleteProject]
  );

  const columns: Column<ProjectWithProgress>[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Title',
        width: 'w-full',
        sortable: true,
        render: (project) => {
          const client = project.client as User | undefined;
          return (
            <div className="flex items-center gap-3">
              <CompanyLogo
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
        label: 'Priority',
        type: 'badge',
        sortable: true,
        sortValue: (project) =>
          PROJECT_PRIORITY_ORDER[project.priority as string] ?? 0,
        getBadgeProps: (_value, project) => ({
          icon: getProjectPriorityIcon(project.priority as ProjectPriority),
          children: getProjectPriorityLabel(
            project.priority as ProjectPriority
          ),
        }),
      },
      {
        key: 'dueDate',
        label: 'Due Date',
        type: 'date',
        sortable: true,
        formatDate: (date) => {
          const d = date instanceof Date ? date : new Date(date);
          return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        },
      },
      {
        key: 'leads',
        label: 'Lead',
        align: 'center',
        render: (project) => {
          const leads = project.leads as User[] | undefined;
          if (!leads || leads.length === 0) {
            return <span className="text-muted-foreground">-</span>;
          }
          const firstLead = leads[0];
          return (
            <div className="flex justify-center">
              <Avatar
                size="sm"
                fallback={firstLead.name || firstLead.email || '?'}
                tooltip={firstLead.name || firstLead.email}
              />
            </div>
          );
        },
      },
      {
        key: 'developers',
        label: 'Developers',
        align: 'center',
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
        label: 'Status',
        align: 'center',
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
        label: 'Updated',
        type: 'date',
        sortable: true,
        formatDate: (date) => {
          const d = date instanceof Date ? date : new Date(date);
          const now = new Date();
          const diff = now.getTime() - d.getTime();
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));

          if (days === 0) return 'Today';
          if (days === 1) return 'Yesterday';
          if (days < 7) return `${days} days ago`;
          return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
        },
      },
    ],
    []
  );

  const emptyState = (
    <EmptyState
      variant="no-data"
      title="No projects found"
      message="No projects match your current filters."
      className="min-h-0 py-12"
    />
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={projects}
        onRowClick={onViewProject}
        emptyState={emptyState}
        selectable
        selectedRows={selectedRows}
        onSelect={setSelectedRows}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        actions={rowActions}
      />
      <BulkActionsBar
        selectedCount={selectedRows.length}
        actions={bulkActions}
        onClear={clearSelection}
      />
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete projects"
        description={`Are you sure you want to delete ${selectedRows.length} project${selectedRows.length > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        icon="trash"
      />
    </>
  );
}

export default ProjectTable;
