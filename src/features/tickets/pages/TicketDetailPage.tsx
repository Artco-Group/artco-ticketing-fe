import { QueryStateWrapper, EmptyState, Button } from '@/shared/components/ui';
import { TicketDetail } from '../components';
import { useTicketDetail } from '../hooks';

export default function TicketDetailPage() {
  const {
    ticket,
    currentUser,
    users,
    ticketLoading,
    ticketError,
    refetchTicket,
    ticketRefetching,
    onBack,
    onStatusUpdate,
    onPriorityUpdate,
    onAssignTicket,
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
      error={ticketError}
      data={ticket}
      loadingMessage="Loading ticket..."
      errorTitle="Failed to load ticket"
      errorMessage="We couldn't load this ticket. Please try again."
      onRetry={refetchTicket}
      isRefetching={ticketRefetching}
      emptyTitle="Ticket Not Found"
      emptyMessage="The ticket you're looking for doesn't exist or you don't have access to it."
      emptyAction={<Button onClick={onBack}>Back to Dashboard</Button>}
    >
      {(ticketData) => (
        <TicketDetail
          ticket={ticketData}
          currentUser={currentUser}
          users={users}
          onBack={onBack}
          onStatusUpdate={onStatusUpdate}
          onPriorityUpdate={onPriorityUpdate}
          onAssignTicket={onAssignTicket}
        />
      )}
    </QueryStateWrapper>
  );
}
