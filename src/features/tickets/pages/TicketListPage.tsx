import { UserRole } from '@/types';

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
    refetch,
    isRefetching,
    userRole,
    onViewTicket,
    onFilterChange,
    onCreateTicket,
  } = useTicketList();

  if (!userRole) {
    return (
      <EmptyState
        variant="error"
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
      errorTitle="Failed to load tickets"
      errorMessage="Failed to load tickets. Please try again later."
      onRetry={refetch}
      isRefetching={isRefetching}
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
