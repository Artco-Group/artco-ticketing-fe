import { QueryStateWrapper, EmptyState, Button } from '@/shared/components/ui';
import { TicketDetail } from '../components';
import { useTicketDetail } from '../hooks';

export default function TicketDetailPage() {
  const {
    ticket,
    comments,
    currentUser,
    users,
    ticketLoading,
    newComment,
    onBack,
    onStatusUpdate,
    onPriorityUpdate,
    onAssignTicket,
    onCommentChange,
    onAddComment,
  } = useTicketDetail();

  if (!currentUser?.role) {
    return (
      <EmptyState
        variant="error"
        title="Access Denied"
        message="You don't have permission to view this ticket."
      />
    );
  }

  return (
    <QueryStateWrapper
      isLoading={ticketLoading}
      error={null}
      data={ticket}
      loadingMessage="Loading ticket..."
      emptyTitle="Ticket Not Found"
      emptyMessage="The ticket you're looking for doesn't exist or you don't have access to it."
      emptyAction={<Button onClick={onBack}>Back to Dashboard</Button>}
    >
      {(ticketData) => (
        <TicketDetail
          ticket={ticketData}
          comments={comments}
          currentUser={currentUser}
          users={users}
          onBack={onBack}
          onStatusUpdate={onStatusUpdate}
          onPriorityUpdate={onPriorityUpdate}
          onAssignTicket={onAssignTicket}
          newComment={newComment}
          onCommentChange={onCommentChange}
          onAddComment={onAddComment}
        />
      )}
    </QueryStateWrapper>
  );
}
