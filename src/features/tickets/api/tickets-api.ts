import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
} from '@artco-group/artco-ticketing-sync/constants';
import { queryClient } from '@/shared/lib/query-client';
import type { Ticket } from '@artco-group/artco-ticketing-sync/types';
import api from '@/shared/lib/api-client';

// Legacy API object for backward compatibility
export const ticketAPI = {
  getTickets: () => api.get(API_ROUTES.TICKETS.BASE),
  getTicket: (ticketId: string) => api.get(API_ROUTES.TICKETS.BY_ID(ticketId)),
  createTicket: (ticket: FormData) => api.post(API_ROUTES.TICKETS.BASE, ticket),
  updateTicket: (ticketId: string, ticket: FormData) =>
    api.put(API_ROUTES.TICKETS.BY_ID(ticketId), ticket),
  updateTicketStatus: (ticketId: string, status: string) =>
    api.patch(API_ROUTES.TICKETS.STATUS(ticketId), { status }),
  updateTicketAssignee: (ticketId: string, developerId: string) =>
    api.patch(API_ROUTES.TICKETS.ASSIGN(ticketId), { developerId }),
  updateTicketPriority: (ticketId: string, priority: string) =>
    api.patch(API_ROUTES.TICKETS.PRIORITY(ticketId), { priority }),
  deleteTicket: (ticketId: string) =>
    api.delete(API_ROUTES.TICKETS.BY_ID(ticketId)),
};

// New React Query hooks
// API might return array directly or object with tickets property
export function useTickets(params?: Record<string, unknown>) {
  return useApiQuery<Ticket[] | { tickets: Ticket[] }>(
    QueryKeys.tickets.list(params),
    {
      url: API_ROUTES.TICKETS.BASE,
      params,
      retry: false,
      staleTime: 0, // Always consider data stale to allow refetch
      // Query will be enabled by default, but can be disabled if needed
    }
  );
}

export function useTicket(id: string) {
  return useApiQuery<{ ticket: Ticket }>(QueryKeys.tickets.detail(id), {
    url: API_ROUTES.TICKETS.BY_ID(id),
    enabled: !!id,
  });
}

export function useCreateTicket() {
  return useApiMutation<{ ticket: Ticket }, FormData>({
    url: API_ROUTES.TICKETS.BASE,
    method: 'POST',
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onSuccess: async () => {
      // Invalidate all tickets queries - this marks them as stale
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.all(),
        exact: false,
      });

      // Force refetch all tickets list queries immediately
      // This ensures data is updated even if queries have staleTime
      await queryClient.refetchQueries({
        predicate: (query) => {
          const key = query.queryKey;
          return (
            Array.isArray(key) &&
            key.length >= 2 &&
            key[0] === 'tickets' &&
            key[1] === 'list'
          );
        },
      });
    },
  });
}

export function useUpdateTicketStatus() {
  return useApiMutation<{ ticket: Ticket }, { id: string; status: string }>({
    url: (vars) => API_ROUTES.TICKETS.STATUS(vars.id),
    method: 'PATCH',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      // Invalidate all tickets queries (including those with params)
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

export function useAssignTicket() {
  return useApiMutation<{ ticket: Ticket }, { id: string; assignedTo: string }>(
    {
      url: (vars) => API_ROUTES.TICKETS.ASSIGN(vars.id),
      method: 'PATCH',
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.tickets.detail(variables.id),
        });
        // Invalidate all tickets queries (including those with params)
        queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
      },
    }
  );
}

export function useUpdateTicketPriority() {
  return useApiMutation<{ ticket: Ticket }, { id: string; priority: string }>({
    url: (vars) => API_ROUTES.TICKETS.PRIORITY(vars.id),
    method: 'PATCH',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      // Invalidate all tickets queries (including those with params)
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

export function useDeleteTicket() {
  return useApiMutation<void, string>({
    url: (id) => API_ROUTES.TICKETS.BY_ID(id),
    method: 'DELETE',
    onSuccess: () => {
      // Invalidate all tickets queries (including those with params)
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}
