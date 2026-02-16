import { QueryStateWrapper, EmptyState, Button } from '@/shared/components/ui';
import { PageHeader } from '@/shared/components';
import { PAGE_ROUTES } from '@/shared/constants';
import { useRoleFlags } from '@/shared';
import { TicketDetail, TicketDialog } from '../components';
import { useTicketDetail } from '../hooks';

export default function TicketDetailPage() {
  const {
    ticket,
    currentUser,
    users,
    projects,
    ticketLoading,
    ticketError,
    refetchTicket,
    ticketRefetching,
    isEditModalOpen,
    onOpenEditModal,
    onCloseEditModal,
    onBack,
    onStatusUpdate,
    onPriorityUpdate,
    onAssignTicket,
  } = useTicketDetail();

  const { isEngLead, isAdmin } = useRoleFlags(currentUser?.role);

  const canEditTicket = isEngLead || isAdmin;

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
    <div className="bg-background flex min-h-full flex-col">
      <PageHeader
        breadcrumbs={
          ticket
            ? [
                { label: 'All Tickets', href: PAGE_ROUTES.TICKETS.LIST },
                { label: ticket.title || `#${ticket.ticketId}`, href: '#' },
              ]
            : undefined
        }
      />

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
            projects={projects}
            onBack={onBack}
            onStatusUpdate={onStatusUpdate}
            onPriorityUpdate={onPriorityUpdate}
            onAssignTicket={onAssignTicket}
            onEdit={onOpenEditModal}
          />
        )}
      </QueryStateWrapper>

      {canEditTicket && ticket && (
        <TicketDialog
          isOpen={isEditModalOpen}
          onClose={onCloseEditModal}
          ticket={ticket}
          onSuccess={refetchTicket}
        />
      )}
    </div>
  );
}
