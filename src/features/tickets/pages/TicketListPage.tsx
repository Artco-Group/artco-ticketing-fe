import { useMemo, useState } from 'react';
import { UserRole } from '@/types';

import { TicketList } from '@/features/tickets/components';
import { QueryStateWrapper, EmptyState, Button } from '@/shared/components/ui';
import {
  usePageHeader,
  usePageHeaderTabs,
  usePageHeaderFilters,
  type Tab,
  type ViewMode,
  type FilterGroup,
  type FilterPanelValues,
} from '@/shared/components/patterns';
import { Icon } from '@/shared/components/ui/Icon/Icon';
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

  usePageHeader({ count: tickets.length });

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

  const [viewMode, setViewMode] = useState<ViewMode>('list');

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

  // Sort options for the Sort button (cycles through Created Date, Title, Ticket ID, Client, Category, Priority, Status)
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
    // Apply filter panel selections to URL params (filterPanelValue is derived from URL)
    if (onFilterChange) {
      // Get all possible filter group keys
      const allGroupKeys = filterGroups.map((g) => g.key);

      // For each group, set the filter value or reset to 'All'
      for (const key of allGroupKeys) {
        const values = value[key];
        if (values && values.length > 0) {
          onFilterChange(key, values[0]);
        } else {
          // Group was removed or has no selections - reset to 'All'
          onFilterChange(key, 'All');
        }
      }
    }
  };

  usePageHeaderFilters({
    filters: filterBarFilters,
    onFilterChange: (filterId, value) => {
      if (onFilterChange) {
        onFilterChange(filterId, value ?? 'All');
      }
    },
    sortOptions,
    sortValue,
    onSortChange: (value) => {
      if (onFilterChange) {
        onFilterChange('sortBy', value ?? 'Created Date');
      }
    },
    filterGroups,
    filterPanelValue,
    onFilterPanelChange: handleFilterPanelChange,
    filterPanelSingleSelect: true,
    viewMode,
    onViewChange: setViewMode,
    showFilter: true,
    showAddButton: true,
    onAddClick: onCreateTicket,
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
          userRole={userRole as UserRole}
          onViewTicket={onViewTicket}
          onCreateTicket={onCreateTicket}
          viewMode={viewMode}
        />
      )}
    </QueryStateWrapper>
  );
}
