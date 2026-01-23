import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
  CACHE,
  type Ticket,
} from '@artco-group/artco-ticketing-sync';
import { queryClient } from '@/shared/lib/query-client';

/** API response wrapper type */
interface ApiResponse<T> {
  status: string;
  data: T;
}

/**
 * Get all tickets
 * Uses SHORT_STALE_TIME for frequently changing list data
 */
function useTickets(params?: Record<string, unknown>) {
  return useApiQuery<Ticket[] | { tickets: Ticket[] }>(
    QueryKeys.tickets.list(params),
    {
      url: API_ROUTES.TICKETS.BASE,
      params,
      staleTime: CACHE.SHORT_STALE_TIME,
    }
  );
}

/**
 * Get single ticket by ID
 * Uses STALE_TIME for individual records
 */
function useTicket(id: string) {
  return useApiQuery<ApiResponse<{ ticket: Ticket }>>(
    QueryKeys.tickets.detail(id),
    {
      url: API_ROUTES.TICKETS.BY_ID(id),
      enabled: !!id,
      staleTime: CACHE.STALE_TIME,
    }
  );
}

/**
 * Create a new ticket
 */
function useCreateTicket() {
  return useApiMutation<ApiResponse<{ ticket: Ticket }>, FormData>({
    url: API_ROUTES.TICKETS.BASE,
    method: 'POST',
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onSuccess: async () => {
      // Invalidate all tickets queries
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.all(),
        exact: false,
      });
    },
  });
}

/**
 * Update ticket status
 */
function useUpdateTicketStatus() {
  return useApiMutation<
    ApiResponse<{ ticket: Ticket }>,
    { id: string; status: string }
  >({
    url: (vars) => API_ROUTES.TICKETS.STATUS(vars.id),
    method: 'PATCH',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

/**
 * Assign ticket to developer
 */
function useAssignTicket() {
  return useApiMutation<
    ApiResponse<{ ticket: Ticket }>,
    { id: string; developerId: string }
  >({
    url: (vars) => API_ROUTES.TICKETS.ASSIGN(vars.id),
    method: 'PATCH',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

/**
 * Update ticket priority
 */
function useUpdateTicketPriority() {
  return useApiMutation<
    ApiResponse<{ ticket: Ticket }>,
    { id: string; priority: string }
  >({
    url: (vars) => API_ROUTES.TICKETS.PRIORITY(vars.id),
    method: 'PATCH',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

/**
 * Delete a ticket
 */
function useDeleteTicket() {
  return useApiMutation<void, string>({
    url: (id) => API_ROUTES.TICKETS.BY_ID(id),
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

/**
 * Namespaced API export (FMROI pattern)
 */
export const ticketsApi = {
  useTickets,
  useTicket,
  useCreateTicket,
  useUpdateTicketStatus,
  useAssignTicket,
  useUpdateTicketPriority,
  useDeleteTicket,
  keys: QueryKeys.tickets,
};

// Individual exports for backwards compatibility
export {
  useTickets,
  useTicket,
  useCreateTicket,
  useUpdateTicketStatus,
  useAssignTicket,
  useUpdateTicketPriority,
  useDeleteTicket,
};
