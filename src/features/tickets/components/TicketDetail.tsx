import type { FormEvent } from 'react';
import { useId } from 'react';
import {
  UserRole,
  asTicketId,
  type Ticket,
  type Comment,
  type User,
  type TicketId,
  type UserId,
} from '@/types';
import { Loader2 } from 'lucide-react';
import { Icon } from '@/shared/components/ui';
import CommentThread from './CommentThread';
import TicketDetails from './TicketDetails';
import { resolveAssigneeName } from '@/shared/utils/ticket-helpers';
import { useTicketDetailActions } from '../hooks/useTicketDetailActions';
import {
  useRoleFlags,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
} from '@/shared';

interface TicketDetailProps {
  ticket: Ticket | null;
  comments: Comment[];
  currentUser: User | null;
  users?: User[];
  onBack: () => void;
  onStatusUpdate?: (ticketId: TicketId, status: string) => Promise<void>;
  onPriorityUpdate?: (ticketId: TicketId, priority: string) => void;
  onAssignTicket?: (ticketId: TicketId, developerId: UserId) => void;
  newComment: string;
  onCommentChange: (value: string) => void;
  onAddComment: (e: FormEvent<HTMLFormElement>) => void;
}

function TicketDetail({
  ticket,
  comments,
  currentUser,
  users = [],
  onBack,
  onStatusUpdate,
  onPriorityUpdate,
  onAssignTicket,
  newComment,
  onCommentChange,
  onAddComment,
}: TicketDetailProps) {
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
            <nav className="text-muted-foreground mb-1 text-sm">
              <span
                className="hover:text-foreground cursor-pointer"
                onClick={onBack}
              >
                All Tickets
              </span>
              <span className="mx-2">&gt;</span>
              <span className="text-foreground">{ticket.title}</span>
            </nav>
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
                      value={selectedDeveloper}
                      onValueChange={setSelectedDeveloper}
                    >
                      <SelectTrigger id={assignedToId} className="flex-1">
                        <SelectValue placeholder="Select Developer" />
                      </SelectTrigger>
                      <SelectContent>
                        {developers.map((dev) => (
                          <SelectItem key={dev._id} value={dev._id || ''}>
                            {dev.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    value={ticket.priority}
                    onValueChange={(value) =>
                      onPriorityUpdate(asTicketId(ticket._id || ''), value)
                    }
                    disabled={
                      ticket.status !== 'Open' &&
                      ticket.status !== 'In Progress'
                    }
                  >
                    <SelectTrigger id={priorityId}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
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
        <CommentThread
          comments={comments}
          newComment={newComment}
          onCommentChange={onCommentChange}
          onSubmit={onAddComment}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}

export default TicketDetail;
