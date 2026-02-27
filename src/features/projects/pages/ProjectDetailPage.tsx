import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  ProjectPriority,
  ProjectPriorityTranslationKeys,
} from '@artco-group/artco-ticketing-sync';
import { type User, type Ticket, asProjectId, asTicketId } from '@/types';
import { useProject, useProjectTickets } from '../api/projects-api';
import { useUsers } from '@/features/users/api';
import {
  Button,
  EmptyState,
  AvatarGroup,
  RetryableError,
  SpinnerContainer,
  ProgressCircle,
  Badge,
} from '@/shared/components/ui';
import { InviteMembersModal } from '../components';
import { CompanyLogo } from '@/shared/components/composite/CompanyLogo/CompanyLogo';
import { PageHeader } from '@/shared/components/patterns/PageHeader/PageHeader';
import { PAGE_ROUTES } from '@/shared/constants';
import { getProjectPriorityIcon } from '../utils/project-helpers';
import { useAuth } from '@/features/auth/context';
import { useRoleFlags } from '@/shared/hooks/useRoleFlags';
import { useAppTranslation } from '@/shared/hooks';
import { TicketDialog, TicketTable } from '@/features/tickets/components';
import { useProjectInlineEdit, useInviteMembers } from '../hooks';
import { InlineDateEdit } from '@/shared/components/ui/InlineDateEdit';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { translate, language } = useAppTranslation('projects');
  const { isDeveloper, isTechnician, isProjectManager, isEngLead, isAdmin } =
    useRoleFlags(user?.role);

  const projectSlug = slug ? asProjectId(slug) : undefined;

  const { data, isLoading, error, refetch } = useProject(projectSlug);
  const {
    data: ticketsData,
    isLoading: ticketsLoading,
    refetch: refetchTickets,
  } = useProjectTickets(projectSlug);
  const { data: usersData } = useUsers();

  const [showTicketDialog, setShowTicketDialog] = useState(false);

  const project = data?.project;

  const isProjectPm = useMemo(() => {
    if (!isProjectManager || !project) return false;
    const pms = (project.projectManagers as User[] | undefined) || [];
    return pms.some((pm) => pm.id === user?.id);
  }, [isProjectManager, project, user?.id]);

  const projectInlineEdit = useProjectInlineEdit({
    projectId: projectSlug,
    canEdit: isEngLead || isProjectPm,
  });

  const canCreateTicket = !isDeveloper && !isTechnician;

  // Check if current user can invite members:
  // - ADMIN can always invite
  // - ENG_LEAD can only invite if they are a lead on this project
  const canInviteMembers = useMemo(() => {
    if (isAdmin) return true;
    if (isEngLead && project?.leads) {
      const leads = project.leads as User[];
      return leads.some((lead) => lead.id === user?.id);
    }
    if (isProjectPm) return true;
    return false;
  }, [isAdmin, isEngLead, isProjectPm, project?.leads, user?.id]);
  const tickets = ticketsData?.tickets || [];
  const users = usersData?.users || [];

  const currentTeamMembers = useMemo(() => {
    const leads = (project?.leads as User[] | undefined) || [];
    const pms = (project?.projectManagers as User[] | undefined) || [];
    const members = (project?.members as User[] | undefined) || [];
    return [...leads, ...pms, ...members];
  }, [project?.leads, project?.projectManagers, project?.members]);

  const inviteMembers = useInviteMembers({
    projectId: projectSlug,
    currentMembers: currentTeamMembers,
    allUsers: users,
  });

  if (isLoading) {
    return <SpinnerContainer message={translate('detail.loading')} />;
  }

  if (error || !project) {
    return (
      <RetryableError
        title={translate('detail.failedToLoad')}
        message={translate('detail.failedToLoadMessage')}
        onRetry={refetch}
      />
    );
  }

  const client = project.client as User;
  const leads = project.leads as User[];
  const projectManagers = project.projectManagers as User[] | undefined;
  const members = project.members as User[] | undefined;

  return (
    <>
      <div className="bg-card">
        <PageHeader
          breadcrumbs={[
            { label: translate('title'), href: PAGE_ROUTES.PROJECTS.LIST },
            { label: project.name },
          ]}
        />

        <div className="grid grid-cols-1 border-b lg:grid-cols-[1fr_18rem]">
          <div className="p-6 lg:border-r">
            <div className="flex items-start gap-4">
              <CompanyLogo
                src={client?.profilePic}
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
                    {ProjectPriorityTranslationKeys[
                      project.priority as ProjectPriority
                    ]
                      ? translate(
                          ProjectPriorityTranslationKeys[
                            project.priority as ProjectPriority
                          ]!
                        )
                      : project.priority}
                  </Badge>
                </div>
                {project.contractNumber && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {translate('detail.contractNumber')}:{' '}
                    {project.contractNumber}
                  </p>
                )}
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
              {translate('detail.progress')}
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {project.progress?.completedTickets ?? 0}
                </p>
                <p className="text-muted-foreground text-sm">
                  {translate('detail.ofTickets', {
                    count: project.progress?.totalTickets ?? 0,
                  })}
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
                {translate('detail.team')}
              </h3>
              {canInviteMembers && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={inviteMembers.openModal}
                  leftIcon="plus"
                >
                  {translate('detail.inviteMembers')}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <p className="text-muted-foreground mb-2 text-xs">
                  {translate('detail.engineeringLeads')}
                </p>
                {leads && leads.length > 0 ? (
                  <AvatarGroup
                    size="md"
                    max={4}
                    avatars={leads.map((lead) => ({
                      src: lead.profilePic,
                      fallback: lead.name || lead.email || '?',
                      tooltip: lead.name || lead.email,
                    }))}
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {translate('detail.noLeadsAssigned')}
                  </p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground mb-2 text-xs">
                  {translate('detail.projectManagers')}
                </p>
                {projectManagers && projectManagers.length > 0 ? (
                  <AvatarGroup
                    size="md"
                    max={4}
                    avatars={projectManagers.map((pm) => ({
                      src: pm.profilePic,
                      fallback: pm.name || pm.email || '?',
                      tooltip: pm.name || pm.email,
                    }))}
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {translate('detail.noPmsAssigned')}
                  </p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground mb-2 text-xs">
                  {translate('detail.developers')}
                </p>
                {members && members.length > 0 ? (
                  <AvatarGroup
                    size="md"
                    max={6}
                    avatars={members.map((member) => ({
                      src: member.profilePic,
                      fallback: member.name || member.email || '?',
                      tooltip: member.name || member.email,
                    }))}
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {translate('detail.noMembersYet')}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center border-t p-4 pr-10">
            <h3 className="text-muted-foreground mb-3 text-xs font-medium uppercase">
              {translate('detail.timeline')}
            </h3>
            <div className="space-y-2 text-sm">
              <InlineDateEdit
                label={translate('detail.startDate')}
                value={project.startDate}
                canEdit={projectInlineEdit.canEditDates}
                isLoading={projectInlineEdit.isDatesUpdating}
                onChange={projectInlineEdit.onStartDateChange}
                locale={language}
              />
              <InlineDateEdit
                label={translate('detail.dueDate')}
                value={project.dueDate}
                canEdit={projectInlineEdit.canEditDates}
                isLoading={projectInlineEdit.isDatesUpdating}
                onChange={projectInlineEdit.onDueDateChange}
                locale={language}
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {translate('detail.tickets')}
            </h3>
            {canCreateTicket && (
              <Button
                size="sm"
                onClick={() => setShowTicketDialog(true)}
                leftIcon="plus"
              >
                {translate('detail.createTicket')}
              </Button>
            )}
          </div>
          {ticketsLoading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                {translate('detail.loadingTickets')}
              </p>
            </div>
          ) : tickets.length === 0 ? (
            <EmptyState
              variant="no-data"
              title={translate('detail.noTicketsYet')}
              message={translate('detail.noTicketsMessage')}
              className="py-8"
            />
          ) : (
            <TicketTable
              tickets={tickets as Ticket[]}
              users={users}
              statusConfig={project.statusConfig}
              showProjectColumn={false}
              onViewTicket={(ticket) => {
                const ticketId = asTicketId(ticket.ticketId || ticket.id);
                navigate(PAGE_ROUTES.TICKETS.detail(ticketId));
              }}
            />
          )}
        </div>
      </div>

      <InviteMembersModal inviteMembers={inviteMembers} />

      <TicketDialog
        isOpen={showTicketDialog}
        onClose={() => setShowTicketDialog(false)}
        projectId={project?.id}
        onSuccess={refetchTickets}
      />
    </>
  );
}
