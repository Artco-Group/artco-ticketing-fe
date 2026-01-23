import { UserRole } from '@artco-group/artco-ticketing-sync';

import { TicketList } from '@/features/tickets/components';
import { QueryStateWrapper, EmptyState } from '@/shared/components/ui';
import { useTicketList } from '../hooks';

export default function TicketListPage() {
  const {
    tickets,
    allTickets,
    users,
    filters,
    isLoading,
    error,
    ticketsData,
    userRole,
    onViewTicket,
    onFilterChange,
    onCreateTicket,
  } = useTicketList();

  if (!userRole) {
    return (
      <EmptyState
        title="Invalid Role"
        message="Your account has an invalid role. Please contact support."
      />
    );
  }

  return (
    <QueryStateWrapper
      isLoading={isLoading}
      error={error}
      data={ticketsData}
      loadingMessage="Loading tickets..."
      errorMessage="Failed to load tickets. Please try again later."
    >
      {() => (
        <TicketList
          tickets={tickets}
          allTickets={allTickets}
          users={users}
          filters={filters}
          userRole={userRole as UserRole}
          onViewTicket={onViewTicket}
          onFilterChange={onFilterChange}
          onCreateTicket={onCreateTicket}
        />
      )}
    </QueryStateWrapper>
  );
}
