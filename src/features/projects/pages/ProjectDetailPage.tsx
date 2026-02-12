import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ProjectPriority, UserRole } from '@artco-group/artco-ticketing-sync';
import { type User, type Ticket, asProjectId, asTicketId } from '@/types';
import { useProject, useProjectTickets } from '../api/projects-api';
import { useUsers } from '@/features/users/api';
import {
  Button,
  EmptyState,
  AvatarGroup,
  Modal,
  RetryableError,
  SpinnerContainer,
  ProgressCircle,
  Badge,
} from '@/shared/components/ui';
import { MemberPicker } from '@/shared/components/composite/MemberPicker';
import { CompanyLogo } from '@/shared/components/composite/CompanyLogo/CompanyLogo';
import { PageHeader } from '@/shared/components/patterns/PageHeader/PageHeader';
import { PAGE_ROUTES } from '@/shared/constants';
import {
  getProjectPriorityIcon,
  getProjectPriorityLabel,
} from '../utils/project-helpers';
import { useAuth } from '@/features/auth/context';
import { useRoleFlags } from '@/shared/hooks/useRoleFlags';
import { TicketDialog, TicketTable } from '@/features/tickets/components';
import { useProjectInlineEdit, useInviteMembers } from '../hooks';
import { InlineDateEdit } from '@/shared/components/ui/InlineDateEdit';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDeveloper, isEngLead } = useRoleFlags(user?.role);

  // slug is the human-readable project identifier (e.g., "artco-website")
  const projectSlug = slug ? asProjectId(slug) : undefined;

  const { data, isLoading, error, refetch } = useProject(projectSlug);
  const {
    data: ticketsData,
    isLoading: ticketsLoading,
    refetch: refetchTickets,
  } = useProjectTickets(projectSlug);
  const { data: usersData } = useUsers();

  const projectInlineEdit = useProjectInlineEdit({
    projectId: projectSlug,
    canEdit: isEngLead,
  });

  const [showTicketDialog, setShowTicketDialog] = useState(false);

  const canCreateTicket = !isDeveloper;

  const project = data?.project;
  const tickets = ticketsData?.tickets || [];
  const users = useMemo(() => usersData?.users || [], [usersData?.users]);

  const inviteMembers = useInviteMembers({
    projectId: projectSlug,
    currentMembers: project?.members as User[] | undefined,
    allUsers: users,
  });

  if (isLoading) {
    return <SpinnerContainer message="Loading project..." />;
  }

  if (error || !project) {
    return (
      <RetryableError
        title="Failed to load project"
        message="Could not load the project details. Please try again."
        onRetry={refetch}
      />
    );
  }

  const client = project.client as User;
  const leads = project.leads as User[];
  const members = project.members as User[] | undefined;

  return (
    <>
      <div className="bg-card">
        <PageHeader
          breadcrumbs={[
            { label: 'Projects', href: PAGE_ROUTES.PROJECTS.LIST },
            { label: project.name },
          ]}
        />

        <div className="grid grid-cols-1 border-b lg:grid-cols-[1fr_18rem]">
          <div className="p-6 lg:border-r">
            <div className="flex items-start gap-4">
              <CompanyLogo
                alt={client?.name || project.name}
                fallback={client?.name || project.name}
                tooltip={client?.name}
                size="lg"
                variant="rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <Badge
                    icon={getProjectPriorityIcon(
                      project.priority as ProjectPriority
                    )}
                  >
                    {getProjectPriorityLabel(
                      project.priority as ProjectPriority
                    )}
                  </Badge>
                </div>
                {project.description && (
                  <p className="text-muted-foreground mt-2">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center border-t p-4 lg:border-t-0">
            <h3 className="text-muted-foreground mb-3 text-xs font-medium uppercase">
              Progress
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {project.progress?.completedTickets ?? 0}
                </p>
                <p className="text-muted-foreground text-sm">
                  of {project.progress?.totalTickets ?? 0} tickets
                </p>
              </div>
              <ProgressCircle
                value={project.progress?.percentage ?? 0}
                size="md"
              />
            </div>
          </div>

          <div className="border-t p-6 lg:border-r">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-muted-foreground text-md font-medium uppercase">
                Team
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={inviteMembers.openModal}
                leftIcon="plus"
              >
                Invite Members
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground mb-2 text-xs">
                  Engineering Leads
                </p>
                {leads && leads.length > 0 ? (
                  <AvatarGroup
                    size="md"
                    max={4}
                    avatars={leads.map((lead) => ({
                      fallback: lead.name || lead.email || '?',
                      tooltip: lead.name || lead.email,
                    }))}
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No leads assigned
                  </p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground mb-2 text-xs">Developers</p>
                {members && members.length > 0 ? (
                  <AvatarGroup
                    size="md"
                    max={6}
                    avatars={members.map((member) => ({
                      fallback: member.name || member.email || '?',
                      tooltip: member.name || member.email,
                    }))}
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No members yet
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center border-t p-4">
            <h3 className="text-muted-foreground mb-3 text-xs font-medium uppercase">
              Timeline
            </h3>
            <div className="space-y-2 text-sm">
              <InlineDateEdit
                label="Start Date"
                value={project.startDate}
                canEdit={projectInlineEdit.canEditDates}
                isLoading={projectInlineEdit.isDatesUpdating}
                onChange={projectInlineEdit.onStartDateChange}
              />
              <InlineDateEdit
                label="Due Date"
                value={project.dueDate}
                canEdit={projectInlineEdit.canEditDates}
                isLoading={projectInlineEdit.isDatesUpdating}
                onChange={projectInlineEdit.onDueDateChange}
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Tickets</h3>
            {canCreateTicket && (
              <Button
                size="sm"
                onClick={() => setShowTicketDialog(true)}
                leftIcon="plus"
                className="bg-greyscale-900 hover:bg-greyscale-800 text-white"
              >
                Create Ticket
              </Button>
            )}
          </div>
          {ticketsLoading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Loading tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <EmptyState
              variant="no-data"
              title="No tickets yet"
              message="Create tickets to track work for this project."
              className="py-8"
            />
          ) : (
            <TicketTable
              tickets={tickets as Ticket[]}
              users={users}
              onViewTicket={(ticket) => {
                const ticketId = asTicketId(ticket.ticketId || ticket.id);
                navigate(PAGE_ROUTES.TICKETS.detail(ticketId));
              }}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={inviteMembers.isOpen}
        onClose={inviteMembers.closeModal}
        title="Invite Team Members"
        size="md"
        actions={
          <>
            <Button variant="outline" onClick={inviteMembers.closeModal}>
              Cancel
            </Button>
            <Button
              onClick={inviteMembers.handleInvite}
              disabled={
                inviteMembers.selectedMembers.length === 0 ||
                inviteMembers.isSubmitting
              }
            >
              {inviteMembers.isSubmitting ? 'Adding...' : 'Add Members'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Select developers or engineering leads to add to this project.
          </p>
          <MemberPicker
            value={inviteMembers.selectedMembers}
            options={inviteMembers.availableMembers}
            multiple
            onChange={(value) =>
              inviteMembers.setSelectedMembers(
                Array.isArray(value) ? value : [value]
              )
            }
            placeholder="Select team members..."
            groupBy="role"
            groups={[
              { key: UserRole.ENG_LEAD, label: 'Engineering Leads' },
              { key: UserRole.DEVELOPER, label: 'Developers' },
            ]}
          />
        </div>
      </Modal>

      <TicketDialog
        isOpen={showTicketDialog}
        onClose={() => setShowTicketDialog(false)}
        projectId={project?.id}
        onSuccess={refetchTickets}
      />
    </>
  );
}
