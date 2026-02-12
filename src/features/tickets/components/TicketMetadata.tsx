import type { ReactNode } from 'react';
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
import { useTicketInlineEdit } from '../hooks/useTicketInlineEdit';

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
  const inlineEdit = useTicketInlineEdit({
    ticket,
    users,
    isClient,
    isEngLead,
    isAdmin,
  });

  // Get eng lead from project's leads or fall back to first eng lead user
  const projectLeads = ticket.project?.leads || [];
  const engLead = projectLeads[0] || inlineEdit.engLeadUsers[0];

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

      <div className="space-y-3">
        <AssigneeEdit
          value={ticket.assignedTo}
          users={users}
          developerUsers={inlineEdit.developerUsers}
          canEdit={inlineEdit.canEditAssignee}
          isLoading={inlineEdit.isAssigneeUpdating}
          onChange={inlineEdit.onAssigneeChange}
        />

        <EngLeadEdit
          value={engLead}
          users={users}
          engLeadUsers={projectLeads as User[]}
          canEdit={inlineEdit.canEditEngLead}
          isLoading={false}
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

      <div className="space-y-3">
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

        <MetadataRow label="Created">
          <span className="text-sm">
            {ticket.createdAt
              ? new Date(ticket.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '-'}
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
      <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
        {label}
      </span>
      {children}
    </div>
  );
}

export default TicketMetadata;
