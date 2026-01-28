import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserRole, type Ticket, type Filters } from '@/types';

import { PAGE_ROUTES } from '@/shared/constants';
import { useAuth } from '@/features/auth/context';
import { useUsers } from '@/features/users/api';
import { useTickets } from '../api/tickets-api';
import {
  filterTickets,
  sortTickets,
  getAssigneeEmail,
} from '@/shared/utils/ticket-helpers';

/**
 * Custom hook for ticket list page logic.
 * Separates business logic from UI for better testability and maintainability.
 */
export function useTicketList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role;

  const [searchParams, setSearchParams] = useSearchParams();

  const isEngLead = userRole === UserRole.ENG_LEAD;
  const isDeveloper = userRole === UserRole.DEVELOPER;
  const isClient = userRole === UserRole.CLIENT;

  // Derive filters from URL params (role-specific defaults)
  const filters: Filters = useMemo(
    () => ({
      status: searchParams.get('status') || 'All',
      priority: searchParams.get('priority') || 'All',
      client: searchParams.get('client') || 'All',
      assignee: searchParams.get('assignee') || 'All',
      sortBy:
        searchParams.get('sortBy') || (isEngLead ? 'Status' : 'Created Date'),
    }),
    [searchParams, isEngLead]
  );

  // Fetch tickets
  const {
    data: ticketsData,
    isLoading: ticketsLoading,
    error: ticketsError,
    refetch: refetchTickets,
    isRefetching: ticketsRefetching,
  } = useTickets();

  const allTickets = useMemo(() => {
    if (Array.isArray(ticketsData)) {
      return ticketsData;
    }
    return ticketsData?.tickets || [];
  }, [ticketsData]);

  // Fetch users (only for EngLead)
  const { data: usersData } = useUsers();
  const users = usersData?.data?.users || [];

  // Filter tickets based on role
  const roleFilteredTickets = useMemo(() => {
    if (isDeveloper) {
      return allTickets.filter(
        (ticket) => getAssigneeEmail(ticket.assignedTo) === user?.email
      );
    }
    return allTickets;
  }, [allTickets, isDeveloper, user?.email]);

  // Filter and sort tickets using utility functions
  const filteredTickets = useMemo(() => {
    return sortTickets(
      filterTickets(roleFilteredTickets, filters, { isEngLead }),
      filters.sortBy
    );
  }, [roleFilteredTickets, filters, isEngLead]);

  const handleViewTicket = (ticket: Ticket) => {
    navigate(PAGE_ROUTES.TICKETS.detail(ticket._id || ''));
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };

    // Build query params (omit default values)
    const params: Record<string, string> = {};
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== 'All' && !(key === 'sortBy' && val === 'Created Date')) {
        params[key] = val;
      }
    });

    setSearchParams(params);
  };

  const handleCreateTicket = () => {
    navigate(PAGE_ROUTES.TICKETS.CREATE);
  };

  return {
    // Data
    tickets: filteredTickets,
    allTickets: isEngLead ? allTickets : undefined,
    users: isEngLead ? users : undefined,
    filters: !isClient ? filters : undefined,

    // State
    isLoading: ticketsLoading,
    error: ticketsError,
    ticketsData,
    refetch: refetchTickets,
    isRefetching: ticketsRefetching,

    // Role info
    userRole: userRole as UserRole | undefined,
    isEngLead,
    isDeveloper,
    isClient,

    // Handlers
    onViewTicket: handleViewTicket,
    onFilterChange: !isClient ? handleFilterChange : undefined,
    onCreateTicket: isClient ? handleCreateTicket : undefined,
  };
}
