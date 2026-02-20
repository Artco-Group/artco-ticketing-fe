import type { ReactNode } from 'react';
import { formatDateDisplay } from '@artco-group/artco-ticketing-sync';
import { type Ticket, type User, type Project } from '@/types';
import {
  StatusEdit,
  PriorityEdit,
  CategoryEdit,
  AssigneeEdit,
  StartDateEdit,
  DueDateEdit,
  ProjectEdit,
  EngLeadEdit,
} from './TicketInlineEdit';
import { useTicketInlineEdit, useWorkflowStatusOptions } from '../hooks';
import { useAppTranslation } from '@/shared/hooks';

interface TicketMetadataProps {
  ticket: Ticket;
  users: User[];
  projects: Project[];
  isClient: boolean;
  isEngLead: boolean;
  isAdmin?: boolean;
}

function TicketMetadata({
  ticket,
  users,
  projects,
  isClient,
  isEngLead,
  isAdmin = false,
}: TicketMetadataProps) {
  const { translate, language } = useAppTranslation('tickets');
  const inlineEdit = useTicketInlineEdit({
    ticket,
    users,
    isClient,
    isEngLead,
    isAdmin,
  });

  const { statusOptions, getStatusIcon, getStatusLabel, hasWorkflow } =
    useWorkflowStatusOptions(ticket.project?.statusConfig);

  const projectLeads = ticket.project?.leads || [];

  const projectOptions = projects.map((p) => ({
    id: p.id || '',
    name: p.name,
    clientProfilePic: p.client?.profilePic,
  }));

  return (
    <div className="flex flex-wrap gap-x-25 gap-y-4">
      <div className="space-y-3">
        <StatusEdit
          value={ticket.status}
          canEdit={inlineEdit.canEditStatus}
          isLoading={inlineEdit.isStatusUpdating}
          onChange={inlineEdit.onStatusChange}
          workflowOptions={hasWorkflow ? statusOptions : undefined}
          getWorkflowStatusIcon={hasWorkflow ? getStatusIcon : undefined}
          getWorkflowStatusLabel={hasWorkflow ? getStatusLabel : undefined}
        />
        <PriorityEdit
          value={ticket.priority}
          canEdit={inlineEdit.canEditPriority}
          isLoading={inlineEdit.isPriorityUpdating}
          onChange={inlineEdit.onPriorityChange}
        />
        <CategoryEdit
          value={ticket.category}
          canEdit={inlineEdit.canEditCategory}
          isLoading={inlineEdit.isCategoryUpdating}
          onChange={inlineEdit.onCategoryChange}
        />
      </div>

      <div className="border-border/40 space-y-3 border-l pl-8">
        <AssigneeEdit
          value={ticket.assignedTo}
          users={users}
          developerUsers={inlineEdit.developerUsers}
          canEdit={inlineEdit.canEditAssignee}
          isLoading={inlineEdit.isAssigneeUpdating}
          onChange={inlineEdit.onAssigneeChange}
        />

        <EngLeadEdit
          value={ticket.engLead}
          users={users}
          engLeadUsers={projectLeads as typeof users}
          canEdit={inlineEdit.canEditEngLead && projectLeads.length > 0}
          isLoading={inlineEdit.isEngLeadUpdating}
          onChange={inlineEdit.onEngLeadChange}
        />

        <ProjectEdit
          value={
            ticket.project
              ? {
                  id: ticket.project.id || '',
                  name: ticket.project.name,
                  clientProfilePic: ticket.project.client?.profilePic,
                }
              : null
          }
          projects={projectOptions}
          canEdit={inlineEdit.canEditProject}
          isLoading={inlineEdit.isProjectUpdating}
          onChange={inlineEdit.onProjectChange}
        />
      </div>

      <div className="border-border/40 space-y-3 border-l pl-8">
        <StartDateEdit
          value={ticket.startDate}
          canEdit={inlineEdit.canEditDates}
          isLoading={inlineEdit.isDatesUpdating}
          onChange={inlineEdit.onStartDateChange}
        />

        <DueDateEdit
          value={ticket.dueDate}
          canEdit={inlineEdit.canEditDates}
          isLoading={inlineEdit.isDatesUpdating}
          onChange={inlineEdit.onDueDateChange}
        />

        <MetadataRow label={translate('details.created')}>
          <span className="text-sm">
            {formatDateDisplay(ticket.createdAt, language, 'long')}
          </span>
        </MetadataRow>
      </div>
    </div>
  );
}

function MetadataRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-8 items-center justify-start">
      <span className="text-muted-foreground mr-3 w-28 shrink-0 text-sm whitespace-nowrap">
        {label}
      </span>
      {children}
    </div>
  );
}

export default TicketMetadata;
