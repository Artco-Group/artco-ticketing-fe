import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ProjectPriority } from '@artco-group/artco-ticketing-sync';
import { type User, type Ticket } from '@/types';
import {
  useProject,
  useProjectTickets,
  useAddProjectMembers,
} from '../api/projects-api';
import { useUsers } from '@/features/users/api';
import {
  Button,
  EmptyState,
  Icon,
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
import { useToast } from '@/shared/components/ui';
import { getErrorMessage } from '@/shared';
import {
  getProjectPriorityIcon,
  getProjectPriorityLabel,
} from '../utils/project-helpers';
import { useAuth } from '@/features/auth/context';
import { useRoleFlags } from '@/shared/hooks/useRoleFlags';
import { TicketDialog, TicketTable } from '@/features/tickets/components';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { isDeveloper } = useRoleFlags(user?.role);

  const { data, isLoading, error, refetch } = useProject(id || '');
  const {
    data: ticketsData,
    isLoading: ticketsLoading,
    refetch: refetchTickets,
  } = useProjectTickets(id || '');
  const { data: usersData } = useUsers();
  const addMembersMutation = useAddProjectMembers();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const canCreateTicket = !isDeveloper;

  const project = data?.data?.project;
  const tickets = ticketsData?.data?.tickets || [];
  const users = useMemo(
    () => usersData?.data?.users || [],
    [usersData?.data?.users]
  );

  const availableDevelopers = useMemo(() => {
    const currentMemberIds = new Set(
      (project?.members as User[] | undefined)?.map((m) => m._id || m.id) || []
    );
    return users.filter(
      (user) =>
        user.role === 'developer' && !currentMemberIds.has(user._id || user.id)
    );
  }, [users, project?.members]);

  const handleInviteMembers = async () => {
    if (!id || selectedMembers.length === 0) return;

    try {
      await addMembersMutation.mutateAsync({
        id,
        data: { memberIds: selectedMembers },
      });
      toast.success('Members added successfully');
      setShowInviteModal(false);
      setSelectedMembers([]);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

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

        <div className="flex flex-col border-b lg:flex-row">
          <div className="flex-1 lg:border-r">
            <div className="p-6">
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

            <div className="border-t">
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-muted-foreground text-xs font-medium uppercase">
                    Team
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInviteModal(true)}
                  >
                    <Icon name="plus" size="sm" className="mr-1" />
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
                    <p className="text-muted-foreground mb-2 text-xs">
                      Members
                    </p>
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
            </div>
          </div>

          <div className="shrink-0 border-t lg:w-72 lg:border-t-0">
            <div className="border-b">
              <div className="p-4">
                <h3 className="text-muted-foreground mb-3 text-xs font-medium uppercase">
                  Progress
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {project.progress?.completedTickets ?? 0}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      of {project.progress?.totalTickets ?? 0} tasks
                    </p>
                  </div>
                  <ProgressCircle
                    value={project.progress?.percentage ?? 0}
                    size="md"
                  />
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-muted-foreground mb-3 text-xs font-medium uppercase">
                Timeline
              </h3>
              <div className="space-y-2 text-sm">
                {project.startDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date</span>
                    <span>
                      {new Date(project.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {project.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date</span>
                    <span>
                      {new Date(project.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Tasks</h3>
            {canCreateTicket && (
              <Button size="sm" onClick={() => setShowTicketDialog(true)}>
                <Icon name="plus" size="sm" className="mr-1" />
                Add Task
              </Button>
            )}
          </div>
          {ticketsLoading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          ) : tickets.length === 0 ? (
            <EmptyState
              variant="no-data"
              title="No tasks yet"
              message="Create tasks to track work for this project."
              className="py-8"
            />
          ) : (
            <TicketTable
              tickets={tickets as Ticket[]}
              users={users}
              onViewTicket={(ticket) => {
                const ticketId = ticket._id || ticket.id;
                navigate(PAGE_ROUTES.TICKETS.detail(ticketId as string));
              }}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setSelectedMembers([]);
        }}
        title="Invite Team Members"
        maxWidth="md"
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowInviteModal(false);
                setSelectedMembers([]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInviteMembers}
              disabled={
                selectedMembers.length === 0 || addMembersMutation.isPending
              }
            >
              {addMembersMutation.isPending ? 'Adding...' : 'Add Members'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Select developers to add to this project.
          </p>
          <MemberPicker
            value={selectedMembers}
            options={availableDevelopers}
            multiple
            onChange={(value) =>
              setSelectedMembers(Array.isArray(value) ? value : [value])
            }
            placeholder="Select developers..."
          />
        </div>
      </Modal>

      {/* Ticket Dialog */}
      <TicketDialog
        isOpen={showTicketDialog}
        onClose={() => setShowTicketDialog(false)}
        projectId={id}
        onSuccess={refetchTickets}
      />
    </>
  );
}
