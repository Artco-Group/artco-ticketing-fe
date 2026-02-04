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

export function useTicketList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role;

  const [searchParams, setSearchParams] = useSearchParams();

  const isEngLead = userRole === UserRole.ENG_LEAD;
  const isDeveloper = userRole === UserRole.DEVELOPER;
  const isClient = userRole === UserRole.CLIENT;

  const activeTab = searchParams.get('tab') || 'active';

  const filters: Filters = useMemo(
    () => ({
      status: searchParams.get('status') || 'All',
      priority: searchParams.get('priority') || 'All',
      client: searchParams.get('client') || 'All',
      assignee: searchParams.get('assignee') || 'All',
      sortBy: searchParams.get('sortBy') || 'Created Date',
    }),
    [searchParams]
  );

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

  const { data: usersData } = useUsers();
  const users = usersData?.data?.users || [];

  const roleFilteredTickets = useMemo(() => {
    if (isDeveloper) {
      return allTickets.filter(
        (ticket) => getAssigneeEmail(ticket.assignedTo) === user?.email
      );
    }
    if (isClient) {
      return allTickets.filter((ticket) => ticket.clientEmail === user?.email);
    }
    return allTickets;
  }, [allTickets, isDeveloper, isClient, user?.email]);

  const tabFilteredTickets = useMemo(() => {
    if (activeTab === 'all') {
      return roleFilteredTickets;
    }
    if (activeTab === 'backlog') {
      return roleFilteredTickets.filter(
        (ticket) => ticket.status === 'New' || ticket.status === 'Open'
      );
    }
    return roleFilteredTickets.filter(
      (ticket) =>
        ticket.status === 'In Progress' ||
        ticket.status === 'Resolved' ||
        ticket.status === 'Closed'
    );
  }, [roleFilteredTickets, activeTab]);

  const filteredTickets = useMemo(() => {
    return sortTickets(
      filterTickets(tabFilteredTickets, filters, { isEngLead }),
      filters.sortBy
    );
  }, [tabFilteredTickets, filters, isEngLead]);

  const handleViewTicket = (ticket: Ticket) => {
    navigate(PAGE_ROUTES.TICKETS.detail(ticket._id || ''));
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    const params: Record<string, string> = {};
    if (activeTab !== 'active') {
      params.tab = activeTab;
    }
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== 'All' && !(key === 'sortBy' && val === 'Created Date')) {
        params[key] = val;
      }
    });
    setSearchParams(params);
  };

  const handleTabChange = (tabId: string) => {
    const params: Record<string, string> = {};
    if (tabId !== 'active') {
      params.tab = tabId;
    }
    setSearchParams(params);
  };

  const handleCreateTicket = () => {
    navigate(PAGE_ROUTES.TICKETS.CREATE);
  };

  return {
    tickets: filteredTickets,
    allTickets: isEngLead ? allTickets : undefined,
    users: isEngLead ? users : undefined,
    filters: !isClient ? filters : undefined,
    isLoading: ticketsLoading,
    error: ticketsError,
    ticketsData,
    refetch: refetchTickets,
    isRefetching: ticketsRefetching,
    activeTab,
    userRole: userRole as UserRole | undefined,
    isEngLead,
    isDeveloper,
    isClient,
    onViewTicket: handleViewTicket,
    onFilterChange: !isClient ? handleFilterChange : undefined,
    onCreateTicket: handleCreateTicket,
    onTabChange: handleTabChange,
  };
}
