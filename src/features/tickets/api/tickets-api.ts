import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import { QueryKeys } from '@/shared/lib/query-keys';
import { queryClient } from '@/shared/lib/query-client';
import type { Ticket } from '@/types';
import api from '@/shared/lib/api-client';

// Legacy API object for backward compatibility
export const ticketAPI = {
  getTickets: () => api.get('/tickets'),
  getTicket: (ticketId: string) => api.get(`/tickets/${ticketId}`),
  createTicket: (ticket: FormData) => api.post('/tickets', ticket),
  updateTicket: (ticketId: string, ticket: FormData) =>
    api.put(`/tickets/${ticketId}`, ticket),
  updateTicketStatus: (ticketId: string, status: string) =>
    api.patch(`/tickets/${ticketId}/status`, { status }),
  updateTicketAssignee: (ticketId: string, developerId: string) =>
    api.patch(`/tickets/${ticketId}/assign`, { developerId }),
  updateTicketPriority: (ticketId: string, priority: string) =>
    api.patch(`/tickets/${ticketId}/priority`, { priority }),
  deleteTicket: (ticketId: string) => api.delete(`/tickets/${ticketId}`),
};

// New React Query hooks
// API might return array directly or object with tickets property
export function useTickets(params?: Record<string, unknown>) {
  return useApiQuery<Ticket[] | { tickets: Ticket[] }>(
    QueryKeys.tickets.list(params),
    {
      url: '/tickets',
      params,
      retry: false,
      staleTime: 0, // Always consider data stale to allow refetch
      // Query will be enabled by default, but can be disabled if needed
    }
  );
}

export function useTicket(id: string) {
  return useApiQuery<{ ticket: Ticket }>(QueryKeys.tickets.detail(id), {
    url: `/tickets/${id}`,
    enabled: !!id,
  });
}

export function useCreateTicket() {
  return useApiMutation<{ ticket: Ticket }, FormData>({
    url: '/tickets',
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
    url: (vars) => `/tickets/${vars.id}/status`,
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
      url: (vars) => `/tickets/${vars.id}/assign`,
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
    url: (vars) => `/tickets/${vars.id}/priority`,
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
    url: (id) => `/tickets/${id}`,
    method: 'DELETE',
    onSuccess: () => {
      // Invalidate all tickets queries (including those with params)
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}
