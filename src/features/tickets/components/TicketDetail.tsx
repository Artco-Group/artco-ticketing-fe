import { useId } from 'react';
import {
  UserRole,
  asTicketId,
  asCommentId,
  type Ticket,
  type User,
  type TicketId,
  type UserId,
} from '@/types';
import { Loader2 } from 'lucide-react';
import { Icon } from '@/shared/components/ui';
import { Breadcrumbs } from '@/shared/components';
import { PAGE_ROUTES } from '@/shared/constants';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { useComments } from '../hooks/useComments';
import TicketDetails from './TicketDetails';
import { resolveAssigneeName } from '@/shared/utils/ticket-helpers';
import { useTicketDetailActions } from '../hooks/useTicketDetailActions';
import { cn } from '@/lib/utils';
import {
  useRoleFlags,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  Label,
} from '@/shared';

interface TicketDetailProps {
  ticket: Ticket | null;
  currentUser: User | null;
  users?: User[];
  onBack: () => void;
  onStatusUpdate?: (ticketId: TicketId, status: string) => Promise<void>;
  onPriorityUpdate?: (ticketId: TicketId, priority: string) => void;
  onAssignTicket?: (ticketId: TicketId, developerId: UserId) => void;
}

function TicketDetail({
  ticket,
  currentUser,
  users = [],
  onBack,
  onStatusUpdate,
  onPriorityUpdate,
  onAssignTicket,
}: TicketDetailProps) {
  // Add useComments hook
  const commentsHook = useComments({
    ticketId: ticket?._id ? asTicketId(ticket._id) : asTicketId(''),
    currentUserId: currentUser?._id || currentUser?.id || '',
  });

  // Wrapper for onDelete to handle type conversion
  const handleDeleteComment = (commentId: string) => {
    commentsHook.onDelete(asCommentId(commentId));
  };

  const {
    selectedDeveloper,
    setSelectedDeveloper,
    isUpdating,
    showSuccess,
    handleAssign,
    handleStatusAction,
    handleDownloadAttachment,
    handleDownloadScreenRecording,
  } = useTicketDetailActions({ ticket, onStatusUpdate, onAssignTicket });

  const { isEngLead, isDeveloper, isClient } = useRoleFlags(currentUser?.role);

  // Generate unique IDs for form controls
  const assignedToId = useId();
  const priorityId = useId();

  if (!ticket) return null;

  const developers = users.filter((user) => user.role === UserRole.DEVELOPER);

  // Client uses custom date format
  const formatDateTime = isClient
    ? (date: string | Date) => {
        if (!date) return '';
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    : undefined;

  // Back button text varies by role
  const backButtonText = isClient
    ? 'Nazad na Moje Tikete'
    : isDeveloper
      ? 'Back to Assigned Tickets'
      : 'All Tickets';

  return (
    <div className="p-6">
      {/* Page Header */}
      {isEngLead ? (
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <Icon name="arrow-left" size="md" />
          </Button>
          <div>
            <Breadcrumbs
              items={[
                { label: 'All Tickets', href: PAGE_ROUTES.TICKETS.LIST },
                { label: ticket.title, href: '#' },
              ]}
              className="mb-1"
            />
            <h1 className="text-foreground text-2xl font-bold">
              {ticket.title}
            </h1>
          </div>
        </div>
      ) : (
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <Icon name="arrow-left" size="md" className="mr-2" />
          {backButtonText}
        </Button>
      )}

      <div className="space-y-6">
        {/* Ticket Details */}
        <TicketDetails
          ticket={ticket}
          showClient={!isClient}
          showAssignedTo={isEngLead}
          onDownloadAttachment={handleDownloadAttachment}
          onDownloadScreenRecording={handleDownloadScreenRecording}
          formatDateTime={formatDateTime}
        />

        {/* Lead Controls - Only for Eng Lead */}
        {isEngLead && onAssignTicket && onPriorityUpdate && onStatusUpdate && (
          <Card>
            <CardHeader>
              <CardTitle>Lead Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid-responsive">
                {/* Assignment Section */}
                <div className="space-y-2">
                  <Label htmlFor={assignedToId}>Assigned To</Label>
                  <div className="flex-start-gap-3">
                    <Select
                      options={developers.map((dev) => ({
                        label: dev.name || '',
                        value: dev._id || '',
                      }))}
                      placeholder="Select Developer"
                      value={selectedDeveloper}
                      onChange={setSelectedDeveloper}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAssign}
                      disabled={
                        !selectedDeveloper ||
                        selectedDeveloper ===
                          (typeof ticket.assignedTo === 'string'
                            ? ticket.assignedTo
                            : ticket.assignedTo?._id || '')
                      }
                    >
                      Assign
                    </Button>
                  </div>
                  {ticket.assignedTo &&
                    typeof ticket.assignedTo !== 'string' && (
                      <p className="text-muted-xs">
                        Currently assigned to:{' '}
                        {resolveAssigneeName(ticket.assignedTo, users)}
                      </p>
                    )}
                </div>

                {/* Priority Update Section */}
                <div className="space-y-2">
                  <Label htmlFor={priorityId}>Update Priority</Label>
                  <Select
                    options={[
                      { label: 'Low', value: 'Low' },
                      { label: 'Medium', value: 'Medium' },
                      { label: 'High', value: 'High' },
                      { label: 'Critical', value: 'Critical' },
                    ]}
                    value={ticket.priority}
                    onChange={(value) =>
                      onPriorityUpdate(asTicketId(ticket._id || ''), value)
                    }
                    disabled={
                      ticket.status !== 'Open' &&
                      ticket.status !== 'In Progress'
                    }
                  />
                  {ticket.status !== 'Open' &&
                    ticket.status !== 'In Progress' && (
                      <p className="text-muted-xs">
                        Priority can only be updated for Open or In Progress
                        tickets
                      </p>
                    )}
                </div>

                {/* Close Ticket Section */}
                <div className="space-y-2">
                  <Label>Close Ticket</Label>
                  <Button
                    onClick={() => handleStatusAction('Closed')}
                    disabled={ticket.status !== 'Resolved' || isUpdating}
                    className="w-full"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Closing...
                      </>
                    ) : (
                      'Close Ticket'
                    )}
                  </Button>
                  {ticket.status !== 'Resolved' && (
                    <p className="text-muted-xs">
                      This button is only enabled when ticket status is
                      "Resolved"
                    </p>
                  )}
                  {showSuccess && (
                    <div className="alert-success mt-2">
                      <Icon
                        name="check-circle"
                        size="sm"
                        className="text-success-500"
                      />
                      <span className="text-success-500 text-xs font-medium">
                        Ticket closed successfully
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Developer Actions - Only for Developer */}
        {isDeveloper && onStatusUpdate && (
          <Card>
            <CardHeader>
              <CardTitle>Ticket Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleStatusAction('Resolved')}
                disabled={ticket.status !== 'In Progress' || isUpdating}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Mark as Resolved'
                )}
              </Button>

              {ticket.status !== 'In Progress' && (
                <p className="text-muted-xs">
                  This button is only enabled when ticket status is "In
                  Progress"
                </p>
              )}

              {showSuccess && (
                <div className="alert-success-lg">
                  <Icon
                    name="check-circle"
                    size="sm"
                    className="text-success-500"
                  />
                  <span className="text-success-500 text-sm font-medium">
                    Ticket marked as resolved successfully
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Comments Section - All roles */}
        <Card>
          <CardHeader>
            <CardTitle>Diskusija</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Comment List */}
            <CommentList
              comments={commentsHook.comments}
              groupedComments={commentsHook.groupedComments}
              currentUserId={commentsHook.currentUserId}
              onReply={commentsHook.onReply}
              onEdit={commentsHook.onEdit}
              onDelete={handleDeleteComment}
              getCommentTimeDisplay={commentsHook.getCommentTimeDisplay}
            />

            {/* Comment Form - handles both add/reply and edit modes */}
            <div className={cn(commentsHook.isEditing && 'border-t pt-4')}>
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
                      : 'Napišite komentar...'
                }
                initialValue={
                  commentsHook.isEditing
                    ? commentsHook.editingComment.text
                    : undefined
                }
                submitLabel={
                  commentsHook.isEditing
                    ? 'Sačuvaj'
                    : commentsHook.isReplying
                      ? 'Odgovori'
                      : 'Pošalji'
                }
                disabled={commentsHook.isSubmitting}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TicketDetail;
