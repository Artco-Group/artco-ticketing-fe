import type { ReactNode } from 'react';
import { differenceInCalendarDays } from 'date-fns';
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
import { InlineDateEdit } from '@/shared/components/ui/InlineDateEdit';
import { ResolutionDialog } from './ResolutionDialog';
import { useTicketInlineEdit, useWorkflowStatusOptions } from '../hooks';
import { useAppTranslation } from '@/shared/hooks';

interface TicketMetadataProps {
  ticket: Ticket;
  users: User[];
  projects: Project[];
  isClient: boolean;
  isEngLead: boolean;
  isAdmin?: boolean;
  isDeveloper?: boolean;
}

function calculateDaysToResolution(
  createdAt: string | Date,
  solutionDate: string
): number {
  const created =
    typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const solution = new Date(solutionDate);
  return differenceInCalendarDays(solution, created);
}

function TicketMetadata({
  ticket,
  users,
  projects,
  isClient,
  isEngLead,
  isAdmin = false,
  isDeveloper = false,
}: TicketMetadataProps) {
  const { translate, language } = useAppTranslation('tickets');
  const inlineEdit = useTicketInlineEdit({
    ticket,
    users,
    isClient,
    isEngLead,
    isAdmin,
    isDeveloper,
  });

  const { statusOptions, getStatusIcon, getStatusLabel, hasWorkflow } =
    useWorkflowStatusOptions(ticket.project?.statusConfig);

  const projectLeads = ticket.project?.leads || [];

  const projectOptions = projects.map((p) => ({
    id: p.id || '',
    name: p.name,
    clientProfilePic: p.client?.profilePic,
  }));

  const renderSolutionDate = (
    val: string | Date | null | undefined,
    color: string,
    translationKey: string
  ) => {
    const dateStr = val
      ? typeof val === 'string'
        ? val
        : val.toISOString()
      : null;
    const days =
      dateStr && ticket.createdAt
        ? calculateDaysToResolution(ticket.createdAt, dateStr)
        : null;

    return (
      <span className="flex items-center gap-2 text-sm whitespace-nowrap">
        {formatDateDisplay(val, language, 'long')}
        {days !== null && (
          <span className={`text-xs font-medium ${color}`}>
            · {translate(translationKey, { days })}
          </span>
        )}
      </span>
    );
  };

  return (
    <>
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

      {!isClient && (
        <div className="border-border/40 mt-4 grid grid-cols-2 gap-x-50 border-t pt-4">
          <InlineDateEdit
            label={translate('form.tempSolutionDate')}
            value={ticket.tempSolutionDate}
            canEdit={inlineEdit.canEditSolutionDates}
            isLoading={inlineEdit.isDatesUpdating}
            onChange={inlineEdit.onTempSolutionDateChange}
            locale={language}
            labelClassName="w-36"
            renderValue={(val) =>
              renderSolutionDate(
                val,
                'text-blue-600',
                'details.daysToTempSolution'
              )
            }
          />
          <InlineDateEdit
            label={translate('form.finalSolutionDate')}
            value={ticket.finalSolutionDate}
            canEdit={inlineEdit.canEditSolutionDates}
            isLoading={inlineEdit.isDatesUpdating}
            onChange={inlineEdit.onFinalSolutionDateChange}
            locale={language}
            labelClassName="w-36"
            renderValue={(val) =>
              renderSolutionDate(
                val,
                'text-green-600',
                'details.daysToFinalSolution'
              )
            }
          />
        </div>
      )}

      <ResolutionDialog
        isOpen={inlineEdit.resolutionDialogOpen}
        onClose={inlineEdit.onResolutionClose}
        onSubmit={inlineEdit.onResolutionSubmit}
        onSkip={inlineEdit.onResolutionSkip}
        isLoading={inlineEdit.isStatusUpdating}
      />
    </>
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
