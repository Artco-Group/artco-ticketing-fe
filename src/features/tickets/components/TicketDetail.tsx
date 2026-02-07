import {
  asTicketId,
  type Ticket,
  type User,
  type TicketId,
  type UserId,
  UserRole,
} from '@/types';
import { formatDateLocalized } from '@artco-group/artco-ticketing-sync';
import { Avatar } from '@/shared/components/ui';
import { CompanyLogo } from '@/shared/components/composite/CompanyLogo/CompanyLogo';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { useComments } from '../hooks/useComments';
import { useTicketInlineEdit } from '../hooks/useTicketInlineEdit';
import { SubtaskSection } from './SubtaskSection';
import {
  StatusEdit,
  PriorityEdit,
  CategoryEdit,
  AssigneeEdit,
} from './TicketInlineEdit';
import { cn } from '@/lib/utils';
import { useRoleFlags } from '@/shared';

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

  // Inline edit hook
  const inlineEdit = useTicketInlineEdit({
    ticket,
    users,
    isClient,
    isEngLead,
  });

  if (!ticket) return null;

  const projectName = ticket.project?.name;

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

          {/* Column 2: Assignee + Eng Lead + Project */}
          <div className="space-y-3">
            <AssigneeEdit
              value={ticket.assignedTo}
              users={users}
              developerUsers={inlineEdit.developerUsers}
              canEdit={inlineEdit.canEditAssignee}
              isLoading={inlineEdit.isAssigneeUpdating}
              onChange={inlineEdit.onAssigneeChange}
            />

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
                {ticket.startDate ? formatDateLocalized(ticket.startDate) : '-'}
              </span>
            </div>

            <div className="flex h-8 items-center justify-start">
              <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                Due Date
              </span>
              <span className="text-sm">
                {ticket.dueDate ? formatDateLocalized(ticket.dueDate) : '-'}
              </span>
            </div>

            <div className="flex h-8 items-center justify-start">
              <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
                Created
              </span>
              <span className="text-sm">
                {ticket.createdAt ? formatDateLocalized(ticket.createdAt) : '-'}
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
          onDelete={commentsHook.onDelete}
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
