import {
  asTicketId,
  asCommentId,
  asUserId,
  type Ticket,
  type User,
  type TicketId,
  type UserId,
  UserRole,
} from '@/types';
import {
  TicketCategory,
  TicketStatus,
  TicketPriority,
} from '@artco-group/artco-ticketing-sync';
import {
  Badge,
  Avatar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/shared/components/ui';
import { CompanyLogo } from '@/shared/components/composite/CompanyLogo/CompanyLogo';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { useComments } from '../hooks/useComments';
import { SubtaskSection } from './SubtaskSection';
import {
  resolveAssigneeName,
  categoryBadgeConfig,
  getPriorityIcon,
  getPriorityLabel,
  getStatusIcon,
  getStatusLabel,
  statusBadgeConfig,
  priorityBadgeConfig,
} from '@/shared/utils/ticket-helpers';
import {
  useUpdateTicketStatus,
  useUpdateTicketPriority,
  useAssignTicket,
  useUpdateTicket,
} from '../api/tickets-api';
import { cn } from '@/lib/utils';
import { useRoleFlags, useToast } from '@/shared';

// Status options for dropdown
const STATUS_OPTIONS = Object.values(TicketStatus).map((status) => ({
  label: statusBadgeConfig[status]?.label || status,
  value: status,
}));

// Priority options for dropdown
const PRIORITY_OPTIONS = Object.values(TicketPriority).map((priority) => ({
  label: priorityBadgeConfig[priority]?.label || priority,
  value: priority,
}));

// Category options for dropdown
const CATEGORY_OPTIONS = Object.values(TicketCategory).map((category) => ({
  label: categoryBadgeConfig[category]?.label || category,
  value: category,
}));

interface TicketDetailProps {
  ticket: Ticket | null;
  currentUser: User | null;
  users?: User[];
  onBack: () => void;
  onStatusUpdate?: (ticketId: TicketId, status: string) => Promise<void>;
  onPriorityUpdate?: (ticketId: TicketId, priority: string) => void;
  onAssignTicket?: (ticketId: TicketId, developerId: UserId) => void;
}

function TicketDetail({ ticket, currentUser, users = [] }: TicketDetailProps) {
  const commentsHook = useComments({
    ticketId: ticket?._id ? asTicketId(ticket._id) : asTicketId(''),
    currentUserId: currentUser?._id || currentUser?.id || '',
  });

  const { isEngLead, isDeveloper, isClient } = useRoleFlags(currentUser?.role);
  const toast = useToast();

  // Inline edit mutations
  const updateStatus = useUpdateTicketStatus();
  const updatePriority = useUpdateTicketPriority();
  const assignTicket = useAssignTicket();
  const updateTicket = useUpdateTicket();

  // Permission flags for inline editing
  const canEditStatus = !isClient;
  const canEditPriority = isEngLead;
  const canEditAssignee = isEngLead;
  const canEditCategory = isEngLead;

  // Get developers for assignee picker
  const developerUsers = users.filter(
    (user) => user.role === UserRole.DEVELOPER
  );

  if (!ticket) return null;

  // Helpers
  const handleDeleteComment = (commentId: string) => {
    commentsHook.onDelete(asCommentId(commentId));
  };

  // Inline edit handlers
  const handleStatusChange = async (newStatus: string) => {
    if (!ticket._id) return;
    try {
      await updateStatus.mutateAsync({
        id: asTicketId(ticket._id),
        status: newStatus,
      });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!ticket._id) return;
    try {
      await updatePriority.mutateAsync({
        id: asTicketId(ticket._id),
        priority: newPriority,
      });
      toast.success('Priority updated');
    } catch {
      toast.error('Failed to update priority');
    }
  };

  const handleCategoryChange = async (newCategory: string) => {
    if (!ticket._id) return;
    try {
      await updateTicket.mutateAsync({
        id: asTicketId(ticket._id),
        data: { category: newCategory as TicketCategory },
      });
      toast.success('Category updated');
    } catch {
      toast.error('Failed to update category');
    }
  };

  const handleAssigneeChange = (userId: string | string[]) => {
    if (!ticket._id) return;
    const developerId = Array.isArray(userId) ? userId[0] : userId;
    if (!developerId) return;

    assignTicket.mutate(
      {
        id: asTicketId(ticket._id),
        developerId: asUserId(developerId),
      },
      {
        onSuccess: () => toast.success('Assignee updated'),
        onError: () => toast.error('Failed to update assignee'),
      }
    );
  };

  const formatDate = (date: string | Date) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get project name
  const getProjectName = () => {
    if (!ticket.project) return null;
    if (typeof ticket.project === 'string') return ticket.project;
    return (ticket.project as { name?: string })?.name || null;
  };

  const projectName = getProjectName();

  return (
    <div className="flex-1 overflow-auto">
      {/* Header Section */}
      <div className="border-b p-6">
        {/* Ticket ID */}
        <span className="text-muted-foreground text-sm">
          #{ticket.ticketId || ticket.id}
        </span>

        {/* Title */}
        <h1 className="mt-2 mb-6 text-2xl font-bold">{ticket.title}</h1>

        {/* Metadata */}
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          {/* Column 1: Status + Priority + Category */}
          <div className="space-y-3">
            <div className="flex h-8 items-center justify-start">
              {canEditStatus ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    disabled={updateStatus.isPending}
                  >
                    <button className="m-0 flex cursor-pointer items-center justify-start p-0 text-left transition-opacity hover:opacity-80">
                      <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                        Status
                      </span>
                      <Badge
                        icon={getStatusIcon(ticket.status as TicketStatus)}
                      >
                        {getStatusLabel(ticket.status as TicketStatus)}
                      </Badge>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {STATUS_OPTIONS.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        {getStatusIcon(option.value as TicketStatus)}
                        <span>{option.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                    Status
                  </span>
                  <Badge icon={getStatusIcon(ticket.status as TicketStatus)}>
                    {getStatusLabel(ticket.status as TicketStatus)}
                  </Badge>
                </>
              )}
            </div>

            <div className="flex h-8 items-center justify-start">
              {canEditPriority ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    disabled={updatePriority.isPending}
                  >
                    <button className="m-0 flex cursor-pointer items-center justify-start p-0 text-left transition-opacity hover:opacity-80">
                      <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                        Priority
                      </span>
                      <Badge
                        icon={getPriorityIcon(
                          ticket.priority as TicketPriority
                        )}
                      >
                        {getPriorityLabel(ticket.priority as TicketPriority)}
                      </Badge>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {PRIORITY_OPTIONS.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handlePriorityChange(option.value)}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        {getPriorityIcon(option.value as TicketPriority)}
                        <span>{option.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                    Priority
                  </span>
                  <Badge
                    icon={getPriorityIcon(ticket.priority as TicketPriority)}
                  >
                    {getPriorityLabel(ticket.priority as TicketPriority)}
                  </Badge>
                </>
              )}
            </div>

            <div className="flex h-8 items-center justify-start">
              {canEditCategory ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    disabled={updateTicket.isPending}
                  >
                    <button className="m-0 flex cursor-pointer items-center justify-start p-0 text-left transition-opacity hover:opacity-80">
                      <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                        Category
                      </span>
                      <Badge icon={<span className="text-xs">🏷️</span>}>
                        {categoryBadgeConfig[ticket.category as TicketCategory]
                          ?.label || ticket.category}
                      </Badge>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {CATEGORY_OPTIONS.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleCategoryChange(option.value)}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <span className="text-xs">🏷️</span>
                        <span>{option.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                    Category
                  </span>
                  <Badge icon={<span className="text-xs">🏷️</span>}>
                    {categoryBadgeConfig[ticket.category as TicketCategory]
                      ?.label || ticket.category}
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* Column 2: Assignee + Eng Lead + Project */}
          <div className="space-y-3">
            <div className="flex h-8 items-center justify-start">
              {canEditAssignee ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    disabled={assignTicket.isPending}
                  >
                    <button className="m-0 flex cursor-pointer items-center justify-start p-0 text-left transition-opacity hover:opacity-80">
                      <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                        Assignee
                      </span>
                      {ticket.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar
                            size="sm"
                            fallback={resolveAssigneeName(
                              ticket.assignedTo,
                              users
                            )}
                          />
                          <span className="text-sm">
                            {resolveAssigneeName(ticket.assignedTo, users)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-orange-600">
                          Unassigned
                        </span>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {developerUsers.map((dev) => (
                      <DropdownMenuItem
                        key={dev._id || dev.id}
                        onClick={() =>
                          handleAssigneeChange(dev._id || dev.id || '')
                        }
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <Avatar
                          size="sm"
                          fallback={dev.name || dev.email || ''}
                        />
                        <span>{dev.name || dev.email}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                    Assignee
                  </span>
                  {ticket.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="sm"
                        fallback={resolveAssigneeName(ticket.assignedTo, users)}
                      />
                      <span className="text-sm">
                        {resolveAssigneeName(ticket.assignedTo, users)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-orange-600">Unassigned</span>
                  )}
                </>
              )}
            </div>

            <div className="flex h-8 items-center justify-start">
              <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                Eng Lead
              </span>
              {(() => {
                const engLead = users.find((u) => u.role === UserRole.ENG_LEAD);
                return engLead ? (
                  <div className="flex items-center gap-2">
                    <Avatar
                      size="sm"
                      fallback={engLead.name || engLead.email || ''}
                    />
                    <span className="text-sm">{engLead.name || '-'}</span>
                  </div>
                ) : (
                  <span className="text-sm">-</span>
                );
              })()}
            </div>

            <div className="flex h-8 items-center justify-start">
              <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                Project
              </span>
              {projectName ? (
                <div className="flex items-center gap-2">
                  <CompanyLogo
                    alt={projectName}
                    fallback={projectName}
                    size="xs"
                    variant="rounded"
                  />
                  <span className="text-sm">{projectName}</span>
                </div>
              ) : (
                <span className="text-sm">-</span>
              )}
            </div>
          </div>

          {/* Column 3: Dates */}
          <div className="space-y-3">
            <div className="flex h-8 items-center justify-start">
              <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                Start Date
              </span>
              <span className="text-sm">
                {ticket.startDate ? formatDate(ticket.startDate) : '-'}
              </span>
            </div>

            <div className="flex h-8 items-center justify-start">
              <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                Due Date
              </span>
              <span className="text-sm">
                {ticket.dueDate ? formatDate(ticket.dueDate) : '-'}
              </span>
            </div>

            <div className="flex h-8 items-center justify-start">
              <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                Created
              </span>
              <span className="text-sm">
                {ticket.createdAt ? formatDate(ticket.createdAt) : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description + Actions Section */}
      <div className="border-b p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left: Description */}
          <div className="flex-1">
            {ticket.description ? (
              <>
                <h2 className="text-muted-foreground mb-3 text-sm font-medium uppercase">
                  Description
                </h2>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">No description</p>
            )}
          </div>
        </div>
      </div>

      {/* Subtasks */}
      <div className="border-b p-6">
        <SubtaskSection
          ticketId={asTicketId(ticket._id || '')}
          canEdit={isEngLead || isDeveloper}
        />
      </div>

      {/* Comments Section */}
      <div className="p-6">
        <h3 className="text-muted-foreground mb-4 text-sm font-medium uppercase">
          Discussion
        </h3>
        <CommentList
          comments={commentsHook.comments}
          groupedComments={commentsHook.groupedComments}
          currentUserId={commentsHook.currentUserId}
          onReply={commentsHook.onReply}
          onEdit={commentsHook.onEdit}
          onDelete={handleDeleteComment}
          getCommentTimeDisplay={commentsHook.getCommentTimeDisplay}
        />
        <div className={cn(commentsHook.isEditing && 'mt-4 border-t pt-4')}>
          {commentsHook.isEditing && (
            <p className="text-muted-foreground mb-2 text-sm">
              Editing comment
            </p>
          )}
          <CommentForm
            onSubmit={commentsHook.onSubmit}
            onCancel={
              commentsHook.isEditing
                ? commentsHook.onCancelEdit
                : commentsHook.isReplying
                  ? commentsHook.onCancelReply
                  : undefined
            }
            placeholder={
              commentsHook.isEditing
                ? undefined
                : commentsHook.isReplying && commentsHook.replyingToComment
                  ? `Reply to ${commentsHook.replyingToComment.authorId?.name || 'Unknown'}`
                  : 'Add Comment...'
            }
            initialValue={
              commentsHook.isEditing
                ? commentsHook.editingComment.text
                : undefined
            }
            submitLabel={
              commentsHook.isEditing
                ? 'Save'
                : commentsHook.isReplying
                  ? 'Reply'
                  : 'Send'
            }
            disabled={commentsHook.isSubmitting}
            isLoading={commentsHook.isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;
