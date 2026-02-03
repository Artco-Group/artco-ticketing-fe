import { useMemo } from 'react';
import { UserRole } from '@/types';

import { TicketList } from '@/features/tickets/components';
import { QueryStateWrapper, EmptyState, Button } from '@/shared/components/ui';
import {
  usePageHeader,
  usePageHeaderTabs,
  type Tab,
} from '@/shared/components/patterns';
import { useTicketList } from '../hooks';

const TICKET_TABS: Tab[] = [
  { id: 'active', label: 'Active', icon: 'tasks' },
  { id: 'backlog', label: 'Backlog', icon: 'backlog' },
  { id: 'all', label: 'All', icon: 'all' },
];

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
    activeTab,
    userRole,
    onViewTicket,
    onFilterChange,
    onCreateTicket,
    onTabChange,
  } = useTicketList();

  usePageHeader({ count: allTickets?.length });

  const tabBarActions = useMemo(
    () => (
      <>
        <Button variant="outline" leftIcon="download" rightIcon="chevron-down">
          Import / Export
        </Button>
        <Button
          leftIcon="plus"
          onClick={onCreateTicket}
          className="bg-greyscale-900 hover:bg-greyscale-800 text-white"
        >
          Create Task
        </Button>
      </>
    ),
    [onCreateTicket]
  );

  usePageHeaderTabs({
    tabs: TICKET_TABS,
    activeTab,
    onTabChange: onTabChange ?? (() => {}),
    actions: tabBarActions,
  });

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
