import { useMemo, useState } from 'react';
import { UserRole } from '@/types';

import { TicketCard, TicketTable } from '@/features/tickets/components';
import {
  EmptyState,
  Button,
  RetryableError,
  Icon,
} from '@/shared/components/ui';
import type {
  Tab,
  ViewMode,
  FilterGroup,
  FilterPanelValues,
} from '@/shared/components/patterns';
import { useRoleFlags } from '@/shared';
import { useTicketList } from '../hooks';
import { ListPageLayout } from '@/shared/components/layout/ListPageLayout';

const TICKET_TABS: Tab[] = [
  { id: 'active', label: 'Active', icon: 'tasks' },
  { id: 'backlog', label: 'Backlog', icon: 'backlog' },
  { id: 'all', label: 'All', icon: 'all' },
];

export default function TicketListPage() {
  const {
    tickets,
    allTickets,
    users = [],
    filters,
    isLoading,
    error,
    ticketsData,
    refetch,
    activeTab,
    userRole,
    onViewTicket,
    onFilterChange,
    onCreateTicket,
    onTabChange,
  } = useTicketList();

  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const { isClient } = useRoleFlags(userRole as UserRole);

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

  // Initialize filterPanelValue from URL params so selected filters are displayed
  const filterPanelValue = useMemo<FilterPanelValues>(() => {
    const value: FilterPanelValues = {};
    if (filters?.client && filters.client !== 'All') {
      value.client = [filters.client];
    }
    if (filters?.assignee && filters.assignee !== 'All') {
      value.assignee = [filters.assignee];
    }
    return value;
  }, [filters]);

  // Sort options for the Sort button
  const sortOptions = useMemo(
    () => ['Title', 'Ticket ID', 'Client', 'Category', 'Priority', 'Status'],
    []
  );
  const sortValue =
    filters?.sortBy === 'Created Date' ? null : (filters?.sortBy ?? null);

  // Filter buttons (Priority, Status, Group by, Favorite)
  const filterBarFilters = useMemo(
    () => [
      {
        id: 'priority',
        label: 'Priority',
        icon: 'priority' as const,
        options: ['Low', 'Medium', 'High', 'Critical'],
        value: filters?.priority === 'All' ? null : filters?.priority,
      },
      {
        id: 'status',
        label: 'Status',
        icon: 'todo' as const,
        options: ['New', 'Open', 'In Progress', 'Resolved', 'Closed'],
        value: filters?.status === 'All' ? null : filters?.status,
      },
      { id: 'groupBy', label: 'Group by', icon: 'group-by' as const },
      { id: 'favorite', label: 'Favorite', icon: 'star' as const },
    ],
    [filters?.priority, filters?.status]
  );

  // Get unique clients and assignees for filter dropdown
  const clientOptions = useMemo(() => {
    if (!allTickets) return [];
    const clients = new Set<string>();
    allTickets.forEach((ticket) => {
      if (ticket.clientEmail) {
        clients.add(ticket.clientEmail);
      }
    });
    return Array.from(clients).map((email) => ({
      value: email,
      label: email,
    }));
  }, [allTickets]);

  const assigneeOptions = useMemo(() => {
    if (!users) return [];
    return users
      .filter((user) => user.email)
      .map((user) => ({
        value: user.email as string,
        label: user.name || user.email || '',
      }));
  }, [users]);

  // Filter groups for the Filter dropdown panel (Client and Assignee)
  const filterGroups: FilterGroup[] = useMemo(
    () => [
      {
        key: 'client',
        label: 'Client',
        icon: <Icon name="user" size="sm" />,
        options: clientOptions,
        searchable: true,
      },
      {
        key: 'assignee',
        label: 'Assignee',
        icon: <Icon name="user" size="sm" />,
        options: assigneeOptions,
        searchable: true,
      },
    ],
    [clientOptions, assigneeOptions]
  );

  const handleFilterPanelChange = (value: FilterPanelValues) => {
    if (onFilterChange) {
      const allGroupKeys = filterGroups.map((g) => g.key);
      for (const key of allGroupKeys) {
        const values = value[key];
        if (values && values.length > 0) {
          onFilterChange(key, values[0]);
        } else {
          onFilterChange(key, 'All');
        }
      }
    }
  };

  const handleFilterBarChange = (filterId: string, value: string | null) => {
    if (onFilterChange) {
      onFilterChange(filterId, value ?? 'All');
    }
  };

  const handleSortChange = (value: string | null) => {
    if (onFilterChange) {
      onFilterChange('sortBy', value ?? 'Created Date');
    }
  };

  if (!userRole) {
    return (
      <EmptyState
        variant="error"
        title="Invalid Role"
        message="Your account has an invalid role. Please contact support."
      />
    );
  }

  // Determine if we should show card layout (client always, or grid mode for eng/dev)
  const showCards = isClient || viewMode === 'grid';

  const renderContent = () => {
    if (error) {
      return (
        <RetryableError
          title="Failed to load tickets"
          message="Failed to load tickets. Please try again later."
          onRetry={refetch}
        />
      );
    }

    if (!ticketsData || tickets.length === 0) {
      return (
        <EmptyState
          variant="no-tickets"
          title="No tasks found"
          message="No tasks match your current filters."
        />
      );
    }

    if (showCards) {
      return (
        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket._id || ticket.id}
                ticket={ticket}
                onClick={onViewTicket}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <TicketTable
        tickets={tickets}
        users={users}
        onViewTicket={onViewTicket}
      />
    );
  };

  return (
    <ListPageLayout
      title="Tasks"
      count={tickets.length}
      tabs={TICKET_TABS}
      activeTab={activeTab}
      onTabChange={onTabChange ?? (() => {})}
      tabActions={tabBarActions}
      filters={filterBarFilters}
      onFilterChange={handleFilterBarChange}
      sortOptions={sortOptions}
      sortValue={sortValue}
      onSortChange={handleSortChange}
      filterGroups={filterGroups}
      filterPanelValue={filterPanelValue}
      onFilterPanelChange={handleFilterPanelChange}
      filterPanelSingleSelect
      viewMode={viewMode}
      onViewChange={setViewMode}
      showFilter
      loading={isLoading}
      loadingMessage="Loading tickets..."
    >
      {renderContent()}
    </ListPageLayout>
  );
}
